import React, { useState } from 'react';
import { SimulationBin, SimulationResult } from '../../utils/simulationEngine';
import { RiskLevel, getRiskConfig } from '../../constants/risk';

interface SimulationHistogramProps {
  result: SimulationResult;
  riskLevel: RiskLevel;
  className?: string;
}

export const SimulationHistogram: React.FC<SimulationHistogramProps> = ({
  result,
  riskLevel,
  className = '',
}) => {
  const [hoveredBin, setHoveredBin] = useState<SimulationBin | null>(null);
  const riskConfig = getRiskConfig(riskLevel);

  const { bins, expectedDelay, medianDelay, p90Delay, delayThreshold, minDelay, maxDelay } = result;

  const maxBinPct = Math.max(...bins.map((b) => b.percentage), 0.01);

  // SVG Geometry
  const width = 800;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 35;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const getXForDays = (days: number) => {
    const clamped = Math.min(Math.max(days, minDelay), maxDelay);
    const fraction = (clamped - minDelay) / Math.max(maxDelay - minDelay, 1);
    return paddingLeft + fraction * plotWidth;
  };

  const expectedX = getXForDays(expectedDelay);
  const medianX = getXForDays(medianDelay);
  const p90X = getXForDays(p90Delay);
  const thresholdX = getXForDays(delayThreshold);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Monte Carlo Outcome Probability Density Histogram
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Empirical distribution of {result.numSimulations.toLocaleString()} simulated delay durations
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-400">Within Threshold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: riskConfig.colorHex }} />
            <span className="text-slate-600 dark:text-slate-400">Exceeds &gt;{delayThreshold}d</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Expected ({expectedDelay}d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">P90 ({p90Delay}d)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Y Axis Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((tick) => {
            const y = paddingTop + (1 - tick) * plotHeight;
            const pctLabel = `${(tick * maxBinPct * 100).toFixed(0)}%`;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="2 2"
                  className="text-slate-100 dark:text-slate-800"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-slate-400"
                >
                  {pctLabel}
                </text>
              </g>
            );
          })}

          {/* Histogram Bars */}
          {bins.map((bin, index) => {
            const barWidth = plotWidth / bins.length - 3;
            const x = paddingLeft + index * (plotWidth / bins.length) + 1.5;
            const barHeight = (bin.percentage / maxBinPct) * plotHeight;
            const y = paddingTop + plotHeight - barHeight;

            const isExceeding = bin.binEnd > delayThreshold;

            return (
              <rect
                key={index}
                x={x}
                y={y}
                width={Math.max(barWidth, 1)}
                height={Math.max(barHeight, 2)}
                rx={2}
                fill={isExceeding ? riskConfig.colorHex : '#94a3b8'}
                opacity={hoveredBin === bin ? 1 : 0.82}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredBin(bin)}
                onMouseLeave={() => setHoveredBin(null)}
              />
            );
          })}

          {/* X Axis Labels */}
          {bins.map((bin, index) => {
            if (index % 2 !== 0 && index !== bins.length - 1) return null;
            const x = paddingLeft + index * (plotWidth / bins.length) + (plotWidth / bins.length) / 2;
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={height - 12}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
              >
                {bin.binStart}d
              </text>
            );
          })}

          {/* Marker 1: Median Delay (P50) */}
          <line
            x1={medianX}
            y1={paddingTop - 10}
            x2={medianX}
            y2={paddingTop + plotHeight}
            stroke="#3b82f6"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={medianX}
            y={paddingTop - 14}
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-blue-500"
          >
            P50: {medianDelay}d
          </text>

          {/* Marker 2: Expected Value Indicator */}
          <line
            x1={expectedX}
            y1={paddingTop - 22}
            x2={expectedX}
            y2={paddingTop + plotHeight}
            stroke="#10b981"
            strokeWidth={2}
          />
          <text
            x={expectedX}
            y={paddingTop - 26}
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400"
          >
            Mean: {expectedDelay}d
          </text>

          {/* Marker 3: P90 Percentile Marker */}
          <line
            x1={p90X}
            y1={paddingTop - 10}
            x2={p90X}
            y2={paddingTop + plotHeight}
            stroke="#ef4444"
            strokeWidth={2}
          />
          <text
            x={p90X}
            y={paddingTop - 14}
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-rose-600 dark:fill-rose-400"
          >
            P90: {p90Delay}d
          </text>

          {/* Marker 4: Critical Delay Threshold boundary */}
          <line
            x1={thresholdX}
            y1={paddingTop}
            x2={thresholdX}
            y2={paddingTop + plotHeight}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <text
            x={thresholdX}
            y={paddingTop + 14}
            textAnchor="start"
            dx={4}
            className="text-[8px] font-mono font-semibold fill-amber-600 dark:fill-amber-400 uppercase"
          >
            Threshold: {delayThreshold}d
          </text>
        </svg>

        {/* Hovered Bin Tooltip Badge */}
        {hoveredBin && (
          <div className="absolute top-2 right-4 px-3 py-1.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-mono shadow-md border border-slate-700 pointer-events-none">
            <span>Interval: {hoveredBin.binStart}–{hoveredBin.binEnd} Days</span>
            <span className="block text-[10px] text-slate-300 dark:text-slate-600">
              {hoveredBin.count.toLocaleString()} trials ({(hoveredBin.percentage * 100).toFixed(1)}%)
            </span>
          </div>
        )}
      </div>

      {/* Axis title footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>X-AXIS: SIMULATED DELAY (DAYS)</span>
        <span>Y-AXIS: RELATIVE FREQUENCY (PERCENT)</span>
      </div>
    </div>
  );
};
