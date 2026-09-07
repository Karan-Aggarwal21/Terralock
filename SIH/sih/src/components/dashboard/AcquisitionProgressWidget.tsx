import React from 'react';
import { CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { AcquisitionStage } from '../../types/project';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

interface AcquisitionProgressWidgetProps {
  stages?: AcquisitionStage[];
  status?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const AcquisitionProgressWidget: React.FC<AcquisitionProgressWidgetProps> = ({
  stages,
  status,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
        <LoadingState message="Fetching statutory acquisition milestones..." />
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

  if (isEmpty || !stages || stages.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <EmptyState message="No statutory acquisition milestones found" />
      </div>
    );
  }

  // Calculate aggregate acquisition completion
  const totalPercent = Math.round(
    stages.reduce((acc, s) => acc + s.percent, 0) / stages.length
  );

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Statutory Land Acquisition Workflow (RFCTLARR Act)
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Stage Status: <strong className="text-slate-700 dark:text-slate-300">{status || 'In Progress'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Aggregate Progress:</span>
          <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalPercent}%
          </span>
        </div>
      </div>

      {/* Aggregate Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${totalPercent}%` }}
        />
      </div>

      {/* Milestone Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          return (
            <div
              key={stage.stage}
              className={`p-3 rounded-lg border text-xs font-mono transition-colors ${
                stage.status === 'completed'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : stage.status === 'in_progress'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400 font-semibold">
                  STEP 0{idx + 1}
                </span>
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : stage.status === 'in_progress' ? (
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                ) : (
                  <CircleDot className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate" title={stage.stage}>
                {stage.stage}
              </span>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="capitalize text-[10px] text-slate-500">
                  {stage.status.replace('_', ' ')}
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {stage.percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
