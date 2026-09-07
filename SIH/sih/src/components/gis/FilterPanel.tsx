import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { RiskLevel } from '../../constants/risk';

export interface GisFilters {
  searchQuery: string;
  riskLevel: RiskLevel | 'ALL';
  status: string | 'ALL';
  state: string | 'ALL';
}

interface FilterPanelProps {
  filters: GisFilters;
  onChange: (newFilters: GisFilters) => void;
  availableStates: string[];
  totalMatches: number;
  totalProjects: number;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  availableStates,
  totalMatches,
  totalProjects,
  className = '',
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.riskLevel !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.state !== 'ALL';

  const resetFilters = () => {
    onChange({
      searchQuery: '',
      riskLevel: 'ALL',
      status: 'ALL',
      state: 'ALL',
    });
  };

  return (
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-md font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <Filter className="w-3.5 h-3.5 text-emerald-500" />
          <span>Spatial Filters ({totalMatches}/{totalProjects})</span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search corridor, state, ID..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-8 pr-7 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-1 focus:ring-slate-500"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">
            Risk Tier
          </span>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            {(['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...filters, riskLevel: level })}
                className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                  filters.riskLevel === level
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-transparent font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {level === 'MODERATE' ? 'MOD' : level === 'CRITICAL' ? 'CRIT' : level}
              </button>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">
            State Jurisdiction
          </span>
          <select
            value={filters.state}
            onChange={(e) => onChange({ ...filters, state: e.target.value })}
            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
          >
            <option value="ALL">All States ({availableStates.length})</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">
            Acquisition Status
          </span>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Acquisition In Progress">Acquisition In Progress</option>
            <option value="Disputed">Disputed</option>
            <option value="Planning">Planning</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>
    </div>
  );
};
