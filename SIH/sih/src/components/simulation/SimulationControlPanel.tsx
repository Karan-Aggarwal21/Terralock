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
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Sliders className="w-4 h-4 text-emerald-500" />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          Simulation Parameters Control Panel (§6.3)
        </h3>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2 text-xs font-mono text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Param 1: Number of simulations */}
        <div className="space-y-1.5">
          <label
            htmlFor="sim-count-input"
            className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 block"
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
            className="w-full px-3 py-2 text-sm font-mono rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
          />
          <span className="text-[10px] font-mono text-slate-400 block">
            Range: 100 to 100,000 synthetic runs
          </span>
        </div>

        {/* Param 2: Delay threshold */}
        <div className="space-y-1.5">
          <label
            htmlFor="delay-threshold-input"
            className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 block"
          >
            Critical Delay Threshold (Days)
          </label>
          <input
            id="delay-threshold-input"
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
            className="w-full px-3 py-2 text-sm font-mono rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors"
          />
          <span className="text-[10px] font-mono text-slate-400 block">
            Tolerance threshold for project breach
          </span>
        </div>

        {/* Param 3: Confidence level */}
        <div className="space-y-1.5">
          <label
            htmlFor="confidence-level-select"
            className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 block"
          >
            Confidence Level
          </label>
          <select
            id="confidence-level-select"
            disabled={isRunning}
            value={params.confidenceLevel}
            onChange={(e) =>
              onChange({
                ...params,
                confidenceLevel: parseFloat(e.target.value),
              })
            }
            className="w-full px-3 py-2 text-sm font-mono rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-colors cursor-pointer"
          >
            <option value={0.8}>80% (Broad Operational Target)</option>
            <option value={0.9}>90% (P90 Infrastructure Standard)</option>
            <option value={0.95}>95% (High Statistical Rigor)</option>
            <option value={0.99}>99% (Ultra-Conservative Safeguard)</option>
          </select>
          <span className="text-[10px] font-mono text-slate-400 block">
            Statistical certainty boundary
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-slate-500">
          STATUS: {isRunning ? 'EXECUTING SIMULATION MATRIX...' : 'READY FOR EXECUTION'}
        </span>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="reset-simulation-btn"
            onClick={onReset}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            id="run-simulation-btn"
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
