import { Link } from "react-router-dom";
import { Users, GraduationCap, Layers, Sparkles, Send } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const QUICK_NAV = [
  { id: "get-started", icon: Send, label: { en: "Get in Touch", fr: "Nous contacter" } },
  { id: "who-we-train", icon: Users, label: { en: "Who We Train", fr: "Qui nous formons" } },
  { id: "curriculum", icon: Layers, label: { en: "Curriculum", fr: "Curriculum" } },
  { id: "delivery", icon: GraduationCap, label: { en: "Delivery", fr: "Formats" } },
  { id: "why-awi", icon: Sparkles, label: { en: "Why AWI", fr: "Pourquoi AWI" } },
];

export default function CapacityBuilding() {
  const { language } = useLanguage();
  const T = t[language].capacityBuilding;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Hero */}
      <section className="py-14 lg:py-20 border-b border-border" style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(0 0% 100%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
                {T.eyebrow}
              </p>
              <h1 className="text-[2rem] lg:text-[3rem] font-bold text-secondary leading-tight mb-3">
                {T.heroTitle}
              </h1>
              <p className="text-[1.1875rem] font-semibold mb-4" style={{ color: "#D4A017" }}>
                {T.heroTagline}
              </p>
              <p className="text-[1.0625rem] font-medium text-secondary mb-3">
                {T.heroLine1}
              </p>
              <p className="text-[1rem] max-w-2xl leading-relaxed text-muted-foreground mb-8">
                {T.heroBody}
              </p>

              {/* Quick explore nav */}
              <div className="flex flex-wrap gap-2.5">
                {QUICK_NAV.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-4 py-2.5 rounded-full border transition-all"
                    style={{ borderColor: "#E5E7EB", color: "#0B1437", backgroundColor: "#fff" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.backgroundColor = "rgba(212,160,23,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.backgroundColor = "#fff"; }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: "#D4A017" }} />
                    {label[language] || label.en}
                  </button>
                ))}
              </div>
            </div>

            <div id="get-started" className="rounded-2xl shadow-xl bg-white border border-border p-7 lg:p-8 scroll-mt-24">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
                {T.ctaEyebrow}
              </p>
              <h2 className="text-[1.5rem] font-bold text-secondary mb-3">
                {T.ctaHeading}
              </h2>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed mb-6">
                {T.ctaBody}
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:info@africaweb3institute.org"
                  className="inline-flex items-center justify-center text-[0.9375rem] font-semibold px-6 py-3 rounded-md transition-colors"
                  style={{ backgroundColor: "#D4A017", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
                >
                  {T.ctaButton}
                </a>
                <Link
                  to="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center justify-center text-[0.9375rem] font-semibold px-6 py-3 rounded-md border transition-colors"
                  style={{ borderColor: "#0B1437", color: "#0B1437" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#0B1437"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#0B1437"; }}
                >
                  {T.ctaLearnMore}
                </Link>
              </div>
              <p className="mt-5 text-[0.8125rem] text-muted-foreground">
                {T.ctaEmailPrefix}{" "}
                <a href="mailto:info@africaweb3institute.org" className="font-semibold" style={{ color: "#D4A017" }}>
                  info@africaweb3institute.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Training Programmes */}
      <section id="curriculum" className="py-16 lg:py-20 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.curriculumEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary">{T.curriculumHeading}</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr style={{ backgroundColor: "#0B1437" }}>
                  <th className="text-left px-5 py-3.5 text-[0.6875rem] font-bold tracking-wider uppercase text-white/70 whitespace-nowrap">{T.colProgramme}</th>
                  <th className="text-left px-5 py-3.5 text-[0.6875rem] font-bold tracking-wider uppercase text-white/70">{T.colDesignedFor}</th>
                  <th className="text-left px-5 py-3.5 text-[0.6875rem] font-bold tracking-wider uppercase text-white/70">{T.colFocusAreas}</th>
                </tr>
              </thead>
              <tbody>
                {T.programmes.map((prog, i) => (
                  <tr key={prog.name} className="border-t border-border/50" style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                    <td className="px-5 py-4 align-top">
                      <p className="font-bold text-secondary text-[0.875rem] whitespace-nowrap">{prog.name}</p>
                    </td>
                    <td className="px-5 py-4 align-top" style={{ minWidth: "180px" }}>
                      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{prog.audience}</p>
                    </td>
                    <td className="px-5 py-4 align-top" style={{ minWidth: "280px" }}>
                      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{prog.focus}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why AWI + Delivery Formats */}
      <section id="why-awi" className="py-16 lg:py-20 border-b border-border scroll-mt-24" style={{ backgroundColor: "hsl(220 14% 97%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.advantageEyebrow}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary mb-5">{T.advantageHeading}</h2>
          <p className="text-[1.0625rem] leading-[1.9] text-muted-foreground mb-14">
            {T.advantageBody}
          </p>

          <div id="delivery" className="pt-10 border-t border-border scroll-mt-24">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.deliveryEyebrow}</p>
              <h3 className="text-[1.25rem] font-bold text-secondary mb-2">{T.deliveryHeading}</h3>
              <p className="text-[0.9375rem] text-muted-foreground">{T.deliverySubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {T.deliveryFormats.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-secondary bg-white border border-border rounded-full px-4 py-2"
                >
                  <span className="text-[1rem]">{f.icon}</span> {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Train */}
      <section id="who-we-train" className="py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.audienceEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary">{T.audienceHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.groups.map((group) => (
              <div
                key={group.title}
                className="bg-white border border-border rounded-xl p-6 flex items-start gap-4 transition-all"
                style={{ boxShadow: "0 1px 2px rgba(11,20,55,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 28px rgba(11,20,55,0.1)"; e.currentTarget.style.borderColor = "rgba(212,160,23,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(11,20,55,0.04)"; e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = "none"; }}
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-lg text-[1.25rem] shrink-0" style={{ backgroundColor: "rgba(212,160,23,0.1)" }}>
                  {group.icon}
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-bold text-secondary leading-snug mb-1.5">{group.title}</h3>
                  <p className="text-[0.8375rem] text-muted-foreground leading-relaxed">{group.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
