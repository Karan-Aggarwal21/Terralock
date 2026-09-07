import React from 'react';
import { RISK_THRESHOLDS } from '../../constants/risk';
import { Layers } from 'lucide-react';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-md font-mono text-xs ${className}`}>
      <div className="flex items-center gap-1.5 pb-2 mb-2.5 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
        <Layers className="w-3.5 h-3.5 text-emerald-500" />
        <span>GIS Risk Scale & Legend</span>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
          Standard Risk Scale (§3 & §7)
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {Object.values(RISK_THRESHOLDS).map((cfg) => (
            <div key={cfg.level} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cfg.colorHex }}
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {cfg.level}
              </span>
              <span className="text-[10px] text-slate-400">
                {(cfg.max * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
          Cartographic Layers
        </span>
        <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-emerald-500 rounded-full" />
            <span>Right-of-Way Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs border border-dashed border-amber-500 bg-amber-500/20" />
            <span>Cadastral Survey Parcel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Dispute Epicenter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
