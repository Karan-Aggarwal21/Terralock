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
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <LoadingState message="Plotting historical risk vector..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 shadow-xs ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || !trend || trend.length === 0) {
    return (
      <div className={`bg-white border border-[#E2E7E4] rounded-xl p-5 shadow-xs ${className}`}>
        <EmptyState message="No historical risk trend data recorded" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);

  // Determine dynamic intelligence chart scale (e.g. 20% to 40% with 5% intervals)
  const probs = trend.map((d) => d.probability);
  const minProb = Math.min(...probs);
  const maxProb = Math.max(...probs);

  // Round min down to nearest 5% and max up to nearest 5% with padding
  const yMin = Math.max(0, Math.floor((minProb - 0.03) * 20) / 20);
  const yMax = Math.min(1, Math.ceil((maxProb + 0.04) * 20) / 20);
  const yRange = yMax - yMin || 0.2;

  const gridSteps: number[] = [];
  const step = 0.05;
  for (let v = yMin; v <= yMax + 0.001; v += step) {
    gridSteps.push(Math.round(v * 100) / 100);
  }

  // SVG Chart Geometry - compact height
  const width = 640;
  const height = 180;
  const paddingLeft = 46;
  const paddingRight = 40;
  const paddingTop = 26;
  const paddingBottom = 32;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = trend.map((d, index) => {
    const x = paddingLeft + (index / (trend.length - 1)) * chartWidth;
    const normalizedY = (d.probability - yMin) / yRange;
    const y = paddingTop + (1 - normalizedY) * chartHeight;
    const isLast = index === trend.length - 1;
    const periodLabel = isLast ? 'NOW' : `M-${trend.length - 1 - index}`;
    return {
      x,
      y,
      period: d.period,
      periodLabel,
      prob: d.probability,
      percentText: `${(d.probability * 100).toFixed(0)}%`,
    };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const latestProb = trend[trend.length - 1]?.probability ?? 0;
  const initialProb = trend[0]?.probability ?? 0;
  const diff = latestProb - initialProb;
  const isRising = diff > 0.01;

  // Values progression sequence string
  const valuesSequence = points.map((p) => p.percentText).join(' → ');

  return (
    <div className={`bg-white border border-[#E2E7E4] rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between ${className}`}>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-[#E2E7E4]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F7F8F6] border border-[#E2E7E4] text-[#527568]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase block font-sans">
                HISTORICAL RISK PROBABILITY
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider font-sans">
                6-MONTH TREND
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Progression Flow readout */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-3 py-1 rounded-lg bg-[#F7F8F6] border border-[#E2E7E4] text-xs font-mono text-[#334155]">
            <span className="text-[#64748B] mr-1.5 font-sans text-[11px]">Progression:</span>
            <strong className="text-[#101827] font-semibold">{valuesSequence}</strong>
          </div>

          <Link
            to="/risk-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E2E7E4] hover:bg-[#F7F8F6] text-xs font-semibold text-[#527568] transition-all"
          >
            <span>Detailed Assessment</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Intelligence Dashboard SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`trendGrad-${riskLevel}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={riskConfig.colorHex} stopOpacity="0.18" />
              <stop offset="100%" stopColor={riskConfig.colorHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines with 5% intervals (e.g. 20% → 25% → 30% → 35% → 40%) */}
          {gridSteps.map((val) => {
            const normalized = (val - yMin) / yRange;
            const y = paddingTop + (1 - normalized) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E2E7E4"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[11px] font-sans font-medium fill-[#64748B]"
                >
                  {(val * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Soft area under curve */}
          <path d={areaPath} fill={`url(#trendGrad-${riskLevel})`} />

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={riskConfig.colorHex}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points with Values Directly Above Points */}
          {points.map((p, i) => {
            const isLast = i === points.length - 1;
            return (
              <g key={i} className="group cursor-pointer">
                {/* Connecting drop line from point to baseline */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={p.x}
                  y2={paddingTop + chartHeight}
                  stroke="#E2E7E4"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />

                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isLast ? 5 : 4}
                  fill="#FFFFFF"
                  stroke={riskConfig.colorHex}
                  strokeWidth={isLast ? 2.5 : 2}
                  className="transition-transform duration-150 group-hover:scale-125"
                />

                {/* Actual value placed prominently above point */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="text-[12px] font-bold fill-[#101827] font-sans"
                >
                  {p.percentText}
                </text>

                {/* X-axis label: M-5, M-4, ..., NOW */}
                <text
                  x={p.x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-sans ${isLast ? 'font-bold fill-[#101827]' : 'font-medium fill-[#64748B]'}`}
                >
                  {p.periodLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Trajectory status bar */}
      <div className="mt-3 text-xs font-sans text-[#64748B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E2E7E4] pt-3">
        <span>
          Trajectory:{' '}
          <strong className={`font-semibold ${isRising ? 'text-[#DC2626]' : 'text-[#2D7A4F]'}`}>
            {isRising ? 'Escalating Risk Profile' : 'Stable / Attenuating Risk'}
          </strong>
          {' '}({diff >= 0 ? '+' : ''}{(diff * 100).toFixed(1)}% over observation window)
        </span>
        <span className="font-semibold text-[#101827]">
          Current Assessed Probability: {(latestProb * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
