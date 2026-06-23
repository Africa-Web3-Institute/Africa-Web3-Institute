import { MAP_COLORS, STATUS } from "../../data/trackerCountries";

const items = [
  { key: "live" },
  { key: "proposed" },
  { key: "review" },
  { key: "none" },
];

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
