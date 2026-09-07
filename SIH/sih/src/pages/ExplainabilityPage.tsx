import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { RiskFactorChart } from '../components/explainability/RiskFactorChart';
import { FactorDetailList } from '../components/explainability/FactorDetailList';
import { BrainCircuit, ArrowLeft, Shield } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const ExplainabilityPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();
  const [selectedFactorName, setSelectedFactorName] = useState<string | null>(null);

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Deconstructing project risk factor attributions..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Explainability Telemetry Offline"
        message={error}
        onRetry={refreshProjects}
        fullHeight
      />
    );
  }

  if (!selectedProject) {
    return (
      <EmptyState
        title="No Project Selected"
        message="Please select a project to inspect its causal factor attribution breakdown."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                MODEL FACTOR EXPLAINABILITY (F3)
              </span>
              <RiskBadge level={selectedProject.risk_level} size="xs" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor [{selectedProject.project_id}] • State: <strong>{selectedProject.state || 'National'}</strong> • Primary Factor: <strong>{selectedProject.delay_reason}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/risk-analysis"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium shadow-xs transition-colors"
            >
              <span>Risk Analysis (F1)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Executive Explainability Summary Panel (§6.7 Supportive, non-dominant) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <BrainCircuit className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            How the Risk Assessment Engine Attributes Likelihood
          </h3>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-sans">
          The intelligence model evaluates multi-source land acquisition telemetry—including judicial registry filings, gazette declarations, and cadastral survey records. For <strong>{selectedProject.name}</strong>, the composite delay probability of <strong>{(selectedProject.delay_probability * 100).toFixed(1)}%</strong> is driven predominantly by <strong>{selectedProject.delay_reason}</strong>. All factors below are presented in human-readable terms without complex algorithmic jargon.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase block">Total Contributing Drivers</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
              {selectedProject.risk_factors.length} Tracked Factors
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase block">Dominant Driver Share</span>
            <span className="text-lg font-bold block mt-0.5" style={{ color: riskConfig.colorHex }}>
              {(Math.max(...selectedProject.risk_factors.map((f) => f.importance)) * 100).toFixed(0)}% Impact
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase block">Telemetry Alignment</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              100% Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Analytical Content: Horizontal Bar Chart + Ranked Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Horizontal Bar Chart with Tooltips */}
        <RiskFactorChart
          factors={selectedProject.risk_factors}
          riskLevel={selectedProject.risk_level}
          selectedFactorName={selectedFactorName}
          onSelectFactor={setSelectedFactorName}
        />

        {/* Right Column: Ranked Risk Factor Directory & Mitigations */}
        <FactorDetailList
          factors={selectedProject.risk_factors}
          riskLevel={selectedProject.risk_level}
          selectedFactorName={selectedFactorName}
          onSelectFactor={setSelectedFactorName}
        />
      </div>

      {/* 4. Officer Operational Governance Protocol */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Institutional Risk Governance Standards
          </h3>
        </div>

        <div className="space-y-2 text-xs font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            • <strong>Priority Intervention:</strong> Focus administrative bandwidth on the top two factors representing over 50% of the aggregate delay risk.
          </p>
          <p>
            • <strong>Inter-Department Escalation:</strong> Issues involving title regularization or inter-agency clearances should be submitted to the District Level Land Acquisition Monitoring Committee.
          </p>
        </div>
      </div>
    </div>
  );
};
