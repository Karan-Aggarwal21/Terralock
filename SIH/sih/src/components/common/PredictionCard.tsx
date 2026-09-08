import React, { ReactNode } from 'react';
import { RiskLevel } from '../../constants/risk';
import { RiskBadge } from './RiskBadge';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface PredictionCardProps {
  title?: string;
  label?: string;
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
  riskLevel?: RiskLevel;
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
  label,
  predictionValue,
  unit = '',
  range,
  confidence,
  reasonText,
  badge,
  riskLevel,
  icon,
  footerContent,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  const displayTitle = label || title || 'Prediction';

  if (isLoading) {
    return (
      <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs ${className}`}>
        <LoadingState message="Computing predictive inference..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-[#e2e8e4] rounded-2xl shadow-xs overflow-hidden ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || predictionValue === undefined || predictionValue === null) {
    return (
      <div className={`bg-white border border-[#e2e8e4] rounded-2xl shadow-xs overflow-hidden ${className}`}>
        <EmptyState message="No prediction forecast available" />
      </div>
    );
  }

  const renderedBadge = badge || (riskLevel ? <RiskBadge level={riskLevel} size="xs" /> : null);

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between ${className}`}>
      <div>
        {/* Header: Eyebrow Label + Icon + Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f3]">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="p-1.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4] text-[#244d3b]">
                {icon}
              </span>
            )}
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#64748b]">
              {displayTitle}
            </span>
          </div>
          {renderedBadge && <div>{renderedBadge}</div>}
        </div>

        {/* Primary Value Block */}
        <div className="mt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] font-mono sm:font-sans">
              {predictionValue}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-[#64748b] uppercase font-mono tracking-wide">
                {unit}
              </span>
            )}
          </div>

          {reasonText && (
            <p className="mt-3 text-xs sm:text-sm font-normal text-[#4b5563] leading-relaxed font-sans">
              {reasonText}
            </p>
          )}

          {range && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#edf7f1] border border-[#d8e8de] text-xs font-mono text-[#244d3b]">
              <span className="text-[#64748b] uppercase text-[10px] font-semibold">Expected Range:</span>
              <span className="font-bold">
                {range.min}–{range.max} {range.unit || unit}
              </span>
            </div>
          )}

          {confidence !== undefined && (
            <div className="mt-6 pt-4 border-t border-[#f1f5f3]">
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <span className="text-[#64748b]">Statistical Confidence</span>
                <span className="font-bold text-[#111827]">
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-[#f1f5f3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#244d3b] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(confidence * 100, 0), 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {footerContent && (
        <div className="mt-6 pt-4 border-t border-[#f1f5f3] text-xs text-[#64748b]">
          {footerContent}
        </div>
      )}
    </div>
  );
};
