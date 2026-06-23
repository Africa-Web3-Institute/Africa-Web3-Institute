import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import JoinModal from "./JoinModal";

export default function HeroSection() {
  const { language } = useLanguage();
  const T = t[language].hero;
  const navigate = useNavigate();
  const [showJoin, setShowJoin] = useState(false);

  /**const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };**/

  return (
    <>
    <section style={{ backgroundColor: "#0B1437" }} className="relative overflow-hidden">
      {/* Subtle radial glow accents */}
      <div className="absolute top-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: "rgba(212,160,23,0.07)" }} />
      <div className="absolute bottom-[-80px] left-[80px] w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: "rgba(212,160,23,0.05)" }} />

      {/* Dotted scattered pattern – bottom right */}
      <div className="absolute right-8 bottom-8 flex flex-wrap gap-[5px] w-[130px] opacity-[0.18] pointer-events-none">
        {[6,6,6,4,8,5,6,4,7,5,6,4,5,7,6,4,5,6].map((size, i) => (
          <span key={i} className="rounded-full shrink-0"
            style={{ width: size, height: size, backgroundColor: "#D4A017" }} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Badge row */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#FAEEDA", color: "#633806" }}>
              {T.established}
          </span>
          <span className="text-[0.6875rem]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {T.subheading}
          </span>
        </div>

        <h1 className="text-[2rem] lg:text-[2.75rem] font-semibold text-white leading-[1.25] max-w-2xl mb-5"
          style={{ letterSpacing: "-0.01em" }}>
          {T.h1}
        </h1>

        <p className="text-[0.9375rem] leading-[1.75] mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
          {T.intro}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/awpii")}
            className="inline-flex items-center gap-2 text-[0.875rem] font-semibold px-6 py-2.5 rounded-lg transition-all"
            style={{ backgroundColor: "#D4A017", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            {T.cta1} <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="inline-flex items-center gap-2 text-[0.875rem] px-6 py-2.5 rounded-lg transition-all"
            style={{ border: "0.5px solid rgba(255,255,255,0.3)", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {T.cta2}
          </button>
        </div>
      </div>
    </section>
    {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}
  </>
  );
}