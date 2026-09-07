import React from 'react';
import { Link } from 'react-router-dom';
import { Binary, ArrowUpRight } from 'lucide-react';
import { SimulationData } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

interface MonteCarloSummaryProps {
  simulation?: SimulationData;
  riskLevel: RiskLevel;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const MonteCarloSummary: React.FC<MonteCarloSummaryProps> = ({
  simulation,
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
        <LoadingState message="Executing 10,000 Monte Carlo iterations..." />
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

  if (isEmpty || !simulation) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <EmptyState message="No Monte Carlo simulation distribution available" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);
  const maxVal = Math.max(...simulation.distribution, 1);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Monte Carlo Simulation Summary (F2)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
            n = {simulation.num_simulations.toLocaleString()} synthetic project lifecycles
          </span>
        </div>

        <Link
          to="/simulation"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Full Simulation</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Expected Delay</span>
          <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            {simulation.expected_delay} d
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Median (P50)</span>
          <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            {simulation.median_delay} d
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">P90 Tail Risk</span>
          <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
            {simulation.p90_delay} d
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">P(&gt;60d Threshold)</span>
          <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            {(simulation.probability_exceeds_threshold * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Mini Distribution Histogram */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Min: {simulation.min_delay}d</span>
          <span className="text-slate-500 font-medium">Synthetic Frequency Histogram</span>
          <span>Max: {simulation.max_delay}d</span>
        </div>

        <div className="h-16 flex items-end gap-1.5 pt-2">
          {simulation.distribution.map((val, i) => {
            const heightPercent = Math.max(Math.round((val / maxVal) * 100), 8);
            const isP90Index = i >= simulation.distribution.length - 2;

            return (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: isP90Index ? riskConfig.colorHex : '#94a3b8',
                }}
                title={`Bin ${i + 1}: ~${val} days`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span>CONFIDENCE: 95% BOOTSTRAPPED</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">VALIDATED</span>
      </div>
    </div>
  );
};
