import React from 'react';
import { Link } from 'react-router-dom';
import { Binary, ArrowUpRight } from 'lucide-react';
import { SimulationData } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

export interface MonteCarloSummaryProps {
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
      <div className={`bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <LoadingState message="Executing 10,000 Monte Carlo iterations..." />
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

  if (isEmpty || !simulation) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <EmptyState message="No Monte Carlo simulation distribution available" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);
  const maxVal = Math.max(...simulation.distribution, 1);

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-xl p-6 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-[#f1f5f3]">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
              Monte Carlo Simulation Summary
            </h3>
          </div>
          <span className="text-[11px] font-sans text-[#64748b] block mt-0.5">
            n = {simulation.num_simulations.toLocaleString()} synthetic project lifecycles
          </span>
        </div>

        <Link
          to="/simulation"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4] hover:bg-[#edf7f1] text-xs font-mono font-semibold text-[#244d3b] transition-colors self-start sm:self-auto"
        >
          <span>Full Engine (F7)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
          <span className="text-[10px] font-mono text-[#64748b] uppercase block font-semibold">Expected Delay</span>
          <span className="text-base font-bold font-mono text-[#111827]">
            {simulation.expected_delay} d
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
          <span className="text-[10px] font-mono text-[#64748b] uppercase block font-semibold">Median (P50)</span>
          <span className="text-base font-bold font-mono text-[#111827]">
            {simulation.median_delay} d
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-center">
          <span className="text-[10px] font-mono text-[#991b1b] uppercase block font-semibold">P90 Tail Risk</span>
          <span className="text-base font-bold font-mono text-[#dc2626]">
            {simulation.p90_delay} d
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
          <span className="text-[10px] font-mono text-[#64748b] uppercase block font-semibold">P(&gt;60d Threshold)</span>
          <span className="text-base font-bold font-mono text-[#111827]">
            {(simulation.probability_exceeds_threshold * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Mini Distribution Histogram */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>Min: {simulation.min_delay}d</span>
          <span className="text-[#374151] font-medium font-sans">Simulated Frequency Density</span>
          <span>Max: {simulation.max_delay}d</span>
        </div>

        <div className="h-16 flex items-end gap-1.5 pt-2">
          {simulation.distribution.map((val, i) => {
            const heightPercent = Math.max(Math.round((val / maxVal) * 100), 8);
            const isP90Index = i >= simulation.distribution.length - 2;

            return (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: isP90Index ? riskConfig.colorHex : '#244d3b',
                }}
                title={`Bin ${i + 1}: ~${val} days`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#f1f5f3] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
        <span>CONFIDENCE: 95% BOOTSTRAPPED</span>
        <span className="text-[#244d3b] font-semibold">STOCHASTIC INFERENCE</span>
      </div>
    </div>
  );
};
