// src/pages/FrancophoneNetwork.js
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Globe, Rocket, Mail } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import CountryFlag from "../components/CountryFlag"

// ─── Country flags mapping ──────────────────────────────────────────────────
const COUNTRY_FLAGS = {
  "Cameroon": "🇨🇲", "Cameroun": "🇨🇲",
  "Senegal": "🇸🇳", "Sénégal": "🇸🇳",
  "Côte d'Ivoire": "🇨🇮",
  "DR Congo": "🇨🇩", "RD Congo": "🇨🇩",
  "Mali": "🇲🇱",
  "Burkina Faso": "🇧🇫",
  "Guinea": "🇬🇳", "Guinée": "🇬🇳",
  "Niger": "🇳🇪",
  "Togo": "🇹🇬",
  "Benin": "🇧🇯", "Bénin": "🇧🇯",
  "Madagascar": "🇲🇬",
  "Rwanda": "🇷🇼",
  "Burundi": "🇧🇮",
  "Chad": "🇹🇩", "Tchad": "🇹🇩",
  "Central African Republic": "🇨🇫", "République centrafricaine": "🇨🇫",
  "Gabon": "🇬🇦",
  "Congo": "🇨🇬",
  "Comoros": "🇰🇲", "Comores": "🇰🇲",
};

const OFFER_ICONS = [
  <GraduationCap className="w-6 h-6" />,
  <Globe className="w-6 h-6" />,
  <Rocket className="w-6 h-6" />,
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

// ─── Animated section wrapper ───────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FrancophoneNetwork() {
  const { language } = useLanguage();
  const T = t[language].francophoneNetwork;

  const [form, setForm] = useState({ name: "", email: "", country: "", institution: "", interest: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };


  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Awi_Website_3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0B1437] via-[#0B1437]/90 to-[#0B1437]/70" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
          <div className="max-w-3xl">
            <AnimatedSection>
              <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
                {T.aboutEyebrow || "Network"}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                {T.aboutHeading || "Francophone Web3 & Students Network"}
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                {T.aboutBody || "Connecting French-speaking African students and young professionals with opportunities in the Web3 ecosystem."}
              </p>
            
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ──────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-border bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
              {T.offerEyebrow || "What We Offer"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {T.offerHeading || "Empowering the Next Generation"}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {T.offers?.map((item, idx) => (
              <AnimatedSection key={item.title} delay={idx * 100}>
                <div className="group bg-white p-8 rounded-2xl border border-border hover:border-[#D4A017]/40 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0B1437] text-[#D4A017] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {OFFER_ICONS[idx] || <GraduationCap className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

  {/* ─── COUNTRIES ────────────────────────────────────────────────────── */}
<section className="py-20 border-b border-border">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <AnimatedSection className="text-center mb-12">
      <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
        {T.countriesEyebrow || "Our Reach"}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-secondary">
        {T.countriesHeading || "Pan-African Presence"}
      </h2>
    </AnimatedSection>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {T.countries?.map((name, idx) => {
        const emoji = COUNTRY_FLAGS[name]; // get the flag emoji from mapping
        return (
          <AnimatedSection key={name} delay={idx * 30}>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-border hover:border-[#D4A017]/30 hover:shadow-md transition-all duration-300">
              {emoji ? (
                <CountryFlag emoji={emoji} size={32} />
              ) : (
                <span className="text-3xl">🌍</span> 
              )}
              <span className="text-xs text-muted-foreground font-medium text-center">{name}</span>
            </div>
          </AnimatedSection>
        );
      })}
    </div>
  </div>
</section>


   {/* ─── JOIN FORM + CONTACT ───────────────────────────────────────────── */}
<section id="join" className="py-16 md:py-20 bg-[#F8F9FB]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
      {/* Form */}
      <AnimatedSection>
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
            {T.formEyebrow || "Join the Network"}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
            {T.formHeading || "Become a Member"}
          </h2>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D4A017]/30 shadow-lg text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-xl font-bold text-secondary">{T.successTitle || "Welcome aboard!"}</p>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">{T.successBody || "We'll be in touch soon with next steps."}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-border">
            {["name", "email", "institution"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  {T.formFields?.[key]?.label || key}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={T.formFields?.[key]?.placeholder || ""}
                  className="w-full px-4 py-2.5 text-sm sm:text-base rounded-lg border border-border focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] outline-none transition"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                {T.formFields?.country?.label || "Country"}
              </label>
              <select
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-2.5 text-sm sm:text-base rounded-lg border border-border focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] outline-none transition"
              >
                <option value="">{T.formFields?.country?.placeholder || "Select your country"}</option>
                {T.countries?.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                {T.formFields?.interest?.label || "Area of Interest"}
              </label>
              <select
                required
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className="w-full px-4 py-2.5 text-sm sm:text-base rounded-lg border border-border focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] outline-none transition"
              >
                <option value="">{T.formFields?.interest?.placeholder || "Select an interest"}</option>
                {T.interests?.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 sm:py-3 rounded-full bg-[#D4A017] text-white font-semibold text-sm sm:text-base hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
            >
              {T.submitBtn || "Join Now"}
            </button>
          </form>
        )}
      </AnimatedSection>

      {/* Contact Side */}
      <AnimatedSection delay={150}>
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 text-[#D4A017]">
            {T.contactEyebrow || "Get in Touch"}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
            {T.contactHeading || "Contact Us"}
          </h2>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-border">
          <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
            Have questions or want to partner with us? Reach out directly to our team.
          </p>
          <a
            href="mailto:francophone@africaweb3institute.org"
            className="inline-flex items-center gap-3 text-base sm:text-lg font-medium text-[#D4A017] hover:text-[#b88a12] transition-colors break-all"
          >
            <Mail className="w-5 h-5 shrink-0" />
            <span className="break-all text-xs md:text-md">francophone@africaweb3institute.org</span>
          </a>
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </div>
</section>

      {/* ─── BACK TO HOME ───────────────────────────────────────────────────── */}
      <div className="border-t border-border py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
             {T.backHome || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}