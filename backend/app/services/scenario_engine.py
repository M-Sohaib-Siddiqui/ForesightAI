import json
from pathlib import Path
from typing import List, Dict, Any
from app.core.config import DATA_DIR

class HistoricalScenarioEngine:
    """
    Structured Historical Scenario Intelligence Engine.
    Provides semantic matching between current business developments and historical world events.
    """

    def __init__(self):
        self.scenarios_file = DATA_DIR / "historical_scenarios.json"
        self.scenarios: List[Dict[str, Any]] = self._load_scenarios()

    def _load_scenarios(self) -> List[Dict[str, Any]]:
        if not self.scenarios_file.exists():
            return []
        with open(self.scenarios_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def match_scenario(self, event_description: str, keywords: List[str] = None) -> List[Dict[str, Any]]:
        """
        Matches a current event against the historical scenario database.
        Returns scenarios sorted by calculated similarity percentage.
        """
        if not keywords:
            keywords = [w.lower() for w in event_description.replace(",", " ").split() if len(w) > 3]

        results = []
        for scenario in self.scenarios:
            score = 0
            sc_text = (
                scenario["title"] + " " +
                scenario["category"] + " " +
                " ".join(scenario["tags"]) + " " +
                scenario["triggering_conditions"]
            ).lower()

            # Calculate keyword match weight
            match_count = sum(1 for kw in keywords if kw in sc_text)
            score += match_count * 18

            # Category matching bonus
            for cat in scenario["affected_sectors"]:
                if cat.lower() in event_description.lower():
                    score += 25

            # Clamp similarity percentage between 55% and 94%
            similarity_pct = min(94, max(55, 60 + score))

            results.append({
                **scenario,
                "similarity_score": similarity_pct,
                "relevance_level": "High" if similarity_pct >= 80 else ("Medium" if similarity_pct >= 68 else "Low")
            })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results

    def get_all_scenarios(self) -> List[Dict[str, Any]]:
        return self.scenarios
