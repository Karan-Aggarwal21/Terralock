import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowUpRight } from 'lucide-react';
import { RiskFactor } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

interface RiskFactorSummaryProps {
  factors?: RiskFactor[];
  riskLevel: RiskLevel;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const RiskFactorSummary: React.FC<RiskFactorSummaryProps> = ({
  factors,
  riskLevel,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <LoadingState message="Ranking risk factors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || !factors || factors.length === 0) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <EmptyState message="No risk factors computed for this corridor" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);
  // Sort descending by importance
  const sortedFactors = [...factors].sort((a, b) => b.importance - a.importance).slice(0, 5);
  const maxVal = Math.max(...sortedFactors.map((f) => f.importance), 0.01);

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-xl p-6 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-[#f1f5f3]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#edf7f1] border border-[#c6e6d2] text-[#2D7A4F]">
            <BrainCircuit className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-[15px] font-bold tracking-tight text-[#101827] font-sans">
              Primary Risk Factor Weights
            </h3>
            <span className="text-[11px] font-medium text-[#64748B] font-sans">Feature attribution derived from ML gradient booster</span>
          </div>
        </div>

        <Link
          to="/explainability"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4] hover:bg-[#edf7f1] text-xs font-semibold text-[#2D7A4F] transition-colors self-start sm:self-auto font-sans"
        >
          <span>Explainability (F3)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4 my-2">
        {sortedFactors.map((factor, idx) => {
          const percent = (factor.importance * 100).toFixed(0);
          const barWidth = `${Math.min(Math.round((factor.importance / maxVal) * 100), 100)}%`;

          return (
            <div key={factor.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5 truncate max-w-[75%]">
                  <span className="w-6 h-6 rounded-md bg-[#edf7f1] border border-[#c6e6d2] flex items-center justify-center text-xs font-bold text-[#2D7A4F] font-sans shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-[#101827] font-semibold truncate font-sans text-[13px] sm:text-[14px]">
                    {factor.name}
                  </span>
                </div>
                <span className="font-bold text-[#101827] shrink-0 font-sans text-xs sm:text-sm">
                  {percent}% Impact
                </span>
              </div>

              <div className="w-full bg-[#f1f5f3] h-3 rounded-full overflow-hidden p-0.5 border border-[#e2e7e4]/60">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{
                    width: barWidth,
                    backgroundColor: idx === 0 ? riskConfig.colorHex : idx === 1 ? '#2D7A4F' : '#64748b',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#f1f5f3] text-xs text-[#64748B] flex items-center justify-between font-sans">
        <span className="font-medium">RELATIVE CONTRIBUTION INDEX</span>
        <span className="font-bold text-[#101827]">TOP {sortedFactors.length} CONTRIBUTORS</span>
      </div>
    </div>
  );
};
