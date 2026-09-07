import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { PredictionCard } from '../components/common/PredictionCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { TimelineVisualization } from '../components/predictions/TimelineVisualization';
import { Clock, ArrowRight, ArrowLeft, BarChart3, AlertOctagon } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const DelayDaysPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Running schedule duration forecast model..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Delay Forecast Telemetry Offline"
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
        message="Please select a project to inspect its delay days predictions and timeline modeling."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                PREDICTIVE ANALYTICS / SCHEDULE DELAY DAYS (F4)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor ID: <strong>{selectedProject.project_id}</strong> • Sector: <strong>{selectedProject.corridor_name || 'Standard Regional Alignment'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/predictions/delay-reason"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium shadow-xs transition-colors"
            >
              <span>Delay Reason Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Forecast Section: Reusing PredictionCard from CP1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionCard
            title="Predicted Acquisition Schedule Delay (F4)"
            predictionValue={`${selectedProject.predicted_delay_days}`}
            unit="Days"
            range={{
              min: selectedProject.predicted_delay_range.min,
              max: selectedProject.predicted_delay_range.max,
              unit: 'Days',
            }}
            confidence={selectedProject.delay_reason_confidence}
            reasonText={`Top Delay Driver: ${selectedProject.delay_reason}`}
            badge={<RiskBadge level={selectedProject.risk_level} size="sm" />}
            icon={<Clock className="w-4 h-4 text-emerald-500" />}
            footerContent={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span>Monte Carlo 90th Percentile Drift: <strong>+{selectedProject.simulation.p90_delay} Days</strong></span>
                <Link
                  to="/simulation"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Inspect Simulation Histogram</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            }
          />
        </div>

        {/* Confidence Interval & Schedule Risk Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Confidence Intervals
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">50% Median Projection</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  +{selectedProject.simulation.median_delay} Days
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Statistical median across 10k simulations</span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">80% Confidence Band</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {selectedProject.predicted_delay_range.min} – {selectedProject.predicted_delay_range.max} Days
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Interquartile parametric bounds</span>
              </div>

              <div className="p-2.5 rounded border" style={{ borderColor: `${riskConfig.colorHex}55`, backgroundColor: riskConfig.bgHex }}>
                <span className="text-[10px] text-slate-500 uppercase block">90% Extreme Tail Delay</span>
                <span className="text-base font-bold" style={{ color: riskConfig.colorHex }}>
                  +{selectedProject.simulation.p90_delay} Days
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Critical tail risk mitigation ceiling</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>MODEL: REGRESSOR v2.1</span>
            <span className="text-emerald-500 font-bold">R² = 0.89</span>
          </div>
        </div>
      </div>

      {/* 3. Timeline Visualization Component (§6.4) */}
      <TimelineVisualization
        timeline={selectedProject.timeline}
        predictedDelayDays={selectedProject.predicted_delay_days}
        p90DelayDays={selectedProject.simulation.p90_delay}
        riskLevel={selectedProject.risk_level}
      />

      {/* 4. Schedule Impact Qualitative Advisory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Project Officer Schedule Advisory
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
          The predicted drift of <strong>{selectedProject.predicted_delay_days} days</strong> will defer physical possession past the contractual baseline milestone. It is strongly recommended to initiate early administrative interventions on <strong>{selectedProject.delay_reason}</strong> to compress the expected schedule delay towards the minimum boundary of <strong>{selectedProject.predicted_delay_range.min} days</strong>.
        </p>
      </div>
    </div>
  );
};
