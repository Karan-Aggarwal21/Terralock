import React, { useState } from 'react';
import { useProject } from '../context';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SimulationControlPanel } from '../components/simulation/SimulationControlPanel';
import { SimulationResultsGrid } from '../components/simulation/SimulationResultsGrid';
import { SimulationHistogram } from '../components/simulation/SimulationHistogram';
import {
  SimulationParameters,
  SimulationResult,
  runMonteCarloSimulation,
  validateSimulationParams,
} from '../utils/simulationEngine';
import { ShieldCheck, Cpu } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const { selectedProject, isLoading: isProjectLoading, error: projectError, refreshProjects } = useProject();

  const [prevProjectId, setPrevProjectId] = useState<string | null>(null);
  const [params, setParams] = useState<SimulationParameters>({
    numSimulations: 10000,
    delayThreshold: 60,
    confidenceLevel: 0.95,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [runProgress, setRunProgress] = useState<number>(0);

  // Sync state during render when project changes
  if (selectedProject && selectedProject.project_id !== prevProjectId) {
    setPrevProjectId(selectedProject.project_id);
    const defaultParams: SimulationParameters = {
      numSimulations: selectedProject.simulation?.num_simulations || 10000,
      delayThreshold: selectedProject.predicted_delay_days > 50 ? 90 : 60,
      confidenceLevel: 0.95,
    };
    setParams(defaultParams);
    setValidationError(null);
    setResult(runMonteCarloSimulation(selectedProject.predicted_delay_days, defaultParams));
  }

  // Reset to project defaults callback
  const handleResetToDefaults = () => {
    if (!selectedProject) return;
    const defaultParams: SimulationParameters = {
      numSimulations: selectedProject.simulation?.num_simulations || 10000,
      delayThreshold: selectedProject.predicted_delay_days > 50 ? 90 : 60,
      confidenceLevel: 0.95,
    };
    setParams(defaultParams);
    setValidationError(null);
    setResult(runMonteCarloSimulation(selectedProject.predicted_delay_days, defaultParams));
  };

  // Execute simulation with progress feedback
  const handleRunSimulation = () => {
    const validation = validateSimulationParams(params);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid parameter input.');
      return;
    }

    if (!selectedProject) return;

    setValidationError(null);
    setIsRunning(true);
    setRunProgress(15);

    const step1 = setTimeout(() => setRunProgress(55), 120);
    const step2 = setTimeout(() => setRunProgress(85), 260);

    const step3 = setTimeout(() => {
      const newResult = runMonteCarloSimulation(
        selectedProject.predicted_delay_days,
        params
      );
      setResult(newResult);
      setRunProgress(100);
      setIsRunning(false);
    }, 450);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  if (isProjectLoading && !selectedProject) {
    return <LoadingState fullHeight message="Initializing Monte Carlo engine..." />;
  }

  if (projectError && !selectedProject) {
    return (
      <ErrorState
        title="Simulation Telemetry Offline"
        message={projectError}
        onRetry={refreshProjects}
        fullHeight
      />
    );
  }

  if (!selectedProject) {
    return (
      <EmptyState
        title="No Project Selected"
        message="Please select a project from the top bar to run stochastic outcome simulations."
        fullHeight
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* 1. Module Header Banner */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                STOCHASTIC ANALYTICS • MONTE CARLO SIMULATION ENGINE (F2)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
              <span className="text-[11px] font-mono text-[#4b5563] bg-[#f4f7f5] px-2 py-0.5 rounded border border-[#e2e8e4]">
                ID: {selectedProject.project_id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101827] tracking-tight leading-tight">
              {selectedProject.name}
            </h1>

            <p className="text-sm text-[#4b5563]">
              Sector Alignment: <strong className="text-[#101827]">{selectedProject.corridor_name || 'Standard Corridor'}</strong> • Baseline Expected Drift: <strong className="text-[#101827]">+{selectedProject.predicted_delay_days} Days</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl border border-[#c6e6d2] bg-[#edf7f1] text-right">
              <span className="text-[10px] font-mono text-[#4b5563] uppercase block font-semibold">Engine Pipeline</span>
              <span className="text-xs font-bold text-[#1e5637] font-mono flex items-center justify-end gap-1.5 mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-[#244d3b]" />
                <span>Stochastic v2.4</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Control Panel */}
      <SimulationControlPanel
        params={params}
        onChange={(newParams) => {
          setParams(newParams);
          const v = validateSimulationParams(newParams);
          if (!v.isValid) {
            setValidationError(v.error || 'Invalid parameter input.');
          } else {
            setValidationError(null);
          }
        }}
        onRun={handleRunSimulation}
        onReset={handleResetToDefaults}
        isRunning={isRunning}
        validationError={validationError}
      />

      {/* 3. Progress / Loading State while running */}
      {isRunning && (
        <div className="bg-white border border-[#e2e8e4] rounded-2xl p-8 shadow-xs text-center space-y-4">
          <LoadingState
            message={`Sampling ${params.numSimulations.toLocaleString()} synthetic project lifecycles (${runProgress}%)...`}
            size="md"
          />
          <div className="max-w-md mx-auto w-full bg-[#edf2ee] h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#244d3b] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${runProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Results Block */}
      {!isRunning && result && (
        <>
          <SimulationResultsGrid
            result={result}
            riskLevel={selectedProject.risk_level}
          />

          {/* 5. Distribution / Histogram Chart */}
          <SimulationHistogram
            result={result}
            riskLevel={selectedProject.risk_level}
          />
        </>
      )}

      {/* Empty State when no result exists */}
      {!isRunning && !result && (
        <div className="bg-white border border-[#e2e8e4] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-[#4b5563]">No simulation results generated yet.</p>
          <button
            type="button"
            onClick={handleRunSimulation}
            className="px-4 py-2 rounded-xl bg-[#244d3b] text-white text-xs font-mono font-bold hover:bg-[#1b3d2e] transition-colors"
          >
            Run Initial Simulation
          </button>
        </div>
      )}

      {/* 6. Statutory Simulation Interpretation Card */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#edf2ee]">
          <ShieldCheck className="w-4 h-4 text-[#244d3b]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
            Stochastic Simulation Methodology & Risk Note
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] space-y-2.5">
          <p className="text-xs sm:text-sm leading-relaxed text-[#374151] font-sans">
            Monte Carlo modeling executes iterative pseudo-random sampling across historical infrastructure delays, adjusting for statutory clearance cycles and litigation holding intervals. For corridor <strong className="text-[#1f2937]">{selectedProject.name}</strong>, with an expected delay of <strong className="text-[#1f2937]">+{result?.expectedDelay || selectedProject.predicted_delay_days} days</strong>, there is an estimated <strong className="text-[#1f2937]">{((result?.probabilityExceedsThreshold || 0) * 100).toFixed(0)}%</strong> probability that delay will breach the critical threshold of <strong className="text-[#1f2937]">{params.delayThreshold} days</strong>.
          </p>

          <div className="pt-2 border-t border-[#e2e8e4] text-xs font-mono text-[#6b7280] flex flex-wrap items-center justify-between gap-2">
            <span>Statistical Seed: <strong>Pseudorandom Uniform</strong></span>
            <span>Sample Distribution: <strong>Log-Normal Kernel</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
