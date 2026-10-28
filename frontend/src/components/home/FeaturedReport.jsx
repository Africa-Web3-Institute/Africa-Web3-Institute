import { Link } from "react-router-dom";
import { Download, BarChart2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import Reveal from "../common/Reveal";

const COPY = {
  en: {
    title: "Africa Web3 Policy & Innovation Index (AWPII) 2025",
    desc: "Our flagship annual ranking of 54 African nations across policy, innovation, and adoption metrics. 2026 report coming in January 2027.",
    cta: "Download May 2026 Snapshot",
  },
  fr: {
    title: "Indice africain des politiques et de l'innovation Web3 (AWPII) 2025",
    desc: "Notre classement annuel phare de 54 nations africaines sur les métriques de politique, d'innovation et d'adoption. Le rapport 2026 arrive en janvier 2027.",
    cta: "Télécharger le Snapshot de mai 2026",
  },
};

export default function FeaturedReport() {
  const { language } = useLanguage();
  const C = COPY[language];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 border-b border-border bg-white">
      <Reveal className="rounded-xl border-2 p-6 flex items-center justify-between gap-5 flex-wrap"
        style={{ borderColor: "#D4A017" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-[60px] rounded-md flex flex-col items-center justify-center gap-1 shrink-0"
            style={{ backgroundColor: "#0B1437" }}>
            <BarChart2 className="w-5 h-5" style={{ color: "#D4A017" }} />
            <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>2025</span>
          </div>
          <div>
            <p className="text-[0.9375rem] font-medium" style={{ color: "#111827" }}>{C.title}</p>
            <p className="text-[0.75rem] mt-1" style={{ color: "#6B7280" }}>{C.desc}</p>
          </div>
        </div>
        <Link
          to="/awpii"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-lg shrink-0 transition-all"
          style={{ backgroundColor: "#D4A017", color: "#fff" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
        >
          <Download className="w-3.5 h-3.5" /> {C.cta}
        </Link>
      </Reveal>
    </div>
  );
}