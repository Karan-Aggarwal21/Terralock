import React, { useState } from 'react';
import { useProject } from '../../context';
import { analyzeProjectApi } from '../../api/client';
import { mapBackendAnalysisToProject } from '../../api/mappers';
import { CorridorBaseProfile } from '../../api/corridorDefinitions';
import {
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Building2,
  Coins,
  Maximize2,
} from 'lucide-react';

interface ProjectFormState {
  name: string;
  projectType: string;
  state: string;
  area: string;
  budget: string;
  coordinatesRaw: string;
}

const EMPTY_FORM: ProjectFormState = {
  name: '',
  projectType: 'railway',
  state: '',
  area: '',
  budget: '',
  coordinatesRaw: '',
};

const EXAMPLE_PRESET: ProjectFormState = {
  name: 'Northern Inter-State High-Speed Rail Corridor',
  projectType: 'railway',
  state: 'Haryana',
  area: '350',
  budget: '4200',
  coordinatesRaw: `[[76.85, 28.30], [77.10, 28.30], [77.10, 28.55], [76.85, 28.55], [76.85, 28.30]]`,
};

export const ProjectAnalysisInputBanner: React.FC = () => {
  const { addCustomProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Validate and parse coordinates
      let parsedCoords: number[][];
      try {
        parsedCoords = JSON.parse(formData.coordinatesRaw);
        if (!Array.isArray(parsedCoords) || parsedCoords.length < 3) {
          throw new Error('Polygon must contain at least 3 [longitude, latitude] points.');
        }
      } catch {
        throw new Error(
          'Invalid Coordinates format. Provide valid JSON array: [[lng, lat], [lng, lat], ...]'
        );
      }

      // Ensure closed polygon ring if first and last point differ
      const first = parsedCoords[0];
      const last = parsedCoords[parsedCoords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        parsedCoords.push([first[0], first[1]]);
      }

      // Compute center from coordinates
      const avgLng = parsedCoords.reduce((acc, c) => acc + c[0], 0) / parsedCoords.length;
      const avgLat = parsedCoords.reduce((acc, c) => acc + c[1], 0) / parsedCoords.length;

      const projectId = `CUSTOM-${Date.now().toString().slice(-4)}`;

      // 2. Prepare Backend Payload
      const payload = {
        project: {
          name: formData.name.trim(),
          project_type: formData.projectType,
          region: formData.state.trim(),
          area: Number(formData.area),
          budget: Number(formData.budget),
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [parsedCoords],
        },
      };

      // 3. Request live prediction from backend API
      const backendResponse = await analyzeProjectApi(payload);

      // 4. Construct corridor profile wrapper
      const corridorProfile: CorridorBaseProfile = {
        project_id: projectId,
        name: formData.name.trim(),
        state: formData.state.trim(),
        status: 'Acquisition In Progress',
        corridor_name: `${formData.name.trim()} Corridor`,
        location: { lat: avgLat, lng: avgLng },
        total_budget_cr: Number(formData.budget),
        land_required_ha: Number(formData.area),
        requestPayload: payload,
        timeline: {
          planned_duration_months: 24,
          planned_start_date: new Date().toISOString().split('T')[0],
          planned_completion_date: new Date(Date.now() + 24 * 30 * 86400000)
            .toISOString()
            .split('T')[0],
        },
        acquisition_progress: [
          { stage: 'Sec 4(1) Public Notification', percent: 100, status: 'completed' },
          { stage: 'Sec 6 Declaration of Acquisition', percent: 75, status: 'in_progress' },
          { stage: 'Sec 11 Enquiry & Valuation', percent: 40, status: 'in_progress' },
          { stage: 'Sec 19 Award Determination', percent: 15, status: 'pending' },
        ],
        risk_input_metrics: [
          {
            category: 'Financial',
            metric: 'Circle Rate vs Market Rate Disparity',
            value: '2.1 ratio',
            impactLevel: 'moderate',
            detail: 'Market rate exceeds circle rate by 110%.',
          },
          {
            category: 'Encroachment',
            metric: 'High-Density Encroachment Count',
            value: `${backendResponse.gis.building_count || 12} structures`,
            impactLevel: 'moderate',
            detail: 'Identified built-up structures within corridor buffer.',
          },
        ],
        parcels: [],
      };

      // 5. Map to unified Project
      const mappedProject = mapBackendAnalysisToProject(backendResponse, corridorProfile);

      // 6. Set in global Project Context & auto-select
      addCustomProject(mappedProject);
      setSuccessMsg(`Analysis completed! Loaded "${mappedProject.name}" into Dashboard.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete project risk analysis.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-white via-[#fafcfb] to-white border border-[#E2E7E4] rounded-2xl shadow-[0_4px_20px_-4px_rgba(45,122,79,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_-4px_rgba(45,122,79,0.12)]">
      {/* Top Banner Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4.5 flex items-center justify-between gap-4 transition-colors text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D7A4F] to-[#1e5837] flex items-center justify-center text-white shadow-md shadow-[#2D7A4F]/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-[16px] sm:text-[17px] text-[#101827] font-sans tracking-tight">
                Run Custom Project Risk Analysis
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDF7F1] border border-[#C6E6D2] text-[#2D7A4F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4F] animate-ping" />
                Live ML &amp; GIS
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-sans mt-0.5">
              Input corridor coordinates &amp; parameters to evaluate delay probabilities and encroachment risks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F8F6] border border-[#E2E7E4] group-hover:bg-[#edf7f1] group-hover:border-[#c6e6d2] text-[#2D7A4F] font-semibold text-xs transition-colors shrink-0">
          <span>{isOpen ? 'Collapse Form' : 'Open Input Form'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Form Body */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 border-t border-[#E2E7E4] space-y-5 bg-white">
          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Name */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-1.5 font-sans">
                Project Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Surat-Vadodara High Speed Corridor"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-sm text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-1.5 font-sans">
                Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-sm text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
              >
                <option value="railway">Railway / Dedicated Freight</option>
                <option value="highway">National / State Highway</option>
                <option value="metro">Metro / Urban Transit</option>
                <option value="pipeline">Pipeline / Energy Corridor</option>
                <option value="transmission">Power Transmission Line</option>
              </select>
            </div>

            {/* State / Region */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-1.5 font-sans flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#527568]" /> State / Region
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Gujarat, Haryana"
                className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-sm text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
              />
            </div>

            {/* Land Scope (Hectares) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-1.5 font-sans flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-[#527568]" /> Land Scope (Ha)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. 420"
                className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-sm text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
              />
            </div>

            {/* Budget (Cr) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-1.5 font-sans flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#527568]" /> Budget (₹ Cr)
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 3850"
                className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-sm text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* GeoJSON Polygon Coordinates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4B5563] font-sans flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#527568]" /> Polygon Boundary Coordinates [Lng, Lat]
              </label>
              <span className="text-[11px] text-[#64748B]">OpenStreetMap Overpass Bounding Box</span>
            </div>
            <textarea
              rows={2}
              required
              value={formData.coordinatesRaw}
              onChange={(e) => setFormData({ ...formData, coordinatesRaw: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#F7F8F6] border border-[#E2E7E4] rounded-lg text-xs font-mono text-[#101827] focus:outline-none focus:border-[#527568] focus:bg-white transition-colors"
              placeholder="e.g. [[72.90, 21.80], [73.15, 21.80], [73.15, 22.05], [72.90, 22.05], [72.90, 21.80]]"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData(EXAMPLE_PRESET)}
                className="text-xs font-medium text-[#527568] hover:text-[#3d584e] underline cursor-pointer"
              >
                Fill with Example
              </button>
              <span className="text-[#CBD5E1]">|</span>
              <button
                type="button"
                onClick={() => setFormData(EMPTY_FORM)}
                className="text-xs font-medium text-[#64748B] hover:text-[#101827] underline cursor-pointer"
              >
                Clear
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#2D7A4F] text-white hover:bg-[#256641] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Querying GIS &amp; Predicting...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Execute Risk Prediction</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
