import { useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import JoinModal from "../../components/home/JoinModal";

export default function Community() {
  const { language } = useLanguage();
  const T = t[language].community;
  const [showJoin, setShowJoin] = useState(false);

  const handleCta = (idx) => {
    if (idx === 0) setShowJoin(true);
    else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="community" className="py-24 lg:py-36 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug">
            {T.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {T.paths.map((path, i) => (
            <div key={path.label} className="bg-white p-10 flex flex-col group hover:shadow-lg transition-shadow">
              <span className="text-[0.6875rem] font-bold tracking-[0.2em] mb-6" style={{ color: "#D4A017" }}>
                {path.label}
              </span>
              <h3 className="font-display text-[1.125rem] font-bold text-secondary mb-4">{path.title}</h3>
              <p className="text-[0.875rem] text-muted-foreground leading-[1.8] flex-1">{path.description}</p>
              <button className="mt-8 self-start text-[0.8125rem] font-semibold transition-colors" style={{ color: "#D4A017" }}
                onClick={() => handleCta(i)}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {path.cta} →
              </button>
            </div>
          ))}
        </div>
      </div>
      {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}
    </section>
  );
}