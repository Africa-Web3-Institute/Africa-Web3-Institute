// src/pages/CapacityBuilding.js
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  Send,
  Globe,
  BookOpen,
  Award,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const QUICK_NAV = [
  { id: "get-started", icon: Send, label: { en: "Get in Touch", fr: "Nous contacter" } },
  { id: "who-we-train", icon: Users, label: { en: "Who We Train", fr: "Qui nous formons" } },
  { id: "curriculum", icon: Layers, label: { en: "Curriculum", fr: "Curriculum" } },
  { id: "delivery", icon: GraduationCap, label: { en: "Delivery", fr: "Formats" } },
  { id: "why-awi", icon: Sparkles, label: { en: "Why AWI", fr: "Pourquoi AWI" } },
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
export default function CapacityBuilding() {
  const { language } = useLanguage();
  const T = t[language].capacityBuilding;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

 

  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0B1437] via-[#0B1437]/95 to-[#0B1437]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/Awi_Website_3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <AnimatedSection>
              <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
                {T.eyebrow}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
                {T.heroTitle}
              </h1>
              <p className="text-lg font-semibold text-[#D4A017] mb-4">
                {T.heroTagline}
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                {T.heroBody}
              </p>


              {/* Quick navigation pills */}
              <div className="flex flex-wrap gap-2.5">
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

            {/* CTA Card */}
            <AnimatedSection delay={150}>
              <div
                id="get-started"
                className="rounded-2xl shadow-2xl bg-white p-7 lg:p-8 scroll-mt-24 border border-white/10"
              >
                <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                  {T.ctaEyebrow}
                </p>
                <h2 className="text-2xl font-bold text-secondary mb-3">
                  {T.ctaHeading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {T.ctaBody}
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:info@africaweb3institute.org"
                    className="inline-flex items-center justify-center text-sm font-semibold px-6 py-3 rounded-full bg-[#D4A017] text-white hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
                  >
                    {T.ctaButton}
                  </a>
                  <Link
                    to="/about"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="inline-flex items-center justify-center text-sm font-semibold px-6 py-3 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                  >
                    {T.ctaLearnMore}
                  </Link>
                </div>
                <p className="mt-5 text-xs text-muted-foreground">
                  {T.ctaEmailPrefix}{" "}
                  <a
                    href="mailto:info@africaweb3institute.org"
                    className="font-semibold text-[#D4A017] hover:underline"
                  >
                    info@africaweb3institute.org
                  </a>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM (Programmes Table) ────────────────────────────────── */}
      <section id="curriculum" className="py-20 border-b border-border scroll-mt-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2 text-[#D4A017]">
              {T.curriculumEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {T.curriculumHeading}
            </h2>
          </AnimatedSection>

          <div className="overflow-x-auto rounded-2xl border border-border shadow-lg bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B1437]">
                  <th className="text-left px-6 py-4 text-xs font-bold tracking-wider uppercase text-white/70 whitespace-nowrap">
                    {T.colProgramme}
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold tracking-wider uppercase text-white/70">
                    {T.colDesignedFor}
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold tracking-wider uppercase text-white/70">
                    {T.colFocusAreas}
                  </th>
                </tr>
              </thead>
              <tbody>
                {T.programmes.map((prog, i) => (
                  <tr
                    key={prog.name}
                    className={`border-t border-border/50 transition-colors hover:bg-[#F8F9FB] ${
                      i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                    }`}
                  >
                    <td className="px-6 py-4 align-top">
                      <p className="font-bold text-secondary text-sm">{prog.name}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {prog.audience}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {prog.focus}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── WHY AWI + DELIVERY FORMATS ────────────────────────────────────── */}
      <section id="why-awi" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.advantageEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-5">
              {T.advantageHeading}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-14">
              {T.advantageBody}
            </p>
          </AnimatedSection>

          <div id="delivery" className="pt-12 border-t border-border scroll-mt-24">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2 text-[#D4A017]">
                {T.deliveryEyebrow}
              </p>
              <h3 className="text-2xl font-bold text-secondary mb-2">
                {T.deliveryHeading}
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                {T.deliverySubtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {T.deliveryFormats.map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary bg-white border border-border rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-lg">{f.icon}</span> {f.label}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── WHO WE TRAIN ───────────────────────────────────────────────────── */}
      <section id="who-we-train" className="py-20 scroll-mt-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2 text-[#D4A017]">
              {T.audienceEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {T.audienceHeading}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {T.groups.map((group, idx) => (
              <AnimatedSection key={group.title} delay={idx * 80}>
                <div className="group bg-white rounded-2xl border border-border p-6 transition-all duration-300 hover:border-[#D4A017]/40 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl bg-[#D4A017]/10 text-[#D4A017] group-hover:scale-110 transition-transform duration-300">
                      {group.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-secondary leading-snug mb-1.5">
                        {group.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {group.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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