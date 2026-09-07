import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { RiskTrendPoint } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

interface RiskTrendChartProps {
  trend?: RiskTrendPoint[];
  riskLevel: RiskLevel;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({
  trend,
  riskLevel,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
        <LoadingState message="Plotting historical risk vector..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || !trend || trend.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <EmptyState message="No historical risk trend data recorded" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);

  // SVG Chart Geometry
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = trend.map((d, index) => {
    const x = paddingX + (index / (trend.length - 1)) * chartWidth;
    const y = paddingTop + (1 - d.probability) * chartHeight;
    return { x, y, period: d.period, prob: d.probability };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const latestProb = trend[trend.length - 1]?.probability ?? 0;
  const initialProb = trend[0]?.probability ?? 0;
  const diff = latestProb - initialProb;
  const isRising = diff > 0.01;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Risk Probability Trend (6-Month Horizon)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Shift:{' '}
            <strong className={`font-mono ${isRising ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {diff >= 0 ? '+' : ''}{(diff * 100).toFixed(1)}%
            </strong>{' '}
            since {trend[0]?.period}
          </p>
        </div>

        <Link
          to="/risk-analysis"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Detailed Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`trendGrad-${riskLevel}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={riskConfig.colorHex} stopOpacity="0.3" />
              <stop offset="100%" stopColor={riskConfig.colorHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((val) => {
            const y = paddingTop + (1 - val) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="2 2"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-slate-400"
                >
                  {(val * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#trendGrad-${riskLevel})`} />

          {/* Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={riskConfig.colorHex}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Labels */}
          {points.map((p, idx) => (
            <g key={p.period}>
              <circle
                cx={p.x}
                cy={p.y}
                r={idx === points.length - 1 ? 4.5 : 3}
                fill={riskConfig.colorHex}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-transform hover:scale-150"
              />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
              >
                {p.period}
              </text>
              {idx === points.length - 1 && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-slate-200"
                >
                  {(p.prob * 100).toFixed(1)}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>BASELINE DELAY ESTIMATION</span>
        <span>UPDATED REAL-TIME TELEMETRY</span>
      </div>
    </div>
  );
};
