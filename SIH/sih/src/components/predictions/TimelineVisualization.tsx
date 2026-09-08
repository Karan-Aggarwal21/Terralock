import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ProjectTimeline } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';

interface TimelineVisualizationProps {
  timeline?: ProjectTimeline;
  predictedDelayDays: number;
  p90DelayDays: number;
  riskLevel: RiskLevel;
  className?: string;
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  timeline,
  predictedDelayDays,
  p90DelayDays,
  riskLevel,
  className = '',
}) => {
  const riskConfig = getRiskConfig(riskLevel);

  // Default baseline if not specified in project
  const plannedMonths = timeline?.planned_duration_months || 24;
  const baselineDays = plannedMonths * 30; // Approx baseline duration
  const expectedTotalDays = baselineDays + predictedDelayDays;
  const p90TotalDays = baselineDays + p90DelayDays;

  // Timeline proportions
  const maxDays = Math.max(p90TotalDays * 1.08, baselineDays * 1.3);
  const baselineWidth = `${(baselineDays / maxDays) * 100}%`;
  const expectedDelayWidth = `${(predictedDelayDays / maxDays) * 100}%`;
  const p90ExtraWidth = `${((p90DelayDays - predictedDelayDays) / maxDays) * 100}%`;

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#edf2ee]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
              Project Schedule Variance & Timeline Drift
            </h3>
          </div>
          <p className="text-xs text-[#4b5563] font-sans mt-1">
            Contractual Baseline Target vs. Machine Learning Expected Drift vs. 90th Percentile Tail Risk
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-[#f4f7f5] text-[#374151] border border-[#e2e8e4] font-medium">
            Baseline: {baselineDays} Days
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9ca3af]" />
          <span
            className="px-3 py-1 rounded-lg font-bold border"
            style={{
              color: riskConfig.colorHex,
              backgroundColor: riskConfig.bgHex,
              borderColor: `${riskConfig.colorHex}33`,
            }}
          >
            Forecast: {expectedTotalDays} Days (+{predictedDelayDays}d)
          </span>
        </div>
      </div>

      {/* Visual Gantt Bar Track */}
      <div className="space-y-6 my-2">
        <div className="relative pt-7 pb-3">
          {/* Milestone Pointer: Planned Completion */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: baselineWidth }}
          >
            <span className="text-[10px] font-mono text-[#4b5563] font-bold uppercase tracking-wider whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-[#e2e8e4] shadow-2xs">
              Planned Target ({baselineDays}d)
            </span>
            <div className="w-0.5 h-3 bg-[#6b7280] mt-0.5" />
          </div>

          {/* Segmented Timeline Track */}
          <div className="h-7 w-full bg-[#edf2ee] rounded-xl overflow-hidden flex shadow-inner p-0.5">
            {/* 1. Baseline Target Duration */}
            <div
              className="h-full bg-[#244d3b] rounded-l-lg flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all duration-700"
              style={{ width: baselineWidth }}
              title={`Planned Baseline: ${baselineDays} days`}
            >
              Baseline Contract Duration
            </div>

            {/* 2. Expected Delay Drift */}
            <div
              className="h-full transition-all duration-700 flex items-center justify-center text-[10px] font-mono font-bold text-white"
              style={{
                width: expectedDelayWidth,
                backgroundColor: riskConfig.colorHex,
              }}
              title={`Predicted Delay: +${predictedDelayDays} days`}
            >
              +{predictedDelayDays}d
            </div>

            {/* 3. P90 Extreme Tail Buffer */}
            <div
              className="h-full bg-[#dc2626]/85 rounded-r-lg transition-all duration-700 flex items-center justify-center text-[9px] font-mono font-semibold text-white"
              style={{ width: p90ExtraWidth }}
              title={`P90 Tail Risk: +${p90DelayDays} days`}
            >
              P90
            </div>
          </div>
        </div>

        {/* Legend & Details Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#edf2ee] text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
            <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Contractual Start Date</span>
            <span className="font-bold text-[#1f2937] text-sm mt-0.5 block">
              {timeline?.planned_start_date || '2024-01-01'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
            <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Planned Handover</span>
            <span className="font-bold text-[#1f2937] text-sm mt-0.5 block">
              {timeline?.planned_completion_date || '2026-01-01'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca]">
            <span className="text-[10px] text-[#991b1b] uppercase block font-semibold">ML Forecasted Milestone</span>
            <span className="font-bold text-[#dc2626] text-sm mt-0.5 block">
              +{predictedDelayDays} Days Net Drift
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
