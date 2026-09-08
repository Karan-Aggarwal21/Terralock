import React, { useState, useRef } from 'react';
import { Project, LandParcel } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';
import { getRiskConfig } from '../../constants/risk';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  ArrowUpRight,
} from 'lucide-react';

export interface MapPanelProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenParcelModal: (project: Project, parcel?: LandParcel) => void;
  className?: string;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenParcelModal,
  className = '',
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'cadastral' | 'heatmap' | 'satellite'>('cadastral');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Geographic bounds mapping (India coordinate envelope)
  // Longitude: 68° to 92° E
  // Latitude: 8° to 34° N
  const minLng = 68;
  const maxLng = 92;
  const minLat = 8;
  const maxLat = 34;

  const width = 1000;
  const height = 650;

  const projectToCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.3, 4.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.3, 0.7));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[620px] rounded-2xl overflow-hidden border border-[#e2e8e4] bg-[#f8faf9] text-[#111827] select-none shadow-xs ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 1. Subtle Cartographic Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#244d3b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 2. Top-Left Map Layer Mode Selector */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-[#e2e8e4] shadow-sm font-mono text-[11px]">
        {(['cadastral', 'heatmap', 'satellite'] as const).map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLayer(layer);
            }}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
              activeLayer === layer
                ? 'bg-[#244d3b] text-white shadow-2xs font-semibold'
                : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f8faf9]'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* 3. Top-Right Telemetry & Compass */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#e2e8e4] font-mono text-[11px] text-[#4b5563] flex items-center gap-2 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-[#244d3b]" />
          <span>WGS 84 • SCALE {(zoom * 50).toFixed(0)}k</span>
        </div>
      </div>

      {/* 4. Bottom-Right Interactive Zoom & Pan Toolbar */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#e2e8e4] shadow-sm">
        <button
          type="button"
          id="gis-zoom-in-btn"
          aria-label="Zoom In"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 rounded-lg hover:bg-[#f4f7f5] text-[#4b5563] hover:text-[#1f2937] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="gis-zoom-out-btn"
          aria-label="Zoom Out"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="p-2 rounded-lg hover:bg-[#f4f7f5] text-[#4b5563] hover:text-[#1f2937] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="gis-reset-view-btn"
          aria-label="Reset View"
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="p-2 rounded-lg hover:bg-[#f4f7f5] text-[#4b5563] hover:text-[#1f2937] transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Main SVG Cartographic Canvas */}
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          <filter id="markerShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* India National Territorial Border Framework */}
        <path
          d="M 320 80 Q 400 60, 480 90 T 600 130 T 780 180 T 760 280 T 680 340 T 700 420 T 540 580 T 420 540 T 360 420 T 260 300 T 240 180 Z"
          fill="#eaf2ec"
          stroke="#9dc2ab"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Render Each Project on the Map */}
        {projects.map((proj) => {
          const pt = projectToCoords(proj.location.lat, proj.location.lng);
          const isSelected = proj.project_id === selectedProjectId;
          const riskConfig = getRiskConfig(proj.risk_level);

          return (
            <g
              key={proj.project_id}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(proj.project_id);
                onOpenParcelModal(proj);
              }}
              onMouseEnter={() => setHoveredProject(proj)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Heatmap Layer Mode Halo */}
              {activeLayer === 'heatmap' && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 65 : 45}
                  fill={riskConfig.colorHex}
                  opacity={isSelected ? 0.35 : 0.2}
                  className="transition-all duration-300"
                />
              )}

              {/* Right-of-Way Corridor Alignment Vector */}
              <path
                d={`M ${pt.x - 30} ${pt.y + 15} Q ${pt.x} ${pt.y}, ${pt.x + 35} ${pt.y - 12}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={isSelected ? 8 : 5}
                strokeLinecap="round"
                opacity="0.35"
              />
              <path
                d={`M ${pt.x - 30} ${pt.y + 15} Q ${pt.x} ${pt.y}, ${pt.x + 35} ${pt.y - 12}`}
                fill="none"
                stroke={riskConfig.colorHex}
                strokeWidth={isSelected ? 3 : 2}
                strokeDasharray="4 2"
              />

              {/* Cadastral Parcels Polygons */}
              {activeLayer !== 'heatmap' && proj.parcels && (
                <g>
                  {proj.parcels.map((parcel, pIdx) => {
                    const polyPoints =
                      pIdx === 0
                        ? `${pt.x - 18},${pt.y - 14} ${pt.x - 4},${pt.y - 18} ${pt.x - 2},${pt.y - 4} ${pt.x - 14},${pt.y - 2}`
                        : pIdx === 1
                        ? `${pt.x + 4},${pt.y - 10} ${pt.x + 18},${pt.y - 12} ${pt.x + 22},${pt.y} ${pt.x + 8},${pt.y + 2}`
                        : `${pt.x - 8},${pt.y + 6} ${pt.x + 6},${pt.y + 8} ${pt.x + 4},${pt.y + 20} ${pt.x - 10},${pt.y + 16}`;

                    const parcelRisk = getRiskConfig(parcel.risk_level);

                    return (
                      <polygon
                        key={parcel.parcel_id}
                        points={polyPoints}
                        fill={parcelRisk.colorHex}
                        fillOpacity={isSelected ? 0.4 : 0.2}
                        stroke={parcelRisk.colorHex}
                        strokeWidth="1.2"
                        className="hover:fill-opacity-70 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(proj.project_id);
                          onOpenParcelModal(proj, parcel);
                        }}
                      />
                    );
                  })}
                </g>
              )}

              {/* Radar Pulsing Epicenter for Selected or High/Critical */}
              {(isSelected || proj.risk_level === 'CRITICAL' || proj.risk_level === 'HIGH') && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 22 : 16}
                  fill="none"
                  stroke={riskConfig.colorHex}
                  strokeWidth="1.5"
                  className="animate-ping"
                  opacity="0.6"
                />
              )}

              {/* Central Marker Beacon (Style matching UI Inspiration) */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 9 : 7}
                fill={riskConfig.colorHex}
                stroke="#ffffff"
                strokeWidth={isSelected ? 2.5 : 2}
                filter="url(#markerShadow)"
                className="transition-transform group-hover:scale-125 duration-200"
              />

              {/* Outer selection ring */}
              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="none"
                  stroke={riskConfig.colorHex}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Text Tag at Normal Zoom */}
              <text
                x={pt.x + 12}
                y={pt.y + 4}
                className="text-[11px] font-mono font-semibold fill-slate-800 pointer-events-none drop-shadow-xs"
              >
                {proj.project_id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 6. White Floating Project/Parcel Detail Panel */}
      {(() => {
        const displayProject = hoveredProject || projects.find((p) => p.project_id === selectedProjectId) || projects[0] || null;
        if (!displayProject) return null;

        return (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 z-20 w-80 sm:w-88 bg-white/98 backdrop-blur-md border border-[#e2e8e4] rounded-2xl p-5 shadow-xl font-sans"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#718d7c]">
                {displayProject.project_id} • {displayProject.state || 'National'}
              </span>
              <RiskBadge level={displayProject.risk_level} size="xs" />
            </div>

            <h4 className="text-sm font-semibold text-[#101827] leading-snug truncate font-sans">
              {displayProject.name}
            </h4>

            <p className="text-[11px] text-[#6b7280] truncate mt-0.5">
              {displayProject.corridor_name || 'Standard Regional Alignment'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#edf2ee] text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                <span className="text-[10px] text-[#6b7280] block uppercase font-semibold">Predicted Delay</span>
                <span className="font-bold text-[#1f2937] text-sm block mt-0.5">
                  +{displayProject.predicted_delay_days} Days
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e4]">
                <span className="text-[10px] text-[#6b7280] block uppercase font-semibold">Delay Prob</span>
                <span className="font-bold text-sm block mt-0.5" style={{ color: getRiskConfig(displayProject.risk_level).colorHex }}>
                  {(displayProject.delay_probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpenParcelModal(displayProject)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#244d3b] hover:bg-[#1b3d2e] text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <span>Cadastral Parcels ({displayProject.parcels?.length || 0})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
