import React from 'react';
import { RiskLevel, getRiskConfig } from '../../constants/risk';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const config = getRiskConfig(level);

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 tracking-wider gap-1',
    sm: 'text-xs px-2 py-0.5 tracking-wide gap-1.5',
    md: 'text-xs px-2.5 py-1 tracking-wider gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 tracking-wider gap-2 font-semibold',
  }[size];

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border uppercase font-mono transition-colors ${config.badgeBg} ${config.badgeBorder} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Risk Level: ${level}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${dotSizeClasses}`}
          style={{ backgroundColor: config.colorHex }}
          aria-hidden="true"
        />
      )}
      <span>{level}</span>
    </span>
  );
};
