import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Risk Analysis', path: '/risk-analysis' },
    { label: 'Simulation', path: '/simulation' },
    { label: 'GIS Map', path: '/gis-map' },
    { label: 'Predictions', path: '/predictions/delay-days' },
    { label: 'Projects', path: '/projects' },
    { label: 'Settings', path: '/settings' },
  ];

  const isItemActive = (path: string) => {
    if (path === '/predictions/delay-days') {
      return location.pathname.startsWith('/predictions');
    }
    return location.pathname === path;
  };

  return (
    <header className="tl-landing-header py-5 sm:py-6 flex items-center justify-between z-30 relative">
      {/* Brand Area */}
      <Link to="/" className="flex items-center gap-2.5 group shrink-0">
        <svg
          className="w-6 h-6 text-[#527568] transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="8.5" x2="22" y2="15.5" />
          <line x1="2" y1="15.5" x2="22" y2="8.5" />
        </svg>
        <span className="text-[15px] font-bold tracking-[0.08em] text-[#101827] uppercase">
          TERRA LOCK
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden xl:flex items-center gap-7 text-[14px] font-medium text-[#4B5563]">
        {navItems.map((item) => {
          const active = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all tracking-[-0.01em] ${
                active
                  ? 'text-[#101827] bg-[#527568]/[0.08] font-semibold'
                  : 'hover:text-[#101827] hover:bg-[#527568]/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Hamburger Toggle */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="xl:hidden p-2 rounded-lg text-[#4B5563] hover:text-[#101827] hover:bg-white/60 transition-colors"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-md border border-[#E5E9E6] rounded-2xl p-6 shadow-xl space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#4B5563]">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl transition-colors font-semibold ${
                    active
                      ? 'bg-[#FAFBF9] text-[#527568]'
                      : 'hover:bg-[#FAFBF9] hover:text-[#527568] text-[#4B5563]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-[#E5E9E6] flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full text-center text-xs font-semibold text-[#101827] py-3 rounded-xl border border-[#E5E9E6] bg-[#FAFBF9]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full text-center text-xs font-semibold text-white py-3 rounded-xl bg-[#527568]"
            >
              Dashboard →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
