import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { RiskFactorSummary } from '../components/dashboard/RiskFactorSummary';
import { GisMapSummary } from '../components/dashboard/GisMapSummary';
import { MonteCarloSummary } from '../components/dashboard/MonteCarloSummary';
import { AcquisitionProgressWidget } from '../components/dashboard/AcquisitionProgressWidget';
import { ProjectAnalysisInputBanner } from '../components/dashboard/ProjectAnalysisInputBanner';
import { ArrowUpRight, Lightbulb } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const DashboardPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Synchronizing project risk intelligence..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Dashboard Telemetry Offline"
        message={error}
        onRetry={refreshProjects}
        fullHeight
      />
    );
  }

  if (!selectedProject) {
    return (
      <EmptyState
        title="No Project Selected"
        message="Please select a project from the top bar to inspect its land acquisition risk telemetry."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);

  return (
    <div className="space-y-6">
      {/* SECTION 0: Dedicated New Project Analysis Input Banner */}
      <section aria-label="Custom Project Analysis">
        <ProjectAnalysisInputBanner />
      </section>

      {/* SECTION 1: Editorial Hero-Style Project Header Banner */}
      <section aria-label="Project Overview" className="bg-white border border-[#E2E7E4] rounded-xl p-6 sm:p-7 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Ambient subtle glow inside header */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#edf5f0]/60 via-transparent to-transparent rounded-full pointer-events-none -z-0 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            {/* Eyebrow */}
            <div>
              <span className="text-[18px] sm:text-[20px] font-bold tracking-wider text-[#527568] uppercase font-sans">
                LAND ACQUISITION RISK INTELLIGENCE
              </span>
            </div>

            {/* Editorial Title: Reduced by 1/4 (~33px) */}
            <h1 className="text-2xl sm:text-[28px] lg:text-[33px] font-extrabold text-[#101827] tracking-[-0.015em] leading-[1.12] font-sans">
              {selectedProject.name}
            </h1>

            {/* Project Context Meta Pills with 2-line spacing */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4 sm:pt-5">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[#F7F8F6] border border-[#E2E7E4] text-[#4B5563]">
                State: <strong className="text-[#101827] ml-1.5">{selectedProject.state || 'Gujarat'}</strong>
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[#edf7f1] border border-[#c6e6d2] text-[#2D7A4F]">
                Status: <strong className="ml-1.5 font-semibold">{selectedProject.status || 'Acquisition In Progress'}</strong>
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[#F7F8F6] border border-[#E2E7E4] text-[#4B5563]">
                Land Scope: <strong className="text-[#101827] ml-1.5">{selectedProject.land_required_ha} Ha</strong>
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[#F7F8F6] border border-[#E2E7E4] text-[#4B5563]">
                Budget: <strong className="text-[#101827] ml-1.5">₹{selectedProject.total_budget_cr} Cr</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Four Primary KPI Cards (16px gap) */}
      <section aria-label="Core Risk Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Delay Probability */}
        <KpiCard
          label="DELAY PROBABILITY"
          value={`${(selectedProject.delay_probability * 100).toFixed(1)}%`}
          riskLevel={selectedProject.risk_level}
          supportingText="Empirical likelihood of schedule slippage"
          action={
            <Link
              to="/risk-analysis"
              className="hover:underline text-[#527568] inline-flex items-center gap-1 font-semibold"
            >
              <span>Assessment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
          highlightBorderColor={riskConfig.colorHex}
        />

        {/* KPI 2: Predicted Delay */}
        <KpiCard
          label="PREDICTED DELAY"
          value={`${selectedProject.predicted_delay_days} DAYS`}
          supportingText={`Expected: ${selectedProject.predicted_delay_range.min}–${selectedProject.predicted_delay_range.max} days range`}
          action={
            <Link
              to="/predictions/delay-days"
              className="hover:underline text-[#527568] inline-flex items-center gap-1 font-semibold"
            >
              <span>Timeline Drift</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {/* KPI 3: Primary Delay Reason (Categorical Insight ~21-22px, Engine Confidence 60%) */}
        <KpiCard
          label="PRIMARY DELAY REASON"
          value={selectedProject.delay_reason}
          isCategorical={true}
          secondaryMetric={{
            label: 'ENGINE CONFIDENCE',
            value: `${(selectedProject.delay_reason_confidence * 100).toFixed(0)}%`,
          }}
          action={
            <Link
              to="/predictions/delay-reason"
              className="hover:underline text-[#527568] inline-flex items-center gap-1 font-semibold"
            >
              <span>Causal Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {/* KPI 4: Risk Score */}
        <KpiCard
          label="NORMALIZED RISK SCORE"
          value={`${(selectedProject.delay_probability * 10).toFixed(1)} / 10`}
          supportingText={`Tier: ${selectedProject.risk_level} (0–10 scaled)`}
          action={
            <Link
              to="/simulation"
              className="hover:underline text-[#527568] inline-flex items-center gap-1 font-semibold"
            >
              <span>Simulation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      </section>

      {/* SECTION 3: Large Risk Probability Trend Chart */}
      <section aria-label="Historical Risk Trajectory">
        <RiskTrendChart
          trend={selectedProject.risk_trend}
          riskLevel={selectedProject.risk_level}
        />
      </section>

      {/* SECTION 4: Risk Factor Contribution + Supporting Insight (16px gap) */}
      <section aria-label="Risk Factors & Insight" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RiskFactorSummary
            factors={selectedProject.risk_factors}
            riskLevel={selectedProject.risk_level}
          />
        </div>

        {/* Supporting Insight Card */}
        <div className="bg-white border border-[#E2E7E4] rounded-xl p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-[#E2E7E4]">
              <div className="p-1.5 rounded-lg bg-[#edf7f1] border border-[#c6e6d2] text-[#2D7A4F]">
                <Lightbulb className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold tracking-tight text-[#101827] font-sans">
                Predictive Intelligence Insight
              </h3>
            </div>

            <div className="space-y-3.5 text-sm leading-relaxed text-[#374151] font-sans">
              <p>
                Telemetry for <strong className="text-[#101827] font-semibold">{selectedProject.name}</strong> indicates a
                composite delay probability of <strong className="text-[#101827] font-semibold">{(selectedProject.delay_probability * 100).toFixed(1)}%</strong>,
                predominantly governed by <strong className="text-[#101827] font-semibold">{selectedProject.delay_reason}</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-[#F7F8F6] border border-[#E2E7E4] text-[#4B5563] text-xs sm:text-[13px] leading-normal">
                Statutory milestones require proactive land records regularization and district-level committee review
                to curb schedule drift beyond the expected <strong className="text-[#101827] font-semibold">{selectedProject.predicted_delay_range.min}–{selectedProject.predicted_delay_range.max} day</strong> envelope.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E7E4]">
            <Link
              to="/explainability"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D7A4F] hover:bg-[#236340] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs hover:shadow font-sans"
            >
              <span>Inspect Causal Attributions</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 & 6: GIS Spatial Risk Summary + Monte Carlo Simulation Summary (16px gap) */}
      <section aria-label="GIS and Simulation Modules" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SECTION 5: GIS Risk Summary */}
        <GisMapSummary
          location={selectedProject.location}
          riskLevel={selectedProject.risk_level}
          corridorName={selectedProject.corridor_name}
          state={selectedProject.state}
          landRequiredHa={selectedProject.land_required_ha}
          totalBudgetCr={selectedProject.total_budget_cr}
          status={selectedProject.status}
        />

        {/* SECTION 6: Monte Carlo Simulation Summary */}
        <MonteCarloSummary
          simulation={selectedProject.simulation}
          riskLevel={selectedProject.risk_level}
        />
      </section>

      {/* SECTION 7: Statutory Acquisition Progress Workflow */}
      <section aria-label="Statutory Acquisition Milestones">
        <AcquisitionProgressWidget
          stages={selectedProject.acquisition_progress}
          status={selectedProject.status}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
