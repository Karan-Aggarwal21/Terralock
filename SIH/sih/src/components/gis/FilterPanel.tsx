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
    <div className={`bg-white border border-[#e2e8e4] rounded-2xl p-5 sm:p-6 shadow-xs font-sans text-xs text-[#1f2937] ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#edf2ee]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#244d3b] font-mono">
          <Filter className="w-4 h-4 text-[#244d3b]" />
          <span>Spatial Filters ({totalMatches}/{totalProjects})</span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#6b7280] hover:text-[#1f2937] cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search corridor, state, ID..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-8 pr-7 py-2 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b] transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-[#9ca3af] hover:text-[#4b5563] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono tracking-wider">
            Risk Tier
          </span>
          <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
            {(['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...filters, riskLevel: level })}
                className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  filters.riskLevel === level
                    ? 'bg-[#244d3b] text-white border-transparent font-bold shadow-2xs'
                    : 'bg-[#f8faf9] border-[#e2e8e4] text-[#4b5563] hover:bg-[#edf2ee] hover:text-[#1f2937]'
                }`}
              >
                {level === 'MODERATE' ? 'MOD' : level === 'CRITICAL' ? 'CRIT' : level}
              </button>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono tracking-wider">
            State Jurisdiction
          </span>
          <select
            value={filters.state}
            onChange={(e) => onChange({ ...filters, state: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] text-xs outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b]"
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
        <div className="space-y-1.5">
          <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono tracking-wider">
            Acquisition Status
          </span>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] text-[#1f2937] text-xs outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#244d3b]/20 focus:border-[#244d3b]"
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
