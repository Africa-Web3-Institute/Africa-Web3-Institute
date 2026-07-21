import { Link } from "react-router-dom";
import { Mail, ArrowRight, LayoutGrid, Users, Info, PackageCheck, Send } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const FORMAT_ICONS = ["🔵", "☕", "⚖️", "🏛️", "📜", "🤝", "🎯", "🔬", "⚙️"];
const OUTPUT_ICONS = ["📄", "📋", "🗂️", "📚", "🌐"];

const QUICK_NAV = [
  { id: "formats", icon: LayoutGrid, label: { en: "How We Convene", fr: "Nos Formats" } },
  { id: "participants", icon: Users, label: { en: "Who Takes Part", fr: "Participants" } },
  { id: "context", icon: Info, label: { en: "Why It Matters", fr: "Pourquoi" } },
  { id: "outputs", icon: PackageCheck, label: { en: "Outputs", fr: "Résultats" } },
  { id: "get-involved", icon: Send, label: { en: "Get Involved", fr: "Participer" } },
];

export default function IndabaSeries() {
  const { language } = useLanguage();
  const T = t[language].indabaSeries;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url('/Awi_Website4.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.93)" }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.heroBadge}
          </p>
          <h1 className="text-[2.25rem] lg:text-[3.25rem] font-bold text-secondary leading-tight mb-4">
            {T.heroTitle}
          </h1>
          <p className="text-[1.1875rem] font-semibold mb-8" style={{ color: "#D4A017" }}>
            {T.heroTagline}
          </p>
          <p className="text-[1rem] text-muted-foreground leading-[1.85] max-w-2xl mb-10">
            {T.heroPara1}
          </p>

          <div className="mb-10">
            <a
              href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center gap-2 text-[0.875rem] font-semibold px-6 py-3 transition-all"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {T.heroCta} <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick explore nav */}
          <div className="flex flex-wrap gap-2.5">
            {QUICK_NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-4 py-2.5 rounded-full border transition-all bg-white"
                style={{ borderColor: "#E5E7EB", color: "#0B1437" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.backgroundColor = "rgba(212,160,23,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: "#D4A017" }} />
                {label[language] || label.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Convene ── */}
      <section id="formats" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.formatsEyebrow}
            </p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary mb-3">
              {T.formatsHeading}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[0.9375rem]">
              {T.formatsSubhead}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.conveningFormats.map((format, i) => (
              <div
                key={format.title}
                className="bg-white border border-border p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                style={{ borderTop: "3px solid #D4A017" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[1.5rem]">{FORMAT_ICONS[i]}</span>
                  <h3 className="text-[0.9375rem] font-bold text-secondary">{format.title}</h3>
                </div>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.7]">{format.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Takes Part ── */}
      <section id="participants" className="py-20 border-b border-border scroll-mt-24" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
                {T.participantsEyebrow}
              </p>
              <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary mb-6">
                {T.participantsHeading}
              </h2>
              <ul className="space-y-3">
                {T.participants.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D4A017" }} />
                    <span className="text-[0.9375rem] text-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary p-8 lg:p-10">
              <p className="text-[1.25rem] font-bold text-white leading-relaxed mb-0">
                {T.participantsQuote}
              </p>
              <div className="w-12 h-px mt-6" style={{ backgroundColor: "#D4A017" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why These Conversations Matter ── */}
      <section id="context" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
                {T.contextEyebrow}
              </p>
              <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary mb-6">
                {T.contextHeading}
              </h2>
              <p className="text-[1rem] text-muted-foreground leading-[1.85]">
                {T.contextPara2}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {T.contextTopics.map(topic => (
                <div
                  key={topic}
                  className="p-4 border border-border bg-white text-center"
                  style={{ borderLeft: "3px solid #D4A017" }}
                >
                  <p className="text-[0.875rem] font-semibold text-secondary">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What Each Indaba Produces ── */}
      <section id="outputs" className="py-20 border-b border-border scroll-mt-24" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.outputsEyebrow}
            </p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary mb-3">
              {T.outputsHeading}
            </h2>
            <p className="text-[1rem] text-muted-foreground max-w-2xl mx-auto leading-[1.85]">
              {T.outputsDesc}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {T.outputs.map((o, i) => (
              <div
                key={o.label}
                className="bg-white border border-border px-6 py-4 flex items-center gap-3"
              >
                <span className="text-[1.25rem]">{OUTPUT_ICONS[i]}</span>
                <span className="text-[0.875rem] font-semibold text-secondary">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AWI + Join the Indaba CTA ── */}
      <section id="get-involved" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.approachEyebrow}
          </p>
          <p className="text-[1rem] text-muted-foreground leading-[1.85] max-w-2xl mx-auto mb-14">
            {T.approachBody}
          </p>

          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.ctaEyebrow}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary mb-6">
            {T.ctaHeading}
          </h2>
          <p className="text-[1rem] text-muted-foreground leading-[1.85] max-w-2xl mx-auto mb-10">
            {T.ctaBody}
          </p>
          <a
            href="mailto:info@africaweb3institute.org"
            className="inline-flex items-center gap-3 text-[0.9375rem] font-semibold px-8 py-3.5 transition-all"
            style={{ backgroundColor: "#D4A017", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            <Mail className="w-4 h-4" />
            info@africaweb3institute.org
          </a>
          <p className="mt-12 text-[0.9375rem] font-medium italic text-muted-foreground">
            {T.tagline}
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="border-t border-border py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/" className="text-[0.8125rem] text-muted-foreground hover:text-secondary transition-colors">
            {T.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
