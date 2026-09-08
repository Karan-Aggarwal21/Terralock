import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Binary,
  MapPin,
  TrendingUp,
  BrainCircuit,
  Database,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Hexagon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [predictionsOpen, setPredictionsOpen] = useState(true);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Risk Analysis',
      path: '/risk-analysis',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      label: 'Monte Carlo Simulation',
      path: '/simulation',
      icon: <Binary className="w-4 h-4" />,
    },
    {
      label: 'GIS Map',
      path: '/gis-map',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      label: 'Predictions',
      icon: <TrendingUp className="w-4 h-4" />,
      children: [
        { label: 'Delay Days', path: '/predictions/delay-days' },
        { label: 'Delay Reason', path: '/predictions/delay-reason' },
      ],
    },
    {
      label: 'ML Explainability',
      path: '/explainability',
      icon: <BrainCircuit className="w-4 h-4" />,
    },
    {
      label: 'Data / Projects',
      path: '/projects',
      icon: <Database className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile / Tablet Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-[#111827] flex flex-col border-r border-[#e2e8e4] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#e2e8e4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#244d3b] flex items-center justify-center text-white shadow-xs">
              <Hexagon className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-[#111827] font-sans text-sm">
                TERRA LOCK
              </span>
              <span className="block text-[10px] text-[#244d3b] font-mono tracking-wide uppercase font-semibold">
                Land Intelligence Core
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:text-[#111827] hover:bg-[#f1f5f3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setPredictionsOpen(!predictionsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-[#374151] hover:text-[#101827] hover:bg-[#f8faf9] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {predictionsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
                    )}
                  </button>

                  {predictionsOpen && (
                    <div className="pl-8 pr-2 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              isActive
                                ? 'bg-[#edf7f1] text-[#244d3b] border border-[#d8e8de] font-semibold'
                                : 'text-[#4b5563] hover:text-[#101827] hover:bg-[#f8faf9]'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path!}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#edf7f1] text-[#244d3b] border border-[#d8e8de] font-semibold'
                      : 'text-[#4b5563] hover:text-[#101827] hover:bg-[#f8faf9]'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* System Meta Footer */}
        <div className="p-4 border-t border-[#e2e8e4] text-[11px] font-mono text-[#64748b] space-y-1 bg-[#f8faf9]">
          <div className="flex items-center justify-between">
            <span>PLATFORM</span>
            <span className="text-[#244d3b] font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[#64748b]">
            <span>MODEL ENGINE</span>
            <span>v2.1 ML-X</span>
          </div>
        </div>
      </aside>
    </>
  );
};
