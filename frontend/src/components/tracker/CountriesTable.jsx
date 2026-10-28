import { useState, useMemo } from "react";
import { COUNTRIES, strideCountryUrl, AFRICA_ISOS } from "../../data/trackerCountries";
import StatusPill from "./StatusPill";
import CountryFlag from "../CountryFlag";

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

function isAfrican(c) {
  return (c.iso || []).some((code) => AFRICA_ISOS.has(code));
}

const TOTAL_AFRICAN = COUNTRIES.filter(isAfrican).length;

export default function CountriesTable({ filter, search }) {
  const [sort, setSort] = useState({ key: "name", dir: 1 });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return COUNTRIES
      .filter(isAfrican)
      .filter((c) => {
        const matchFilter = filter === "all" || c.status === filter;
        const matchSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.framework.toLowerCase().includes(q) ||
          c.regulator.toLowerCase().includes(q);
        return matchFilter && matchSearch;
      })
      .sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (Array.isArray(av)) return 0;
        return String(av).localeCompare(String(bv), undefined, { numeric: true }) * sort.dir;
      });
  }, [filter, search, sort]);

  function toggleSort(key) {
    if (key === "types") return;
    setSort((s) => ({
      key,
      dir: s.key === key ? -s.dir : 1,
    }));
  }

  function handleHeaderKeyDown(e, key) {
    if (key === "types") return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSort(key);
    }
  }

  // Renders the country flag + name, optionally linked
  function renderCountryName(c, size = 20) {
    const url = strideCountryUrl(c.name);
    const content = (
      <>
        <CountryFlag emoji={c.flag} size={size} />
        <span className="font-medium text-slate-300">{c.name}</span>
      </>
    );

    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 hover:text-primary transition-colors"
        >
          {content}
        </a>
      );
    }
    return (
      <div className="flex items-center gap-2.5">
        {content}
      </div>
    );
  }

  const EmptyState = () => (
    <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
      No countries match your search.
    </td>
  );

  const TableFooter = () => (
    <div className="flex flex-wrap items-center justify-between px-3 py-2.5 border-t border-white/[0.07] text-[11px] text-slate-500 gap-2">
      <span>
        {filtered.length} of {TOTAL_AFRICAN} countries
      </span>
      <span className="text-right sm:text-left">
        Data sourced from official government publications &amp; regulatory filings
      </span>
    </div>
  );

  return (
    <div>
      {/* ===== TABLE – hidden on mobile, visible from sm up ===== */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "640px" }}>
          <thead>
            <tr className="border-b border-white/[0.07]">
              {COLS.map((col) => {
                const sortable = col.key !== "types";
                const isSorted = sortable && sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => toggleSort(col.key)}
                    onKeyDown={(e) => handleHeaderKeyDown(e, col.key)}
                    tabIndex={sortable ? 0 : undefined}
                    role={sortable ? "button" : undefined}
                    aria-sort={
                      isSorted
                        ? sort.dir === 1
                          ? "ascending"
                          : "descending"
                        : sortable
                        ? "none"
                        : undefined
                    }
                    className={`text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap select-none ${
                      sortable
                        ? "cursor-pointer hover:text-slate-300 focus:outline-none focus:text-slate-200"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {isSorted && (
                        <span className="text-slate-400">
                          {sort.dir === 1 ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <EmptyState />
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.name}
                className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
              >
                <td className="px-3 py-3">{renderCountryName(c, 20)}</td>
                <td className="px-3 py-3">
                  <StatusPill status={c.status} />
                </td>
                <td className="px-3 py-3 max-w-[220px]">
                  <span className="text-slate-400 text-xs leading-snug">
                    {c.framework}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.types.map((t) => {
                      const tc = TYPE_COLORS[t] || {
                        color: "#64748b",
                        bg: "rgba(100,116,139,0.08)",
                      };
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
                <td className="px-3 py-3">
                  <span className="text-slate-400 text-xs font-mono">
                    {c.regulator}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-slate-500 text-xs font-mono">
                    {c.since}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== CARD LIST – visible only on mobile ===== */}
      <div className="sm:hidden divide-y divide-white/[0.06]">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-slate-500 text-sm">
            No countries match your search.
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.name} className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {renderCountryName(c, 18)}
                </div>
                <StatusPill status={c.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Framework:</span>
                <span>{c.framework}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Types:</span>
                <div className="flex flex-wrap gap-1">
                  {c.types.map((t) => {
                    const tc = TYPE_COLORS[t] || {
                      color: "#64748b",
                      bg: "rgba(100,116,139,0.08)",
                    };
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
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Regulator:</span>
                <span className="font-mono">{c.regulator}</span>
                <span className="ml-auto text-slate-500 font-mono">
                  {c.since}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <TableFooter />
    </div>
  );
}
