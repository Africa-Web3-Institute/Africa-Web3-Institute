import { Link } from "react-router-dom";
import AfricaMapSVG from "./AfricaMapSVG";
import { STATUS_COLORS, STATUS, STATUS_LABELS } from "../../data/countryData";
import { useLanguage } from "../../lib/LanguageContext";

const LEGEND_EN = [
  { status: STATUS.REGULATED },
  { status: STATUS.EMERGING },
  { status: STATUS.RESTRICTED },
  { status: STATUS.UNDEFINED },
];

export default function AfricaMapTeaser() {
  const { language } = useLanguage();
  const labels = STATUS_LABELS[language];

  return (
    <section className="py-20 lg:py-28 border-b border-border" style={{ backgroundColor: "#0B1437" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {language === "fr" ? "Paysage Web3 Africain" : "Africa's Web3 Landscape"}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-white leading-snug mb-4">
            {language === "fr" ? "Le Paysage Politique Web3 de l'Afrique" : "Africa's Web3 Policy Landscape"}
          </h2>
          <p className="text-[1rem] max-w-xl mx-auto leading-[1.8]" style={{ color: "rgba(255,255,255,0.6)" }}>
            {language === "fr"
              ? "Découvrez comment les nations africaines progressent dans la réglementation Web3 et l'adoption de la blockchain"
              : "See how African nations are progressing on Web3 regulation and blockchain adoption"}
          </p>
        </div>

        {/* Map */}
        <div className="max-w-[700px] mx-auto">
          <AfricaMapSVG interactive={false} />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 mb-10">
          {LEGEND_EN.map(({ status }) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-sm shrink-0"
                style={{ backgroundColor: STATUS_COLORS[status], opacity: 0.82 }}
              />
              <span className="text-[0.8125rem] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                {labels[status]}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/awpii#map"
            className="inline-flex items-center gap-2 text-[0.875rem] font-semibold px-7 py-3 transition-colors"
            style={{ backgroundColor: "#D4A017", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            {language === "fr" ? "Explorer la Carte Interactive →" : "Explore Full Interactive Map →"}
          </Link>
        </div>

        <p className="text-center text-[0.75rem] mt-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {language === "fr"
            ? "Basé sur les recherches AWI de mai 2026. Mis à jour annuellement."
            : "Based on AWI research as of May 2026. Updated annually."}
        </p>
      </div>
    </section>
  );
}