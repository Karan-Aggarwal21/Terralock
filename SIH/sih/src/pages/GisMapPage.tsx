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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                GEOSPATIAL INTELLIGENCE & CADASTRAL RISK MAP (F6)
              </span>
              {selectedProject && <RiskBadge level={selectedProject.risk_level} size="xs" />}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Infrastructure GIS Command Center
            </h1>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Corridor right-of-ways, parcel polygons, and 4-tier spatial heatmaps. Active Project: <strong>{selectedProject?.name} [{selectedProject?.project_id}]</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Spatial Corridors</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
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
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              <span>GIS Interactions</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Click any corridor node or parcel polygon to inspect detailed cadastral attributes and update the global project selector. Use toolbar buttons to zoom or drag to pan.
            </p>
          </div>
        </div>

        {/* Right Column (3 cols): Full-Size MapPanel */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {filteredProjects.length === 0 ? (
            <EmptyState
              title="No Projects Match Active Spatial Filters"
              message="Adjust search keywords, clear risk level filters, or reset state jurisdiction filters to view corridors."
              className="h-[620px]"
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
