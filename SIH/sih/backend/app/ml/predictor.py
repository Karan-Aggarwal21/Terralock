"""
Machine Learning Delay Prediction Interface.
Uses the trained Logistic Regression and Linear Regression model bundle (models/delay_model.joblib).
Outputs delay_days, delay_probability, and 4 domain risk scores for the Monte Carlo engine.
"""
import os
from pathlib import Path
from typing import Any, Dict, Optional
import joblib
import numpy as np
import pandas as pd

from app.config import MODEL_PATH

MODELS_DIR = Path(__file__).resolve().parent.parent.parent / "models"
_bundle = None


def load_model(model_path: Optional[str] = None) -> dict:
    """Loads and caches the trained model bundle."""
    global _bundle
    if _bundle is not None and not model_path:
        return _bundle

    if model_path:
        path = Path(model_path)
    elif MODEL_PATH:
        path = Path(MODEL_PATH)
    else:
        path = MODELS_DIR / "delay_model.joblib"

    if not path.is_file():
        raise FileNotFoundError(f"Trained model bundle not found at: {path}")

    _bundle = joblib.load(path)
    return _bundle


def engineer_features_single(raw: Dict[str, Any], medians: Dict[str, float], modes: Dict[str, str]) -> pd.DataFrame:
    """
    Transforms raw incoming dictionary of project + GIS + extra land fields into
    a single-row DataFrame with identical feature engineering as models/ml.py.
    """
    row = {}
    for col, med in medians.items():
        row[col] = med
    for col, mode_val in modes.items():
        row[col] = mode_val

    # Map frontend and GIS fields to model features if not explicitly provided
    if "land_area_acres" not in raw and "area" in raw:
        area_val = float(raw["area"] or 0)
        row["land_area_acres"] = area_val if area_val > 10 else area_val * 247.1
        row["required_area_acres"] = row["land_area_acres"]

    if "project_value_crore" not in raw and "budget" in raw:
        row["project_value_crore"] = float(raw["budget"] or 100.0)

    if "state" not in raw and "region" in raw:
        row["state"] = str(raw["region"])

    # Overwrite with any explicitly provided fields
    for k, v in raw.items():
        if v is not None:
            row[k] = v

    df = pd.DataFrame([row])

    # Feature engineering identical to training pipeline
    approved_denom = df["approved_compensation_lakh"].replace(0, np.nan)
    df["compensation_paid_ratio"] = df["compensation_paid_lakh"] / approved_denom
    df["compensation_gap"] = df["estimated_compensation_lakh"] - df["approved_compensation_lakh"]
    estimated_denom = df["estimated_compensation_lakh"].replace(0, np.nan)
    df["compensation_gap_pct"] = df["compensation_gap"] / estimated_denom
    df["land_area_shortfall"] = df["land_area_acres"] - df["required_area_acres"]
    required_denom = df["required_area_acres"].replace(0, np.nan)
    df["land_area_shortfall_pct"] = df["land_area_shortfall"] / required_denom
    df["doc_completeness"] = 1 - (df["missing_document_count"] / (df["missing_document_count"] + 5))
    df["legal_burden"] = (
        df["number_of_legal_cases"]
        + df["ownership_conflict"]
        + df["mutation_pending"]
        + df["encumbrance_flag"]
        + df["objection_filed"]
        + df["document_conflict"]
    )
    df["ownership_complexity"] = df["number_of_owners"] + df["number_of_coowners"] + df["number_of_legal_heirs"]
    df["process_friction"] = (
        df["pending_approval_count"]
        + df["department_count"]
        + df["interdepartmental_dependencies"]
        + df["file_movement_count"]
    )
    df["stage_speed"] = df["total_file_age_days"] / (df["file_movement_count"] + 1)
    df["case_age_days"] = df["case_age_days"].fillna(0)
    df["court_level"] = df["court_level"].fillna("No_Court_Involvement")

    for c in ["compensation_paid_ratio", "compensation_gap_pct", "land_area_shortfall_pct"]:
        df[c] = df[c].replace([np.inf, -np.inf], np.nan)
        if df[c].isna().any():
            df[c] = df[c].fillna(0.0)

    return df


