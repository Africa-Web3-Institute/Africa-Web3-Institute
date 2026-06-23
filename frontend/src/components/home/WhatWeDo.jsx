import { Landmark, FileText, GraduationCap, Rocket } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

const PILLAR_STYLES = [
  { bg: "#FAEEDA", color: "#633806", Icon: Landmark },
  { bg: "#E1F5EE", color: "#085041", Icon: FileText },
  { bg: "#E6F1FB", color: "#0C447C", Icon: GraduationCap },
  { bg: "#F0EEFF", color: "#3B1FA8", Icon: Rocket },
];

export default function WhatWeDo() {
  const { language } = useLanguage();
  const T = t[language].whatWeDo;

  return (
    <section id="programs" className="py-12 lg:py-16 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#9CA3AF" }}>
          {T.eyebrow}
        </p>
        <h2 className="text-[1.125rem] font-semibold mb-8" style={{ color: "#111827" }}>
          {T.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {T.pillars.map((pillar, i) => {
            const { bg, color, Icon } = PILLAR_STYLES[i] || PILLAR_STYLES[0];
            return (
              <div key={pillar.title} className="rounded-xl border border-border p-5 flex flex-col gap-3 bg-white hover:shadow-sm transition-shadow">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-[18px] h-[18px]" style={{ color }} />
                </div>
                <p className="text-[0.875rem] font-medium" style={{ color: "#111827" }}>{pillar.title}</p>
                <p className="text-[0.75rem] leading-[1.65]" style={{ color: "#6B7280" }}>{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}