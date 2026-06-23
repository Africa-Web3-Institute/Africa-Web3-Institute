import { useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import JoinModal from "./JoinModal";

export default function FinalCTA() {
  const { language } = useLanguage();
  const T = t[language].finalCTA;
  const [showJoin, setShowJoin] = useState(false);

  return (
    <section className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: "#0B1437" }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #D4A017 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #D4A017, transparent)" }} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="font-display text-[2rem] lg:text-[3rem] font-bold text-white leading-snug tracking-tight whitespace-pre-line mb-6 max-w-2xl mx-auto">
          {T.heading}
        </h2>
        <p className="text-[1rem] mb-12 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>{T.body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowJoin(true)}
            className="inline-flex items-center justify-center gap-2 text-[0.875rem] font-semibold px-8 py-4 transition-all"
            style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            {T.cta1}
          </button>
          <a href="mailto:info@africaweb3institute.org?subject=Partnership Enquiry"
            className="inline-flex items-center justify-center gap-2 text-[0.875rem] font-semibold px-8 py-4 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {T.cta2}
          </a>
        </div>
      </div>
      {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}
    </section>
  );
}