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
      <div className={`bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <LoadingState message="Fetching statutory acquisition milestones..." />
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

  if (isEmpty || !stages || stages.length === 0) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <EmptyState message="No statutory acquisition milestones found" />
      </div>
    );
  }

  // Calculate aggregate acquisition completion
  const totalPercent = Math.round(
    stages.reduce((acc, s) => acc + s.percent, 0) / stages.length
  );

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-xl p-6 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#f1f5f3]">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
            Statutory Land Acquisition Progress Tracker
          </h3>
          <p className="text-xs text-[#64748b] font-sans mt-0.5">
            Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR 2013) Milestone Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#64748b] block uppercase">Aggregate Progress</span>
            <span className="text-sm font-bold font-mono text-[#244d3b]">
              {totalPercent}% Executed
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#edf7f1] border border-[#d8e8de] flex items-center justify-center font-mono font-bold text-xs text-[#244d3b]">
            {totalPercent}%
          </div>
        </div>
      </div>

      {/* Workflow Stage Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        {stages.map((stg, i) => {
          const isDone = stg.percent === 100 || stg.status === 'completed';
          const isInProgress = stg.percent > 0 && stg.percent < 100;

          return (
            <div
              key={stg.stage}
              className={`p-4 rounded-xl border transition-all ${isDone
                  ? 'bg-[#f8faf9] border-[#d8e8de]'
                  : isInProgress
                    ? 'bg-[#fefaf4] border-[#fde8cd]'
                    : 'bg-[#f8faf9]/50 border-[#e2e8e4]'
                }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-bold text-[#64748b]">
                  STAGE 0{i + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#244d3b]" />
                ) : isInProgress ? (
                  <Clock className="w-4 h-4 text-[#d97706] animate-pulse" />
                ) : (
                  <CircleDot className="w-4 h-4 text-[#94a3b8]" />
                )}
              </div>

              <div className="text-xs font-semibold text-[#111827] line-clamp-2 h-8 leading-snug font-sans">
                {stg.stage}
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                  <span className="text-[#64748b] capitalize">
                    {stg.status.replace('_', ' ')}
                  </span>
                  <span className="font-bold text-[#111827]">
                    {stg.percent}%
                  </span>
                </div>
                <div className="w-full bg-[#e2e8e4] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isDone
                        ? 'bg-[#244d3b]'
                        : isInProgress
                          ? 'bg-[#d97706]'
                          : 'bg-[#cbd5e1]'
                      }`}
                    style={{ width: `${stg.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#f1f5f3] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#64748b] gap-2">
        <span>CURRENT CORRIDOR DISPOSITION: <strong className="text-[#111827] font-bold uppercase">{status || 'IN ACQUISITION'}</strong></span>
        <span>MANDATORY 12-MONTH SECTION 11 SUNSET CLAUSE ACTIVE</span>
      </div>
    </div>
  );
};
