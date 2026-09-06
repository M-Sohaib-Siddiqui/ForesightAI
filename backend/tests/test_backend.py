import pytest
from fastapi.testclient import TestClient
from main import app
from app.services.analytics_engine import AnalyticsEngine
from app.services.scenario_engine import HistoricalScenarioEngine
from app.core.config import settings

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_profile_default():
    response = client.get("/api/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Levi's"
    assert "Men's Jeans" in data["categories"]

def test_today_briefing():
    response = client.get("/api/briefing/today")
    assert response.status_code == 200
    data = response.json()
    assert "developments" in data
    assert len(data["developments"]) >= 3
    assert data["business_name"] == "Levi's"

def test_scenario_search():
    engine = HistoricalScenarioEngine()
    matches = engine.match_scenario("Red Sea shipping route rerouting")
    assert len(matches) > 0
    assert matches[0]["similarity_score"] >= 50

def test_advisor_chat():
    response = client.post("/api/advisor/chat", json={"question": "How could today's situation affect my business?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "retrieved_facts" in data
    assert "model_estimates" in data
