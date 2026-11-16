import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const COPY = {
  en: {
    eyebrow: "Error 404",
    heading: "Page not found",
    body: "The page you're looking for doesn't exist or may have moved.",
    home: "Back to Home",
    contact: "Contact Us",
  },
  fr: {
    eyebrow: "Erreur 404",
    heading: "Page introuvable",
    body: "La page que vous recherchez n'existe pas ou a peut-être été déplacée.",
    home: "Retour à l'accueil",
    contact: "Nous contacter",
  },
};

const PageNotFound = () => {
  const { language } = useLanguage();
  const C = COPY[language] || COPY.en;

  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 pt-32 pb-20 text-center" style={{ backgroundColor: "#0B1437" }}>
      <div className="max-w-xl">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
          {C.eyebrow}
        </p>
        <h1 className="text-[2rem] lg:text-[3rem] font-bold text-white leading-tight mb-4">{C.heading}</h1>
        <p className="text-[1.0625rem] leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.68)" }}>
          {C.body}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-[#b8891a]"
            style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
          >
            {C.home} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold px-6 py-3 rounded-full text-white transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.3)" }}
          >
            {C.contact}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
