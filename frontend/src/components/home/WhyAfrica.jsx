import { useLanguage} from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function WhyAfrica() {
  const { language } = useLanguage();
  const T = t[language].whyAfrica;

  return (
    <section className="py-24 lg:py-36 border-b border-border" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-8" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <blockquote className="mb-8">
            <p className="font-display text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary leading-snug tracking-tight">
              {T.quote}
            </p>
          </blockquote>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: "#D4A017" }} />
          <p className="text-[1rem] text-muted-foreground leading-[1.85]">
            {T.body}
          </p>
        </div>
      </div>
    </section>
  );
}