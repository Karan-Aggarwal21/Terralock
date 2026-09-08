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
    <div className={`bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f1f5f3]">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
            Ranked Risk-Factor Directory & Mitigation Protocol
          </h3>
          <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
            Operational recommendations for project engineers and revenue officers
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#244d3b]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">Actionable Guidance</span>
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
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#244d3b] bg-[#edf7f1] shadow-xs'
                  : 'border-[#e2e8e4] bg-[#f8faf9] hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-[#e2e8e4]/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isPrimary
                        ? 'bg-[#244d3b] text-white'
                        : 'bg-[#e2e8e4] text-[#374151]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-[#111827] font-sans">
                    {factor.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e2e8e4]/80 text-[#374151]">
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
              <p className="text-xs text-[#374151] leading-relaxed font-sans mb-3">
                {detail.plainExplanation}
              </p>

              {/* Actionable Mitigation Box */}
              <div className="p-3 rounded-lg bg-white border border-[#e2e8e4] text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-[#64748b] font-semibold text-[10px] uppercase">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recommended Mitigation Strategy</span>
                </div>
                <p className="text-[11px] font-sans text-[#4b5563]">
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
