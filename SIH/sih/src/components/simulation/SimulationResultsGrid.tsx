import React from 'react';
import { SimulationResult } from '../../utils/simulationEngine';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { Clock, ShieldAlert, Target, AlertTriangle } from 'lucide-react';

interface SimulationResultsGridProps {
  result: SimulationResult;
  riskLevel: RiskLevel;
  className?: string;
}

export const SimulationResultsGrid: React.FC<SimulationResultsGridProps> = ({
  result,
  riskLevel,
  className = '',
}) => {
  const riskConfig = getRiskConfig(riskLevel);
  const exceedsHighProb = result.probabilityExceedsThreshold > 0.35;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* 1. Expected Delay */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-500 dark:text-slate-400">
              Expected Delay (Mean)
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {result.expectedDelay}
            </span>
            <span className="text-sm font-semibold text-slate-500">Days</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
          Distribution Mean Average
        </div>
      </div>

      {/* 2. Median Delay */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-500 dark:text-slate-400">
              Median Delay (P50)
            </span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {result.medianDelay}
            </span>
            <span className="text-sm font-semibold text-slate-500">Days</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
          50th Percentile Midpoint
        </div>
      </div>

      {/* 3. P90 Delay */}
      <div
        className="bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-xs flex flex-col justify-between"
        style={{ borderLeftWidth: '4px', borderLeftColor: riskConfig.colorHex }}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-500 dark:text-slate-400">
              P90 Worst-Case Delay
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {result.p90Delay}
            </span>
            <span className="text-sm font-semibold text-slate-500">Days</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
          1-in-10 Extreme Tail Risk
        </div>
      </div>

      {/* 4. Probability > Threshold */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-500 dark:text-slate-400 truncate">
              Probability &gt; {result.delayThreshold} Days
            </span>
            <AlertTriangle className={`w-4 h-4 ${exceedsHighProb ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span
              className={`text-3xl font-bold tracking-tight ${
                exceedsHighProb ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {(result.probabilityExceedsThreshold * 100).toFixed(0)}%
            </span>
            <span className="text-xs font-semibold text-slate-500">of synthetic trials</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
          Threshold Breach Likelihood
        </div>
      </div>
    </div>
  );
};
