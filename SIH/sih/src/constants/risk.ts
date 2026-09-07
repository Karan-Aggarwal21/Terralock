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
    colorHex: '#10b981', // emerald-500
    bgHex: '#ecfdf5',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
  },
  MODERATE: {
    level: 'MODERATE',
    min: 0.30,
    max: 0.60,
    label: 'Moderate Risk',
    colorHex: '#f59e0b', // amber-500
    bgHex: '#fffbeb',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
  },
  HIGH: {
    level: 'HIGH',
    min: 0.60,
    max: 0.80,
    label: 'High Risk',
    colorHex: '#f97316', // orange-500
    bgHex: '#fff7ed',
    badgeBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800/60',
  },
  CRITICAL: {
    level: 'CRITICAL',
    min: 0.80,
    max: 1.00,
    label: 'Critical Risk',
    colorHex: '#ef4444', // red-500
    bgHex: '#fef2f2',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/60',
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
