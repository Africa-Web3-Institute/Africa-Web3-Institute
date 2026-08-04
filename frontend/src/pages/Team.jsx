// src/pages/Team.js
import {useEffect, useRef, useState }  from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import { FaLinkedin as Linkedin, FaTwitter as Twitter } from "react-icons/fa";
import { Users, MapPin, Briefcase, ArrowRight } from "lucide-react";
import KateAcH from "../assets/Kate_operations-lead.png";


// ─── Team data ───────────────────────────────────────────────────────────────
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

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ─── Reusable animated section wrapper ──────────────────────────────────────
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Team Card ──────────────────────────────────────────────────────────────
function TeamCard({ member, index }) {
  const [hovered, setHovered] =useState(false);
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <AnimatedSection delay={index * 50} className="h-full">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 h-full border border-border hover:border-[#D4A017]/40 hover:shadow-xl"
        style={{
          transform: hovered ? "translateY(-6px)" : "none",
        }}
      >
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#D4A017] ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-4">
            {member.photo ? (
              <img
                src={member.photo}
                alt={`${member.name} — ${member.role}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full bg-[#0B1437] flex items-center justify-center text-2xl font-bold text-[#D4A017]">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          {/* Decorative dot */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#D4A017] border-2 border-white" />
        </div>

        {/* Name & Role */}
        <p className="text-base font-bold text-secondary leading-tight mb-1">{member.name}</p>
        <p className="text-sm font-medium text-[#D4A017] mb-1">{T.roles?.[member.role] || member.role}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="w-3 h-3" />
          <span>{member.country}</span>
        </div>

        {/* Social links */}
        <div className="flex gap-3 mt-auto pt-3 border-t border-border w-full justify-center">
          {member.linkedin && (
            <a
              href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-[#D4A017] hover:text-[#D4A017] hover:bg-[#D4A017]/5 transition-all duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on X (Twitter)`}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-[#D4A017] hover:text-[#D4A017] hover:bg-[#D4A017]/5 transition-all duration-200"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Team() {
  const { language } = useLanguage();
  const T = t[language].about;



  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0B1437] via-[#0B1437]/95 to-[#0B1437]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
          <div className="max-w-3xl">
            <AnimatedSection>
              <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
                {T.teamTitle || "Our Team"}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                The People Behind <br className="hidden sm:block" />
                <span className="text-[#D4A017]">Africa's Web3 Future</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                {T.teamSubtitle ||
                  "A pan-African team of policy experts, researchers, and technologists driving regulatory innovation across the continent."}
              </p>
             
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── TEAM GRID ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              Meet the Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              A Diverse, Pan-African <br className="sm:hidden" /> Collective
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Our team spans the continent—and beyond—bringing together deep policy expertise, technical rigour, and a shared commitment to shaping Africa's digital future.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CORE_TEAM.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOIN THE TEAM ──────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="bg-[#0B1437] rounded-3xl p-12 md:p-16 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Shape the Future of Web3 Policy in Africa
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
                We're always looking for passionate researchers, policy analysts, and technologists to join our mission. If you're driven by impact, we want to hear from you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4A017] text-white font-semibold hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
              >
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BACK TO HOME ───────────────────────────────────────────────────── */}
      <div className="border-t border-border py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
             {T.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}