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
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                PREDICTIVE ANALYTICS • DELAY REASON ATTRIBUTION (F5)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
              <span className="text-[11px] font-mono text-[#4b5563] bg-[#f4f7f5] px-2 py-0.5 rounded border border-[#e2e8e4]">
                ID: {selectedProject.project_id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101827] tracking-tight leading-tight">
              {selectedProject.name}
            </h1>

            <p className="text-sm text-[#4b5563]">
              Sector Alignment: <strong className="text-[#101827]">{selectedProject.corridor_name || 'Standard Corridor'}</strong> • Jurisdiction: <strong className="text-[#101827]">{selectedProject.state || 'National'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#f4f7f5] hover:bg-[#e8f0ec] text-xs font-mono font-bold text-[#244d3b] border border-[#e2e8e4] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/predictions/delay-days"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#244d3b] hover:bg-[#1b3d2e] text-white text-xs font-mono font-bold shadow-xs transition-colors"
            >
              <span>Delay Days (F4)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Reason & Confidence Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionCard
            label="Dominant Delay Root Cause"
            predictionValue={selectedProject.delay_reason}
            unit=""
            confidence={selectedProject.delay_reason_confidence}
            reasonText="Primary legal/operational impediment identified across land revenue registries, gazette notifications, and title verification records."
            badge={<RiskBadge level={selectedProject.risk_level} size="sm" />}
            icon={<Scale className="w-4 h-4 text-[#244d3b]" />}
            footerContent={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#4b5563]">
                  Associated Schedule Drift: <strong className="text-[#1f2937]">+{selectedProject.predicted_delay_days} Days</strong>
                </span>
                <Link
                  to="/explainability"
                  className="text-[#244d3b] hover:text-[#1b3d2e] inline-flex items-center gap-1 font-bold"
                >
                  <span>Connect to Risk Factor Weights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            }
          />
        </div>

        {/* Causal Confidence Matrix Summary */}
        <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#edf2ee]">
              <HelpCircle className="w-4 h-4 text-[#244d3b]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
                Attribution Confidence
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div
                className="p-3.5 rounded-xl border"
                style={{
                  borderColor: `${riskConfig.colorHex}44`,
                  backgroundColor: riskConfig.bgHex,
                }}
              >
                <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Model Confidence Score</span>
                <span className="text-2xl font-bold block mt-1" style={{ color: riskConfig.colorHex }}>
                  {(selectedProject.delay_reason_confidence * 100).toFixed(0)}%
                </span>
                <span className="text-[11px] text-[#6b7280] block mt-0.5 font-sans">Statistically significant causal driver</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Secondary Driver Separation</span>
                <span className="text-sm font-bold text-[#1f2937] block mt-1">
                  +{rankedReasons.length > 1 ? `${((rankedReasons[0].confidence - rankedReasons[1].confidence) * 100).toFixed(0)}%` : 'N/A'} margin
                </span>
                <span className="text-[11px] text-[#6b7280] block mt-0.5 font-sans">Separation over next closest hypothesis</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280] flex items-center justify-between">
            <span>MULTI-CLASS ENGINE</span>
            <span className="text-[#244d3b] font-bold">TOP-1 ACCURACY</span>
          </div>
        </div>
      </div>

      {/* 3. Ranked List of Secondary Reasons */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-[#edf2ee]">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
              Ranked Cause Distribution & Hypotheses
            </h3>
            <p className="text-xs text-[#6b7280] font-sans mt-0.5">
              Probabilistic ranking of secondary factors contributing to project schedule slippage
            </p>
          </div>

          <span className="text-xs font-mono text-[#4b5563] bg-[#f4f7f5] px-3 py-1 rounded-lg border border-[#e2e8e4] self-start sm:self-auto">
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
                className={`p-4 rounded-xl border transition-colors ${isTop
                    ? 'border-[#244d3b]/25 bg-[#f4f8f5]'
                    : 'border-[#e2e8e4] bg-[#fcfdfc] hover:bg-[#f8faf9]'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isTop ? 'bg-[#244d3b] text-white' : 'bg-[#e2e8e4] text-[#4b5563]'
                        }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[#1f2937] font-sans text-sm">
                      {item.reason}
                    </span>
                    {isTop && (
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-md font-bold font-mono bg-[#edf7f1] text-[#1e5637] border border-[#c6e6d2]">
                        Primary Driver
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-[#1f2937] font-mono pl-7 sm:pl-0">
                    {confPercent}% Confidence
                  </span>
                </div>

                <div className="w-full bg-[#e5ece7] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${confPercent}%`,
                      backgroundColor: isTop ? riskConfig.colorHex : '#718d7c',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Qualitative Explanation Connecting Reason Back to Risk Factors */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#edf2ee]">
          <ShieldCheck className="w-4 h-4 text-[#244d3b]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
            Causal Attribution & Statutory Factor Linkage
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#374151] font-sans">
            {selectedProject.delay_reason_explanation ||
              `The primary delay cause (${selectedProject.delay_reason}) directly correlates with high-priority risk indicators recorded for corridor ${selectedProject.name}. Cross-referencing with administrative benchmarks indicates that resolving this dispute through fast-track arbitration or dedicated revenue settlement camps can mitigate up to 60% of the projected schedule drift.`}
          </p>

          <div className="pt-2.5 border-t border-[#e2e8e4] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6b7280]">
            <div className="flex items-center gap-2 text-[#b45309]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>Recommended Action: Convene Special Land Acquisition Officer (SLAO) mediation session before next statutory hearing.</span>
            </div>
            <Link
              to="/explainability"
              className="text-[#244d3b] hover:text-[#1b3d2e] font-bold inline-flex items-center gap-1"
            >
              <span>View Factor Weight Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
