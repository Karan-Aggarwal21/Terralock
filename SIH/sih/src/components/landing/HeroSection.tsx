import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  MapPin,
  Database,
  BarChart3,
} from 'lucide-react';


export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Risk Analysis', path: '/risk-analysis' },
    { label: 'Simulation', path: '/simulation' },
    { label: 'GIS Map', path: '/gis-map' },
    { label: 'Predictions', path: '/predictions/delay-days' },
    { label: 'Projects', path: '/projects' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF9] text-[#101827] flex flex-col justify-between selection:bg-[#527568] selection:text-white relative overflow-hidden font-sans">
      {/* Subtle Ambient Background Gradient Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#edf5f0]/80 via-transparent to-transparent rounded-full pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-[35%] left-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-[#f3f7f4]/80 via-transparent to-transparent rounded-full pointer-events-none -z-10 blur-3xl" />

      {/* =========================================================================
          1. HEADER / NAVIGATION (Generous padding, clean enterprise spacing)
          ========================================================================= */}
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
        <nav className="hidden xl:flex items-center gap-7 text-[13px] font-medium text-[#4B5563]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-2 rounded-lg hover:text-[#101827] hover:bg-[#527568]/[0.04] transition-all tracking-[-0.01em]"
            >
              {item.label}
            </Link>
          ))}
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
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl hover:bg-[#FAFBF9] hover:text-[#527568] transition-colors font-semibold"
                >
                  {item.label}
                </Link>
              ))}
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

      {/* =========================================================================
          2. HERO SECTION (Main visual moved slightly upward with slightly rounded rectangular form)
          ========================================================================= */}
      <section
        id="home"
        className="tl-landing-container tl-landing-hero grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-20"
      >
        {/* Left Column (~45%) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="tl-hero-eyebrow-gap">
            <span className="text-[13px] sm:text-[14px] font-semibold tracking-wider text-[#527568] uppercase">
              LAND INTELLIGENCE FOR A STRONGER TOMORROW
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-[#101827] tracking-[-0.025em] leading-[1.08] tl-hero-heading-gap">
            Smarter Decisions<br />
            for a Developed<br />
            <span className="text-[#527568]">India</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-[520px] font-normal tl-hero-para-gap">
            TERRA LOCK uses AI and geospatial intelligence to predict land acquisition risks, prevent delays, and accelerate infrastructure development.
          </p>

          {/* CTA Button — "Dashboard" replaces "Explore Platform", "Watch Demo" removed */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              id="hero-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="tl-landing-btn tl-landing-btn-primary"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Statistics (3 stats — "100 Government Partners" removed) */}
          <div className="tl-hero-stats-gap border-t border-[#E5E9E6] grid grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#101827] tracking-tight">
                500+
              </div>
              <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
                Projects Monitored
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#101827] tracking-tight">
                75%
              </div>
              <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
                Faster Decisions
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#101827] tracking-tight">
                28%
              </div>
              <div className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
                Delay Reduction
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (~55%): Moved further upward */}
        <div className="lg:col-span-7 relative flex items-center justify-center -mt-14 lg:-mt-24">
          <div className="relative w-full max-w-[620px] rounded-[32px] overflow-hidden border border-[#E5E9E6] bg-gradient-to-b from-[#f8faf8] to-[#f0f4f1] shadow-xs">
            {/* Soft Dissolving Map Canvas inside slightly rounded rectangular form */}
            <div
              className="relative w-full overflow-hidden rounded-[30px]"
              style={{
                maskImage:
                  'radial-gradient(ellipse 90% 86% at 52% 48%, black 45%, rgba(0,0,0,0.85) 75%, transparent 99%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 90% 86% at 52% 48%, black 45%, rgba(0,0,0,0.85) 75%, transparent 99%)',
              }}
            >
              <img
                src="/india.png"
                alt="TERRA LOCK Geospatial Infrastructure India Map"
                className="w-full h-auto object-cover transform scale-105"
                loading="eager"
              />

              {/* Seamless gradient edge feathering into rounded container */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAFBF9] via-[#FAFBF9]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FAFBF9] via-[#FAFBF9]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAFBF9] via-[#FAFBF9]/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAFBF9] via-[#FAFBF9]/40 to-transparent pointer-events-none" />
            </div>

            {/* Image Caption */}
            <div className="py-2.5 px-6 text-right text-[#6B7280] font-sans text-xs italic bg-white/40 border-t border-[#E5E9E6]/60">
              Infrastructure for a Brighter Tomorrow
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. KEY FEATURES SECTION (Improved Card Padding & Spacing)
          ========================================================================= */}
      <section id="features" className="w-full tl-landing-container py-24 sm:py-32 space-y-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-[12px] font-semibold tracking-widest text-[#527568] uppercase">
              KEY FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101827] tracking-tight">
              Everything you need for <br />
              smarter land acquisition
            </h2>
            <p className="text-base text-[#4B5563] max-w-2xl font-normal pt-1">
              From prediction to planning, TERRA LOCK provides a complete suite of tools to streamline land acquisition.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#527568] hover:text-[#436257] transition-colors cursor-pointer"
          >
            <span>Explore All Features</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Clean Feature Cards with Generous Internal Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Card 1: AI-Powered Predictions */}
          <div className="tl-feature-card group">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#edf7f1] text-[#527568] flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#101827]">
                  AI-Powered Predictions
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mt-2">
                  Predict delays, risk levels and key reasons using advanced machine learning models.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-[#edf2ee]">
              <Link
                to="/predictions/delay-days"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#527568] group-hover:translate-x-0.5 transition-transform"
              >
                <span>Delay Forecast (F4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Interactive GIS Mapping */}
          <div className="tl-feature-card group">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#edf7f1] text-[#527568] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#101827]">
                  Interactive GIS Mapping
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mt-2">
                  Visualize project locations, land parcels and risk zones on an interactive map.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-[#edf2ee]">
              <Link
                to="/gis-map"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#527568] group-hover:translate-x-0.5 transition-transform"
              >
                <span>Cadastral GIS (F6)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Comprehensive Data Management */}
          <div className="tl-feature-card group">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#edf7f1] text-[#527568] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#101827]">
                  Comprehensive Data
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mt-2">
                  Organize and access land records, documents and approvals in one place.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-[#edf2ee]">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#527568] group-hover:translate-x-0.5 transition-transform"
              >
                <span>Project Records (F7)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Actionable Insights */}
          <div className="tl-feature-card group">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#edf7f1] text-[#527568] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#101827]">
                  Actionable Insights
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mt-2">
                  Get clear recommendations to mitigate risks and keep projects on track.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-[#edf2ee]">
              <Link
                to="/simulation"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#527568] group-hover:translate-x-0.5 transition-transform"
              >
                <span>Monte Carlo (F2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. GIS & RISK ANALYSIS SECTION (Generous padding, clean cards, no decorative icons)
          ========================================================================= */}
      <section id="risk-analysis" className="w-full bg-white border-t border-b border-[#E5E9E6] py-28 sm:py-36">
        <div className="w-full tl-landing-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Feature points with clean card containers, NO decorative icons */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-[#527568] uppercase">
                INDIA AT A GLANCE
              </span>
              <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] font-extrabold text-[#101827] leading-[1.1] tracking-[-0.02em]">
                See the bigger picture
              </h2>
            </div>

            {/* Feature Points without decorative icons, generous internal padding */}
            <div className="space-y-5">
              <div className="tl-gis-feature-item space-y-2">
                <h4 className="font-semibold text-[#0f1f2e] text-[15px] tracking-[-0.01em]">
                  State-wise risk visualization
                </h4>
                <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
                  Identify high-risk regions at a glance.
                </p>
              </div>

              <div className="tl-gis-feature-item space-y-2">
                <h4 className="font-semibold text-[#0f1f2e] text-[15px] tracking-[-0.01em]">
                  Project location mapping
                </h4>
                <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
                  View ongoing and upcoming projects.
                </p>
              </div>

              <div className="tl-gis-feature-item space-y-2">
                <h4 className="font-semibold text-[#0f1f2e] text-[15px] tracking-[-0.01em]">
                  Satellite imagery integration
                </h4>
                <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
                  Access real-world land insights.
                </p>
              </div>

              <div className="tl-gis-feature-item space-y-2">
                <h4 className="font-semibold text-[#0f1f2e] text-[15px] tracking-[-0.01em]">
                  Filter and search
                </h4>
                <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
                  Find projects, districts or land parcels easily.
                </p>
              </div>
            </div>

            {/* Action Buttons — Improved Padding & Consistent Design */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/gis-map"
                className="tl-landing-btn tl-landing-btn-primary"
              >
                <span>Explore Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/risk-analysis"
                className="tl-landing-btn tl-landing-btn-secondary"
              >
                <span>Risk Analysis</span>
                <ArrowRight className="w-4 h-4 text-[#527568]" />
              </Link>
            </div>
          </div>

          {/* Right Column: India Silhouette with Risk Nodes & Floating Card */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] p-2 sm:p-4">
            <div className="relative w-full max-w-[540px] aspect-[4/3] bg-gradient-to-br from-[#f4f8f5] to-[#edf4f0] rounded-3xl border border-[#E5E9E6] p-8 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Subtle map topography grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#527568_1px,transparent_1px)] [background-size:18px_18px]" />

              {/* Topographical contour circles mimicking India GIS layout */}
              <svg
                viewBox="0 0 500 450"
                className="w-full h-full object-contain text-[#527568]/15"
                fill="currentColor"
              >
                <path
                  d="M210 40 Q230 45 240 70 Q270 75 290 100 Q320 115 310 145 Q360 160 380 180 Q370 200 340 210 Q320 220 300 210 Q280 230 290 260 Q270 290 250 320 Q240 370 225 410 Q215 370 200 320 Q170 280 160 250 Q140 230 110 210 Q120 180 150 170 Q160 140 180 120 Q190 90 210 40 Z"
                  fill="currentColor"
                  opacity="0.25"
                />
                <circle cx="235" cy="220" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="235" cy="220" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="235" cy="220" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Geographic Hotspot Nodes */}
              <div className="absolute top-[32%] left-[48%] group cursor-pointer">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-md border-2 border-white" />
                </span>
              </div>
              <div className="absolute top-[42%] left-[62%]">
                <span className="inline-flex rounded-full h-3.5 w-3.5 bg-red-500 shadow-md border-2 border-white" />
              </div>

              <div className="absolute top-[48%] left-[38%]">
                <span className="inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 shadow-md border-2 border-white" />
              </div>
              <div className="absolute top-[58%] left-[45%]">
                <span className="inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 shadow-md border-2 border-white" />
              </div>
              <div className="absolute top-[36%] left-[32%]">
                <span className="inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-md border-2 border-white" />
              </div>

              <div className="absolute top-[68%] left-[48%]">
                <span className="inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-md border-2 border-white" />
              </div>
              <div className="absolute top-[78%] left-[46%]">
                <span className="inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-md border-2 border-white" />
              </div>
              <div className="absolute top-[52%] left-[54%]">
                <span className="inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-md border-2 border-white" />
              </div>
              <div className="absolute top-[25%] left-[44%]">
                <span className="inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-md border-2 border-white" />
              </div>

              {/* Floating "High Risk Zone" Card */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm border border-[#E5E9E6] rounded-2xl p-5 shadow-lg w-[220px] space-y-2.5 font-sans animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                      High Risk Zone
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-xs font-bold text-[#101827]">Uttar Pradesh</span>
                    </div>
                  </div>
                  <Link
                    to="/risk-analysis"
                    className="w-7 h-7 rounded-full bg-[#FAFBF9] hover:bg-[#edf7f1] border border-[#E5E9E6] flex items-center justify-center text-[#527568] transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#4B5563] pt-1.5 border-t border-[#f0f4f1]">
                  <span>12 Projects</span>
                  <span className="font-semibold text-red-600">78% Avg. Risk</span>
                </div>
              </div>

              {/* Bottom Right Legend */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm border border-[#E5E9E6] rounded-xl px-4 py-3 shadow-sm flex flex-col gap-2 text-[11px] font-medium text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Low Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FOOTER
          ========================================================================= */}
      <footer id="contact" className="w-full border-t border-[#E5E9E6] bg-white py-14 text-xs font-sans">
        <div className="w-full tl-landing-container grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-[#527568]"
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
              <span className="font-bold text-[#101827] text-sm uppercase">TERRA LOCK</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Land intelligence for a stronger tomorrow.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-xs text-[#101827] uppercase tracking-wider">Quick Links</span>
            <ul className="space-y-2 text-[#4B5563]">
              <li><Link to="/dashboard" className="hover:text-[#101827]">Dashboard</Link></li>
              <li><Link to="/risk-analysis" className="hover:text-[#101827]">Risk Analysis</Link></li>
              <li><Link to="/simulation" className="hover:text-[#101827]">Simulation</Link></li>
              <li><Link to="/gis-map" className="hover:text-[#101827]">GIS Map</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-xs text-[#101827] uppercase tracking-wider">Features</span>
            <ul className="space-y-2 text-[#4B5563]">
              <li><Link to="/predictions/delay-days" className="hover:text-[#101827]">Delay Forecast</Link></li>
              <li><Link to="/predictions/delay-reason" className="hover:text-[#101827]">Root Cause</Link></li>
              <li><Link to="/projects" className="hover:text-[#101827]">Projects</Link></li>
              <li><Link to="/settings" className="hover:text-[#101827]">Settings</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-xs text-[#101827] uppercase tracking-wider">Stay Updated</span>
            <p className="text-xs text-[#6B7280]">Get the latest news and updates.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to TERRA LOCK updates!');
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E5E9E6] bg-[#FAFBF9] text-xs text-[#101827] outline-none focus:border-[#527568]"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-lg bg-[#527568] text-white hover:bg-[#436257] transition-colors cursor-pointer shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="w-full tl-landing-container pt-10 mt-10 border-t border-[#E5E9E6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6B7280]">
          <div>© 2025 TERRA LOCK. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#101827]">Privacy Policy</a>
            <a href="#" className="hover:text-[#101827]">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
