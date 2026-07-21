// src/pages/About.js (or wherever your current About component lives)
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import { Globe, BookOpen, GraduationCap } from "lucide-react";
import Aerochain from "../assets/aerochain_logo.png"
 // not used here, but keep if needed elsewhere

const PILLAR_ICONS = [Globe, BookOpen, GraduationCap];
const PILLAR_KEYS = [
  { titleKey: "pillar1Title", descKey: "pillar1Desc" },
  { titleKey: "pillar2Title", descKey: "pillar2Desc" },
  { titleKey: "pillar3Title", descKey: "pillar3Desc" },
];

const PARTNERS = [
  {
    name: "Smart World Education",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/8e996d543_smartworldlogo1.png",
    url: "https://www.swedu.me/"
  },
  {
    name: "Decentrix Africa",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/9e8e906bc_IMG-20260530-WA00011.jpg",
    url: "https://decentrix.africa/"
  },
  {
    name: "Almstins",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/0e14ec7cc_IMG_20260610_145916_072.jpg",
    url: "https://almstins.com/login"
  },
  {
    name: "aerochainafrica",
    logo: Aerochain,
    url: "https://aerochainafrica.com"
  }
];

export default function About() {
  const { language } = useLanguage();
  const T = t[language].about;
  const PILLARS = PILLAR_KEYS.map(({ titleKey, descKey }, i) => ({
    icon: PILLAR_ICONS[i],
    title: T[titleKey],
    desc: T[descKey],
  }));

  const IMPACT_STATS = [
    { icon: "🌍", stat: "Fastest-growing", label: T.stat1 },
    { icon: "📱", stat: "12%+", label: T.stat2 },
    { icon: "💸", stat: "$48.2M", label: T.stat3 },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* WHO WE ARE */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
                {T.whoWeAreTitle}
              </p>
              <h2 className="text-[1.75rem] font-bold text-secondary leading-snug mb-5">
                {T.whoWeAreSubtitle}
              </h2>
              <p className="text-muted-foreground leading-[1.85] mb-4">{T.whoWeAreText}</p>
              <p className="text-muted-foreground leading-[1.85] mb-8">{T.whoWeAreText1}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: T.foundedYear, label: T.founded },
                  { value: T.countriesCount, label: T.countries },
                  { value: T.reportsCount, label: T.reports },
                  { value: T.membersCount, label: T.members },
                ].map((s) => (
                  <div key={s.label} className="p-4 border border-border">
                    <p className="text-[1.75rem] font-bold text-secondary">{s.value}</p>
                    <p className="text-[0.8125rem] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-4/3 overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                <img
                  src="https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png"
                  alt="Africa Web3 Institute team working on policy research"
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 hidden lg:block"
                style={{ border: "2px solid #D4A017", opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.missionTag}
            </p>
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.missionHeading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8" style={{ borderLeft: "4px solid #D4A017" }}>
              <p className="text-[1.5rem] mb-4">🎯</p>
              <h3 className="text-[1rem] font-bold text-secondary mb-3 uppercase tracking-wide">{T.missionTitle}</h3>
              <p className="text-muted-foreground leading-[1.85]">{T.missionText}</p>
            </div>
            <div className="bg-white p-8" style={{ borderLeft: "4px solid #D4A017" }}>
              <p className="text-[1.5rem] mb-4">🔭</p>
              <h3 className="text-[1rem] font-bold text-secondary mb-3 uppercase tracking-wide">{T.visionTitle}</h3>
              <p className="text-muted-foreground leading-[1.85]">{T.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.whatWeDoTitle}
            </p>
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.corePillars}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-5" style={{ backgroundColor: "#0B1437" }}>
                  <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
                </div>
                <h3 className="text-[1rem] font-bold text-secondary mb-3">{title}</h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="relative py-20 border-b border-border overflow-hidden" style={{ backgroundColor: "#0B1437" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,20,55,0.9)" }} />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.whyMattersTag}
            </p>
            <h2 className="text-[1.75rem] font-bold text-white">{T.whyMattersTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {IMPACT_STATS.map((s) => (
              <div key={s.label} className="p-8 text-center"
                style={{ border: "1px solid rgba(212,160,23,0.2)", background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[2rem] mb-3">{s.icon}</p>
                <p className="text-[1.75rem] font-bold mb-2" style={{ color: "#D4A017" }}>{s.stat}</p>
                <p className="text-[0.875rem]" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[1rem] leading-[1.85] text-center max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            {T.whyMattersText1}
          </p>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.partnersTag}
            </p>
            <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.partnersTitle}</h2>
            <p className="text-muted-foreground">{T.partnersSubtitle}</p>
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            }}
          >
            <style>{`
              @keyframes partnersMarquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .partners-track {
                animation: partnersMarquee 22s linear infinite;
              }
              .partners-track:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="partners-track flex items-stretch gap-4 w-max">
              {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                <a
                  key={i}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-[160px] aspect-3/2 flex items-center justify-center bg-white border border-border p-3 transition-all hover:scale-105"
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#D4A017"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ""}
                >
                  <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDEPENDENT STATEMENT */}
      <section className="py-16 border-b border-border" style={{ background: "hsl(220 14% 96%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[2rem] mb-5">⚖️</p>
          <h2 className="text-[1.25rem] font-bold text-secondary mb-4">{T.independentTag}</h2>
          <p className="text-muted-foreground leading-[1.85] max-w-2xl mx-auto">{T.independentText}</p>
        </div>
      </section>

      <div className="border-t border-border py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/" className="text-[0.8125rem] text-muted-foreground hover:text-secondary transition-colors">
            {T.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}