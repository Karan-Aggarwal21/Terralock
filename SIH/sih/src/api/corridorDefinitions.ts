import { BackendProjectAnalysisRequest } from './backendTypes';
import { Location, LandParcel, RiskInputMetric, AcquisitionStage, ProjectTimeline } from '../types/project';

export interface CorridorBaseProfile {
  project_id: string;
  name: string;
  state: string;
  status: 'Planning' | 'Acquisition In Progress' | 'Disputed' | 'Approved' | 'Completed';
  location: Location;
  total_budget_cr: number;
  land_required_ha: number;
  corridor_name: string;
  requestPayload: BackendProjectAnalysisRequest;
  timeline: ProjectTimeline;
  acquisition_progress: AcquisitionStage[];
  risk_input_metrics: RiskInputMetric[];
  parcels: LandParcel[];
}

/**
 * Monitored National Infrastructure Corridors with GeoJSON geometries
 * Sent to backend /api/analyze for live ML inference, GIS extraction, and Monte Carlo simulation.
 */
export const MONITORED_CORRIDORS: CorridorBaseProfile[] = [
  {
    project_id: 'P-101',
    name: 'Western Dedicated Freight Corridor (Surat-Vadodara Link)',
    state: 'Gujarat',
    status: 'Acquisition In Progress',
    corridor_name: 'Surat-Vadodara Rail Spur',
    location: { lat: 21.90, lng: 73.00 },
    total_budget_cr: 3850,
    land_required_ha: 420,
    requestPayload: {
      project: {
        name: 'Western Dedicated Freight Corridor (Surat-Vadodara Link)',
        project_type: 'railway',
        region: 'Gujarat',
        area: 420.0,
        budget: 3850.0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.90, 21.80],
            [73.15, 21.80],
            [73.15, 22.05],
            [72.90, 22.05],
            [72.90, 21.80],
          ],
        ],
      },
    },
    timeline: {
      planned_duration_months: 24,
      planned_start_date: '2024-01-15',
      planned_completion_date: '2026-01-15',
    },
    acquisition_progress: [
      { stage: 'Sec 4(1) Public Notification', percent: 100, status: 'completed' },
      { stage: 'Sec 6 Declaration of Acquisition', percent: 100, status: 'completed' },
      { stage: 'Sec 11 Enquiry & Valuation', percent: 100, status: 'completed' },
      { stage: 'Sec 19 Award Determination', percent: 85, status: 'in_progress' },
      { stage: 'Final Possession Handover', percent: 60, status: 'in_progress' },
    ],
    risk_input_metrics: [
      { category: 'Statutory Notification', metric: 'Gazette Notice Sec 4', value: 'Published', impactLevel: 'nominal', detail: 'Notification issued with zero public objections.' },
      { category: 'Documentation', metric: 'Land Mutation Records', value: '98% Complete', impactLevel: 'nominal', detail: 'Consolidated revenue sheets validated by Tehsildar.' },
      { category: 'Judicial / Stay Orders', metric: 'High Court Petitions', value: '0 Active', impactLevel: 'nominal', detail: 'Clear title certificate issued by State Advocate.' },
      { category: 'Disbursement', metric: 'Direct Bank Transfers', value: '85% Disbursed', impactLevel: 'nominal', detail: 'Escrow account operational with daily clearance.' },
      { category: 'Inter-Agency', metric: 'Forest / Environmental NOC', value: 'Granted', impactLevel: 'nominal', detail: 'MoEFCC Stage-II clearance approved.' },
    ],
    parcels: [
      {
        parcel_id: 'PRCL-101-A',
        survey_number: 'Survey #142/2',
        village: 'Bharuch Peri-Urban',
        area_ha: 14.2,
        ownership_type: 'Private Agricultural',
        status: 'Award Declared',
        delay_probability: 0.15,
        risk_level: 'LOW',
        predicted_delay_days: 10,
        primary_impediment: 'Nominal mutation paperwork',
        polygon_points: [[21.82, 72.95], [21.88, 73.02], [21.85, 73.06]],
      },
      {
        parcel_id: 'PRCL-101-B',
        survey_number: 'Survey #189/1',
        village: 'Ankleshwar Rural',
        area_ha: 8.6,
        ownership_type: 'Commercial Freehold',
        status: 'Possession Taken',
        delay_probability: 0.12,
        risk_level: 'LOW',
        predicted_delay_days: 8,
        primary_impediment: 'Standard structural relocation',
        polygon_points: [[21.92, 73.04], [21.96, 73.09], [21.91, 73.12]],
      },
    ],
  },
  {
    project_id: 'P-102',
    name: 'Western Dedicated Freight Corridor Link',
    state: 'Maharashtra',
    status: 'Acquisition In Progress',
    corridor_name: 'JNPT-Palghar Rail Link',
    location: { lat: 19.12, lng: 73.02 },
    total_budget_cr: 1420,
    land_required_ha: 310,
    requestPayload: {
      project: {
        name: 'Western Dedicated Freight Corridor Link',
        project_type: 'railway',
        region: 'Maharashtra',
        area: 310.0,
        budget: 1420.0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.95, 19.05],
            [73.10, 19.05],
            [73.10, 19.20],
            [72.95, 19.20],
            [72.95, 19.05],
          ],
        ],
      },
    },
    timeline: {
      planned_duration_months: 36,
      planned_start_date: '2023-06-01',
      planned_completion_date: '2026-06-01',
    },
    acquisition_progress: [
      { stage: 'Sec 4(1) Public Notification', percent: 100, status: 'completed' },
      { stage: 'Sec 6 Declaration of Acquisition', percent: 100, status: 'completed' },
      { stage: 'Sec 11 Enquiry & Valuation', percent: 78, status: 'in_progress' },
      { stage: 'Sec 19 Award Determination', percent: 45, status: 'in_progress' },
      { stage: 'Final Possession Handover', percent: 20, status: 'pending' },
    ],
    risk_input_metrics: [
      { category: 'Statutory Notification', metric: 'Gazette Notice Sec 4', value: 'Published', impactLevel: 'nominal', detail: 'Notification gazetted with 4 objections pending.' },
      { category: 'Documentation', metric: 'Land Mutation Records', value: '74% Complete', impactLevel: 'moderate', detail: 'Multi-party ancestral partition claims pending.' },
      { category: 'Judicial / Stay Orders', metric: 'Tribal Land Rights Review', value: 'Active Inquiry', impactLevel: 'moderate', detail: 'PESA Act verification ongoing in 2 talukas.' },
      { category: 'Disbursement', metric: 'Direct Bank Transfers', value: '52% Disbursed', impactLevel: 'moderate', detail: 'Heirship title validation causing bank return delays.' },
      { category: 'Inter-Agency', metric: 'Coastal Regulation Zone NOC', value: 'Conditional', impactLevel: 'nominal', detail: 'Mangrove protection buffer verification submitted.' },
    ],
    parcels: [
      {
        parcel_id: 'PRCL-102-A',
        survey_number: 'Survey #88/3',
        village: 'Bhiwandi Suburb',
        area_ha: 22.4,
        ownership_type: 'Joint Ancestral Agricultural',
        status: 'Disputed',
        delay_probability: 0.52,
        risk_level: 'MODERATE',
        predicted_delay_days: 42,
        primary_impediment: 'Multi-party heirship documentation conflict',
        polygon_points: [[19.08, 73.01], [19.14, 73.04], [19.11, 73.06]],
      },
    ],
  },
  {
    project_id: 'P-103',
    name: 'NH-48 Bengaluru-Pune Expressway Expansion',
    state: 'Karnataka',
    status: 'Disputed',
    corridor_name: 'Hubballi-Dharwad Section',
    location: { lat: 15.36, lng: 75.12 },
    total_budget_cr: 2100,
    land_required_ha: 480,
    requestPayload: {
      project: {
        name: 'NH-48 Bengaluru-Pune Expressway Expansion',
        project_type: 'highway',
        region: 'Karnataka',
        area: 480.0,
        budget: 2100.0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.05, 15.28],
            [75.20, 15.28],
            [75.20, 15.42],
            [75.05, 15.42],
            [75.05, 15.28],
          ],
        ],
      },
    },
    timeline: {
      planned_duration_months: 30,
      planned_start_date: '2023-09-01',
      planned_completion_date: '2026-03-01',
    },
    acquisition_progress: [
      { stage: 'Sec 4(1) Public Notification', percent: 100, status: 'completed' },
      { stage: 'Sec 6 Declaration of Acquisition', percent: 90, status: 'in_progress' },
      { stage: 'Sec 11 Enquiry & Valuation', percent: 45, status: 'in_progress' },
      { stage: 'Sec 19 Award Determination', percent: 15, status: 'pending' },
      { stage: 'Final Possession Handover', percent: 0, status: 'pending' },
    ],
    risk_input_metrics: [
      { category: 'Statutory Notification', metric: 'Gazette Notice Sec 4', value: 'Challenged', impactLevel: 'severe', detail: 'Writ petition WP-3481 filed challenging alignment.' },
      { category: 'Documentation', metric: 'Land Mutation Records', value: '56% Complete', impactLevel: 'moderate', detail: 'Title deeds disputed in 18 survey numbers.' },
      { category: 'Judicial / Stay Orders', metric: 'High Court Interim Stay', value: 'Active Stay', impactLevel: 'severe', detail: 'Notice returnable in 6 weeks with stay on possession.' },
      { category: 'Disbursement', metric: 'Direct Bank Transfers', value: '31% Disbursed', impactLevel: 'severe', detail: 'Disbursement frozen pending compensation court award.' },
      { category: 'Inter-Agency', metric: 'Irrigation Canal NOC', value: 'Pending', impactLevel: 'moderate', detail: 'State Water Board reviewing pipeline crossings.' },
    ],
    parcels: [
      {
        parcel_id: 'PRCL-103-A',
        survey_number: 'Survey #312/1A',
        village: 'Navalgund Taluk',
        area_ha: 38.5,
        ownership_type: 'Commercial Industrial',
        status: 'Disputed',
        delay_probability: 0.76,
        risk_level: 'HIGH',
        predicted_delay_days: 54,
        primary_impediment: 'High Court interim injunction on possession',
        polygon_points: [[15.32, 75.08], [15.38, 75.14], [15.35, 75.16]],
      },
    ],
  },
  {
    project_id: 'P-104',
    name: 'Greenfield Mega Port Rail & Road Link',
    state: 'Odisha',
    status: 'Disputed',
    corridor_name: 'Dhamra Port Dedicated Corridor',
    location: { lat: 20.82, lng: 86.95 },
    total_budget_cr: 3450,
    land_required_ha: 890,
    requestPayload: {
      project: {
        name: 'Greenfield Mega Port Rail & Road Link',
        project_type: 'port',
        region: 'Odisha',
        area: 890.0,
        budget: 3450.0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [86.85, 20.75],
            [87.05, 20.75],
            [87.05, 20.90],
            [86.85, 20.90],
            [86.85, 20.75],
          ],
        ],
      },
    },
    timeline: {
      planned_duration_months: 48,
      planned_start_date: '2022-10-01',
      planned_completion_date: '2026-10-01',
    },
    acquisition_progress: [
      { stage: 'Sec 4(1) Public Notification', percent: 80, status: 'in_progress' },
      { stage: 'Sec 6 Declaration of Acquisition', percent: 35, status: 'in_progress' },
      { stage: 'Sec 11 Enquiry & Valuation', percent: 15, status: 'pending' },
      { stage: 'Sec 19 Award Determination', percent: 0, status: 'pending' },
      { stage: 'Final Possession Handover', percent: 0, status: 'pending' },
    ],
    risk_input_metrics: [
      { category: 'Statutory Notification', metric: 'Gazette Notice Sec 4', value: 'Quashed/In Review', impactLevel: 'severe', detail: 'Public hearings boycotted across 12 coastal villages.' },
      { category: 'Documentation', metric: 'Land Mutation Records', value: '28% Complete', impactLevel: 'severe', detail: 'Mangrove community rights claims under FRA 2006.' },
      { category: 'Judicial / Stay Orders', metric: 'National Green Tribunal', value: 'Stop-Work Injunction', impactLevel: 'severe', detail: 'NGT Eastern Zone order halting acquisition in coastal buffer.' },
      { category: 'Disbursement', metric: 'Direct Bank Transfers', value: '12% Disbursed', impactLevel: 'severe', detail: 'Gram Sabha rejection of collector compensation package.' },
      { category: 'Inter-Agency', metric: 'CRZ & Forest Stage-II', value: 'Rejected/Appealed', impactLevel: 'severe', detail: 'High eco-sensitivity index triggered mandatory realignment.' },
    ],
    parcels: [
      {
        parcel_id: 'PRCL-104-A',
        survey_number: 'Survey #502/K',
        village: 'Bhitarkanika Fringe',
        area_ha: 84.0,
        ownership_type: 'Community Forest Resource',
        status: 'Disputed',
        delay_probability: 0.92,
        risk_level: 'CRITICAL',
        predicted_delay_days: 98,
        primary_impediment: 'NGT stop-work injunction & coastal clearance rejection',
        polygon_points: [[20.78, 86.88], [20.85, 86.96], [20.81, 87.01]],
      },
    ],
  },
];
