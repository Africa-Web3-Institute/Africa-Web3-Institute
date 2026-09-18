import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, FileDown, ExternalLink, AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import {
  REGULATORY_UPDATES, STATUS_COLORS, CONFIDENCE_COLORS, CATEGORY_COLORS,
  REGIONS, CATEGORIES, STATUSES_LIST, CONFIDENCE_LIST, DATE_RANGES, TRACKER_META,
} from "../data/regulatoryUpdates";
import CountryFlag from "../components/CountryFlag";

// NOTE ON FIELDS INTENTIONALLY NOT RENDERED HERE:
// `methodologyNote` and `editorialFlag` on tracker entries are internal
// curation notes (source-audit findings, inclusion-criteria flags). Per the
// methodology's own rule ("do not publish the internal source audit"), this
// component must never render those two fields on the public page. They
// exist only for whoever maintains src/data/regulatoryUpdates.js.

function parseApproxDate(str) {
  if (!str) return null;
  const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const m = str.toLowerCase().match(/(\d{1,2}\s+)?([a-z]+)\s+(\d{4})/);
  if (!m) return null;
  const monthIdx = months.indexOf(m[2]);
  if (monthIdx === -1) return null;
  const day = m[1] ? Number.parseInt(m[1], 10) : 1;
  return new Date(Number.parseInt(m[3], 10), monthIdx, day);
}

