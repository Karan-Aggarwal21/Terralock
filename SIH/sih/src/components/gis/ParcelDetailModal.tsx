import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, LandParcel } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';
import { getRiskConfig } from '../../constants/risk';
import { X, ExternalLink, MapPin, CheckCircle2, Scale } from 'lucide-react';

interface ParcelDetailModalProps {
  project: Project;
  parcel?: LandParcel | null;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  isActiveProject: boolean;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({
  project,
  parcel,
  onClose,
  onSelectProject,
  isActiveProject,
}) => {
  const navigate = useNavigate();
  const riskConfig = getRiskConfig(parcel?.risk_level || project.risk_level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Cadastral Parcel Telemetry (§6.6)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Parcel Details"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 font-mono">
          {/* Project Title & Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-slate-400 uppercase">
                  Project: [{project.project_id}]
                </span>
                {isActiveProject && (
                  <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>ACTIVE</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug font-sans">
                {project.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: {project.location.lat.toFixed(4)}° N, {project.location.lng.toFixed(4)}° E ({project.state || 'National'})
              </p>
            </div>

            <RiskBadge level={parcel?.risk_level || project.risk_level} size="md" />
          </div>

          {/* Specific Parcel Demarcation (if clicked on parcel polygon) */}
          {parcel && (
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Survey No: {parcel.survey_number}</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {parcel.area_ha} Hectares
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Village: {parcel.village}</span>
                <span>Tenure: {parcel.ownership_type}</span>
              </div>
            </div>
          )}

          {/* Required Contract Parameters (§6.6) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <span className="text-[10px] text-slate-400 uppercase block">Acquisition Status</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                {parcel?.status || project.status || 'In Progress'}
              </span>
            </div>

            <div className="p-2.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <span className="text-[10px] text-slate-400 uppercase block">Delay Probability</span>
              <span className="font-bold block mt-0.5" style={{ color: riskConfig.colorHex }}>
                {((parcel?.delay_probability || project.delay_probability) * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-2.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <span className="text-[10px] text-slate-400 uppercase block">Predicted Delay</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                {parcel?.predicted_delay_days || project.predicted_delay_days} Days
              </span>
            </div>
          </div>

          {/* Primary Reason */}
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-start gap-2.5 text-xs">
            <Scale className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                Primary Delay Reason (§6.6)
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 block mt-0.5 font-sans">
                {parcel?.primary_impediment || project.delay_reason}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Confidence Rating: {(project.delay_reason_confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          {!isActiveProject ? (
            <button
              type="button"
              id="set-active-project-btn"
              onClick={() => {
                onSelectProject(project.project_id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-xs font-mono font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set as Active Project</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Currently Selected Globally
            </span>
          )}

          <button
            type="button"
            id="view-project-dashboard-btn"
            onClick={() => {
              onSelectProject(project.project_id);
              onClose();
              navigate('/dashboard');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <span>Open Decision Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
