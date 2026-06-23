import { useState } from "react";
import { useLanguage} from "../../lib/LanguageContext";

const COPY = {
  en: {
    heading: "Stay ahead of Africa's Web3 policy landscape",
    sub: "Weekly intelligence brief — free for all members.",
    placeholder: "Your email address",
    cta: "Subscribe",
    success: "Thank you! You'll receive our next intelligence brief soon.",
    error: "Please enter a valid email address.",
  },
  fr: {
    heading: "Restez à la pointe du paysage politique Web3 africain",
    sub: "Briefing hebdomadaire — gratuit pour tous les membres.",
    placeholder: "Votre adresse e-mail",
    cta: "S'abonner",
    success: "Merci ! Vous recevrez notre prochain briefing bientôt.",
    error: "Veuillez entrer une adresse e-mail valide.",
  },
};

export default function NewsletterStrip() {
  const { language } = useLanguage();
  const C = COPY[language];
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError(true); return; }
    setError(false);
    setDone(true);
  };

  return (
    <div className="border-b border-border" style={{ backgroundColor: "#0B1437" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[0.9375rem] font-medium text-white">{C.heading}</p>
          <p className="text-[0.75rem] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{C.sub}</p>
        </div>
        {done ? (
          <p className="text-[0.875rem] font-semibold" style={{ color: "#D4A017" }}>{C.success}</p>
        ) : (
          <div className="flex flex-col gap-1 items-end">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                placeholder={C.placeholder}
                className="text-[0.8125rem] px-4 py-2 rounded-lg outline-none w-52 lg:w-64 text-white placeholder:text-white/40"
                style={{ border: `0.5px solid ${error ? "#EF4444" : "rgba(255,255,255,0.2)"}`, backgroundColor: "rgba(255,255,255,0.07)" }}
              />
              <button
                type="submit"
                className="text-[0.8125rem] font-semibold px-5 py-2 rounded-lg flex-shrink-0 transition-all"
                style={{ backgroundColor: "#D4A017", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
              >
                {C.cta}
              </button>
            </form>
            {error && <p className="text-[0.75rem]" style={{ color: "#FCA5A5" }}>{C.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}