import { STATUS } from "../../data/trackerCountries";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "proposed", label: "Proposed" },
  { key: "review", label: "In Review" },
  { key: "none", label: "No Framework" },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-1">
        Filter
      </span>
      {FILTERS.map(({ key, label }) => {
        const isAll = key === "all";
        const s = STATUS[key];
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150"
            style={
              isActive
                ? {
                    color: isAll ? "#e2e8f0" : s.color,
                    background: isAll ? "rgba(255,255,255,0.08)" : s.bg,
                    borderColor: isAll ? "rgba(255,255,255,0.2)" : s.border,
                  }
                : {
                    color: "#64748b",
                    background: "transparent",
                    borderColor: "rgba(255,255,255,0.07)",
                  }
            }
          >
            {!isAll && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: isActive ? s.color : "#64748b" }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
