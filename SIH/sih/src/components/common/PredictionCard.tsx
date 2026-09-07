import React, { ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface PredictionCardProps {
  title: string;
  predictionValue?: string | number | null;
  unit?: string;
  range?: {
    min: number;
    max: number;
    unit?: string;
  };
  confidence?: number; // 0 to 1
  reasonText?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  footerContent?: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  predictionValue,
  unit = '',
  range,
  confidence,
  reasonText,
  badge,
  icon,
  footerContent,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs ${className}`}>
        <LoadingState message="Computing predictive inference..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || predictionValue === undefined || predictionValue === null) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden ${className}`}>
        <EmptyState message="No prediction forecast available" />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            {predictionValue}
          </span>
          {unit && (
            <span className="text-base font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
              {unit}
            </span>
          )}
        </div>

        {reasonText && (
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            {reasonText}
          </p>
        )}

        {range && (
          <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 uppercase text-[10px]">Expected Range:</span>
            <span className="font-semibold">
              {range.min}–{range.max} {range.unit || unit}
            </span>
          </div>
        )}

        {confidence !== undefined && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
              <span className="text-slate-500 dark:text-slate-400">Model Confidence</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-800 dark:bg-slate-200 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(confidence * 100, 0), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {footerContent && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {footerContent}
        </div>
      )}
    </div>
  );
};
