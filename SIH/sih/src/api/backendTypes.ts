/**
 * Pydantic schemas mirroring backend/app/schemas.py
 * READ-ONLY backend representation - DO NOT MODIFY BACKEND
 */

export interface BackendProjectInfo {
  name: string;
  project_type: string;
  region: string;
  area: number;
  budget: number;
  stay_order?: string;
  court_level?: string;
  ownership_conflict?: number;
  missing_document_count?: number;
  [key: string]: unknown;
}

export interface BackendGeoJSONGeometry {
  type: 'Polygon';
  coordinates: number[][][]; // [ [ [lng, lat], [lng, lat], ... ] ]
}

export interface BackendProjectAnalysisRequest {
  project: BackendProjectInfo;
  geometry: BackendGeoJSONGeometry;
}

export interface BackendGISFeatures {
  area: number;
  road_count: number;
  building_count: number;
  road_density: number;
  building_density: number;
  nearby_facility_count: number;
  [key: string]: unknown;
}

export interface BackendMLPrediction {
  delay_days: number;
  delay_probability: number;
  predicted_delay_days: number;
  legal_risk: number;
  legal_risk_score?: number;
  compensation_risk: number;
  compensation_risk_score?: number;
  historical_delay_risk?: number;
  historical_risk_score?: number;
  gis_risk: number;
  gis_risk_score?: number;
  overall_risk?: number;
  overall_risk_score?: number;
  pred_days_if_delayed?: number;
  delay_days_risk_score?: number;
  model_confidence: number;
  model_version: string;
  [key: string]: unknown;
}

export interface BackendMonteCarloResult {
  status: string;
  iterations?: number;
  input_delay_probability?: number;
  input_delay_days?: number;
  expected_delay_days?: number;
  median_delay_days?: number;
  worst_case_delay_days?: number;
  min_delay_days?: number;
  max_delay_days?: number;
  percentiles?: {
    p05?: number;
    p50?: number;
    p90?: number;
    p95?: number;
    [key: string]: number | undefined;
  };
  exceedance_probabilities?: {
    exceeds_30_days?: number;
    exceeds_90_days?: number;
    exceeds_180_days?: number;
    [key: string]: number | undefined;
  };
  risk_level?: string;
  risk_breakdown?: {
    base_delay_days?: number;
    legal_delay_days?: number;
    compensation_delay_days?: number;
    gis_delay_days?: number;
    historical_delay_days?: number;
    [key: string]: number | undefined;
  };
  recommendation?: string;
  [key: string]: unknown;
}

export interface BackendAnalysisResponse {
  project: Record<string, unknown>;
  gis: BackendGISFeatures;
  ml: BackendMLPrediction;
  simulation: BackendMonteCarloResult;
}
