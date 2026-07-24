// src/pages/Board.js
import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import { MapPin ,ArrowRight } from "lucide-react";
import drRajKapoor from "../assets/Dr_Raj_Kapoor.jpeg";
import DrTammy from "../assets/Dr_Tammy_Francis.jpeg";
import CyndaJonesCarswell from "../assets/Cynda_Jones_Carswell.png";
import JadeBishop from "../assets/JadeBishop.jpg"
import { useEffect, useRef, useState } from "react";

// ─── Advisory Board Data ─────────────────────────────────────────────────────
const ADVISORY_BOARD = [
  {
    name: "Prof. Fredrick Ndalamani Nonde",
    country: "🇿🇲 Zambia",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/aa3c6d347_FNNJRCEO.png",
    linkedin: "https://linkedin.com/in/fredrick-ndalamani-nonde-jr-mba-web3-ecosystem-builder-730b16105",
  },
  {
    name: "Dr Tammy Francis",
    country: "🇺🇸 United States of America",
    photo: DrTammy,
    linkedin: "https://linkedin.com/in/drtammyfrancis",
  },
  {
    name: "Prof. (Dr) h.c. Joerg Molt",
    country: "🇩🇪 Germany",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/23e1e2951_image_20260608_165401b9457012-8de9-4030-bb7d-ce54f57f0f0b-7.jpg",
    linkedin: "https://linkedin.com/in/prof-dr-h-c-joerg-m-268882132",
  },
  {
    name: "Jade Bishop",
    country: "🇿🇦 South Africa", 
    photo: JadeBishop,
    linkedin: "https://www.linkedin.com/in/jade-bishop-2276b7131/",
  },
  {
    name: "Daniil Kozin",
    country: "🇧🇷 Brazil",
    photo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/d3c29c585_WhatsAppImage2026-06-24at102503AM.jpeg",
    linkedin: "https://www.linkedin.com/in/daniilkozin",
  },
  {
    name: "Cynda Jones Carswell, MBA",
    country: "🇺🇸 United States of America",
    photo: CyndaJonesCarswell,
    linkedin: "https://www.linkedin.com/in/cynda-jones/",
  },
  {
    name: "Dr Raj Kapoor",
    country: "🇮🇳 India",
    photo: drRajKapoor,
    linkedin: "https://www.linkedin.com/in/indieblock",
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

// ─── Board Card ──────────────────────────────────────────────────────────────
function BoardCard({ member, index }) {
  const [hovered, setHovered] = React.useState(false);

  // Extract initials for fallback
  const initials = member.name
    .split(" ")
    .filter((word) => word.length > 0 && word !== "Prof." && word !== "Dr" && word !== "h.c.")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatedSection delay={index * 60}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 border border-border hover:border-[#D4A017]/40 hover:shadow-xl"
        style={{
          transform: hovered ? "translateY(-6px)" : "none",
        }}
      >
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-[#D4A017] ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-4">
            {member.photo ? (
              <img
                src={member.photo}
                alt={`${member.name} — Advisory Board Member`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full bg-[#0B1437] flex items-center justify-center text-3xl font-bold text-[#D4A017]">
                {initials}
              </div>
            )}
          </div>
          {/* Decorative dot */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#D4A017] border-2 border-white" />
        </div>

        {/* Name & Role */}
        <p className="text-base font-bold text-secondary leading-tight mb-1">{member.name}</p>
        <p className="text-sm font-medium text-[#D4A017] mb-1">Advisory Board Member</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="w-3 h-3" />
          <span>{member.country}</span>
        </div>

        {/* LinkedIn link */}
        {member.linkedin && (
          <a
            href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-[#D4A017] hover:text-[#D4A017] hover:bg-[#D4A017]/5 transition-all duration-200 mt-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
      </div>
    </AnimatedSection>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Board() {
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
                {T.advisoryTitle || "Advisory Board"}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                Global Leaders, <br className="hidden sm:block" />
                <span className="text-[#D4A017]">Shared Vision</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                {T.advisoryText ||
                  "Our distinguished advisory board brings together world-class expertise from finance, technology, policy, and academia to guide Africa's Web3 evolution."}
              </p>
             
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── BOARD GRID ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              Our Advisors
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              A Globally Renowned <br className="sm:hidden" /> Advisory Council
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Each member brings decades of experience and a deep commitment to advancing responsible innovation across Africa.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ADVISORY_BOARD.map((member, index) => (
              <BoardCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── BECOME AN ADVISOR ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="bg-[#0B1437] rounded-3xl p-12 md:p-16 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Join Our Advisory Board
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
                We invite distinguished leaders in policy, technology, finance, and academia to help shape the strategic direction of the Africa Web3 Institute.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4A017] text-white font-semibold hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
              >
                Express Interest <ArrowRight className="w-4 h-4" />
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
            {T.backHome || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}