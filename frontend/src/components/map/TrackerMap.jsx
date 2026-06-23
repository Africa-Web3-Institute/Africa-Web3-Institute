import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES, EU_ISOS, NUM_TO_ISO, MAP_COLORS, STATUS } from "../../data/countries";

// Build a fast lookup: iso alpha-3 → country entry
function buildIsoLookup() {
  const map = {};
  COUNTRIES.forEach((c) => {
    if (c.isEU) return; // handled via EU_ISOS
    (c.iso || []).forEach((iso) => { map[iso] = c; });
  });
  return map;
}

const ISO_LOOKUP = buildIsoLookup();
const EU_ENTRY = COUNTRIES.find((c) => c.isEU);

function getCountryEntry(numericId) {
  const alpha3 = NUM_TO_ISO[String(numericId)];
  if (!alpha3) return null;
  if (EU_ISOS.has(alpha3)) return EU_ENTRY;
  return ISO_LOOKUP[alpha3] || null;
}

// Tooltip popup that follows mouse
function MapTooltip({ data, pos }) {
  if (!data || !pos) return null;
  const s = STATUS[data.status] || STATUS.none;
  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ left: pos.x + 16, top: pos.y - 10 }}
    >
      <div className="bg-[#0a1628]/95 border border-white/10 rounded-xl shadow-2xl px-3.5 py-3 min-w-[200px]">
        <p className="font-semibold text-sm mb-2">
          {data.flag} {data.name}
        </p>
        <div className="flex justify-between text-xs gap-3 mb-1">
          <span className="text-slate-400">Status</span>
          <span style={{ color: s.color }} className="font-medium">{s.label}</span>
        </div>
        <div className="flex justify-between text-xs gap-3 mb-1">
          <span className="text-slate-400">Framework</span>
          <span className="text-slate-200 text-right max-w-[120px] leading-tight">{data.framework}</span>
        </div>
        <div className="flex justify-between text-xs gap-3">
          <span className="text-slate-400">Regulator</span>
          <span className="text-slate-200 font-mono">{data.regulator}</span>
        </div>
      </div>
    </div>
  );
}

// Map reset control
function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1">
      {[
        { label: "+", fn: () => map.zoomIn() },
        { label: "−", fn: () => map.zoomOut() },
        { label: "↺", fn: () => map.setView([20, 10], 2), cls: "text-xs" },
      ].map(({ label, fn, cls = "" }) => (
        <button
          key={label}
          onClick={fn}
          className={`w-7 h-7 bg-[#0f2040]/90 border border-white/10 text-slate-300 hover:text-white hover:bg-[#1a3258] rounded-md flex items-center justify-center transition-colors ${cls}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function WorldMap({ activeFilter }) {
  const [geoData, setGeoData] = useState(null);
  const [tooltip, setTooltip] = useState({ data: null, pos: null });
  const geoRef = useRef();

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        // Dynamically import topojson-client
        import("topojson-client").then(({ feature }) => {
          const geo = feature(topo, topo.objects.countries);
          setGeoData(geo);
        });
      });
  }, []);

  // Re-style when filter changes
  useEffect(() => {
    if (geoRef.current) {
      geoRef.current.resetStyle();
    }
  }, [activeFilter]);

  function style(feature) {
    const entry = getCountryEntry(feature.id);
    const status = entry?.status || "default";
    const dimmed =
      activeFilter !== "all" && entry?.status !== activeFilter && status !== "default";

    return {
      fillColor: entry ? MAP_COLORS[status] : MAP_COLORS.default,
      fillOpacity: dimmed ? 0.15 : 0.85,
      color: "#071525",
      weight: 0.5,
      opacity: 1,
    };
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mousemove: (e) => {
        const entry = getCountryEntry(feature.id);
        if (entry) {
          setTooltip({ data: entry, pos: { x: e.originalEvent.clientX, y: e.originalEvent.clientY } });
        } else {
          setTooltip({ data: null, pos: null });
        }
      },
      mouseout: () => setTooltip({ data: null, pos: null }),
    });
  }

  return (
    <div className="relative w-full h-[420px] bg-[#071525] rounded-b-xl overflow-hidden">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={1}
        maxZoom={8}
        style={{ height: "100%", width: "100%", background: "#071525" }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dark ocean tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        {geoData && (
          <GeoJSON
            ref={geoRef}
            key={activeFilter} // forces re-render on filter change
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}

        <ZoomControls />
      </MapContainer>

      {/* Loading overlay */}
      {!geoData && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#071525] z-10">
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading map…
          </div>
        </div>
      )}

      <MapTooltip {...tooltip} />
    </div>
  );
}
