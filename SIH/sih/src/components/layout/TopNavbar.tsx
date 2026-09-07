import React from 'react';
import { Menu, Activity } from 'lucide-react';
import { ProjectSelector } from './ProjectSelector';
import { useProject } from '../../context';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { selectedProject } = useProject();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Navigation"
          className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase font-mono">
            Land Acquisition Intelligence Platform
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Ministry of Road Transport & Highways / Infrastructure Monitor
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>INFERENCE ACTIVE</span>
        </div>

        {/* Global Project Selector */}
        <ProjectSelector />

        {/* Active Project Corridor Tag on large viewports */}
        {selectedProject?.state && (
          <div className="hidden xl:flex items-center text-xs font-mono text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-3">
            <span>STATE: <strong className="text-slate-700 dark:text-slate-200">{selectedProject.state}</strong></span>
          </div>
        )}
      </div>
    </header>
  );
};
