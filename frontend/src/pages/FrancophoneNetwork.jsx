import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Globe, Rocket, Mail } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

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
    <div className="bg-background">
      {/* About */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Awi_Website_3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,20,55,0.85)" }} />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.aboutEyebrow}
          </p>
          <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-white leading-snug mb-5">
            {T.aboutHeading}
          </h2>
          <p className="text-[0.9375rem] lg:text-[1.0625rem] leading-[1.75]" style={{ color: "rgba(255,255,255,0.75)" }}>
            {T.aboutBody}
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.offerEyebrow}</p>
            <h2 className="font-display text-[2rem] font-bold text-secondary">{T.offerHeading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {T.offers.map((item, i) => (
              <div key={item.title} className="p-7 rounded-lg bg-background" style={{ border: "1px solid rgba(212,160,23,0.2)" }}>
                <div className="mb-4" style={{ color: "#D4A017" }}>{OFFER_ICONS[i]}</div>
                <h3 className="font-display text-[1.0625rem] font-bold text-secondary mb-2">{item.title}</h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.countriesEyebrow}</p>
            <h2 className="font-display text-[2rem] font-bold text-secondary">{T.countriesHeading}</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {T.countries.map((name) => (
              <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-lg text-center" style={{ border: "1px solid hsl(var(--border))" }}>
                <span className="text-2xl">{COUNTRY_FLAGS[name] || "🌍"}</span>
                <span className="text-[0.75rem] text-muted-foreground font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form + Get in Touch */}
      <section id="join" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="text-center lg:text-left mb-10">
              <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.formEyebrow}</p>
              <h2 className="font-display text-[2rem] font-bold text-secondary">{T.formHeading}</h2>
            </div>
            {submitted ? (
              <div className="text-center p-10 rounded-lg" style={{ border: "1px solid rgba(212,160,23,0.4)", backgroundColor: "rgba(212,160,23,0.06)" }}>
                <p className="text-[1.0625rem] font-semibold text-secondary">{T.successTitle}</p>
                <p className="text-muted-foreground mt-2">{T.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-background p-8 rounded-lg" style={{ border: "1px solid hsl(var(--border))" }}>
                {["name", "email", "institution"].map((key) => (
                  <div key={key}>
                    <label className="block text-[0.8125rem] font-medium text-secondary mb-1.5">{T.formFields[key].label}</label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      required
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={T.formFields[key].placeholder}
                      className="w-full px-4 py-2.5 text-[0.875rem] rounded-md outline-none"
                      style={{ border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[0.8125rem] font-medium text-secondary mb-1.5">{T.formFields.country.label}</label>
                  <select
                    required
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-2.5 text-[0.875rem] rounded-md outline-none"
                    style={{ border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                  >
                    <option value="">{T.formFields.country.placeholder}</option>
                    {T.countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8125rem] font-medium text-secondary mb-1.5">{T.formFields.interest.label}</label>
                  <select
                    required
                    value={form.interest}
                    onChange={e => setForm({ ...form, interest: e.target.value })}
                    className="w-full px-4 py-2.5 text-[0.875rem] rounded-md outline-none"
                    style={{ border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                  >
                    <option value="">{T.formFields.interest.placeholder}</option>
                    {T.interests.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-[0.875rem] font-semibold rounded-md transition-all"
                  style={{ backgroundColor: "#D4A017", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
                >
                  {T.submitBtn}
                </button>
              </form>
            )}
          </div>

          <div>
            <div className="text-center lg:text-left mb-10">
              <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A017" }}>{T.contactEyebrow}</p>
              <h2 className="font-display text-[2rem] font-bold text-secondary">{T.contactHeading}</h2>
            </div>
            <div className="p-8 rounded-lg bg-background text-center lg:text-left" style={{ border: "1px solid hsl(var(--border))" }}>
              <a
                href="mailto:francophone@africaweb3institute.org"
                className="inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors"
                style={{ color: "#D4A017" }}
              >
                <Mail className="w-4 h-4" />
                francophone@africaweb3institute.org
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-[0.875rem] text-muted-foreground hover:text-secondary transition-colors">
          {T.backHome}
        </Link>
      </div>
    </div>
  );
}