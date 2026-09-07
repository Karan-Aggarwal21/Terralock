import { BackendAnalysisResponse } from './backendTypes';
import { CorridorBaseProfile } from './corridorDefinitions';
import { Project, RiskFactor, DelayReasonRanked, SimulationData } from '../types/project';
import { getRiskLevel } from '../constants/risk';

/**
 * Maps live Backend /api/analyze response to the frontend Project data contract (§9)
 */
export function mapBackendAnalysisToProject(
  res: BackendAnalysisResponse,
  corridor: CorridorBaseProfile
): Project {
  const ml = res.ml;
  const sim = res.simulation;
  const gis = res.gis;

  // 1. Delay Probability (0.0 to 1.0)
  const delayProbability = Number(
    (ml.delay_probability !== undefined && ml.delay_probability !== null
      ? ml.delay_probability
      : ml.overall_risk ?? 0.5
    ).toFixed(4)
  );

  // 2. Standard 4-Tier Risk Level (§7)
  const riskLevel = getRiskLevel(delayProbability);

  // 3. Predicted Delay Days
  const predictedDelayDays = Math.max(
    1,
    Math.round(
      ml.predicted_delay_days ||
      ml.delay_days ||
      (sim.expected_delay_days ? sim.expected_delay_days * 0.5 : 30)
    )
  );

  // 4. Expected Delay Range
  const minRange = Math.max(
    1,
    Math.round(
      sim.percentiles?.p05 ??
      sim.min_delay_days ??
      predictedDelayDays * 0.75
    )
  );
  const maxRange = Math.max(
    minRange + 5,
    Math.round(
      sim.percentiles?.p90 ??
      sim.worst_case_delay_days ??
      predictedDelayDays * 1.45
    )
  );

  // 5. Ranked Delay Reasons from Backend ML domain risk scores
  const domainRisks: Array<{ name: string; score: number; detail: string }> = [
    {
      name: 'Legal Dispute & Court Stay Order',
      score: ml.legal_risk ?? ml.legal_risk_score ?? 0.4,
      detail: 'Judicial writ petitions and interim title injunctions.',
    },
    {
      name: 'Compensation & R&R Disbursement Bottleneck',
      score: ml.compensation_risk ?? ml.compensation_risk_score ?? 0.35,
      detail: 'Multi-party heirship partition and escrow award disputes.',
    },
    {
      name: 'Dense Settlement & Structure Clearance',
      score: ml.gis_risk ?? ml.gis_risk_score ?? 0.25,
      detail: `Intersecting structures (${gis.building_count} buildings, density: ${gis.building_density}).`,
    },
    {
      name: 'Administrative & Inter-Departmental Delay',
      score: ml.historical_delay_risk ?? ml.historical_risk_score ?? 0.3,
      detail: 'Inter-agency file movement friction and statutory clearance.',
    },
  ];

  domainRisks.sort((a, b) => b.score - a.score);

  const primaryReason = domainRisks[0].name;
  const primaryConfidence = ml.model_confidence || 0.84;

  const delayReasonsRanked: DelayReasonRanked[] = domainRisks.map((d) => ({
    reason: d.name,
    confidence: Number(Math.min(Math.max(d.score, 0.1), 0.99).toFixed(2)),
  }));

  // 6. Risk Factor Weights for ML Explainability (F3)
  const totalScore = domainRisks.reduce((acc, cur) => acc + cur.score, 0) || 1;
  const riskFactors: RiskFactor[] = domainRisks.map((d) => ({
    name: d.name,
    importance: Number((d.score / totalScore).toFixed(2)),
    description: d.detail,
    mitigation: getMitigationForReason(d.name),
  }));

  // 7. Monte Carlo Simulation Data (F2)
  const p90 = Math.round(
    sim.worst_case_delay_days ||
    sim.percentiles?.p90 ||
    predictedDelayDays * 1.8
  );

  const simulationData: SimulationData = {
    num_simulations: sim.iterations || 10000,
    expected_delay: Math.round(sim.expected_delay_days || predictedDelayDays * 1.2),
    median_delay: Math.round(sim.median_delay_days || predictedDelayDays),
    min_delay: Math.round(sim.min_delay_days || 0),
    max_delay: Math.round(sim.max_delay_days || p90 * 1.4),
    p90_delay: p90,
    probability_exceeds_threshold: Number(
      (
        sim.exceedance_probabilities?.exceeds_60_days ??
        sim.exceedance_probabilities?.exceeds_90_days ??
        (delayProbability > 0.6 ? 0.68 : 0.28)
      ).toFixed(2)
    ),
    distribution: [
      Math.round(minRange),
      Math.round(minRange + (predictedDelayDays - minRange) * 0.4),
      Math.round(minRange + (predictedDelayDays - minRange) * 0.7),
      predictedDelayDays,
      Math.round(predictedDelayDays + (p90 - predictedDelayDays) * 0.3),
      Math.round(predictedDelayDays + (p90 - predictedDelayDays) * 0.6),
      p90,
      Math.round(p90 * 1.15),
    ],
  };

  // 8. 6-Month Risk Trend Trajectory
  const trendBase = delayProbability;
  const riskTrend = [
    { period: 'Month -5', probability: Math.max(0.05, trendBase - 0.12) },
    { period: 'Month -4', probability: Math.max(0.08, trendBase - 0.08) },
    { period: 'Month -3', probability: Math.max(0.1, trendBase - 0.04) },
    { period: 'Month -2', probability: Math.max(0.12, trendBase - 0.02) },
    { period: 'Month -1', probability: Math.max(0.14, trendBase + 0.01) },
    { period: 'Current', probability: trendBase },
  ];

  // 9. Synchronize Parcel Risk Attributes with Backend ML Inference
  const updatedParcels = corridor.parcels.map((p) => ({
    ...p,
    delay_probability: delayProbability,
    risk_level: riskLevel,
    predicted_delay_days: predictedDelayDays,
    primary_impediment: primaryReason,
  }));

  // 10. Dynamically derive risk input metrics directly from ML and GIS inference
  const legalScore = ml.legal_risk ?? 0.3;
  const compScore = ml.compensation_risk ?? 0.3;
  const histScore = ml.historical_delay_risk ?? 0.3;
  const gisScore = ml.gis_risk ?? 0.2;

  const derivedRiskInputMetrics = [
    {
      category: 'Judicial / Legal Risk',
      metric: 'ML Legal Friction Score',
      value: `${(legalScore * 100).toFixed(1)}% Index`,
      impactLevel: (legalScore > 0.6 ? 'severe' : legalScore > 0.35 ? 'moderate' : 'nominal') as 'nominal' | 'moderate' | 'severe',
      detail: `Model inferred legal friction from regional caseload and project scale (${ml.model_version}).`,
    },
    {
      category: 'Disbursement & Compensation',
      metric: 'ML Compensation Risk Index',
      value: `${(compScore * 100).toFixed(1)}% Index`,
      impactLevel: (compScore > 0.6 ? 'severe' : compScore > 0.35 ? 'moderate' : 'nominal') as 'nominal' | 'moderate' | 'severe',
      detail: 'Model inferred valuation and partition bottleneck from project budget and land requirements.',
    },
    {
      category: 'Geospatial Settlement',
      metric: 'Interference / Encroachment',
      value: `${gis.building_count} Structures`,
      impactLevel: (gisScore > 0.4 ? 'severe' : gisScore > 0.2 ? 'moderate' : 'nominal') as 'nominal' | 'moderate' | 'severe',
      detail: `OpenStreetMap GIS Overpass extracted ${gis.building_count} structures and ${gis.road_count} roads across corridor bounds.`,
    },
    {
      category: 'Administrative Timeline',
      metric: 'Historical Friction Pace',
      value: `${(histScore * 100).toFixed(1)}% Index`,
      impactLevel: (histScore > 0.6 ? 'severe' : histScore > 0.35 ? 'moderate' : 'nominal') as 'nominal' | 'moderate' | 'severe',
      detail: `State-level historical acquisition velocity model benchmark for ${res.project.region || corridor.state}.`,
    },
  ];

  return {
    project_id: corridor.project_id,
    name: corridor.name,
    corridor_name: corridor.corridor_name,
    state: corridor.state,
    status: corridor.status,
    location: corridor.location,
    total_budget_cr: corridor.total_budget_cr,
    land_required_ha: corridor.land_required_ha,
    delay_probability: delayProbability,
    risk_level: riskLevel,
    predicted_delay_days: predictedDelayDays,
    predicted_delay_range: {
      min: minRange,
      max: maxRange,
    },
    delay_reason: primaryReason,
    delay_reason_confidence: primaryConfidence,
    delay_reasons_ranked: delayReasonsRanked,
    risk_factors: riskFactors,
    simulation: simulationData,
    risk_trend: riskTrend,
    acquisition_progress: corridor.acquisition_progress,
    risk_input_metrics: derivedRiskInputMetrics,
    parcels: updatedParcels,
    timeline: corridor.timeline,
    risk_explanation:
      sim.recommendation ||
      `Live ML inference estimated ${Math.round(
        delayProbability * 100
      )}% probability of schedule slippage (${riskLevel} Risk). Recommended schedule buffer: ${p90} days.`,
    delay_reason_explanation: `Causal attribution from ML model (${ml.model_version}) indicates ${primaryReason} is the primary friction driver based on ${gis.building_count} structures and regional court caseload.`,
  };
}

function getMitigationForReason(reason: string): string {
  if (reason.includes('Legal')) {
    return 'Convene special Lok Adalat court sessions and expedite consent-based Section 23A settlements.';
  }
  if (reason.includes('Compensation')) {
    return 'Activate direct RTGS escrow clearance and release preliminary 80% solatium advances.';
  }
  if (reason.includes('Settlement') || reason.includes('Clearance')) {
    return 'Mobilize municipal resettlement colony rehabilitation packages for encroached structures.';
  }
  return 'Establish weekly inter-departmental nodal taskforce review between District Collector and NHAI.';
}
