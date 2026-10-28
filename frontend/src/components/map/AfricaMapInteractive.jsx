import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import AfricaMapSVG from "./AfricaMapSVG";
import { COUNTRY_DATA, STATUS_COLORS, STATUS, STATUS_LABELS, getAllCountries } from "../../data/countryData";
import { useLanguage } from "../../lib/LanguageContext";
import CountryFlag from "../CountryFlag";

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[0.75rem] font-medium text-muted-foreground">{label}</span>
        <span className="text-[0.75rem] font-bold" style={{ color: "#0B1437" }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: "#D4A017" }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status, language }) {
  const labels = STATUS_LABELS[language];
  return (
    <span
      className="inline-flex items-center text-[0.75rem] font-semibold px-2.5 py-1 rounded-full text-white"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      {labels[status]}
    </span>
  );
}

function CountryModal({ name, onClose, language }) {
  const data = COUNTRY_DATA[name];
  const displayName = data?.name || name;
  const isKnown = Boolean(data);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const scrollToSection = (selector) => {
    onClose();
    setTimeout(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const policyScoreLabel = language === "fr" ? "Score Politique" : "Policy Score";
  const innovationScoreLabel = language === "fr" ? "Score Innovation" : "Innovation Score";
  const adoptionScoreLabel = language === "fr" ? "Score Adoption" : "Adoption Score";
  const focusLabel = language === "fr" ? "Domaines Clés" : "Key Focus Areas";
  const reportButtonLabel = language === "fr" ? "Voir le Rapport Complet" : "View Full Report";
  const rankingsButtonLabel = language === "fr" ? "Voir les Classements" : "See Rankings";
  const notifyButtonLabel = language === "fr" ? "Être Notifié" : "Get Notified";
  const unknownMessage = language === "fr"
    ? `AWI mène actuellement des recherches sur ${displayName}. Les données complètes de politique seront disponibles dans le rapport AWPII 2026.`
    : `AWI is actively researching ${displayName}. Full policy data will be available in the 2026 AWPII report.`;

  const renderKnownData = () => (
    <>
      <p className="text-[0.9375rem] text-muted-foreground leading-[1.75] mb-6">{data.summary}</p>

      <div className="space-y-4 mb-6">
        <ScoreBar label={policyScoreLabel} value={data.policy} />
        <ScoreBar label={innovationScoreLabel} value={data.innovation} />
        <ScoreBar label={adoptionScoreLabel} value={data.adoption} />
      </div>

      <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "hsl(220 14% 97%)" }}>
        <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-2">
          {focusLabel}
        </p>
        <p className="text-[0.875rem] text-foreground">{Array.isArray(data.focus) ? data.focus.join(", ") : data.focus}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/country-tracker/${encodeURIComponent(name)}`}
          onClick={onClose}
          className="flex-1 text-center text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
          style={{ backgroundColor: "#D4A017", color: "#fff" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
        >
          {reportButtonLabel}
        </Link>
        <button
          onClick={() => scrollToSection("#rankings")}
          className="flex-1 text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
          style={{ borderColor: "#0B1437", color: "#0B1437" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#0B1437"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#0B1437"; }}
        >
          {rankingsButtonLabel}
        </button>
      </div>
    </>
  );

  const renderUnknownData = () => (
    <>
      <p className="text-[0.9375rem] text-muted-foreground leading-[1.75] mb-6">{unknownMessage}</p>
      <button
        onClick={() => scrollToSection("#contact")}
        className="w-full text-[0.875rem] font-semibold px-5 py-2.5 transition-colors"
        style={{ backgroundColor: "#D4A017", color: "#fff" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
      >
        {notifyButtonLabel}
      </button>
    </>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white overflow-hidden rounded-t-2xl sm:rounded-xl"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="px-7 py-5 flex items-start justify-between" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              {data?.flag && <CountryFlag emoji={data.flag} size={20} />}
              <h3 className="text-[1.25rem] font-bold" style={{ color: "#0B1437" }}>{displayName}</h3>
            </div>
            <StatusBadge status={data ? data.status : STATUS.UNDEFINED} language={language} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {isKnown ? renderKnownData() : renderUnknownData()}
        </div>
      </div>
    </div>,
    document.body
  );
}

const LEGEND_ITEMS = [STATUS.REGULATED, STATUS.EMERGING, STATUS.RESTRICTED, STATUS.UNDEFINED];

export default function AfricaMapInteractive() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { language } = useLanguage();
  const labels = STATUS_LABELS[language];

  return (
    <section id="map" className="py-20 lg:py-28 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {language === "fr" ? "Carte Politique" : "Policy Map"}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold leading-snug mb-4" style={{ color: "#0B1437" }}>
            {language === "fr" ? "Carte Politique Interactive" : "Interactive Policy Map"}
          </h2>
          <p className="text-[1rem] text-muted-foreground max-w-xl mx-auto leading-[1.8]">
            {language === "fr"
              ? "Cliquez sur un pays pour voir son statut réglementaire Web3 et un résumé de sa politique"
              : "Click any country to view its Web3 regulatory status and policy summary"}
          </p>
        </div>

        {/* Map */}
        <div className="max-w-[700px] mx-auto relative">
          <AfricaMapSVG
            interactive={true}
            onCountryClick={(name) => setSelectedCountry(name)}
          />
          {selectedCountry && (
            <div className="absolute inset-0 z-10" />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {LEGEND_ITEMS.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-sm shrink-0"
                style={{ backgroundColor: STATUS_COLORS[status], opacity: 0.82 }}
              />
              <span className="text-[0.8125rem] font-medium text-muted-foreground">
                {labels[status]}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-[0.75rem] text-muted-foreground/60 mt-3">
          {language === "fr"
            ? "Basé sur les recherches AWI de mai 2026. Mis à jour annuellement."
            : "Based on AWI research as of May 2026. Updated annually."}
        </p>
      </div>

      {/* Modal */}
      {selectedCountry && (
        <CountryModal
          name={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          language={language}
        />
      )}
    </section>
  );
}