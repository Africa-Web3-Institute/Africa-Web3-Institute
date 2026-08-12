import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const seedAwpiiData = [
  {
    id: "ZAF",
    key: "southafrica",
    flag: "🇿🇦",
    rank: 1,
    overall_score: 88.7,
    grade: "AA+",
    tier_color: "Green",
    momentum: "Strong Upward",
    pillars: { clarity: 93, policy_support: 88, innovation: 89, adoption: 87 },
    content: {
      en: { name: "South Africa", key_update: "CARF live; capital flow draft regs", swot: { strengths: "World-class regulatory clarity", weaknesses: "Transitional uncertainties", opportunities: "Finalize stablecoin framework", threats: "Stricter reporting" } },
      fr: { name: "Afrique du Sud", key_update: "CARF en vigueur ; projets de réglementation des flux de capitaux", swot: { strengths: "Clarté réglementaire de classe mondiale", weaknesses: "Incertitudes transitoires", opportunities: "Finaliser le cadre des stablecoins", threats: "Exigences plus strictes" } }
    }
  },
  {
    id: "KEN",
    key: "kenya",
    flag: "🇰🇪",
    rank: 2,
    overall_score: 87.4,
    grade: "AA+",
    tier_color: "Green",
    momentum: "Very Strong Upward",
    pillars: { clarity: 91, policy_support: 86, innovation: 88, adoption: 88 },
    content: {
      en: { name: "Kenya", key_update: "Draft VASP Regs 2026 released", swot: { strengths: "Africa's first standalone VASP Act", weaknesses: "High proposed capital thresholds", opportunities: "Rapid licensing rollout", threats: "Potential regulatory overlap" } },
      fr: { name: "Kenya", key_update: "Publication du projet de réglementation VASP 2026", swot: { strengths: "Première loi VASP autonome d'Afrique", weaknesses: "Des seuils de capital élevés", opportunities: "Déploiement rapide des licences", threats: "Chevauchement réglementaire potentiel" } }
    }
  },
  {
    id: "MUS",
    key: "mauritius",
    flag: "🇲🇺",
    rank: 3,
    overall_score: 85.8,
    grade: "AA-",
    tier_color: "Green",
    momentum: "Stable",
    pillars: { clarity: 89, policy_support: 86, innovation: 87, adoption: 80 },
    content: {
      en: { name: "Mauritius", key_update: "Stable mature framework" },
      fr: { name: "Maurice", key_update: "Cadre mature et stable" }
    }
  },
  {
    id: "GHA",
    key: "ghana",
    flag: "🇬🇭",
    rank: 4,
    overall_score: 84.2,
    grade: "A+",
    tier_color: "Green",
    momentum: "Very Strong Upward",
    pillars: { clarity: 85, policy_support: 86, innovation: 87, adoption: 84 },
    content: {
      en: { name: "Ghana", key_update: "Sandbox pilots active" },
      fr: { name: "Ghana", key_update: "Projets pilotes du bac à sable actifs" }
    }
  },
  {
    id: "NGA",
    key: "nigeria",
    flag: "🇳🇬",
    rank: 5,
    overall_score: 82.5,
    grade: "A",
    tier_color: "Green",
    momentum: "Steady Upward",
    pillars: { clarity: 83, policy_support: 77, innovation: 79, adoption: 93 },
    content: {
      en: { name: "Nigeria", key_update: "Strong SEC enforcement + volume leader" },
      fr: { name: "Nigeria", key_update: "Application rigoureuse de la SEC + leader en volume" }
    }
  },
  { id: "RWA", key: "rwanda", flag: "🇷🇼", rank: 6, overall_score: 83.1, grade: "A", tier_color: "Green", momentum: "Strong Upward", pillars: { clarity: 80, policy_support: 85, innovation: 85, adoption: 82 }, content: { en: { name: "Rwanda", key_update: "Draft law advancing; digital hub focus" }, fr: { name: "Rwanda", key_update: "Projet de loi en progression ; focus sur le hub numérique" } } },
  { id: "MAR", key: "morocco", flag: "🇲🇦", rank: 7, overall_score: 82.0, grade: "A", tier_color: "Green", momentum: "Upward", pillars: { clarity: 80, policy_support: 82, innovation: 83, adoption: 83 }, content: { en: { name: "Morocco", key_update: "Draft Bill 42.25 progressing" }, fr: { name: "Maroc", key_update: "Projet de loi 42.25 en progression" } } },
  { id: "SYC", key: "seychelles", flag: "🇸🇨", rank: 8, overall_score: 80.2, grade: "A-", tier_color: "Green", momentum: "Stable", pillars: { clarity: 83, policy_support: 80, innovation: 80, adoption: 77 }, content: { en: { name: "Seychelles", key_update: "Offshore licensing appeal" }, fr: { name: "Seychelles", key_update: "Attractivité des licences offshore" } } },
  { id: "NAM", key: "namibia", flag: "🇳🇦", rank: 9, overall_score: 76.8, grade: "A-", tier_color: "Green", momentum: "Steady Upward", pillars: { clarity: 77, policy_support: 76, innovation: 78, adoption: 76 }, content: { en: { name: "Namibia", key_update: "Licensing + FATF alignment" }, fr: { name: "Namibie", key_update: "Licences + alignement FATF" } } },
  { id: "BWA", key: "botswana", flag: "🇧🇼", rank: 10, overall_score: 75.6, grade: "A-", tier_color: "Green", momentum: "Steady Upward", pillars: { clarity: 75, policy_support: 76, innovation: 76, adoption: 75 }, content: { en: { name: "Botswana", key_update: "Virtual Assets Act updates" }, fr: { name: "Botswana", key_update: "Mises à jour de la loi sur les actifs virtuels" } } },
  { id: "UGA", key: "uganda", flag: "🇺🇬", rank: 11, overall_score: 74.2, grade: "A-", tier_color: "Green", momentum: "Steady Upward", content: { en: { name: "Uganda", key_update: "Grassroots strength" }, fr: { name: "Ouganda", key_update: "Force de la base communautaire" } } },
  { id: "ETH", key: "ethiopia", flag: "🇪🇹", rank: 12, overall_score: 71.8, grade: "BBB+", tier_color: "Yellow", momentum: "Steady Upward", content: { en: { name: "Ethiopia", key_update: "High adoption despite limited formal regs" }, fr: { name: "Éthiopie", key_update: "Forte adoption malgré une réglementation formelle limitée" } } },
  { id: "TZA", key: "tanzania", flag: "🇹🇿", rank: 13, overall_score: 71.5, grade: "BBB+", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Tanzania", key_update: "Cautious but active underground use" }, fr: { name: "Tanzanie", key_update: "Utilisation souterraine prudente mais active" } } },
  { id: "ZMB", key: "zambia", flag: "🇿🇲", rank: 14, overall_score: 69.4, grade: "BBB-", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Zambia", key_update: "Draft discussions ongoing" }, fr: { name: "Zambie", key_update: "Discussions sur le projet en cours" } } },
  { id: "SEN", key: "senegal", flag: "🇸🇳", rank: 15, overall_score: 64.5, grade: "BB+", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Senegal", key_update: "ECOWAS fintech influence" }, fr: { name: "Sénégal", key_update: "Influence fintech de la CEDEAO" } } },
  { id: "CIV", key: "cotedivoire", flag: "🇨🇮", rank: 16, overall_score: 64.3, grade: "BB+", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Côte d'Ivoire", key_update: "Mobile money potential" }, fr: { name: "Côte d'Ivoire", key_update: "Potentiel de l'argent mobile" } } },
  { id: "TUN", key: "tunisia", flag: "🇹🇳", rank: 17, overall_score: 63.5, grade: "BB", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Tunisia", key_update: "Underground active" }, fr: { name: "Tunisie", key_update: "Activité souterraine" } } },
  { id: "CMR", key: "cameroon", flag: "🇨🇲", rank: 18, overall_score: 58.5, grade: "BB", tier_color: "Yellow", momentum: "Stable", content: { en: { name: "Cameroon", key_update: "CEMAC restrictions persist" }, fr: { name: "Cameroun", key_update: "Les restrictions CEMAC persistent" } } },
  { id: "DZA", key: "algeria", flag: "🇩🇿", rank: 19, overall_score: 52.5, grade: "BB-", tier_color: "Red", momentum: "Stable", content: { en: { name: "Algeria", key_update: "Explicit ban" }, fr: { name: "Algérie", key_update: "Interdiction explicite" } } },
  { id: "EGY", key: "egypt", flag: "🇪🇬", rank: 20, overall_score: 41.3, grade: "B-", tier_color: "Red", momentum: "Stable", content: { en: { name: "Egypt", key_update: "Strict prohibition (Law 194/2020)" }, fr: { name: "Égypte", key_update: "Interdiction stricte (Loi 194/2020)" } } }
];

export const seedTrackerCountries = [
  { name: "European Union", flag: "🇪🇺", iso: [], status: "live", framework: "MiCA (Markets in Crypto-Assets Regulation)", types: ["Fiat-backed", "Asset-referenced"], regulator: "EBA / NCAs", since: "2024", isEU: true },
  { name: "Singapore", flag: "🇸🇬", iso: ["SGP"], status: "live", framework: "MAS Payment Services Act", types: ["Fiat-backed"], regulator: "MAS", since: "2024" },
  { name: "United Arab Emirates", flag: "🇦🇪", iso: ["ARE"], status: "live", framework: "VARA / ADGM / FSRA", types: ["Fiat-backed", "Commodity-backed"], regulator: "VARA / FSRA", since: "2023" },
  { name: "Hong Kong", flag: "🇭🇰", iso: ["HKG"], status: "live", framework: "HKMA Stablecoin Ordinance", types: ["Fiat-backed"], regulator: "HKMA", since: "2025" },
  { name: "Bahrain", flag: "🇧🇭", iso: ["BHR"], status: "live", framework: "CBB Crypto-Asset Module", types: ["Fiat-backed"], regulator: "CBB", since: "2023" },
  { name: "El Salvador", flag: "🇸🇻", iso: ["SLV"], status: "live", framework: "Bitcoin Law / Digital Assets Framework", types: ["Fiat-backed", "Crypto-backed"], regulator: "BCR", since: "2022" },
  { name: "Japan", flag: "🇯🇵", iso: ["JPN"], status: "live", framework: "Payment Services Act (Revised)", types: ["Fiat-backed"], regulator: "FSA", since: "2023" },
  { name: "Switzerland", flag: "🇨🇭", iso: ["CHE"], status: "live", framework: "DLT Act / FINMA Guidelines", types: ["Fiat-backed", "Asset-referenced"], regulator: "FINMA", since: "2021" },
  { name: "South Africa", flag: "🇿🇦", iso: ["ZAF"], status: "live", framework: "FSCA CASP Licensing", types: ["Fiat-backed"], regulator: "FSCA", since: "2024" },
  { name: "Thailand", flag: "🇹🇭", iso: ["THA"], status: "live", framework: "SEC Digital Asset Decree", types: ["Fiat-backed"], regulator: "SEC TH", since: "2022" },
  { name: "Liechtenstein", flag: "🇱🇮", iso: ["LIE"], status: "live", framework: "Token and TT Service Provider Act (TVTG)", types: ["Fiat-backed", "Asset-referenced"], regulator: "FMA", since: "2020" },
  { name: "United States", flag: "🇺🇸", iso: ["USA"], status: "proposed", framework: "GENIUS Act (Senate)", types: ["Fiat-backed"], regulator: "OCC / Fed / FDIC", since: "—" },
  { name: "United Kingdom", flag: "🇬🇧", iso: ["GBR"], status: "proposed", framework: "FCA Stablecoin Regime", types: ["Fiat-backed"], regulator: "FCA", since: "—" },
  { name: "Canada", flag: "🇨🇦", iso: ["CAN"], status: "proposed", framework: "OSFI Digital Asset Guidance", types: ["Fiat-backed"], regulator: "OSFI", since: "—" },
  { name: "Australia", flag: "🇦🇺", iso: ["AUS"], status: "proposed", framework: "ASIC Digital Asset Framework", types: ["Fiat-backed"], regulator: "ASIC", since: "—" },
  { name: "Mexico", flag: "🇲🇽", iso: ["MEX"], status: "proposed", framework: "Fintech Law Amendment", types: ["Fiat-backed"], regulator: "CNBV", since: "—" },
  { name: "Turkey", flag: "🇹🇷", iso: ["TUR"], status: "proposed", framework: "CMB Crypto Asset Draft Law", types: ["Fiat-backed"], regulator: "CMB", since: "—" },
  { name: "Brazil", flag: "🇧🇷", iso: ["BRA"], status: "proposed", framework: "BACEN Virtual Asset Framework", types: ["Fiat-backed", "Crypto-backed"], regulator: "BACEN", since: "—" },
  { name: "India", flag: "🇮🇳", iso: ["IND"], status: "review", framework: "RBI Crypto Consultation Paper", types: ["Fiat-backed"], regulator: "RBI", since: "—" },
  { name: "South Korea", flag: "🇰🇷", iso: ["KOR"], status: "review", framework: "VASP Act Amendment", types: ["Fiat-backed"], regulator: "FSC", since: "—" },
  { name: "Nigeria", flag: "🇳🇬", iso: ["NGA"], status: "review", framework: "CBN Virtual Asset Framework", types: ["Fiat-backed"], regulator: "CBN", since: "—" },
  { name: "Kenya", flag: "🇰🇪", iso: ["KEN"], status: "review", framework: "CMA Virtual Assets Policy", types: ["Fiat-backed"], regulator: "CMA", since: "—" },
  { name: "Ghana", flag: "🇬🇭", iso: ["GHA"], status: "review", framework: "BoG Fintech Sandbox", types: ["Fiat-backed"], regulator: "BoG", since: "—" },
  { name: "Saudi Arabia", flag: "🇸🇦", iso: ["SAU"], status: "review", framework: "SAMA Crypto Framework", types: ["Fiat-backed"], regulator: "SAMA", since: "—" },
  { name: "Indonesia", flag: "🇮🇩", iso: ["IDN"], status: "review", framework: "OJK Virtual Asset Regulation", types: ["Fiat-backed"], regulator: "OJK", since: "—" },
  { name: "Pakistan", flag: "🇵🇰", iso: ["PAK"], status: "review", framework: "SBP Crypto Consultation", types: ["Fiat-backed"], regulator: "SBP", since: "—" },
  { name: "China", flag: "🇨🇳", iso: ["CHN"], status: "none", framework: "Private stablecoins prohibited", types: ["—"], regulator: "PBoC", since: "—" },
  { name: "Russia", flag: "🇷🇺", iso: ["RUS"], status: "none", framework: "No stablecoin framework", types: ["—"], regulator: "CBR", since: "—" },
  { name: "Algeria", flag: "🇩🇿", iso: ["DZA"], status: "none", framework: "Crypto trading banned", types: ["—"], regulator: "BA", since: "—" },
  { name: "Bolivia", flag: "🇧🇴", iso: ["BOL"], status: "none", framework: "Crypto assets prohibited", types: ["—"], regulator: "BCB", since: "—" }
];

export const seedVisualizationsData = [
  {
    slug: "continental-adoption-index",
    title: "Continental Web3 Adoption Index (2021-2026)",
    category: "Adoption",
    type: "line",
    description: "Multi-year trend analysis of Web3 wallet activity, P2P volumes, and dApp interactions across top 10 African markets.",
    config: JSON.stringify({ xAxis: "Year", yAxis: "Adoption Index Score (0-100)", color: "#10B981" }),
    data: JSON.stringify([
      { year: "2021", Nigeria: 45, Kenya: 38, SouthAfrica: 40, Ghana: 28, Egypt: 22 },
      { year: "2022", Nigeria: 62, Kenya: 54, SouthAfrica: 52, Ghana: 41, Egypt: 30 },
      { year: "2023", Nigeria: 74, Kenya: 68, SouthAfrica: 65, Ghana: 55, Egypt: 38 },
      { year: "2024", Nigeria: 85, Kenya: 79, SouthAfrica: 76, Ghana: 68, Egypt: 49 },
      { year: "2025", Nigeria: 92, Kenya: 86, SouthAfrica: 84, Ghana: 78, Egypt: 60 },
      { year: "2026", Nigeria: 98, Kenya: 93, SouthAfrica: 90, Ghana: 85, Egypt: 72 }
    ])
  },
  {
    slug: "regulatory-sentiment-heatmap",
    title: "African Crypto Regulatory Sentiments Heatmap",
    category: "Regulation",
    type: "geo",
    description: "Classification of regulatory stances (Progressive, Neutral, Restrictive, Ban) across 54 African nations.",
    config: JSON.stringify({ legend: ["Progressive", "Neutral / Sandboxed", "Restrictive", "Ban"] }),
    data: JSON.stringify([
      { country: "South Africa", code: "ZA", status: "Progressive", score: 88.7 },
      { country: "Kenya", code: "KE", status: "Progressive", score: 87.4 },
      { country: "Mauritius", code: "MU", status: "Progressive", score: 85.8 },
      { country: "Ghana", code: "GH", status: "Neutral / Sandboxed", score: 84.2 },
      { country: "Nigeria", code: "NG", status: "Progressive", score: 82.5 },
      { country: "Rwanda", code: "RW", status: "Neutral / Sandboxed", score: 83.1 },
      { country: "Morocco", code: "MA", status: "Neutral / Sandboxed", score: 82.0 },
      { country: "Egypt", code: "EG", status: "Ban", score: 41.3 },
      { country: "Algeria", code: "DZ", status: "Ban", score: 52.5 },
      { country: "Ethiopia", code: "ET", status: "Restrictive", score: 71.8 }
    ])
  },
  {
    slug: "venture-funding-region",
    title: "Web3 Venture Funding by African Region ($M)",
    category: "Investment",
    type: "bar",
    description: "Annual venture capital inflow allocated to Web3 and blockchain startups by geographic bloc.",
    config: JSON.stringify({ unit: "$ Millions USD" }),
    data: JSON.stringify([
      { region: "West Africa", amount2023: 145, amount2024: 210, amount2025: 320 },
      { region: "Southern Africa", amount2023: 98, amount2024: 155, amount2025: 240 },
      { region: "East Africa", amount2023: 82, amount2024: 130, amount2025: 195 },
      { region: "North Africa", amount2023: 45, amount2024: 75, amount2025: 120 },
      { region: "Central Africa", amount2023: 12, amount2024: 28, amount2025: 45 }
    ])
  },
  {
    slug: "p2p-transaction-volume",
    title: "P2P Crypto Transaction Volume Trends (Monthly $B)",
    category: "Market",
    type: "line",
    description: "Monthly estimated peer-to-peer cryptocurrency transfer volumes across African OTC desks and DEXs.",
    config: JSON.stringify({ unit: "Billion USD" }),
    data: JSON.stringify([
      { month: "Jan", volume: 3.2 }, { month: "Feb", volume: 3.8 }, { month: "Mar", volume: 4.1 },
      { month: "Apr", volume: 4.5 }, { month: "May", volume: 5.0 }, { month: "Jun", volume: 5.6 },
      { month: "Jul", volume: 6.1 }, { month: "Aug", volume: 6.8 }, { month: "Sep", volume: 7.4 }
    ])
  },
  {
    slug: "stablecoin-inflation-hedge",
    title: "Stablecoin Adoption vs Fiat Currency Depreciation",
    category: "Stablecoins",
    type: "scatter",
    description: "Correlation between domestic currency inflation rate and per-capita USD stablecoin holding volume.",
    config: JSON.stringify({ xAxis: "Fiat Currency Annual Inflation (%)", yAxis: "Stablecoin Adoption Rate (%)" }),
    data: JSON.stringify([
      { country: "Nigeria", inflation: 31.7, stablecoinUse: 84 },
      { country: "Egypt", inflation: 28.1, stablecoinUse: 62 },
      { country: "Ghana", inflation: 23.2, stablecoinUse: 58 },
      { country: "Ethiopia", inflation: 29.4, stablecoinUse: 52 },
      { country: "Kenya", inflation: 6.8, stablecoinUse: 45 },
      { country: "South Africa", inflation: 5.1, stablecoinUse: 41 }
    ])
  },
  {
    slug: "defi-market-share",
    title: "DeFi Protocol Market Share in Sub-Saharan Africa",
    category: "DeFi",
    type: "donut",
    description: "Total Value Locked (TVL) distribution across primary Decentralized Finance verticals.",
    config: JSON.stringify({ format: "percentage" }),
    data: JSON.stringify([
      { label: "DEX & Swap Pools", value: 38 },
      { label: "Lending & Borrowing", value: 27 },
      { label: "Cross-Border Liquidity", value: 20 },
      { label: "Staking & Yield", value: 10 },
      { label: "Synthetic Assets", value: 5 }
    ])
  },
  {
    slug: "cbdc-progress-tracker",
    title: "African Central Bank Digital Currency (CBDC) Status",
    category: "CBDC",
    type: "radar",
    description: "Development phase evaluation (Launched, Pilot, Proof-of-Concept, Research) across major central banks.",
    config: JSON.stringify({ maxScore: 100 }),
    data: JSON.stringify([
      { country: "Nigeria (eNaira)", score: 90, status: "Live Expansion" },
      { country: "Ghana (eCedi)", score: 82, status: "Advanced Pilot" },
      { country: "South Africa (Khokha 2)", score: 78, status: "Wholesale Trial" },
      { country: "Rwanda (CBDC Study)", score: 65, status: "Feasibility Phase" },
      { country: "Kenya (CBDC Review)", score: 55, status: "Research Phase" }
    ])
  },
  {
    slug: "developer-growth-index",
    title: "African Web3 Developer & Contributor Count (2020-2026)",
    category: "Talent",
    type: "area",
    description: "Growth of active blockchain software engineers, smart contract auditors, and open-source contributors.",
    config: JSON.stringify({ unit: "Active Developers" }),
    data: JSON.stringify([
      { year: "2020", count: 1800 },
      { year: "2021", count: 4200 },
      { year: "2022", count: 9100 },
      { year: "2023", count: 16500 },
      { year: "2024", count: 28400 },
      { year: "2025", count: 42000 },
      { year: "2026", count: 58000 }
    ])
  },
  {
    slug: "crossborder-remittance-cost",
    title: "Cross-Border Remittance Cost Comparison: Web3 vs Legacy Rail (%)",
    category: "Payments",
    type: "bar",
    description: "Average fee percentage charged on $200 remittance transfers into African corridors.",
    config: JSON.stringify({ unit: "Fee Percentage (%)" }),
    data: JSON.stringify([
      { corridor: "UK to Nigeria", legacyFee: 8.5, web3Fee: 1.1 },
      { corridor: "US to Kenya", legacyFee: 7.9, web3Fee: 0.9 },
      { corridor: "SA to Zimbabwe", legacyFee: 12.4, web3Fee: 1.4 },
      { corridor: "FR to Senegal", legacyFee: 9.1, web3Fee: 1.2 },
      { corridor: "Intra-Africa Average", legacyFee: 11.2, web3Fee: 1.0 }
    ])
  },
  {
    slug: "node-distribution-map",
    title: "African Web3 Node & Validator Infrastructure Distribution",
    category: "Infrastructure",
    type: "bar",
    description: "Regional count of active Ethereum, Bitcoin, Solana, and L2 RPC/validator node hosting setups.",
    config: JSON.stringify({ unit: "Hosted Nodes" }),
    data: JSON.stringify([
      { country: "South Africa", nodes: 245 },
      { country: "Nigeria", nodes: 180 },
      { country: "Kenya", nodes: 135 },
      { country: "Ghana", nodes: 72 },
      { country: "Egypt", nodes: 48 },
      { country: "Others", nodes: 95 }
    ])
  }
];

export const seedSubscribersData = [
  { email: "policy.lead@cbn.gov.ng", name: "Oluwaseun Adeleke", segment: "policy_makers" },
  { email: "partner@africa-vc.com", name: "Amina Diallo", segment: "investors" },
  { email: "lead.dev@eth-accra.org", name: "Kwame Osei", segment: "developers" },
  { email: "senior.analyst@worldbank.org", name: "Dr. Catherine Smith", segment: "researchers" },
  { email: "founder@payflex.africa", name: "Tendai Moyo", segment: "investors" },
  { email: "crypto.reporter@techcabal.com", name: "Chidimma Eze", segment: "researchers" }
];

export const seedCampaignsData = [
  { title: "Q1 2026 African VASP Regulatory Update", subject: "New VASP Capital Requirements in Kenya & SA CARF Launch", segment: "policy_makers", sentAt: "2026-06-15T09:00:00Z", totalSent: 450, opens: 312, clicks: 184, status: "sent" },
  { title: "State of Stablecoins in Sub-Saharan Africa", subject: "Why USD Stablecoins Processed $50B+ in 2025", segment: "all", sentAt: "2026-07-01T10:00:00Z", totalSent: 1200, opens: 840, clicks: 512, status: "sent" }
];

export const seedEcosystemMetricsData = [
  { category: "Market Volume", indicator: "Annual On-Chain Volume", value: 118.5, unit: "Billion USD", country: "Sub-Saharan Africa", year: 2025, growthRate: 34.2 },
  { category: "Adoption", indicator: "Estimated Crypto Users", value: 54.0, unit: "Millions", country: "Continental Africa", year: 2026, growthRate: 28.5 },
  { category: "Investment", indicator: "Total Web3 Funding Raised", value: 890.0, unit: "Million USD", country: "Continental Africa", year: 2025, growthRate: 42.0 },
  { category: "Regulation", indicator: "Licensed VASPs & Sandbox Pilots", value: 142.0, unit: "Entities", country: "Top 10 Markets", year: 2026, growthRate: 65.0 }
];

export const seedStartupsData = [
  { name: "Yellow Card", country: "Nigeria", category: "Payments & Exchange", fundingStage: "Series B", fundingTotalUsd: 85000000, foundedYear: 2019, description: "Pan-African stablecoin payment ramp operating in 20+ countries.", website: "https://yellowcard.io", activeUsers: 1400000 },
  { name: "Fonbnk", country: "Kenya", category: "DeFi Infrastructure", fundingStage: "Seed", fundingTotalUsd: 3500000, foundedYear: 2020, description: "Airtime-to-Crypto decentralized payment gateway for unbanked populations.", website: "https://fonbnk.com", activeUsers: 450000 },
  { name: "Jambo", country: "Congo DRC", category: "Web3 Infrastructure", fundingStage: "Series A", fundingTotalUsd: 30000000, foundedYear: 2021, description: "Web3 mobile phone and digital onboarding ecosystem for emerging markets.", website: "https://jambo.technology", activeUsers: 800000 },
  { name: "VALR", country: "South Africa", category: "Crypto Exchange", fundingStage: "Series B", fundingTotalUsd: 55000000, foundedYear: 2018, description: "FSCA licensed crypto exchange with high liquidity orderbook.", website: "https://valr.com", activeUsers: 750000 },
  { name: "Nestcoin", country: "Nigeria", category: "Venture & Products", fundingStage: "Pre-Series A", fundingTotalUsd: 9000000, foundedYear: 2021, description: "Building Onboard wallet and web3 modern financial access tools.", website: "https://nestcoin.com", activeUsers: 300000 },
  { name: "Kotani Pay", country: "Kenya", category: "Cross-Border Payments", fundingStage: "Seed", fundingTotalUsd: 2000000, foundedYear: 2020, description: "Middleware bringing Web3 stablecoins to USSD mobile money rails.", website: "https://kotanipay.com", activeUsers: 210000 }
];

export const seedPublicationsData = [
  { id: 1, title: "State of Web3 in Africa 2026 Report", description: "Comprehensive analysis of crypto adoption, regulations, and financial inclusion across 54 African nations.", category: "Annual Report", author: "Africa Web3 Institute Research Team", status: "published", date: "2026-01-15", available: 1, downloadUrl: "/downloads/state-of-web3-africa-2026.pdf", downloads: 1420 },
  { id: 2, title: "African Stablecoin Policy Framework", description: "Policy guidelines for central banks and financial regulators on USD and local currency stablecoins.", category: "Policy Brief", author: "Regulatory Working Group", status: "published", date: "2026-03-10", available: 1, downloadUrl: "/downloads/african-stablecoin-policy-framework.pdf", downloads: 890 },
  { id: 3, title: "Sub-Saharan DeFi & Financial Inclusion", description: "Empirical study on decentralised lending, peer-to-peer liquidity, and unbanked population onboarding.", category: "Academic Paper", author: "Dr. Catherine Smith & Research Fellows", status: "published", date: "2026-05-22", available: 1, downloadUrl: "/downloads/subsaharan-defi-inclusion.pdf", downloads: 630 }
];

export const seedCitationsData = [

  { publicationId: 1, citationSource: "World Bank Policy Research Working Paper No. 10452", sourceType: "policy_doc", citationDate: "2025-11-12", citationUrl: "https://worldbank.org/research", quote: "As documented by the Africa Web3 Institute, stablecoin adoption in Sub-Saharan Africa serves primarily as inflation hedge..." },
  { publicationId: 1, citationSource: "African Development Bank Fintech Review 2025", sourceType: "academic", citationDate: "2025-12-04", citationUrl: "https://afdb.org/reports", quote: "Referencing Africa Web3 Institute data, VASP regulatory framework implementation has accelerated in 5 Key SACU markets." },
  { publicationId: 2, citationSource: "TechCrunch African Market Analysis", sourceType: "news", citationDate: "2026-02-18", citationUrl: "https://techcrunch.com", quote: "According to Africa Web3 Institute's latest publication, remittance costs dropped by 85% when routed through local stablecoin rails." }
];

export const seedContactMessagesData = [
  { name: "Dr. Kojo Mensah", email: "kmensah@ug.edu.gh", organization: "University of Ghana Law School", subject: "Partnership on Regulatory Research", message: "We would like to collaborate with Africa Web3 Institute on a joint academic paper regarding VASP taxation in West Africa.", status: "unread" },
  { name: "Sarah Jenkins", email: "sjenkins@fintech-fund.com", organization: "Global Frontier VC", subject: "State of Web3 Data Access Request", message: "Hi team, we are interested in subscribing to your raw startup intelligence API for investment due diligence.", status: "read" }
];

export const seedDatabaseData = async (dbInstance) => {
  console.log("Seeding AWPII, Tracker, Visualizations, Newsletter, Startups, Metrics, Citations, and Contact Data...");

  // Seed AWPII
  for (const item of seedAwpiiData) {
    const { key, overall_score, ...rest } = item;
    const existing = dbInstance.get('SELECT * FROM awpii_scores WHERE country = ?', [key]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO awpii_scores (country, score, details) VALUES (?, ?, ?)',
        [key, overall_score, JSON.stringify(rest)]
      );
    }
  }

  // Seed Tracker Status
  for (const item of seedTrackerCountries) {
    const { name, status, ...rest } = item;
    const existing = dbInstance.get('SELECT * FROM tracker_status WHERE country = ?', [name]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO tracker_status (country, status, details) VALUES (?, ?, ?)',
        [name, status, JSON.stringify(rest)]
      );
    }
  }

  // Seed Visualizations (Week 4 KPI)
  for (const item of seedVisualizationsData) {
    const existing = dbInstance.get('SELECT * FROM visualizations WHERE slug = ?', [item.slug]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO visualizations (slug, title, category, type, description, config, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.slug, item.title, item.category, item.type, item.description, item.config, item.data]
      );
    }
  }

  // Seed Newsletter Subscribers & Campaigns (Week 5 KPI)
  for (const item of seedSubscribersData) {
    const existing = dbInstance.get('SELECT * FROM subscribers WHERE email = ?', [item.email]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO subscribers (email, name, segment) VALUES (?, ?, ?)',
        [item.email, item.name, item.segment]
      );
    }
  }

  for (const item of seedCampaignsData) {
    const existing = dbInstance.get('SELECT * FROM newsletter_campaigns WHERE title = ?', [item.title]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO newsletter_campaigns (title, subject, segment, sentAt, totalSent, opens, clicks, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [item.title, item.subject, item.segment, item.sentAt, item.totalSent, item.opens, item.clicks, item.status]
      );
    }
  }

  // Seed Ecosystem Metrics & Startups (Week 6 KPI)
  for (const item of seedEcosystemMetricsData) {
    const existing = dbInstance.get('SELECT * FROM ecosystem_metrics WHERE category = ? AND indicator = ?', [item.category, item.indicator]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO ecosystem_metrics (category, indicator, value, unit, country, year, growthRate) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.category, item.indicator, item.value, item.unit, item.country, item.year, item.growthRate]
      );
    }
  }

  for (const item of seedStartupsData) {
    const existing = dbInstance.get('SELECT * FROM web3_startups WHERE name = ?', [item.name]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO web3_startups (name, country, category, fundingStage, fundingTotalUsd, foundedYear, description, website, activeUsers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.name, item.country, item.category, item.fundingStage, item.fundingTotalUsd, item.foundedYear, item.description, item.website, item.activeUsers]
      );
    }
  }

  // Seed Publications & Citations (Week 7 KPI)
  for (const item of seedPublicationsData) {
    const existing = dbInstance.get('SELECT * FROM publications WHERE id = ? OR title = ?', [item.id, item.title]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO publications (id, title, description, category, author, status, date, available, downloadUrl, downloads) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.title, item.description, item.category, item.author, item.status, item.date, item.available, item.downloadUrl, item.downloads]
      );
    }
  }

  for (const item of seedCitationsData) {
    const existing = dbInstance.get('SELECT * FROM citations WHERE citationSource = ?', [item.citationSource]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO citations (publicationId, citationSource, sourceType, citationDate, citationUrl, quote) VALUES (?, ?, ?, ?, ?, ?)',
        [item.publicationId, item.citationSource, item.sourceType, item.citationDate, item.citationUrl, item.quote]
      );
    }
  }


  // Seed Contact Form Messages
  for (const item of seedContactMessagesData) {
    const existing = dbInstance.get('SELECT * FROM contact_messages WHERE email = ? AND subject = ?', [item.email, item.subject]);
    if (!existing) {
      dbInstance.run(
        'INSERT INTO contact_messages (name, email, organization, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
        [item.name, item.email, item.organization, item.subject, item.message, item.status]
      );
    }
  }
  
  console.log("✅ Seeded AWPII, Tracker, Visualizations (10 items), Newsletter, State of Web3, Citations, and Contact Data.");
};

