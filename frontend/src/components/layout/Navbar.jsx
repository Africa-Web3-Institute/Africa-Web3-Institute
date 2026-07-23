import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Download, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import { useNavDropdown } from "../../lib/NavDropdownContext";

// ─── Paths for highlighting active dropdowns ────────────────────────────────
const ABOUT_PATHS = ["/about", "/team", "/board"];
const INTELLIGENCE_PATHS = [
  "awpii",
  "country-tracker",
  "enforcement-watch",
  "stablecoin-tracker",
  "publications",
  "intelligence",
];
const PROGRAMS_PATHS = [
  "/francophone-network",
  "/africa-blockchain-awards",
  "/capacity-building",
  "/indaba-series",
  "/events",
  "/programs-events",
];

const getLabel = (language, en, fr) => (language === "fr" ? fr : en);

// ─── Dropdown content builders ──────────────────────────────────────────────

const getAboutItems = (language) => [
  {
    section: getLabel(language, "About Us", "À Propos"),
    items: [
      {
        label: getLabel(language, "Our Story", "Notre Histoire"),
        desc: getLabel(
          language,
          "Who we are and what we stand for",
          "Qui nous sommes et nos valeurs"
        ),
        href: "/about",
      },
      {
        label: getLabel(language, "Board", "Conseil d'Administration"),
        desc: getLabel(
          language,
          "Our board of directors and advisors",
          "Notre conseil d'administration et conseillers"
        ),
        href: "/board",
      },
      {
        label: getLabel(language, "Meet the Team", "Rencontrer l'Équipe"),
        desc: getLabel(
          language,
          "Our people driving the vision",
          "Les personnes qui portent la vision"
        ),
        href: "/team",
      },
    ],
  },
];

const getIntelligenceItems = (language) => [
  {
    section: getLabel(language, "Indexes & Data", "Indices & Données"),
    items: [
      {
        label: "AWPII",
        desc: getLabel(
          language,
          "Africa Web3 Policy & Innovation Index",
          "Indice Africain des Politiques & de l'Innovation Web3"
        ),
        href: "/awpii",
      },
      {
        label: getLabel(language, "Regulatory Tracker", "Suivi Réglementaire"),
        desc: getLabel(
          language,
          "Live regulatory updates across 18+ African nations",
          "Mises à jour réglementaires en temps réel sur 18+ nations"
        ),
        href: "/country-tracker",
      },
      {
        label: getLabel(language, "Stablecoin Tracker", "Suivi Stablecoin"),
        desc: getLabel(
          language,
          "Stablecoin regulatory frameworks across 200+ countries",
          "Cadres réglementaires des stablecoins dans 200+ pays"
        ),
        href: "/stablecoin-tracker",
      },
      {
        label: getLabel(language, "Enforcement Watch", "Surveillance des Sanctions"),
        desc: getLabel(
          language,
          "Track regulatory crackdowns and enforcement actions",
          "Suivre les répressions réglementaires et actions coercitives"
        ),
        href: "/enforcement-watch",
      },
    ],
  },
  {
    section: getLabel(language, "Research & Publications", "Recherche & Publications"),
    items: [
      {
        label: getLabel(language, "Publications", "Publications"),
        desc: getLabel(
          language,
          "Policy briefs, research reports, and market analysis",
          "Notes de politique, rapports de recherche et analyses de marché"
        ),
        href: "/publications",
      },
    ],
  },
];

