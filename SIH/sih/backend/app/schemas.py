"""
Pydantic schemas for the Frontend/Backend API contract.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class ProjectInfo(BaseModel):
    name: str = "Infrastructure Project"
    project_type: str = "highway"
    region: str = "Haryana"
    area: float = 100.0
    budget: float = 500.0

    model_config = {"extra": "allow"}


class GeoJSONGeometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[List[float]]]

    @field_validator("type")
    @classmethod
    def check_type(cls, v: str) -> str:
        if v.lower() != "polygon":
            raise ValueError("Only 'Polygon' geometry is supported.")
        return "Polygon"

    @field_validator("coordinates")
    @classmethod
    def check_coords(cls, v: List[List[List[float]]]) -> List[List[List[float]]]:
        if not v or len(v[0]) < 3:
            raise ValueError("Polygon must have at least 3 points.")
        return v


class ProjectAnalysisRequest(BaseModel):
    project: ProjectInfo
    geometry: GeoJSONGeometry


class GISFeatures(BaseModel):
    area: float
    road_count: int
    building_count: int
    road_density: float
    building_density: float
    nearby_facility_count: int

    model_config = {"extra": "allow"}


class MLPrediction(BaseModel):
    delay_days: float = Field(..., description="Expected baseline delay in days")
    delay_probability: float = Field(..., description="Overall probability of delay (0.0 to 1.0)")
    predicted_delay_days: float = Field(..., description="Alias for delay_days")
    legal_risk: float = Field(..., description="Legal dispute risk score (0.0 to 1.0)")
    legal_risk_score: Optional[float] = None
    compensation_risk: float = Field(..., description="Compensation & RR risk score (0.0 to 1.0)")
    compensation_risk_score: Optional[float] = None
    historical_delay_risk: Optional[float] = None
    historical_risk_score: Optional[float] = None
    gis_risk: float = Field(..., description="GIS & spatial density risk score (0.0 to 1.0)")
    gis_risk_score: Optional[float] = None
    overall_risk: Optional[float] = None
    overall_risk_score: Optional[float] = None
    pred_days_if_delayed: Optional[float] = None
    delay_days_risk_score: Optional[float] = None
    model_confidence: float = 0.88
    model_version: str = "logistic_regression_v1"

    model_config = {"extra": "allow"}


class MonteCarloResult(BaseModel):
    status: str = "completed"
    iterations: Optional[int] = 10000
    input_delay_probability: Optional[float] = None
    input_delay_days: Optional[float] = None
    expected_delay_days: Optional[float] = None
    median_delay_days: Optional[float] = None
    worst_case_delay_days: Optional[float] = None
    min_delay_days: Optional[float] = None
    max_delay_days: Optional[float] = None
    percentiles: Optional[Dict[str, float]] = None
    exceedance_probabilities: Optional[Dict[str, float]] = None
    risk_level: Optional[str] = None
    risk_breakdown: Optional[Dict[str, float]] = None
    recommendation: Optional[str] = None

    model_config = {"extra": "allow"}


class AnalysisResponse(BaseModel):
    project: Dict[str, Any]
    gis: GISFeatures
    ml: MLPrediction
    simulation: MonteCarloResult
