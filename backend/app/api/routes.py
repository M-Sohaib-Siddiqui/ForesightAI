from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Header
from typing import Dict, Any, Optional
import hashlib
import time
from app.core.config import settings, BusinessProfile
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

# Simple user database (Cloud production syncs with Supabase Auth)
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
        # Default fallback session for unauthenticated demo
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

@router.post("/import/sales")
async def import_sales(file: UploadFile = File(...)):
    global sales_summary_cache
    contents = await file.read()
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_sales_data(df)
    sales_summary_cache = validation["summary"]
    return {
        "filename": file.filename,
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.post("/import/inventory")
async def import_inventory(file: UploadFile = File(...)):
    global inventory_summary_cache
    contents = await file.read()
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_inventory_data(df)
    inventory_summary_cache = validation
    return {
        "filename": file.filename,
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.post("/import/financials")
async def import_financials(file: UploadFile = File(...)):
    global financial_summary_cache
    contents = await file.read()
    df = AnalyticsEngine.parse_file(contents, file.filename)
    validation = AnalyticsEngine.validate_financial_data(df)
    financial_summary_cache = validation
    return {
        "filename": file.filename,
        "validation": validation,
        "status": "imported" if validation["valid"] else "warning"
    }

@router.get("/briefing/today")
def get_today_briefing():
    return briefing_engine.generate_today_briefing(
        profile=current_profile,
        sales_summary=sales_summary_cache,
        inventory_summary=inventory_summary_cache
    )

@router.get("/scenarios/search")
def search_scenarios(q: str = ""):
    if q:
        return scenario_engine.match_scenario(q)
    return scenario_engine.get_all_scenarios()

@router.get("/risk/analysis")
def get_risk_analysis():
    briefing = briefing_engine.generate_today_briefing(
        profile=current_profile,
        sales_summary=sales_summary_cache,
        inventory_summary=inventory_summary_cache
    )
    return briefing["risk_analysis"]

@router.post("/advisor/chat")
def advisor_chat(payload: Dict[str, Any] = Body(...)):
    question = payload.get("question", "How could today's situation affect my business?")
    briefing = briefing_engine.generate_today_briefing(
        profile=current_profile,
        sales_summary=sales_summary_cache,
        inventory_summary=inventory_summary_cache
    )
    return advisor_engine.answer_question(
        user_question=question,
        profile=current_profile,
        briefing_context=briefing
    )

@router.get("/competitors/analysis")
def get_competitor_analysis():
    return competitor_engine.get_analysis(current_profile)

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
