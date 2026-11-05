import { useState, useMemo } from "react";
//import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { publicationsApi } from "../api/api";
import { useEffect } from "react";
import { t } from "../lib/translations";
import { trackDownload } from "../api/publicContent";

export const PUBLICATIONS = [
  {
    id: 1,
    category: "State of Web3 Africa",
    title: "State of Web3 Africa 2026 — Q1 Report",
    description: "A comprehensive review of blockchain adoption, policy developments, and ecosystem growth across 18+ African nations in Q1 2026.",
    title_fr: "État du Web3 en Afrique 2026 — Rapport du T1",
    description_fr: "Un examen complet de l'adoption de la blockchain, des évolutions politiques et de la croissance de l'écosystème dans plus de 18 pays africains au premier trimestre 2026.",
    date: "March 2026",
    date_fr: "Mars 2026",
    author: "AWI Research Team",
    downloadUrl: "https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/59df44ac1_Q1Report.pdf",
    available: true,
  },

 // {
  //  id: 2,
  //  category: "State of Web3 Africa",
  ////  title: "State of Web3 Africa 2026 — Q2 Report",
  ////  description: "Quarterly intelligence on stablecoin adoption, regulatory changes, and capital flows across African Web3 markets.",
  //  title_fr: "État du Web3 en Afrique 2026 — Rapport du T2",
  //  description_fr: "Veille trimestrielle sur l'adoption des stablecoins, les changements réglementaires et les flux de capitaux sur les marchés Web3 africains.",
  //  date: "June 2026",
  //  date_fr: "Juin 2026",
    //author: "AWI Research Team",
    //downloadUrl: "#",
    //available: false,
 // },
  {
    id: 4,
    category: "Policy Brief",
    title: "Binance Breach: Lessons for African Regulators",
    description: "On 29 October 2026, about $6.3 billion left Binance's wallets. This brief sets out what is reported so far and five requirements African regulators can place on platforms serving their markets: segregated and audited reserves, published withdrawal terms, incident reporting, a freeze-order process, and independent reconciliation.",
    date: "2 November 2026",
    author: "AWI Policy Team",
    title_fr: "Faille de Binance : enseignements pour les régulateurs africains",
    description_fr: "Le 29 octobre 2026, environ 6,3 milliards de dollars ont quitté les portefeuilles de Binance. Cette note présente ce qui est rapporté à ce jour et cinq exigences que les régulateurs africains peuvent imposer aux plateformes opérant sur leurs marchés : réserves ségréguées et auditées, conditions de retrait publiées, déclaration des incidents, procédure publiée pour les ordres de gel et rapprochement indépendant des comptes.",
    date_fr: "2 novembre 2026",
    downloadUrl: "/reports/AWI_Policy_Brief_Binance_Breach_02_Nov_2026.pdf",
    // downloadUrl_fr: "/reports/AWI_Note_Politique_Binance_02_Nov_2026.pdf", // add once a French PDF exists
    available: true,
  },
  // Older entries (ids 3, 5-14) removed while the backend is down; restore from version history.
];

const CATEGORY_STYLES = {
  "Published Articles":                      { bg: "#dbeafe", text: "#1e40af" },
  "Policy Brief":                             { bg: "#ede9fe", text: "#5b21b6" },
  "Monthly African Stablecoin Adoption Report": { bg: "#dcfce7", text: "#166534" },
  "State of Web3 Africa":                    { bg: "#fef3c7", text: "#D4A017" },
  "Published Research":                       { bg: "#e0e7ff", text: "#1A1F36" },
};

function CategoryPill({ category, T }) {
  const s = CATEGORY_STYLES[category] || { bg: "#f3f4f6", text: "#374151" };
  const labels = {
    "Published Articles": T.tabArticles,
    "Policy Brief": T.tabPolicyBriefs,
    "Monthly African Stablecoin Adoption Report": T.tabStablecoin,
    "State of Web3 Africa": T.tabStateOfWeb3,
    "Published Research": T.tabResearch,
  };
  const label = labels[category] || category;
  return (
    <span className="inline-block text-[0.6875rem] font-semibold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}>
      {label}
    </span>
  );
}

