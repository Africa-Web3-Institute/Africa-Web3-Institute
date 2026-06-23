import { useState, useMemo } from "react";
import { COUNTRIES } from "../../data/trackerCountries";
import StatusPill from "./StatusPill";

const TYPE_COLORS = {
  "Fiat-backed": { color: "#38bdf8", bg: "rgba(56,189,248,0.08)" },
  "Asset-referenced": { color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  "Crypto-backed": { color: "#f97316", bg: "rgba(249,115,22,0.08)" },
  "Commodity-backed": { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

const COLS = [
  { key: "name", label: "Country" },
  { key: "status", label: "Status" },
  { key: "framework", label: "Framework" },
  { key: "types", label: "Types" },
  { key: "regulator", label: "Regulator" },
  { key: "since", label: "Since" },
];

export default function CountriesTable({ filter, search }) {
  const [sort, setSort] = useState({ key: "name", dir: 1 });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return COUNTRIES.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.framework.toLowerCase().includes(q) ||
        c.regulator.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    }).sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (Array.isArray(av)) return 0;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });
  }, [filter, search, sort]);

  function toggleSort(key) {
    setSort((s) => ({
      key,
      dir: s.key === key ? -s.dir : 1,
    }));
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "types" && toggleSort(col.key)}
                  className={`text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap select-none ${col.key !== "types" ? "cursor-pointer hover:text-slate-300" : ""}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.key !== "types" && sort.key === col.key && (
                      <span className="text-slate-400">{sort.dir === 1 ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                  No countries match your search.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.name}
                className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
              >
                {/* Country */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5 font-medium text-slate-200">
                    <span className="text-base leading-none">{c.flag}</span>
                    {c.name}
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <StatusPill status={c.status} />
                </td>

                {/* Framework */}
                <td className="px-3 py-3 max-w-[220px]">
                  <span className="text-slate-400 text-xs leading-snug">{c.framework}</span>
                </td>

                {/* Types */}
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.types.map((t) => {
                      const tc = TYPE_COLORS[t] || { color: "#64748b", bg: "rgba(100,116,139,0.08)" };
                      return (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono"
                          style={{ color: tc.color, background: tc.bg }}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </td>

                {/* Regulator */}
                <td className="px-3 py-3">
                  <span className="text-slate-400 text-xs font-mono">{c.regulator}</span>
                </td>

                {/* Since */}
                <td className="px-3 py-3">
                  <span className="text-slate-500 text-xs font-mono">{c.since}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/[0.07] text-[11px] text-slate-500">
        <span>
          {filtered.length} of {COUNTRIES.length} countries
        </span>
        <span>Data sourced from official government publications &amp; regulatory filings</span>
      </div>
    </div>
  );
}
