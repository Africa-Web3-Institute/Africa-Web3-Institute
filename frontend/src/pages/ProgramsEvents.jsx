import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

export default function ProgramsEvents() {
  const { language } = useLanguage();
  const T = t[language].programsEventsHub;
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <title>Programs & Events | Africa Web3 Institute</title>

      <section style={{ backgroundColor: "#0B1437" }} className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h1 className="text-[2rem] lg:text-[3rem] font-bold text-white leading-tight mb-4">
            {T.heading}
          </h1>
          <p className="text-[1.0625rem] max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
            {T.body}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.items.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-left bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[1.5rem]">{item.icon}</span>
                  <h3 className="text-[0.9375rem] font-bold text-secondary leading-snug">{item.title}</h3>
                </div>
                <p className="text-[0.8375rem] text-muted-foreground leading-relaxed">{item.description}</p>
                <span className="mt-auto pt-3 border-t border-border/50 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold" style={{ color: "#D4A017" }}>
                  {language === "fr" ? "Ouvrir" : "Open"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
