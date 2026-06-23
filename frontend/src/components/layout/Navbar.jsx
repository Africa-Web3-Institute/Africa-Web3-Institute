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
  const isHome = location.pathname === "/";
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

  const scrollTo = (id) => {
    setOpen(false);
    setActiveDropdown(null);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        if (id === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }
    if (id === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navigateTo = (href) => {
    setOpen(false);
    setActiveDropdown(null);
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSection = (path, id) => {
    setOpen(false);
    setActiveDropdown(null);
    navigate(path);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const isActive = (href) => location.pathname === href;

  const INTELLIGENCE_ITEMS = [
    {
      section: language === "fr" ? "Indices & Données" : "Indexes & Data",
      items: [
        { label: "AWPII", desc: language === "fr" ? "Indice Africain des Politiques & de l'Innovation Web3" : "Africa Web3 Policy & Innovation Index", href: "/awpii", icon: "🗺️" },
        { label: language === "fr" ? "Suivi Réglementaire" : "Regulatory Tracker", desc: language === "fr" ? "Mises à jour réglementaires en temps réel sur 18+ nations" : "Live regulatory updates across 18+ African nations", href: "/country-tracker", icon: "📊" },
          // ✅ New item for Stablecoin Tracker
      { label: language === "fr" ? "Suivi Stablecoin" : "Stablecoin Tracker", desc: language === "fr" ? "Cadres réglementaires des stablecoins dans 200+ pays" : "Stablecoin regulatory frameworks across 200+ countries", href: "/stablecoin-tracker", icon: "🪙" },

        { label: language === "fr" ? "Surveillance des Sanctions" : "Enforcement Watch", desc: language === "fr" ? "Suivre les répressions réglementaires et actions coercitives" : "Track regulatory crackdowns and enforcement actions", href: "/enforcement-watch", icon: "⚖️" },
        //{ label: language === "fr" ? "Flux de Données Live" : "Live Data Blueprint", desc: language === "fr" ? "Visualisation de l'ingestion de télémétrie en temps réel" : "Real-time telemetry ingestion and pipeline blueprint", href: "/analytics", icon: "⚡" },
      ],
    },


    {
      section: language === "fr" ? "Recherche & Publications" : "Research & Publications",
      items: [
        { label: language === "fr" ? "Publications" : "Publications", desc: language === "fr" ? "Notes de politique, rapports de recherche et analyses de marché" : "Policy briefs, research reports, and market analysis", href: "/publications", icon: "📄" },
      ],
    },
  ];

  const PROGRAMS_ITEMS = [
    {
      section: language === "fr" ? "Réseaux & Communauté" : "Networks & Community",
      items: [
        { label: language === "fr" ? "Réseau des Étudiants Francophones Web3" : "Francophone Web3 & Students Network", desc: language === "fr" ? "Connecter les étudiants africains francophones dans le Web3" : "Connecting French-speaking African Web3 students", href: "/francophone-network", icon: "🌍" },
      ],
    },
    {
      section: language === "fr" ? "Éducation & Formation" : "Education & Training",
      items: [
        { label: language === "fr" ? "Renforcement des Capacités" : "Capacity Building", desc: language === "fr" ? "Formation pour gouvernements, institutions financières et secteur privé" : "Training for governments, financial institutions, and the private sector", href: "/capacity-building", icon: "📚" },
      ],
    },
    {
      section: language === "fr" ? "Reconnaissance" : "Recognition",
      items: [
        { label: language === "fr" ? "Africa Blockchain Awards" : "Africa Blockchain Awards", desc: language === "fr" ? "La plateforme de reconnaissance blockchain de référence du continent" : "The continent's premier blockchain recognition platform", href: "/africa-blockchain-awards", icon: "🏆" },
      ],
    },
    {
      section: language === "fr" ? "Engagement Politique" : "Policy Engagement",
      items: [
        { label: "The Indaba Series", desc: language === "fr" ? "Le programme phare d'engagement politique de l'AWI" : "AWI's flagship policy engagement programme", href: "/indaba-series", icon: "🗣️" },
      ],
    },
    {
      section: language === "fr" ? "Événements" : "Events",
      items: [
        { label: language === "fr" ? "Événements & Rencontres" : "Events & Convenings", desc: language === "fr" ? "Sommets politiques, ateliers et activations universitaires" : "Policy summits, workshops, and campus activations", href: "#events", isScroll: true, icon: "📅" },
      ],
    },
  ];

  const DropdownMenu = ({ sections }) => (
    <div
      className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        minWidth: "300px",
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
      {sections.map((section, si) => (
        <div key={si} className={si > 0 ? "border-t border-gray-100" : ""}>
          <p className="px-4 pt-3 pb-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase"
            style={{ color: "#D4A017" }}>
            {section.section}
          </p>
          {section.items.map((item) => (
            <button
              key={item.href}
              onClick={() => item.isScroll ? scrollTo(item.href) : navigateTo(item.href)}
              className="w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors"
              style={{
                backgroundColor: isActive(item.href) ? "rgba(212,160,23,0.06)" : "transparent",
                borderLeft: isActive(item.href) ? "2px solid #D4A017" : "2px solid transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(11,20,55,0.04)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = isActive(item.href) ? "rgba(212,160,23,0.06)" : "transparent"}
            >
              <span className="text-[1rem] mt-0.5 shrink-0">{item.icon}</span>
              <div>
                <p className="text-[0.8125rem] font-semibold leading-snug"
                  style={{ color: isActive(item.href) ? "#D4A017" : "#111827" }}>
                  {item.label}
                </p>
                <p className="text-[0.6875rem] leading-snug mt-0.5" style={{ color: "#9CA3AF" }}>
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
          {si < sections.length - 1 && <div className="pb-2" />}
        </div>
      ))}
      <div className="pb-2" />
    </div>
  );

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: "#fff",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid #F3F4F6",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[3.75rem]">

          {/* Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/awi-logo.png"
              alt="Africa Web3 Institute logo"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
            <span className="font-bold text-[0.875rem] leading-tight" style={{ color: "#111827" }}>
              Africa Web3<br className="hidden sm:block" /> Institute
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">

            {/* About */}
            <Link
              to="/about"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[0.8125rem] font-medium transition-colors"
              style={{ color: isActive("/about") ? "#D4A017" : "#374151" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = isActive("/about") ? "#D4A017" : "#374151"}
            >
              {language === "fr" ? "À Propos" : "About"}
            </Link>

            {/* Team */}
            <button
              onClick={() => navigateToSection("/about", "team")}
              className="text-[0.8125rem] font-medium transition-colors"
              style={{ color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = "#374151"}
            >
              {language === "fr" ? "Équipe" : "Team"}
            </button>

            {/* Intelligence dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "intelligence" ? null : "intelligence")}
                className="flex items-center gap-1 text-[0.8125rem] font-medium transition-colors"
                style={{
                  color: ["awpii", "country-tracker", "enforcement-watch","stablecoin-tracker", "publications"].some(p => location.pathname.includes(p)) ? "#D4A017" : "#374151"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#111827"}
                onMouseLeave={e => e.currentTarget.style.color = ["awpii", "country-tracker", "enforcement-watch", "publications"].some(p => location.pathname.includes(p)) ? "#D4A017" : "#374151"}
              >
                {language === "fr" ? "Intelligence" : "Intelligence"}
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: activeDropdown === "intelligence" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {activeDropdown === "intelligence" && (
                <DropdownMenu sections={INTELLIGENCE_ITEMS} />
              )}
            </div>

            {/* Programmes dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "programmes" ? null : "programmes")}
                className="flex items-center gap-1 text-[0.8125rem] font-medium transition-colors"
                style={{
                  color: ["/francophone-network", "/africa-blockchain-awards", "/capacity-building", "/indaba-series"].includes(location.pathname) ? "#D4A017" : "#374151"
                                   }}
                                   onMouseEnter={e => e.currentTarget.style.color = "#111827"}
                                   onMouseLeave={e => e.currentTarget.style.color = ["/francophone-network", "/africa-blockchain-awards", "/capacity-building", "/indaba-series"].includes(location.pathname) ? "#D4A017" : "#374151"}
              >
                {language === "fr" ? "Programmes" : "Programmes"}
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: activeDropdown === "programmes" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {activeDropdown === "programmes" && (
                <DropdownMenu sections={PROGRAMS_ITEMS} />
              )}
            </div>

            {/* Community */}
            <button
              onClick={() => scrollTo("#community")}
              className="text-[0.8125rem] font-medium transition-colors"
              style={{ color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = "#374151"}
            >
              {language === "fr" ? "Communauté" : "Community"}
            </button>

            {/* Contact */}
            <button
              onClick={() => scrollTo("#contact")}
              className="text-[0.8125rem] font-medium transition-colors"
              style={{ color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = "#374151"}
            >
              {language === "fr" ? "Contact" : "Contact"}
            </button>

            {/* Media Kit */}
            <a
              href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/17d283477_MedaKit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Africa Web3 Institute Media Kit"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium transition-colors"
              style={{ color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111827"}
              onMouseLeave={e => e.currentTarget.style.color = "#374151"}
            >
              <Download className="w-3 h-3" />
              {language === "fr" ? "Kit Média" : "Media Kit"}
            </a>
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center rounded-md overflow-hidden text-[0.6875rem] font-bold border" style={{ borderColor: "#E5E7EB" }}>
              <button
                onClick={() => setLanguage("en")}
                className="px-2.5 py-1.5 transition-colors"
                style={{ backgroundColor: language === "en" ? "#D4A017" : "transparent", color: language === "en" ? "#fff" : "#6B7280" }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className="px-2.5 py-1.5 transition-colors"
                style={{ backgroundColor: language === "fr" ? "#D4A017" : "transparent", color: language === "fr" ? "#fff" : "#6B7280" }}
              >
                FR
              </button>
            </div>

            <Link
              to="/awpii"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[0.75rem] font-semibold px-3.5 py-1.5 rounded-md transition-all"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {language === "fr" ? "Obtenir les rapports" : "Get Reports"}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center rounded overflow-hidden text-[0.65rem] font-bold border" style={{ borderColor: "#E5E7EB" }}>
              <button
                onClick={() => setLanguage("en")}
                className="px-2 py-1 transition-colors"
                style={{ backgroundColor: language === "en" ? "#D4A017" : "transparent", color: language === "en" ? "#fff" : "#9CA3AF" }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className="px-2 py-1 transition-colors"
                style={{ backgroundColor: language === "fr" ? "#D4A017" : "transparent", color: language === "fr" ? "#fff" : "#9CA3AF" }}
              >
                FR
              </button>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded"
              style={{ color: "#374151" }}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t" style={{ backgroundColor: "#fff", borderColor: "#F3F4F6" }}>

          {/* About */}
          <Link
            to="/about"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center px-6 py-3.5 text-[0.875rem] font-medium border-b"
            style={{ color: isActive("/about") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {language === "fr" ? "À Propos" : "About"}
          </Link>

          {/* Team */}
          <button
            onClick={() => navigateToSection("/about", "team")}
            className="flex items-center px-6 py-3.5 text-[0.875rem] font-medium border-b w-full text-left"
            style={{ color: "#374151", borderColor: "#F3F4F6" }}
          >
            👥 {language === "fr" ? "Équipe" : "Team"}
          </button>

          {/* Intelligence accordion */}
          <div className="border-b" style={{ borderColor: "#F3F4F6" }}>
            <button
              onClick={() => setMobileExpanded(mobileExpanded === "intelligence" ? null : "intelligence")}
              className="flex items-center justify-between w-full px-6 py-3.5 text-[0.875rem] font-medium"
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
                    onClick={() => item.isScroll ? scrollTo(item.href) : navigateTo(item.href)}
                    className="flex items-center gap-3 w-full text-left px-8 py-3 text-[0.875rem]"
                    style={{
                      color: isActive(item.href) ? "#D4A017" : "#374151",
                      borderLeft: isActive(item.href) ? "2px solid #D4A017" : "2px solid transparent",
                    }}
                  >
                    <span>{item.icon}</span>
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
              className="flex items-center justify-between w-full px-6 py-3.5 text-[0.875rem] font-medium"
              style={{ color: "#374151" }}
            >
              <span>{language === "fr" ? "Programmes" : "Programs"}</span>
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
                    onClick={() => item.isScroll ? scrollTo(item.href) : navigateTo(item.href)}
                    className="flex items-center gap-3 w-full text-left px-8 py-3 text-[0.875rem]"
                    style={{
                      color: isActive(item.href) ? "#D4A017" : "#374151",
                      borderLeft: isActive(item.href) ? "2px solid #D4A017" : "2px solid transparent",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Community */}
          <button
            onClick={() => scrollTo("#community")}
            className="flex items-center w-full px-6 py-3.5 text-[0.875rem] font-medium border-b"
            style={{ color: "#374151", borderColor: "#F3F4F6" }}
          >
            {language === "fr" ? "Communauté" : "Community"}
          </button>

          {/* Contact */}
          <button
            onClick={() => scrollTo("#contact")}
            className="flex items-center w-full px-6 py-3.5 text-[0.875rem] font-medium border-b"
            style={{ color: "#374151", borderColor: "#F3F4F6" }}
          >
            {language === "fr" ? "Contact" : "Contact"}
          </button>

          {/* Media Kit */}
          <a
            href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/17d283477_MedaKit.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-6 py-3.5 text-[0.875rem] font-medium border-b"
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
              className="flex items-center justify-center w-full text-[0.875rem] font-semibold px-5 py-2.5 rounded-md"
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