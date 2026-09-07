import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { KpiCard } from '../components/common/KpiCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { RiskFactorSummary } from '../components/dashboard/RiskFactorSummary';
import { GisMapSummary } from '../components/dashboard/GisMapSummary';
import { MonteCarloSummary } from '../components/dashboard/MonteCarloSummary';
import { AcquisitionProgressWidget } from '../components/dashboard/AcquisitionProgressWidget';
import { Clock, AlertTriangle, Scale, Target, ArrowUpRight } from 'lucide-react';
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
      {/* 1. Project Risk Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                PROJECT RISK OVERVIEW [{selectedProject.project_id}]
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Corridor: <strong className="text-slate-700 dark:text-slate-300">{selectedProject.corridor_name || 'Primary Section'}</strong></span>
              <span>•</span>
              <span>State: <strong className="text-slate-700 dark:text-slate-300">{selectedProject.state || 'National'}</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-slate-700 dark:text-slate-300">{selectedProject.status || 'Active'}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              to="/risk-analysis"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
            >
              <span>Deep Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/gis-map"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium shadow-xs transition-colors"
            >
              <span>View On GIS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Decision-Making KPI Cards (§6.1 Minimum 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Delay Probability */}
        <KpiCard
          title="Delay Probability"
          value={`${(selectedProject.delay_probability * 100).toFixed(1)}%`}
          badge={<RiskBadge level={selectedProject.risk_level} size="xs" />}
          icon={<AlertTriangle className="w-4 h-4 text-slate-400" />}
          subtext={
            <Link
              to="/risk-analysis"
              className="hover:underline text-slate-600 dark:text-slate-300 inline-flex items-center gap-1"
            >
              <span>Inspect F1 Assessment</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          }
          highlightBorderColor={riskConfig.colorHex}
        />

        {/* KPI 2: Predicted Delay */}
        <KpiCard
          title="Predicted Delay"
          value={`${selectedProject.predicted_delay_days} DAYS`}
          icon={<Clock className="w-4 h-4 text-slate-400" />}
          subtext={`Range: ${selectedProject.predicted_delay_range.min}–${selectedProject.predicted_delay_range.max} days`}
          trend={{
            value: selectedProject.delay_probability > 0.6 ? 'High Schedule Variance' : 'Manageable Drift',
            isPositive: selectedProject.delay_probability < 0.6,
          }}
        />

        {/* KPI 3: Primary Delay Reason */}
        <KpiCard
          title="Primary Delay Reason"
          value={selectedProject.delay_reason}
          icon={<Scale className="w-4 h-4 text-slate-400" />}
          subtext={
            <Link
              to="/predictions/delay-reason"
              className="hover:underline text-slate-600 dark:text-slate-300 inline-flex items-center gap-1"
            >
              <span>Confidence: {(selectedProject.delay_reason_confidence * 100).toFixed(0)}% (F5)</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          }
        />

        {/* KPI 4: Risk Score */}
        <KpiCard
          title="Risk Score"
          value={`${(selectedProject.delay_probability * 10).toFixed(1)} / 10`}
          icon={<Target className="w-4 h-4 text-slate-400" />}
          badge={<span className="text-[10px] font-mono text-slate-400 uppercase">NORMALIZED</span>}
          subtext={
            <Link
              to="/predictions/delay-days"
              className="hover:underline text-slate-600 dark:text-slate-300 inline-flex items-center gap-1"
            >
              <span>View Timeline Predictions</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          }
        />
      </div>

      {/* 3. Primary Analysis Row: Risk Trend Chart + Risk Factor Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskTrendChart
            trend={selectedProject.risk_trend}
            riskLevel={selectedProject.risk_level}
          />
        </div>

        <div>
          <RiskFactorSummary
            factors={selectedProject.risk_factors}
            riskLevel={selectedProject.risk_level}
          />
        </div>
      </div>

      {/* 4. Secondary Analysis Row: GIS Spatial Map Embed + Monte Carlo Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GisMapSummary
          location={selectedProject.location}
          riskLevel={selectedProject.risk_level}
          corridorName={selectedProject.corridor_name}
          state={selectedProject.state}
          landRequiredHa={selectedProject.land_required_ha}
          totalBudgetCr={selectedProject.total_budget_cr}
          status={selectedProject.status}
        />

        <MonteCarloSummary
          simulation={selectedProject.simulation}
          riskLevel={selectedProject.risk_level}
        />
      </div>

      {/* 5. Statutory Acquisition Progress Workflow */}
      <AcquisitionProgressWidget
        stages={selectedProject.acquisition_progress}
        status={selectedProject.status}
      />
    </div>
  );
};
