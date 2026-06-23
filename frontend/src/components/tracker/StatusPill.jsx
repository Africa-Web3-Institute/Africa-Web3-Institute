import { STATUS } from "../../data/trackerCountries";

export default function StatusPill({ status, size = "sm" }) {
  const s = STATUS[status] || STATUS.none;
  const sizeClass = size === "xs" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${sizeClass}`}
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span
        className="rounded-full w-1.5 h-1.5 shrink-0"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
}
