import { COUNTRIES, MAP_COLORS, STATUS, AFRICA_ISOS } from "../../data/trackerCountries";

const LEGEND_ORDER = ["live", "proposed", "draft", "review", "none"];

function isAfrican(c) {
  return (c.iso || []).some((code) => AFRICA_ISOS.has(code));
}

// Only show swatches for statuses that actually appear among African
// countries -- avoids a legend entry (e.g. "Proposed") that never shows
// up anywhere on the map.
const availableStatuses = new Set(COUNTRIES.filter(isAfrican).map((c) => c.status));
const items = LEGEND_ORDER.filter((key) => availableStatuses.has(key)).map((key) => ({ key }));

export default function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map(({ key }) => (
        <div key={key} className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ background: MAP_COLORS[key] }}
          />
          {STATUS[key].label}
        </div>
      ))}
    </div>
  );
}
