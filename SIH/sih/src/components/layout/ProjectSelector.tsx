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
      <div className={`h-10 w-64 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse flex items-center px-3 ${className}`}>
        <span className="text-xs text-slate-400 font-mono">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs focus-within:ring-2 focus-within:ring-slate-500 focus-within:border-slate-500">
          <FolderGit2 className="w-4 h-4 text-slate-400 shrink-0" />
          
          <select
            id="global-project-selector"
            aria-label="Global Project Selector"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer pr-6 appearance-none font-sans"
          >
            {projects.map((proj) => (
              <option
                key={proj.project_id}
                value={proj.project_id}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1"
              >
                [{proj.project_id}] {proj.name} ({proj.risk_level})
              </option>
            ))}
          </select>

          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      {selectedProject && (
        <div className="hidden lg:block ml-2.5 shrink-0">
          <RiskBadge level={selectedProject.risk_level} size="sm" />
        </div>
      )}
    </div>
  );
};
