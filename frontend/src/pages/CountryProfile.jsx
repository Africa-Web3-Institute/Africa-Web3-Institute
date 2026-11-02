import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Download } from "lucide-react";
import awpiiData from "../data/awpiiData";
import { COUNTRY_PROFILES } from "../data/countryProfiles";
import CountryFlag from "../components/CountryFlag";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Regulated: { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
  Emerging:  { bg: "#D4A017", light: "#fef9c3", text: "#854d0e" },
  Restricted:{ bg: "#dc2626", light: "#fee2e2", text: "#991b1b" },
  Undefined: { bg: "#9ca3af", light: "#f3f4f6", text: "#374151" },
  Active:    { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
  Pilot:     { bg: "#2563eb", light: "#dbeafe", text: "#1e40af" },
  None:      { bg: "#9ca3af", light: "#f3f4f6", text: "#374151" },
  Allowed:   { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
};
const RISK_COLORS = { Low: "#16a34a", Medium: "#D4A017", High: "#dc2626" };
const RISK_BG     = { Low: "#dcfce7", Medium: "#fef9c3", High: "#fee2e2" };
const SEV_COLORS  = { Positive: "#16a34a", Neutral: "#6b7280", Restrictive: "#dc2626" };
const SEV_BG      = { Positive: "#dcfce7", Neutral: "#f3f4f6", Restrictive: "#fee2e2" };
const TREND_YEARS = ["2022", "2023", "2024", "2025", "2026"];


function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Undefined;
  return (
    <span className="inline-flex items-center text-[0.75rem] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: c.light, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: c.bg }} />
      {status}
    </span>
  );
}

function CircleScore({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke="#D4A017" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 72 72)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2rem] font-bold leading-none" style={{ color: "#D4A017" }}>{score}</span>
        <span className="text-[0.625rem] font-medium text-white/60 mt-1 uppercase tracking-wide">Readiness</span>
      </div>
    </div>
  );
}

