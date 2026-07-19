import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Search } from "lucide-react";
import {
  ENFORCEMENT_EVENTS, ENFORCEMENT_COUNTRIES, ENFORCEMENT_TYPES,
  ENFORCEMENT_YEARS, TYPE_META, SEV_META,
} from "../data/enforcementData";



function TypeBadge({ type, label }) {
  const m = TYPE_META[type] || { color: "#6b7280", bg: "#f3f4f6", icon: "•" };
  return (
    <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>
      {m.icon} {label || type}
    </span>
  );
}

function SevDot({ severity }) {
  const m = SEV_META[severity] || SEV_META.Low;
  return <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: m.color }} />;
}

export default function EnforcementWatch() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [severity, setSeverity] = useState("All");
  const [type, setType] = useState("All Types");
  const [year, setYear] = useState("All Years");
  const [catOpen, setCatOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguage();
  const T = t[language].enforcement;

  const TYPE_LABEL = useMemo(() => ({
    "Outright Ban": T.types.ban, "Exchange Shutdown": T.types.shutdown,
    "VASP Compliance": T.types.vasp, "Licensing Action": T.types.licensing,
    "Tax Enforcement": T.types.tax, "AML/CFT Action": T.types.aml,
    "Consumer Warning": T.types.warning, "Positive Development": T.types.positive,
    "Court Order": T.types.court,
  }), [T]);

  const SEV_LABEL = useMemo(() => ({
    Critical: T.severity.critical, High: T.severity.high,
    Medium: T.severity.medium, Low: T.severity.low,
  }), [T]);

  const CATEGORY_EXPLAINERS = useMemo(() => [
    { type: "Outright Ban",         label: T.types.ban,      desc: T.typeDescriptions.ban },
    { type: "Exchange Shutdown",    label: T.types.shutdown,  desc: T.typeDescriptions.shutdown },
    { type: "VASP Compliance",      label: T.types.vasp,      desc: T.typeDescriptions.vasp },
    { type: "Licensing Action",     label: T.types.licensing, desc: T.typeDescriptions.licensing },
    { type: "Tax Enforcement",      label: T.types.tax,       desc: T.typeDescriptions.tax },
    { type: "AML/CFT Action",       label: T.types.aml,       desc: T.typeDescriptions.aml },
    { type: "Consumer Warning",     label: T.types.warning,   desc: T.typeDescriptions.warning },
    { type: "Positive Development", label: T.types.positive,  desc: T.typeDescriptions.positive },
  ], [T]);

  const filtered = useMemo(() => {
    return ENFORCEMENT_EVENTS.filter(ev => {
      const t = ev.content?.[language]?.title || ev.title;
      const d = ev.content?.[language]?.desc || ev.description;
      if (search.trim() && !t.toLowerCase().includes(search.toLowerCase()) &&
          !ev.country.toLowerCase().includes(search.toLowerCase()) &&
          !d.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== "All Countries" && ev.country !== country) return false;
      if (severity !== "All" && ev.severity !== severity) return false;
      if (type !== "All Types" && ev.type !== type) return false;
      if (year !== "All Years" && !ev.date.includes(year)) return false;
      return true;
    });
  }, [search, country, severity, type, year]);

  const resetFilters = () => { setSearch(""); setCountry("All Countries"); setSeverity("All"); setType("All Types"); setYear("All Years"); };

  // Group by month label
  const grouped = useMemo(() => {
    const groups = [];
    let lastMonth = null;
    filtered.forEach(ev => {
      if (ev.date !== lastMonth) { groups.push({ label: ev.date, events: [] }); lastMonth = ev.date; }
      groups[groups.length - 1].events.push(ev);
    });
    return groups;
  }, [filtered]);

  // Heatmap
  const countryActions = useMemo(() => {
    const map = {};
    ENFORCEMENT_COUNTRIES.forEach(c => { map[c] = { total: 0, positive: 0 }; });
    ENFORCEMENT_EVENTS.forEach(ev => {
      if (!map[ev.country]) return;
      map[ev.country].total++;
      if (ev.type === "Positive Development") map[ev.country].positive++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const flagMap = useMemo(() => {
    const m = {};
    ENFORCEMENT_EVENTS.forEach(ev => { m[ev.country] = ev.flag; });
    return m;
  }, []);

  const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const heatColor = (d) => {
    if (d.total === 0) return { bg: "#f1f5f9", text: "#94a3b8" };
    if (d.total === d.positive) return { bg: "#dcfce7", text: "#16a34a" };
    const intensity = Math.min(d.total / 6, 1);
    const r = Math.round(255 * intensity);
    const g = Math.round(220 * (1 - intensity * 0.7));
    return { bg: `rgba(${r},${g},${Math.round(220 * (1 - intensity))},0.18)`, text: intensity > 0.5 ? "#dc2626" : "#D4A017" };
  };

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Hero */}
      <section style={{ backgroundColor: "#1A1F36" }} className="pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-10">
          <span className="inline-block text-[0.6875rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}>
            {T.liveIntelligence}
          </span>
          <h1 className="text-[2rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-3">
            {T.pageTitle}
          </h1>
          <p className="text-[1rem] max-w-2xl mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {T.pageSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(220,38,38,0.15)", color: "#f87171", border: "1px solid rgba(220,38,38,0.3)" }}>
              🔴 {T.lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}>
              ⚡ {T.eventsTracked}
            </span>
          </div>
        </div>
        {/* Disclaimer strip */}
        <div style={{ backgroundColor: "#22284A" }} className="px-6 lg:px-8 py-3">
          <p className="max-w-7xl mx-auto text-[0.75rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {T.disclaimer}
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { label: T.statTotal, value: ENFORCEMENT_EVENTS.length, color: "#dc2626" },
              { label: T.statCountries, value: new Set(ENFORCEMENT_EVENTS.map(e => e.country)).size, color: "#D4A017" },
              { label: T.statBans, value: ENFORCEMENT_EVENTS.filter(e => e.type === "Outright Ban").length, color: "#dc2626" },
              { label: T.statNew, value: ENFORCEMENT_EVENTS.filter(e => e.date.includes("2026")).length, color: "#16a34a" },
            ].map(s => (
              <div key={s.label} className="px-6 py-7 text-center">
                <p className="text-[2rem] font-bold leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[0.75rem] font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[3.75rem] z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={T.filterSearch}
                className="w-full pl-8 pr-3 py-2 text-[0.8125rem] border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none">
              <option value="All Countries">{T.filterCountry}</option>
              {ENFORCEMENT_COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={severity} onChange={e => setSeverity(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none">
              {["All","Critical","High","Medium","Low"].map(s => <option key={s} value={s}>{s === 'All' ? T.filterSeverity : SEV_LABEL[s] || s}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none">
              {ENFORCEMENT_TYPES.map(tp => <option key={tp} value={tp}>{tp === 'All Types' ? T.filterType : TYPE_LABEL[tp] || tp}</option>)}
            </select>
            <select value={year} onChange={e => setYear(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none">
              {ENFORCEMENT_YEARS.map(y => <option key={y} value={y}>{y === 'All Years' ? T.filterYear : y}</option>)}
            </select>
            <button onClick={resetFilters} className="text-[0.8125rem] font-semibold ml-auto transition-colors" style={{ color: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.color = "#b8891a"} onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}>
              {T.resetFilters}
            </button>
          </div>
          <p className="text-[0.75rem] text-muted-foreground mt-2">
            {T.showing} <strong className="text-foreground">{filtered.length}</strong> {T.of} {ENFORCEMENT_EVENTS.length} {T.actions}
          </p>
        </div>
      </div>

    {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            {T.noResults}
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line — hidden on mobile */}
            <div className="hidden lg:block absolute left-[140px] top-0 bottom-0 w-px bg-border" />

            {grouped.map(group => (
              <div key={group.label}>
                {/* Month separator */}
                <div className="flex items-center gap-4 mb-6 mt-10 first:mt-0">
                  <span className="hidden lg:block text-[0.75rem] font-bold uppercase tracking-wider text-muted-foreground" style={{ width: "120px", textAlign: "right" }} />
                  <div className="hidden lg:block w-5 h-5 rounded-full border-2 border-white z-10 flex-shrink-0 -ml-2.5"
                    style={{ backgroundColor: "#D4A017", marginLeft: "131px" }} />
                  <span className="text-[0.8125rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full lg:ml-4"
                    style={{ backgroundColor: "#1A1F36", color: "#D4A017" }}>
                    {group.label}
                  </span>
                </div>

                {group.events.map(ev => (
                  <div key={ev.id} className="relative flex gap-0 lg:gap-0 mb-5 items-start">
                    {/* Date column (desktop) */}
                    <div className="hidden lg:flex items-start justify-end flex-shrink-0 pt-4" style={{ width: "128px" }}>
                      <span className="text-[0.75rem] font-bold text-right pr-3" style={{ color: "#D4A017" }}>{ev.date}</span>
                    </div>
                    {/* Dot on line */}
                    <div className="hidden lg:flex items-start pt-4 flex-shrink-0" style={{ width: "24px" }}>
                      <SevDot severity={ev.severity} />
                    </div>
                    {/* Card */}
                    <div className="flex-1 ml-0 lg:ml-4 bg-white border border-border rounded-lg p-5 hover:border-muted-foreground/30 transition-colors">
                      {/* Mobile date */}
                      <span className="lg:hidden text-[0.75rem] font-bold block mb-2" style={{ color: "#D4A017" }}>{ev.date}</span>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[1rem]">{ev.flag}</span>
                        <span className="text-[0.875rem] font-bold text-secondary">{ev.country}</span>
                        <TypeBadge type={ev.type} label={TYPE_LABEL[ev.type]} />
                        <span className="hidden lg:inline-flex items-center gap-1 text-[0.6875rem] font-medium"
                          style={{ color: SEV_META[ev.severity]?.color || "#6b7280" }}>
                          <SevDot severity={ev.severity} /> {SEV_LABEL[ev.severity] || ev.severity}
                        </span>
                      </div>
                      <p className="text-[0.9375rem] font-semibold text-secondary mb-2">{ev.content?.[language]?.title || ev.title}</p>
                      <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-3">{ev.content?.[language]?.desc || ev.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[0.75rem] text-muted-foreground/60">{T.source}: {ev.content?.[language]?.source || ev.source}</span>
                         <Link to={`/country-tracker/${toSlug(ev.country)}`}
                          className="text-[0.8125rem] font-semibold transition-colors" style={{ color: "#D4A017" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#b8891a"}
                          onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}>
                           {T.viewProfile}
                         </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Heatmap */}
      <section className="border-t border-border py-14" style={{ backgroundColor: "#F9FAFB" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.intensityLabel}</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-8">{T.heatmapTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {countryActions.map(d => {
              const c = heatColor(d);
              return (
                <Link key={d.name} to={`/country-tracker/${toSlug(d.name)}`}
                  className="flex flex-col items-center text-center p-4 rounded-lg border border-border transition-all hover:shadow-sm"
                  style={{ backgroundColor: c.bg }}>
                  <span className="text-[1.5rem] mb-1">{flagMap[d.name] || "🌍"}</span>
                  <p className="text-[0.75rem] font-semibold text-secondary leading-tight mb-1">{d.name}</p>
                  <p className="text-[1.125rem] font-bold" style={{ color: c.text }}>{d.total}</p>
                  <p className="text-[0.625rem] text-muted-foreground">{T.heatmapActions}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Explainer */}
      <section className="border-t border-white/10">
        <div style={{ backgroundColor: "#1A1F36" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <button onClick={() => setCatOpen(o => !o)}
              className="w-full flex items-center justify-between py-5 text-[0.9375rem] font-semibold text-white hover:text-white/80 transition-colors">
              <span>{T.categoriesTitle}</span>
              <span className="text-[1.25rem] text-white/50">{catOpen ? "−" : "+"}</span>
            </button>
            {catOpen && (
              <div className="pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CATEGORY_EXPLAINERS.map(c => {
                  const m = TYPE_META[c.type] || { icon: "•", color: "#6b7280", bg: "rgba(255,255,255,0.05)" };
                  return (
                    <div key={c.type} className="p-5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span className="text-[1.25rem] block mb-2">{m.icon}</span>
                      <p className="text-[0.875rem] font-bold mb-1" style={{ color: m.color }}>{c.label}</p>
                      <p className="text-[0.8125rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{c.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section style={{ backgroundColor: "#1A1F36" }} className="border-t border-white/10 py-14">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.subscribeEyebrow}</p>
          <h2 className="text-[1.5rem] font-bold text-white mb-3">{T.ctaTitle}</h2>
          <p className="text-[0.9375rem] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            {T.ctaSubtitle}
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold px-6 py-3 rounded-lg" style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}>
              ✅ {T.ctaSuccess}
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 text-[0.875rem] rounded-md border border-white/20 bg-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-accent" />
              <button type="submit"
                className="px-5 py-2.5 text-[0.875rem] font-semibold transition-colors shrink-0"
                style={{ backgroundColor: "#D4A017", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
                {T.ctaButton}
              </button>
            </form>
          )}
          <p className="text-[0.75rem] mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>{T.ctaNote}</p>
        </div>
      </section>

      {/* Related Intelligence */}
      <section className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "📊", label: T.relatedTracker, to: "/country-tracker" },
              { icon: "🗺️", label: T.relatedMap, to: "/awpii" },
              { icon: "📥", label: T.relatedReport, to: "/awpii" },
            ].map(c => (
              <Link key={c.label} to={c.to}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-4 p-6 border border-border rounded-lg bg-white hover:border-accent transition-colors group">
                <span className="text-[1.75rem]">{c.icon}</span>
                <span className="text-[0.9375rem] font-semibold text-secondary group-hover:text-accent transition-colors">{c.label} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}