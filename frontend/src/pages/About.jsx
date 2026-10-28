// src/pages/About.js
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import { Globe, BookOpen, GraduationCap, ArrowRight, Shield, Users, TrendingUp } from "lucide-react";
import Partners from "../components/home/Partners";
import { useEffect, useRef, useState } from "react";

// ─── Pillars data ────────────────────────────────────────────────────────────
const PILLAR_ICONS = [Globe, BookOpen, GraduationCap];
const PILLAR_KEYS = [
  { titleKey: "pillar1Title", descKey: "pillar1Desc" },
  { titleKey: "pillar2Title", descKey: "pillar2Desc" },
  { titleKey: "pillar3Title", descKey: "pillar3Desc" },
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

// ─── Reusable animated section wrapper ──────────────────────────────────────
const AnimatedSection = ({ children, className = "" }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function About() {
  const { language } = useLanguage();
  const T = t[language].about;

  const PILLARS = PILLAR_KEYS.map(({ titleKey, descKey }, i) => ({
    icon: PILLAR_ICONS[i],
    title: T[titleKey],
    desc: T[descKey],
  }));

  const IMPACT_STATS = [
    { icon: <TrendingUp className="w-6 h-6" />, stat: "Fastest-growing", label: T.stat1 },
    { icon: <Users className="w-6 h-6" />, stat: "12%+", label: T.stat2 },
    { icon: <Shield className="w-6 h-6" />, stat: "$48.2M", label: T.stat3 },
  ];

  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
      
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0B1437] via-[#0B1437]/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <AnimatedSection className="max-w-2xl">
            <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
              {T.whoWeAreTitle}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              {T.whoWeAreSubtitle}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              {T.whoWeAreText}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/awpii"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4A017] text-white font-semibold hover:bg-[#b88a12] transition-colors"
              >
                Explore our research <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    

      {/* ─── MISSION & VISION ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FB] border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.missionTag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{T.missionHeading}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "🎯", title: T.missionTitle, text: T.missionText },
              { icon: "🔭", title: T.visionTitle, text: T.visionText },
            ].map((item, idx) => (
              <AnimatedSection key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#D4A017]">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THREE PILLARS ──────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.whatWeDoTitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{T.corePillars}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map(({ icon: Icon, title, desc }, idx) => (
              <AnimatedSection key={idx} className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-border hover:border-[#D4A017]/30">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0B1437] text-[#D4A017] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#D4A017]/20 transition-colors duration-300 pointer-events-none" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ───────────────────────────────────────────────────────── */}
      <Partners />

      {/* ─── WHY IT MATTERS (Impact) ──────────────────────────────────────── */}
      <section className="relative py-20 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1437]/95 to-[#0B1437]/90" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.whyMattersTag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{T.whyMattersTitle}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {IMPACT_STATS.map((s, idx) => (
              <AnimatedSection key={idx} className="p-8 text-center rounded-2xl border border-[#D4A017]/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <div className="text-[#D4A017] w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#D4A017]/10">
                  {s.icon}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#D4A017] mb-2">{s.stat}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <p className="text-lg text-white/70 text-center max-w-3xl mx-auto leading-relaxed">
              {T.whyMattersText1}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── INDEPENDENT STATEMENT ─────────────────────────────────────────── */}
      <section className="py-16 bg-[#F8F9FB] border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">{T.independentTag}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              {T.independentText}
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
            {T.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}