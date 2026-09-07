import React, { useState, useRef } from 'react';
import { Project, LandParcel } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';
import { getRiskConfig } from '../../constants/risk';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Compass,
} from 'lucide-react';

interface MapPanelProps {
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
      className={`relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 1. Map Layer Styling (Satellite / Cartographic Grid) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 2. Top-Left Map Layer Mode Selector */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-md font-mono text-[11px]">
        {(['cadastral', 'heatmap', 'satellite'] as const).map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLayer(layer);
            }}
            className={`px-2.5 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
              activeLayer === layer
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* 3. Top-Right Telemetry & Compass */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 font-mono text-[11px] text-slate-300 flex items-center gap-1.5 shadow-md">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>DATUM: WGS 84 • SCALE: {(zoom * 50).toFixed(0)}k</span>
        </div>
      </div>

      {/* 4. Bottom-Right Interactive Zoom & Pan Toolbar */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-md">
        <button
          type="button"
          id="gis-zoom-in-btn"
          aria-label="Zoom In"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
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
          className="p-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
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
          className="p-2 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
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
          <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Simplified National Territorial Border Framework */}
        <path
          d="M 320 80 Q 400 60, 480 90 T 600 130 T 780 180 T 760 280 T 680 340 T 700 420 T 540 580 T 420 540 T 360 420 T 260 300 T 240 180 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
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
              {/* Heatmap Layer Mode Glow */}
              {activeLayer === 'heatmap' && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 65 : 45}
                  fill={riskConfig.colorHex}
                  opacity={isSelected ? 0.38 : 0.22}
                  className="transition-all duration-300"
                />
              )}

              {/* Right of Way Corridor Alignment Vector */}
              <path
                d={`M ${pt.x - 30} ${pt.y + 15} Q ${pt.x} ${pt.y}, ${pt.x + 35} ${pt.y - 12}`}
                fill="none"
                stroke="#64748b"
                strokeWidth={isSelected ? 10 : 6}
                strokeLinecap="round"
                opacity="0.4"
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
                        fillOpacity={isSelected ? 0.45 : 0.25}
                        stroke={parcelRisk.colorHex}
                        strokeWidth="1.2"
                        className="hover:fill-opacity-80 transition-all"
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

              {/* Radar Pulsing Epicenter for High / Critical */}
              {(proj.risk_level === 'CRITICAL' || proj.risk_level === 'HIGH') && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 24 : 16}
                  fill="none"
                  stroke={riskConfig.colorHex}
                  strokeWidth="1.5"
                  className="animate-ping"
                  opacity="0.7"
                />
              )}

              {/* Central Marker Beacon */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 8 : 6}
                fill={riskConfig.colorHex}
                stroke="#ffffff"
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-200"
              />

              {/* Corridor Label Callout */}
              <g transform={`translate(${pt.x + 12}, ${pt.y - 6})`}>
                <rect
                  x="-2"
                  y="-12"
                  width={proj.name.length * 5.8 + 24}
                  height="20"
                  rx="3"
                  fill="#020617"
                  fillOpacity="0.88"
                  stroke={isSelected ? riskConfig.colorHex : '#334155'}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
                <text
                  x="6"
                  y="2"
                  className={`text-[10px] font-mono font-bold ${
                    isSelected ? 'fill-white' : 'fill-slate-300'
                  }`}
                >
                  [{proj.project_id}] {proj.name.slice(0, 18)}...
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* 6. Bottom-Left Coordinate Readout */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 font-mono text-[11px] text-slate-400 shadow-md">
        <div className="flex items-center gap-1 text-emerald-400">
          <Crosshair className="w-3.5 h-3.5" />
          <span>GIS COORDINATES:</span>
        </div>
        {hoveredProject ? (
          <span className="text-white font-semibold">
            {hoveredProject.location.lat.toFixed(4)}° N, {hoveredProject.location.lng.toFixed(4)}° E ({hoveredProject.name})
          </span>
        ) : (
          <span>20.5937° N, 78.9629° E (PAN-INDIA MATRIX)</span>
        )}
      </div>

      {/* 7. Quick Hover Callout Card */}
      {hoveredProject && (
        <div className="absolute top-16 left-4 z-20 p-3 rounded-lg bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-xl font-mono text-xs max-w-xs pointer-events-none">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white truncate">[{hoveredProject.project_id}] {hoveredProject.name}</span>
            <RiskBadge level={hoveredProject.risk_level} size="xs" />
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Delay Prob: <strong className="text-white">{(hoveredProject.delay_probability * 100).toFixed(1)}%</strong></div>
            <div>Expected Drift: <strong className="text-white">{hoveredProject.predicted_delay_days} Days</strong></div>
            <div className="truncate text-[10px] text-slate-400">Primary: {hoveredProject.delay_reason}</div>
          </div>
        </div>
      )}
    </div>
  );
};
