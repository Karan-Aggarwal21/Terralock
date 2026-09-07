import React, { ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface KpiCardProps {
  title: string;
  value?: string | number | null;
  subtext?: string | ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  highlightBorderColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  badge,
  icon,
  trend,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  emptyMessage,
  className = '',
  highlightBorderColor,
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3" />
        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden ${className}`}>
        <ErrorState message={error} onRetry={onRetry} className="p-4" />
      </div>
    );
  }

  if (isEmpty || value === undefined || value === null) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden ${className}`}>
        <EmptyState message={emptyMessage || `No data for ${title}`} className="p-4" />
      </div>
    );
  }

  const borderStyle = highlightBorderColor
    ? { borderLeftWidth: '4px', borderLeftColor: highlightBorderColor }
    : {};

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between ${className}`}
      style={borderStyle}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-500 dark:text-slate-400 truncate">
            {title}
          </span>
          {icon && (
            <span className="text-slate-400 dark:text-slate-500 shrink-0">
              {icon}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 flex-wrap mt-1">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
            {value}
          </span>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtext && <div className="truncate">{subtext}</div>}
          {trend && (
            <span
              className={`shrink-0 font-mono text-[11px] ${
                trend.neutral
                  ? 'text-slate-500'
                  : trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
