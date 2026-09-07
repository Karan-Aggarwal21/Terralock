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
  Shield,
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
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-white font-mono text-sm">
                TERRA LOCK
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                Risk Analytics Core
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
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
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {predictionsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {predictionsOpen && (
                    <div className="pl-9 pr-2 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              isActive
                                ? 'bg-emerald-600/20 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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
                key={item.path}
                to={item.path!}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
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
        <div className="p-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>PLATFORM</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>MODEL ENGINE</span>
            <span>v2.1 ML-X</span>
          </div>
        </div>
      </aside>
    </>
  );
};
