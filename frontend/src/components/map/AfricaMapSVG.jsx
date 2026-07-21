// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, ZoomControl,CircleMarker,Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import awpiiData from "../../data/awpiiData";

const EMOJI_TO_ISO = {
  "🇳🇬": "ng", "🇿🇦": "za", "🇰🇪": "ke", "🇷🇼": "rw",
  "🇬🇭": "gh", "🇪🇬": "eg", "🇪🇹": "et", "🇸🇳": "sn",
  "🇹🇿": "tz", "🇲🇦": "ma", "🇨🇲": "cm", "🇨🇮": "ci",
  "🇿🇼": "zw", "🇿🇲": "zm", "🇩🇿": "dz", "🇺🇬": "ug",
  "🇹🇳": "tn", "🇧🇼": "bw", "🇲🇺": "mu", "🇸🇨": "sc",
  "🇳🇦": "na", "🇸🇱": "sl", "🇸🇸": "ss", "🇸🇩": "sd",
  "🇸🇴": "so", "🇨🇻": "cv", "🇰🇲": "km", "🇸🇹": "st",
  "🇲🇬": "mg",
};

function flagImg(emoji) {
  const iso = EMOJI_TO_ISO[emoji];
  if (!iso) return "";
  return `<img
    src="https://flagcdn.com/20x15/${iso}.png"
    srcset="https://flagcdn.com/40x30/${iso}.png 2x"
    width="20" height="15"
    loading="lazy"
    decoding="async"
    style="border-radius:2px;vertical-align:middle;margin-right:6px;display:inline-block;"
    alt="${iso.toUpperCase()}"
  />`;
}


const AFRICA_GEOJSON_URL =
  //"https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/africa.geojson";
     "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";


const GEO_NAME_TO_KEY = {
  "Nigeria": "nigeria",
  "Rwanda": "rwanda",
  "South Africa": "southafrica",
  "Kenya": "kenya",
  "Ghana": "ghana",
  "Egypt": "egypt",
  "Ethiopia": "ethiopia",
  "Senegal": "senegal",
  "Tanzania": "tanzania",
  "Morocco": "morocco",
  "Cameroon": "cameroon",
  "Côte d'Ivoire": "cotedivoire",
  "Zimbabwe": "zimbabwe",
  "Zambia": "zambia",
  "Algeria": "algeria",
  "Uganda": "uganda",
  "Tunisia": "tunisia",
  "Botswana": "botswana",
  "Madagascar": "madagascar",
  "Cabo Verde": "capeverde",
  "Comoros": "comoros",
  "Seychelles": "seychelles",
  "Mauritius": "mauritius",
  "São Tomé and Principe": "saotome",
   "S. Sudan": "southsudan",
  "Sudan": "sudan",
  "Somalia": "somalia",
  "Sierra Leone": "sierraleone",
  "eSwatini": "eswatini",
};

// Centroids for islands too small to see/click at low zoom
const SMALL_ISLAND_CENTROIDS = {
  "Cabo Verde": [16.0, -24.0],
  "Comoros": [-11.875, 43.872],
  "Mauritius": [-20.348, 57.552],
  "Seychelles": [-4.679, 55.492],
  "São Tomé and Principe": [0.328, 6.613],
};


function getKeyFromFeature(feature) {
  const name = feature.properties?.name || feature.properties?.NAME || "";
  return GEO_NAME_TO_KEY[name] || name;
}



function getShadingColor(key) {
  const country = awpiiData.find(c => c.key === key);
  if (!country) return "#9CA3AF"; // Undefined grey
  
   const grade = country.grade;
  if (grade === "AA+") return "#1F7A3A";
  if (["AA-", "A+", "A", "A-"].includes(grade)) return "#1F7A3A";

  if (["BBB+", "BBB-", "BB+", "BB"].includes(grade)) return "#D4A017";
  return "#dc2626";
}

function countryStyle(feature, hoveredKey) {
  const key = getKeyFromFeature(feature);
  const fill = getShadingColor(key);
  const isHovered = hoveredKey === key;
  return {
    fillColor: fill,
    fillOpacity: isHovered ? 1 : 0.78,
    color: "#0B1437",
    weight: 1,
  };
}

