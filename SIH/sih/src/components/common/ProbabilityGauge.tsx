import React from 'react';
import { getRiskConfig, getRiskLevel } from '../../constants/risk';
import { RiskBadge } from './RiskBadge';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface ProbabilityGaugeProps {
  probability?: number | null; // Range 0 to 1
  size?: number;
  strokeWidth?: number;
  showBadge?: boolean;
  showScaleLabels?: boolean;
  label?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({
  probability,
  size = 200,
  strokeWidth = 14,
  showBadge = true,
  showScaleLabels = true,
  label = 'Delay Probability',
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <LoadingState message="Calculating probability vector..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || probability === undefined || probability === null) {
    return (
      <div className={`p-4 ${className}`}>
        <EmptyState message="No probability metrics available" />
      </div>
    );
  }

  const clampedProb = Math.min(Math.max(probability, 0), 1);
  const percentage = (clampedProb * 100).toFixed(1);
  const riskLevel = getRiskLevel(clampedProb);
  const riskConfig = getRiskConfig(riskLevel);

  // SVG Gauge calculations (Semi-circle or 240 degree arc)
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  
  // 240-degree arc: from 150deg to 390deg (or -210 to 30)
  // Let's use a 240 degree arc for government GIS gauge styling
  const startAngle = 150;
  const endAngle = 390;
  const angleRange = endAngle - startAngle; // 240 deg
  
  const currentAngle = startAngle + (clampedProb * angleRange);

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, endAngle);
  const progressArc = clampedProb > 0.005 ? describeArc(center, center, radius, startAngle, currentAngle) : '';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.88 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <defs>
            <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          {progressArc && (
            <path
              d={progressArc}
              fill="none"
              stroke={riskConfig.colorHex}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              filter="url(#gaugeShadow)"
            />
          )}

          {/* Gauge Ticks */}
          {[0, 0.3, 0.6, 0.8, 1].map((tickVal) => {
            const tickAngle = startAngle + tickVal * angleRange;
            const innerPt = polarToCartesian(center, center, radius - strokeWidth / 2 - 4, tickAngle);
            const outerPt = polarToCartesian(center, center, radius - strokeWidth / 2 - 10, tickAngle);
            return (
              <line
                key={tickVal}
                x1={innerPt.x}
                y1={innerPt.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-slate-300 dark:text-slate-700"
              />
            );
          })}
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div className="flex items-baseline justify-center font-mono font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            <span className="text-3xl lg:text-4xl">{percentage}</span>
            <span className="text-lg text-slate-500 ml-0.5">%</span>
          </div>
          {showBadge && (
            <div className="mt-2">
              <RiskBadge level={riskLevel} size="sm" />
            </div>
          )}
        </div>
      </div>

      {showScaleLabels && (
        <div className="flex justify-between w-full max-w-[200px] text-[10px] font-mono text-slate-400 dark:text-slate-500 px-2 mt-1">
          <span>0%</span>
          <span>30%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