function MiniScoreBar({ score }) {
  return (
    <div>
      <span className="text-[1.5rem] font-bold text-secondary">{score}</span>
      <div className="h-1 rounded-full bg-border mt-1 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: "#D4A017" }} />
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CountryProfile() {
  const { country } = useParams();
  const { language } = useLanguage();
  const T = t[language].countryProfile;
  const profile = useMemo(() => {
    if (!country) return null;
    const key = country.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const base = COUNTRY_PROFILES[key] ||
      Object.values(COUNTRY_PROFILES).find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === key) ||
      null;
    if (!base) return null;
    // Overlay scores from AWPII (the authoritative source)
    const awpii = awpiiData.find(a => a.key === country || a.key === key);
    if (awpii) {
      return {
        ...base,
        score: awpii.overall_score,
        policy: awpii.pillars?.clarity ?? base.policy,
        innovation: awpii.pillars?.innovation ?? base.innovation,
        adoption: awpii.pillars?.adoption ?? base.adoption,
      };
    }
    return base;
  }, [country]);

  const trendData = useMemo(() => {
    if (!profile) return [];
    return TREND_YEARS.map((y, i) => ({ year: y, score: profile.trend[i] }));
  }, [profile]);

  const relatedCountries = useMemo(() => {
    if (!profile) return [];
    return Object.values(COUNTRY_PROFILES)
      .filter(p => p.region === profile.region && p.name !== profile.name)
      .slice(0, 3);
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[1.5rem] font-bold text-secondary">{T.notFound}</p>
        <Link to="/country-tracker" className="text-[0.9375rem] font-semibold" style={{ color: "#D4A017" }}>
          {T.notFoundCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[0.75rem] text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">{T.breadcrumbHome}</Link>
            <span>/</span>
            <Link to="/country-tracker" className="hover:text-white/70 transition-colors">{T.breadcrumbTracker}</Link>
            <span>/</span>
            <span className="text-white/70">{profile.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <CountryFlag emoji={profile.flag} size={40} />
               
                <div>
                  <h1 className="text-[2.25rem] lg:text-[2.75rem] font-bold text-white leading-tight">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                      {profile.region}
                    </span>
                    <StatusPill status={profile.status} />
                  </div>
                </div>
              </div>
              <p className="text-[0.8125rem] text-white/40">{T.lastUpdated}: {profile.lastUpdated}</p>
              <Link to="/country-tracker" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-white/50 hover:text-white/80 transition-colors mt-4">
                <ArrowLeft className="w-3.5 h-3.5" /> {T.backToTracker}
              </Link>
            </div>
            {/* Right: circular score */}
            <CircleScore score={profile.score} />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { label: T.policyScore, value: profile.policy },
              { label: T.innovationScore, value: profile.innovation },
              { label: T.adoptionScore, value: profile.adoption },
            ].map(s => (
              <div key={s.label} className="px-6 py-6">
                <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-2">{s.label}</p>
                <MiniScoreBar score={s.value} />
              </div>
            ))}
            <div className="px-6 py-6">
              <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-2">{T.riskLevel}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[profile.risk] }} />
                <span className="text-[1.5rem] font-bold text-secondary">{T.riskLevels[profile.risk] || profile.risk}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">

        {/* Policy Summary */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Overview</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-8">{T.regulatoryOverview}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">{profile.summaryFr && language === 'fr' ? profile.summaryFr : profile.summary}</p>
            </div>
            <div className="bg-muted/40 border border-border rounded-lg p-6">
              <p className="text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground mb-4">{T.keyFocusAreas}</p>
              <ul className="space-y-2.5">
                {profile.focusAreas.map(area => (
                  <li key={area} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D4A017" }} />
                    <span className="text-[0.875rem] text-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Asset Coverage */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Regulation</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.assetClassification}</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border" style={{ backgroundColor: "#F9FAFB" }}>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.assetType}</th>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.status}</th>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(profile.assets).map(([key, val], i) => (
                    <tr key={key} className="border-b border-border/50 last:border-0" style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                      <td className="px-5 py-3.5 font-semibold text-secondary text-[0.875rem]">{T.assets[key] || key}</td>
                      <td className="px-5 py-3.5"><StatusPill status={val.status} /></td>
                      <td className="px-5 py-3.5 text-[0.875rem] text-muted-foreground">{val.noteFr && language === 'fr' ? val.noteFr : val.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>History</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-8">{T.timelineTitle}</h2>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {profile.timeline.map((ev, i) => (
                <div key={i} className={`relative flex flex-col lg:flex-row gap-4 lg:gap-8 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full border-2 border-white z-10 -translate-x-1/2 mt-4"
                    style={{ backgroundColor: SEV_COLORS[ev.severity] }} />
                  {/* Spacer on desktop */}
                  <div className="hidden lg:block lg:w-1/2" />
                  {/* Card */}
                  <div className="ml-10 lg:ml-0 lg:w-1/2 bg-white border border-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <span className="text-[0.8125rem] font-bold" style={{ color: "#D4A017" }}>{ev.date}</span>
                      <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ backgroundColor: SEV_BG[ev.severity], color: SEV_COLORS[ev.severity] }}>
                         {T.severity[ev.severity.toLowerCase()] || ev.severity}
                      </span>
                    </div>
                    <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{ev.content?.[language]?.title || ev.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed">{ev.content?.[language]?.desc || ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Risk</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.riskAssessment}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            {Object.entries(profile.riskScores).map(([key, val]) => (
              <div key={key} className="bg-white border border-border rounded-lg p-6"
                style={{ borderLeft: `4px solid ${RISK_COLORS[val.level]}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: RISK_COLORS[val.level] }} />
                  <span className="text-[0.8125rem] font-bold uppercase tracking-wide"
                    style={{ color: RISK_COLORS[val.level] }}>{T.riskLevels[val.level] || val.level} {language === 'fr' ? 'Risque' : 'Risk'}</span>
                </div>
                <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{key === 'regulatory' ? T.regulatoryRisk : key === 'enforcement' ? T.enforcementRisk : T.marketRisk}</p>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed">{val.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.75rem] text-muted-foreground/60">
            {T.riskDisclaimer}
          </p>
        </section>

        {/* Trend Chart */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Trend</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.trendTitle}</h2>
          <div className="bg-white border border-border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "0.8125rem" }}
                  formatter={(v) => [`${v}`, "Readiness Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="#D4A017" strokeWidth={2.5} dot={{ fill: "#D4A017", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Related Countries */}
        {relatedCountries.length > 0 && (
          <section>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Compare</p>
            <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.relatedTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedCountries.map(c => (
                <Link
                  key={c.name}
                  to={`/country-tracker/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:border-accent transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[1.75rem]">{c.flag}</span>
                    <div>
                      <p className="font-bold text-secondary text-[1rem]">{c.name}</p>
                      <p className="text-[0.75rem] text-muted-foreground">{c.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusPill status={c.status} />
                    <span className="text-[1.25rem] font-bold" style={{ color: "#D4A017" }}>{c.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Strip */}
    {/* CTA Strip */}
<section style={{ backgroundColor: "#0B1437" }}>
  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
    <p className="text-[1.05rem] font-semibold text-white">
      {T.ctaTitle} {profile.name} {T.ctaAnd}
    </p>
    <div className="flex flex-wrap gap-3 shrink-0">
      <a
        href="/reports/AWI_Q1Report.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
  style={{ backgroundColor: "#D4A017", color: "#fff" }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
>
  <Download className="w-4 h-4" /> {T.ctaButton}
</a>
      <Link
        to="/country-tracker"
        className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        {T.ctaBack}
      </Link>
    </div>
  </div>
</section>
    </div>
  );
}
