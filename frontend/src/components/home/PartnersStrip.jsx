import { useLanguage } from "@/lib/LanguageContext";

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
    <section className="py-16 border-b border-border" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-center mb-10" style={{ color: "rgba(11,20,55,0.4)" }}>
          {C.heading}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-border">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="bg-white flex items-center justify-center py-6 px-4 text-center transition-colors hover:bg-yellow-50"
            >
              <span className="text-[0.75rem] font-semibold" style={{ color: "rgba(11,20,55,0.5)" }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}