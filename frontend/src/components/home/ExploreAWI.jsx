import  { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  Users, 
  Mail, 
  Globe,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

const ExploreAWI = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Intelligence items from your navbar
  const INTELLIGENCE_ITEMS = [
    {
      section: language === "fr" ? "Indices & Données" : "Indexes & Data",
      items: [
        { 
          label: "AWPII", 
          desc: language === "fr" ? "Indice Africain des Politiques & de l'Innovation Web3" : "Africa Web3 Policy & Innovation Index", 
          href: "/awpii", 
          icon: "🗺️" 
        },
        { 
          label: language === "fr" ? "Suivi Réglementaire" : "Regulatory Tracker", 
          desc: language === "fr" ? "Mises à jour réglementaires en temps réel sur 18+ nations" : "Live regulatory updates across 18+ African nations", 
          href: "/country-tracker", 
          icon: "📊" 
        },
        { 
          label: language === "fr" ? "Suivi Stablecoin" : "Stablecoin Tracker", 
          desc: language === "fr" ? "Cadres réglementaires des stablecoins dans 200+ pays" : "Stablecoin regulatory frameworks across 200+ countries", 
          href: "/stablecoin-tracker", 
          icon: "🪙" 
        },
        { 
          label: language === "fr" ? "Surveillance des Sanctions" : "Enforcement Watch", 
          desc: language === "fr" ? "Suivre les répressions réglementaires et actions coercitives" : "Track regulatory crackdowns and enforcement actions", 
          href: "/enforcement-watch", 
          icon: "⚖️" 
        },
      ],
    },
    {
      section: language === "fr" ? "Recherche & Publications" : "Research & Publications",
      items: [
        { 
          label: language === "fr" ? "Publications" : "Publications", 
          desc: language === "fr" ? "Notes de politique, rapports de recherche et analyses de marché" : "Policy briefs, research reports, and market analysis", 
          href: "/publications", 
          icon: "📄" 
        },
      ],
    },
  ];

  // Programs items from your navbar
  const PROGRAMS_ITEMS = [
    {
      section: language === "fr" ? "Réseaux & Communauté" : "Networks & Community",
      items: [
        { 
          label: language === "fr" ? "Réseau des Étudiants Francophones Web3" : "Francophone Web3 & Students Network", 
          desc: language === "fr" ? "Connecter les étudiants africains francophones dans le Web3" : "Connecting French-speaking African Web3 students", 
          href: "/francophone-network", 
          icon: "🌍" 
        },
      ],
    },
    {
      section: language === "fr" ? "Éducation & Formation" : "Education & Training",
      items: [
        { 
          label: language === "fr" ? "Renforcement des Capacités" : "Capacity Building", 
          desc: language === "fr" ? "Formation pour gouvernements, institutions financières et secteur privé" : "Training for governments, financial institutions, and the private sector", 
          href: "/capacity-building", 
          icon: "📚" 
        },
      ],
    },
    {
      section: language === "fr" ? "Reconnaissance" : "Recognition",
      items: [
        { 
          label: language === "fr" ? "Africa Blockchain Awards" : "Africa Blockchain Awards", 
          desc: language === "fr" ? "La plateforme de reconnaissance blockchain de référence du continent" : "The continent's premier blockchain recognition platform", 
          href: "/africa-blockchain-awards", 
          icon: "🏆" 
        },
      ],
    },
    {
      section: language === "fr" ? "Engagement Politique" : "Policy Engagement",
      items: [
        { 
          label: "The Indaba Series", 
          desc: language === "fr" ? "Le programme phare d'engagement politique de l'AWI" : "AWI's flagship policy engagement programme", 
          href: "/indaba-series", 
          icon: "🗣️" 
        },
      ],
    },
    {
      section: language === "fr" ? "Événements" : "Events",
      items: [
        { 
          label: language === "fr" ? "Événements & Rencontres" : "Events & Convenings", 
          desc: language === "fr" ? "Sommets politiques, ateliers et activations universitaires" : "Policy summits, workshops, and campus activations", 
          href: "#events", 
          isScroll: true, 
          icon: "📅" 
        },
      ],
    },
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (href, isScroll = false) => {
    setOpenDropdown(null);
    if (isScroll) {
      navigate('/');
      setTimeout(() => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Dropdown Component
  const DropdownContent = ({ items, title }) => (
    <div 
      className="absolute top-full left-0 mt-2 rounded-lg overflow-hidden z-20"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        minWidth: '320px',
        maxWidth: '400px',
        animation: 'dropdownSlideIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes dropdownSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: '#D4A017' }}>
          {title}
        </p>
      </div>
      {items.map((section, idx) => (
        <div key={idx} className={idx > 0 ? "border-t border-gray-100" : ""}>
          <p className="px-4 pt-3 pb-1 text-[0.6rem] font-bold tracking-[0.15em] uppercase text-gray-400">
            {section.section}
          </p>
          {section.items.map((item, itemIdx) => (
            <button
              key={itemIdx}
              onClick={() => handleNavigation(item.href, item.isScroll)}
              className="w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors hover:bg-gray-50"
            >
              <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  const quickLinks = [
    {
      title: language === 'fr' ? 'À Propos d\'AWI' : 'About AWI',
      description: language === 'fr'
        ? 'Qui nous sommes, notre mission, vision, nos piliers et l\'équipe qui conduit la transformation numérique de l\'Afrique.'
        : 'Who we are, our mission, vision, our pillars and the team driving Africa\'s digital transformation.',
      icon: Users,
      link: '/about',
      linkText: language === 'fr' ? 'En Savoir Plus →' : 'Learn About AWI →'
    },
    {
      title: language === 'fr' ? 'Partenariats' : 'Partnerships',
      description: language === 'fr'
        ? 'Collaborer avec AWI sur la recherche, les programmes et les initiatives qui façonnent l\'avenir numérique de l\'Afrique.'
        : 'Collaborate with AWI on research, programmes, and initiatives that shape Africa\'s digital future.',
      icon: Globe,
      link: '/contact',
      linkText: language === 'fr' ? 'S\'impliquer →' : 'Get Involved →'
    },
   
  ];

  return (
    <section id="programs" className="py-24 lg:py-36 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#D4A017' }}>
            {language === 'fr' ? 'Explorer AWI' : 'Explore AWI'}
          </p>
          <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug">
            {language === 'fr' ? 'Naviguez dans nos domaines d\'intervention clés' : 'Navigate our core areas of work'}
          </h2>
        </div>

        {/* Main grid - Intelligence & Programs with dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" ref={dropdownRef}>
          {/* Intelligence Card */}
          <div className="relative">
            <div 
              className="group p-8 border border-gray-200 hover:border-[#D4A017] transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => toggleDropdown('intelligence')}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-[#0B1437] transition-colors duration-300">
                  <Brain className="w-6 h-6 text-[#D4A017]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {language === 'fr' ? 'Intelligence' : 'Intelligence'}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === 'intelligence' ? 'rotate-180' : ''
                      }`}
                      style={{ color: '#D4A017' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {language === 'fr' 
                      ? 'Documents de recherche, rapports, l\'Indice Africain Web3 et trackers réglementaires - les actifs de connaissance essentiels d\'AWI.'
                      : 'Research papers, reports, the Africa Web3 Index and regulatory trackers - AWI\'s core knowledge assets.'
                    }
                  </p>
                  <span className="text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200" style={{ color: '#D4A017' }}>
                    {language === 'fr' ? 'Explorer l\'Intelligence →' : 'Explore Intelligence →'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Intelligence Dropdown */}
            {openDropdown === 'intelligence' && (
              <DropdownContent 
                items={INTELLIGENCE_ITEMS} 
                title={language === 'fr' ? 'Intelligence' : 'Intelligence'}
              />
            )}
          </div>

          {/* Programs Card */}
          <div className="relative">
            <div 
              className="group p-8 border border-gray-200 hover:border-[#D4A017] transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => toggleDropdown('programs')}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-[#0B1437] transition-colors duration-300">
                  <Calendar className="w-6 h-6 text-[#D4A017]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {language === 'fr' ? 'Programmes & Événements' : 'Programs & Events'}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openDropdown === 'programs' ? 'rotate-180' : ''
                      }`}
                      style={{ color: '#D4A017' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {language === 'fr'
                      ? 'Renforcement des capacités, programmes d\'engagement politique, événements à venir et archive consultable des travaux passés.'
                      : 'Capacity building, policy engagement programmes, upcoming events and a searchable archive of past work.'
                    }
                  </p>
                  <span className="text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200" style={{ color: '#D4A017' }}>
                    {language === 'fr' ? 'Voir les Programmes & Événements →' : 'View Programs & Events →'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Programs Dropdown */}
            {openDropdown === 'programs' && (
              <DropdownContent 
                items={PROGRAMS_ITEMS} 
                title={language === 'fr' ? 'Programmes & Événements' : 'Programs & Events'}
              />
            )}
          </div>
        </div>

        {/* Bottom row - About, Partnerships, Get in Touch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((item, index) => {
            const Icon = item.icon;
            const isMainCard = index === 1; // Partnerships card
            return (
              <div 
                key={index}
                className={`p-8 border border-gray-200 transition-all duration-300 hover:shadow-lg group ${
                  isMainCard ? 'bg-[#0B1437] border-[#0B1437]' : 'bg-white hover:border-[#D4A017]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isMainCard ? 'bg-[#D4A017]/20' : 'bg-gray-50 group-hover:bg-[#0B1437]'
                  }`}>
                    <Icon className={`w-6 h-6 ${isMainCard ? 'text-[#D4A017]' : 'text-[#D4A017]'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${
                      isMainCard ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-3 ${
                      isMainCard ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                    <Link 
                      to={item.link}
                      className={`text-sm font-medium inline-flex items-center gap-1 transition-colors duration-200 ${
                        isMainCard ? 'text-[#D4A017] hover:text-white' : 'text-[#D4A017] hover:text-[#0B1437]'
                      }`}
                    >
                      {item.linkText}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreAWI;