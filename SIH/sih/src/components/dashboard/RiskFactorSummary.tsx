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
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
        <LoadingState message="Ranking risk factors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || !factors || factors.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <EmptyState message="No risk factors computed for this corridor" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);
  // Sort descending by importance
  const sortedFactors = [...factors].sort((a, b) => b.importance - a.importance).slice(0, 5);
  const maxVal = Math.max(...sortedFactors.map((f) => f.importance), 0.01);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Primary Risk Factor Weights (F3)
          </h3>
        </div>

        <Link
          to="/explainability"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Explainability</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5 my-1">
        {sortedFactors.map((factor, idx) => {
          const percent = (factor.importance * 100).toFixed(0);
          const barWidth = `${Math.min(Math.round((factor.importance / maxVal) * 100), 100)}%`;

          return (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                  <span className="text-slate-400 text-[10px] w-4">{idx + 1}.</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                    {factor.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  {percent}% Impact
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: barWidth,
                    backgroundColor: idx === 0 ? riskConfig.colorHex : '#64748b',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>RELATIVE CONTRIBUTION INDEX</span>
        <span>TOP {sortedFactors.length} CONTRIBUTORS</span>
      </div>
    </div>
  );
};
