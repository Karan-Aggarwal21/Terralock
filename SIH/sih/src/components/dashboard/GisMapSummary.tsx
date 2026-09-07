import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, Compass } from 'lucide-react';
import { Location } from '../../types/project';
import { RiskLevel, getRiskConfig } from '../../constants/risk';
import { RiskBadge } from '../common/RiskBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';

interface GisMapSummaryProps {
  location?: Location;
  riskLevel: RiskLevel;
  corridorName?: string;
  state?: string;
  landRequiredHa?: number;
  totalBudgetCr?: number;
  status?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  className?: string;
}

export const GisMapSummary: React.FC<GisMapSummaryProps> = ({
  location,
  riskLevel,
  corridorName,
  state,
  landRequiredHa,
  totalBudgetCr,
  status,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs ${className}`}>
        <LoadingState message="Connecting to GIS spatial raster layer..." />
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

  if (isEmpty || !location) {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs ${className}`}>
        <EmptyState message="No geospatial coordinates registered for this project" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              GIS Spatial Risk Footprint (F6)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
            Cadastral Coordinates: {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
          </span>
        </div>

        <Link
          to="/gis-map"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Interactive GIS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Styled GIS Spatial Preview Visualizer */}
      <div className="relative w-full h-44 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
        {/* Radar & Cartographic Grid Background */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Synthetic Cadastral Boundary Poly */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180">
          <defs>
            <linearGradient id="polyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={riskConfig.colorHex} stopOpacity="0.45" />
              <stop offset="100%" stopColor={riskConfig.colorHex} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Acquisition Right of Way Buffer */}
          <path
            d="M 30 140 Q 140 100, 220 110 T 370 40"
            fill="none"
            stroke="#475569"
            strokeWidth="28"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />

          {/* Central Corridor Alignment */}
          <path
            d="M 30 140 Q 140 100, 220 110 T 370 40"
            fill="none"
            stroke={riskConfig.colorHex}
            strokeWidth="3.5"
            strokeDasharray="6 3"
          />

          {/* Parcel Polygon At Risk */}
          <polygon
            points="180,75 250,85 240,140 170,130"
            fill="url(#polyGrad)"
            stroke={riskConfig.colorHex}
            strokeWidth="1.5"
          />

          {/* Risk Epicenter Radar Pulsing Ring */}
          <circle cx="210" cy="110" r="14" fill="none" stroke={riskConfig.colorHex} strokeWidth="1.5" className="animate-ping" opacity="0.6" />
          <circle cx="210" cy="110" r="6" fill={riskConfig.colorHex} stroke="#ffffff" strokeWidth="1.5" />
        </svg>

        {/* Floating Spatial Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 max-w-[70%]">
          <RiskBadge level={riskLevel} size="xs" />
          <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs border border-slate-700 text-[10px] font-mono text-slate-300 truncate">
            {corridorName || state || 'National Corridor'}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>GEO-BOUND 1:50,000</span>
          </div>
        </div>
      </div>

      {/* Corridor Attributes Grid */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Land Target</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {landRequiredHa ? `${landRequiredHa} ha` : '—'}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Sanctioned Outlay</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {totalBudgetCr ? `₹${totalBudgetCr} Cr` : '—'}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase block">Acquisition Status</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
            {status || 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
};
