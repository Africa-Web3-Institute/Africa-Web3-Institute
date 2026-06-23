import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

export default function CapacityBuilding() {
  const { language } = useLanguage();
  const T = t[language].capacityBuilding;

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <title>Capacity Building | Africa Web3 Institute</title>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h1 className="text-[2rem] lg:text-[3rem] font-bold text-white leading-tight mb-3">
            {T.heroTitle}
          </h1>
          <p className="text-[1.1875rem] font-semibold mb-4" style={{ color: "#D4A017" }}>
            {T.heroTagline}
          </p>
          <p className="text-[1.0625rem] font-medium text-white mb-3">
            {T.heroLine1}
          </p>
          <p className="text-[1rem] max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {T.heroBody}
          </p>
        </div>
      </section>

      {/* Who We Train */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.audienceEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary">{T.audienceHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.groups.map((group) => (
              <div key={group.title} className="bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-[1.5rem]">{group.icon}</span>
                  <h3 className="text-[0.9375rem] font-bold text-secondary leading-snug">{group.title}</h3>
                </div>
                <p className="text-[0.8375rem] text-muted-foreground leading-relaxed">{group.desc}</p>
                <div className="mt-auto pt-3 border-t border-border/50">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-wide mb-1" style={{ color: "#D4A017" }}>{T.focusLabel}</p>
                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{group.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Training Programmes */}
      <section className="py-16 lg:py-20 border-b border-border" style={{ backgroundColor: "hsl(220 14% 97%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.curriculumEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary">{T.curriculumHeading}</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
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

      {/* Delivery Formats */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>{T.deliveryEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary mb-3">{T.deliveryHeading}</h2>
            <p className="text-[1rem] text-muted-foreground">{T.deliverySubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {T.deliveryFormats.map((f) => (
              <div key={f.label} className="flex items-center gap-4 bg-white border border-border rounded-lg px-5 py-4">
                <span className="text-[1.5rem] shrink-0">{f.icon}</span>
                <p className="text-[0.875rem] font-medium text-secondary leading-snug">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AWI */}
      <section className="py-16 lg:py-20 border-b border-border" style={{ backgroundColor: "#0B1437" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.advantageEyebrow}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-white mb-6">{T.advantageHeading}</h2>
          <p className="text-[1.0625rem] leading-[1.9]" style={{ color: "rgba(255,255,255,0.7)" }}>
            {T.advantageBody}
          </p>
        </div>
      </section>

      {/* Book a Training Session CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.ctaEyebrow}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary mb-4">
            {T.ctaHeading}
          </h2>
          <p className="text-[1rem] text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            {T.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center text-[0.9375rem] font-semibold px-7 py-3 rounded-md transition-colors"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {T.ctaButton}
            </a>
            <Link
              to="/about"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center text-[0.9375rem] font-semibold px-7 py-3 rounded-md border transition-colors"
              style={{ borderColor: "#0B1437", color: "#0B1437" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#0B1437"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#0B1437"; }}
            >
              {T.ctaLearnMore}
            </Link>
          </div>
          <p className="mt-5 text-[0.875rem] text-muted-foreground">
            {T.ctaEmailPrefix}{" "}
            <a href="mailto:info@africaweb3institute.org" className="font-semibold" style={{ color: "#D4A017" }}>
              info@africaweb3institute.org
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}