const getProgramsItems = (language) => [
  {
    section: getLabel(language, "Networks & Community", "Réseaux & Communauté"),
    items: [
      {
        label: getLabel(
          language,
          "Francophone Web3 & Students Network",
          "Réseau des Étudiants Francophones Web3"
        ),
        desc: getLabel(
          language,
          "Connecting French-speaking African Web3 students",
          "Connecter les étudiants africains francophones dans le Web3"
        ),
        href: "/francophone-network",
      },
    ],
  },
  {
    section: getLabel(language, "Education & Training", "Éducation & Formation"),
    items: [
      {
        label: getLabel(language, "Capacity Building", "Renforcement des Capacités"),
        desc: getLabel(
          language,
          "Training for governments, financial institutions, and the private sector",
          "Formation pour gouvernements, institutions financières et secteur privé"
        ),
        href: "/capacity-building",
      },
    ],
  },
  {
    section: getLabel(language, "Recognition", "Reconnaissance"),
    items: [
      {
        label: "Africa Blockchain Awards",
        desc: getLabel(
          language,
          "The continent's premier blockchain recognition platform",
          "La plateforme de reconnaissance blockchain de référence du continent"
        ),
        href: "/africa-blockchain-awards",
      },
    ],
  },
  {
    section: getLabel(language, "Policy Engagement", "Engagement Politique"),
    items: [
      {
        label: "The Indaba Series",
        desc: getLabel(
          language,
          "AWI's flagship policy engagement programme",
          "Le programme phare d'engagement politique de l'AWI"
        ),
        href: "/indaba-series",
      },
    ],
  },
  {
    section: getLabel(language, "Events", "Événements"),
    items: [
      {
        label: getLabel(language, "Events & Convenings", "Événements & Rencontres"),
        desc: getLabel(
          language,
          "Policy summits, workshops, and campus activations",
          "Sommets politiques, ateliers et activations universitaires"
        ),
        href: "/events",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isPartialPath = (pathname, paths, contains = false) =>
  paths.some((path) => (contains ? pathname.includes(path) : pathname === path));

// ─── Vertical dropdown (shared pattern) ─────────────────────────────────────

const VerticalDropdownMenu = ({ sections, navigateTo, isActive }) => {
  const flatItems = sections.flatMap((section) => section.items);
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #EEF0F3",
        boxShadow: "0 20px 45px rgba(11,20,55,0.18), 0 4px 12px rgba(11,20,55,0.06)",
        zIndex: 100,
        minWidth: 220,
        width: "max-content",
        maxWidth: "min(360px, 92vw)",
        transformOrigin: "top center",
        animation: "vDropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes vDropdownIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.96); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes vItemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Accent header strip */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #D4A017, #E8C266, #D4A017)" }} />

      <div className="flex flex-col p-2.5">
        {flatItems.map((item, i) => {
          const active = isActive(item.href);
          return (
            <div key={item.href} style={{ animation: `vItemIn 0.22s ease ${i * 0.05}s both` }}>
              {i > 0 && (
                <div
                  className="-mx-2.5"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(212,160,23,0) 0%, rgba(212,160,23,0.65) 14%, rgba(212,160,23,0.65) 86%, rgba(212,160,23,0) 100%)",
                  }}
                />
              )}
              <button
                onClick={() => navigateTo(item.href)}
                className="group flex items-center gap-3 w-full text-left rounded-xl px-3.5 py-2.5 text-[0.875rem] font-semibold whitespace-nowrap transition-all duration-150"
                style={{
                  color: active ? "#D4A017" : "#111827",
                  backgroundColor: active ? "rgba(212,160,23,0.08)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "#F8F9FB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = active ? "rgba(212,160,23,0.08)" : "transparent";
                }}
              >
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-all duration-150 ${
                    active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                  style={{ color: active ? "#D4A017" : "#9CA3AF" }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Reusable UI pieces ──────────────────────────────────────────────────────

const DesktopDropdownButton = ({ active, label, expanded, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-[0.9375rem] font-semibold transition-colors"
    style={{ color: active ? "#D4A017" : "#111827" }}
  >
    {label}
    <ChevronDown
      className="w-4 h-4 transition-transform"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
    />
  </button>
);

const MobileMenuLink = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full text-left px-8 py-3 text-sm"
    style={{
      color: active ? "#D4A017" : "#374151",
      borderLeft: active ? "2px solid #D4A017" : "2px solid transparent",
    }}
  >
    <span className="font-medium">{label}</span>
  </button>
);

const MobileAccordion = ({ label, expanded, onToggle, sections, navigateTo, isActive }) => (
  <div className="border-b" style={{ borderColor: "#F3F4F6" }}>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-6 py-3.5 text-sm font-medium"
      style={{ color: "#374151" }}
    >
      <span>{label}</span>
      <ChevronDown
        className="w-4 h-4 transition-transform"
        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", color: "#9CA3AF" }}
      />
    </button>
    {expanded && (
      <div className="pb-2" style={{ backgroundColor: "#F9FAFB" }}>
        {sections.flatMap((section) => section.items).map((item) => (
          <MobileMenuLink
            key={item.href}
            label={item.label}
            active={isActive(item.href)}
            onClick={() => navigateTo(item.href)}
          />
        ))}
      </div>
    )}
  </div>
);

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { activeDropdown, setActiveDropdown } = useNavDropdown();
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const T = t[language].nav;
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownCloseTimer = useRef(null);

  const openDropdownOnHover = (name) => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
      dropdownCloseTimer.current = null;
    }
    setActiveDropdown(name);
  };

  const closeDropdownOnHover = (name) => {
    dropdownCloseTimer.current = setTimeout(() => {
      setActiveDropdown((current) => (current === name ? null : current));
    }, 150);
  };

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    };
  }, []);

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

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const navigateTo = (href) => {
    setOpen(false);
    setActiveDropdown(null);
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (href) => location.pathname === href;

  // Dropdown data
  const aboutItems = getAboutItems(language);
  const intelligenceItems = getIntelligenceItems(language);
  const programsItems = getProgramsItems(language);

  // Active states
  const aboutActive = isPartialPath(location.pathname, ABOUT_PATHS, false);
  const intelligenceActive = isPartialPath(location.pathname, INTELLIGENCE_PATHS, true);
  const programsActive = isPartialPath(location.pathname, PROGRAMS_PATHS, true);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50" style={{ padding: "12px 12px 0" }}>
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
        <div className="relative flex items-center justify-between h-[4rem] sm:h-[4.75rem] pl-4 sm:pl-7 pr-3 sm:pr-5">
          {/* Logo */}
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
            <span className="hidden sm:inline font-bold text-[0.9375rem] leading-tight" style={{ color: "#111827" }}>
              Africa Web3<br className="hidden sm:block" /> Institute
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[0.9375rem] font-semibold transition-colors"
              style={{ color: isActive("/") ? "#D4A017" : "#111827" }}
            >
              {T.home}
            </Link>

            {/* About dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdownOnHover("about")}
              onMouseLeave={() => closeDropdownOnHover("about")}
            >
              <DesktopDropdownButton
                active={aboutActive}
                expanded={activeDropdown === "about"}
                label={getLabel(language, "About", "À Propos")}
                onClick={() => setActiveDropdown(activeDropdown === "about" ? null : "about")}
              />
              {activeDropdown === "about" && (
                <VerticalDropdownMenu sections={aboutItems} navigateTo={navigateTo} isActive={isActive} />
              )}
            </div>

            {/* Intelligence dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdownOnHover("intelligence")}
              onMouseLeave={() => closeDropdownOnHover("intelligence")}
            >
              <DesktopDropdownButton
                active={intelligenceActive}
                expanded={activeDropdown === "intelligence"}
                label={getLabel(language, "Intelligence", "Intelligence")}
                onClick={() => setActiveDropdown(activeDropdown === "intelligence" ? null : "intelligence")}
              />
              {activeDropdown === "intelligence" && (
                <VerticalDropdownMenu sections={intelligenceItems} navigateTo={navigateTo} isActive={isActive} />
              )}
            </div>

            {/* Programs dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdownOnHover("programmes")}
              onMouseLeave={() => closeDropdownOnHover("programmes")}
            >
              <DesktopDropdownButton
                active={programsActive}
                expanded={activeDropdown === "programmes"}
                label={T.programs}
                onClick={() => setActiveDropdown(activeDropdown === "programmes" ? null : "programmes")}
              />
              {activeDropdown === "programmes" && (
                <VerticalDropdownMenu sections={programsItems} navigateTo={navigateTo} isActive={isActive} />
              )}
            </div>

            <button
              onClick={() => navigateTo("/contact")}
              className="text-[0.9375rem] font-semibold transition-colors"
              style={{ color: isActive("/contact") ? "#D4A017" : "#111827" }}
            >
              {T.contact}
            </button>
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-3.5 mr-1.5">
            <a
             href="/AWI_Media_Kit_2026.pdf"
  target="_blank"
  rel="noopener noreferrer"
  title="Africa Web3 Institute Media Kit"
  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
  style={{ color: "#111827" }}
>
  <Download className="w-3.5 h-3.5" />
  {getLabel(language, "Media Kit", "Kit Média")}
</a>
            

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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D4A017")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B1437")}
            >
              {getLabel(language, "Get Reports", "Obtenir les rapports")}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex lg:hidden p-1.5 rounded mr-2"
            style={{ color: "#111827" }}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
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
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: isActive("/") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {T.home}
          </Link>

          {/* Mobile About accordion */}
          <MobileAccordion
            label={getLabel(language, "About", "À Propos")}
            expanded={mobileExpanded === "about"}
            onToggle={() => setMobileExpanded(mobileExpanded === "about" ? null : "about")}
            sections={aboutItems}
            navigateTo={navigateTo}
            isActive={isActive}
          />

          {/* Mobile Intelligence accordion */}
          <MobileAccordion
            label={getLabel(language, "Intelligence", "Intelligence")}
            expanded={mobileExpanded === "intelligence"}
            onToggle={() => setMobileExpanded(mobileExpanded === "intelligence" ? null : "intelligence")}
            sections={intelligenceItems}
            navigateTo={navigateTo}
            isActive={isActive}
          />

          {/* Mobile Programs accordion */}
          <MobileAccordion
            label={T.programs}
            expanded={mobileExpanded === "programs"}
            onToggle={() => setMobileExpanded(mobileExpanded === "programs" ? null : "programs")}
            sections={programsItems}
            navigateTo={navigateTo}
            isActive={isActive}
          />

          <Link
            to="/contact"
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center w-full px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: isActive("/contact") ? "#D4A017" : "#374151", borderColor: "#F3F4F6" }}
          >
            {T.contact}
          </Link>

          <a
            href="https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/17d283477_MedaKit.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b"
            style={{ color: "#374151", borderColor: "#F3F4F6" }}
          >
            <Download className="w-4 h-4" style={{ color: "#D4A017" }} />
            {getLabel(language, "Media Kit", "Kit Média")}
          </a>

          <div className="px-6 py-4">
            <Link
              to="/awpii"
              onClick={() => {
                setOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center justify-center w-full text-sm font-semibold px-5 py-2.5 rounded-md"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
            >
              {getLabel(language, "Get Reports", "Obtenir les rapports")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}