import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const PUBLICATIONS = [
  {
    id: 1,
    category: "State of Web3 Africa",
    title: "State of Web3 Africa 2026 — Q1 Report",
    description: "A comprehensive review of blockchain adoption, policy developments, and ecosystem growth across 18+ African nations in Q1 2026.",
    date: "March 2026",
    author: "AWI Research Team",
    downloadUrl: "https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/59df44ac1_Q1Report.pdf",
    available: true,
  },
  {
    id: 2,
    category: "State of Web3 Africa",
    title: "State of Web3 Africa 2025 — Annual Report",
    description: "Full-year review of Africa's Web3 landscape covering regulatory shifts, market growth, and ecosystem milestones across the continent.",
    date: "December 2025",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 3,
    category: "State of Web3 Africa",
    title: "State of Web3 Africa 2026 — Q2 Report",
    description: "Quarterly intelligence on stablecoin adoption, regulatory changes, and capital flows across African Web3 markets.",
    date: "June 2026",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 4,
    category: "Monthly African Stablecoin Adoption Report",
    title: "African Stablecoin Adoption Report — May 2026",
    description: "Monthly tracking of stablecoin transaction volumes, P2P adoption rates, merchant integration, and regulatory developments across Africa.",
    date: "May 2026",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 5,
    category: "Monthly African Stablecoin Adoption Report",
    title: "African Stablecoin Adoption Report — April 2026",
    description: "April 2026 monthly data on stablecoin flows, USDT P2P volumes, and regulatory signals across key African markets.",
    date: "April 2026",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 6,
    category: "Monthly African Stablecoin Adoption Report",
    title: "African Stablecoin Adoption Report — March 2026",
    description: "March 2026 stablecoin data including cross-border settlement volumes, remittance corridors, and CBDC pilot updates.",
    date: "March 2026",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 7,
    category: "Policy Brief",
    title: "VASP Licensing Frameworks in Anglophone Africa",
    description: "Comparative analysis of virtual asset service provider licensing requirements across Nigeria, South Africa, Kenya, Ghana, and Rwanda.",
    date: "April 2026",
    author: "AWI Policy Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 8,
    category: "Policy Brief",
    title: "Stablecoin Regulation in Francophone Africa",
    description: "Policy brief examining the BCEAO and BEAC regional frameworks and their implications for stablecoin adoption across Francophone African nations.",
    date: "March 2026",
    author: "AWI Policy Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 9,
    category: "Policy Brief",
    title: "CBDCs and Financial Inclusion in Sub-Saharan Africa",
    description: "Analysis of active and pilot CBDC programmes across Sub-Saharan Africa and their potential to accelerate financial inclusion.",
    date: "February 2026",
    author: "AWI Policy Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 10,
    category: "Policy Brief",
    title: "AML/CFT Compliance for African VASPs",
    description: "Guidance brief on FATF Travel Rule implementation and AML/CFT obligations for virtual asset service providers operating in African jurisdictions.",
    date: "January 2026",
    author: "AWI Policy Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 11,
    category: "Published Articles",
    title: "Why Africa Needs Its Own Web3 Policy Framework",
    description: "Op-ed examining why African nations must develop indigenous Web3 regulatory frameworks rather than adopting Western models wholesale.",
    date: "April 2026",
    author: "AWI Executive Director",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 12,
    category: "Published Articles",
    title: "The Stablecoin Revolution in African Cross-Border Trade",
    description: "Analysis of how stablecoins are reshaping intra-African trade settlement and what it means for the AfCFTA digital payment infrastructure.",
    date: "March 2026",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 13,
    category: "Published Articles",
    title: "Binance vs Nigeria: What It Means for African Crypto Regulation",
    description: "In-depth analysis of the Nigeria-Binance regulatory standoff and its implications for VASP regulation across the continent.",
    date: "January 2026",
    author: "AWI Policy Team",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 14,
    category: "Published Research",
    title: "Africa Web3 Policy & Innovation Index (AWPII) 2025",
    description: "The definitive annual ranking of 18+ African nations on Web3 policy readiness, blockchain innovation activity, and digital asset adoption metrics.",
    date: "December 2025",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: true,
  },
  {
    id: 15,
    category: "Published Research",
    title: "Blockchain for Agricultural Supply Chains in Africa",
    description: "Research paper examining blockchain implementations in African agricultural supply chains with case studies from Kenya, Ghana, and Ethiopia.",
    date: "November 2025",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: false,
  },
  {
    id: 16,
    category: "Published Research",
    title: "DeFi Adoption Patterns in Sub-Saharan Africa",
    description: "Empirical research on decentralised finance usage patterns, barriers to adoption, and opportunities across Sub-Saharan African markets.",
    date: "October 2025",
    author: "AWI Research Team",
    downloadUrl: "#",
    available: false,
  },
];

