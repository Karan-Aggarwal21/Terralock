import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { PredictionCard } from '../components/common/PredictionCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Scale, ArrowRight, ArrowLeft, HelpCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const DelayReasonPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Attributing causal delay drivers..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Delay Reason Telemetry Offline"
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
        message="Please select a project to inspect its delay reason attributions."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);
  const rankedReasons = selectedProject.delay_reasons_ranked || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                PREDICTIVE ANALYTICS / DELAY REASON ATTRIBUTION (F5)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor [{selectedProject.project_id}] • State: <strong>{selectedProject.state || 'National'}</strong>
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
              to="/predictions/delay-days"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
            >
              <span>Delay Days (F4)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Reason Card: Reusing PredictionCard from CP1 (§6.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionCard
            title="Dominant Delay Root Cause (F5)"
            predictionValue={selectedProject.delay_reason}
            unit=""
            confidence={selectedProject.delay_reason_confidence}
            reasonText="Statistical primary impediment identified across statutory notifications, judicial registry records, and local field survey telemetry."
            badge={<RiskBadge level={selectedProject.risk_level} size="sm" />}
            icon={<Scale className="w-4 h-4 text-emerald-500" />}
            footerContent={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span>Associated Predicted Impact: <strong>{selectedProject.predicted_delay_days} Days</strong></span>
                <Link
                  to="/explainability"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Connect to Risk Factor Weights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            }
          />
        </div>

        {/* Causal Confidence Matrix Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Confidence Assessment
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg border" style={{ borderColor: `${riskConfig.colorHex}55`, backgroundColor: riskConfig.bgHex }}>
                <span className="text-[10px] text-slate-500 uppercase block">Model Confidence Score</span>
                <span className="text-2xl font-bold block mt-1" style={{ color: riskConfig.colorHex }}>
                  {(selectedProject.delay_reason_confidence * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">High probability of causal attribution</span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Secondary Reason Margin</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                  +{rankedReasons.length > 1 ? `${((rankedReasons[0].confidence - rankedReasons[1].confidence) * 100).toFixed(0)}%` : 'N/A'} margin
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Separation from runner-up cause</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>MULTI-CLASS CLASSIFIER</span>
            <span className="text-emerald-500 font-bold">TOP-1 ACCURACY</span>
          </div>
        </div>
      </div>

      {/* 3. Ranked List of Secondary Reasons (§6.5) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Ranked Probabilistic Cause Distribution (§6.5 Ranked Breakdown)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Ranked secondary factors contributing to schedule slippage risk
            </span>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {rankedReasons.length} Evaluated Hypotheses
          </span>
        </div>

        <div className="space-y-3">
          {rankedReasons.map((item, idx) => {
            const confPercent = (item.confidence * 100).toFixed(0);
            const isTop = idx === 0;

            return (
              <div
                key={item.reason}
                className={`p-3.5 rounded-lg border transition-colors ${
                  isTop
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50'
                    : 'border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isTop ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.reason}
                    </span>
                    {isTop && (
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Primary Bottleneck
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {confPercent}% Confidence
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${confPercent}%`,
                      backgroundColor: isTop ? riskConfig.colorHex : '#94a3b8',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Qualitative Explanation Connecting Reason Back to Risk Factors (§6.5) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Causal Attribution & Risk Factor Linkage Narrative
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-sans">
            {selectedProject.delay_reason_explanation ||
              `The primary delay cause (${selectedProject.delay_reason}) directly aligns with the top-weighted risk factors recorded for corridor ${selectedProject.name}. Historical project benchmarking indicates that resolving this dispute through fast-track arbitration or dedicated revenue camps can mitigate up to 60% of the projected schedule drift.`}
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-2 text-xs font-mono text-slate-500">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Recommended Mitigation: Engage district revenue collector for joint mediation prior to next statutory hearing.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
