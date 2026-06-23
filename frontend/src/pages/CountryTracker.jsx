import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const REGULATORY_UPDATES = [
  { id: 1,  country: "Kenya",        flag: "🇰🇪", region: "East Africa",    title: "CMA Publishes Crypto Licensing Draft",          titleFr: "La CMA publie un projet de licences crypto",               date: "Apr 2026", category: "Licensing",            status: "Draft",              summary: "Capital Markets Authority releases draft rules for digital asset exchanges, opening a public comment period for industry stakeholders.",                                              summaryFr: "L'Autorité des marchés des capitaux publie des règles préliminaires pour les échanges d'actifs numériques, ouvrant une période de commentaires publics pour les parties prenantes du secteur.",            source: "Capital Markets Authority of Kenya" },
  { id: 2,  country: "Nigeria",      flag: "🇳🇬", region: "West Africa",    title: "CBN Issues Updated VASP Guidelines",            titleFr: "La CBN publie des directives VASP actualisées",             date: "Mar 2026", category: "VASP Regulation",      status: "Active",             summary: "Central Bank of Nigeria updates VASP compliance requirements, including enhanced KYC and AML obligations for licensed operators.",                                                summaryFr: "La Banque centrale du Nigeria met à jour les exigences de conformité VASP, incluant des obligations KYC et LBC/FT renforcées pour les opérateurs agréés.",                                                 source: "Central Bank of Nigeria" },
  { id: 3,  country: "Zimbabwe",     flag: "🇿🇼", region: "Southern Africa",title: "RBZ Publishes VASP Consultation",               titleFr: "La RBZ publie une consultation VASP",                       date: "Mar 2026", category: "VASP Regulation",      status: "Consultation",       summary: "Reserve Bank of Zimbabwe opens a public consultation on a formal VASP licensing framework.",                                                                                     summaryFr: "La Banque de réserve du Zimbabwe ouvre une consultation publique sur un cadre formel de licences VASP.",                                                                                                    source: "Reserve Bank of Zimbabwe" },
  { id: 4,  country: "South Africa", flag: "🇿🇦", region: "Southern Africa",title: "FSCA Issues Institutional Custody Guidelines",  titleFr: "La FSCA publie des directives de garde institutionnelle",  date: "Feb 2026", category: "Banking Guidance",      status: "Guidance",           summary: "FSCA publishes formal rules for custody of digital assets by banks and licensed financial institutions.",                                                                        summaryFr: "La FSCA publie des règles formelles pour la garde des actifs numériques par les banques et les institutions financières agréées.",                                                                          source: "Financial Sector Conduct Authority" },
  { id: 5,  country: "Tunisia",      flag: "🇹🇳", region: "North Africa",   title: "BCT Digital Dinar Pilot Expands",               titleFr: "Le pilote du Dinar numérique de la BCT s'étend",            date: "Feb 2026", category: "CBDC",                 status: "Active",             summary: "Banque Centrale de Tunisie expands the digital dinar pilot to include retail payment use cases across the country.",                                                              summaryFr: "La Banque Centrale de Tunisie étend le pilote du dinar numérique aux cas d'usage de paiement au détail à travers le pays.",                                                                                source: "Banque Centrale de Tunisie" },
  { id: 6,  country: "Senegal",      flag: "🇸🇳", region: "West Africa",    title: "Dakar Web3 Policy Forum",                      titleFr: "Forum politique Web3 de Dakar",                             date: "Feb 2026", category: "VASP Regulation",      status: "Policy Update",      summary: "AWI co-hosts the first Francophone Web3 policy roundtable, producing recommendations on VASP licensing for UEMOA member states.",                                               summaryFr: "AWI co-organise la première table ronde francophone sur la politique Web3, produisant des recommandations sur les licences VASP pour les États membres de l'UEMOA.",                                        source: "AWI / BCEAO" },
  { id: 7,  country: "Morocco",      flag: "🇲🇦", region: "North Africa",   title: "Draft Crypto Legalization Bill Tabled",        titleFr: "Projet de loi de légalisation crypto déposé",               date: "Jan 2026", category: "VASP Regulation",      status: "Draft",              summary: "Parliament formally introduces legislation to regulate digital assets, signaling a shift from prohibition toward a supervised licensing framework.",                             summaryFr: "Le Parlement introduit formellement une législation pour réglementer les actifs numériques, signalant un passage de l'interdiction vers un cadre de licences supervisé.",                                   source: "Parliament of Morocco" },
  { id: 8,  country: "Botswana",     flag: "🇧🇼", region: "Southern Africa",title: "NBFIRA Crypto Licensing Draft Issued",         titleFr: "La NBFIRA publie un projet de licences crypto",             date: "Jan 2026", category: "Licensing",            status: "Draft",              summary: "NBFIRA publishes draft licensing rules for digital asset service providers operating in Botswana.",                                                                              summaryFr: "La NBFIRA publie des règles préliminaires de licences pour les prestataires de services sur actifs numériques opérant au Botswana.",                                                                        source: "NBFIRA Botswana" },
  { id: 9,  country: "Rwanda",       flag: "🇷🇼", region: "East Africa",    title: "VASP Licensing Framework Updated",             titleFr: "Mise à jour du cadre de licences VASP",                    date: "Jan 2026", category: "VASP Regulation",      status: "Active",             summary: "Rwanda updates its VASP compliance requirements to align with the FATF Travel Rule, effective Q1 2026.",                                                                        summaryFr: "Le Rwanda met à jour ses exigences de conformité VASP pour s'aligner sur la Travel Rule du GAFI, effective au T1 2026.",                                                                                   source: "National Bank of Rwanda" },
  { id: 10, country: "Ghana",        flag: "🇬🇭", region: "West Africa",    title: "SEC Fintech Regulatory Sandbox Opens",         titleFr: "Ouverture du bac à sable réglementaire fintech SEC",        date: "Jan 2026", category: "Licensing",            status: "Active",             summary: "Ghana SEC opens a regulatory sandbox for digital asset and fintech companies, accepting applications for the first cohort.",                                                     summaryFr: "La SEC du Ghana ouvre un bac à sable réglementaire pour les entreprises d'actifs numériques et fintech, acceptant les candidatures pour la première cohorte.",                                             source: "Securities and Exchange Commission Ghana" },
  { id: 11, country: "Egypt",        flag: "🇪🇬", region: "North Africa",   title: "CBE Issues Crypto Risk Circular",              titleFr: "La CBE publie une circulaire sur les risques crypto",        date: "Dec 2025", category: "Banking Guidance",      status: "Enforcement Action", summary: "Central Bank of Egypt reissues a formal circular on cryptocurrency risks, reaffirming restrictions on bank facilitation of crypto transactions.",                             summaryFr: "La Banque centrale d'Égypte réémet une circulaire formelle sur les risques des cryptomonnaies, réaffirmant les restrictions sur la facilitation des transactions crypto par les banques.",                 source: "Central Bank of Egypt" },
  { id: 12, country: "Cameroon",     flag: "🇨🇲", region: "Central Africa", title: "AWI Francophone Policy Workshop in Yaoundé",   titleFr: "Atelier de politique francophone AWI à Yaoundé",           date: "Dec 2025", category: "VASP Regulation",      status: "Policy Update",      summary: "AWI hosts a Web3 policy sensitization workshop for Cameroonian regulators and policymakers on VASP frameworks and AML/CFT obligations.",                                       summaryFr: "AWI organise un atelier de sensibilisation à la politique Web3 pour les régulateurs et décideurs camerounais sur les cadres VASP et les obligations LBC/FT.",                                              source: "AWI / BEAC" },
  { id: 13, country: "Nigeria",      flag: "🇳🇬", region: "West Africa",    title: "SEC Approves First Digital Asset Exchange",    titleFr: "La SEC approuve le premier échange d'actifs numériques",   date: "Nov 2025", category: "Licensing",            status: "Active",             summary: "Nigeria's SEC grants the first full operating license to a digital asset exchange under the updated digital assets framework.",                                                 summaryFr: "La SEC du Nigeria accorde la première licence d'exploitation complète à un échange d'actifs numériques dans le cadre du dispositif actualisé.",                                                            source: "Securities and Exchange Commission Nigeria" },
  { id: 14, country: "Tanzania",     flag: "🇹🇿", region: "East Africa",    title: "BoT Publishes VASP Discussion Paper",          titleFr: "La BoT publie un document de discussion VASP",              date: "Oct 2025", category: "VASP Regulation",      status: "Consultation",       summary: "Bank of Tanzania releases a public consultation on digital asset oversight and potential VASP licensing requirements.",                                                         summaryFr: "La Banque de Tanzanie publie une consultation publique sur la supervision des actifs numériques et les exigences potentielles de licences VASP.",                                                           source: "Bank of Tanzania" },
  { id: 15, country: "Tunisia",      flag: "🇹🇳", region: "North Africa",   title: "VASP Consultation Paper Released",             titleFr: "Publication du document de consultation VASP",              date: "Sep 2025", category: "VASP Regulation",      status: "Consultation",       summary: "Banque Centrale de Tunisie releases consultation on licensing requirements for virtual asset service providers.",                                                                summaryFr: "La Banque Centrale de Tunisie publie une consultation sur les exigences de licences pour les prestataires de services sur actifs virtuels.",                                                               source: "Banque Centrale de Tunisie" },
  { id: 16, country: "Zambia",       flag: "🇿🇲", region: "Southern Africa",title: "SEC Zambia Publishes Digital Asset Policy",    titleFr: "La SEC Zambie publie une politique sur les actifs numériques", date: "Sep 2025", category: "Securities Regulation", status: "Proposed",          summary: "Zambia's Securities and Exchange Commission releases draft policy for digital asset classification and licensing requirements.",                                                 summaryFr: "La Commission des valeurs mobilières de Zambie publie un projet de politique pour la classification et les exigences de licences des actifs numériques.",                                                   source: "Securities and Exchange Commission Zambia" },
  { id: 17, country: "Uganda",       flag: "🇺🇬", region: "East Africa",    title: "CMA Issues Digital Securities Framework",      titleFr: "La CMA publie un cadre pour les titres numériques",         date: "Aug 2025", category: "Securities Regulation", status: "Active",             summary: "Uganda's Capital Markets Authority publishes rules for tokenized securities offerings, providing the first formal digital asset securities guidance.",                          summaryFr: "L'Autorité des marchés des capitaux de l'Ouganda publie des règles pour les offres de titres tokenisés, constituant les premières directives formelles sur les actifs numériques.",                        source: "Capital Markets Authority Uganda" },
  { id: 18, country: "Cameroon",     flag: "🇨🇲", region: "Central Africa", title: "BEAC Issues Regional Crypto AML/CFT Guidance", titleFr: "La BEAC publie des directives régionales LBC/FT crypto",    date: "Aug 2025", category: "AML/CFT",              status: "Guidance",           summary: "Bank of Central African States issues AML/CFT guidance for member states on virtual asset service providers.",                                                                  summaryFr: "La Banque des États de l'Afrique centrale publie des directives LBC/FT pour les États membres sur les prestataires de services sur actifs virtuels.",                                                     source: "BEAC" },
  { id: 19, country: "Algeria",      flag: "🇩🇿", region: "North Africa",   title: "Finance Ministry Reaffirms Crypto Ban",        titleFr: "Le ministère des Finances réaffirme l'interdiction crypto", date: "Jun 2025", category: "VASP Regulation",      status: "Ban",                summary: "Ministry of Finance reiterates the prohibition on cryptocurrency transactions in response to growing informal market activity.",                                                 summaryFr: "Le ministère des Finances réitère l'interdiction des transactions en cryptomonnaies en réponse à une activité croissante sur le marché informel.",                                                         source: "Ministry of Finance Algeria" },
  { id: 20, country: "Ghana",        flag: "🇬🇭", region: "West Africa",    title: "e-Cedi CBDC Pilot Expansion",                 titleFr: "Extension du pilote MNBC e-Cedi",                           date: "Jul 2025", category: "CBDC",                 status: "Active",             summary: "Bank of Ghana expands the e-Cedi CBDC pilot to rural and agricultural communities, broadening financial inclusion coverage.",                                                   summaryFr: "La Banque du Ghana étend le pilote MNBC e-Cedi aux communautés rurales et agricoles, élargissant la couverture de l'inclusion financière.",                                                               source: "Bank of Ghana" },
  { id: 21, country: "Côte d'Ivoire",flag: "🇨🇮", region: "West Africa",    title: "BCEAO VASP Consultation Participation",       titleFr: "Participation à la consultation VASP de la BCEAO",          date: "Jun 2025", category: "VASP Regulation",      status: "Consultation",       summary: "Côte d'Ivoire participates in the BCEAO regional VASP licensing consultation for UEMOA member states.",                                                                        summaryFr: "La Côte d'Ivoire participe à la consultation régionale de la BCEAO sur les licences VASP pour les États membres de l'UEMOA.",                                                                             source: "BCEAO" },
  { id: 22, country: "Zambia",       flag: "🇿🇲", region: "Southern Africa",title: "Mining Blockchain Pilot Approved",             titleFr: "Approbation du pilote blockchain minier",                   date: "May 2025", category: "Digital Payments",     status: "Active",             summary: "Government approves a pilot for blockchain-based copper export tracking, supporting supply chain transparency and trade settlement.",                                           summaryFr: "Le gouvernement approuve un pilote de traçabilité des exportations de cuivre par blockchain, soutenant la transparence de la chaîne d'approvisionnement et le règlement commercial.",                     source: "Government of Zambia" },
  { id: 23, country: "South Africa", flag: "🇿🇦", region: "Southern Africa",title: "First CASP Licences Granted",                 titleFr: "Premières licences CASP accordées",                         date: "Nov 2024", category: "Licensing",            status: "Active",             summary: "FSCA grants the first batch of Crypto Asset Service Provider licences, formally recognizing licensed digital asset operators.",                                                summaryFr: "La FSCA accorde le premier lot de licences de prestataires de services sur crypto-actifs, reconnaissant formellement les opérateurs agréés d'actifs numériques.",                                         source: "Financial Sector Conduct Authority" },
  { id: 24, country: "Kenya",        flag: "🇰🇪", region: "East Africa",    title: "Finance Act Introduces Digital Asset Tax",     titleFr: "La loi de finances introduit une taxe sur les actifs numériques", date: "Mar 2024", category: "Taxation",         status: "Active",             summary: "Kenya's Finance Act imposes a 3% digital asset tax, formally acknowledging cryptocurrency within the national tax framework.",                                                  summaryFr: "La loi de finances du Kenya impose une taxe de 3% sur les actifs numériques, reconnaissant formellement les cryptomonnaies dans le cadre fiscal national.",                                               source: "Kenya Revenue Authority" },
  { id: 25, country: "Rwanda",       flag: "🇷🇼", region: "East Africa",    title: "Rwanda Enacts Virtual Asset Act",              titleFr: "Le Rwanda adopte la loi sur les actifs virtuels",           date: "Mar 2024", category: "VASP Regulation",      status: "Active",             summary: "Comprehensive legislation regulating all classes of digital assets enacted, establishing a full VASP licensing regime.",                                                        summaryFr: "Une législation complète réglementant toutes les classes d'actifs numériques est adoptée, établissant un régime complet de licences VASP.",                                                               source: "National Bank of Rwanda" },
];

