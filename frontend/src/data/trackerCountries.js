// Status values: "live" | "proposed" | "draft" | "review" | "none"
// "live" / "proposed" / "draft" mirror STRIDE's own 3 stages exactly.
// "review" and "none" are not STRIDE stages -- "review" is used only by
// legacy non-African entries (never verified against STRIDE), and "none"
// covers countries STRIDE doesn't track a stage for at all (banned / no
// framework -- shown black on STRIDE's own map).
export const STATUS = {
  live: { label: "Live", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  proposed: { label: "Proposed", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" },
  draft: { label: "Draft", color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
  review: { label: "In Review", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)" },
  none: { label: "No Framework", color: "#64748b", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.3)" },
};

export const MAP_COLORS = {
  live: "#22c55e",
  proposed: "#f97316",
  draft: "#c084fc",
  review: "#a78bfa",
  none: "#1e3a5f",
  default: "#0f2340",
};

// African country ISO alpha-3 codes (moved here from WorldMap.jsx so both
// the map and the countries table share one source of truth)
export const AFRICA_ISOS = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CPV","CMR","CAF","TCD",
  "COM","COD","COG","CIV","DJI","EGY","GNQ","ERI","SWZ","ETH",
  "GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG",
  "MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA","RWA",
  "STP","SEN","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN",
  "UGA","ZMB","ZWE","ESH",
]);

// ISO Alpha-3 → data
export const COUNTRIES = [
  { name: "European Union", flag: "🇪🇺", iso: [], status: "live", framework: "MiCA (Markets in Crypto-Assets Regulation)", types: ["Fiat-backed", "Asset-referenced"], regulator: "EBA / NCAs", since: "2024", isEU: true },
  { name: "Singapore", flag: "🇸🇬", iso: ["SGP"], status: "live", framework: "MAS Payment Services Act", types: ["Fiat-backed"], regulator: "MAS", since: "2024" },
  { name: "United Arab Emirates", flag: "🇦🇪", iso: ["ARE"], status: "live", framework: "VARA / ADGM / FSRA", types: ["Fiat-backed", "Commodity-backed"], regulator: "VARA / FSRA", since: "2023" },
  { name: "Hong Kong", flag: "🇭🇰", iso: ["HKG"], status: "live", framework: "HKMA Stablecoin Ordinance", types: ["Fiat-backed"], regulator: "HKMA", since: "2025" },
  { name: "Bahrain", flag: "🇧🇭", iso: ["BHR"], status: "live", framework: "CBB Crypto-Asset Module", types: ["Fiat-backed"], regulator: "CBB", since: "2023" },
  { name: "El Salvador", flag: "🇸🇻", iso: ["SLV"], status: "live", framework: "Bitcoin Law / Digital Assets Framework", types: ["Fiat-backed", "Crypto-backed"], regulator: "BCR", since: "2022" },
  { name: "Japan", flag: "🇯🇵", iso: ["JPN"], status: "live", framework: "Payment Services Act (Revised)", types: ["Fiat-backed"], regulator: "FSA", since: "2023" },
  { name: "Switzerland", flag: "🇨🇭", iso: ["CHE"], status: "live", framework: "DLT Act / FINMA Guidelines", types: ["Fiat-backed", "Asset-referenced"], regulator: "FINMA", since: "2021" },
  { name: "South Africa", flag: "🇿🇦", iso: ["ZAF"], status: "live", framework: "No dedicated stablecoin framework — FSB assessed \"no framework in place\" (Oct 2025); crypto assets regulated as financial products since 2022, issuance itself requires no approval; comprehensive framework expected 2026", types: ["—"], regulator: "South African Reserve Bank (SARB); Financial Sector Conduct Authority (FSCA); Financial Intelligence Centre (FIC)", since: "—" },
  { name: "Thailand", flag: "🇹🇭", iso: ["THA"], status: "live", framework: "SEC Digital Asset Decree", types: ["Fiat-backed"], regulator: "SEC TH", since: "2022" },
  { name: "Liechtenstein", flag: "🇱🇮", iso: ["LIE"], status: "live", framework: "Token and TT Service Provider Act (TVTG)", types: ["Fiat-backed", "Asset-referenced"], regulator: "FMA", since: "2020" },

  // ---- African countries confirmed "Live" (pink) on tracker.stride.sc as of Aug 2026 ----
  // Framework/regulator verified against STRIDE's own page text only where noted;
  // others link out via strideCountryUrl() until we can verify exact wording.
  { name: "Ghana", flag: "🇬🇭", iso: ["GHA"], status: "live", framework: "Virtual Asset Service Providers Act, 2025 (Act 1154)", types: ["Fiat-backed"], regulator: "Bank of Ghana (BoG); SEC", since: "2025" },
  { name: "Nigeria", flag: "🇳🇬", iso: ["NGA"], status: "live", framework: "Investment & Securities Act (ISA) 2025 — SEC Amended VASP Rules (2025); classifies stablecoins as securities", types: ["Fiat-backed"], regulator: "Securities and Exchange Commission (SEC) Nigeria; Central Bank of Nigeria (CBN)", since: "2025" },
  { name: "Cote d'Ivoire", flag: "🇨🇮", iso: ["CIV"], status: "live", framework: "AML/CFT ordinance only (Ordonnance n°2023-875) — no dedicated stablecoin issuance or licensing regime yet", types: ["—"], regulator: "BCEAO", since: "—" },
  { name: "Benin", flag: "🇧🇯", iso: ["BEN"], status: "draft", framework: "Law No. 2024-01 (VASP/AML, WAEMU harmonization) — no stablecoin-specific rules yet", types: ["—"], regulator: "BCEAO", since: "—" },
  { name: "Chad", flag: "🇹🇩", iso: ["TCD"], status: "live", framework: "COBAC Decision D-2022/071 — stablecoins prohibited for regulated institutions", types: ["—"], regulator: "COBAC; BEAC; COSUMAF", since: "—" },
  { name: "Central African Republic", flag: "🇨🇫", iso: ["CAF"], status: "live", framework: "Bitcoin legal tender (2022) repealed 2023 — now under regional COBAC prohibition", types: ["—"], regulator: "COBAC; BEAC; COSUMAF", since: "—" },
  { name: "Cameroon", flag: "🇨🇲", iso: ["CMR"], status: "live", framework: "COBAC Decision D-2022/071 — stablecoins prohibited for regulated institutions", types: ["—"], regulator: "COBAC; BEAC; COSUMAF; ANIF", since: "—" },
  { name: "Gabon", flag: "🇬🇦", iso: ["GAB"], status: "live", framework: "No Gabon-specific framework — regional COBAC prohibition applies", types: ["—"], regulator: "COBAC; BEAC; COSUMAF", since: "—" },
  { name: "Congo (the)", flag: "🇨🇬", iso: ["COG"], status: "live", framework: "COBAC Decision D-2022/071 — regional prohibition", types: ["—"], regulator: "COBAC; BEAC; COSUMAF", since: "—" },

  // STRIDE stage: "Draft" -- proposed but not yet enacted, mapped to "proposed"
  { name: "Morocco", flag: "🇲🇦", iso: ["MAR"], status: "draft", framework: "Draft Law 42.25 (Projet de Loi 42.25)", types: ["Asset-referenced"], regulator: "Bank Al-Maghrib (BAM); AMMC", since: "—" },

  { name: "Ethiopia", flag: "🇪🇹", iso: ["ETH"], status: "draft", framework: "Crypto payments banned by NBE (2022) — Birr is sole legal tender; digital asset framework still in draft", types: ["—"], regulator: "National Bank of Ethiopia (NBE)", since: "—" },
  { name: "Congo (the Democratic Republic of the)", flag: "🇨🇩", iso: ["COD"], status: "draft", framework: "No dedicated stablecoin regime — crypto allowed at own risk, exchanges not yet authorized; Digital-Asset Law pending", types: ["—"], regulator: "Banque Centrale du Congo (BCC)", since: "—" },
  { name: "Angola", flag: "🇦🇴", iso: ["AGO"], status: "draft", framework: "No stablecoin regime — crypto in regulatory gray zone; crypto mining banned since April 2024", types: ["—"], regulator: "National Bank of Angola", since: "—" },
  { name: "Namibia", flag: "🇳🇦", iso: ["NAM"], status: "draft", framework: "Virtual Assets Act (2023) — stablecoins indirectly covered as \"virtual assets,\" no dedicated category", types: ["—"], regulator: "Bank of Namibia (BON)", since: "2023" },
  { name: "Botswana", flag: "🇧🇼", iso: ["BWA"], status: "draft", framework: "Virtual Assets Act (2022) — VASP licensing (stablecoins covered as virtual assets, no dedicated category)", types: ["—"], regulator: "Non-Bank Financial Institutions Regulatory Authority (NBFIRA)", since: "2022" },
  { name: "Zambia", flag: "🇿🇲", iso: ["ZMB"], status: "draft", framework: "No enacted virtual asset or stablecoin regulation — BoZ explicitly does not regulate crypto; framework development committed for 2024-2027", types: ["—"], regulator: "Bank of Zambia (BoZ)", since: "—" },
  { name: "Zimbabwe", flag: "🇿🇼", iso: ["ZWE"], status: "proposed", framework: "No comprehensive framework — RBZ gold-backed ZiG token (2023) as sanctioned instrument; foreign stablecoins circulate unregulated", types: ["Commodity-backed"], regulator: "Reserve Bank of Zimbabwe (RBZ)", since: "—" },

  { name: "United States", flag: "🇺🇸", iso: ["USA"], status: "proposed", framework: "GENIUS Act (Senate)", types: ["Fiat-backed"], regulator: "OCC / Fed / FDIC", since: "—" },
  { name: "United Kingdom", flag: "🇬🇧", iso: ["GBR"], status: "proposed", framework: "FCA Stablecoin Regime", types: ["Fiat-backed"], regulator: "FCA", since: "—" },
  { name: "Canada", flag: "🇨🇦", iso: ["CAN"], status: "proposed", framework: "OSFI Digital Asset Guidance", types: ["Fiat-backed"], regulator: "OSFI", since: "—" },
  { name: "Australia", flag: "🇦🇺", iso: ["AUS"], status: "proposed", framework: "ASIC Digital Asset Framework", types: ["Fiat-backed"], regulator: "ASIC", since: "—" },
  { name: "Mexico", flag: "🇲🇽", iso: ["MEX"], status: "proposed", framework: "Fintech Law Amendment", types: ["Fiat-backed"], regulator: "CNBV", since: "—" },
  { name: "Turkey", flag: "🇹🇷", iso: ["TUR"], status: "proposed", framework: "CMB Crypto Asset Draft Law", types: ["Fiat-backed"], regulator: "CMB", since: "—" },
  { name: "Brazil", flag: "🇧🇷", iso: ["BRA"], status: "proposed", framework: "BACEN Virtual Asset Framework", types: ["Fiat-backed", "Crypto-backed"], regulator: "BACEN", since: "—" },
  { name: "India", flag: "🇮🇳", iso: ["IND"], status: "review", framework: "RBI Crypto Consultation Paper", types: ["Fiat-backed"], regulator: "RBI", since: "—" },
  { name: "South Korea", flag: "🇰🇷", iso: ["KOR"], status: "review", framework: "VASP Act Amendment", types: ["Fiat-backed"], regulator: "FSC", since: "—" },
  { name: "Kenya", flag: "🇰🇪", iso: ["KEN"], status: "live", framework: "Virtual Asset Service Providers Act, 2025 (No. 20 of 2025) & Regulations 2026 (LN 134/2026)", types: ["Fiat-backed"], regulator: "Central Bank of Kenya (CBK); Capital Markets Authority (CMA)", since: "2025" },
  { name: "Saudi Arabia", flag: "🇸🇦", iso: ["SAU"], status: "review", framework: "SAMA Crypto Framework", types: ["Fiat-backed"], regulator: "SAMA", since: "—" },
  { name: "Indonesia", flag: "🇮🇩", iso: ["IDN"], status: "review", framework: "OJK Virtual Asset Regulation", types: ["Fiat-backed"], regulator: "OJK", since: "—" },
  { name: "Pakistan", flag: "🇵🇰", iso: ["PAK"], status: "review", framework: "SBP Crypto Consultation", types: ["Fiat-backed"], regulator: "SBP", since: "—" },
  { name: "China", flag: "🇨🇳", iso: ["CHN"], status: "none", framework: "Private stablecoins prohibited", types: ["—"], regulator: "PBoC", since: "—" },
  { name: "Russia", flag: "🇷🇺", iso: ["RUS"], status: "none", framework: "No stablecoin framework", types: ["—"], regulator: "CBR", since: "—" },
  { name: "Algeria", flag: "🇩🇿", iso: ["DZA"], status: "none", framework: "Crypto trading banned", types: ["—"], regulator: "BA", since: "—" },
  { name: "Bolivia", flag: "🇧🇴", iso: ["BOL"], status: "none", framework: "Crypto assets prohibited", types: ["—"], regulator: "BCB", since: "—" },
];

// EU member ISO alpha-3 codes for map coloring
export const EU_ISOS = new Set([
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
  "DEU","GRC","HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD",
  "POL","PRT","ROU","SVK","SVN","ESP","SWE",
]);

export const ISSUERS = [
  { name: "Mesh", country: "South Africa", flag: "🇿🇦", coins: ["mZAR (Wrapped CBDC)"], status: "live", licensed: ["ZA"] },
  { name: "Super Money", country: "Nigeria", flag: "🇳🇬", coins: ["cNGN"], status: "live", licensed: ["NG"] },
  { name: "ZAR Universal Network", country: "South Africa", flag: "🇿🇦", coins: ["ZARSC", "ZARU"], status: "live", licensed: ["ZA"] },
  { name: "Circle Internet Financial", country: "United States", flag: "🇺🇸", coins: ["USDC", "EURC"], status: "live", licensed: ["EU", "US", "SG"] },
  { name: "Tether Operations", country: "BVI / El Salvador", flag: "🇻🇬", coins: ["USDT", "EURT", "XAUT"], status: "live", licensed: ["SV", "VG"] },
  { name: "Paxos Trust Company", country: "United States", flag: "🇺🇸", coins: ["USDP", "PYUSD"], status: "live", licensed: ["US"] },
  { name: "Société Générale – FORGE", country: "France", flag: "🇫🇷", coins: ["EURCV"], status: "live", licensed: ["EU"] },
  { name: "Standard Chartered / Zodia", country: "Hong Kong", flag: "🇭🇰", coins: ["HKD-S"], status: "live", licensed: ["HK"] },
  { name: "Ripple Payments", country: "Singapore", flag: "🇸🇬", coins: ["RLUSD"], status: "live", licensed: ["SG", "US"] },
  { name: "GMO Internet Group", country: "Japan", flag: "🇯🇵", coins: ["GYEN", "ZUSD"], status: "live", licensed: ["JP"] },
  { name: "First Digital Trust", country: "Hong Kong", flag: "🇭🇰", coins: ["FDUSD"], status: "live", licensed: ["HK"] },
  { name: "Quantoz Payments", country: "Netherlands", flag: "🇳🇱", coins: ["EURD", "USDQ"], status: "live", licensed: ["EU"] },
  { name: "PayPal / Paxos", country: "United States", flag: "🇺🇸", coins: ["PYUSD"], status: "live", licensed: ["US"] },
  { name: "Binance / BUSD", country: "Global", flag: "🌐", coins: ["BUSD"], status: "none", licensed: [] },
  { name: "Karatage", country: "UAE", flag: "🇦🇪", coins: ["KAU", "KAG"], status: "live", licensed: ["AE"] },
];

// Numeric ISO → alpha-3 (world-atlas uses numeric)
export const NUM_TO_ISO = {
  "4":"AFG","8":"ALB","12":"DZA","24":"AGO","32":"ARG","36":"AUS","40":"AUT",
  "50":"BGD","56":"BEL","64":"BTN","68":"BOL","76":"BRA","100":"BGR","104":"MMR",
  "116":"KHM","124":"CAN","144":"LKA","152":"CHL","156":"CHN","170":"COL",
  "180":"COD","188":"CRI","191":"HRV","196":"CYP","203":"CZE","208":"DNK",
  "218":"ECU","818":"EGY","231":"ETH","246":"FIN","250":"FRA","276":"DEU",
  "288":"GHA","300":"GRC","320":"GTM","332":"HTI","340":"HND","348":"HUN",
  "356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR",
  "380":"ITA","388":"JAM","392":"JPN","400":"JOR","404":"KEN","410":"KOR",
  "414":"KWT","418":"LAO","422":"LBN","426":"LSO","430":"LBR","434":"LBY",
  "438":"LIE","440":"LTU","442":"LUX","462":"MDV","466":"MLI","478":"MRT",
  "484":"MEX","504":"MAR","508":"MOZ","516":"NAM","524":"NPL","528":"NLD",
  "554":"NZL","562":"NER","566":"NGA","578":"NOR","586":"PAK","591":"PAN",
  "598":"PNG","604":"PER","608":"PHL","616":"POL","620":"PRT","634":"QAT",
  "642":"ROU","643":"RUS","682":"SAU","694":"SLE","703":"SVK","705":"SVN",
  "706":"SOM","710":"ZAF","716":"ZWE","724":"ESP","729":"SDN","748":"SWZ",
  "752":"SWE","756":"CHE","760":"SYR","762":"TJK","764":"THA","780":"TTO",
  "788":"TUN","792":"TUR","800":"UGA","804":"UKR","784":"ARE","826":"GBR",
  "840":"USA","858":"URY","860":"UZB","862":"VEN","704":"VNM","887":"YEM",
  "894":"ZMB","646":"RWA","174":"COM","232":"ERI","262":"DJI","434":"LBY",
  "270":"GMB","324":"GIN","454":"MWI","686":"SEN","834":"TZA","72":"BWA",
  "426":"LSO","516":"NAM","748":"SWZ",
};

// ISO 3166-1 numeric codes — STRIDE uses these as the `id` param
// e.g. https://tracker.stride.sc/country.html?id=288 -> Ghana (confirmed)
export const STRIDE_COUNTRY_IDS = {
  "Algeria": 12, "Angola": 24, "Benin": 204, "Botswana": 72,
  "Burkina Faso": 854, "Burundi": 108, "Cabo Verde": 132, "Cameroon": 120,
  "Central African Republic": 140, "Chad": 148, "Comoros": 174,
  "Congo (the)": 178, "Congo (the Democratic Republic of the)": 180, "Djibouti": 262, "Egypt": 818,
  "Equatorial Guinea": 226, "Eritrea": 232, "Eswatini": 748, "Ethiopia": 231,
  "Gabon": 266, "Gambia": 270, "Ghana": 288, "Guinea": 324,
  "Guinea-Bissau": 624, "Cote d'Ivoire": 384, "Kenya": 404, "Lesotho": 426,
  "Liberia": 430, "Libya": 434, "Madagascar": 450, "Malawi": 454,
  "Mali": 466, "Mauritania": 478, "Mauritius": 480, "Morocco": 504,
  "Mozambique": 508, "Namibia": 516, "Niger": 562, "Nigeria": 566,
  "Rwanda": 646, "Sao Tome and Principe": 678, "Senegal": 686,
  "Seychelles": 690, "Sierra Leone": 694, "Somalia": 706,
  "South Africa": 710, "South Sudan": 728, "Sudan": 729, "Tanzania": 834,
  "Togo": 768, "Tunisia": 788, "Uganda": 800, "Zambia": 894, "Zimbabwe": 716,
};

export function strideCountryUrl(countryName) {
  const id = STRIDE_COUNTRY_IDS[countryName];
  return id ? `https://tracker.stride.sc/country.html?id=${id}` : null;
}