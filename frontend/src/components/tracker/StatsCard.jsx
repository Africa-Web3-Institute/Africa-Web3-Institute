 import { COUNTRIES, ISSUERS } from "../../data/trackerCountries";

const stats = [
  {
    label: "Countries Tracked",
    value: "214",
    sub: "↑ 3 added this month",
    accent: "#22c55e",
  },
  {
    label: "Live Frameworks",
    value: String(COUNTRIES.filter((c) => c.status === "live").length),
    sub: "Regulations in effect",
    accent: "#f97316",
  },
  {
    label: "Licensed Issuers",
    value: String(ISSUERS.filter((i) => i.status === "live").length),
    sub: "Across all jurisdictions",
    accent: "#a78bfa",
  },
  {
    label: "Stablecoins Listed",
    value: "89",
    sub: "Fiat-backed & regulated",
    accent: "#38bdf8",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="relative rounded-xl border border-white/[0.07] bg-[#0f2040]/70 px-4 py-4 overflow-hidden"
        >
          {/* top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${s.accent}, transparent)`,
            }}
          />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
            {s.label}
          </p>
          <p
            className="text-3xl font-bold font-mono leading-none"
            style={{ color: s.accent }}
          >
            {s.value}
          </p>
          <p className="text-[11px] text-slate-500 mt-1.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