const STATUS_COLORS = {
  Draft:              { bg: "#dbeafe", text: "#1e40af", dot: "#2563eb" },
  Proposed:           { bg: "#ede9fe", text: "#5b21b6", dot: "#7c3aed" },
  Active:             { bg: "#dcfce7", text: "#166534", dot: "#16a34a" },
  Consultation:       { bg: "#fef9c3", text: "#854d0e", dot: "#D4A017" },
  Licensing:          { bg: "#e0f2fe", text: "#0369a1", dot: "#0284c7" },
  "Enforcement Action": { bg: "#fee2e2", text: "#991b1b", dot: "#dc2626" },
  Guidance:           { bg: "#f0fdf4", text: "#14532d", dot: "#22c55e" },
  "Policy Update":    { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  Ban:                { bg: "#fce7f3", text: "#9d174d", dot: "#ec4899" },
};

const CATEGORY_COLORS = {
  "VASP Regulation":     { bg: "#dbeafe", text: "#1e40af" },
  "Stablecoin Policy":   { bg: "#ede9fe", text: "#5b21b6" },
  "CBDC":                { bg: "#e0f2fe", text: "#0369a1" },
  "Taxation":            { bg: "#fef3c7", text: "#92400e" },
  "Licensing":           { bg: "#dcfce7", text: "#166534" },
  "AML/CFT":             { bg: "#fee2e2", text: "#991b1b" },
  "Banking Guidance":    { bg: "#f3f4f6", text: "#374151" },
  "Securities Regulation": { bg: "#e8e8f0", text: "#1e3a5f" },
  "Digital Payments":    { bg: "#d1fae5", text: "#065f46" },
};

function StatusPill({ status, label }) {
  const c = STATUS_COLORS[status] || { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
  return (
    <span className="inline-flex items-center text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: c.dot }} />
      {label || status}
    </span>
  );
}

function CategoryBadge({ category, label }) {
  const c = CATEGORY_COLORS[category] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span className="inline-flex text-[0.6875rem] font-medium px-2 py-0.5 rounded whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {label || category}
    </span>
  );
}

const REGIONS = ["All Regions", "West Africa", "East Africa", "North Africa", "Central Africa", "Southern Africa"];
const CATEGORIES = ["All Categories", "VASP Regulation", "Stablecoin Policy", "CBDC", "Taxation", "Licensing", "AML/CFT", "Banking Guidance", "Securities Regulation", "Digital Payments"];
const STATUSES_LIST = ["All Statuses", "Draft", "Proposed", "Active", "Consultation", "Licensing", "Enforcement Action", "Guidance", "Policy Update", "Ban"];

export default function CountryTracker() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [methodOpen, setMethodOpen] = useState(false);
  const { language } = useLanguage();
  const T = t[language].tracker;

  const filtered = useMemo(() => {
    return REGULATORY_UPDATES.filter(u => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const titleToSearch = language === "fr" ? (u.titleFr || u.title) : u.title;
        const summaryToSearch = language === "fr" ? (u.summaryFr || u.summary) : u.summary;
        if (!titleToSearch.toLowerCase().includes(q) && !u.country.toLowerCase().includes(q) && !summaryToSearch.toLowerCase().includes(q) && !u.category.toLowerCase().includes(q)) return false;
      }
      if (region !== "All Regions" && u.region !== region) return false;
      if (category !== "All Categories" && u.category !== category) return false;
      if (statusFilter !== "All Statuses" && u.status !== statusFilter) return false;
      return true;
    });
  }, [search, region, category, statusFilter, language]);

  const resetFilters = () => {
    setSearch(""); setRegion("All Regions"); setCategory("All Categories"); setStatusFilter("All Statuses");
  };

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <title>Regulatory Tracker | Africa Web3 Institute</title>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>Africa Web3 Institute</p>
          <h1 className="text-[2rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-3">
            {T.pageTitle}
          </h1>
          <p className="text-[1rem] max-w-2xl mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {T.pageSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {T.lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}>
              📊 {T.countriesTracked}
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[3.75rem] z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-[240px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={T.filterSearch}
                className="w-full pl-8 pr-3 py-2 text-[0.8125rem] border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {REGIONS.map(r => <option key={r} value={r}>{T.regions?.[r] || r}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {CATEGORIES.map(c => <option key={c} value={c}>{T.categories?.[c] || c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-[0.8125rem] border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-accent">
              {STATUSES_LIST.map(s => <option key={s} value={s}>{T.statuses?.[s] || s}</option>)}
            </select>
            <button onClick={resetFilters}
              className="text-[0.8125rem] font-semibold ml-auto transition-colors"
              style={{ color: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.color = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}>
              {T.resetFilters}
            </button>
          </div>
          <p className="text-[0.75rem] text-muted-foreground mt-2">
            {T.showing} <strong className="text-foreground">{filtered.length}</strong> {T.of} {REGULATORY_UPDATES.length} {T.updates}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "960px" }}>
              <thead>
                <tr className="border-b border-border" style={{ backgroundColor: "#F9FAFB" }}>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap" style={{ position: "sticky", left: 0, backgroundColor: "#F9FAFB", zIndex: 10 }}>{T.colCountry}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.colTitle}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">{T.colDate}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">{T.colCategory}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">{T.colStatus}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.colSummary}</th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.colSource}</th>
                  <th className="px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground text-right whitespace-nowrap">{T.colProfile}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-muted-foreground text-[0.9375rem]">
                      {T.noResults}
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => (
                    <tr key={u.id}
                      className="border-b border-border/50 transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(13,44,125,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#F9FAFB"}>
                      <td className="px-4 py-4" style={{ position: "sticky", left: 0, backgroundColor: "inherit", zIndex: 1 }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[1.125rem] shrink-0">{u.flag}</span>
                          <div>
                            <p className="font-semibold text-secondary text-[0.875rem] whitespace-nowrap">{u.country}</p>
                            <p className="text-[0.6875rem] text-muted-foreground">{T.regions?.[u.region] || u.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{ maxWidth: "200px" }}>
                        <p className="text-[0.875rem] font-semibold text-secondary leading-snug">
                          {language === "fr" ? (u.titleFr || u.title) : u.title}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-[0.8125rem] text-muted-foreground whitespace-nowrap">{u.date}</td>
                      <td className="px-4 py-4"><CategoryBadge category={u.category} label={T.categories?.[u.category] || u.category} /></td>
                      <td className="px-4 py-4"><StatusPill status={u.status} label={T.statuses?.[u.status] || u.status} /></td>
                      <td className="px-4 py-4" style={{ maxWidth: "260px" }}>
                        <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
                          {language === "fr" ? (u.summaryFr || u.summary) : u.summary}
                        </p>
                      </td>
                      <td className="px-4 py-4" style={{ maxWidth: "140px" }}>
                        <p className="text-[0.75rem] text-muted-foreground/70 leading-snug">{u.source}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          to={`/country-tracker/${u.country.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="text-[0.8125rem] font-semibold transition-colors whitespace-nowrap"
                          style={{ color: "#D4A017" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#b8891a"}
                          onMouseLeave={e => e.currentTarget.style.color = "#D4A017"}>
                          {T.viewProfile}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <button onClick={() => setMethodOpen(o => !o)}
            className="w-full flex items-center justify-between px-6 py-4 text-[0.875rem] font-semibold text-secondary hover:bg-muted/30 transition-colors">
            <span>{T.methodologyToggle}</span>
            <span className="text-muted-foreground text-[1rem]">{methodOpen ? "−" : "+"}</span>
          </button>
          {methodOpen && (
            <div className="px-6 pb-5 text-[0.875rem] text-muted-foreground leading-[1.85] border-t border-border pt-4">
              {T.methodologyText}
            </div>
          )}
        </div>
      </div>

      {/* CTA Strip */}
      <section className="mt-8" style={{ backgroundColor: "#0B1437" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[1.125rem] font-semibold text-white">{T.ctaTitle}</p>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/awpii" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
              {T.ctaButton}
            </Link>
            <a href="mailto:info@africaweb3institute.org"
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
              {T.ctaSubscribe}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}