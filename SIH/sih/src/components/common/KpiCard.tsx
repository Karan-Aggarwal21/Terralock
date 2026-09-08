import React, { ReactNode } from 'react';
import { RiskLevel } from '../../constants/risk';
import { RiskBadge } from './RiskBadge';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface KpiCardProps {
  label?: string;
  title?: string;
  value?: string | number | null;
  supportingText?: string | ReactNode;
  subtext?: string | ReactNode;
  riskLevel?: RiskLevel;
  badge?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  link?: ReactNode;
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
  isCategorical?: boolean;
  secondaryMetric?: {
    label: string;
    value: string | number;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  title,
  value,
  supportingText,
  subtext,
  riskLevel,
  badge,
  icon: _icon,
  action,
  link,
  trend,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  emptyMessage,
  className = '',
  highlightBorderColor,
  isCategorical = false,
  secondaryMetric,
}) => {
  const displayLabel = label || title || 'Metric';
  const displaySubtext = supportingText || subtext;
  const displayAction = action || link;

  if (isLoading) {
    return (
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-28 bg-[#f1f5f3] rounded animate-pulse" />
          <div className="h-4 w-4 bg-[#f1f5f3] rounded-full animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-[#f1f5f3] rounded animate-pulse mb-3" />
        <div className="h-3 w-40 bg-[#f1f5f3] rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 sm:p-6 shadow-xs overflow-hidden ${className}`}>
        <ErrorState message={error} onRetry={onRetry} className="p-2" />
      </div>
    );
  }

  if (isEmpty || value === undefined || value === null) {
    return (
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 sm:p-6 shadow-xs overflow-hidden ${className}`}>
        <EmptyState message={emptyMessage || `No data for ${displayLabel}`} className="p-2" />
      </div>
    );
  }

  const borderStyle = highlightBorderColor
    ? { borderLeftWidth: '3px', borderLeftColor: highlightBorderColor }
    : {};

  const renderedBadge = badge || (riskLevel ? <RiskBadge level={riskLevel} size="xs" /> : null);

  return (
    <div
      className={`bg-white border border-[#E2E7E4] rounded-xl p-6 sm:p-7 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${className}`}
      style={borderStyle}
    >
      <div className="space-y-3 flex flex-col items-center text-center">
        {/* 1. Uppercase eyebrow label (12–13px) - centralized, no icons */}
        <div className="w-full flex items-center justify-center">
          <span className="text-[12px] sm:text-[13px] uppercase tracking-wider font-semibold font-sans text-[#527568]">
            {displayLabel}
          </span>
        </div>

        {/* 2. Categorical vs Numerical Content */}
        {isCategorical ? (
          <div className="w-full flex flex-col items-center">
            {/* Categorical Reason: reduced by ~1/4 to 20-22px, centralized */}
            <div className="text-[20px] sm:text-[22px] font-bold text-[#101827] leading-[1.2] tracking-[-0.015em] font-sans break-words my-2 text-center">
              {value}
            </div>

            {/* Secondary Metric e.g. Engine Confidence 60% */}
            {secondaryMetric && (
              <div className="mt-3 pt-2.5 border-t border-[#E2E7E4]/70 w-full text-center">
                <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block font-sans">
                  {secondaryMetric.label}
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#101827] font-sans mt-0.5 block">
                  {secondaryMetric.value}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Numerical KPI: reduced by ~1/4 to 30-33px, centralized */}
            <div className="flex flex-col items-center justify-center gap-1.5 my-1">
              <span className="text-[30px] sm:text-[33px] font-bold tracking-tight text-[#101827] font-sans leading-none text-center">
                {value}
              </span>
              {renderedBadge && <div className="shrink-0 mt-0.5">{renderedBadge}</div>}
            </div>

            {/* KPI Description: 11–12px, centralized */}
            {displaySubtext && (
              <p className="text-[11px] sm:text-[12px] text-[#64748B] font-sans leading-relaxed mt-2 text-center max-w-[220px]">
                {displaySubtext}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Action / Link & Optional Trend */}
      {(trend || displayAction) && (
        <div className="mt-4 pt-3 border-t border-[#E2E7E4] flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-sans">
          <div>
            {trend && (
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-md ${
                  trend.neutral
                    ? 'text-[#64748B] bg-[#F7F8F6] border border-[#E2E7E4]'
                    : trend.isPositive
                      ? 'text-[#2D7A4F] bg-[#EDF7F1] border border-[#C6E6D2]'
                      : 'text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>

          {displayAction && (
            <div className="text-[12px] sm:text-[13px] text-[#527568] font-semibold hover:text-[#436257] ml-auto">
              {displayAction}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
