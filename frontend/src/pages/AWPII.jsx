import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, BarChart3, Globe, Zap, Users, Building2, Mail, ChevronRight, TrendingUp, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import AfricaMapInteractive from "../components/map/AfricaMapInteractive";
import CountryDeepDive from "../components/awpii/CountryDeepDive";
import awpiiData from "../data/awpiiData";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import CountryFlag from "../components/CountryFlag";

function CTAButton({ children, primary = false, href = null, onClick = null }) {
  const base = "inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer";
  const style = primary
    ? `${base} bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md`
    : `${base} border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground`;

  if (href) return <a href={href} className={style}>{children}</a>;
  return <button onClick={onClick} className={style}>{children}</button>;
}

export default function AWPII() {
  const { language } = useLanguage();
  const T = t[language].awpii;

  const [selectedCountryKey, setSelectedCountryKey] = useState("southafrica");

  const scrollToDashboard = () => {
    document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#awpii-contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedCountry = awpiiData.find(c => c.key === selectedCountryKey) || awpiiData[0];

  const momentumData = awpiiData.slice(0, 10).map(c => ({
    name: c.content[language].name,
    score: c.overall_score,
    momentum: c.momentum
  }));

  const getGradeBadgeClass = (grade) => {
    if (grade.includes("AA")) return "bg-[#14532d] text-white";
    if (grade.startsWith("A")) return "bg-[#166534] text-white";
    if (grade.startsWith("BBB")) return "bg-yellow-600 text-white";
    if (grade.startsWith("BB")) return "bg-amber-600 text-white";
    return "bg-red-600 text-white";
  };

  return (
    <div className="bg-background text-foreground">

      {/* Hero – fixed structure */}
      <section className="relative bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            Africa Web3 Institute
          </p>
          <h1 className="text-[1.625rem] sm:text-[2rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-3">
            {T.pageTitle}
          </h1>
          <h1 className="text-[2.5rem] lg:text-[1.5rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
            {T.heroTitle}
          </h1>
          <p className="text-[1.25rem] lg:text-[1.0rem] font-medium mb-8 leading-snug" style={{ color: "hsl(40 78% 50%)" }}>
            {T.heroSubtitle}
          </p>
          <p className="text-[1.25rem] lg:text-[1.0rem] font-medium mb-8 leading-snug" style={{ color: "hsl(40 78% 50%)" }}>
            {T.heroSubtitle1}
          </p>
          <div className="w-16 h-px bg-accent mb-8" />
          <p className="text-[1rem] text-white/80 leading-[1.85] mb-4 max-w-2xl">
            {T.heroPara1}
          </p>
          <p className="text-[1rem] text-white/80 leading-[1.85] mb-4 max-w-2xl font-semibold">
            {T.heroPara2}
          </p>
          <p className="text-[1rem] text-white/70 leading-[1.85] mb-10 max-w-2xl">
            {T.heroPara3}
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton primary onClick={scrollToDashboard}>
              {T.heroCtaPrimary} <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <a
              href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/59df44ac1_Q1Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 rounded-lg transition-all duration-200 border border-white/80 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Download className="w-4 h-4" /> {T.heroCtaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {T.stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="text-[1.75rem] font-bold text-secondary leading-none mb-2">{s.value}</p>
                <p className="text-[0.75rem] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified May 2026 Interactive Dashboard */}
      <section id="dashboard" className="py-24 lg:py-32 border-b border-border bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">
              {language === "fr" ? "Tableau de Bord Interactif" : "Interactive Dashboard"}
            </p>
            <h2 className="text-[2rem] lg:text-[2.5rem] font-bold text-secondary tracking-tight leading-none mb-4">
              {language === "fr" ? "Indice de Politique & d'Innovation Web3" : "Web3 Policy & Innovation Index"}
            </h2>
            <p className="text-[1.125rem] text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Bilan de mai 2026 : Analyse d'impact des cadres réglementaires et de l'adoption dans 20 pays africains clés."
                : "May 2026 Snapshot: Authority analysis measuring Web3 framework maturity, enabling environments, and market readiness across 20 countries."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-secondary text-lg">
                    {language === "fr" ? "Carte de Chaleur Politique" : "Pan-African Policy Shading Map"}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>{language === "fr" ? "Cliquez sur un pays" : "Click a country to select"}</span>
                  </div>
                </div>
                <AfricaMapInteractive
                  onCountrySelect={setSelectedCountryKey}
                  language={language}
                />
              </div>

              <CountryDeepDive selectedCountry={selectedCountry} language={language} />
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-secondary text-lg mb-1">
                    {language === "fr" ? "Classement Complet" : "Full Top 20 Rankings"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "fr" ? "Cliquez sur un pays pour voir les détails" : "Click a country to view details"}
                  </p>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {awpiiData.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => setSelectedCountryKey(country.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left border ${
                        selectedCountryKey === country.key
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-850 dark:border-slate-700 shadow-sm font-semibold scale-[1.01]"
                          : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 dark:bg-slate-950/40 dark:border-slate-850 dark:hover:bg-slate-950/80 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-5 shrink-0 ${selectedCountryKey === country.key ? "text-accent" : "text-muted-foreground"}`}>
                          #{country.rank}
                        </span>
                        <CountryFlag emoji={country.flag} size={20} />
                        <span className="text-sm truncate max-w-[120px]">{country.content[language].name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getGradeBadgeClass(country.grade)}`}>
                          {country.grade}
                        </span>
                        <span className="text-sm font-extrabold">{country.overall_score}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-bold text-secondary text-lg mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    {T.momentumTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{T.momentumDesc}</p>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">{T.momentumHelper}</span>
                  </div>
                </div>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={momentumData}
                      margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                      style={{ cursor: 'pointer' }}
                      onClick={(d) => {
                        if (d?.activePayload?.length) {
                          const found = awpiiData.find(c => c.content[language].name === d.activePayload[0].payload.name);
                          if (found) setSelectedCountryKey(found.key);
                        }
                      }}
                    >
                      <XAxis type="number" domain={[50, 100]} hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontWeight: 600 }}
                        width={90}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2 rounded shadow text-xs border border-white/10">
                                <p className="font-bold">{data.name}</p>
                                <p>{T.momentumScoreLabel}: {data.score}</p>
                                <p>{data.momentum}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                        {momentumData.map((entry, index) => {
                          const isUpward = entry.momentum.includes("Upward");
                          const isStable = entry.momentum.includes("Stable");
                          const fill = isUpward ? "#16a34a" : isStable ? "#ca8a04" : "#dc2626";
                          return <Cell key={`cell-${index}`} fill={fill} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 lg:py-32 border-b border-border bg-slate-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.overviewEyebrow}</p>
              <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-6">
                {T.overviewHeading}
              </h2>
              <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-5">{T.overviewPara1}</p>
              <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-10">{T.overviewPara2}</p>
              <div className="space-y-5">
                {T.overviewPoints.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="text-[0.9375rem] text-foreground leading-snug">
                      <span className="font-semibold">{item.label}:</span>{" "}
                      <span className="text-muted-foreground">{item.desc}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6">{T.audienceLabel}</p>
              <div className="space-y-px bg-border">
                {T.audience.map((a) => (
                  <div key={a.title} className="bg-background p-6 flex items-start gap-4">
                    <ChevronRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{a.title}</p>
                      <p className="text-[0.875rem] text-muted-foreground leading-snug">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-24 lg:py-32 bg-secondary border-b border-border relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.whyEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-white leading-snug mb-6">{T.whyHeading}</h2>
            <p className="text-[1rem] text-white/70 leading-[1.85] mb-4">{T.whyPara1}</p>
            <p className="text-[1rem] text-white/70 leading-[1.85]">{T.whyPara2}</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-white/40 mb-6 text-center">
              {T.whyQuestionsLabel}
            </p>
            <div className="space-y-px bg-white/10">
              {T.questions.map((q, i) => (
                <div key={i} className="bg-secondary px-8 py-5 flex items-start gap-5 border border-white/10">
                  <span className="text-accent font-bold text-[0.75rem] mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[0.9375rem] text-white/80 leading-snug">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-24 lg:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.pillarsEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-4">{T.pillarsHeading}</h2>
            <p className="text-[1rem] text-muted-foreground max-w-xl mx-auto">{T.pillarsSubhead}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {T.pillars.map((pillar, i) => {
              const Icon = [Building2, BarChart3, Users, Globe][i] || Globe;
              return (
                <div key={pillar.number} className="bg-background p-10 flex flex-col gap-6">
                  <div className="flex items-start gap-5">
                    <span className="text-[0.6875rem] font-bold tracking-widest text-accent/60 mt-1">{pillar.number}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded bg-secondary/8 flex items-center justify-center border border-secondary/10">
                          <Icon className="w-4 h-4 text-secondary" />
                        </div>
                        <h3 className="text-[1rem] font-bold text-secondary">{pillar.title}</h3>
                      </div>
                      <p className="text-[0.9375rem] text-muted-foreground leading-[1.75]">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-24 lg:py-32 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.deliverablesEyebrow}</p>
              <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-6">{T.deliverablesHeading}</h2>
              <p className="text-[1rem] text-muted-foreground leading-[1.85]">{T.deliverablesPara}</p>
            </div>
            <div className="space-y-px bg-border">
              {T.deliverables.map((d) => (
                <div key={d.title} className="bg-background p-7 flex items-start gap-4">
                  <Zap className="w-4 h-4 text-accent mt-1 shrink-0" />
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-secondary mb-1.5">{d.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground leading-snug">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market in Motion */}
      <section className="py-24 lg:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.marketEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-6">{T.marketHeading}</h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-4">{T.marketPara1}</p>
            <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-10">{T.marketPara2}</p>
            <div className="flex flex-wrap gap-4">
              <CTAButton primary onClick={scrollToDashboard}>
                {T.marketCta1} <ArrowRight className="w-4 h-4" />
              </CTAButton>
              <CTAButton onClick={scrollToContact}>{T.marketCta2}</CTAButton>
              <CTAButton onClick={scrollToContact}>{T.marketCta3}</CTAButton>
              <CTAButton onClick={scrollToContact}>{T.marketCta4}</CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Collaboration */}
      <section id="awpii-contact" className="py-24 lg:py-32 bg-secondary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.contactEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-white leading-snug mb-6">{T.contactHeading}</h2>
            <p className="text-[1rem] text-white/70 leading-[1.85] mb-4">{T.contactPara1}</p>
            <p className="text-[1rem] text-white/70 leading-[1.85] mb-8">{T.contactPara2}</p>
            <a
              href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-white border-b border-accent pb-1 hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4 text-accent" />
              info@africaweb3institute.org
            </a>
          </div>
        </div>
      </section>

      {/* Back to home */}
      <div className="border-t border-border py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground hover:text-secondary transition-colors">
            {T.backHome}
          </Link>
        </div>
      </div>

    </div>
  );
}