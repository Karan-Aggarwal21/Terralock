import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { ProbabilityGauge } from '../components/common/ProbabilityGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ShieldAlert, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const RiskAnalysisPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Computing probability model vector..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Risk Analysis Telemetry Offline"
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
        message="Please select a project to inspect its delay probability and risk attribution breakdown."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);
  const sortedFactors = [...selectedProject.risk_factors].sort((a, b) => b.importance - a.importance);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                RISK ANALYSIS / PROBABILITY ASSESSMENT (F1)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor [{selectedProject.project_id}] • Jurisdiction: <strong>{selectedProject.state || 'National'}</strong> • Status: <strong>{selectedProject.status || 'Active'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/predictions/delay-days"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
            >
              <span>Delay Predictions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Analytical Section: Gauge Visualization + Plain-Language Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reused ProbabilityGauge from CP1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Delay Probability Vector
            </span>
            <RiskBadge level={selectedProject.risk_level} size="xs" />
          </div>

          <ProbabilityGauge
            probability={selectedProject.delay_probability}
            size={240}
            label="Likelihood of Delay"
            className="my-2"
          />

          <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-left text-xs font-mono text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Risk Classification:</span>
              <strong style={{ color: riskConfig.colorHex }}>{selectedProject.risk_level}</strong>
            </div>
            <div className="flex justify-between">
              <span>Primary Driver:</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{selectedProject.delay_reason}</span>
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Plain-Language Executive Explanation */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Executive Risk Narrative (§6.2 Plain-Language Assessment)
              </h3>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-4">
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                {selectedProject.risk_explanation ||
                  `Project ${selectedProject.name} currently exhibits a ${selectedProject.risk_level} delay probability of ${(selectedProject.delay_probability * 100).toFixed(1)}%. Primary exposure is concentrated in ${selectedProject.delay_reason}, requiring targeted inter-agency administrative coordination to avoid schedule drift beyond ${selectedProject.predicted_delay_days} days.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Threshold Range Standard</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mt-1">
                  {(riskConfig.min * 100).toFixed(0)}% – {(riskConfig.max * 100).toFixed(0)}% ({riskConfig.label})
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Governed by Section 7 Standardized Risk Matrix
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Expected Delay Duration</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mt-1">
                  {selectedProject.predicted_delay_days} Days ({selectedProject.predicted_delay_range.min}–{selectedProject.predicted_delay_range.max}d Range)
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Model Confidence: {(selectedProject.delay_reason_confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>INFERENCE STATUS: VERIFIED</span>
            <Link
              to="/explainability"
              className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Factor Importance Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Contributing Risk Factors Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Contributing Risk Factors & Impact Breakdown
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Identified causality factors contributing to the overall {(selectedProject.delay_probability * 100).toFixed(1)}% score
            </span>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {sortedFactors.length} Tracked Factors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedFactors.map((factor, idx) => {
            const percent = (factor.importance * 100).toFixed(1);
            return (
              <div
                key={factor.name}
                className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                    {factor.name}
                  </span>
                  <span className="font-bold" style={{ color: idx === 0 ? riskConfig.colorHex : undefined }}>
                    {percent}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: idx === 0 ? riskConfig.colorHex : '#64748b',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Underlying Score Inputs Matrix (§6.2 Realism Inputs) */}
      {selectedProject.risk_input_metrics && selectedProject.risk_input_metrics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Statutory & Operational Parameter Inputs (§6.2 Realism Matrix)
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Input metrics feeding the predictive risk engine across administrative, judicial, and survey indicators
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedProject.risk_input_metrics.map((metric) => {
              const isSevere = metric.impactLevel === 'severe';
              const isModerate = metric.impactLevel === 'moderate';

              return (
                <div
                  key={metric.metric}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">{metric.category}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isSevere
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : isModerate
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {isSevere ? (
                        <ShieldAlert className="w-2.5 h-2.5" />
                      ) : isModerate ? (
                        <AlertTriangle className="w-2.5 h-2.5" />
                      ) : (
                        <CheckCircle className="w-2.5 h-2.5" />
                      )}
                      <span>{metric.impactLevel}</span>
                    </span>
                  </div>

                  <span className="font-bold text-slate-800 dark:text-slate-100 block">
                    {metric.metric}
                  </span>

                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Value: {metric.value}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-tight">
                    {metric.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
