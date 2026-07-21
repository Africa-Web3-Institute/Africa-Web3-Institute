import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Award, Star, Shield, Globe, Zap, Building2, Leaf, ChevronRight, Trophy, LayoutGrid, ClipboardList, Info, Newspaper, Send } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const CATEGORY_ICONS = [Building2, Zap, Leaf, Globe, Shield, Star];

const QUICK_NAV = [
  { id: "categories", icon: LayoutGrid, label: { en: "Categories", fr: "Catégories" } },
  { id: "nomination-form", icon: ClipboardList, label: { en: "Nominate", fr: "Nominer" } },
  { id: "about", icon: Info, label: { en: "About", fr: "À propos" } },
  { id: "media", icon: Newspaper, label: { en: "Media", fr: "Médias" } },
  { id: "get-involved", icon: Send, label: { en: "Get Involved", fr: "Participer" } },
];

function CTAButtonLight({ children, primary, onClick }) {
  const base = "inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 transition-colors";
  const style = primary
    ? `${base} bg-secondary text-white hover:bg-secondary/90`
    : `${base} border border-secondary text-secondary hover:bg-secondary hover:text-white`;
  return <button onClick={onClick} className={style}>{children}</button>;
}

export default function AfricaBlockchainAwards() {
  const { language } = useLanguage();
  const T = t[language].awards;
  const [nomForm, setNomForm] = useState({ name: "", org: "", email: "", category: "", description: "" });
  const [nomErrors, setNomErrors] = useState({});
  const [nomSubmitted, setNomSubmitted] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateNom = () => {
    const e = {};
    if (!nomForm.name.trim()) e.name = true;
    if (!nomForm.org.trim()) e.org = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nomForm.email)) e.email = true;
    if (!nomForm.category) e.category = true;
    if (!nomForm.description.trim()) e.description = true;
    return e;
  };

  const handleNomSubmit = (e) => {
    e.preventDefault();
    const errs = validateNom();
    if (Object.keys(errs).length) { setNomErrors(errs); return; }
    setNomSubmitted(true);
    setNomForm({ name: "", org: "", email: "", category: "", description: "" });
  };

  const inputCls = (field) => `w-full text-[0.875rem] px-3 py-2.5 border outline-none transition-colors bg-white ${nomErrors[field] ? "border-red-400" : "border-border focus:border-accent"}`;

  return (
    <div className="bg-background text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url('/Awi_Website_pics.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.93)" }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.heroBadge}
          </p>
          <h1 className="text-[2.25rem] lg:text-[3.25rem] font-bold text-secondary leading-[1.1] tracking-tight mb-5">
            {T.heroTitle}<br />
            <span style={{ color: "#D4A017" }}>{T.heroTitleAccent}</span>
          </h1>
          <p className="text-[1.0625rem] lg:text-[1.1875rem] font-semibold leading-snug mb-8 max-w-xl" style={{ color: "#D4A017" }}>
            {T.heroSubtitle}
          </p>
          <p className="text-[1rem] text-muted-foreground leading-[1.9] mb-10 max-w-2xl font-medium">{T.heroPara1}</p>

          <div className="flex flex-wrap gap-4 mb-10">
            <CTAButtonLight primary onClick={() => window.open("mailto:info@africaweb3institute.org?subject=Sponsorship Enquiry — Africa Blockchain Awards 2025", "_blank")}>
              {T.heroCta1} <ArrowRight className="w-4 h-4" />
            </CTAButtonLight>
            <CTAButtonLight onClick={() => scrollToSection("nomination-form")}>{T.heroCta2}</CTAButtonLight>
          </div>

          {/* Quick explore nav */}
          <div className="flex flex-wrap gap-2.5">
            {QUICK_NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-4 py-2.5 rounded-full border transition-all bg-white"
                style={{ borderColor: "#E5E7EB", color: "#0B1437" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.backgroundColor = "rgba(212,160,23,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: "#D4A017" }} />
                {label[language] || label.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Award Categories ── */}
      <section id="categories" className="py-24 lg:py-32 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.categoriesEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-4">{T.categoriesHeading}</h2>
            <p className="text-[1rem] text-muted-foreground max-w-xl mx-auto">{T.categoriesPara}</p>
          </div>
          <div className="space-y-px bg-border">
            {T.categories.map((cat, ci) => {
              const Icon = CATEGORY_ICONS[ci];
              return (
                <div key={cat.number} className="bg-background">
                  <div className="flex items-center gap-5 px-8 py-5 border-b border-border bg-muted/30">
                    <span className="text-[0.6875rem] font-bold tracking-widest text-accent/60">{cat.number}</span>
                    <div className="w-7 h-7 rounded bg-secondary/8 flex items-center justify-center border border-secondary/10 flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <h3 className="text-[0.9375rem] font-bold text-secondary">{cat.title}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {cat.awards.map((award) => (
                      <div key={award.name} className="px-8 py-5 flex items-start gap-4 pl-[4.5rem]">
                        <Award className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{award.name}</p>
                          <p className="text-[0.875rem] text-muted-foreground leading-snug">{award.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Nomination & Evaluation + Form ── */}
      <section id="nomination-form" className="py-24 lg:py-32 border-b border-border scroll-mt-24" style={{ backgroundColor: "hsl(220 14% 97%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.nominationEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-4">{T.nominationHeading}</h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.85]">{T.nominationPara}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-6">{T.metricsLabel}</p>
              <div className="space-y-px bg-border">
                {T.metrics.map((m, i) => (
                  <div key={m.title} className="bg-white px-7 py-5 flex items-start gap-5">
                    <span className="text-accent font-bold text-[0.75rem] mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{m.title}</p>
                      <p className="text-[0.875rem] text-muted-foreground leading-snug">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border border-border">
              {nomSubmitted ? (
                <div className="border border-accent/40 p-10 text-center">
                  <p className="text-[1.125rem] font-bold text-secondary mb-2">
                    {language === "fr" ? "Votre candidature a été soumise. Merci !" : "Your nomination has been submitted. Thank you!"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNomSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        {language === "fr" ? "Nom complet" : "Full Name"}
                      </label>
                      <input className={inputCls("name")} value={nomForm.name}
                        onChange={e => { setNomForm({...nomForm, name: e.target.value}); setNomErrors({...nomErrors, name: false}); }}
                        placeholder={language === "fr" ? "Votre nom" : "Your name"} />
                    </div>
                    <div>
                      <label className="block text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        {language === "fr" ? "Organisation" : "Organisation"}
                      </label>
                      <input className={inputCls("org")} value={nomForm.org}
                        onChange={e => { setNomForm({...nomForm, org: e.target.value}); setNomErrors({...nomErrors, org: false}); }}
                        placeholder={language === "fr" ? "Votre organisation" : "Your organisation"} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Email</label>
                    <input type="email" className={inputCls("email")} value={nomForm.email}
                      onChange={e => { setNomForm({...nomForm, email: e.target.value}); setNomErrors({...nomErrors, email: false}); }}
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      {language === "fr" ? "Catégorie" : "Award Category"}
                    </label>
                    <select className={inputCls("category")} value={nomForm.category}
                      onChange={e => { setNomForm({...nomForm, category: e.target.value}); setNomErrors({...nomErrors, category: false}); }}>
                      <option value="">— {language === "fr" ? "Sélectionner" : "Select category"} —</option>
                      {T.categories.map(c => <option key={c.number} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      {language === "fr" ? "Description" : "Description of Impact"}
                    </label>
                    <textarea rows={4} className={`${inputCls("description")} resize-none`} value={nomForm.description}
                      onChange={e => { setNomForm({...nomForm, description: e.target.value}); setNomErrors({...nomErrors, description: false}); }}
                      placeholder={language === "fr" ? "Décrivez l'impact..." : "Describe the impact and achievements..."} />
                  </div>
                  <button type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 transition-colors bg-accent text-white hover:bg-accent/90">
                    {language === "fr" ? "Soumettre la nomination" : "Submit Nomination"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── About (evaluation philosophy + objectives + attendees) ── */}
      <section id="about" className="py-24 lg:py-32 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.aboutEyebrow}</p>
              <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold text-secondary leading-snug mb-6">{T.aboutHeading}</h2>
              <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-8">{T.aboutPara1}</p>
              <CTAButtonLight primary onClick={() => scrollToSection("get-involved")}>
                {T.aboutCta} <ArrowRight className="w-4 h-4" />
              </CTAButtonLight>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6">{T.aboutAttendeesLabel}</p>
              <div className="space-y-px bg-border">
                {T.attendees.map((a, i) => (
                  <div key={i} className="bg-background p-6 flex items-start gap-4">
                    <ChevronRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-[0.9375rem] text-foreground leading-snug">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-border">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.objectivesEyebrow}</p>
              <h3 className="text-[1.5rem] font-bold text-secondary leading-snug mb-4">{T.objectivesHeading}</h3>
              <p className="text-[1rem] text-muted-foreground max-w-2xl mx-auto leading-[1.85]">{T.objectivesPara}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-4xl mx-auto">
              {T.objectives.map((o, i) => (
                <div key={o.title} className="bg-white p-8 flex items-start gap-5">
                  <span className="text-[0.6875rem] font-bold tracking-widest text-accent/50 mt-1 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[0.9375rem] font-bold text-secondary mb-2">{o.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Media & Press ── */}
      <section id="media" className="py-24 lg:py-32 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.mediaEyebrow}</p>
            <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug mb-6">{T.mediaHeading}</h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-8">{T.mediaPara}</p>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent flex-shrink-0" />
              <div>
                <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{T.mediaDirectorLabel}</p>
                <a href="mailto:media@africaweb3institute.org"
                  className="text-[0.9375rem] font-semibold text-secondary border-b border-accent/40 pb-px hover:text-accent transition-colors">
                  media@africaweb3institute.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Institutional Engagement ── */}
      <section id="get-involved" className="py-24 lg:py-32 scroll-mt-24" style={{ backgroundColor: "hsl(220 14% 97%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-6" style={{ color: "#D4A017" }} />
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">{T.engagementEyebrow}</p>
          <h2 className="text-[1.75rem] lg:text-[2.5rem] font-bold text-secondary leading-snug mb-5 max-w-2xl mx-auto">{T.engagementHeading}</h2>
          <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-10 max-w-xl mx-auto">{T.engagementPara}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => scrollToSection("nomination-form")}
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors">
              {T.engagementCta1} <ArrowRight className="w-4 h-4" />
            </button>
            <a href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors">
              {T.engagementCta2}
            </a>
            <a href="mailto:info@africaweb3institute.org?subject=Sponsorship Enquiry — Africa Blockchain Awards 2025"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-6 py-3 border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors">
              {T.engagementCta3}
            </a>
          </div>
        </div>
      </section>

      {/* ── Back to home ── */}
      <div className="border-t border-border py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground hover:text-secondary transition-colors">
            {T.backHome}
          </Link>
        </div>
      </div>

    </div>
  );
}
