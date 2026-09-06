"""
Unit and API Pipeline Tests
Validates health check, GIS mock, Logistic Regression ML predictions (delay_days, delay_probability), and Monte Carlo simulation.
"""
import unittest
from unittest.mock import patch
from pydantic import ValidationError

from app.main import app, health_check
from app.routes.analysis import analyze_project
from app.schemas import GeoJSONGeometry, ProjectAnalysisRequest, ProjectInfo
from app.ml.predictor import load_model, predict
from app.simulation.monte_carlo import run_monte_carlo

try:
    from fastapi.testclient import TestClient
    HAS_TESTCLIENT = True
except Exception:
    HAS_TESTCLIENT = False


class TestProjectDelayAPI(unittest.TestCase):
    def setUp(self):
        self.sample_request_data = {
            "project": {
                "name": "NH Expansion",
                "project_type": "highway",
                "region": "Haryana",
                "area": 120.0,
                "budget": 500.0,
                "stay_order": "Yes",
                "court_level": "High_Court",
                "ownership_conflict": 1
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [76.80, 28.40],
                        [76.90, 28.40],
                        [76.90, 28.50],
                        [76.80, 28.50],
                        [76.80, 28.40]
                    ]
                ]
            }
        }

    def test_health_check(self):
        result = health_check()
        self.assertEqual(result, {"status": "ok"})

    def test_ml_model_outputs_delay_days_and_probability(self):
        bundle = load_model()
        self.assertIn("domain_models", bundle)

        features = {
            "area": 120.0,
            "budget": 500.0,
            "region": "Haryana",
            "stay_order": "Yes",
            "ownership_conflict": 1,
            "missing_document_count": 2
        }
        res = predict(features)
        self.assertIn("delay_days", res)
        self.assertIn("delay_probability", res)
        self.assertGreater(res["delay_days"], 0)
        self.assertGreater(res["delay_probability"], 0)
        self.assertLessEqual(res["delay_probability"], 1.0)
        self.assertIn("legal_risk", res)
        self.assertIn("compensation_risk", res)
        self.assertIn("historical_delay_risk", res)
        self.assertIn("gis_risk", res)
        self.assertEqual(res["model_version"], "logistic_regression_v1")

    @patch("app.routes.analysis.query_overpass")
    def test_analyze_pipeline_seamless_monte_carlo(self, mock_query_overpass):
        mock_query_overpass.return_value = {
            "elements": [
                {"type": "way", "id": 1, "tags": {"highway": "primary"}},
                {"type": "way", "id": 2, "tags": {"highway": "secondary"}},
                {"type": "way", "id": 3, "tags": {"building": "yes"}},
                {"type": "node", "id": 4, "tags": {"amenity": "school"}}
            ]
        }

        req = ProjectAnalysisRequest(**self.sample_request_data)
        response = analyze_project(req)
        data = response.model_dump()

        # Top-level keys
        self.assertIn("project", data)
        self.assertIn("gis", data)
        self.assertIn("ml", data)
        self.assertIn("simulation", data)

        # ML outputs: delay_days and delay_probability
        ml = data["ml"]
        self.assertIn("delay_days", ml)
        self.assertIn("delay_probability", ml)
        self.assertGreater(ml["delay_days"], 0)
        self.assertGreater(ml["delay_probability"], 0)

        # Monte Carlo outputs consuming ML inputs
        sim = data["simulation"]
        self.assertEqual(sim["status"], "completed")
        self.assertIn("input_delay_probability", sim)
        self.assertIn("input_delay_days", sim)
        self.assertEqual(sim["input_delay_probability"], ml["delay_probability"])
        self.assertEqual(sim["input_delay_days"], ml["delay_days"])
        self.assertIn("expected_delay_days", sim)
        self.assertIn("worst_case_delay_days", sim)
        self.assertIn("exceedance_probabilities", sim)
        self.assertIn(sim["risk_level"], ["Low", "Medium", "High"])

    def test_analyze_invalid_geometry(self):
        with self.assertRaises(ValidationError):
            GeoJSONGeometry(
                type="Polygon",
                coordinates=[[[76.80, 28.40]]]
            )

    def test_testclient_if_available(self):
        if not HAS_TESTCLIENT:
            self.skipTest("httpx not installed; skipping TestClient test")
        client = TestClient(app)
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ok"})


if __name__ == "__main__":
    unittest.main()
