import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import {Globe, BookOpen, GraduationCap, Mail } from "lucide-react";
import {FaLinkedin as Linkedin,FaTwitter as Twitter} from "react-icons/fa"
import AdvisoryBoardCard from "../components/about/AdvisoryBoardCard";

const CORE_TEAM = [
  {
    name: "Afrikanus Kofi Akosah Adusei",
    role: "Executive Director",
    country: "🇬🇭 Ghana",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/5b37f2043_9edbdc2d-86b7-4581-bb79-f31189960de2.jpg",
    linkedin: "https://linkedin.com/in/afrikanus-kofi-akosah-adusei-ba25aa88",
    twitter: null,
  },
  {
    name: "Adusei Akwasi",
    role: "Director of Policy & Research",
    country: "🇬🇭 Ghana",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/347e90ce2_FB_IMG_1779722196696.jpg",
    linkedin: "linkedin.com/in/adusei-akwasi-4b29419a",
    twitter: null,
  },
  {
    name: "Carlos Juan",
    role: "CTO",
    country: "🇦🇷 Argentina",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/d9d834cfa_CarlosJuan.png",
    linkedin: "linkedin.com/in/carlosjuana",
    twitter: null,
  },
  {
    name: "Jean Cedric Ossey",
    role: "Francophone Lead",
    country: "🇨🇮 Côte d'Ivoire",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/a15daee7d_IMG_3255.png",
    linkedin: "https://linkedin.com/in/osseyjc",
    twitter: "https://x.com/osseyjc",
  },
  {
    name: "Gloria Achieng",
    role: "Operations Lead",
    country: "🇺🇬 Uganda",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/fbf4dc09c_ChatGPTImageMay25202611_07_17AM.png",
    linkedin: "https://linkedin.com/in/gloria-achieng-74388b108",
    twitter: "https://x.com/gloriaachieng14",
  },
  {
    name: "Asang Nehemiah Forgwe",
    role: "Events and Programs Manager",
    country: "🇨🇲 Cameroon",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/dd836029e_ChatGPTImageMay21202607_53_59AM.png",
    linkedin: "https://www.linkedin.com/in/asang-nehemiah-forgwe-094067193",
    twitter: "https://x.com/asangnehemiah?s=21",
  },
  {
    name: "Abdul Rahaman",
    role: "Comms and Partnerships Lead",
    country: "🇬🇭 Ghana",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/71ba35058_IMG_8862.jpg",
    linkedin: "https://linkedin.com/in/abdulganiwu",
    twitter: "https://x.com/phrozendon?s=21",
  },
  {
    name: "Jarau Moses",
    role: "Content & Social Media Lead",
    country: "🇺🇬 Uganda",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/ea434ea86_A4B9E1C4-DF44-4067-A712-5A915C1FB4FA.png",
    linkedin: "linkedin.com/in/jaraumoses",
    twitter: "https://x.com/JarauMoses",
  },
];

const PILLAR_ICONS = [Globe, BookOpen, GraduationCap];
const PILLAR_KEYS = [
  { titleKey: "pillar1Title", descKey: "pillar1Desc" },
  { titleKey: "pillar2Title", descKey: "pillar2Desc" },
  { titleKey: "pillar3Title", descKey: "pillar3Desc" },
];



const ADVISORY_BOARD = [
  {
    name: "Prof. Fredrick Ndalamani Nonde",
    country: "🇿🇲 Zambia",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/aa3c6d347_FNNJRCEO.png",
    linkedin: "https://linkedin.com/in/fredrick-ndalamani-nonde-jr-mba-web3-ecosystem-builder-730b16105",
  },
  {
    name: "Prof. (Dr) h.c. Joerg Molt",
    country: "🇩🇪 Germany",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/23e1e2951_image_20260608_165401b9457012-8de9-4030-bb7d-ce54f57f0f0b-7.jpg",
    linkedin: "https://linkedin.com/in/prof-dr-h-c-joerg-m-268882132",
  },
  {
    name: "Daniil Kozin",
    country: "🇧🇷 Brazil",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/d3c29c585_WhatsAppImage2026-06-24at102503AM.jpeg",
    linkedin: "https://www.linkedin.com/in/daniilkozin",
  },
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
  }
];

