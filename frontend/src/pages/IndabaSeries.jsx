// src/pages/IndabaSeries.js
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  LayoutGrid,
  Users,
  Info,
  PackageCheck,
  Send,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

// ─── Icons for formats & outputs ────────────────────────────────────────────
const FORMAT_ICONS = [
  <span className="text-2xl">🔵</span>,
  <span className="text-2xl">☕</span>,
  <span className="text-2xl">⚖️</span>,
  <span className="text-2xl">🏛️</span>,
  <span className="text-2xl">📜</span>,
  <span className="text-2xl">🤝</span>,
  <span className="text-2xl">🎯</span>,
  <span className="text-2xl">🔬</span>,
  <span className="text-2xl">⚙️</span>,
];
const OUTPUT_ICONS = [
  <span className="text-2xl">📄</span>,
  <span className="text-2xl">📋</span>,
  <span className="text-2xl">🗂️</span>,
  <span className="text-2xl">📚</span>,
  <span className="text-2xl">🌐</span>,
];

const QUICK_NAV = [
  { id: "formats", icon: LayoutGrid, label: { en: "How We Convene", fr: "Nos Formats" } },
  { id: "participants", icon: Users, label: { en: "Who Takes Part", fr: "Participants" } },
  { id: "context", icon: Info, label: { en: "Why It Matters", fr: "Pourquoi" } },
  { id: "outputs", icon: PackageCheck, label: { en: "Outputs", fr: "Résultats" } },
  { id: "get-involved", icon: Send, label: { en: "Get Involved", fr: "Participer" } },
];

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ─── Animated section wrapper ───────────────────────────────────────────────
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function IndabaSeries() {
  const { language } = useLanguage();
  const T = t[language].indabaSeries;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };



  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Awi_Website4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0B1437] via-[#0B1437]/90 to-[#0B1437]/70" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <AnimatedSection className="max-w-3xl">
            <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
              {T.heroBadge}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
              {T.heroTitle}
            </h1>
            <p className="text-lg font-semibold text-[#D4A017] mb-6">
              {T.heroTagline}
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              {T.heroPara1}
            </p>

         

            {/* Primary CTA */}
            <a
              href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-colors bg-[#D4A017] text-white hover:bg-[#b88a12] shadow-lg shadow-[#D4A017]/25"
            >
              {T.heroCta} <ArrowRight className="w-4 h-4" />
            </a>

            {/* Quick navigation pills – appear below the CTA */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {QUICK_NAV.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-4 py-2.5 rounded-full border transition-all bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-[#D4A017]"
                >
                  <Icon className="w-3.5 h-3.5 text-[#D4A017]" />
                  {label[language] || label.en}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── HOW WE CONVENE ────────────────────────────────────────────────── */}
      <section id="formats" className="py-20 border-b border-border scroll-mt-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.formatsEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{T.formatsHeading}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-3 text-[0.9375rem]">
              {T.formatsSubhead}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {T.conveningFormats.map((format, idx) => (
              <AnimatedSection key={format.title} delay={idx * 80}>
                <div className="group bg-white p-6 rounded-2xl border border-border hover:border-[#D4A017]/40 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{FORMAT_ICONS[idx]}</span>
                    <h3 className="text-lg font-bold text-secondary">{format.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{format.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO TAKES PART ────────────────────────────────────────────────── */}
      <section id="participants" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.participantsEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                {T.participantsHeading}
              </h2>
              <ul className="space-y-3">
                {T.participants.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-[#D4A017]" />
                    <span className="text-[0.9375rem] text-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="bg-[#0B1437] p-8 lg:p-10 rounded-2xl shadow-2xl">
                <blockquote className="text-xl lg:text-2xl font-semibold text-white leading-relaxed">
                  {T.participantsQuote}
                </blockquote>
                <div className="w-12 h-1 mt-6 bg-[#D4A017]" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── WHY THESE CONVERSATIONS MATTER ───────────────────────────────── */}
      <section id="context" className="py-20 border-b border-border scroll-mt-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.contextEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                {T.contextHeading}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {T.contextPara2}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="grid grid-cols-2 gap-4">
                {T.contextTopics.map((topic, idx) => (
                  <div
                    key={topic}
                    className="p-4 bg-white rounded-xl border border-border hover:border-[#D4A017]/30 hover:shadow-md transition-all duration-300 text-center"
                    style={{ borderLeft: "3px solid #D4A017" }}
                  >
                    <p className="text-sm font-semibold text-secondary">{topic}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── WHAT EACH INDABA PRODUCES ────────────────────────────────────── */}
      <section id="outputs" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.outputsEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{T.outputsHeading}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-3 text-[0.9375rem] leading-relaxed">
              {T.outputsDesc}
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-4">
            {T.outputs.map((output, idx) => (
              <AnimatedSection key={output.label} delay={idx * 60}>
                <div className="bg-white border border-border px-6 py-4 rounded-xl flex items-center gap-3 hover:border-[#D4A017]/40 hover:shadow-md transition-all duration-300">
                  <span className="text-2xl">{OUTPUT_ICONS[idx]}</span>
                  <span className="text-sm font-semibold text-secondary">{output.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GET INVOLVED CTA ─────────────────────────────────────────────── */}
      <section id="get-involved" className="py-20 scroll-mt-24 bg-[#0B1437] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/Awi_Website4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.approachEyebrow}
            </p>
            <p className="text-white/70 leading-relaxed mb-14 max-w-2xl mx-auto">
              {T.approachBody}
            </p>

            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4 text-[#D4A017]">
              {T.ctaEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {T.ctaHeading}
            </h2>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
              {T.ctaBody}
            </p>

            <a
              href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center gap-3 text-sm font-semibold px-8 py-3.5 rounded-full transition-colors bg-[#D4A017] text-white hover:bg-[#b88a12] shadow-lg shadow-[#D4A017]/25"
            >
              <Mail className="w-4 h-4" />
              info@africaweb3institute.org
            </a>

            <p className="mt-12 text-base font-medium italic text-white/50">
              {T.tagline}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BACK TO HOME ───────────────────────────────────────────────────── */}
      <div className="border-t border-border py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            {T.backHome || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}