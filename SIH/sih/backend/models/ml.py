"""
Logistic Regression Delay & Risk Factor Modeling Pipeline
Trained on terra_lock_final_dataset_30000.csv
Serializes model bundle to models/delay_model.joblib for FastAPI inference.
"""
import os
import json
import warnings
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score, precision_score, recall_score, mean_absolute_error, r2_score

warnings.filterwarnings("ignore")

MODELS_DIR = Path(__file__).resolve().parent
DATASET_PATH = MODELS_DIR / "terra_lock_final_dataset_30000.csv"
MODEL_OUTPUT_PATH = MODELS_DIR / "delay_model.joblib"


def build_category_mapping(series: pd.Series) -> dict:
    """Creates a dict mapping from category strings to positive integers (0 = missing/unknown)."""
    uniques = sorted(list(series.astype(str).unique()))
    mapping = {val: idx + 1 for idx, val in enumerate(uniques)}
    mapping["Missing"] = 0
    mapping["No_Court_Involvement"] = mapping.get("No_Court_Involvement", 0)
    return mapping


def encode_categorical_series(series: pd.Series, mapping: dict) -> np.ndarray:
    """Encodes series using the mapping dict, safely mapping unknown categories to 0."""
    return np.array([mapping.get(str(x), 0) for x in series], dtype=np.float32)


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
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

    return df