function StatusPill({ status, label }) {
  const c = STATUS_COLORS[status] || { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
  return (
    <span className="inline-flex items-center text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: c.dot }} />
      {label || status}
    </span>
  );
}

function ConfidencePill({ confidence, label }) {
  const c = CONFIDENCE_COLORS[confidence] || { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
  return (
    <span className="inline-flex items-center text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.dot + "55" }}>
      {label || confidence}
    </span>
  );
}

function CategoryBadge({ category, label }) {
  const c = CATEGORY_COLORS[category] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span className="inline-flex text-[0.6875rem] font-medium px-2 py-0.5 rounded whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {label || category}
    </span>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground/70">{label}</span>
      <span className="text-[0.8125rem] text-foreground">{value}</span>
    </div>
  );
}

export default function RegulatoryTracker() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [confidenceFilter, setConfidenceFilter] = useState("All Confidence Levels");
  const [dateRange, setDateRange] = useState("All Dates");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const { language } = useLanguage();
  const T = t[language].tracker;

  const filtered = useMemo(() => {
    const now = new Date();
    return REGULATORY_UPDATES.filter(u => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const titleToSearch = language === "fr" ? (u.titleFr || u.title) : u.title;
        const summaryToSearch = language === "fr" ? (u.summaryFr || u.summary) : u.summary;
        const haystack = [titleToSearch, u.country, summaryToSearch, u.category, u.authority].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (region !== "All Regions" && u.region !== region) return false;
      if (category !== "All Categories" && u.category !== category) return false;
      if (statusFilter !== "All Statuses" && u.status !== statusFilter) return false;
      if (confidenceFilter !== "All Confidence Levels" && u.confidence !== confidenceFilter) return false;

      if (dateRange !== "All Dates") {
        const d = parseApproxDate(u.publishedDate);
        if (dateRange === "Custom range") {
          if (customStart && (!d || d < new Date(customStart))) return false;
          if (customEnd && (!d || d > new Date(customEnd))) return false;
        } else {
          if (!d) return false;
          if (dateRange === "This month") {
            if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) return false;
          } else if (dateRange === "Last 3 months") {
            const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            if (d < cutoff || d > now) return false;
          } else if (dateRange === "This year") {
            if (d.getFullYear() !== now.getFullYear()) return false;
          }
        }
      }
      return true;
    });
  }, [search, region, category, statusFilter, confidenceFilter, dateRange, customStart, customEnd, language]);

  const resetFilters = () => {
    setSearch(""); setRegion("All Regions"); setCategory("All Categories");
    setStatusFilter("All Statuses"); setConfidenceFilter("All Confidence Levels");
    setDateRange("All Dates"); setCustomStart(""); setCustomEnd("");
  };

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>Africa Web3 Institute</p>
          <h1 className="text-[1.625rem] sm:text-[2rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-3">
            {T.pageTitle}
          </h1>
          <p className="text-[0.875rem] sm:text-[1rem] max-w-2xl mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {T.pageSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {(T.lastVerifiedLabel || "Last verified")}: {TRACKER_META.lastVerified}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}>
              📊 {TRACKER_META.countriesTracked} {(T.countriesTrackedLabel || "countries tracked")}
            </span>
          </div>
        </div>
      </section>

      {/* Trust panel */}
      <section className="border-b border-border" style={{ backgroundColor: "#F7F8FC" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            <div className="flex items-start gap-3 lg:max-w-xl">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#0B1437" }}>
                <ShieldCheck className="w-4.5 h-4.5" style={{ color: "#D4A017" }} />
              </div>
              <div>
                <h2 className="text-[1.0625rem] font-bold text-secondary mb-1.5">
                  {T.trustPanelTitle || "Regulatory intelligence you can trace"}
                </h2>
                <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mb-2.5">
                  {T.trustPanelBody || "AWI distinguishes enacted rules, proposals, official announcements and developments still awaiting verification. Every confirmed update is linked to authoritative evidence and reviewed under our published methodology."}
                </p>
                <p className="text-[0.75rem] font-medium flex flex-wrap gap-x-2 gap-y-1" style={{ color: "#0B1437" }}>
                  <span>{T.trustPillar1 || "Authoritative sources"}</span><span className="text-muted-foreground/40">|</span>
                  <span>{T.trustPillar2 || "Precise statuses"}</span><span className="text-muted-foreground/40">|</span>
                  <span>{T.trustPillar3 || "Accountable review"}</span><span className="text-muted-foreground/40">|</span>
                  <span>{T.trustPillar4 || "Visible corrections"}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 lg:ml-auto w-full sm:w-auto">
              <Link to="/country-tracker/methodology"
                className="inline-flex items-center justify-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-md transition-colors"
                style={{ backgroundColor: "#D4A017", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
                <ShieldCheck className="w-4 h-4" /> {T.trustCtaPrimary || "How We Verify Updates"}
              </Link>
              <a href="/methodology/AWI_Regulatory_Tracker_Methodology_v1.pdf" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-md border transition-colors"
                style={{ borderColor: "#0B1437", color: "#0B1437" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(11,20,55,0.06)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <FileDown className="w-4 h-4" /> {T.trustCtaSecondary || "Download Methodology"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[3.75rem] z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={T.filterSearch}
                className="w-full pl-8 pr-3 py-2 text-[0.8125rem] border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
            type="button"
              onClick={resetFilters}
              className="text-[0.8125rem] font-semibold transition-colors shrink-0 text-left sm:text-center"
              style={{ color: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.color = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}
            >
              {T.resetFilters}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="w-full text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {REGIONS.map(r => <option key={r} value={r}>{T.regions?.[r] || r}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {CATEGORIES.map(c => <option key={c} value={c}>{T.categories?.[c] || c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {STATUSES_LIST.map(s => <option key={s} value={s}>{T.statuses?.[s] || s}</option>)}
            </select>
            <select value={confidenceFilter} onChange={e => setConfidenceFilter(e.target.value)}
              className="w-full text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {CONFIDENCE_LIST.map(c => <option key={c} value={c}>{T.confidenceLevels?.[c] || c}</option>)}
            </select>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              className="w-full text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {DATE_RANGES.map(d => <option key={d} value={d}>{T.dateRanges?.[d] || d}</option>)}
            </select>
          </div>

          {dateRange === "Custom range" && (
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent" />
              <span className="self-center text-[0.8125rem] text-muted-foreground">{language === "fr" ? "à" : "to"}</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
          )}

          <p className="text-[0.75rem] text-muted-foreground mt-3">
            {T.showing} <strong className="text-foreground">{filtered.length}</strong> {T.of} {REGULATORY_UPDATES.length} {T.updates}
          </p>
          <p className="text-[0.7rem] text-muted-foreground/80 mt-1">
            {T.methodologyReferenceNote || "Status and confidence labels follow the AWI Regulatory Tracker Methodology."}{" "}
            <Link to="/country-tracker/methodology" className="font-semibold underline underline-offset-2" style={{ color: "#D4A017" }}>
              {T.methodologyReferenceLink || "Understand the labels →"}
            </Link>
          </p>
        </div>
      </div>

      {/* Result cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-muted-foreground text-[0.9375rem]">
            {T.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(u => {
              const displayTitle = language === "fr" ? (u.titleFr || u.title) : u.title;
              const displaySummary = language === "fr" ? (u.summaryFr || u.summary) : u.summary;
              return (
                
                <div key={u.id} className="border border-border rounded-lg bg-white p-5 flex flex-col gap-3.5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                     <CountryFlag emoji={u.flag} size={20} />
                     
                      <div className="min-w-0">
                        <p className="font-semibold text-secondary text-[0.875rem] truncate">{u.country}</p>
                        <p className="text-[0.6875rem] text-muted-foreground">{T.regions?.[u.region] || u.region}</p>
                      </div>
                    </div>
                    <span className="text-[0.75rem] text-muted-foreground whitespace-nowrap shrink-0">{u.publishedDate}</span>
                  </div>

                  <p className="text-[0.9375rem] font-semibold text-secondary leading-snug">{displayTitle}</p>

                  <div className="flex flex-wrap gap-1.5">
                    <CategoryBadge category={u.category} label={T.categories?.[u.category] || u.category} />
                    <StatusPill status={u.status} label={T.statuses?.[u.status] || u.status} />
                    <ConfidencePill confidence={u.confidence} label={T.confidenceLevels?.[u.confidence] || u.confidence} />
                  </div>

                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{displaySummary}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1 border-t border-border/60 mt-0.5 pt-3">
                    <MetaRow label={T.metaAuthority || "Authority"} value={u.authority} />
                    <MetaRow label={T.metaPublished || "Published"} value={u.publishedDate} />
                    <MetaRow label={T.metaConsultationDeadline || "Consultation deadline"} value={u.consultationDeadline || (T.notStated || "Not stated")} />
                    <MetaRow label={T.metaLastVerified || "Last verified"} value={u.lastVerified || (T.notYetVerified || "Not yet verified")} />
                  </div>
                  <MetaRow label={T.metaReviewedBy || "Reviewed by"} value={u.reviewer} />

                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-border/60">
                    <Link
                      to={`/country-tracker/${u.country.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="text-[0.8125rem] font-semibold shrink-0"
                      style={{ color: "#D4A017" }}
                    >
                      {T.viewAnalysis || "View Analysis"}
                    </Link>
                    {u.sourceUrl ? (
                      <a href={u.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-secondary hover:text-accent transition-colors">
                        {T.officialSource || "Official Source"} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[0.75rem] text-muted-foreground/70 italic">
                        <AlertCircle className="w-3.5 h-3.5" /> {T.sourcePending || "Source pending verification"}
                      </span>
                    )}
                  </div>
                </div>
           
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Strip */}
      <section className="mt-2" style={{ backgroundColor: "#0B1437" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[1.125rem] font-semibold text-white">{T.ctaTitle}</p>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/awpii" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
              {T.ctaButton}
            </Link>
            <a href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
              {T.ctaSubscribe}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
