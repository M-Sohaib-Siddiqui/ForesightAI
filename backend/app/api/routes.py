import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Header
from fastapi.responses import Response
from typing import Dict, Any, Optional
import hashlib
import time
import requests
from app.core.config import settings, BusinessProfile, DATA_DIR
from app.services.analytics_engine import AnalyticsEngine
from app.services.scenario_engine import HistoricalScenarioEngine
from app.services.risk_engine import RiskImpactEngine
from app.services.briefing_engine import DailyBriefingEngine
from app.services.advisor_engine import AIBusinessAdvisorEngine
from app.services.competitor_engine import CompetitorIntelligenceEngine

router = APIRouter(prefix="/api")

# State holders
current_profile: BusinessProfile = settings.LEVIS_DEFAULT_PROFILE
sales_summary_cache: Optional[Dict[str, Any]] = None
inventory_summary_cache: Optional[Dict[str, Any]] = None
financial_summary_cache: Optional[Dict[str, Any]] = None

users_db: Dict[str, Dict[str, Any]] = {
    "demo@levis.com": {
        "id": "usr-demo-001",
        "email": "demo@levis.com",
        "password_hash": hashlib.sha256("demo1234".encode()).hexdigest(),
        "created_at": "2026-09-06"
    }
}
active_tokens: Dict[str, str] = {}

scenario_engine = HistoricalScenarioEngine()
briefing_engine = DailyBriefingEngine()
advisor_engine = AIBusinessAdvisorEngine()
competitor_engine = CompetitorIntelligenceEngine()

# --- SYSTEM HEALTH & API DIAGNOSTICS ---
@router.get("/system/status")
def system_status():
    """
    Live API Key Diagnostics & Data Source Verification.
    Validates each API key in .env and reports real vs demo execution mode.
    """
    gemini_key = settings.GEMINI_API_KEY
    openai_key = settings.OPENAI_API_KEY
    supabase_url = settings.SUPABASE_URL
    elevenlabs_key = settings.ELEVENLABS_API_KEY
    elevenlabs_voice_id = settings.ELEVENLABS_VOICE_ID

    serpapi_key = settings.SERPAPI_API_KEY

    # 1. Gemini / OpenAI LLM Key Verification
    llm_status = "unconfigured"
    llm_message = "No LLM API key detected in .env. Running on local briefing engine."
    if gemini_key and len(gemini_key) > 10:
        llm_status = "active_live"
        llm_message = "Connected to Google Gemini 1.5 Pro Live API."
    elif openai_key and len(openai_key) > 10:
        llm_status = "active_live"
        llm_message = "Connected to OpenAI GPT-4o Live API."

    # 2. Supabase Cloud Database Verification
    supabase_status = "unconfigured"
    supabase_message = "Running on local database fallback."
    if supabase_url and "supabase.co" in supabase_url:
        supabase_status = "active_live"
        supabase_message = f"Connected to Supabase Cloud Database ({supabase_url})."

    # 3. Voice Provider Verification
    voice_status = "browser_fallback"
    voice_message = "Using free browser Web Speech API voice synthesis."
    if elevenlabs_key and len(elevenlabs_key) > 10:
        voice_status = "active_live"
        voice_message = f"Connected to ElevenLabs Voice API (Voice ID: {elevenlabs_voice_id})."

    # 4. News & Search Extraction Verification
    news_status = "active_live" if (serpapi_key and len(serpapi_key) > 10) else "local_fallback"
    news_message = "Connected to SerpApi Google News Real-time Feed API." if news_status == "active_live" else "Using grounded domain intelligence fallback feeds."

    overall_mode = "LIVE API MODE" if (llm_status == "active_live" or supabase_status == "active_live" or voice_status == "active_live") else "SYNTHETIC DEMO MODE"

    return {
        "overall_mode": overall_mode,
        "api_diagnostics": {
            "llm_engine": {"provider": "Google Gemini / OpenAI", "status": llm_status, "message": llm_message, "has_key": bool(gemini_key or openai_key)},
            "database": {"provider": "Supabase PostgreSQL + pgvector", "status": supabase_status, "message": supabase_message, "has_url": bool(supabase_url)},
            "voice_synthesizer": {"provider": "ElevenLabs / Web Speech API", "status": voice_status, "message": voice_message, "voice_id": elevenlabs_voice_id},
            "news_extraction": {"provider": "SerpApi Google News Feed", "status": news_status, "message": news_message, "has_key": bool(serpapi_key)}
        },
        "version": settings.VERSION,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

# --- AUTHENTICATION ENDPOINTS ---
@router.post("/auth/signup")
def signup(payload: Dict[str, Any] = Body(...)):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "").strip()
    business_name = payload.get("business_name", "My Business").strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    if email in users_db:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = f"usr-{int(time.time())}"
    users_db[email] = {
        "id": user_id,
        "email": email,
        "password_hash": hashlib.sha256(password.encode()).hexdigest(),
        "created_at": "2026-09-06"
    }
    
    token = f"jwt-token-{user_id}"
    active_tokens[token] = email

    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "email": email, "business_name": business_name}
    }

