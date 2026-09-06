"""
Monte Carlo Simulation Engine for Project Delay Risk.
Seamlessly integrates ML delay probability, baseline delay days, and domain risk factors.
"""
from typing import Any, Dict, Optional
import numpy as np

from app.config import MONTE_CARLO_ITERATIONS


def run_monte_carlo(
    ml_result: Dict[str, Any],
    features: Dict[str, Any],
    iterations: Optional[int] = None,
    seed: Optional[int] = 42
) -> Dict[str, Any]:
    """
    Runs Monte Carlo simulation incorporating:
    - delay_probability: overall probability of delay occurrence
    - delay_days: baseline expected delay magnitude in days
    - Domain risk probabilities: legal, compensation, historical, GIS
    - Specific real-world project flags: stay_order, compensation_dispute, etc.
    """
    n = iterations if (iterations and iterations > 0) else MONTE_CARLO_ITERATIONS
    rng = np.random.default_rng(seed)

    # 1. Delay Probability and Delay Days from ML output
    delay_prob = float(ml_result.get("delay_probability", ml_result.get("overall_risk", 0.40)))
    delay_prob = float(np.clip(delay_prob, 0.05, 0.98))

    # Base magnitude if delayed (conditional delay duration)
    base_magnitude = float(ml_result.get("pred_days_if_delayed", 0.0))
    if base_magnitude <= 0:
        base_magnitude = float(ml_result.get("delay_days", ml_result.get("predicted_delay_days", 45.0))) / max(delay_prob, 0.1)

    # 2. Stochastic Baseline Delay Simulation
    # Scenarios where delay actually occurs:
    delay_occurs = rng.random(n) < delay_prob
    sampled_base = rng.normal(
        loc=base_magnitude,
        scale=max(base_magnitude * 0.15, 3.0),
        size=n
    )
    sampled_base = np.clip(sampled_base, 0, None)
    base_delays = delay_occurs * sampled_base

    # 3. Domain Risk Probabilities
    legal_p = float(ml_result.get("legal_risk", ml_result.get("legal_risk_score", 0.3)))
    comp_p = float(ml_result.get("compensation_risk", ml_result.get("compensation_risk_score", 0.3)))
    gis_p = float(ml_result.get("gis_risk", ml_result.get("gis_risk_score", 0.2)))
    hist_p = float(ml_result.get("historical_delay_risk", ml_result.get("historical_risk_score", 0.3)))

    # Adjust domain event probabilities if specific risk flags are present in features
    if features.get("stay_order") or str(features.get("stay_order")).lower() in ("yes", "true", "1") or features.get("ownership_conflict"):
        legal_p = min(0.95, legal_p + 0.30)
    if features.get("compensation_dispute") or str(features.get("compensation_dispute")).lower() in ("yes", "true", "1") or features.get("objection_filed"):
        comp_p = min(0.95, comp_p + 0.30)
    if features.get("community_resistance") or str(features.get("community_resistance")).lower() in ("yes", "true", "1"):
        hist_p = min(0.95, hist_p + 0.25)

    # 4. Simulate domain risk event impacts (additional delay days)
    # Legal stay orders / court litigation: 30 to 180 days delay
    legal_occurs = rng.random(n) < legal_p
    legal_delays = legal_occurs * rng.uniform(30.0, 180.0, size=n)

    # Compensation / R&R objections: 20 to 120 days delay
    comp_occurs = rng.random(n) < comp_p
    comp_delays = comp_occurs * rng.uniform(20.0, 120.0, size=n)

    # Spatial settlement / relocation challenges: 10 to 60 days delay
    gis_occurs = rng.random(n) < gis_p
    gis_delays = gis_occurs * rng.uniform(10.0, 60.0, size=n)

    # Bureaucratic / file movement delays: 15 to 90 days delay
    hist_occurs = rng.random(n) < hist_p
    hist_delays = hist_occurs * rng.uniform(15.0, 90.0, size=n)

    # 5. Total Simulated Delay Distribution
    total_delays = base_delays + legal_delays + comp_delays + gis_delays + hist_delays

    # 6. Statistical Metrics
    expected_delay = round(float(np.mean(total_delays)), 1)
    median_delay = round(float(np.percentile(total_delays, 50)), 1)
    worst_case_delay = round(float(np.percentile(total_delays, 90)), 1)
    p05_delay = round(float(np.percentile(total_delays, 5)), 1)
    p95_delay = round(float(np.percentile(total_delays, 95)), 1)
    min_delay = round(float(np.min(total_delays)), 1)
    max_delay = round(float(np.max(total_delays)), 1)

    prob_exceeding_30d = round(float(np.mean(total_delays > 30.0)), 3)
    prob_exceeding_90d = round(float(np.mean(total_delays > 90.0)), 3)
    prob_exceeding_180d = round(float(np.mean(total_delays > 180.0)), 3)

    if expected_delay > 120 or delay_prob > 0.70:
        risk_level = "High"
    elif expected_delay > 60 or delay_prob > 0.45:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "status": "completed",
        "iterations": n,
        "input_delay_probability": round(delay_prob, 4),
        "input_delay_days": round(float(ml_result.get("delay_days", ml_result.get("predicted_delay_days", 0.0))), 1),
        "expected_delay_days": expected_delay,
        "median_delay_days": median_delay,
        "worst_case_delay_days": worst_case_delay,
        "min_delay_days": min_delay,
        "max_delay_days": max_delay,
        "percentiles": {
            "p05": p05_delay,
            "p50": median_delay,
            "p90": worst_case_delay,
            "p95": p95_delay,
        },
        "exceedance_probabilities": {
            "exceeds_30_days": prob_exceeding_30d,
            "exceeds_90_days": prob_exceeding_90d,
            "exceeds_180_days": prob_exceeding_180d,
        },
        "risk_level": risk_level,
        "risk_breakdown": {
            "base_delay_days": round(float(np.mean(base_delays)), 1),
            "legal_delay_days": round(float(np.mean(legal_delays)), 1),
            "compensation_delay_days": round(float(np.mean(comp_delays)), 1),
            "gis_delay_days": round(float(np.mean(gis_delays)), 1),
            "historical_delay_days": round(float(np.mean(hist_delays)), 1),
        },
        "recommendation": (
            f"Overall delay probability is {round(delay_prob * 100, 1)}% with an expected delay of ~{expected_delay} days ({risk_level} Risk). "
            f"Recommended buffer: {worst_case_delay} days (90th percentile) to hedge against land disputes and regulatory bottlenecks."
        )
    }
