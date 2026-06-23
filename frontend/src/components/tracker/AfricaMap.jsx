import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES, MAP_COLORS, STATUS } from "../../data/trackerCountries";

// African country ISO alpha-3 codes
const AFRICA_ISOS = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CPV","CMR","CAF","TCD",
  "COM","COD","COG","CIV","DJI","EGY","GNQ","ERI","SWZ","ETH",
  "GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG",
  "MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA","RWA",
  "STP","SEN","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN",
  "UGA","ZMB","ZWE","ESH","REU","MYT","SHN","SOM",
]);

// Build ISO alpha-3 → country data lookup
function buildIsoLookup() {
  const lookup = {};
  COUNTRIES.forEach((c) => {
    (c.iso || []).forEach((iso) => { lookup[iso] = c; });
  });
  return lookup;
}
const ISO_LOOKUP = buildIsoLookup();

// Natural Earth uses "ISO_A3" property on each feature
function getCountryEntry(feature) {
  const iso = feature.properties?.ISO_A3 || feature.properties?.iso_a3;
  if (!iso || !AFRICA_ISOS.has(iso)) return null;
  return ISO_LOOKUP[iso] || { status: "none", name: feature.properties?.ADMIN || feature.properties?.name, flag: "🌍", framework: "No data", regulator: "—" };
}

// Tooltip
function MapTooltip({ data, pos }) {
  if (!data || !pos) return null;
  const s = STATUS[data.status] || STATUS.none;
  return (
    <div className="fixed z-[9999] pointer-events-none" style={{ left: pos.x + 16, top: pos.y - 10 }}>
      <div className="bg-[#0a1628]/95 border border-white/10 rounded-xl shadow-2xl px-3.5 py-3 min-w-[200px]">
        <p className="font-semibold text-sm mb-2">{data.flag} {data.name}</p>
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

// Zoom controls
function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1">
      {[
        { label: "+", fn: () => map.zoomIn() },
        { label: "−", fn: () => map.zoomOut() },
        { label: "↺", fn: () => map.setView([2, 20], 3), cls: "text-xs" },
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
    // Africa-only GeoJSON from Natural Earth via unpkg
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((r) => r.json())
      .then((geojson) => {
        // Filter to Africa only
        const africaOnly = {
          ...geojson,
          features: geojson.features.filter((f) => {
            const iso = f.properties?.ISO_A3 || f.properties?.iso_a3;
            return AFRICA_ISOS.has(iso);
          }),
        };
        setGeoData(africaOnly);
      });
  }, []);

  useEffect(() => {
    if (geoRef.current) geoRef.current.resetStyle();
  }, [activeFilter]);

  function styleFeature(feature) {
    const entry = getCountryEntry(feature);
    const status = entry?.status || "none";
    const dimmed = activeFilter !== "all" && entry?.status !== activeFilter;
    return {
      fillColor: MAP_COLORS[status] || MAP_COLORS.default,
      fillOpacity: dimmed ? 0.15 : 0.85,
      color: "#071525",
      weight: 0.8,
      opacity: 1,
    };
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mousemove: (e) => {
        const entry = getCountryEntry(feature);
        if (entry) {
          setTooltip({ data: entry, pos: { x: e.originalEvent.clientX, y: e.originalEvent.clientY } });
        }
      },
      mouseout: () => setTooltip({ data: null, pos: null }),
    });
  }

  return (
    <div className="relative w-full h-[480px] bg-[#071525] rounded-b-xl overflow-hidden">
      <MapContainer
        center={[2, 20]}
        zoom={3}
        minZoom={2}
        maxZoom={8}
        style={{ height: "100%", width: "100%", background: "#071525" }}
        zoomControl={false}
        attributionControl={false}
        maxBounds={[[-40, -25], [40, 55]]}
        maxBoundsViscosity={0.8}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        {geoData && (
          <GeoJSON
            ref={geoRef}
            key={activeFilter}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        <ZoomControls />
      </MapContainer>

      {!geoData && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#071525] z-10">
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading map…
          </div>
        </div>
      )}

      <MapTooltip {...tooltip} />
    </div>
  );
}
