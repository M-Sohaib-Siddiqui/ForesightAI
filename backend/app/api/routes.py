from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import Dict, Any, Optional
from app.core.config import settings, BusinessProfile
from app.services.analytics_engine import AnalyticsEngine
from app.services.scenario_engine import HistoricalScenarioEngine
from app.services.risk_engine import RiskImpactEngine
from app.services.briefing_engine import DailyBriefingEngine
from app.services.advisor_engine import AIBusinessAdvisorEngine

router = APIRouter(prefix="/api")

# State holders (in-memory for local runtime, syncs with Supabase when configured)
current_profile: BusinessProfile = settings.LEVIS_DEFAULT_PROFILE
sales_summary_cache: Optional[Dict[str, Any]] = None
inventory_summary_cache: Optional[Dict[str, Any]] = None
financial_summary_cache: Optional[Dict[str, Any]] = None

scenario_engine = HistoricalScenarioEngine()
briefing_engine = DailyBriefingEngine()
advisor_engine = AIBusinessAdvisorEngine()

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

@router.post("/demo/reset")
def reset_demo_data():
    global current_profile, sales_summary_cache, inventory_summary_cache, financial_summary_cache
    current_profile = settings.LEVIS_DEFAULT_PROFILE
    sales_summary_cache = None
    inventory_summary_cache = None
    financial_summary_cache = None
    return {"status": "success", "message": "Reset to Levi's default synthetic profile."}
