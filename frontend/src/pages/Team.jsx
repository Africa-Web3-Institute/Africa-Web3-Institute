// src/pages/Team.js
import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import { FaLinkedin as Linkedin, FaTwitter as Twitter } from "react-icons/fa";
import KateAcH from "../assets/Kate_operations-lead.png";

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
    name: "Kate Acheampong",
    role: "Operations Lead",
    country: "🇬🇭 Ghana",
    photo: KateAcH,
    linkedin: "https://linkedin.com/in/kate-acheampong-b289a8419",
    twitter: "",
  },
  {
    name: "Gloria Achieng",
    role: "Head of Education",
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

function TeamCard({ member }) {
  const [hovered, setHovered] = React.useState(false);
  const { language } = useLanguage();
  const T = t[language].about;

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
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 shrink-0 flex items-center justify-center"
        style={{ border: "2px solid #D4A017", backgroundColor: member.photo ? "transparent" : "#0B1437" }}>
        {member.photo ? (
          <img src={member.photo} alt={`${member.name} — ${member.role}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <span className="text-[1.25rem] font-bold" style={{ color: "#D4A017" }}>{member.initials}</span>
        )}
      </div>
      <p className="text-[0.9375rem] font-bold text-secondary mb-1">{member.name}</p>
      <p className="text-[0.8125rem] text-muted-foreground mb-1">{T.roles[member.role] || member.role}</p>
      {member.country ? <p className="text-[0.8125rem] mb-3" style={{ color: "#D4A017" }}>{member.country}</p> : <div className="mb-3" />}
      <div className="flex gap-3 mt-auto">
        {member.linkedin && (
          <a href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
            target="_blank" rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}
        {member.twitter && (
          <a href={member.twitter} target="_blank" rel="noopener noreferrer"
            aria-label={`${member.name} on X (Twitter)`}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <div className="bg-background text-foreground">
      {/* Core Team Grid */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.teamTitle}</h2>
            <p className="text-muted-foreground">{T.teamSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CORE_TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
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