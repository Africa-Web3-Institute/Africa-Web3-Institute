import { useLanguage } from "../../lib/LanguageContext";
import Reveal from "../common/Reveal";

const COPY = {
  en: { heading: "Trusted by Leading Organizations" },
  fr: { heading: "La confiance des organisations leaders" },
};

const PARTNERS = [
  "World Bank", "UNDP Africa", "African Union", "IMF",
  "Binance Africa", "Coinbase", "Visa Africa", "IFC",
];

export default function PartnersStrip() {
  const { language } = useLanguage();
  const C = COPY[language];

  return (
    <section className="py-16 border-b border-border overflow-hidden" style={{ backgroundColor: "#F5F5F0" }}>
      <Reveal as="div" className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-center mb-10" style={{ color: "rgba(11,20,55,0.4)" }}>
          {C.heading}
        </p>
      </Reveal>

      <div
        className="relative w-full"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...PARTNERS, ...PARTNERS].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="shrink-0 flex items-center justify-center px-10 py-2"
            >
              <span
                className="whitespace-nowrap text-[0.9375rem] font-semibold transition-colors"
                style={{ color: "rgba(11,20,55,0.45)" }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
