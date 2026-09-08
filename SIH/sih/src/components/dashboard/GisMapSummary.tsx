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
      <div className={`bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs ${className}`}>
        <LoadingState message="Connecting to GIS spatial raster layer..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty || !location) {
    return (
      <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs ${className}`}>
        <EmptyState message="No geospatial coordinates registered for this project" />
      </div>
    );
  }

  const riskConfig = getRiskConfig(riskLevel);

  return (
    <div className={`bg-white border border-[#e2e8e4] rounded-xl p-6 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3.5 border-b border-[#f1f5f3]">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
              GIS Spatial Risk Footprint
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#64748b] block mt-0.5">
            {corridorName ? `${corridorName} • ` : ''}Coordinates: {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
          </span>
        </div>

        <Link
          to="/gis-map"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4] hover:bg-[#edf7f1] text-xs font-mono font-semibold text-[#244d3b] transition-colors self-start sm:self-auto"
        >
          <span>Interactive GIS (F6)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cartographic preview canvas */}
      <div className="relative h-48 w-full bg-[#f8faf9] rounded-xl border border-[#e2e8e4] overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#244d3b_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Concentric Radar Circles */}
        <div className="absolute w-44 h-44 rounded-full border border-[#e2e8e4] opacity-80" />
        <div className="absolute w-28 h-28 rounded-full border border-[#cbd5e1] opacity-60" />
        <div className="absolute w-12 h-12 rounded-full border border-[#244d3b]/30" />

        {/* Crosshair Lines */}
        <div className="absolute inset-x-0 h-px bg-[#e2e8e4]" />
        <div className="absolute inset-y-0 w-px bg-[#e2e8e4]" />

        {/* Active Project Blip */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span
              className="absolute w-8 h-8 rounded-full animate-ping opacity-60"
              style={{ backgroundColor: riskConfig.colorHex }}
            />
            <span
              className="relative w-4 h-4 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: riskConfig.colorHex }}
            />
          </div>
          <div className="mt-2 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-sm border border-[#e2e8e4] shadow-xs font-mono text-[10px] font-bold text-[#111827]">
            {location.lat.toFixed(2)}°N, {location.lng.toFixed(2)}°E
          </div>
        </div>

        {/* Top-Right Compass Datum */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/95 border border-[#e2e8e4] text-[10px] font-mono text-[#64748b] flex items-center gap-1 shadow-2xs">
          <Compass className="w-3 h-3 text-[#244d3b]" />
          <span>WGS 84</span>
        </div>
      </div>

      {/* Corridor Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-[#f1f5f3] text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4]">
          <span className="text-[10px] text-[#64748b] block uppercase">Region</span>
          <span className="font-semibold text-[#111827] truncate block mt-0.5">
            {state || 'National'}{status ? ` • ${status}` : ''}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4]">
          <span className="text-[10px] text-[#64748b] block uppercase">Land Scope</span>
          <span className="font-semibold text-[#111827] truncate block mt-0.5">
            {landRequiredHa ? `${landRequiredHa} Ha` : 'N/A'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4]">
          <span className="text-[10px] text-[#64748b] block uppercase">Budget</span>
          <span className="font-semibold text-[#111827] truncate block mt-0.5">
            {totalBudgetCr ? `₹${totalBudgetCr} Cr` : 'N/A'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8faf9] border border-[#e2e8e4] flex flex-col justify-center">
          <span className="text-[10px] text-[#64748b] block uppercase mb-1">Risk Level</span>
          <RiskBadge level={riskLevel} size="xs" />
        </div>
      </div>
    </div>
  );
};