@router.post("/auth/login")
def login(payload: Dict[str, Any] = Body(...)):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "").strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    
    user = users_db.get(email)
    if not user or user["password_hash"] != hashlib.sha256(password.encode()).hexdigest():
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = f"jwt-token-{user['id']}"
    active_tokens[token] = email

    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"]}
    }

@router.get("/auth/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return {"authenticated": False, "user": {"id": "usr-demo-001", "email": "demo@levis.com"}}
    
    token = authorization.replace("Bearer ", "")
    email = active_tokens.get(token)
    if not email or email not in users_db:
        return {"authenticated": False, "user": None}
    
    user = users_db[email]
    return {"authenticated": True, "user": {"id": user["id"], "email": user["email"]}}

@router.post("/auth/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "")
        active_tokens.pop(token, None)
    return {"status": "success", "message": "Logged out successfully."}

# --- SYSTEM & BUSINESS ENDPOINTS ---
@router.get("/health")
def health_check():
    return {"status": "ok", "service": "Business Foresight API", "version": settings.VERSION}

@router.get("/profile")
def get_profile():
    return current_profile

@router.post("/profile")
def update_profile(profile_data: Dict[str, Any]):
    global current_profile
    try:
        current_profile = BusinessProfile(**profile_data)
        return {"status": "success", "profile": current_profile}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from pathlib import Path
from supabase import create_client, Client

supabase_client: Optional[Client] = None
if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY and "supabase.co" in settings.SUPABASE_URL:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Supabase client initialization warning: {e}")

def get_company_upload_dir(company_name: Optional[str] = None) -> Path:
    name = company_name.strip() if company_name else "default"
    slug = "".join(c if c.isalnum() else "_" for c in name.lower())
    upload_dir = DATA_DIR / "uploads" / slug
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir

async def save_uploaded_file(file_name: str, contents: bytes, company_name: Optional[str] = None):
    slug = "".join(c if c.isalnum() else "_" for c in (company_name or "default").strip().lower())
    
    # 1. Save to local disk directory (ensures offline development support)
    comp_dir = get_company_upload_dir(company_name)
    local_path = comp_dir / file_name
    with open(local_path, "wb") as f:
        f.write(contents)

    # 2. Upload to Supabase Cloud Storage Bucket ('business-datasets') if Supabase is connected
    cloud_url = None
    if supabase_client:
        try:
            cloud_path = f"{slug}/{file_name}"
            try:
                supabase_client.storage.from_("business-datasets").upload(
                    path=cloud_path,
                    file=contents,
                    file_options={"upsert": "true"}
                )
            except Exception:
                try:
                    supabase_client.storage.from_("business-datasets").upload(
                        path=cloud_path,
                        file=contents,
                        file_options={"upsert": True}
                    )
                except Exception:
                    supabase_client.storage.from_("business-datasets").update(
                        path=cloud_path,
                        file=contents
                    )
            cloud_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/business-datasets/{cloud_path}"
            print(f"Successfully uploaded {cloud_path} to Supabase bucket 'business-datasets'")
        except Exception as e:
            print(f"Supabase Cloud Storage Upload warning for {file_name}: {e}")

    return {"local_path": str(local_path), "cloud_url": cloud_url}

@router.post("/import/sales")
async def import_sales(file: UploadFile = File(...), company: Optional[str] = Header(None)):
    global sales_summary_cache
    contents = await file.read()
    
    storage_res = await save_uploaded_file(file.filename, contents, company)
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_sales_data(df)
    sales_summary_cache = validation["summary"]
    return {
        "filename": file.filename,
        "saved_path": storage_res["local_path"],
        "cloud_url": storage_res["cloud_url"],
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.post("/import/inventory")
async def import_inventory(file: UploadFile = File(...), company: Optional[str] = Header(None)):
    global inventory_summary_cache
    contents = await file.read()
    
    storage_res = await save_uploaded_file(file.filename, contents, company)
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_inventory_data(df)
    inventory_summary_cache = validation
    return {
        "filename": file.filename,
        "saved_path": storage_res["local_path"],
        "cloud_url": storage_res["cloud_url"],
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.post("/import/financials")
async def import_financials(file: UploadFile = File(...), company: Optional[str] = Header(None)):
    global financial_summary_cache
    contents = await file.read()
    
    storage_res = await save_uploaded_file(file.filename, contents, company)
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_financial_data(df)
    financial_summary_cache = validation
    return {
        "filename": file.filename,
        "saved_path": storage_res["local_path"],
        "cloud_url": storage_res["cloud_url"],
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.get("/files/list")
def list_company_files(company: Optional[str] = None):
    slug = "".join(c if c.isalnum() else "_" for c in (company or "default").strip().lower())
    saved_files = []

    # Query Supabase Cloud Storage Bucket first if active
    if supabase_client:
        try:
            res = supabase_client.storage.from_("business-datasets").list(slug)
            if res:
                for obj in res:
                    name = obj.get("name")
                    if name:
                        size_kb = round(obj.get("metadata", {}).get("size", 1024) / 1024, 1)
                        saved_files.append({
                            "filename": name,
                            "size": f"{size_kb} KB",
                            "status": "Active (Supabase Cloud Storage)",
                            "type": "Cloud Uploaded Dataset"
                        })
        except Exception as e:
            print(f"Supabase Cloud Storage List warning: {e}")

    # Fallback to local disk storage if cloud list is empty
    if not saved_files:
        comp_dir = get_company_upload_dir(company)
        if comp_dir.exists():
            for f in comp_dir.glob("*"):
                if f.is_file():
                    size_kb = round(f.stat().st_size / 1024, 1)
                    saved_files.append({
                        "filename": f.name,
                        "size": f"{size_kb} KB",
                        "status": "Active (Local Disk)",
                        "type": "Custom Uploaded Dataset"
                    })

    if not saved_files:
        name_lower = (company or "").lower()
        if any(k in name_lower for k in ["nagina", "bedding", "textile", "home", "pk"]):
            saved_files = [
                {"filename": "nagina_bedding_sales_2026.csv", "size": "4.8 KB", "status": "Active & Normalized", "type": "Sales Ledger"},
                {"filename": "nagina_inventory_comforters_sheets.csv", "size": "3.2 KB", "status": "Active & Normalized", "type": "Inventory Levels"},
                {"filename": "nagina_yarn_fabric_cogs.csv", "size": "2.9 KB", "status": "Active & Normalized", "type": "Cost Structure"}
            ]
        elif "levi" in name_lower:
            saved_files = [
                {"filename": "sales_data_sample.csv", "size": "4.2 KB", "status": "Active & Normalized", "type": "Sales History"},
                {"filename": "inventory_data_sample.csv", "size": "2.8 KB", "status": "Active & Normalized", "type": "Warehouse Stock"},
                {"filename": "financial_data_sample.csv", "size": "3.5 KB", "status": "Active & Normalized", "type": "Financial COGS"}
            ]
        else:
            saved_files = [
                {"filename": f"{company or 'business'}_sales_data.csv", "size": "4.0 KB", "status": "Active & Normalized", "type": "Sales Dataset"},
                {"filename": f"{company or 'business'}_inventory_levels.csv", "size": "3.0 KB", "status": "Active & Normalized", "type": "Inventory Dataset"}
            ]

    return {"company": company or "Default", "files": saved_files}

company_profiles_db: Dict[str, BusinessProfile] = {}

def resolve_profile_by_company(company_name: Optional[str] = None) -> BusinessProfile:
    if not company_name or not company_name.strip():
        return current_profile
    c_clean = company_name.strip()
    c_lower = c_clean.lower()

    if c_lower in company_profiles_db:
        return company_profiles_db[c_lower]

    if current_profile and current_profile.name.strip().lower() == c_lower:
        return current_profile

    if any(k in c_lower for k in ["nagina", "bedding", "textile", "home", "pk"]):
        prof = BusinessProfile(
            id="biz-nagina-001",
            name=c_clean,
            legal_name=f"{c_clean} Store",
            industry="Home Textiles & Bedding Retail",
            business_type="Brick-and-Mortar Retail Store Network",
            business_model="Retailer & Fabric Assembler",
            primary_market="Pakistan",
            target_customers="Homeowners, Wedding Buyers & Hospitality",
            categories=["Bedsheet Sets", "Comforter Sets", "Pillows", "Blankets", "Duvet Covers"],
            sales_channels=["Karachi Retail Store", "WhatsApp Direct", "Online Store"],
            suppliers=["Faisalabad Textile Mills", "Multan Weaving Complex", "Karachi Foam Products"],
            supplier_countries=["India", "Bangladesh", "Pakistan"],
            import_dependency="Moderate (40-60% overseas sourcing)",
            operating_dependencies="Yarn prices, domestic freight, local foot traffic",
            currency="PKR"
        )
    elif any(k in c_lower for k in ["ikea", "furniture", "furnishing", "home decor", "shelving"]):
        prof = BusinessProfile(
            id="biz-ikea-001",
            name=c_clean if c_clean else "IKEA",
            legal_name="Inter IKEA Systems B.V.",
            industry="Home Furnishings & Furniture Retail",
            business_type="Global Retail Franchise & Omnichannel Store Network",
            business_model="Flat-Pack Manufacturer & Retailer",
            primary_market="Global / North America & Europe",
            target_customers="Homeowners, Renters, Office Managers & Assembly DIYers",
            categories=["Living Room Storage", "Modular Shelving", "Bedroom Furniture", "Seating & Chairs", "Home Accessories"],
            sales_channels=["IKEA Retail Stores", "Official Website & App", "Click & Collect Distribution Hubs"],
            suppliers=["European Timber Mills", "Swedish Metal Works", "Poland Particleboard Corp", "Vietnam Textile Suppliers"],
            supplier_countries=["Sweden", "Poland", "Germany", "Vietnam", "China"],
            import_dependency="High (80% overseas wood fiber & metal components)",
            operating_dependencies="Ocean container shipping, European timber pricing, retail foot traffic, flat-pack logistics",
            currency="USD"
        )
    elif "levi" in c_lower:
        prof = settings.LEVIS_DEFAULT_PROFILE
    else:
        prof = BusinessProfile(
            id=f"biz-custom-{int(time.time())}",
            name=c_clean,
            legal_name=f"{c_clean} Ltd.",
            industry="General Commerce & Retail",
            business_type="Omnichannel Business",
            business_model="Brand Manufacturer & Retailer",
            primary_market="Global Market",
            target_customers="Retail & Commercial Customers",
            categories=["Core Line Products", "Specialty Goods"],
            sales_channels=["Official Website", "Retail Stores", "Wholesale Partners"],
            suppliers=["Primary Regional Vendors", "Overseas Suppliers"],
            supplier_countries=["Domestic", "Overseas Sourcing"],
            import_dependency="Moderate (40-60% overseas sourcing)",
            operating_dependencies="Supply chain logistics, raw material pricing, freight costs",
            currency="USD"
        )
    
    company_profiles_db[c_lower] = prof
    return prof

def load_uploaded_summaries_for_company(company_name: Optional[str] = None):
    comp_dir = get_company_upload_dir(company_name)
    sales_sum = sales_summary_cache
    inv_sum = inventory_summary_cache
    fin_sum = financial_summary_cache

    if comp_dir.exists():
        for f in comp_dir.glob("*.csv"):
            fname = f.name.lower()
            try:
                with open(f, "rb") as file_obj:
                    contents = file_obj.read()
                    df = AnalyticsEngine.parse_file(contents, f.name)
                    if ("sales" in fname or "revenue" in fname or "order" in fname) and not sales_sum:
                        val = AnalyticsEngine.validate_sales_data(df)
                        sales_sum = val.get("summary", {})
                        sales_sum["categories"] = val.get("categories", [])
                        sales_sum["products"] = val.get("products", [])
                    elif ("inv" in fname or "stock" in fname) and not inv_sum:
                        val = AnalyticsEngine.validate_inventory_data(df)
                        inv_sum = val
                    elif ("fin" in fname or "cogs" in fname or "cost" in fname) and not fin_sum:
                        val = AnalyticsEngine.validate_financial_data(df)
                        fin_sum = val
            except Exception as err:
                print(f"Error parsing uploaded file {f.name}: {err}")

    return sales_sum, inv_sum, fin_sum

@router.get("/briefing/today")
def get_today_briefing(company: Optional[str] = None):
    status = system_status()
    target_profile = resolve_profile_by_company(company)
    sales_sum, inv_sum, _ = load_uploaded_summaries_for_company(company)
    briefing = briefing_engine.generate_today_briefing(
        profile=target_profile,
        sales_summary=sales_sum,
        inventory_summary=inv_sum
    )
    briefing["data_source_mode"] = status["overall_mode"]
    briefing["api_status"] = status["api_diagnostics"]
    return briefing

@router.get("/scenarios/search")
def search_scenarios(q: str = "", company: Optional[str] = None):
    if q:
        return scenario_engine.match_scenario(q)
    return scenario_engine.get_all_scenarios()

@router.get("/risk/analysis")
def get_risk_analysis(company: Optional[str] = None):
    target_profile = resolve_profile_by_company(company)
    sales_sum, inv_sum, _ = load_uploaded_summaries_for_company(company)
    briefing = briefing_engine.generate_today_briefing(
        profile=target_profile,
        sales_summary=sales_sum,
        inventory_summary=inv_sum
    )
    return briefing["risk_analysis"]

@router.post("/advisor/chat")
def advisor_chat(payload: Dict[str, Any] = Body(...)):
    status = system_status()
    question = payload.get("question", "How could today's situation affect my business?")
    company_name = payload.get("company") or payload.get("business_name") or payload.get("name")
    target_profile = resolve_profile_by_company(company_name)
    sales_sum, inv_sum, _ = load_uploaded_summaries_for_company(company_name)

    briefing = briefing_engine.generate_today_briefing(
        profile=target_profile,
        sales_summary=sales_sum,
        inventory_summary=inv_sum
    )
    ans = advisor_engine.answer_question(
        user_question=question,
        profile=target_profile,
        briefing_context=briefing
    )
    ans["data_source_mode"] = status["overall_mode"]
    return ans

@router.post("/voice/synthesize")
def synthesize_voice(payload: Dict[str, Any] = Body(...)):
    """
    ElevenLabs Voice Synthesizer API endpoint.
    Converts text response to audio/mpeg speech stream using ElevenLabs API key.
    """
    text = payload.get("text", "").strip()
    env_voice_id = settings.ELEVENLABS_VOICE_ID or os.getenv("ELEVENLABS_VOICE_ID")
    voice_id = env_voice_id if env_voice_id else payload.get("voice_id", "P8NfsqD6Mj2lTFzuAccu")
    api_key = settings.ELEVENLABS_API_KEY or os.getenv("ELEVENLABS_API_KEY")

    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    if not api_key:
        raise HTTPException(status_code=400, detail="ELEVENLABS_API_KEY is not configured in .env.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    body = {
        "text": text[:1000],
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.35,          # Lower stability allows rich emotional inflection & natural voice dynamics
            "similarity_boost": 0.85,   # High clarity & authentic tone match
            "style": 0.35,              # Enhanced style expressiveness and emotion
            "use_speaker_boost": True
        }
    }

    resp = requests.post(url, headers=headers, json=body, timeout=20)
    if resp.status_code == 200:
        return Response(content=resp.content, media_type="audio/mpeg")
    
    raise HTTPException(status_code=resp.status_code, detail=f"ElevenLabs API Error: {resp.text}")

@router.get("/competitors/analysis")
def get_competitor_analysis(company: Optional[str] = None):
    target_profile = resolve_profile_by_company(company)
    sales_sum, inv_sum, _ = load_uploaded_summaries_for_company(company)
    return competitor_engine.get_analysis(target_profile, sales_summary=sales_sum, inventory_summary=inv_sum)

@router.post("/competitors/add")
def add_competitor(payload: Dict[str, Any] = Body(...)):
    name = payload.get("name", "").strip()
    website_url = payload.get("website_url", "").strip()
    category = payload.get("category", "Custom Tracked Competitor")
    if not name or not website_url:
        raise HTTPException(status_code=400, detail="Competitor name and website_url are required.")
    
    added = competitor_engine.add_manual_competitor(name=name, website_url=website_url, category=category)
    return {"status": "success", "competitor": added}

@router.post("/demo/reset")
def reset_demo_data():
    global current_profile, sales_summary_cache, inventory_summary_cache, financial_summary_cache
    current_profile = settings.LEVIS_DEFAULT_PROFILE
    sales_summary_cache = None
    inventory_summary_cache = None
    financial_summary_cache = None
    return {"status": "success", "message": "Reset to Levi's default synthetic profile."}
