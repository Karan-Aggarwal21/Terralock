import React from 'react';
import { RiskLevel, getRiskConfig } from '../../constants/risk';

export interface RiskBadgeProps {
  level?: RiskLevel;
  riskLevel?: RiskLevel;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDot?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  riskLevel,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const currentLevel: RiskLevel = level || riskLevel || 'LOW';
  const config = getRiskConfig(currentLevel);

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 tracking-wider gap-1.5 font-semibold',
    sm: 'text-xs px-2.5 py-0.5 tracking-wide gap-1.5 font-semibold',
    md: 'text-xs px-3 py-1 tracking-wider gap-2 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 tracking-wider gap-2.5 font-semibold',
    xl: 'text-[19px] sm:text-[20px] px-3.5 py-1 tracking-wider gap-2.5 font-bold',
  }[size];

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2 h-2',
    xl: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border uppercase font-mono transition-colors shadow-2xs ${sizeClasses} ${className}`}
      style={{
        backgroundColor: config.bgHex,
        color: config.colorHex,
        borderColor: `${config.colorHex}35`,
      }}
      role="status"
      aria-label={`Risk Level: ${currentLevel}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${dotSizeClasses}`}
          style={{ backgroundColor: config.colorHex }}
          aria-hidden="true"
        />
      )}
      <span>{currentLevel}</span>
    </span>
  );
};
