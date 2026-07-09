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

export const seedDatabaseData = async (dbInstance) => {
  console.log("Seeding AWPII and Tracker data...");

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
  
  console.log("✅ Seeded AWPII and Tracker data.");
};
