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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
      {/* 1. Expected Delay */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-[#718d7c]">
              Expected Delay
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f4f7f5] border border-[#e2e8e4] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#244d3b]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1f2937]">
              +{result.expectedDelay}
            </span>
            <span className="text-xs font-semibold text-[#6b7280]">Days</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280]">
          Distribution Parametric Mean
        </div>
      </div>

      {/* 2. Median Delay */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-[#718d7c]">
              Median Delay (P50)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f4f7f5] border border-[#e2e8e4] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#244d3b]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1f2937]">
              +{result.medianDelay}
            </span>
            <span className="text-xs font-semibold text-[#6b7280]">Days</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280]">
          50th Percentile Empirical Midpoint
        </div>
      </div>

      {/* 3. P90 Tail Risk */}
      <div
        className="bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between"
        style={{ borderColor: `${riskConfig.colorHex}55` }}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-[#dc2626]">
              P90 Extreme Tail Delay
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#dc2626]">
              +{result.p90Delay}
            </span>
            <span className="text-xs font-semibold text-[#6b7280]">Days</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280]">
          90% Severe Tail Horizon Ceiling
        </div>
      </div>

      {/* 4. Probability Exceeds Threshold */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-[#718d7c]">
              P(&gt;{result.delayThreshold}d Threshold)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f4f7f5] border border-[#e2e8e4] flex items-center justify-center">
              <AlertTriangle className={`w-4 h-4 ${exceedsHighProb ? 'text-amber-500' : 'text-[#244d3b]'}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${exceedsHighProb ? 'text-[#b45309]' : 'text-[#1f2937]'
                }`}
            >
              {(result.probabilityExceedsThreshold * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#edf2ee] text-[11px] font-mono text-[#6b7280]">
          Likelihood of Exceeding Tolerance
        </div>
      </div>
    </div>
  );
};
