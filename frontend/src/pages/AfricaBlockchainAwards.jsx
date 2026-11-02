// src/pages/AfricaBlockchainAwards.js
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Award,
  Star,
  Shield,
  Globe,
  Zap,
  Building2,
  Leaf,
  ChevronRight,
  Trophy,
  LayoutGrid,
  ClipboardList,
  Info,
  Newspaper,
  Send,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const CATEGORY_ICONS = [Building2, Zap, Leaf, Globe, Shield, Star];

const QUICK_NAV = [
  { id: "categories", icon: LayoutGrid, label: { en: "Categories", fr: "Catégories" } },
  { id: "nomination-form", icon: ClipboardList, label: { en: "Nominate", fr: "Nominer" } },
  { id: "about", icon: Info, label: { en: "About", fr: "À propos" } },
  { id: "media", icon: Newspaper, label: { en: "Media", fr: "Médias" } },
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

// ─── CTA Buttons ─────────────────────────────────────────────────────────────
const CTAButtonLight = ({ children, primary, onClick }) => {
  const base =
    "inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300";
  const style = primary
    ? `${base} bg-[#D4A017] text-white hover:bg-[#b88a12] shadow-lg shadow-[#D4A017]/25`
    : `${base} border border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white`;
  return (
    <button onClick={onClick} className={style}>
      {children}
    </button>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AfricaBlockchainAwards() {
  const { language } = useLanguage();
  const T = t[language].awards;

  const [nomForm, setNomForm] = useState({
    name: "",
    org: "",
    email: "",
    category: "",
    description: "",
  });
  const [nomErrors, setNomErrors] = useState({});
  const [nomSubmitted, setNomSubmitted] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateNom = () => {
    const e = {};
    if (!nomForm.name.trim()) e.name = true;
    if (!nomForm.org.trim()) e.org = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nomForm.email)) e.email = true;
    if (!nomForm.category) e.category = true;
    if (!nomForm.description.trim()) e.description = true;
    return e;
  };

  const handleNomSubmit = (e) => {
    e.preventDefault();
    const errs = validateNom();
    if (Object.keys(errs).length) {
      setNomErrors(errs);
      return;
    }
    setNomSubmitted(true);
    setNomForm({ name: "", org: "", email: "", category: "", description: "" });
  };

  const inputCls = (field) =>
    `w-full text-sm px-4 py-2.5 rounded-lg border outline-none transition-all bg-white ${
      nomErrors[field]
        ? "border-red-400 focus:ring-red-400/30"
        : "border-border focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/30"
    }`;

 

  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Awi_Website_pics.jpg')",
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
              <br />
              <span className="text-[#D4A017]">{T.heroTitleAccent}</span>
            </h1>
            <p className="text-lg font-semibold text-[#D4A017] mb-6">
              {T.heroSubtitle}
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              {T.heroPara1}
            </p>


            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <CTAButtonLight
                primary
                onClick={() =>
                  window.open(
                    "mailto:info@africaweb3institute.org?subject=Sponsorship Enquiry — Africa Blockchain Awards 2025",
                    "_blank"
                  )
                }
              >
                {T.heroCta1} <ArrowRight className="w-4 h-4" />
              </CTAButtonLight>
              <CTAButtonLight onClick={() => scrollToSection("nomination-form")}>
                {T.heroCta2}
              </CTAButtonLight>
            </div>

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
        </div>
      </section>

      {/* ─── AWARD CATEGORIES ────────────────────────────────────────────────── */}
      <section
        id="categories"
        className="py-20 border-b border-border scroll-mt-24 bg-[#F8F9FB]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.categoriesEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {T.categoriesHeading}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-3 text-[0.9375rem]">
              {T.categoriesPara}
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {T.categories.map((cat, ci) => {
              const Icon = CATEGORY_ICONS[ci];
              return (
                <AnimatedSection key={cat.number} delay={ci * 80}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Category header */}
                    <div className="flex items-center gap-4 px-6 py-4 bg-[#0B1437]">
                      <span className="text-xs font-bold tracking-widest text-[#D4A017]/60">
                        {cat.number}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 flex items-center justify-center text-[#D4A017]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                    </div>
                    {/* Awards list */}
                    <div className="divide-y divide-border">
                      {cat.awards.map((award) => (
                        <div key={award.name} className="px-6 py-4 flex items-start gap-4 hover:bg-[#F8F9FB] transition-colors">
                          <Award className="w-4 h-4 text-[#D4A017] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-secondary">
                              {award.name}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {award.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── NOMINATION & EVALUATION ────────────────────────────────────────── */}
      <section
        id="nomination-form"
        className="py-20 border-b border-border scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Evaluation criteria */}
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.nominationEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                {T.nominationHeading}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {T.nominationPara}
              </p>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
                {T.metricsLabel}
              </p>
              <div className="space-y-3">
                {T.metrics.map((m, i) => (
                  <div
                    key={m.title}
                    className="bg-white p-5 rounded-xl border border-border flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-bold text-[#D4A017] mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-secondary mb-0.5">
                        {m.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right: Nomination form */}
            <AnimatedSection delay={150}>
              <div className="bg-white p-8 rounded-2xl border border-border shadow-md">
                {nomSubmitted ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🎉</div>
                    <p className="text-xl font-bold text-secondary">
                      {language === "fr"
                        ? "Votre candidature a été soumise. Merci !"
                        : "Your nomination has been submitted. Thank you!"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNomSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          {language === "fr" ? "Nom complet" : "Full Name"}
                        </label>
                        <input
                          className={inputCls("name")}
                          value={nomForm.name}
                          onChange={(e) => {
                            setNomForm({ ...nomForm, name: e.target.value });
                            setNomErrors({ ...nomErrors, name: false });
                          }}
                          placeholder={
                            language === "fr" ? "Votre nom" : "Your name"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          {language === "fr" ? "Organisation" : "Organisation"}
                        </label>
                        <input
                          className={inputCls("org")}
                          value={nomForm.org}
                          onChange={(e) => {
                            setNomForm({ ...nomForm, org: e.target.value });
                            setNomErrors({ ...nomErrors, org: false });
                          }}
                          placeholder={
                            language === "fr"
                              ? "Votre organisation"
                              : "Your organisation"
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputCls("email")}
                        value={nomForm.email}
                        onChange={(e) => {
                          setNomForm({ ...nomForm, email: e.target.value });
                          setNomErrors({ ...nomErrors, email: false });
                        }}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        {language === "fr" ? "Catégorie" : "Award Category"}
                      </label>
                      <select
                        className={inputCls("category")}
                        value={nomForm.category}
                        onChange={(e) => {
                          setNomForm({ ...nomForm, category: e.target.value });
                          setNomErrors({ ...nomErrors, category: false });
                        }}
                      >
                        <option value="">
                          — {language === "fr" ? "Sélectionner" : "Select category"} —
                        </option>
                        {T.categories.map((c) => (
                          <option key={c.number} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        {language === "fr"
                          ? "Description de l'impact"
                          : "Description of Impact"}
                      </label>
                      <textarea
                        rows={4}
                        className={`${inputCls("description")} resize-none`}
                        value={nomForm.description}
                        onChange={(e) => {
                          setNomForm({
                            ...nomForm,
                            description: e.target.value,
                          });
                          setNomErrors({ ...nomErrors, description: false });
                        }}
                        placeholder={
                          language === "fr"
                            ? "Décrivez l'impact..."
                            : "Describe the impact and achievements..."
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-full bg-[#D4A017] text-white hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
                    >
                      {language === "fr"
                        ? "Soumettre la nomination"
                        : "Submit Nomination"}{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── ABOUT (Evaluation philosophy + attendees + objectives) ──────────── */}
      <section
        id="about"
        className="py-20 border-b border-border scroll-mt-24 bg-[#F8F9FB]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.aboutEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                {T.aboutHeading}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {T.aboutPara1}
              </p>
              <CTAButtonLight
                primary
                onClick={() => scrollToSection("get-involved")}
              >
                {T.aboutCta} <ArrowRight className="w-4 h-4" />
              </CTAButtonLight>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">
                {T.aboutAttendeesLabel}
              </p>
              <div className="space-y-3">
                {T.attendees.map((a, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl border border-border flex items-start gap-3 hover:shadow-md transition-shadow"
                  >
                    <ChevronRight className="w-4 h-4 text-[#D4A017] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="pt-16 border-t border-border">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.objectivesEyebrow}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
                {T.objectivesHeading}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {T.objectivesPara}
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {T.objectives.map((o, i) => (
                <AnimatedSection key={o.title} delay={i * 80}>
                  <div className="bg-white p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                    <span className="text-sm font-bold text-[#D4A017] block mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-base font-bold text-secondary mb-1">
                      {o.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {o.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEDIA & PRESS ────────────────────────────────────────────────────── */}
      <section id="media" className="py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
                {T.mediaEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                {T.mediaHeading}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {T.mediaPara}
              </p>
              <div className="flex items-center gap-4 bg-[#F8F9FB] p-5 rounded-xl border border-border">
                <Mail className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                    {T.mediaDirectorLabel}
                  </p>
                  <a
                    href="mailto:media@africaweb3institute.org"
                    className="text-base font-semibold text-secondary hover:text-[#D4A017] transition-colors border-b border-[#D4A017]/30 pb-0.5"
                  >
                    media@africaweb3institute.org
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── INSTITUTIONAL ENGAGEMENT ────────────────────────────────────────── */}
      <section
        id="get-involved"
        className="py-20 scroll-mt-24 bg-[#0B1437] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/Awi_Website_pics.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Trophy className="w-12 h-12 mx-auto mb-6 text-[#D4A017]" />
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.engagementEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {T.engagementHeading}
            </h2>
            <p className="text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
              {T.engagementPara}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => scrollToSection("nomination-form")}
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full bg-[#D4A017] text-white hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
              >
                {T.engagementCta1} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="mailto:info@africaweb3institute.org"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                {T.engagementCta2}
              </a>
              <a
                href="mailto:info@africaweb3institute.org?subject=Sponsorship Enquiry — Africa Blockchain Awards 2025"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                {T.engagementCta3}
              </a>
            </div>
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