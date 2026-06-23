import { Scale, BookOpen, Lightbulb } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

const ICONS = [Scale, BookOpen, Lightbulb];

export default function Programs() {
  const { language } = useLanguage();
  const T = t[language].programs;

  return (
    <section id="programs" className="py-24 lg:py-36 border-b border-border" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug">
            {T.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {T.items.map((program, i) => {
            const Icon = ICONS[i];
            return (
              <div key={program.title} className="bg-white p-10 flex flex-col group hover:shadow-lg transition-shadow">
                <div
                  className="w-12 h-12 flex items-center justify-center mb-8"
                  style={{ backgroundColor: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.25)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
                </div>
                <h3 className="font-display text-[1.125rem] font-bold text-secondary mb-4">{program.title}</h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.8] flex-1">{program.description}</p>
                <div className="mt-8 pt-6 border-t border-border">
                  <span className="text-[0.75rem] font-semibold tracking-wider uppercase" style={{ color: "#D4A017" }}>
                    Learn more →
                  </span>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}