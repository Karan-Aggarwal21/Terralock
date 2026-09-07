import { RiskLevel } from '../constants/risk';

export interface Location {
  lat: number;
  lng: number;
}

export interface PredictedDelayRange {
  min: number;
  max: number;
}

export interface DelayReasonRanked {
  reason: string;
  confidence: number;
}

export interface RiskFactor {
  name: string;
  importance: number;
  description?: string;
  mitigation?: string;
}

export interface SimulationData {
  num_simulations: number;
  expected_delay: number;
  median_delay: number;
  min_delay: number;
  max_delay: number;
  p90_delay: number;
  probability_exceeds_threshold: number;
  distribution: number[];
}

export interface RiskTrendPoint {
  period: string;
  probability: number;
}

export interface AcquisitionStage {
  stage: string;
  percent: number;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface RiskInputMetric {
  category: string;
  metric: string;
  value: string;
  impactLevel: 'nominal' | 'moderate' | 'severe';
  detail: string;
}

export interface LandParcel {
  parcel_id: string;
  survey_number: string;
  village: string;
  area_ha: number;
  ownership_type: string;
  status: 'Surveyed' | 'Disputed' | 'Award Declared' | 'Possession Taken';
  delay_probability: number;
  risk_level: RiskLevel;
  predicted_delay_days: number;
  primary_impediment: string;
  polygon_points?: [number, number][];
}

export interface ProjectTimeline {
  planned_duration_months: number;
  planned_start_date: string;
  planned_completion_date: string;
}

export interface Project {
  project_id: string;
  name: string;
  location: Location;
  delay_probability: number;
  risk_level: RiskLevel;
  predicted_delay_days: number;
  predicted_delay_range: PredictedDelayRange;
  delay_reason: string;
  delay_reason_confidence: number;
  delay_reasons_ranked: DelayReasonRanked[];
  risk_factors: RiskFactor[];
  simulation: SimulationData;
  risk_trend?: RiskTrendPoint[];
  acquisition_progress?: AcquisitionStage[];
  risk_explanation?: string;
  delay_reason_explanation?: string;
  timeline?: ProjectTimeline;
  risk_input_metrics?: RiskInputMetric[];
  parcels?: LandParcel[];
  // Metadata for project details and GIS display
  corridor_name?: string;
  state?: string;
  status?: 'Planning' | 'Acquisition In Progress' | 'Disputed' | 'Approved' | 'Completed';
  total_budget_cr?: number;
  land_required_ha?: number;
}
