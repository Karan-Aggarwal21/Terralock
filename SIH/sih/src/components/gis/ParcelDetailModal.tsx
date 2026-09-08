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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-[#e2e8e4] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#edf2ee] bg-[#f8faf9]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#244d3b]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#244d3b]">
              Cadastral Parcel & Corridor Telemetry
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Parcel Details"
            className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#1f2937] hover:bg-[#edf2ee] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Project Title & Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#6b7280] uppercase font-bold">
                  Project: [{project.project_id}]
                </span>
                {isActiveProject && (
                  <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-bold font-mono bg-[#edf7f1] text-[#1e5637] border border-[#c6e6d2]">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>ACTIVE</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#101827] leading-snug font-sans">
                {project.name}
              </h2>
              <p className="text-xs text-[#6b7280] font-mono mt-0.5">
                Coordinates: {project.location.lat.toFixed(4)}° N, {project.location.lng.toFixed(4)}° E ({project.state || 'National'})
              </p>
            </div>

            <RiskBadge level={parcel?.risk_level || project.risk_level} size="md" />
          </div>

          {/* Specific Parcel Demarcation */}
          {parcel && (
            <div className="p-4 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#1f2937] font-bold font-sans">Survey No: {parcel.survey_number}</span>
                <span className="text-[11px] font-bold text-[#244d3b]">
                  {parcel.area_ha} Hectares
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6b7280] font-sans">
                <span>Village: {parcel.village}</span>
                <span>Tenure: {parcel.ownership_type}</span>
              </div>
            </div>
          )}

          {/* Required Contract Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl border border-[#e2e8e4] bg-[#f8faf9]">
              <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Acquisition Status</span>
              <span className="font-bold text-[#1f2937] block mt-0.5 truncate">
                {parcel?.status || project.status || 'In Progress'}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#e2e8e4] bg-[#f8faf9]">
              <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Delay Probability</span>
              <span className="font-bold block mt-0.5" style={{ color: riskConfig.colorHex }}>
                {((parcel?.delay_probability || project.delay_probability) * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#e2e8e4] bg-[#f8faf9]">
              <span className="text-[10px] text-[#6b7280] uppercase block font-semibold">Predicted Delay</span>
              <span className="font-bold text-[#1f2937] block mt-0.5">
                +{parcel?.predicted_delay_days || project.predicted_delay_days} Days
              </span>
            </div>
          </div>

          {/* Primary Reason */}
          <div className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#f8faf9] flex items-start gap-3 text-xs">
            <Scale className="w-4 h-4 text-[#244d3b] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-[#6b7280] uppercase block font-bold font-mono">
                Primary Delay Driver
              </span>
              <span className="font-bold text-[#1f2937] block mt-0.5 font-sans">
                {parcel?.primary_impediment || project.delay_reason}
              </span>
              <span className="text-[10px] text-[#6b7280] block mt-0.5 font-mono">
                Causal Confidence: {(project.delay_reason_confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-[#edf2ee] bg-[#f8faf9]">
          {!isActiveProject ? (
            <button
              type="button"
              id="set-active-project-btn"
              onClick={() => {
                onSelectProject(project.project_id);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#edf4ef] hover:bg-[#e2ece5] text-[#1e5637] border border-[#c6e6d2] text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set as Active Project</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-[#1e5637] font-bold">
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#244d3b] hover:bg-[#1b3d2e] text-white text-xs font-mono font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Decision Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