function PublicationCard({ pub, T, track, language }) {
  const isFr = language === "fr";
  const title = (isFr && pub.title_fr) || pub.title;
  const description = (isFr && pub.description_fr) || pub.description;
  const date = (isFr && pub.date_fr) || pub.date;
  const url = (isFr && pub.downloadUrl_fr) || pub.downloadUrl;

  return (
    <div className="bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:shadow-md transition-shadow h-full">
      <CategoryPill category={pub.category} T={T} />
      <p className="text-[0.9375rem] font-bold text-secondary leading-snug">{title}</p>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed flex-1">{description}</p>
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
        <div>
          <p className="text-[0.75rem] text-muted-foreground">{date}</p>
          <p className="text-[0.6875rem] text-muted-foreground/70">{pub.author}</p>
        </div>
        {pub.available && url && url !== "#" ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track && trackDownload(pub.id)}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold px-4 py-2 rounded-md shrink-0 transition-colors"
            style={{ backgroundColor: "#D4A017", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            {/\.pdf($|\?)/i.test(url) ? T.downloadBtn : T.readBtn}
          </a>
        ) : (
          <span className="inline-flex items-center text-[0.75rem] font-medium px-3 py-1.5 rounded-md shrink-0"
            style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}>
            {T.comingSoon}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Publications() {
  const { language } = useLanguage();
  const T = t[language].publicationsPage;
  const [publicationsList, setPublicationsList] = useState(PUBLICATIONS);
  const [fromApi, setFromApi] = useState(false); // the built-in list has no real database ids, so it is not counted
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;
    publicationsApi
      .getAll()
      .then((res) => {
        if (!mounted) return;
        const list = res?.data || (Array.isArray(res) ? res : []);
        if (list && list.length > 0) {
          // Show published items only (drafts / "Review" stay private), whatever the capitalisation.
          const formatted = list
            .filter((p) => String(p.status || "published").toLowerCase() === "published")
            .map((p) => ({
              ...p,
              description: p.description || "",
              author: p.author || "",
              available: p.available === undefined ? true : Boolean(Number(p.available)),
            }));
          setPublicationsList(formatted);
          setFromApi(true);
        }
      })
      .catch((err) => {
        console.warn("Could not load publications from API, using fallback data:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const TABS = [
    { key: "all",        label: T.tabAll },
    { key: "Published Articles", label: T.tabArticles },
    { key: "Policy Brief",       label: T.tabPolicyBriefs },
    { key: "Monthly African Stablecoin Adoption Report", label: T.tabStablecoin },
    { key: "State of Web3 Africa",  label: T.tabStateOfWeb3 },
    { key: "Published Research",    label: T.tabResearch },
  ];

  const filtered = useMemo(() => {
    return publicationsList.filter(p => {
      if (activeTab !== "all" && p.category !== activeTab) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [p.title, p.description, p.author, p.title_fr, p.description_fr]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [publicationsList, activeTab, search]);

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-12 lg:py-18">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.heroEyebrow}
          </p>
          <h1 className="text-[2rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-3">
            {T.heroTitle}
          </h1>
          <p className="text-[1rem] max-w-2xl mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {T.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}>
              📄 {T.heroCount}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}>
              🗓️ {T.heroUpdated}
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Tabs — offset clears the floating navbar (76px mobile, 88px sm+) */}
      <div className="sticky top-[4.75rem] sm:top-[5.5rem] z-40 bg-white border-b border-border shadow-sm">
        <div className="relative max-w-7xl mx-auto lg:px-8">
          {/* Right-edge fade hints that more tabs scroll into view on small screens */}
          <div className="lg:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10"
            style={{ background: "linear-gradient(to left, #fff, rgba(255,255,255,0))" }} />
          <div className="flex gap-0 overflow-x-auto scrollbar-hide px-2 sm:px-4 lg:px-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="shrink-0 text-[0.8125rem] font-semibold px-4 py-4 border-b-2 transition-colors whitespace-nowrap"
                style={{
                  borderBottomColor: activeTab === tab.key ? "#D4A017" : "transparent",
                  color: activeTab === tab.key ? "#D4A017" : "#6b7280",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Count */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={T.searchPlaceholder}
              className="w-full pl-8 pr-3 py-2 text-[0.8125rem] border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">
            {T.showing} <strong className="text-foreground">{filtered.length}</strong> {T.of} {publicationsList.length} {T.publications}
          </p>
          {(search || activeTab !== "all") && (
            <button
              onClick={() => { setSearch(""); setActiveTab("all"); }}
              className="text-[0.8125rem] font-semibold transition-colors"
              style={{ color: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.color = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}
            >
              {T.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Publications Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">{T.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pub => (
              <PublicationCard key={pub.id} pub={pub} T={T} track={fromApi} language={language} />
            ))}
          </div>
        )}
      </section>

      {/* Submit Research CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-14">
        <div className="rounded-xl border border-border bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderLeft: "4px solid #D4A017" }}>
          <div>
            <h2 className="text-[1.1875rem] font-bold text-secondary mb-1">{T.submitTitle}</h2>
            <p className="text-[0.875rem] text-muted-foreground max-w-xl">{T.submitSubtitle}</p>
          </div>
          <a
            href="mailto:research@africaweb3institute.org"
            className="inline-flex items-center text-[0.875rem] font-semibold px-5 py-2.5 rounded-md shrink-0 transition-colors"
            style={{ backgroundColor: "#0B1437", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0B1437"}
          >
            {T.submitBtn}
          </a>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-14">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.stayInformed}
          </p>
          <h2 className="text-[1.5rem] font-bold text-white mb-2">{T.newsletterTitle}</h2>
          <p className="text-[0.9375rem] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            {T.newsletterSubtitle}
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold px-6 py-3 rounded-lg"
              style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}>
              ✅ {T.newsletterSuccess}
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 text-[0.875rem] rounded-md border border-white/20 bg-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-[0.875rem] font-semibold shrink-0 transition-colors"
                style={{ backgroundColor: "#D4A017", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
              >
                {T.newsletterBtn}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}