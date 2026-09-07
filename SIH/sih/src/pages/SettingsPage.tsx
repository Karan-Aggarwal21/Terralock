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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                SYSTEM PREFERENCES (§6.9)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Platform Configuration & Risk Thresholds
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              System-wide risk parameters, inference engine configurations, and telemetry hooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Threshold Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
              Active Risk Threshold Standards (§3 & §7)
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {Object.values(RISK_THRESHOLDS).map((cfg) => (
              <div
                key={cfg.level}
                className="flex items-center justify-between p-2.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cfg.colorHex }}
                  />
                  <span className="font-mono font-semibold">{cfg.level}</span>
                </div>
                <span className="font-mono text-slate-500">
                  {(cfg.min * 100).toFixed(0)}% – {(cfg.max * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Architecture State */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
              Data Pipeline Status (§10E)
            </h3>
          </div>
          <div className="p-3 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Data Mode:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                FastAPI Backend (Live)
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Service Layer:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Active (BackendProjectService)
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Contract Conformity:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Section 9 Strict Spec
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Connected to live FastAPI predictive pipeline at http://localhost:8000.</span>
          </div>
        </div>

        {/* Operational Risk Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
              Operational Thresholds & Alerts
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-mono text-slate-600 dark:text-slate-400">
                  Critical Escalation Threshold
                </label>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
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
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-mono text-slate-600 dark:text-slate-400">
                Escalate Critical Risk Projects
              </span>
              <input
                type="checkbox"
                checked={highRiskNotifications}
                onChange={(e) => setHighRiskNotifications(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Simulation Engine Parameters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-purple-500" />
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
              Default Simulation Parameters
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-mono text-slate-600 dark:text-slate-400 block mb-1.5">
                Default Monte Carlo Trials
              </label>
              <select
                value={defaultSimTrials}
                onChange={(e) => setDefaultSimTrials(Number(e.target.value))}
                className="w-full text-xs font-mono py-1.5 px-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value={1000}>1,000 Iterations (Fast)</option>
                <option value={5000}>5,000 Iterations (Balanced)</option>
                <option value={10000}>10,000 Iterations (Standard)</option>
                <option value={50000}>50,000 Iterations (High Precision)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-mono text-slate-600 dark:text-slate-400">
                Auto-sync Spatial Telemetry
              </span>
              <input
                type="checkbox"
                checked={autoRefreshGIS}
                onChange={(e) => setAutoRefreshGIS(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