def predict(features: Dict[str, Any], model_bundle: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Computes domain risk probabilities (legal, historical, GIS, compensation),
    overall risk / delay probability, delay days magnitude, and expected delay days
    for seamless integration into the Monte Carlo simulation engine.
    """
    bundle = model_bundle or load_model()
    medians = bundle["medians"]
    modes = bundle["modes"]
    domain_models = bundle["domain_models"]
    delay_reg = bundle["delay_regression"]

    # 1. Feature Engineering
    df = engineer_features_single(features, medians, modes)

    # 2. Domain Risk Scoring via Logistic Regression
    domain_scores = {}
    for dom_name, dom_info in domain_models.items():
        feats = dom_info["features"]
        cat_cols = dom_info["cat_cols"]
        encoders = dom_info["encoders"]
        scaler = dom_info["scaler"]
        model = dom_info["model"]

        X_dom = df[feats].copy()
        for c in cat_cols:
            mapping = encoders.get(c, {})
            val = str(X_dom[c].iloc[0])
            X_dom[c] = mapping.get(val, 0)

        for c in feats:
            if c not in cat_cols:
                X_dom[c] = pd.to_numeric(X_dom[c], errors="coerce").fillna(medians.get(c, 0.0))

        X_dom_scaled = scaler.transform(X_dom)
        proba = float(model.predict_proba(X_dom_scaled)[0, 1])
        domain_scores[dom_name] = round(proba, 4)

    legal_risk = domain_scores.get("legal_risk_score", 0.25)
    historical_risk = domain_scores.get("historical_risk_score", 0.25)
    gis_risk = domain_scores.get("gis_risk_score", 0.25)
    compensation_risk = domain_scores.get("compensation_risk_score", 0.25)

    # 3. Overall Delay Probability
    delay_probability = round(float(np.mean([legal_risk, historical_risk, gis_risk, compensation_risk])), 4)

    # 4. Delay Days Magnitude Regression (on delayed cases)
    r_feats = delay_reg["features"]
    r_cat = delay_reg["cat_cols"]
    r_encoders = delay_reg["encoders"]
    r_scaler = delay_reg["scaler"]
    r_model = delay_reg["model"]

    Xr = df[r_feats].copy()
    for c in r_cat:
        mapping = r_encoders.get(c, {})
        val = str(Xr[c].iloc[0])
        Xr[c] = mapping.get(val, 0)

    for c in r_feats:
        if c not in r_cat:
            Xr[c] = pd.to_numeric(Xr[c], errors="coerce").fillna(medians.get(c, 0.0))

    Xr_scaled = r_scaler.transform(Xr)
    pred_days_if_delayed = float(np.clip(r_model.predict(Xr_scaled)[0], 0, None))

    # Expected delay days = delay probability * predicted days if delayed
    delay_days = round(delay_probability * pred_days_if_delayed, 1)
    delay_days_risk_score = min(1.0, round(delay_days / 365.0, 3))

    confidence = round(float(bundle.get("overall_metrics", {}).get("accuracy", 0.88)), 2)

    return {
        "delay_days": delay_days,
        "delay_probability": delay_probability,
        "predicted_delay_days": delay_days,
        "legal_risk": legal_risk,
        "legal_risk_score": legal_risk,
        "compensation_risk": compensation_risk,
        "compensation_risk_score": compensation_risk,
        "historical_delay_risk": historical_risk,
        "historical_risk_score": historical_risk,
        "gis_risk": gis_risk,
        "gis_risk_score": gis_risk,
        "overall_risk": delay_probability,
        "overall_risk_score": delay_probability,
        "pred_days_if_delayed": round(pred_days_if_delayed, 1),
        "delay_days_risk_score": delay_days_risk_score,
        "model_confidence": confidence,
        "model_version": bundle.get("version", "logistic_regression_v1"),
    }