export default function AfricaMapSVG({ onCountryClick = null, interactive = false, language = "en" }) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredKey, setHoveredKey] = useState(null);
  const geoJsonRef = useRef(null);
    const [islandMarkers, setIslandMarkers] = useState([]);




  useEffect(() => {
    fetch(AFRICA_GEOJSON_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
     .then(data => {
        const AFRICAN_ISLAND_FALLBACKS = new Set(["Seychelles", "Mauritius"]);
        const africaOnly = {
          ...data,
        features: data.features.filter(f => {
  const continent =
    f.properties?.CONTINENT ||
    f.properties?.continent;

  const name =
    f.properties?.NAME ||
    f.properties?.name

  return (
    continent === "Africa" ||
    AFRICAN_ISLAND_FALLBACKS.has(name)
  );

  
}),
        };
 
        setGeoData(africaOnly);
          setIslandMarkers(
    Object.entries(SMALL_ISLAND_CENTROIDS).map(([name, latlng]) => ({
      name,
      key: GEO_NAME_TO_KEY[name] || name,
      latlng,
    }))
  );
        setLoading(false);
        console.log(data.features.map(f => f.properties.NAME));
      })
      .catch(err => { console.error("Map fetch failed:", err); setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(feature => countryStyle(feature, hoveredKey));
    }
  }, [hoveredKey]);

  const onEachFeature = (feature, layer) => {
    const key = getKeyFromFeature(feature);
  
    layer.on({
      mouseover: () => interactive && setHoveredKey(key),
      mouseout: () => interactive && setHoveredKey(null),
      click: () => interactive && onCountryClick && onCountryClick(key),
    });
    if (interactive) {
      const country = awpiiData.find(c => c.key === key);
      
      let tooltipContent = `<div style="font-size:12px; padding:6px 10px; line-height:1.4;">`;
     if (country) {
  const c = country.content[language] || country.content.en;
  console.log("flag:", country?.flag, "c.flag:", c?.flag);

  // ✅ use country.flag (top-level) not c.flag (inside content)
  tooltipContent += `
    <div style="font-weight:700;font-size:13px;margin-bottom:4px;display:flex;align-items:center;">
      ${flagImg(country.flag)}
      <span>${c.name}</span>
    </div>
    <div style="color:rgba(255,255,255,0.85);font-weight:600;">
      ${language === "fr" ? "Score" : "Score"}: <span style="color:#ca8a04;">${country.overall_score}</span>
      &nbsp;|&nbsp;
      ${language === "fr" ? "Note" : "Grade"}: <span style="color:#ca8a04;">${country.grade}</span>
    </div>
    <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:3px;max-width:180px;font-style:italic;">
      ${c.key_update}
    </div>
  `;
}
      else {
        const name = feature.properties?.name || feature.properties?.NAME || key;
        tooltipContent += `
          <div style="font-weight:700;">${name}</div>
          <div style="color:rgba(255,255,255,0.6); font-size:11px;">AWI Researching</div>
        `;
      }
      tooltipContent += `</div>`;

      layer.bindTooltip(
        tooltipContent,
        { permanent: false, sticky: true, opacity: 1, direction: "top" }
      );
    }
  };

  if (loading) return (
    <div style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "4px solid #D4A017", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (error) return (
    <div style={{ height: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <p style={{ color: "rgba(255,255,255,0.7)" }}>Map could not be loaded. Please refresh.</p>
      <button onClick={() => window.location.reload()} style={{ background: "#D4A017", color: "#fff", padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer" }}>Retry</button>
    </div>
  );

  return (
    <>
      <style>{`
        .leaflet-container { background: #0B1437 !important; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-tooltip { background: #0B1437 !important; border: 1px solid rgba(212,160,23,0.5) !important; color: #fff !important; border-radius: 6px !important; }
        .leaflet-tooltip::before { display: none !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <MapContainer
        center={[2, 22]}
        zoom={3}
        minZoom={2}
        maxZoom={7}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "600px", borderRadius: "12px" }}
        maxBounds={[[-40, -30], [40, 60]]}
      >
        <ZoomControl position="bottomright" />
        {geoData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            style={feature => countryStyle(feature, hoveredKey)}
            onEachFeature={onEachFeature}
          />
        )}
               {islandMarkers.map(({ name, key, latlng }) => (
  <CircleMarker
    key={key}
    center={latlng}
    radius={6}
    pathOptions={{
      fillColor: getShadingColor(key),
      fillOpacity: hoveredKey === key ? 1 : 0.85,
      color: "#0B1437",
      weight: 1,
    }}
    eventHandlers={{
      mouseover: () => interactive && setHoveredKey(key),
      mouseout: () => interactive && setHoveredKey(null),
      click: () => interactive && onCountryClick && onCountryClick(key),
    }}
  >
    {interactive && (
      <Tooltip sticky opacity={1} direction="top">
        <div style={{ fontSize: 12, padding: "4px 6px" }}>{name}</div>
      </Tooltip>
    )}
  </CircleMarker>
))}
      </MapContainer>
    </>
  );
}