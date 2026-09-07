import React, { useState } from 'react';
import { RiskFactor } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { getFactorDetail } from '../../constants/factorExplanations';
import { Info } from 'lucide-react';

interface RiskFactorChartProps {
  factors: RiskFactor[];
  riskLevel: RiskLevel;
  selectedFactorName?: string | null;
  onSelectFactor?: (name: string) => void;
  className?: string;
}

export const RiskFactorChart: React.FC<RiskFactorChartProps> = ({
  factors,
  riskLevel,
  selectedFactorName,
  onSelectFactor,
  className = '',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const riskConfig = getRiskConfig(riskLevel);

  const sortedFactors = [...factors].sort((a, b) => b.importance - a.importance);
  const maxImportance = Math.max(...sortedFactors.map((f) => f.importance), 0.01);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Risk Factor Contribution Distribution (§6.7)
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Hover or tap any factor to inspect plain-language driver telemetry
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Normalized Share (100%)
        </span>
      </div>

      <div className="space-y-4 my-2">
        {sortedFactors.map((factor, idx) => {
          const percent = (factor.importance * 100).toFixed(0);
          const barWidth = `${Math.min(Math.round((factor.importance / maxImportance) * 100), 100)}%`;
          const detail = getFactorDetail(factor.name);
          const isSelected = selectedFactorName === factor.name;
          const isHovered = activeTooltip === factor.name;

          return (
            <div
              key={factor.name}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
              onClick={() => onSelectFactor && onSelectFactor(factor.name)}
              onMouseEnter={() => setActiveTooltip(factor.name)}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip(factor.name)}
              onBlur={() => setActiveTooltip(null)}
              tabIndex={0}
              role="button"
              aria-label={`${factor.name}: ${percent}% contribution`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <div className="flex items-center gap-2 max-w-[75%] truncate">
                  <span className="text-slate-400 text-[10px] w-4 font-bold">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {factor.name}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline truncate">
                    ({detail.category})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {percent}%
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                </div>
              </div>

              {/* Proportional Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: barWidth,
                    backgroundColor: idx === 0 ? riskConfig.colorHex : '#64748b',
                  }}
                />
              </div>

              {/* Interactive Tooltip Card on Hover / Focus */}
              {(isHovered || isSelected) && (
                <div className="mt-2.5 p-3 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs shadow-lg animate-in fade-in duration-150 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 dark:text-emerald-700 font-bold uppercase">
                    <span>{detail.category}</span>
                    <span>Rank #{idx + 1} Driver</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-sans text-slate-200 dark:text-slate-800">
                    {detail.plainExplanation}
                  </p>
                  <div className="pt-1 border-t border-slate-800 dark:border-slate-300 text-[10px] text-slate-400 dark:text-slate-600 font-sans">
                    <strong className="text-slate-300 dark:text-slate-700">Mitigation:</strong> {detail.mitigationStrategy}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>EXPLAINABILITY METHOD: ATTRIBUTION INDEX</span>
        <span>ZERO MACHINE LEARNING JARGON</span>
      </div>
    </div>
  );
};