const CATEGORY_STYLES = {
  "Published Articles":                      { bg: "#dbeafe", text: "#1e40af" },
  "Policy Brief":                             { bg: "#ede9fe", text: "#5b21b6" },
  "Monthly African Stablecoin Adoption Report": { bg: "#dcfce7", text: "#166534" },
  "State of Web3 Africa":                    { bg: "#fef3c7", text: "#D4A017" },
  "Published Research":                       { bg: "#e0e7ff", text: "#1A1F36" },
};

function CategoryPill({ category }) {
  const s = CATEGORY_STYLES[category] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span className="inline-block text-[0.6875rem] font-semibold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}>
      {category}
    </span>
  );
}

function PublicationCard({ pub, T }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:shadow-md transition-shadow h-full">
      <CategoryPill category={pub.category} />
      <p className="text-[0.9375rem] font-bold text-secondary leading-snug">{pub.title}</p>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed flex-1">{pub.description}</p>
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
        <div>
          <p className="text-[0.75rem] text-muted-foreground">{pub.date}</p>
          <p className="text-[0.6875rem] text-muted-foreground/70">{pub.author}</p>
        </div>
        {pub.available ? (
          <a
            href={pub.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold px-4 py-2 rounded-md flex-shrink-0 transition-colors"
            style={{ backgroundColor: "#D4A017", color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
          >
            {pub.downloadUrl !== "#" ? T.downloadBtn : T.readBtn}
          </a>
        ) : (
          <span className="inline-flex items-center text-[0.75rem] font-medium px-3 py-1.5 rounded-md flex-shrink-0"
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
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const TABS = [
    { key: "all",        label: T.tabAll },
    { key: "Published Articles", label: T.tabArticles },
    { key: "Policy Brief",       label: T.tabPolicyBriefs },
    { key: "Monthly African Stablecoin Adoption Report", label: T.tabStablecoin },
    { key: "State of Web3 Africa",  label: T.tabStateOfWeb3 },
    { key: "Published Research",    label: T.tabResearch },
  ];

  const filtered = useMemo(() => {
    return PUBLICATIONS.filter(p => {
      if (activeTab !== "all" && p.category !== activeTab) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) &&
            !p.description.toLowerCase().includes(q) &&
            !p.author.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeTab, search]);

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

      {/* Sticky Tabs */}
      <div className="sticky top-[3.75rem] z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
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
            {T.showing} <strong className="text-foreground">{filtered.length}</strong> {T.of} {PUBLICATIONS.length} {T.publications}
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
          <div className="py-20 text-center text-muted-foreground">No publications match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pub => (
              <PublicationCard key={pub.id} pub={pub} T={T} />
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
            className="inline-flex items-center text-[0.875rem] font-semibold px-5 py-2.5 rounded-md flex-shrink-0 transition-colors"
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
            Stay Informed
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
                className="px-5 py-2.5 text-[0.875rem] font-semibold flex-shrink-0 transition-colors"
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