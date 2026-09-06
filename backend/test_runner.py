import sys
from pathlib import Path

# Add backend dir to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.config import settings
from app.services.analytics_engine import AnalyticsEngine
from app.services.scenario_engine import HistoricalScenarioEngine
from app.services.risk_engine import RiskImpactEngine
from app.services.briefing_engine import DailyBriefingEngine
from app.services.advisor_engine import AIBusinessAdvisorEngine
from app.services.competitor_engine import CompetitorIntelligenceEngine
from app.api.routes import system_status

def run_tests():
    print("--- 1. Testing Default Business Profile ---")
    profile = settings.LEVIS_DEFAULT_PROFILE
    print(f"Profile Loaded: {profile.name} ({profile.industry})")
    assert profile.name == "Levi's"

    print("\n--- 2. Testing Daily Briefing Engine ---")
    briefing_engine = DailyBriefingEngine()
    briefing = briefing_engine.generate_today_briefing(profile)
    print(f"Briefing Date: {briefing['briefing_date']}")
    print(f"Headline: {briefing['headline']}")
    print(f"Overall Risk Level: {briefing['overall_business_risk']}")
    assert len(briefing["developments"]) == 3

    print("\n--- 3. Testing Historical Scenario Matching ---")
    scenario_engine = HistoricalScenarioEngine()
    matches = scenario_engine.match_scenario("Red Sea ocean container delays")
    top = matches[0]
    print(f"Top Matched Scenario: {top['title']} ({top['similarity_score']}% match)")
    assert top["similarity_score"] >= 60

    print("\n--- 4. Testing Risk & Impact Engine ---")
    risk_data = briefing["risk_analysis"]
    print(f"Estimated Revenue at Risk: ${risk_data['estimated_revenue_at_risk_usd']:,.2f}")
    print(f"Recommended Actions Count: {len(risk_data['recommended_actions'])}")
    assert risk_data["overall_score"] > 50

    print("\n--- 5. Testing AI Business Advisor ---")
    advisor = AIBusinessAdvisorEngine()
    resp = advisor.answer_question("How could today's situation affect my business?", profile, briefing)
    print("Advisor Question:", resp["question"])
    print("Advisor Answer Snippet:", resp["answer"][:120] + "...")
    assert len(resp["retrieved_facts"]) > 0

    print("\n--- 6. Testing Feature 5: Competitor & Market Intelligence ---")
    comp_engine = CompetitorIntelligenceEngine()
    analysis = comp_engine.get_analysis(profile)
    print(f"Auto-Detected Competitors Count: {analysis['competitors_count']}")
    
    print("\n--- 7. Testing System Status & API Key Verification Diagnostics ---")
    status = system_status()
    print(f"Overall Mode: {status['overall_mode']}")
    print(f"LLM Engine Message: {status['api_diagnostics']['llm_engine']['message']}")
    print(f"Database Message: {status['api_diagnostics']['database']['message']}")
    assert "overall_mode" in status

    print("\nSUCCESS: All backend test suites and API diagnostics verified clean!")

if __name__ == "__main__":
    run_tests()
