import { THEME_TOKENS } from './theme';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskThresholdConfig {
  level: RiskLevel;
  min: number;
  max: number;
  label: string;
  colorHex: string;
  bgHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const RISK_THRESHOLDS: Record<RiskLevel, RiskThresholdConfig> = {
  LOW: {
    level: 'LOW',
    min: 0,
    max: 0.30,
    label: 'Low Risk',
    colorHex: THEME_TOKENS.colors.risk.low.color,
    bgHex: THEME_TOKENS.colors.risk.low.bg,
    badgeBg: `bg-[${THEME_TOKENS.colors.risk.low.bg}] text-[${THEME_TOKENS.colors.risk.low.text}]`,
    badgeText: `text-[${THEME_TOKENS.colors.risk.low.text}]`,
    badgeBorder: `border-[${THEME_TOKENS.colors.risk.low.border}]`,
  },
  MODERATE: {
    level: 'MODERATE',
    min: 0.30,
    max: 0.60,
    label: 'Moderate Risk',
    colorHex: THEME_TOKENS.colors.risk.moderate.color,
    bgHex: THEME_TOKENS.colors.risk.moderate.bg,
    badgeBg: `bg-[${THEME_TOKENS.colors.risk.moderate.bg}] text-[${THEME_TOKENS.colors.risk.moderate.text}]`,
    badgeText: `text-[${THEME_TOKENS.colors.risk.moderate.text}]`,
    badgeBorder: `border-[${THEME_TOKENS.colors.risk.moderate.border}]`,
  },
  HIGH: {
    level: 'HIGH',
    min: 0.60,
    max: 0.80,
    label: 'High Risk',
    colorHex: THEME_TOKENS.colors.risk.high.color,
    bgHex: THEME_TOKENS.colors.risk.high.bg,
    badgeBg: `bg-[${THEME_TOKENS.colors.risk.high.bg}] text-[${THEME_TOKENS.colors.risk.high.text}]`,
    badgeText: `text-[${THEME_TOKENS.colors.risk.high.text}]`,
    badgeBorder: `border-[${THEME_TOKENS.colors.risk.high.border}]`,
  },
  CRITICAL: {
    level: 'CRITICAL',
    min: 0.80,
    max: 1.00,
    label: 'Critical Risk',
    colorHex: THEME_TOKENS.colors.risk.critical.color,
    bgHex: THEME_TOKENS.colors.risk.critical.bg,
    badgeBg: `bg-[${THEME_TOKENS.colors.risk.critical.bg}] text-[${THEME_TOKENS.colors.risk.critical.text}]`,
    badgeText: `text-[${THEME_TOKENS.colors.risk.critical.text}]`,
    badgeBorder: `border-[${THEME_TOKENS.colors.risk.critical.border}]`,
  },
};

export const getRiskLevel = (probability: number): RiskLevel => {
  if (probability < 0.30) return 'LOW';
  if (probability < 0.60) return 'MODERATE';
  if (probability < 0.80) return 'HIGH';
  return 'CRITICAL';
};

export const getRiskConfig = (level: RiskLevel): RiskThresholdConfig => {
  return RISK_THRESHOLDS[level] || RISK_THRESHOLDS.LOW;
};
