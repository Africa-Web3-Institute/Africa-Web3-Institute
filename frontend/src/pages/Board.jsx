// src/pages/Board.js
import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import AdvisoryBoardCard from "../components/about/AdvisoryBoardCard";
import drRajKapoor from "../assets/Dr_Raj_Kapoor.jpeg";
import DrTammy from "../assets/Dr_Tammy_Francis.jpeg";

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
  {
    name: "Dr Raj Kapoor",
    country: "🇮🇳 India",
    photo: drRajKapoor,
    linkedin: "https://www.linkedin.com/in/indieblock",
  },
  {
    name: "Dr Tammy Francis",
    country: "USA United States of America",
    photo: DrTammy,
    linkedin: "https://linkedin.com/in/drtammyfrancis",
  },
];

export default function Board() {
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <div className="bg-background text-foreground">
      {/* Advisory Board Grid */}
      <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-[1.75rem] font-bold text-secondary">{T.advisoryTitle}</h2>
            <p className="text-muted-foreground">{T.advisoryText}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {ADVISORY_BOARD.map((member) => (
              <AdvisoryBoardCard key={member.name} member={member} />
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