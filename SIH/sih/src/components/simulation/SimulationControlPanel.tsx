import React from 'react';
import { Play, RotateCcw, Sliders, AlertCircle } from 'lucide-react';
import { SimulationParameters } from '../../utils/simulationEngine';

interface SimulationControlPanelProps {
  params: SimulationParameters;
  onChange: (newParams: SimulationParameters) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  validationError?: string | null;
  className?: string;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({
  params,
  onChange,
  onRun,
  onReset,
  isRunning,
  validationError,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs ${className}`}>
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#edf2ee]">
        <Sliders className="w-4 h-4 text-[#244d3b]" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
          Simulation Parameters & Scenario Controls
        </h3>
      </div>

      {validationError && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-start gap-2.5 text-xs font-mono text-[#991b1b]">
          <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Param 1: Number of simulations */}
        <div className="space-y-1.5">
          <label
            htmlFor="sim-count-input"
            className="text-[11px] font-mono font-bold uppercase text-[#4b5563] block tracking-wide"
          >
            Number of Simulations (n)
          </label>
          <input
            id="sim-count-input"
            type="number"
            min={100}
            max={100000}
            step={1000}
            disabled={isRunning}
            value={params.numSimulations}
            onChange={(e) =>
              onChange({
                ...params,
                numSimulations: parseInt(e.target.value, 10),
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] font-mono text-xs focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b] outline-none transition-all"
          />
          <span className="text-[10px] text-[#6b7280] font-mono block">
            Parametric trials (100 to 100,000 runs)
          </span>
        </div>

        {/* Param 2: Delay Threshold */}
        <div className="space-y-1.5">
          <label
            htmlFor="sim-threshold-input"
            className="text-[11px] font-mono font-bold uppercase text-[#4b5563] block tracking-wide"
          >
            Delay Threshold (Days)
          </label>
          <input
            id="sim-threshold-input"
            type="number"
            min={1}
            max={365}
            step={5}
            disabled={isRunning}
            value={params.delayThreshold}
            onChange={(e) =>
              onChange({
                ...params,
                delayThreshold: parseInt(e.target.value, 10),
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] font-mono text-xs focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b] outline-none transition-all"
          />
          <span className="text-[10px] text-[#6b7280] font-mono block">
            Critical statutory milestone tolerance
          </span>
        </div>

        {/* Param 3: Confidence Level */}
        <div className="space-y-1.5">
          <label
            htmlFor="sim-confidence-select"
            className="text-[11px] font-mono font-bold uppercase text-[#4b5563] block tracking-wide"
          >
            Confidence Level
          </label>
          <select
            id="sim-confidence-select"
            disabled={isRunning}
            value={params.confidenceLevel}
            onChange={(e) =>
              onChange({
                ...params,
                confidenceLevel: parseFloat(e.target.value),
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] font-mono text-xs focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b] outline-none transition-all cursor-pointer"
          >
            <option value={0.90}>90% Statistical Confidence</option>
            <option value={0.95}>95% Statistical Confidence</option>
            <option value={0.99}>99% Statistical Confidence</option>
          </select>
          <span className="text-[10px] text-[#6b7280] font-mono block">
            Empirical confidence envelope width
          </span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-6 pt-4 border-t border-[#edf2ee] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-xs font-mono font-semibold text-[#4b5563] hover:bg-[#edf2ee] hover:text-[#1f2937] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          id="run-simulation-btn"
          onClick={onRun}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#244d3b] hover:bg-[#1b3d2e] text-white text-xs font-mono font-bold shadow-xs transition-colors disabled:opacity-75 cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Calculating Trials...' : 'Run Simulation'}</span>
        </button>
      </div>
    </div>
  );
};
