import React, { useState, useMemo } from 'react';
import { useProject } from '../context';
import { MapPanel } from '../components/gis/MapPanel';
import { MapLegend } from '../components/gis/MapLegend';
import { FilterPanel, GisFilters } from '../components/gis/FilterPanel';
import { ParcelDetailModal } from '../components/gis/ParcelDetailModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { RiskBadge } from '../components/common/RiskBadge';
import { Project, LandParcel } from '../types/project';
import { Info } from 'lucide-react';

export const GisMapPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    isLoading,
    error,
    refreshProjects,
  } = useProject();

  const [filters, setFilters] = useState<GisFilters>({
    searchQuery: '',
    riskLevel: 'ALL',
    status: 'ALL',
    state: 'ALL',
  });

  const [modalData, setModalData] = useState<{
    project: Project;
    parcel?: LandParcel | null;
  } | null>(null);

  // Available unique states
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    projects.forEach((p) => {
      if (p.state) states.add(p.state);
    });
    return Array.from(states);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filters.riskLevel !== 'ALL' && p.risk_level !== filters.riskLevel) {
        return false;
      }
      if (filters.status !== 'ALL' && p.status !== filters.status) {
        return false;
      }
      if (filters.state !== 'ALL' && p.state !== filters.state) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesId = p.project_id.toLowerCase().includes(q);
        const matchesState = (p.state || '').toLowerCase().includes(q);
        const matchesReason = p.delay_reason.toLowerCase().includes(q);
        const matchesParcel = p.parcels?.some((prcl) =>
          prcl.survey_number.toLowerCase().includes(q) || prcl.village.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesId && !matchesState && !matchesReason && !matchesParcel) {
          return false;
        }
      }
      return true;
    });
  }, [projects, filters]);

  if (isLoading && projects.length === 0) {
    return <LoadingState fullHeight message="Loading National GIS Geospatial Raster..." />;
  }

  if (error && projects.length === 0) {
    return (
      <ErrorState
        title="GIS Telemetry Connection Fault"
        message={error}
        onRetry={refreshProjects}
        fullHeight
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                GEOSPATIAL INTELLIGENCE • CADASTRAL RISK ALIGNMENT (F6)
              </span>
              {selectedProject && <RiskBadge level={selectedProject.risk_level} size="xs" />}
              {selectedProject && (
                <span className="text-[11px] font-mono text-[#4b5563] bg-[#f4f7f5] px-2 py-0.5 rounded border border-[#e2e8e4]">
                  ID: {selectedProject.project_id}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101827] tracking-tight leading-tight">
              Infrastructure GIS & Cadastral Command Center
            </h1>

            <p className="text-sm text-[#4b5563]">
              Right-of-way alignments, cadastral land parcels, and 4-tier risk heatmaps. Active Alignment: <strong className="text-[#101827]">{selectedProject?.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl border border-[#c6e6d2] bg-[#edf7f1] text-right">
              <span className="text-[10px] font-mono text-[#4b5563] uppercase block font-semibold">Active Corridors</span>
              <span className="text-xs font-bold text-[#1e5637] font-mono">
                {filteredProjects.length} of {projects.length} Visible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive GIS Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: FilterPanel & MapLegend */}
        <div className="space-y-5 order-2 lg:order-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            availableStates={availableStates}
            totalMatches={filteredProjects.length}
            totalProjects={projects.length}
          />

          <MapLegend />

          {/* User Guide Advisory */}
          <div className="p-5 rounded-2xl border border-[#e2e8e4] bg-white text-xs font-mono space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#1f2937] font-bold">
              <Info className="w-4 h-4 text-[#244d3b]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#244d3b]">GIS Spatial Navigation</span>
            </div>
            <p className="text-xs text-[#4b5563] leading-relaxed font-sans">
              Click any corridor beacon or cadastral parcel to inspect land records and sync the global project selector. Use toolbar controls or mouse drag to pan and zoom.
            </p>
          </div>
        </div>

        {/* Right Column (3 cols): Full-Size MapPanel */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {filteredProjects.length === 0 ? (
            <EmptyState
              title="No Projects Match Active Spatial Filters"
              message="Adjust search keywords, clear risk level filters, or reset state jurisdiction filters to view corridors."
              className="h-[640px]"
            />
          ) : (
            <MapPanel
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => setSelectedProjectId(id)}
              onOpenParcelModal={(proj, parcel) => setModalData({ project: proj, parcel })}
            />
          )}
        </div>
      </div>

      {/* 3. Parcel Detail Popup Modal (§6.6) */}
      {modalData && (
        <ParcelDetailModal
          project={modalData.project}
          parcel={modalData.parcel}
          onClose={() => setModalData(null)}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
          }}
          isActiveProject={modalData.project.project_id === selectedProjectId}
        />
      )}
    </div>
  );
};
