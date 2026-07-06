import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const T = t[language].nav;
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navigateTo = (href) => {
    setOpen(false);
    setActiveDropdown(null);
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (href) => location.pathname === href;

  const INTELLIGENCE_ITEMS = [
    {
      section: language === "fr" ? "Aperçu" : "Overview",
      items: [
        { label: language === "fr" ? "Toute l'Intelligence" : "Intelligence", desc: language === "fr" ? "Indices, suivis réglementaires et publications en un seul endroit" : "Indexes, trackers, and publications in one place", href: "/intelligence" },
      ],
    },
    {
      section: language === "fr" ? "Indices & Données" : "Indexes & Data",
      items: [
        { label: "AWPII", desc: language === "fr" ? "Indice Africain des Politiques & de l'Innovation Web3" : "Africa Web3 Policy & Innovation Index", href: "/awpii" },
        { label: language === "fr" ? "Suivi Réglementaire" : "Regulatory Tracker", desc: language === "fr" ? "Mises à jour réglementaires en temps réel sur 18+ nations" : "Live regulatory updates across 18+ African nations", href: "/country-tracker" },
        { label: language === "fr" ? "Suivi Stablecoin" : "Stablecoin Tracker", desc: language === "fr" ? "Cadres réglementaires des stablecoins dans 200+ pays" : "Stablecoin regulatory frameworks across 200+ countries", href: "/stablecoin-tracker" },
        { label: language === "fr" ? "Surveillance des Sanctions" : "Enforcement Watch", desc: language === "fr" ? "Suivre les répressions réglementaires et actions coercitives" : "Track regulatory crackdowns and enforcement actions", href: "/enforcement-watch" },
      ],
    },
    {
      section: language === "fr" ? "Recherche & Publications" : "Research & Publications",
      items: [
        { label: language === "fr" ? "Publications" : "Publications", desc: language === "fr" ? "Notes de politique, rapports de recherche et analyses de marché" : "Policy briefs, research reports, and market analysis", href: "/publications" },
      ],
    },
  ];

  const PROGRAMS_ITEMS = [
    {
      section: language === "fr" ? "Aperçu" : "Overview",
      items: [
        { label: language === "fr" ? "Tous les Programmes" : "Programs & Events", desc: language === "fr" ? "Renforcement des capacités, engagement politique et rencontres" : "Capacity building, policy engagement, and convenings", href: "/programs-events" },
      ],
    },
    {
      section: language === "fr" ? "Réseaux & Communauté" : "Networks & Community",
      items: [
        { label: language === "fr" ? "Réseau des Étudiants Francophones Web3" : "Francophone Web3 & Students Network", desc: language === "fr" ? "Connecter les étudiants africains francophones dans le Web3" : "Connecting French-speaking African Web3 students", href: "/francophone-network" },
      ],
    },
    {
      section: language === "fr" ? "Éducation & Formation" : "Education & Training",
      items: [
        { label: language === "fr" ? "Renforcement des Capacités" : "Capacity Building", desc: language === "fr" ? "Formation pour gouvernements, institutions financières et secteur privé" : "Training for governments, financial institutions, and the private sector", href: "/capacity-building" },
      ],
    },
    {
      section: language === "fr" ? "Reconnaissance" : "Recognition",
      items: [
        { label: language === "fr" ? "Africa Blockchain Awards" : "Africa Blockchain Awards", desc: language === "fr" ? "La plateforme de reconnaissance blockchain de référence du continent" : "The continent's premier blockchain recognition platform", href: "/africa-blockchain-awards" },
      ],
    },
    {
      section: language === "fr" ? "Engagement Politique" : "Policy Engagement",
      items: [
        { label: "The Indaba Series", desc: language === "fr" ? "Le programme phare d'engagement politique de l'AWI" : "AWI's flagship policy engagement programme", href: "/indaba-series" },
      ],
    },
    {
      section: language === "fr" ? "Événements" : "Events",
      items: [
        { label: language === "fr" ? "Événements & Rencontres" : "Events & Convenings", desc: language === "fr" ? "Sommets politiques, ateliers et activations universitaires" : "Policy summits, workshops, and campus activations", href: "/events" },
      ],
    },
  ];

  const MegaMenu = ({ sections }) => (
    <div
      className="absolute top-full right-0 mt-1.5 rounded-lg overflow-hidden"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        width: "min(760px, 92vw)",
        zIndex: 100,
        animation: "dropdownFadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="grid grid-cols-3" style={{ gap: "1px", backgroundColor: "#F3F4F6" }}>
        {sections.flatMap((section) =>
          section.items.map((item) => (
            <button
              key={item.href}
              onClick={() => navigateTo(item.href)}
              className="text-left bg-white p-4 flex flex-col gap-2 transition-colors"
              style={{
                backgroundColor: isActive(item.href) ? "rgba(212,160,23,0.06)" : "#fff",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(11,20,55,0.04)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = isActive(item.href) ? "rgba(212,160,23,0.06)" : "#fff"}
            >
              <p className="text-[0.6rem] font-bold tracking-[0.15em] uppercase" style={{ color: "#D4A017" }}>
                {section.section}
              </p>
              <p className="text-[0.8125rem] font-semibold leading-snug"
                style={{ color: isActive(item.href) ? "#D4A017" : "#111827" }}>
                {item.label}
              </p>
              <p className="text-[0.6875rem] leading-snug" style={{ color: "#9CA3AF" }}>
                {item.desc}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50" style={{ padding: "18px 24px 0" }}>
      <div
        className="max-w-[1600px] mx-auto transition-all duration-200"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: 999,
          boxShadow: scrolled ? "0 10px 32px rgba(11,20,55,0.18)" : "0 6px 24px rgba(11,20,55,0.14)",
          border: `1px solid ${scrolled ? "rgba(240,241,243,1)" : "rgba(255,255,255,0.5)"}`,
        }}
      >
        <div className="relative flex items-center justify-between h-[4.75rem] pl-7 pr-5">

          {/* Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/awi-logo.png"
              alt="Africa Web3 Institute logo"
              style={{ height: "46px", width: "auto", objectFit: "contain" }}
            />
            <span className="font-bold text-[0.9375rem] leading-tight" style={{ color: "#111827" }}>
              Africa Web3<br className="hidden sm:block" /> Institute
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">

            {/* Home */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[0.9375rem] font-semibold transition-colors"
              style={{ color: isActive("/") ? "#D4A017" : "#111827" }}
            >
              {T.home}
            </Link>

            {/* About */}
            <Link
              to="/about"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[0.9375rem] font-semibold transition-colors"
              style={{ color: isActive("/about") ? "#D4A017" : "#111827" }}
            >
              {language === "fr" ? "À Propos" : "About"}
            </Link>

            {/* Intelligence dropdown */}
            <button
              onClick={() => setActiveDropdown(activeDropdown === "intelligence" ? null : "intelligence")}
              className="flex items-center gap-1 text-[0.9375rem] font-semibold transition-colors"
              style={{
                color: ["awpii", "country-tracker", "enforcement-watch", "stablecoin-tracker", "publications", "intelligence"].some(p => location.pathname.includes(p)) ? "#D4A017" : "#111827"
              }}
            >
              {language === "fr" ? "Intelligence" : "Intelligence"}
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: activeDropdown === "intelligence" ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Programmes dropdown */}
            <button
              onClick={() => setActiveDropdown(activeDropdown === "programmes" ? null : "programmes")}
              className="flex items-center gap-1 text-[0.9375rem] font-semibold transition-colors"
              style={{
                color: ["/francophone-network", "/africa-blockchain-awards", "/capacity-building", "/indaba-series", "/events", "/programs-events"].includes(location.pathname) ? "#D4A017" : "#111827"
              }}
            >
              {T.programs}
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: activeDropdown === "programmes" ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Contact */}
            <button
              onClick={() => navigateTo("/contact")}
              className="text-[0.9375rem] font-semibold transition-colors"
              style={{ color: isActive("/contact") ? "#D4A017" : "#111827" }}
            >
              {T.contact}
            </button>
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-3.5 mr-1.5">
            {/* Media Kit */}
            <a
              href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/17d283477_MedaKit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Africa Web3 Institute Media Kit"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#111827" }}
            >
              <Download className="w-3.5 h-3.5" />
              {language === "fr" ? "Kit Média" : "Media Kit"}
            </a>

            {/* Language toggle */}
            <div className="flex items-center rounded-full overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
              <button
                onClick={() => setLanguage("en")}
                className="px-2.5 py-1.5 text-[0.6875rem] font-bold transition-colors"
                style={{ backgroundColor: language === "en" ? "#D4A017" : "transparent", color: language === "en" ? "#fff" : "#6B7280" }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className="px-2.5 py-1.5 text-[0.6875rem] font-bold transition-colors"
                style={{ backgroundColor: language === "fr" ? "#D4A017" : "transparent", color: language === "fr" ? "#fff" : "#6B7280" }}
              >
                FR
              </button>
            </div>

            <Link
              to="/awpii"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
              style={{ backgroundColor: "#0B1437", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D4A017"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0B1437"}
            >
              {language === "fr" ? "Obtenir les rapports" : "Get Reports"}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex lg:hidden p-1.5 rounded mr-2"
            style={{ color: "#111827" }}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {activeDropdown === "intelligence" && (
            <MegaMenu sections={INTELLIGENCE_ITEMS} />
          )}
          {activeDropdown === "programmes" && (
            <MegaMenu sections={PROGRAMS_ITEMS} />
          )}
        </div>
      </div>

      {/* Mobile menu — floating rounded card */}
      {open && (
        <div
          className="lg:hidden max-w-[1600px] mx-auto overflow-hidden"
          style={{
            marginTop: 8,
            backgroundColor: "#fff",
            borderRadius: 20,
            boxShadow: "0 10px 32px rgba(11,20,55,0.14)",
            border: "1px solid #F0F1F3",
          }}
        >
          {/* Home */}
          <Link
            to="/"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: isActive("/") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {T.home}
          </Link>

          {/* About */}
          <Link
            to="/about"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: isActive("/about") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {language === "fr" ? "À Propos" : "About"}
          </Link>

          {/* Intelligence accordion */}
          <div className="border-b" style={{ borderColor: "#F3F4F6" }}>
            <button
              onClick={() => setMobileExpanded(mobileExpanded === "intelligence" ? null : "intelligence")}
              className="flex items-center justify-between w-full px-6 py-3.5 text-sm font-medium"
              style={{ color: "#374151" }}
            >
              <span>{language === "fr" ? "Intelligence" : "Intelligence"}</span>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: mobileExpanded === "intelligence" ? "rotate(180deg)" : "rotate(0deg)", color: "#9CA3AF" }}
              />
            </button>
            {mobileExpanded === "intelligence" && (
              <div className="pb-2" style={{ backgroundColor: "#F9FAFB" }}>
                {INTELLIGENCE_ITEMS.flatMap(s => s.items).map(item => (
                  <button
                    key={item.href}
                    onClick={() => navigateTo(item.href)}
                    className="flex items-center gap-3 w-full text-left px-8 py-3 text-sm"
                    style={{
                      color: isActive(item.href) ? "#D4A017" : "#374151",
                      borderLeft: isActive(item.href) ? "2px solid #D4A017" : "2px solid transparent",
                    }}
                  >
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Programs accordion */}
          <div className="border-b" style={{ borderColor: "#F3F4F6" }}>
            <button
              onClick={() => setMobileExpanded(mobileExpanded === "programs" ? null : "programs")}
              className="flex items-center justify-between w-full px-6 py-3.5 text-sm font-medium"
              style={{ color: "#374151" }}
            >
              <span>{T.programs}</span>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: mobileExpanded === "programs" ? "rotate(180deg)" : "rotate(0deg)", color: "#9CA3AF" }}
              />
            </button>
            {mobileExpanded === "programs" && (
              <div className="pb-2" style={{ backgroundColor: "#F9FAFB" }}>
                {PROGRAMS_ITEMS.flatMap(s => s.items).map(item => (
                  <button
                    key={item.href}
                    onClick={() => navigateTo(item.href)}
                    className="flex items-center gap-3 w-full text-left px-8 py-3 text-sm"
                    style={{
                      color: isActive(item.href) ? "#D4A017" : "#374151",
                      borderLeft: isActive(item.href) ? "2px solid #D4A017" : "2px solid transparent",
                    }}
                  >
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center w-full px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: isActive("/contact") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {T.contact}
          </Link>

          {/* Media Kit */}
          <a
            href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/17d283477_MedaKit.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: "#374151", borderColor: "#F3F4F6" }}
          >
            <Download className="w-4 h-4" style={{ color: "#D4A017" }} />
            {language === "fr" ? "Kit Média" : "Media Kit"}
          </a>

          {/* Get Reports */}
          <div className="px-6 py-4">
            <Link
              to="/awpii"
              onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center justify-center w-full text-sm font-semibold px-5 py-2.5 rounded-md"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
            >
              {language === "fr" ? "Obtenir les rapports" : "Get Reports"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
