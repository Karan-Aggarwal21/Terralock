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

  // Sync state during render when project changes (official React pattern)
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                MONTE CARLO SIMULATION ENGINE (F2)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor ID: <strong>{selectedProject.project_id}</strong> • Baseline Expected Delay: <strong>{selectedProject.predicted_delay_days} Days</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Simulation Engine</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Stochastic v2.4</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Control Panel (§6.3) */}
      <SimulationControlPanel
        params={params}
        onChange={(newParams) => {
          setParams(newParams);
          // Instant check for errors
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

      {/* 3. Progress / Loading State while running (§6.3) */}
      {isRunning && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs text-center space-y-3">
          <LoadingState
            message={`Sampling ${params.numSimulations.toLocaleString()} synthetic project lifecycles (${runProgress}%)...`}
            size="md"
          />
          <div className="max-w-md mx-auto w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${runProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Results Block (§6.3) */}
      {!isRunning && result && (
        <>
          <SimulationResultsGrid
            result={result}
            riskLevel={selectedProject.risk_level}
          />

          {/* 5. Distribution / Histogram Chart (§6.3) */}
          <SimulationHistogram
            result={result}
            riskLevel={selectedProject.risk_level}
          />
        </>
      )}

      {/* 6. Statutory Simulation Interpretation Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Stochastic Simulation Methodology Note
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
          Monte Carlo modeling executes iterative pseudo-random sampling across historical infrastructure delays, adjusting for statutory clearance cycles and litigation holding intervals. For corridor <strong>{selectedProject.name}</strong>, with an expected delay of <strong>{result?.expectedDelay || selectedProject.predicted_delay_days} days</strong>, there is an estimated <strong>{((result?.probabilityExceedsThreshold || 0) * 100).toFixed(0)}%</strong> probability that delay will breach the critical threshold of <strong>{params.delayThreshold} days</strong>.
        </p>
      </div>
    </div>
  );
};
