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
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                PREDICTIVE ANALYTICS • SCHEDULE DELAY DAYS (F4)
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
              Sector Alignment: <strong className="text-[#101827]">{selectedProject.corridor_name || 'Standard Corridor'}</strong> • State: <strong className="text-[#101827]">{selectedProject.state || 'National'}</strong>
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
              to="/predictions/delay-reason"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#244d3b] hover:bg-[#1b3d2e] text-white text-xs font-mono font-bold shadow-xs transition-colors"
            >
              <span>Delay Reason (F5)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Forecast & Confidence Intervals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionCard
            label="Predicted Acquisition Schedule Delay"
            predictionValue={`+${selectedProject.predicted_delay_days}`}
            unit="Days"
            range={{
              min: selectedProject.predicted_delay_range.min,
              max: selectedProject.predicted_delay_range.max,
              unit: 'Days',
            }}
            confidence={selectedProject.delay_reason_confidence}
            reasonText={`Primary Schedule Driver: ${selectedProject.delay_reason}`}
            badge={<RiskBadge level={selectedProject.risk_level} size="sm" />}
            icon={<Clock className="w-4 h-4 text-[#244d3b]" />}
            footerContent={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#4b5563]">
                  Monte Carlo 90th Percentile Drift: <strong className="text-[#1f2937]">+{selectedProject.simulation.p90_delay} Days</strong>
                </span>
                <Link
                  to="/simulation"
                  className="text-[#244d3b] hover:text-[#1b3d2e] inline-flex items-center gap-1 font-bold"
                >
                  <span>Inspect Simulation Histogram</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            }
          />
        </div>

        {/* Confidence Interval & Schedule Risk Summary */}
        <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#edf2ee]">
              <BarChart3 className="w-4 h-4 text-[#244d3b]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
                Confidence & Range Intervals
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">50% Median Projection</span>
                <span className="text-lg font-bold text-[#1f2937] block mt-0.5">
                  +{selectedProject.simulation.median_delay} Days
                </span>
                <span className="text-[11px] text-[#6b7280] block mt-0.5 font-sans">Central tendency across 10,000 runs</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">80% Parametric Confidence Band</span>
                <span className="text-lg font-bold text-[#1f2937] block mt-0.5">
                  {selectedProject.predicted_delay_range.min} – {selectedProject.predicted_delay_range.max} Days
                </span>
                <span className="text-[11px] text-[#6b7280] block mt-0.5 font-sans">Statistical interquartile range</span>
              </div>

              <div
                className="p-3.5 rounded-xl border"
                style={{
                  borderColor: `${riskConfig.colorHex}44`,
                  backgroundColor: riskConfig.bgHex,
                }}
              >
                <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">90% Extreme Tail Delay (P90)</span>
                <span className="text-lg font-bold block mt-0.5" style={{ color: riskConfig.colorHex }}>
                  +{selectedProject.simulation.p90_delay} Days
                </span>
                <span className="text-[11px] text-[#6b7280] block mt-0.5 font-sans">Tail risk mitigation threshold</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280] flex items-center justify-between">
            <span>REGRESSOR STATUS: STABLE</span>
            <span className="text-[#244d3b] font-bold">R² = 0.89</span>
          </div>
        </div>
      </div>

      {/* 3. Timeline Visualization Component */}
      <TimelineVisualization
        timeline={selectedProject.timeline}
        predictedDelayDays={selectedProject.predicted_delay_days}
        p90DelayDays={selectedProject.simulation.p90_delay}
        riskLevel={selectedProject.risk_level}
      />

      {/* 4. Schedule Impact Qualitative Advisory */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#edf2ee]">
          <AlertOctagon className="w-4 h-4 text-[#244d3b]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
            Executive Schedule & Milestone Advisory
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] space-y-2.5">
          <p className="text-xs sm:text-sm leading-relaxed text-[#374151] font-sans">
            The predicted drift of <strong className="text-[#1f2937]">+{selectedProject.predicted_delay_days} days</strong> will defer physical land possession past the contractual baseline handover date. It is advised to prioritize early administrative settlement on <strong className="text-[#1f2937]">{selectedProject.delay_reason}</strong> to compress schedule drift towards the minimum threshold of <strong className="text-[#1f2937]">{selectedProject.predicted_delay_range.min} days</strong>.
          </p>

          <div className="pt-2.5 border-t border-[#e2e8e4] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6b7280]">
            <span>Statutory Notification Window: <strong>30-Day Window Active</strong></span>
            <span className="text-[#244d3b] font-bold">Mitigation Target: &lt; {selectedProject.predicted_delay_range.min} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