def train_and_save_models():
    print(f"Loading dataset from: {DATASET_PATH}")
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # STEP 1: Feature Engineering
    df = engineer_features(df)

    TARGET = "delayed"
    DAYS_TARGET = "delay_days"
    drop_cols = ["case_id", "prediction_date", "delay_reason"]

    y = df[TARGET]
    y_days = df[DAYS_TARGET]
    X = df.drop(columns=[c for c in drop_cols + [TARGET, DAYS_TARGET] if c in df.columns])

    cat_cols = X.select_dtypes(include=["object"]).columns.tolist()
    num_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

    medians = {}
    for c in num_cols:
        med = float(X[c].median())
        medians[c] = med
        X[c] = X[c].fillna(med)

    modes = {}
    for c in cat_cols:
        mode_val = str(X[c].mode()[0]) if not X[c].mode().empty else "Missing"
        modes[c] = mode_val
        X[c] = X[c].fillna("Missing")

    X_train, X_test, y_train, y_test, ydays_train, ydays_test = train_test_split(
        X, y, y_days, test_size=0.2, random_state=42, stratify=y
    )

    # Build encoders as plain dictionaries
    encoders_overall = {}
    X_train_enc = X_train.copy()
    X_test_enc = X_test.copy()
    for c in cat_cols:
        mapping = build_category_mapping(pd.concat([X_train[c], X_test[c]]))
        encoders_overall[c] = mapping
        X_train_enc[c] = encode_categorical_series(X_train[c], mapping)
        X_test_enc[c] = encode_categorical_series(X_test[c], mapping)

    scaler_overall = StandardScaler()
    X_train_scaled = scaler_overall.fit_transform(X_train_enc)
    X_test_scaled = scaler_overall.transform(X_test_enc)

    print("\n=== Training Overall Logistic Regression Model ===")
    lr_overall = LogisticRegression(max_iter=2000, C=0.5, class_weight="balanced", random_state=42)
    lr_overall.fit(X_train_scaled, y_train)

    overall_pred = lr_overall.predict(X_test_scaled)
    overall_proba = lr_overall.predict_proba(X_test_scaled)[:, 1]
    overall_metrics = {
        "accuracy": round(accuracy_score(y_test, overall_pred), 4),
        "precision": round(precision_score(y_test, overall_pred), 4),
        "recall": round(recall_score(y_test, overall_pred), 4),
        "f1": round(f1_score(y_test, overall_pred), 4),
        "roc_auc": round(roc_auc_score(y_test, overall_proba), 4),
    }
    print(f"Overall Logistic Regression: {overall_metrics}")

    # STEP 2: Domain-Specific Logistic Regression Risk Models
    feature_groups = {
        "legal_risk_score": [
            "ownership_conflict", "mutation_pending", "title_clarity", "encumbrance_flag",
            "existing_legal_case", "number_of_legal_cases", "case_age_days", "court_level",
            "stay_order", "injunction_status", "objection_filed", "compensation_dispute",
            "title_document_available", "document_conflict", "legal_burden", "ownership_complexity"
        ],
        "historical_risk_score": [
            "total_file_age_days", "days_at_current_stage", "file_movement_count",
            "pending_approval_count", "department_count", "interdepartmental_dependencies",
            "number_of_objections", "public_hearing_status", "community_resistance",
            "process_friction", "stage_speed", "mutation_status", "survey_completed"
        ],
        "gis_risk_score": [
            "land_area_acres", "required_area_acres", "land_type", "land_use",
            "parcel_accessibility", "distance_to_project_km", "urban_rural",
            "circle_rate_lakh", "land_value_lakh", "land_area_shortfall",
            "land_area_shortfall_pct", "project_length_km"
        ],
        "compensation_risk_score": [
            "estimated_compensation_lakh", "approved_compensation_lakh", "compensation_paid_lakh",
            "compensation_pending", "rr_applicable", "rr_package_approved", "rr_payment_status",
            "number_of_beneficiaries", "bank_account_verified", "families_affected",
            "compensation_paid_ratio", "compensation_gap", "compensation_gap_pct"
        ]
    }

    domain_models = {}
    domain_metrics = {}

    print("\n=== Training Domain-Specific Logistic Regression Risk Models ===")
    for score_name, feats in feature_groups.items():
        feats = [f for f in feats if f in X.columns]
        g_cat = [c for c in feats if c in cat_cols]

        Xg_train = X_train[feats].copy()
        Xg_test = X_test[feats].copy()

        g_encoders = {}
        for c in g_cat:
            mapping = build_category_mapping(pd.concat([Xg_train[c], Xg_test[c]]))
            g_encoders[c] = mapping
            Xg_train[c] = encode_categorical_series(Xg_train[c], mapping)
            Xg_test[c] = encode_categorical_series(Xg_test[c], mapping)

        sc = StandardScaler()
        Xg_train_s = sc.fit_transform(Xg_train)
        Xg_test_s = sc.transform(Xg_test)

        dom_model = LogisticRegression(max_iter=2000, C=0.5, class_weight="balanced", random_state=42)
        dom_model.fit(Xg_train_s, y_train)

        proba_test = dom_model.predict_proba(Xg_test_s)[:, 1]
        auc = round(roc_auc_score(y_test, proba_test), 4)
        acc = round(accuracy_score(y_test, dom_model.predict(Xg_test_s)), 4)
        print(f"  {score_name}: ROC-AUC={auc:.4f}, Accuracy={acc:.4f} ({len(feats)} features)")

        domain_metrics[score_name] = {"roc_auc": auc, "accuracy": acc}
        domain_models[score_name] = {
            "model": dom_model,
            "scaler": sc,
            "encoders": g_encoders,
            "features": feats,
            "cat_cols": g_cat
        }

    # STEP 3: Predicted Delay Days (Linear Regression on truly delayed cases)
    print("\n=== Training Delay Days Magnitude Regression ===")
    delayed_mask_train = (y_train == 1)
    delayed_mask_test = (y_test == 1)

    reg_feats = list(set(sum(feature_groups.values(), [])))
    reg_feats = [f for f in reg_feats if f in X.columns]
    r_cat = [c for c in reg_feats if c in cat_cols]

    Xr_train = X_train[reg_feats].copy()
    Xr_test = X_test[reg_feats].copy()

    reg_encoders = {}
    for c in r_cat:
        mapping = build_category_mapping(pd.concat([Xr_train[c], Xr_test[c]]))
        reg_encoders[c] = mapping
        Xr_train[c] = encode_categorical_series(Xr_train[c], mapping)
        Xr_test[c] = encode_categorical_series(Xr_test[c], mapping)

    sc_r = StandardScaler()
    Xr_train_s = sc_r.fit_transform(Xr_train)
    Xr_test_s = sc_r.transform(Xr_test)

    lin_reg = LinearRegression()
    lin_reg.fit(Xr_train_s[delayed_mask_train.values], ydays_train[delayed_mask_train.values])

    pred_days_if_delayed = np.clip(lin_reg.predict(Xr_test_s), 0, None)
    mae = mean_absolute_error(ydays_test[delayed_mask_test.values], pred_days_if_delayed[delayed_mask_test.values])
    r2 = r2_score(ydays_test[delayed_mask_test.values], pred_days_if_delayed[delayed_mask_test.values])
    print(f"Delay Days Regression (on delayed cases): MAE={mae:.1f} days, R2={r2:.3f}")

    # Bundle all trained artifacts with pure built-in types
    bundle = {
        "overall_model": {
            "model": lr_overall,
            "scaler": scaler_overall,
            "encoders": encoders_overall,
            "features": X.columns.tolist(),
            "cat_cols": cat_cols
        },
        "domain_models": domain_models,
        "delay_regression": {
            "model": lin_reg,
            "scaler": sc_r,
            "encoders": reg_encoders,
            "features": reg_feats,
            "cat_cols": r_cat
        },
        "medians": medians,
        "modes": modes,
        "overall_metrics": overall_metrics,
        "domain_metrics": domain_metrics,
        "version": "logistic_regression_v1"
    }

    joblib.dump(bundle, MODEL_OUTPUT_PATH)
    print(f"\nSuccessfully trained and saved model bundle to: {MODEL_OUTPUT_PATH}")

    return bundle


if __name__ == "__main__":
    train_and_save_models()
