# 🚀 Land Acquisition & Project Delay Risk Predictor (Backend)

A clean, lightweight FastAPI backend built for hackathons to predict infrastructure project delay risks and run Monte Carlo simulations.

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
pip install fastapi uvicorn requests numpy pydantic python-dotenv pandas scikit-learn joblib
```

### 2. Start the Server
```bash
uvicorn app.main:app --reload
```

- **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📁 Project Structure

```
sih-backend/
├── app/
│   ├── main.py               # FastAPI app entry point & CORS
│   ├── config.py             # Server & simulation settings
│   ├── schemas.py            # Pydantic request & response models
│   ├── routes/
│   │   └── analysis.py       # POST /api/analyze route
│   ├── gis/
│   │   ├── gis_api.py        # Queries OpenStreetMap for roads/buildings
│   │   └── features.py       # Calculates area & density metrics
│   ├── ml/
│   │   └── predictor.py      # ML / Logistic Regression delay predictor
│   └── simulation/
│       └── monte_carlo.py    # 10,000-run Monte Carlo delay simulation
├── models/                   # Folder with trained delay_model.joblib
├── tests/
│   └── test_api.py           # Unit tests
├── .env                      # Environment variables (optional)
└── README.md
```

---

## 📡 API Endpoint: `POST /api/analyze`

Send project info and a GeoJSON polygon from your frontend (Leaflet, Mapbox, React, etc.).

### Request Body Example:
```json
{
  "project": {
    "name": "Highway Expansion NH-44",
    "project_type": "highway",
    "region": "Haryana",
    "area": 120.0,
    "budget": 500.0,
    "stay_order": "Yes",
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
```

### Response Example:
```json
{
  "project": {
    "name": "Highway Expansion NH-44",
    "project_type": "highway",
    "region": "Haryana",
    "area": 120.0,
    "budget": 500.0,
    "stay_order": "Yes",
    "ownership_conflict": 1
  },
  "gis": {
    "area": 108.97,
    "road_count": 14,
    "building_count": 82,
    "road_density": 0.12,
    "building_density": 0.69,
    "nearby_facility_count": 5
  },
  "ml": {
    "delay_days": 40.0,
    "delay_probability": 0.4294,
    "predicted_delay_days": 40.0,
    "legal_risk": 0.5475,
    "legal_risk_score": 0.5475,
    "compensation_risk": 0.5036,
    "compensation_risk_score": 0.5036,
    "historical_delay_risk": 0.4429,
    "historical_risk_score": 0.4429,
    "gis_risk": 0.2236,
    "gis_risk_score": 0.2236,
    "overall_risk": 0.4294,
    "overall_risk_score": 0.4294,
    "pred_days_if_delayed": 93.0,
    "delay_days_risk_score": 0.11,
    "model_confidence": 0.60,
    "model_version": "logistic_regression_v1"
  },
  "simulation": {
    "status": "completed",
    "iterations": 10000,
    "input_delay_probability": 0.4294,
    "input_delay_days": 40.0,
    "expected_delay_days": 195.5,
    "median_delay_days": 193.5,
    "worst_case_delay_days": 315.1,
    "min_delay_days": 0.0,
    "max_delay_days": 523.0,
    "percentiles": {
      "p05": 48.4,
      "p50": 193.5,
      "p90": 315.1,
      "p95": 348.3
    },
    "exceedance_probabilities": {
      "exceeds_30_days": 0.975,
      "exceeds_90_days": 0.874,
      "exceeds_180_days": 0.551
    },
    "risk_level": "High",
    "risk_breakdown": {
      "base_delay_days": 40.4,
      "legal_delay_days": 89.3,
      "compensation_delay_days": 34.8,
      "gis_delay_days": 7.9,
      "historical_delay_days": 23.2
    },
    "recommendation": "Overall delay probability is 42.9% with an expected delay of ~195.5 days (High Risk). Recommended buffer: 315.1 days (90th percentile) to hedge against land disputes and regulatory bottlenecks."
  }
}
```

---

## 💡 How the Pipeline Works

1. **GIS Extraction (`app/gis/`)**:
   Calculates the polygon area and queries OpenStreetMap Overpass API within the project's bounding box to count intersecting roads, structures, and amenities.
2. **ML Risk Predictor (`app/ml/predictor.py`)**:
   Estimates baseline delay days and risk scores (legal, compensation, GIS) based on project size, budget, and density.
3. **Monte Carlo Simulation (`app/simulation/monte_carlo.py`)**:
   Instead of just giving one delay number, it simulates **1,000 potential project scenarios**:
   - Varies baseline delay slightly ($\pm 15\%$).
   - Simulates whether legal stay orders occur (adds 30–180 days).
   - Simulates whether compensation disputes occur (adds 20–120 days).
   - Simulates dense settlement relocation friction (adds 10–60 days).
   - Outputs expected delay, worst-case delay (P90), risk level (Low/Medium/High), and a buffer recommendation.

---

## 🤖 How to Plug in Your Trained ML Model

1. **Export & Save**:
   Save your trained scikit-learn / XGBoost model artifact into the `models/` folder:
   ```bash
   # Supported extensions: .joblib or .pkl
   models/delay_model.joblib
   ```
   *(Or set `MODEL_PATH=path/to/custom_model.joblib` in your `.env` file).*

2. **Feature Alignment**:
   In `app/ml/predictor.py`, `FEATURE_COLUMNS` defines the expected features vector passed into `model.predict()`:
   ```python
   FEATURE_COLUMNS = [
       "area", "budget", "building_density", "road_density",
       "building_count", "road_count", "nearby_facility_count",
       "stay_order", "compensation_dispute"
   ]
   ```
   Add or reorder columns to match your exact training dataset.

3. **Automatic Inference**:
   `load_model()` will automatically detect, load, and cache the model from `models/`, and `predict()` runs inference directly. If no model is placed in `models/`, the API returns a descriptive HTTP 503 response.

---

## 🧪 Running Tests

```bash
python -m unittest discover tests
```

