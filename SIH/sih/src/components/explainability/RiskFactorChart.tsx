import React, { useState } from 'react';
import { RiskFactor } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { getFactorDetail } from '../../constants/factorExplanations';
import { Info } from 'lucide-react';

export interface RiskFactorChartProps {
  factors?: RiskFactor[];
  riskFactors?: RiskFactor[];
  riskLevel: RiskLevel;
  selectedFactorName?: string | null;
  onSelectFactor?: (name: string) => void;
  className?: string;
}

export const RiskFactorChart: React.FC<RiskFactorChartProps> = ({
  factors,
  riskFactors,
  riskLevel,
  selectedFactorName,
  onSelectFactor,
  className = '',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const factorList = factors || riskFactors || [];
  const riskConfig = getRiskConfig(riskLevel);

  const sortedFactors = [...factorList].sort((a, b) => b.importance - a.importance);
  const maxImportance = Math.max(...sortedFactors.map((f) => f.importance), 0.01);

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-[#f1f5f3]">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
            Risk Factor Contribution Distribution
          </h3>
          <p className="text-xs text-[#64748b] font-sans mt-0.5">
            Hover or tap any factor to inspect plain-language driver telemetry
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#64748b] bg-[#f8faf9] px-2.5 py-1 rounded-lg border border-[#e2e8e4] self-start sm:self-auto">
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
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#244d3b] bg-[#edf7f1] shadow-xs'
                  : 'border-[#e2e8e4] hover:border-[#cbd5e1] bg-[#f8faf9]/60 hover:bg-[#f8faf9]'
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
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-2 max-w-[78%] truncate">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#e2e8e4] text-[#374151]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-[#111827] truncate font-sans text-sm">
                    {factor.name}
                  </span>
                  <span className="text-[11px] text-[#64748b] hidden sm:inline truncate font-sans">
                    • {detail.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-[#111827] font-mono text-sm">
                    {percent}%
                  </span>
                  <Info className="w-3.5 h-3.5 text-[#94a3b8] hover:text-[#244d3b]" />
                </div>
              </div>

              {/* Proportional Bar */}
              <div className="w-full bg-[#f1f5f3] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: barWidth,
                    backgroundColor: idx === 0 ? riskConfig.colorHex : idx === 1 ? '#244d3b' : '#64748b',
                  }}
                />
              </div>

              {/* Interactive Tooltip Card on Hover / Focus */}
              {(isHovered || isSelected) && (
                <div className="mt-3 p-3.5 rounded-lg bg-white border border-slate-200/90 text-slate-800 text-xs shadow-md space-y-1.5 font-sans animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] text-[#1e5637] font-semibold uppercase font-mono">
                    <span>{detail.category}</span>
                    <span className="text-slate-500">Rank #{idx + 1} Causal Driver</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {detail.plainExplanation}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Recommended Action:</strong>{' '}
                    {detail.mitigationStrategy}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>METHOD: STATISTICAL ATTRIBUTION INDEX</span>
        <span>ACCESSIBLE PLAIN-LANGUAGE TELEMETRY</span>
      </div>
    </div>
  );
};
