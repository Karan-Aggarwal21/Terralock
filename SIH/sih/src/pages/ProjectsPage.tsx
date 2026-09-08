import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DataTable, Column } from '../components/common/DataTable';
import { Project } from '../types/project';
import { Database, ArrowRight, CheckCircle2, Search, Filter } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, selectedProjectId, setSelectedProjectId, isLoading, error, refreshProjects } = useProject();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesSearch =
        proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proj.state && proj.state.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRisk = riskFilter === 'ALL' || proj.risk_level === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [projects, searchTerm, riskFilter]);

  if (isLoading && projects.length === 0) {
    return <LoadingState fullHeight message="Loading infrastructure project repository..." />;
  }

  if (error && projects.length === 0) {
    return <ErrorState message={error} onRetry={refreshProjects} fullHeight />;
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No Projects Monitored"
        message="No land acquisition infrastructure corridors found in the active telemetry repository."
        action={
          <button
            type="button"
            onClick={refreshProjects}
            className="px-3 py-1.5 rounded bg-emerald-600 text-white font-mono text-xs font-semibold hover:bg-emerald-500 cursor-pointer"
          >
            Reload Projects
          </button>
        }
        fullHeight
      />
    );
  }

  const columns: Column<Project>[] = [
    {
      key: 'project_id',
      header: 'Project ID & Name',
      render: (proj) => {
        const isSelected = proj.project_id === selectedProjectId;
        return (
          <div className="flex items-center gap-2">
            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            <div>
              <span className="font-mono font-bold text-slate-900 dark:text-white block">
                [{proj.project_id}]
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{proj.name}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'location',
      header: 'Location / State',
      render: (proj) => (
        <span className="font-mono text-slate-700 dark:text-slate-300">
          {proj.state || `${proj.location.lat.toFixed(2)}°N, ${proj.location.lng.toFixed(2)}°E`}
        </span>
      ),
    },
    {
      key: 'risk_level',
      header: 'Risk Level',
      render: (proj) => <RiskBadge level={proj.risk_level} size="xs" />,
    },
    {
      key: 'delay_probability',
      header: 'Delay Probability',
      render: (proj) => (
        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
          {(proj.delay_probability * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'predicted_delay_days',
      header: 'Predicted Delay',
      render: (proj) => (
        <span className="font-mono font-semibold text-slate-900 dark:text-white">
          {proj.predicted_delay_days} Days
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Acquisition Status',
      render: (proj) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#edf7f1] text-[#244d3b] border border-[#d8e8de]">
          {proj.status || 'In Acquisition'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (proj) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProjectId(proj.project_id);
            navigate('/dashboard');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#244d3b] text-white hover:bg-[#1b3b2d] text-[11px] font-mono transition-colors cursor-pointer"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-[#244d3b]" />
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                NATIONAL INFRASTRUCTURE REPOSITORY (§6.8)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101827] tracking-tight leading-tight">
              Monitored Land Acquisition Projects
            </h1>
            <p className="text-sm text-[#4b5563] mt-1">
              Click any project corridor to activate global context and inspect risk telemetry.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#6b7280]">Repository Total:</span>{' '}
            <strong className="text-sm font-bold text-[#101827]">
              {projects.length} Corridors
            </strong>
          </div>
        </div>

        {/* 2. Filters & Search bar */}
        <div className="mt-4 pt-4 border-t border-[#f1f5f3] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by ID, name, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#e2e8e4] bg-[#f8faf9] text-[#111827] font-mono placeholder:text-[#94a3b8] focus:outline-none focus:border-[#244d3b]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs font-mono py-2 px-3 rounded-lg border border-[#e2e8e4] bg-[#f8faf9] text-[#111827] focus:outline-none focus:border-[#244d3b]"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="LOW">LOW Risk</option>
              <option value="MODERATE">MODERATE Risk</option>
              <option value="HIGH">HIGH Risk</option>
              <option value="CRITICAL">CRITICAL Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Reusable DataTable */}
      <div className="bg-white border border-[#e2e8e4] rounded-xl shadow-xs overflow-hidden">
        <DataTable
          data={filteredProjects}
          columns={columns}
          keyExtractor={(p) => p.project_id}
          selectedKey={selectedProjectId}
          onRowClick={(p) => setSelectedProjectId(p.project_id)}
          emptyMessage="No monitored projects match your filter criteria."
        />
      </div>
    </div>
  );
};

