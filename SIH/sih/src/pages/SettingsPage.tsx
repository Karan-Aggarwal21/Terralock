import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, Database, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { RISK_THRESHOLDS } from '../constants/risk';

export const SettingsPage: React.FC = () => {
  const [alertThreshold, setAlertThreshold] = useState<number>(70);
  const [defaultSimTrials, setDefaultSimTrials] = useState<number>(10000);
  const [autoRefreshGIS, setAutoRefreshGIS] = useState<boolean>(true);
  const [highRiskNotifications, setHighRiskNotifications] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-[#244d3b]" />
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-wider text-[#527568] uppercase">
                SYSTEM PREFERENCES (§6.9)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101827] tracking-tight leading-tight">
              Platform Configuration & Risk Thresholds
            </h1>
            <p className="text-sm text-[#4b5563] mt-1">
              System-wide risk parameters, inference engine configurations, and telemetry hooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#244d3b] font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#244d3b] hover:bg-[#1b3b2d] text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Threshold Matrix */}
        <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#111827]">
              Active Risk Threshold Standards (§3 & §7)
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {Object.values(RISK_THRESHOLDS).map((cfg) => (
              <div
                key={cfg.level}
                className="flex items-center justify-between p-3 rounded-lg border border-[#e2e8e4] bg-[#f8faf9]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cfg.colorHex }}
                  />
                  <span className="font-mono font-semibold text-[#111827]">{cfg.level}</span>
                </div>
                <span className="font-mono text-[#64748b]">
                  {(cfg.min * 100).toFixed(0)}% – {(cfg.max * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Architecture State */}
        <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#111827]">
              Data Pipeline Status (§10E)
            </h3>
          </div>
          <div className="p-3.5 rounded-lg border border-[#e2e8e4] bg-[#f8faf9] space-y-2.5 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#64748b]">Data Mode:</span>
              <span className="font-semibold text-[#244d3b]">
                FastAPI Backend (Live)
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#64748b]">Service Layer:</span>
              <span className="font-semibold text-[#111827]">
                Active (BackendProjectService)
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#64748b]">Contract Conformity:</span>
              <span className="font-semibold text-[#111827]">
                Section 9 Strict Spec
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#64748b] font-mono">
            <ShieldCheck className="w-4 h-4 text-[#244d3b] shrink-0" />
            <span>Connected to live FastAPI predictive pipeline at http://localhost:8000.</span>
          </div>
        </div>

        {/* Operational Risk Controls */}
        <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#111827]">
              Operational Thresholds & Alerts
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-mono text-[#374151]">
                  Critical Escalation Threshold
                </label>
                <span className="font-mono font-bold text-amber-600">
                  {alertThreshold}% Probability
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e2e8e4] rounded-lg appearance-none cursor-pointer accent-[#244d3b]"
              />
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#f1f5f3]">
              <span className="font-mono text-[#374151]">
                Escalate Critical Risk Projects
              </span>
              <input
                type="checkbox"
                checked={highRiskNotifications}
                onChange={(e) => setHighRiskNotifications(e.target.checked)}
                className="rounded border-[#e2e8e4] text-[#244d3b] focus:ring-[#244d3b] w-4 h-4 cursor-pointer accent-[#244d3b]"
              />
            </div>
          </div>
        </div>

        {/* Simulation Engine Parameters */}
        <div className="bg-white border border-[#e2e8e4] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-[#244d3b]" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#111827]">
              Default Simulation Parameters
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-mono text-[#374151] block mb-1.5">
                Default Monte Carlo Trials
              </label>
              <select
                value={defaultSimTrials}
                onChange={(e) => setDefaultSimTrials(Number(e.target.value))}
                className="w-full text-xs font-mono py-2 px-3 rounded-lg border border-[#e2e8e4] bg-[#f8faf9] text-[#111827] focus:outline-none focus:border-[#244d3b]"
              >
                <option value={1000}>1,000 Iterations (Fast)</option>
                <option value={5000}>5,000 Iterations (Balanced)</option>
                <option value={10000}>10,000 Iterations (Standard)</option>
                <option value={50000}>50,000 Iterations (High Precision)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#f1f5f3]">
              <span className="font-mono text-[#374151]">
                Auto-sync Spatial Telemetry
              </span>
              <input
                type="checkbox"
                checked={autoRefreshGIS}
                onChange={(e) => setAutoRefreshGIS(e.target.checked)}
                className="rounded border-[#e2e8e4] text-[#244d3b] focus:ring-[#244d3b] w-4 h-4 cursor-pointer accent-[#244d3b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

