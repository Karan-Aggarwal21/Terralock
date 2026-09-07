import React from 'react';
import { RiskFactor } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { getFactorDetail } from '../../constants/factorExplanations';
import { ShieldCheck, Lightbulb } from 'lucide-react';

interface FactorDetailListProps {
  factors: RiskFactor[];
  riskLevel: RiskLevel;
  selectedFactorName?: string | null;
  onSelectFactor?: (name: string) => void;
  className?: string;
}

export const FactorDetailList: React.FC<FactorDetailListProps> = ({
  factors,
  riskLevel,
  selectedFactorName,
  onSelectFactor,
  className = '',
}) => {
  const riskConfig = getRiskConfig(riskLevel);
  const sortedFactors = [...factors].sort((a, b) => b.importance - a.importance);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Ranked Risk-Factor Directory & Mitigation Protocol
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Operational recommendations for project engineers and revenue officers
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Actionable Guidance</span>
        </div>
      </div>

      <div className="space-y-3">
        {sortedFactors.map((factor, idx) => {
          const detail = getFactorDetail(factor.name);
          const percent = (factor.importance * 100).toFixed(0);
          const isSelected = selectedFactorName === factor.name;
          const isPrimary = idx === 0;

          return (
            <div
              key={factor.name}
              onClick={() => onSelectFactor && onSelectFactor(factor.name)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isPrimary
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                    {factor.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-750 text-slate-600 dark:text-slate-300">
                    {detail.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className="font-bold px-2 py-0.5 rounded"
                    style={{
                      color: isPrimary ? riskConfig.colorHex : undefined,
                      backgroundColor: isPrimary ? riskConfig.bgHex : undefined,
                    }}
                  >
                    {percent}% Relative Weight
                  </span>
                </div>
              </div>

              {/* Plain Language Explanation */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans mb-3">
                {detail.plainExplanation}
              </p>

              {/* Actionable Mitigation Box */}
              <div className="p-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[10px] uppercase">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recommended Mitigation Strategy</span>
                </div>
                <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400">
                  {detail.mitigationStrategy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