const CONTACTS = [
  { icon: "📧", labelKey: "generalEnquiries", email: "info@africaweb3institute.org" },
  { icon: "🤝", labelKey: "partnerships", email: "partnerships@africaweb3institute.org" },
  { icon: "📰", labelKey: "media", email: "media@africaweb3institute.org" },
];

function TeamCard({ member }) {
  const [hovered, setHovered] = React.useState(false);
  const {language}=useLanguage();
  const T=t[language].about;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white p-6 flex flex-col items-center text-center transition-all duration-200"
      style={{
        border: hovered ? "1.5px solid #D4A017" : "1.5px solid hsl(var(--border))",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 flex-shrink-0 flex items-center justify-center"
        style={{ border: "2px solid #D4A017", backgroundColor: member.photo ? "transparent" : "#0B1437" }}>
        {member.photo ? (
          <img src={member.photo} alt={`${member.name} — ${member.role} at Africa Web3 Institute`}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-[1.25rem] font-bold" style={{ color: "#D4A017" }}>{member.initials}</span>
        )}
      </div>
      <p className="text-[0.9375rem] font-bold text-secondary mb-1">{member.name}</p>
      <p className="text-[0.8125rem] text-muted-foreground mb-1">  {T.roles[member.role] || member.role}</p>
      {member.country ? <p className="text-[0.8125rem] mb-3" style={{ color: "#D4A017" }}>{member.country}</p> : <div className="mb-3" />}
      <div className="flex gap-3 mt-auto">
        {member.linkedin && (
          <a href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
            target="_blank" rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}>
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}
        {member.twitter && (
          <a href={member.twitter} target="_blank" rel="noopener noreferrer"
            aria-label={`${member.name} on X (Twitter)`}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}>
            <Twitter className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}


export default function About() {
  const { language } = useLanguage();
  const T = t[language].about;
  const PILLARS = PILLAR_KEYS.map(({ titleKey, descKey }, i) => ({
    icon: PILLAR_ICONS[i],
    title: T[titleKey],
    desc: T[descKey],
  }));

    const IMPACT_STATS_T = [
    { icon: "🌍", stat: "Fastest-growing", label: T.stat1 },
    { icon: "📱", stat: "12%+", label: T.stat2 },
    { icon: "💸", stat: "$48.2M", label: T.stat3 },
  ];
  return (
    <div className="bg-background text-foreground">
      <title>About Us | Africa Web3 Institute</title>

      {/* A. HERO */}
         <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
           <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>Africa Web3 Institute</p>
          {/*<p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>About Us</p>*/}
          <h1 className="text-[2.25rem] lg:text-[3.25rem] font-bold text-white leading-snug mb-5" >
           {T.heroTitle}
          </h1>
          <p className="text-[1.1rem] leading-[1.85] max-w-2xl" style={{ color: "#D4A017" }}>
           {T.heroSubtitle}
          </p>
        </div>
      </section>

      {/* B. WHO WE ARE */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>{T.whoWeAreTitle}</p>
              <h2 className="text-[1.75rem] font-bold text-secondary leading-snug mb-5">
              {T.whoWeAreSubtitle}
              </h2>
              <p className="text-muted-foreground leading-[1.85] mb-4">
                {T.whoWeAreText}
              </p>
              <p className="text-muted-foreground leading-[1.85] mb-8">
               {T.whoWeAreText1}
              </p>
              {/* Inline stats */}
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
              <div className="aspect-[4/3] overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                <img
                  src="https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png"
                  alt="Africa Web3 Institute team working on policy research"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 hidden lg:block"
                style={{ border: "2px solid #D4A017", opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </section>

      {/* C. MISSION & VISION */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.missionTag}</p>
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.missionHeading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8" style={{ borderLeft: "4px solid #D4A017" }}>
              <p className="text-[1.5rem] mb-4">🎯</p>
              <h3 className="text-[1rem] font-bold text-secondary mb-3 uppercase tracking-wide">{T.missionTitle}</h3>
               <p className="text-muted-foreground leading-[1.85]">
                {T.missionText}
              </p>
            </div>
            <div className="bg-white p-8" style={{ borderLeft: "4px solid #D4A017" }}>
              <p className="text-[1.5rem] mb-4">🔭</p>
              <h3 className="text-[1rem] font-bold text-secondary mb-3 uppercase tracking-wide">{T.visionTitle}</h3>
               <p className="text-muted-foreground leading-[1.85]">
                {T.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* D. THREE PILLARS */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.whatWeDoTitle}</p>
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.corePillars}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-5"
                  style={{ backgroundColor: "#0B1437" }}>
                  <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
                </div>
                <h3 className="text-[1rem] font-bold text-secondary mb-3">{title}</h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. WHY IT MATTERS */}
      <section className="py-20 border-b border-border" style={{ backgroundColor: "#0B1437" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.whyMattersTag}</p>
            <h2 className="text-[1.75rem] font-bold text-white">{T.whyMattersTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {IMPACT_STATS_T.map((s) => (
              <div key={s.label} className="p-8 text-center"
                style={{ border: "1px solid rgba(212,160,23,0.2)", background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[2rem] mb-3">{s.icon}</p>
                <p className="text-[1.75rem] font-bold mb-2" style={{ color: "#D4A017" }}>{s.stat}</p>
                <p className="text-[0.875rem]" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[1rem] leading-[1.85] text-center max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            {T.whyMattersText1}</p>
        </div>
      </section>

      {/* F. TEAM — Advisory Board first, then Core Team */}
      <section id="team" className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.teamTag}
            </p>
            <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.teamTitle}</h2>
            <p className="text-muted-foreground">{T.teamSubtitle}</p>
          </div>

          {/* Advisory Board */}
          <div className="mb-20">
            <h3 className="text-xl font-bold text-secondary mb-3 text-center">{T.advisoryTitle}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto text-center mb-10">{T.advisoryText}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {ADVISORY_BOARD.map((member) => (
                <AdvisoryBoardCard key={member.name} member={member} />
              ))}
            </div>
          </div>

          {/* Core Team */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-10 text-center">Core Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CORE_TEAM.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>

        </div>
      </section>

  

      {/* G. PARTNERS */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.partnersTag}</p>
            <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.partnersTitle}</h2>
            <p className="text-muted-foreground">{T.partnersSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((partner, i) => (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-[3/2] flex items-center justify-center bg-white border border-border p-3 transition-all hover:scale-105"
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D4A017"}
                onMouseLeave={e => e.currentTarget.style.borderColor = ""}
              >
                <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
              </a>
            ))}
            {Array(6 - PARTNERS.length).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-[3/2] flex items-center justify-center bg-white border border-border">
                <p className="text-[0.75rem] text-muted-foreground/50 text-center px-2">Partner Logo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H. INDEPENDENT STATEMENT */}
      <section className="py-16 border-b border-border" style={{ background: "hsl(220 14% 96%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[2rem] mb-5">⚖️</p>
          <h2 className="text-[1.25rem] font-bold text-secondary mb-4">{T.independentTag}</h2>
          <p className="text-muted-foreground leading-[1.85] max-w-2xl mx-auto">
            {T.independentText}
          </p>
        </div>
      </section>

      {/* I. CONTACT CTA */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.contactTag}</p>
            <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.contactTitle}</h2>
            <p className="text-muted-foreground">{T.contactSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACTS.map((c) => (
              <div key={c.email} className="p-8 border border-border bg-white flex flex-col items-center text-center">
                <p className="text-[1.75rem] mb-4">{c.icon}</p>
                <p className="text-[0.875rem] font-bold text-secondary mb-2">{T[c.labelKey]}</p>
                <p className="text-[0.8125rem] text-muted-foreground mb-5 break-all">{c.email}</p>
                <a href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
                  style={{ backgroundColor: "#0B1437", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D4A017"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0B1437"}
                  >
                  <Mail className="w-3.5 h-3.5" /> {T.sendEmail}
                </a>
              </div>
            ))}
          </div>
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