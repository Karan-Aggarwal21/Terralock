import React from 'react';
import { Calendar, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
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
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Project Schedule Variance & Timeline Drift
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Planned Contract Milestone vs. Machine Learning Expected vs. 90th Percentile Tail Risk
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Baseline: {baselineDays} Days
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-0.5 rounded font-bold" style={{ color: riskConfig.colorHex, backgroundColor: riskConfig.bgHex }}>
            Forecast: {expectedTotalDays} Days (+{predictedDelayDays}d)
          </span>
        </div>
      </div>

      {/* Visual Gantt Bar Track */}
      <div className="space-y-4 my-2">
        <div className="relative pt-6 pb-2">
          {/* Milestone Pointer: Planned Completion */}
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: baselineWidth }}
          >
            <span className="text-[9px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Planned Completion
            </span>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full my-0.5" />
          </div>

          {/* Milestone Pointer: Expected Delay */}
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${((baselineDays + predictedDelayDays) / maxDays) * 100}%` }}
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: riskConfig.colorHex }}>
              +{predictedDelayDays}d Expected
            </span>
            <div className="w-1.5 h-1.5 rounded-full my-0.5" style={{ backgroundColor: riskConfig.colorHex }} />
          </div>

          {/* Milestone Pointer: P90 Tail */}
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${(p90TotalDays / maxDays) * 100}%` }}
          >
            <span className="text-[9px] font-mono font-bold uppercase text-rose-500 tracking-wider">
              P90: +{p90DelayDays}d
            </span>
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full my-0.5" />
          </div>

          {/* Stacked Progress Track */}
          <div className="h-7 w-full bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex items-stretch border border-slate-200 dark:border-slate-700">
            {/* 1. Baseline Target Schedule */}
            <div
              className="bg-slate-700 dark:bg-slate-600 flex items-center justify-center text-white text-[11px] font-mono font-semibold truncate px-2 transition-all duration-700"
              style={{ width: baselineWidth }}
            >
              Planned Baseline ({baselineDays} Days)
            </div>

            {/* 2. Expected Delay Drift */}
            <div
              className="flex items-center justify-center text-white text-[11px] font-mono font-bold truncate px-1 transition-all duration-700"
              style={{
                width: expectedDelayWidth,
                backgroundColor: riskConfig.colorHex,
              }}
            >
              +{predictedDelayDays}d
            </div>

            {/* 3. P90 Extended Variance Buffer */}
            <div
              className="bg-rose-500/40 border-l border-rose-500 flex items-center justify-center text-rose-800 dark:text-rose-200 text-[10px] font-mono truncate px-1 transition-all duration-700"
              style={{ width: p90ExtraWidth }}
            >
              P90 Buffer
            </div>
          </div>
        </div>

        {/* Milestone Cards Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Baseline Contract Target</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{baselineDays}</span>
              <span className="text-xs text-slate-500">Days ({plannedMonths} mos)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
              Planned: {timeline?.planned_completion_date || 'Q4 2026'}
            </span>
          </div>

          <div
            className="p-3 rounded-lg border"
            style={{ borderColor: `${riskConfig.colorHex}55`, backgroundColor: riskConfig.bgHex }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Expected Delay Drift</span>
              <AlertCircle className="w-3.5 h-3.5" style={{ color: riskConfig.colorHex }} />
            </div>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-xl font-bold" style={{ color: riskConfig.colorHex }}>+{predictedDelayDays}</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Days</span>
            </div>
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5 block">
              Revised: ~{expectedTotalDays} Total Days
            </span>
          </div>

          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">P90 Tail Risk Scenario</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">+{p90DelayDays}</span>
              <span className="text-xs text-slate-500">Days</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 block">
              Worst-Case: ~{p90TotalDays} Total Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
