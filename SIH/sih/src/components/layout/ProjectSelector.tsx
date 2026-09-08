import React from 'react';
import { useProject } from '../../context';
import { RiskBadge } from '../common/RiskBadge';
import { ChevronDown, FolderGit2 } from 'lucide-react';

interface ProjectSelectorProps {
  className?: string;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ className = '' }) => {
  const { projects, selectedProjectId, selectedProject, setSelectedProjectId, isLoading } = useProject();

  if (isLoading && projects.length === 0) {
    return (
      <div className={`h-9 w-48 sm:w-64 bg-[#edf7f1]/50 rounded-lg animate-pulse flex items-center px-3 border border-[#e2e8e4] ${className}`}>
        <span className="text-xs text-[#64748b] font-mono">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-full min-w-[200px] sm:min-w-[260px] max-w-xs sm:max-w-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8e4] bg-white hover:border-[#cbd5e1] focus-within:border-[#244d3b] focus-within:ring-1 focus-within:ring-[#244d3b] shadow-2xs transition-all">
          <FolderGit2 className="w-3.5 h-3.5 text-[#244d3b] shrink-0" />

          <select
            id="global-project-selector"
            aria-label="Global Project Selector"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-transparent text-xs font-medium text-[#111827] outline-none cursor-pointer pr-6 appearance-none font-sans"
          >
            {projects.map((proj) => (
              <option
                key={proj.project_id}
                value={proj.project_id}
                className="bg-white text-[#111827] py-1"
              >
                [{proj.project_id}] {proj.name} ({proj.risk_level})
              </option>
            ))}
          </select>

          <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-2.5 pointer-events-none" />
        </div>
      </div>

      {selectedProject && (
        <div className="hidden sm:block ml-2 shrink-0">
          <RiskBadge level={selectedProject.risk_level} size="xs" />
        </div>
      )}
    </div>
  );
};
