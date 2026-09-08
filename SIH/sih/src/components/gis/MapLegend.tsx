import React from 'react';
import { RISK_THRESHOLDS } from '../../constants/risk';
import { Layers } from 'lucide-react';

export interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white border border-[#e2e8e4] rounded-2xl p-5 sm:p-6 shadow-xs font-sans text-xs text-[#1f2937] ${className}`}
    >
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#edf2ee] text-xs font-bold uppercase tracking-wider text-[#244d3b] font-mono">
        <Layers className="w-4 h-4 text-[#244d3b]" />
        <span>Cartographic Risk Legend</span>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono tracking-wider">
          Standard Risk Classification
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
          {Object.values(RISK_THRESHOLDS).map((cfg) => (
            <div key={cfg.level} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: cfg.colorHex }}
              />
              <span className="font-bold text-[#1f2937] font-mono text-[11px]">
                {cfg.level}
              </span>
              <span className="text-[10px] text-[#6b7280] font-mono">
                &lt;{(cfg.max * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#edf2ee] space-y-2.5">
        <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono tracking-wider">
          Spatial & Vector Features
        </span>
        <div className="space-y-2 text-xs text-[#4b5563] font-sans">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-1 bg-[#244d3b] rounded-full shrink-0" />
            <span>Right-of-Way Corridor Alignment</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-xs border border-dashed border-[#ea580c] bg-[#ea580c]/15 shrink-0" />
            <span>Cadastral Survey Land Parcel</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] animate-ping shrink-0" />
            <span>High-Priority Delay Hotspot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
