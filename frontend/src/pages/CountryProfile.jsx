import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import awpiiData from "../data/awpiiData";

// ─── Country Data ────────────────────────────────────────────────────────────
const COUNTRY_PROFILES = {
  nigeria: {
    name: "Nigeria", flag: "🇳🇬", region: "West Africa", status: "Emerging", score: 74,
    policy: 74, innovation: 89, adoption: 91, risk: "Medium", lastUpdated: "March 2026",
    summary: "Nigeria is Africa's most active Web3 market with a large developer community and high grassroots crypto adoption. The SEC and CBN have issued evolving frameworks for VASPs and digital assets, though regulatory clarity remains incomplete. P2P trading volumes remain among the highest globally. The government has signaled intent to position Lagos as a continental fintech and blockchain hub.",
    summaryFr: "Le Nigeria est le marché Web3 le plus actif d'Afrique avec une large communauté de développeurs et une forte adoption crypto. Les volumes P2P restent parmi les plus élevés au monde. Le gouvernement a signalé son intention de positionner Lagos comme un hub continental fintech et blockchain.",
    focusAreas: ["VASP Licensing", "Stablecoin Policy", "P2P Regulation", "Crypto Taxation", "SEC Digital Asset Framework"],
    focusAreasFr: ["Licences VASP", "Politique Stablecoin", "Réglementation P2P", "Fiscalité Crypto", "Cadre Actifs Numériques SEC"],
    assets: {
      crypto: { status: "Emerging", note: "SEC framework in place, CBN restrictions partially lifted", noteFr: "Cadre SEC en place, restrictions CBN partiellement levées" },
      stablecoins: { status: "Emerging", note: "eNaira CBDC launched, private stablecoins unregulated", noteFr: "MNBC eNaira lancée, stablecoins privés non réglementés" },
      defi: { status: "Undefined", note: "No specific DeFi regulation yet", noteFr: "Pas encore de réglementation DeFi spécifique" },
      nfts: { status: "Undefined", note: "Not yet addressed in regulation", noteFr: "Pas encore traité dans la réglementation" },
      cbdc: { status: "Active", note: "eNaira launched October 2021, expanded in 2024", noteFr: "eNaira lancé en octobre 2021, étendu en 2024" },
      p2p: { status: "Emerging", note: "Restrictions partially lifted in 2025", noteFr: "Restrictions partiellement levées en 2025" },
    },
    timeline: [
      { date: "March 2026", title: "CBN Issues Updated VASP Guidelines", desc: "Central Bank updates virtual asset service provider compliance requirements.", severity: "Positive", content: { en: { title: "CBN Issues Updated VASP Guidelines", desc: "Central Bank updates virtual asset service provider compliance requirements." }, fr: { title: "La CBN publie des directives VASP mises à jour", desc: "La Banque centrale met à jour les exigences de conformité pour les prestataires de services sur actifs virtuels." } } },
      { date: "November 2025", title: "SEC Approves First Digital Asset Exchange", desc: "Nigeria's SEC grants first full operating license to a digital asset exchange.", severity: "Positive", content: { en: { title: "SEC Approves First Digital Asset Exchange", desc: "Nigeria's SEC grants first full operating license to a digital asset exchange." }, fr: { title: "La SEC approuve la première bourse d'actifs numériques", desc: "La SEC du Nigeria accorde la première licence complète à une bourse d'actifs numériques." } } },
      { date: "June 2025", title: "P2P Trading Restrictions Partially Lifted", desc: "CBN eases restrictions on P2P crypto trading platforms.", severity: "Neutral", content: { en: { title: "P2P Trading Restrictions Partially Lifted", desc: "CBN eases restrictions on P2P crypto trading platforms." }, fr: { title: "Levée partielle des restrictions P2P", desc: "La CBN assouplit les restrictions sur les plateformes de trading crypto P2P." } } },
      { date: "February 2024", title: "Binance Exits Nigerian Market", desc: "Binance suspends Nigerian operations following regulatory standoff with government.", severity: "Restrictive", content: { en: { title: "Binance Exits Nigerian Market", desc: "Binance suspends Nigerian operations following regulatory standoff with government." }, fr: { title: "Binance quitte le marché nigérian", desc: "Binance suspend ses opérations au Nigeria suite à un bras de fer réglementaire." } } },
      { date: "February 2021", title: "CBN Bans Banks from Servicing Crypto", desc: "Central Bank directs banks to close accounts of crypto exchanges.", severity: "Restrictive", content: { en: { title: "CBN Bans Banks from Servicing Crypto", desc: "Central Bank directs banks to close accounts of crypto exchanges." }, fr: { title: "La CBN interdit aux banques de traiter les cryptos", desc: "La Banque centrale ordonne aux banques de fermer les comptes des plateformes d'échange crypto." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Evolving framework with some enforcement unpredictability" },
      enforcement: { level: "Medium", note: "Active enforcement but inconsistent application" },
      market: { level: "Low", note: "Largest crypto market in Africa with deep liquidity" },
    },
    trend: [45, 52, 61, 68, 74],
  },
  rwanda: {
    name: "Rwanda", flag: "🇷🇼", region: "East Africa", status: "Regulated", score: 88,
    policy: 88, innovation: 82, adoption: 79, risk: "Low", lastUpdated: "January 2026",
    summary: "Rwanda stands as Africa's leading regulated Web3 jurisdiction, having enacted comprehensive virtual asset legislation ahead of most continental peers. The National Bank of Rwanda and Rwanda Fintech Foundation have jointly developed a clear licensing regime for VASPs. Kigali's ambition to become Africa's fintech capital is supported by progressive government policy and smart city infrastructure investments.",
    summaryFr: "Le Rwanda est la juridiction Web3 réglementée leader en Afrique, ayant adopté une législation complète sur les actifs virtuels avant la plupart de ses pairs continentaux. L'ambition de Kigali de devenir la capitale fintech africaine est soutenue par une politique gouvernementale progressiste.",
    focusAreas: ["VASP Licensing", "Digital Asset Legislation", "Fintech Sandbox", "Blockchain in Public Services", "CBDC Pilot"],
    focusAreasFr: ["Licences VASP", "Législation Actifs Numériques", "Bac à Sable Fintech", "Blockchain Services Publics", "Pilote MNBC"],
    assets: {
      crypto: { status: "Regulated", note: "Full VASP licensing regime in effect since 2024", noteFr: "Régime complet de licences VASP en vigueur depuis 2024" },
      stablecoins: { status: "Regulated", note: "Permitted under VASP framework with reserve requirements", noteFr: "Autorisés sous le cadre VASP avec exigences de réserves" },
      defi: { status: "Emerging", note: "Sandbox framework for DeFi protocols under review", noteFr: "Cadre bac à sable pour protocoles DeFi en cours d'examen" },
      nfts: { status: "Emerging", note: "Addressed under broader digital asset rules", noteFr: "Traités dans le cadre plus large des actifs numériques" },
      cbdc: { status: "Pilot", note: "Digital Rwandan Franc pilot initiated in 2025", noteFr: "Pilote du Franc rwandais numérique lancé en 2025" },
      p2p: { status: "Regulated", note: "Allowed with KYC/AML requirements", noteFr: "Autorisé avec exigences KYC/AML" },
    },
    timeline: [
      { date: "January 2026", title: "VASP Licensing Framework Updated", desc: "Rwanda updates compliance requirements to align with FATF Travel Rule.", severity: "Positive", content: { en: { title: "VASP Licensing Framework Updated", desc: "Rwanda updates compliance requirements to align with FATF Travel Rule." }, fr: { title: "Mise à jour du cadre de licences VASP", desc: "Le Rwanda met à jour les exigences de conformité pour s'aligner sur la Travel Rule du GAFI." } } },
      { date: "September 2025", title: "Digital Franc Pilot Expands", desc: "National Bank expands CBDC pilot to 50,000 users across Kigali.", severity: "Positive", content: { en: { title: "Digital Franc Pilot Expands", desc: "National Bank expands CBDC pilot to 50,000 users across Kigali." }, fr: { title: "Expansion du projet pilote du franc numérique", desc: "La Banque nationale étend le projet pilote MNBC à 50 000 utilisateurs à Kigali." } } },
      { date: "March 2024", title: "Rwanda Enacts Virtual Asset Act", desc: "Comprehensive legislation regulating all classes of digital assets enacted.", severity: "Positive", content: { en: { title: "Rwanda Enacts Virtual Asset Act", desc: "Comprehensive legislation regulating all classes of digital assets enacted." }, fr: { title: "Le Rwanda adopte la loi sur les actifs virtuels", desc: "Une législation complète réglementant toutes les classes d'actifs numériques est adoptée." } } },
      { date: "July 2023", title: "Kigali Fintech Hub Launched", desc: "Government launches dedicated fintech accelerator supporting Web3 startups.", severity: "Positive", content: { en: { title: "Kigali Fintech Hub Launched", desc: "Government launches dedicated fintech accelerator supporting Web3 startups." }, fr: { title: "Lancement du hub Fintech de Kigali", desc: "Le gouvernement lance un accélérateur fintech dédié soutenant les startups Web3." } } },
      { date: "January 2022", title: "Regulatory Sandbox Opens", desc: "National Bank opens first regulatory sandbox for blockchain and digital asset firms.", severity: "Positive", content: { en: { title: "Regulatory Sandbox Opens", desc: "National Bank opens first regulatory sandbox for blockchain and digital asset firms." }, fr: { title: "Ouverture du bac à sable réglementaire", desc: "La Banque nationale ouvre le premier bac à sable réglementaire pour les entreprises blockchain." } } },
    ],
    riskScores: {
      regulatory: { level: "Low", note: "Clear, comprehensive legislative framework in place" },
      enforcement: { level: "Low", note: "Consistent and transparent enforcement regime" },
      market: { level: "Low", note: "Stable regulatory environment supports institutional entry" },
    },
    trend: [40, 55, 68, 78, 88],
  },
  "south-africa": {
    name: "South Africa", flag: "🇿🇦", region: "Southern Africa", status: "Regulated", score: 81,
    policy: 81, innovation: 76, adoption: 72, risk: "Low", lastUpdated: "February 2026",
    summary: "South Africa has developed one of Africa's most mature regulatory frameworks for digital assets, with the FSCA declaring crypto assets as financial products in 2022 and issuing CASP licences from 2024. The Reserve Bank continues to monitor systemic risk while enabling measured innovation. South Africa is the most liquid institutional market for digital assets on the continent.",
    summaryFr: "L'Afrique du Sud a développé l'un des cadres réglementaires les plus matures d'Afrique pour les actifs numériques. La FSCA a déclaré les actifs crypto comme produits financiers en 2022 et délivre des licences CASP depuis 2024. C'est le marché institutionnel le plus liquide pour les actifs numériques sur le continent.",
    focusAreas: ["CASP Licensing", "Crypto Taxation", "AML/CFT Compliance", "Reserve Bank Oversight", "Institutional Custody"],
    focusAreasFr: ["Licences CASP", "Fiscalité Crypto", "Conformité LBC/FT", "Supervision Banque de Réserve", "Garde Institutionnelle"],
    assets: {
      crypto: { status: "Regulated", note: "FSCA declared crypto a financial product; CASP licenses active", noteFr: "FSCA a déclaré les cryptos produits financiers ; licences CASP actives" },
      stablecoins: { status: "Regulated", note: "Covered under CASP framework with conditions", noteFr: "Couverts par le cadre CASP avec conditions" },
      defi: { status: "Emerging", note: "FSCA exploring regulatory approach; no formal rules yet", noteFr: "FSCA explore l'approche réglementaire ; pas encore de règles formelles" },
      nfts: { status: "Emerging", note: "Art and utility NFTs under FSCA review", noteFr: "NFTs d'art et d'utilité sous examen FSCA" },
      cbdc: { status: "Pilot", note: "Project Khokha 2 wholesale CBDC completed trials", noteFr: "Projet Khokha 2 MNBC de gros essais terminés" },
      p2p: { status: "Regulated", note: "Allowed under general financial regulations", noteFr: "Autorisé sous les réglementations financières générales" },
    },
    timeline: [
      { date: "February 2026", title: "FSCA Issues Institutional Custody Guidelines", desc: "Formal rules for custody of digital assets by banks and financial institutions.", severity: "Positive", content: { en: { title: "FSCA Issues Institutional Custody Guidelines", desc: "Formal rules for custody of digital assets by banks and financial institutions." }, fr: { title: "La FSCA publie des directives sur la garde institutionnelle", desc: "Règles formelles pour la garde d'actifs numériques par les banques et institutions financières." } } },
      { date: "November 2024", title: "First CASP Licences Granted", desc: "FSCA grants first batch of Crypto Asset Service Provider licences.", severity: "Positive", content: { en: { title: "First CASP Licences Granted", desc: "FSCA grants first batch of Crypto Asset Service Provider licences." }, fr: { title: "Premières licences CASP accordées", desc: "La FSCA accorde le premier lot de licences de prestataire de services d'actifs crypto." } } },
      { date: "June 2023", title: "CASP Registration Opens", desc: "FSCA begins accepting applications for crypto asset service provider registration.", severity: "Positive", content: { en: { title: "CASP Registration Opens", desc: "FSCA begins accepting applications for crypto asset service provider registration." }, fr: { title: "Ouverture des inscriptions CASP", desc: "La FSCA commence à accepter les demandes d'enregistrement des prestataires de services d'actifs crypto." } } },
      { date: "October 2022", title: "Crypto Declared Financial Product", desc: "FSCA officially declares crypto assets as financial products under the FAIS Act.", severity: "Positive", content: { en: { title: "Crypto Declared Financial Product", desc: "FSCA officially declares crypto assets as financial products under the FAIS Act." }, fr: { title: "Les cryptos déclarées produits financiers", desc: "La FSCA déclare officiellement les actifs crypto comme produits financiers en vertu de la loi FAIS." } } },
      { date: "April 2021", title: "SARB Issues Crypto Position Paper", desc: "South African Reserve Bank publishes position paper on crypto assets.", severity: "Neutral", content: { en: { title: "SARB Issues Crypto Position Paper", desc: "South African Reserve Bank publishes position paper on crypto assets." }, fr: { title: "La SARB publie un document de position sur les cryptos", desc: "La Banque de réserve sud-africaine publie un document de position sur les actifs crypto." } } },
    ],
    riskScores: {
      regulatory: { level: "Low", note: "Advanced regulatory framework with clear licensing pathway" },
      enforcement: { level: "Low", note: "FSCA actively monitoring and enforcing compliance" },
      market: { level: "Low", note: "Deep institutional market with major exchanges operating legally" },
    },
    trend: [42, 55, 65, 75, 81],
  },
  kenya: {
    name: "Kenya", flag: "🇰🇪", region: "East Africa", status: "Emerging", score: 70,
    policy: 70, innovation: 75, adoption: 80, risk: "Medium", lastUpdated: "April 2026",
    summary: "Kenya has one of Africa's most digitally active populations and a thriving mobile money ecosystem that provides a foundation for Web3 adoption. The Capital Markets Authority and Central Bank have been developing frameworks for digital assets, though formal licensing remains pending. Kenya's developer community is among the continent's most active.",
    summaryFr: "Le Kenya a l'une des populations les plus actives numériquement d'Afrique et un écosystème d'argent mobile florissant. L'Autorité des marchés de capitaux et la Banque centrale développent des cadres pour les actifs numériques. La communauté de développeurs kenyane est parmi les plus actives du continent.",
    focusAreas: ["VASP Regulation", "Mobile Money Integration", "CBK Digital Shilling", "Capital Markets Framework", "Developer Ecosystem"],
    focusAreasFr: ["Réglementation VASP", "Intégration Argent Mobile", "Shilling Numérique CBK", "Cadre Marchés de Capitaux", "Écosystème Développeurs"],
    assets: {
      crypto: { status: "Emerging", note: "CMA reviewing crypto framework; informal market active", noteFr: "CMA examine le cadre crypto ; marché informel actif" },
      stablecoins: { status: "Emerging", note: "Under review by CBK; MPESA integration pilots underway", noteFr: "En cours d'examen par la CBK ; pilotes d'intégration MPESA en cours" },
      defi: { status: "Undefined", note: "No formal rules; developer activity high", noteFr: "Pas de règles formelles ; forte activité des développeurs" },
      nfts: { status: "Undefined", note: "Not yet regulated", noteFr: "Pas encore réglementé" },
      cbdc: { status: "Pilot", note: "Central Bank exploring digital shilling", noteFr: "La Banque centrale explore le shilling numérique" },
      p2p: { status: "Emerging", note: "Active P2P market; informal regulatory stance", noteFr: "Marché P2P actif ; position réglementaire informelle" },
    },
    timeline: [
      { date: "April 2026", title: "CMA Publishes Crypto Licensing Draft", desc: "Capital Markets Authority releases draft rules for digital asset exchanges.", severity: "Positive", content: { en: { title: "CMA Publishes Crypto Licensing Draft", desc: "Capital Markets Authority releases draft rules for digital asset exchanges." }, fr: { title: "La CMA publie un projet de licences crypto", desc: "L'Autorité des marchés de capitaux publie un projet de règles pour les bourses d'actifs numériques." } } },
      { date: "August 2025", title: "Central Bank Launches CBDC Study", desc: "CBK commissions feasibility study for a digital Kenyan Shilling.", severity: "Neutral", content: { en: { title: "Central Bank Launches CBDC Study", desc: "CBK commissions feasibility study for a digital Kenyan Shilling." }, fr: { title: "La Banque centrale lance une étude MNBC", desc: "La CBK commande une étude de faisabilité pour un shilling kenyan numérique." } } },
      { date: "March 2024", title: "Finance Act Introduces Crypto Tax", desc: "Kenya imposes 3% digital asset tax, providing formal acknowledgment of the sector.", severity: "Neutral", content: { en: { title: "Finance Act Introduces Crypto Tax", desc: "Kenya imposes 3% digital asset tax, providing formal acknowledgment of the sector." }, fr: { title: "La loi de finances introduit une taxe crypto", desc: "Le Kenya impose une taxe de 3% sur les actifs numériques, reconnaissant formellement le secteur." } } },
      { date: "January 2023", title: "CMA Issues Crypto Caution Notice", desc: "Capital Markets Authority warns investors of unregulated crypto activities.", severity: "Restrictive", content: { en: { title: "CMA Issues Crypto Caution Notice", desc: "Capital Markets Authority warns investors of unregulated crypto activities." }, fr: { title: "La CMA émet un avis de prudence sur les cryptos", desc: "L'Autorité des marchés de capitaux met en garde les investisseurs contre les activités crypto non réglementées." } } },
      { date: "June 2021", title: "VASP Task Force Formed", desc: "Government forms inter-agency task force to develop digital asset framework.", severity: "Neutral", content: { en: { title: "VASP Task Force Formed", desc: "Government forms inter-agency task force to develop digital asset framework." }, fr: { title: "Formation du groupe de travail VASP", desc: "Le gouvernement forme un groupe de travail inter-agences pour développer un cadre pour les actifs numériques." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Framework in development; interim uncertainty for operators" },
      enforcement: { level: "Medium", note: "Selective enforcement pending full framework" },
      market: { level: "Low", note: "Strong organic adoption and liquid informal markets" },
    },
    trend: [38, 48, 56, 63, 70],
  },
  ghana: {
    name: "Ghana", flag: "🇬🇭", region: "West Africa", status: "Emerging", score: 65,
    policy: 65, innovation: 70, adoption: 72, risk: "Medium", lastUpdated: "January 2026",
    summary: "Ghana has taken a cautious but forward-looking approach to digital asset regulation, with the Bank of Ghana launching a CBDC (e-Cedi) and the Securities and Exchange Commission developing a regulatory sandbox. The country's fintech ecosystem is growing rapidly, and government engagement with the Web3 space has increased notably since 2024.",
    summaryFr: "Le Ghana a adopté une approche prudente mais tournée vers l'avenir en matière de réglementation des actifs numériques. La Banque du Ghana a lancé une MNBC (e-Cedi) et la SEC développe un bac à sable réglementaire. L'écosystème fintech croît rapidement.",
    focusAreas: ["e-Cedi CBDC", "SEC Sandbox", "VASP Registration", "Crypto Taxation", "Fintech Integration"],
    focusAreasFr: ["MNBC e-Cedi", "Bac à Sable SEC", "Enregistrement VASP", "Fiscalité Crypto", "Intégration Fintech"],
    assets: {
      crypto: { status: "Emerging", note: "SEC developing framework; informal use prevalent", noteFr: "SEC développe un cadre ; usage informel répandu" },
      stablecoins: { status: "Emerging", note: "Under review alongside CBDC development", noteFr: "En cours d'examen parallèlement au développement MNBC" },
      defi: { status: "Undefined", note: "No regulatory guidance issued", noteFr: "Aucune directive réglementaire publiée" },
      nfts: { status: "Undefined", note: "Not yet addressed", noteFr: "Pas encore traité" },
      cbdc: { status: "Pilot", note: "e-Cedi CBDC pilot launched 2021; expanded 2024", noteFr: "Pilote MNBC e-Cedi lancé en 2021 ; étendu en 2024" },
      p2p: { status: "Emerging", note: "Active market; informal regulatory tolerance", noteFr: "Marché actif ; tolérance réglementaire informelle" },
    },
    timeline: [
      { date: "January 2026", title: "SEC Fintech Sandbox Opens", desc: "Ghana SEC opens regulatory sandbox for digital asset and fintech companies.", severity: "Positive", content: { en: { title: "SEC Fintech Sandbox Opens", desc: "Ghana SEC opens regulatory sandbox for digital asset and fintech companies." }, fr: { title: "Ouverture du bac à sable fintech de la SEC", desc: "La SEC du Ghana ouvre un bac à sable réglementaire pour les entreprises d'actifs numériques et fintech." } } },
      { date: "July 2025", title: "e-Cedi Expansion to Rural Areas", desc: "Bank of Ghana expands CBDC pilot to rural and agricultural communities.", severity: "Positive", content: { en: { title: "e-Cedi Expansion to Rural Areas", desc: "Bank of Ghana expands CBDC pilot to rural and agricultural communities." }, fr: { title: "Expansion du e-Cedi vers les zones rurales", desc: "La Banque du Ghana étend le projet pilote MNBC aux communautés rurales et agricoles." } } },
      { date: "November 2024", title: "BoG Issues VASP Consultation Paper", desc: "Bank of Ghana publishes consultation on VASP licensing requirements.", severity: "Positive", content: { en: { title: "BoG Issues VASP Consultation Paper", desc: "Bank of Ghana publishes consultation on VASP licensing requirements." }, fr: { title: "La BoG publie un document de consultation VASP", desc: "La Banque du Ghana publie une consultation sur les exigences de licences VASP." } } },
      { date: "October 2021", title: "e-Cedi CBDC Pilot Launched", desc: "Bank of Ghana launches Africa's first retail CBDC in a pilot phase.", severity: "Positive", content: { en: { title: "e-Cedi CBDC Pilot Launched", desc: "Bank of Ghana launches Africa's first retail CBDC in a pilot phase." }, fr: { title: "Lancement du projet pilote e-Cedi", desc: "La Banque du Ghana lance la première MNBC de détail d'Afrique en phase pilote." } } },
      { date: "May 2020", title: "BoG Warns Against Unregulated Crypto", desc: "Central Bank issues warning about unregulated crypto activities.", severity: "Restrictive", content: { en: { title: "BoG Warns Against Unregulated Crypto", desc: "Central Bank issues warning about unregulated crypto activities." }, fr: { title: "La BoG met en garde contre les cryptos non réglementées", desc: "La Banque centrale émet un avertissement sur les activités crypto non réglementées." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Framework development underway; timeline uncertain" },
      enforcement: { level: "Medium", note: "Moderate enforcement, CBDC-first policy approach" },
      market: { level: "Medium", note: "Growing market with some currency stability concerns" },
    },
    trend: [35, 44, 53, 60, 65],
  },
  egypt: {
    name: "Egypt", flag: "🇪🇬", region: "North Africa", status: "Restricted", score: 44,
    policy: 44, innovation: 38, adoption: 42, risk: "High", lastUpdated: "December 2025",
    summary: "Egypt maintains one of the most restrictive digital asset regimes on the continent, with Islamic finance considerations and capital control concerns driving a conservative policy stance. The Central Bank has issued explicit prohibitions on crypto transactions through regulated institutions, though grassroots adoption persists. Limited signs of regulatory liberalization have emerged.",
    summaryFr: "L'Égypte maintient l'un des régimes d'actifs numériques les plus restrictifs du continent. La Banque centrale a émis des interdictions explicites sur les transactions crypto via les institutions réglementées. Peu de signes de libéralisation réglementaire ont émergé.",
    focusAreas: ["Crypto Prohibition Review", "Capital Controls", "Islamic Finance Compliance", "CBE Digital Currency", "Informal Market Monitoring"],
    focusAreasFr: ["Examen Interdiction Crypto", "Contrôle des Capitaux", "Conformité Finance Islamique", "Monnaie Numérique CBE", "Surveillance Marché Informel"],
    assets: {
      crypto: { status: "Restricted", note: "CBE prohibits banks from facilitating crypto transactions", noteFr: "La CBE interdit aux banques de faciliter les transactions crypto" },
      stablecoins: { status: "Restricted", note: "Subject to general crypto prohibition", noteFr: "Soumis à l'interdiction générale des cryptos" },
      defi: { status: "Restricted", note: "No permissive regulatory path available", noteFr: "Aucune voie réglementaire permissive disponible" },
      nfts: { status: "Undefined", note: "Not specifically addressed; general prohibition applies", noteFr: "Pas spécifiquement traité ; l'interdiction générale s'applique" },
      cbdc: { status: "Pilot", note: "CBE exploring digital pound concept", noteFr: "La CBE explore le concept de livre numérique" },
      p2p: { status: "Restricted", note: "Technically prohibited but informally active", noteFr: "Techniquement interdit mais informellement actif" },
    },
    timeline: [
      { date: "December 2025", title: "CBE Issues Crypto Risk Circular", desc: "Central Bank reissues warnings about cryptocurrency risks to consumers.", severity: "Restrictive", content: { en: { title: "CBE Issues Crypto Risk Circular", desc: "Central Bank reissues warnings about cryptocurrency risks to consumers." }, fr: { title: "La CBE publie une circulaire sur les risques crypto", desc: "La Banque centrale réitère ses avertissements sur les risques des cryptomonnaies pour les consommateurs." } } },
      { date: "May 2024", title: "Digital Economy Strategy Published", desc: "Government strategy mentions digital currency exploration but excludes crypto.", severity: "Neutral", content: { en: { title: "Digital Economy Strategy Published", desc: "Government strategy mentions digital currency exploration but excludes crypto." }, fr: { title: "Publication de la stratégie d'économie numérique", desc: "La stratégie gouvernementale mentionne l'exploration de la monnaie numérique mais exclut les cryptos." } } },
      { date: "September 2022", title: "Parliament Proposes Crypto Ban Legislation", desc: "Draft legislation to formally criminalize unauthorized crypto trading.", severity: "Restrictive", content: { en: { title: "Parliament Proposes Crypto Ban Legislation", desc: "Draft legislation to formally criminalize unauthorized crypto trading." }, fr: { title: "Le Parlement propose une loi d'interdiction des cryptos", desc: "Projet de loi visant à criminaliser formellement le trading crypto non autorisé." } } },
      { date: "January 2018", title: "Dar al-Ifta Issues Anti-Crypto Fatwa", desc: "Egypt's top religious authority issues ruling declaring crypto haram.", severity: "Restrictive", content: { en: { title: "Dar al-Ifta Issues Anti-Crypto Fatwa", desc: "Egypt's top religious authority issues ruling declaring crypto haram." }, fr: { title: "Dar al-Ifta émet une fatwa anti-crypto", desc: "La plus haute autorité religieuse d'Égypte déclare les cryptos haram." } } },
      { date: "2016", title: "CBE Warns Against Bitcoin Use", desc: "Central Bank of Egypt issues first official warning against Bitcoin transactions.", severity: "Restrictive", content: { en: { title: "CBE Warns Against Bitcoin Use", desc: "Central Bank of Egypt issues first official warning against Bitcoin transactions." }, fr: { title: "La CBE met en garde contre le Bitcoin", desc: "La Banque centrale d'Égypte émet son premier avertissement officiel contre les transactions Bitcoin." } } },
    ],
    riskScores: {
      regulatory: { level: "High", note: "Explicit prohibition with no clear path to licensing" },
      enforcement: { level: "High", note: "Active enforcement through banking channel restrictions" },
      market: { level: "High", note: "Large informal market with significant legal and operational risk" },
    },
    trend: [32, 35, 40, 42, 44],
  },
  ethiopia: {
    name: "Ethiopia", flag: "🇪🇹", region: "East Africa", status: "Emerging", score: 58,
    policy: 58, innovation: 62, adoption: 55, risk: "Medium", lastUpdated: "November 2025",
    summary: "Ethiopia is an emerging digital economy with a large unbanked population providing significant Web3 opportunity. The National Bank of Ethiopia has begun exploring digital currency frameworks, and the government's Digital Ethiopia 2025 strategy includes blockchain applications for land registry and public services. Formal crypto regulation remains nascent.",
    summaryFr: "L'Éthiopie est une économie numérique émergente avec une large population non bancarisée. La Banque nationale d'Éthiopie explore les cadres de monnaie numérique, et la stratégie Éthiopie Numérique 2025 inclut des applications blockchain. La réglementation crypto formelle reste naissante.",
    focusAreas: ["Digital Ethiopia Strategy", "Blockchain in Land Registry", "CBDC Exploration", "Financial Inclusion", "Telebirr Integration"],
    focusAreasFr: ["Stratégie Éthiopie Numérique", "Blockchain Cadastre", "Exploration MNBC", "Inclusion Financière", "Intégration Telebirr"],
    assets: {
      crypto: { status: "Emerging", note: "No formal framework; government exploring options", noteFr: "Pas de cadre formel ; le gouvernement explore les options" },
      stablecoins: { status: "Undefined", note: "Not specifically addressed by regulators", noteFr: "Pas spécifiquement traité par les régulateurs" },
      defi: { status: "Undefined", note: "No regulatory guidance", noteFr: "Aucune directive réglementaire" },
      nfts: { status: "Undefined", note: "Not addressed", noteFr: "Non traité" },
      cbdc: { status: "Pilot", note: "National Bank conducting feasibility studies", noteFr: "La Banque nationale mène des études de faisabilité" },
      p2p: { status: "Emerging", note: "Informal market active; no formal stance", noteFr: "Marché informel actif ; pas de position formelle" },
    },
    timeline: [
      { date: "November 2025", title: "Blockchain Land Registry Pilot", desc: "Government expands blockchain-based land title registry to 3 regions.", severity: "Positive", content: { en: { title: "Blockchain Land Registry Pilot", desc: "Government expands blockchain-based land title registry to 3 regions." }, fr: { title: "Projet pilote de cadastre blockchain", desc: "Le gouvernement étend le registre foncier basé sur la blockchain à 3 régions." } } },
      { date: "April 2025", title: "NBE Publishes Digital Asset Study", desc: "National Bank publishes feasibility study on digital asset regulation.", severity: "Neutral", content: { en: { title: "NBE Publishes Digital Asset Study", desc: "National Bank publishes feasibility study on digital asset regulation." }, fr: { title: "La NBE publie une étude sur les actifs numériques", desc: "La Banque nationale publie une étude de faisabilité sur la réglementation des actifs numériques." } } },
      { date: "September 2024", title: "Telebirr Adds Crypto Exchange Feature", desc: "State telecom's mobile money platform pilots crypto exchange functionality.", severity: "Positive", content: { en: { title: "Telebirr Adds Crypto Exchange Feature", desc: "State telecom's mobile money platform pilots crypto exchange functionality." }, fr: { title: "Telebirr ajoute une fonction d'échange crypto", desc: "La plateforme d'argent mobile de l'opérateur public teste une fonctionnalité d'échange crypto." } } },
      { date: "October 2022", title: "Digital Ethiopia 2025 Strategy Update", desc: "Government includes blockchain as key technology pillar in national strategy.", severity: "Positive", content: { en: { title: "Digital Ethiopia 2025 Strategy Update", desc: "Government includes blockchain as key technology pillar in national strategy." }, fr: { title: "Mise à jour de la stratégie Éthiopie Numérique 2025", desc: "Le gouvernement inclut la blockchain comme pilier technologique clé dans la stratégie nationale." } } },
      { date: "June 2021", title: "Bitcoin Mining Farms Approved", desc: "Government approves first licensed Bitcoin mining operations.", severity: "Neutral", content: { en: { title: "Bitcoin Mining Farms Approved", desc: "Government approves first licensed Bitcoin mining operations." }, fr: { title: "Approbation des fermes de minage Bitcoin", desc: "Le gouvernement approuve les premières opérations de minage Bitcoin sous licence." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "No formal framework; government engagement increasing" },
      enforcement: { level: "Medium", note: "Inconsistent enforcement; some informal tolerance" },
      market: { level: "Medium", note: "Large addressable market; liquidity constraints" },
    },
    trend: [28, 36, 45, 52, 58],
  },
  senegal: {
    name: "Senegal", flag: "🇸🇳", region: "West Africa", status: "Emerging", score: 62,
    policy: 62, innovation: 65, adoption: 68, risk: "Medium", lastUpdated: "February 2026",
    summary: "Senegal benefits from BCEAO (the West African central bank) oversight and the regional UEMOA framework, which provides a shared monetary and regulatory foundation. The government has shown increasing interest in blockchain for public administration and has supported regional CBDC development. Dakar is emerging as a francophone Web3 hub.",
    summaryFr: "Le Sénégal bénéficie de la supervision de la BCEAO et du cadre régional UEMOA. Le gouvernement montre un intérêt croissant pour la blockchain dans l'administration publique. Dakar émerge comme un hub Web3 francophone.",
    focusAreas: ["BCEAO WAEMU Framework", "e-CFA CBDC", "Regional VASP Regulation", "Blockchain in Government", "Francophone Web3 Hub"],
    focusAreasFr: ["Cadre BCEAO UEMOA", "MNBC e-CFA", "Réglementation VASP Régionale", "Blockchain au Gouvernement", "Hub Web3 Francophone"],
    assets: {
      crypto: { status: "Emerging", note: "Covered under BCEAO regional framework in development", noteFr: "Couvert par le cadre régional BCEAO en développement" },
      stablecoins: { status: "Emerging", note: "e-CFA digital currency under BCEAO coordination", noteFr: "Monnaie numérique e-CFA sous coordination BCEAO" },
      defi: { status: "Undefined", note: "No regional or national guidance", noteFr: "Aucune directive régionale ou nationale" },
      nfts: { status: "Undefined", note: "Not yet addressed", noteFr: "Pas encore traité" },
      cbdc: { status: "Pilot", note: "e-CFA (digital CFA franc) pilot launched in Senegal", noteFr: "Pilote e-CFA (franc CFA numérique) lancé au Sénégal" },
      p2p: { status: "Emerging", note: "Informal tolerance; high mobile money penetration", noteFr: "Tolérance informelle ; forte pénétration de l'argent mobile" },
    },
    timeline: [
      { date: "February 2026", title: "Dakar Web3 Policy Forum", desc: "AWI co-hosts first Francophone Web3 policy roundtable in Dakar.", severity: "Positive", content: { en: { title: "Dakar Web3 Policy Forum", desc: "AWI co-hosts first Francophone Web3 policy roundtable in Dakar." }, fr: { title: "Forum politique Web3 de Dakar", desc: "AWI co-organise la première table ronde politique Web3 francophone à Dakar." } } },
      { date: "July 2025", title: "e-CFA Pilot Expanded to Senegal", desc: "BCEAO expands digital CFA franc pilot to include Senegalese merchants.", severity: "Positive", content: { en: { title: "e-CFA Pilot Expanded to Senegal", desc: "BCEAO expands digital CFA franc pilot to include Senegalese merchants." }, fr: { title: "Le projet pilote e-CFA étendu au Sénégal", desc: "La BCEAO étend le projet pilote du franc CFA numérique aux commerçants sénégalais." } } },
      { date: "December 2024", title: "BCEAO Releases VASP Consultation", desc: "Regional central bank publishes consultation on VASP licensing for WAEMU states.", severity: "Positive", content: { en: { title: "BCEAO Releases VASP Consultation", desc: "Regional central bank publishes consultation on VASP licensing for WAEMU states." }, fr: { title: "La BCEAO publie une consultation VASP", desc: "La banque centrale régionale publie une consultation sur les licences VASP pour les États de l'UEMOA." } } },
      { date: "April 2023", title: "National Blockchain Strategy Published", desc: "Senegal publishes strategy document for blockchain in land registry and tax.", severity: "Neutral", content: { en: { title: "National Blockchain Strategy Published", desc: "Senegal publishes strategy document for blockchain in land registry and tax." }, fr: { title: "Publication de la stratégie nationale blockchain", desc: "Le Sénégal publie un document stratégique pour la blockchain dans le cadastre et la fiscalité." } } },
      { date: "January 2021", title: "BCEAO Warns Against Crypto", desc: "Regional central bank issues warning against unregulated cryptocurrency use.", severity: "Restrictive", content: { en: { title: "BCEAO Warns Against Crypto", desc: "Regional central bank issues warning against unregulated cryptocurrency use." }, fr: { title: "La BCEAO met en garde contre les cryptos", desc: "La banque centrale régionale émet un avertissement contre l'utilisation non réglementée des cryptomonnaies." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Dependent on BCEAO regional framework development" },
      enforcement: { level: "Medium", note: "Regional coordination reduces solo enforcement risk" },
      market: { level: "Medium", note: "Growing market with strong mobile money base" },
    },
    trend: [33, 42, 52, 58, 62],
  },
  tanzania: {
    name: "Tanzania", flag: "🇹🇿", region: "East Africa", status: "Emerging", score: 55,
    policy: 55, innovation: 52, adoption: 58, risk: "Medium", lastUpdated: "October 2025",
    summary: "Tanzania has moved cautiously on digital asset regulation, with the Bank of Tanzania conducting studies while maintaining a conservative public posture. Mobile money penetration through M-Pesa provides a strong digital finance foundation. Government interest in blockchain for agricultural supply chains and land registry has opened new policy dialogues.",
    summaryFr: "La Tanzanie a avancé prudemment sur la réglementation des actifs numériques. La Banque de Tanzanie mène des études tout en maintenant une posture publique conservatrice. L'intérêt gouvernemental pour la blockchain dans les chaînes d'approvisionnement agricoles a ouvert de nouveaux dialogues.",
    focusAreas: ["BoT Digital Currency Study", "Agricultural Blockchain", "Land Registry Pilots", "Mobile Money Integration", "EAC Regional Framework"],
    focusAreasFr: ["Étude Monnaie Numérique BoT", "Blockchain Agricole", "Pilotes Cadastre", "Intégration Argent Mobile", "Cadre Régional EAC"],
    assets: {
      crypto: { status: "Emerging", note: "Bank of Tanzania studying regulatory approach", noteFr: "La Banque de Tanzanie étudie l'approche réglementaire" },
      stablecoins: { status: "Undefined", note: "No specific guidance; BoT monitoring", noteFr: "Pas de directive spécifique ; BoT surveille" },
      defi: { status: "Undefined", note: "Not addressed in any official guidance", noteFr: "Pas traité dans aucune directive officielle" },
      nfts: { status: "Undefined", note: "Not regulated", noteFr: "Non réglementé" },
      cbdc: { status: "Pilot", note: "BoT conducting internal CBDC feasibility study", noteFr: "La BoT mène une étude interne de faisabilité MNBC" },
      p2p: { status: "Emerging", note: "Informal market active via mobile money rails", noteFr: "Marché informel actif via les rails d'argent mobile" },
    },
    timeline: [
      { date: "October 2025", title: "BoT Publishes VASP Discussion Paper", desc: "Bank of Tanzania releases public consultation on digital asset oversight.", severity: "Positive", content: { en: { title: "BoT Publishes VASP Discussion Paper", desc: "Bank of Tanzania releases public consultation on digital asset oversight." }, fr: { title: "La BoT publie un document de discussion VASP", desc: "La Banque de Tanzanie publie une consultation publique sur la supervision des actifs numériques." } } },
      { date: "March 2025", title: "Agricultural Blockchain Pilot Launched", desc: "Pilot for blockchain-based crop tracking in coffee and tea sectors begins.", severity: "Positive", content: { en: { title: "Agricultural Blockchain Pilot Launched", desc: "Pilot for blockchain-based crop tracking in coffee and tea sectors begins." }, fr: { title: "Lancement du projet pilote blockchain agricole", desc: "Un projet pilote de traçabilité des récoltes basé sur la blockchain débute dans les secteurs du café et du thé." } } },
      { date: "November 2023", title: "BoT Begins CBDC Research", desc: "Bank of Tanzania formally commences central bank digital currency research.", severity: "Neutral", content: { en: { title: "BoT Begins CBDC Research", desc: "Bank of Tanzania formally commences central bank digital currency research." }, fr: { title: "La BoT lance une recherche MNBC", desc: "La Banque de Tanzanie lance officiellement une recherche sur la monnaie numérique de banque centrale." } } },
      { date: "June 2022", title: "President Calls for Crypto Preparation", desc: "President Hassan urges government to prepare for cryptocurrency regulation.", severity: "Neutral", content: { en: { title: "President Calls for Crypto Preparation", desc: "President Hassan urges government to prepare for cryptocurrency regulation." }, fr: { title: "La Présidente appelle à se préparer pour les cryptos", desc: "La Présidente Hassan appelle le gouvernement à se préparer à la réglementation des cryptomonnaies." } } },
      { date: "2019", title: "Government Warns Against Crypto Use", desc: "Previous administration issues warnings discouraging public crypto use.", severity: "Restrictive", content: { en: { title: "Government Warns Against Crypto Use", desc: "Previous administration issues warnings discouraging public crypto use." }, fr: { title: "Le gouvernement met en garde contre les cryptos", desc: "L'administration précédente émet des avertissements décourageant l'utilisation publique des cryptos." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Positive signals but no formal framework yet" },
      enforcement: { level: "Medium", note: "Passive enforcement; no active crackdown" },
      market: { level: "Medium", note: "Growing grassroots adoption; limited institutional access" },
    },
    trend: [25, 33, 43, 50, 55],
  },
  morocco: {
    name: "Morocco", flag: "🇲🇦", region: "North Africa", status: "Restricted", score: 46,
    policy: 46, innovation: 42, adoption: 50, risk: "High", lastUpdated: "January 2026",
    summary: "Morocco maintains a formal prohibition on cryptocurrency transactions for residents, with Bank Al-Maghrib citing financial stability and capital control risks. However, the government has signaled interest in regulating rather than banning, and a formal legislative process began in 2024. Morocco's large diaspora and remittance corridors have sustained strong informal crypto demand.",
    summaryFr: "Le Maroc maintient une interdiction formelle des transactions en cryptomonnaies. Cependant, le gouvernement a signalé son intérêt pour réglementer plutôt qu'interdire, et un processus législatif formel a commencé en 2024. La large diaspora marocaine soutient une forte demande crypto informelle.",
    focusAreas: ["Crypto Legalization Process", "Remittance Reform", "Bank Al-Maghrib CBDC", "FATF Compliance", "Capital Control Modernization"],
    focusAreasFr: ["Processus Légalisation Crypto", "Réforme Transferts", "MNBC Bank Al-Maghrib", "Conformité GAFI", "Modernisation Contrôle Capitaux"],
    assets: {
      crypto: { status: "Restricted", note: "Formal prohibition in place; legalization bill under review", noteFr: "Interdiction formelle en place ; projet de loi de légalisation en cours d'examen" },
      stablecoins: { status: "Restricted", note: "Covered under general crypto prohibition", noteFr: "Couverts par l'interdiction générale des cryptos" },
      defi: { status: "Restricted", note: "No permissive framework", noteFr: "Aucun cadre permissif" },
      nfts: { status: "Undefined", note: "Not specifically addressed", noteFr: "Pas spécifiquement traité" },
      cbdc: { status: "Pilot", note: "Bank Al-Maghrib conducting digital dirham study", noteFr: "Bank Al-Maghrib mène une étude sur le dirham numérique" },
      p2p: { status: "Restricted", note: "Technically illegal but informally active", noteFr: "Techniquement illégal mais informellement actif" },
    },
    timeline: [
      { date: "January 2026", title: "Draft Crypto Legalization Bill Tabled", desc: "Parliament formally introduces legislation to regulate digital assets.", severity: "Positive", content: { en: { title: "Draft Crypto Legalization Bill Tabled", desc: "Parliament formally introduces legislation to regulate digital assets." }, fr: { title: "Projet de loi de légalisation crypto déposé", desc: "Le Parlement introduit officiellement une législation pour réglementer les actifs numériques." } } },
      { date: "September 2024", title: "Finance Ministry Consultation Launched", desc: "Ministry of Finance opens public consultation on crypto regulatory options.", severity: "Positive", content: { en: { title: "Finance Ministry Consultation Launched", desc: "Ministry of Finance opens public consultation on crypto regulatory options." }, fr: { title: "Lancement de la consultation du Ministère des Finances", desc: "Le Ministère des Finances ouvre une consultation publique sur les options réglementaires crypto." } } },
      { date: "November 2021", title: "Office des Changes Issues Crypto Warning", desc: "Foreign exchange regulator reaffirms prohibition on crypto transactions.", severity: "Restrictive", content: { en: { title: "Office des Changes Issues Crypto Warning", desc: "Foreign exchange regulator reaffirms prohibition on crypto transactions." }, fr: { title: "L'Office des Changes émet un avertissement crypto", desc: "Le régulateur des changes réaffirme l'interdiction des transactions en cryptomonnaies." } } },
      { date: "2017", title: "Bank Al-Maghrib Prohibits Crypto", desc: "Central bank issues formal prohibition on cryptocurrency transactions.", severity: "Restrictive", content: { en: { title: "Bank Al-Maghrib Prohibits Crypto", desc: "Central bank issues formal prohibition on cryptocurrency transactions." }, fr: { title: "Bank Al-Maghrib interdit les cryptos", desc: "La banque centrale émet une interdiction formelle des transactions en cryptomonnaies." } } },
    ],
    riskScores: {
      regulatory: { level: "High", note: "Active prohibition though legalization under review" },
      enforcement: { level: "High", note: "Formal exchange controls enforced" },
      market: { level: "High", note: "Significant informal market exposure to legal risk" },
    },
    trend: [30, 33, 38, 42, 46],
  },
  cameroon: {
    name: "Cameroon", flag: "🇨🇲", region: "Central Africa", status: "Emerging", score: 60,
    policy: 60, innovation: 55, adoption: 62, risk: "Medium", lastUpdated: "December 2025",
    summary: "Cameroon operates within the CEMAC regional monetary union and is subject to BEAC (Bank of Central African States) oversight. The country has a growing tech ecosystem in Douala and Yaoundé. Cameroon co-signed the CEMAC digital payments roadmap in 2024 and has been active in AWI's Francophone Network policy dialogues.",
    summaryFr: "Le Cameroun opère au sein de l'union monétaire CEMAC et est soumis à la supervision de la BEAC. Le pays a un écosystème tech en croissance à Douala et Yaoundé. Le Cameroun a co-signé la feuille de route des paiements numériques CEMAC en 2024.",
    focusAreas: ["BEAC Regional Framework", "CEMAC Digital Payments", "Francophone Policy Network", "Mobile Money Regulation", "SME Crypto Adoption"],
    focusAreasFr: ["Cadre Régional BEAC", "Paiements Numériques CEMAC", "Réseau Politique Francophone", "Réglementation Argent Mobile", "Adoption Crypto PME"],
    assets: {
      crypto: { status: "Emerging", note: "No national framework; BEAC regional rules pending", noteFr: "Pas de cadre national ; règles régionales BEAC en attente" },
      stablecoins: { status: "Emerging", note: "CEMAC digital currency project in development", noteFr: "Projet de monnaie numérique CEMAC en développement" },
      defi: { status: "Undefined", note: "Not regulated at national or regional level", noteFr: "Non réglementé au niveau national ou régional" },
      nfts: { status: "Undefined", note: "Not addressed", noteFr: "Non traité" },
      cbdc: { status: "Pilot", note: "CEMAC zone exploring digital CFA franc equivalent", noteFr: "La zone CEMAC explore l'équivalent numérique du franc CFA" },
      p2p: { status: "Emerging", note: "Active informal market; BEAC monitoring", noteFr: "Marché informel actif ; BEAC surveille" },
    },
    timeline: [
      { date: "December 2025", title: "AWI Francophone Policy Workshop in Yaoundé", desc: "AWI hosts Web3 policy sensitization workshop for Cameroonian regulators.", severity: "Positive", content: { en: { title: "AWI Francophone Policy Workshop in Yaoundé", desc: "AWI hosts Web3 policy sensitization workshop for Cameroonian regulators." }, fr: { title: "Atelier politique francophone AWI à Yaoundé", desc: "AWI organise un atelier de sensibilisation politique Web3 pour les régulateurs camerounais." } } },
      { date: "August 2025", title: "BEAC Issues Regional Crypto Guidelines", desc: "Bank of Central African States issues guidance for member states on VASPs.", severity: "Positive", content: { en: { title: "BEAC Issues Regional Crypto Guidelines", desc: "Bank of Central African States issues guidance for member states on VASPs." }, fr: { title: "La BEAC publie des directives crypto régionales", desc: "La Banque des États de l'Afrique centrale publie des directives pour les États membres sur les VASP." } } },
      { date: "March 2024", title: "CEMAC Digital Payments Roadmap Signed", desc: "Cameroon signs CEMAC roadmap for digital payment infrastructure.", severity: "Positive", content: { en: { title: "CEMAC Digital Payments Roadmap Signed", desc: "Cameroon signs CEMAC roadmap for digital payment infrastructure." }, fr: { title: "Signature de la feuille de route des paiements numériques CEMAC", desc: "Le Cameroun signe la feuille de route CEMAC pour l'infrastructure de paiement numérique." } } },
      { date: "February 2022", title: "BEAC Warns Against Unauthorized Crypto", desc: "Regional bank cautions against unauthorized crypto platforms.", severity: "Restrictive", content: { en: { title: "BEAC Warns Against Unauthorized Crypto", desc: "Regional bank cautions against unauthorized crypto platforms." }, fr: { title: "La BEAC met en garde contre les cryptos non autorisées", desc: "La banque régionale met en garde contre les plateformes crypto non autorisées." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Reliant on BEAC regional framework development" },
      enforcement: { level: "Medium", note: "Moderate; regional coordination reduces volatility" },
      market: { level: "Medium", note: "Growing francophone tech community" },
    },
    trend: [30, 40, 50, 55, 60],
  },
  "cote-d-ivoire": {
    name: "Côte d'Ivoire", flag: "🇨🇮", region: "West Africa", status: "Emerging", score: 58,
    policy: 58, innovation: 62, adoption: 65, risk: "Medium", lastUpdated: "November 2025",
    summary: "Côte d'Ivoire is West Africa's second-largest economy and operates under the BCEAO/UEMOA regional monetary framework. Abidjan is growing as a francophone digital hub, and the government has shown interest in blockchain for trade finance and agricultural commodity tracking. The country participates in the regional e-CFA pilot.",
    summaryFr: "La Côte d'Ivoire est la deuxième économie d'Afrique de l'Ouest et opère sous le cadre monétaire régional BCEAO/UEMOA. Abidjan se développe comme hub numérique francophone. Le gouvernement montre de l'intérêt pour la blockchain dans le financement du commerce.",
    focusAreas: ["BCEAO Regional Framework", "Trade Finance Blockchain", "e-CFA Pilot", "Agricultural Tokenization", "Francophone Tech Hub"],
    focusAreasFr: ["Cadre Régional BCEAO", "Blockchain Financement Commerce", "Pilote e-CFA", "Tokenisation Agricole", "Hub Tech Francophone"],
    assets: {
      crypto: { status: "Emerging", note: "Covered under BCEAO regional framework", noteFr: "Couvert par le cadre régional BCEAO" },
      stablecoins: { status: "Emerging", note: "Participating in regional e-CFA pilot", noteFr: "Participe au pilote régional e-CFA" },
      defi: { status: "Undefined", note: "No local guidance; BCEAO monitoring", noteFr: "Pas de directive locale ; BCEAO surveille" },
      nfts: { status: "Undefined", note: "Not regulated", noteFr: "Non réglementé" },
      cbdc: { status: "Pilot", note: "Participating in BCEAO e-CFA regional pilot", noteFr: "Participe au pilote régional e-CFA BCEAO" },
      p2p: { status: "Emerging", note: "Active via mobile money; informal tolerance", noteFr: "Actif via argent mobile ; tolérance informelle" },
    },
    timeline: [
      { date: "November 2025", title: "Trade Finance Blockchain Pilot Launched", desc: "Government-backed pilot for blockchain-based cocoa export financing.", severity: "Positive", content: { en: { title: "Trade Finance Blockchain Pilot Launched", desc: "Government-backed pilot for blockchain-based cocoa export financing." }, fr: { title: "Lancement du projet pilote blockchain de financement du commerce", desc: "Projet pilote soutenu par le gouvernement pour le financement des exportations de cacao basé sur la blockchain." } } },
      { date: "June 2025", title: "BCEAO VASP Consultation Participation", desc: "Côte d'Ivoire actively participates in regional VASP licensing consultation.", severity: "Positive", content: { en: { title: "BCEAO VASP Consultation Participation", desc: "Côte d'Ivoire actively participates in regional VASP licensing consultation." }, fr: { title: "Participation à la consultation VASP de la BCEAO", desc: "La Côte d'Ivoire participe activement à la consultation régionale sur les licences VASP." } } },
      { date: "January 2024", title: "e-CFA Merchant Pilot in Abidjan", desc: "Regional CBDC pilot extended to commercial merchants in Abidjan.", severity: "Positive", content: { en: { title: "e-CFA Merchant Pilot in Abidjan", desc: "Regional CBDC pilot extended to commercial merchants in Abidjan." }, fr: { title: "Projet pilote e-CFA pour les commerçants à Abidjan", desc: "Le projet pilote régional MNBC est étendu aux commerçants à Abidjan." } } },
      { date: "September 2021", title: "BCEAO Crypto Warning Issued", desc: "Regional central bank reiterates caution on unregulated crypto use.", severity: "Restrictive", content: { en: { title: "BCEAO Crypto Warning Issued", desc: "Regional central bank reiterates caution on unregulated crypto use." }, fr: { title: "Avertissement crypto de la BCEAO", desc: "La banque centrale régionale réitère sa prudence concernant l'utilisation non réglementée des cryptos." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Regional framework developing; national clarity pending" },
      enforcement: { level: "Medium", note: "BCEAO-led enforcement; national actions limited" },
      market: { level: "Medium", note: "Stable economic base; growing digital adoption" },
    },
    trend: [28, 38, 48, 54, 58],
  },
  zimbabwe: {
    name: "Zimbabwe", flag: "🇿🇼", region: "Southern Africa", status: "Emerging", score: 56,
    policy: 56, innovation: 50, adoption: 65, risk: "Medium", lastUpdated: "March 2026",
    summary: "Zimbabwe has a distinctive digital asset landscape shaped by decades of currency instability. High grassroots crypto adoption emerged as a response to hyperinflation, and the government has acknowledged this reality by introducing the ZiG gold-backed currency and exploring CBDC options. The Reserve Bank of Zimbabwe has shifted from hostility to cautious engagement.",
    summaryFr: "Le Zimbabwe a un paysage d'actifs numériques distinctif façonné par des décennies d'instabilité monétaire. Une forte adoption crypto a émergé en réponse à l'hyperinflation. La Banque de réserve est passée de l'hostilité à un engagement prudent.",
    focusAreas: ["ZiG Currency Integration", "CBDC Exploration", "VASP Framework", "Financial Inclusion", "Inflation Hedge Regulation"],
    focusAreasFr: ["Intégration Monnaie ZiG", "Exploration MNBC", "Cadre VASP", "Inclusion Financière", "Réglementation Couverture Inflation"],
    assets: {
      crypto: { status: "Emerging", note: "RBZ shifted from ban to cautious engagement in 2023", noteFr: "La RBZ est passée de l'interdiction à un engagement prudent en 2023" },
      stablecoins: { status: "Emerging", note: "Under review; ZiG gold-backed currency launched", noteFr: "En cours d'examen ; monnaie ZiG adossée à l'or lancée" },
      defi: { status: "Undefined", note: "No formal guidance", noteFr: "Aucune directive formelle" },
      nfts: { status: "Undefined", note: "Not addressed", noteFr: "Non traité" },
      cbdc: { status: "Pilot", note: "RBZ exploring digital ZiG and CBDC options", noteFr: "La RBZ explore le ZiG numérique et les options MNBC" },
      p2p: { status: "Emerging", note: "High informal adoption; regulatory tolerance increasing", noteFr: "Forte adoption informelle ; tolérance réglementaire croissante" },
    },
    timeline: [
      { date: "March 2026", title: "RBZ Publishes VASP Consultation", desc: "Reserve Bank opens public consultation on VASP licensing framework.", severity: "Positive", content: { en: { title: "RBZ Publishes VASP Consultation", desc: "Reserve Bank opens public consultation on VASP licensing framework." }, fr: { title: "La RBZ publie une consultation VASP", desc: "La Banque de réserve ouvre une consultation publique sur le cadre de licences VASP." } } },
      { date: "April 2024", title: "ZiG Gold-Backed Currency Launched", desc: "Zimbabwe introduces gold-backed digital currency, acknowledging digital asset demand.", severity: "Positive", content: { en: { title: "ZiG Gold-Backed Currency Launched", desc: "Zimbabwe introduces gold-backed digital currency, acknowledging digital asset demand." }, fr: { title: "Lancement de la monnaie adossée à l'or ZiG", desc: "Le Zimbabwe introduit une monnaie numérique adossée à l'or, reconnaissant la demande d'actifs numériques." } } },
      { date: "October 2023", title: "RBZ Reverses Crypto Ban", desc: "Reserve Bank reverses 2018 directive, allowing regulated crypto activity.", severity: "Positive", content: { en: { title: "RBZ Reverses Crypto Ban", desc: "Reserve Bank reverses 2018 directive, allowing regulated crypto activity." }, fr: { title: "La RBZ annule l'interdiction crypto", desc: "La Banque de réserve annule la directive de 2018, autorisant les activités crypto réglementées." } } },
      { date: "2018", title: "RBZ Issues Crypto Ban to Banks", desc: "Reserve Bank directs all financial institutions to cease crypto-related services.", severity: "Restrictive", content: { en: { title: "RBZ Issues Crypto Ban to Banks", desc: "Reserve Bank directs all financial institutions to cease crypto-related services." }, fr: { title: "La RBZ interdit les cryptos aux banques", desc: "La Banque de réserve ordonne à toutes les institutions financières de cesser les services liés aux cryptos." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Policy shift positive but framework incomplete" },
      enforcement: { level: "Medium", note: "Enforcement history unpredictable; improving" },
      market: { level: "Medium", note: "High adoption demand but economic instability risk" },
    },
    trend: [20, 30, 40, 50, 56],
  },
  zambia: {
    name: "Zambia", flag: "🇿🇲", region: "Southern Africa", status: "Emerging", score: 54,
    policy: 54, innovation: 50, adoption: 55, risk: "Medium", lastUpdated: "September 2025",
    summary: "Zambia is in the early stages of developing its digital asset regulatory framework, with the Bank of Zambia and Securities and Exchange Commission both exploring oversight models. The country's mining sector has generated interest in blockchain for commodity tracking and settlement. AWI hosted a blockchain financial crime enforcement workshop in Lusaka in 2026.",
    summaryFr: "La Zambie est aux premiers stades du développement de son cadre réglementaire des actifs numériques. Le secteur minier a généré un intérêt pour la blockchain. AWI a organisé un atelier sur la criminalité financière blockchain à Lusaka en 2026.",
    focusAreas: ["BoZ VASP Framework", "Mining Sector Blockchain", "Financial Crime Prevention", "AML/CFT Compliance", "Securities Regulation"],
    focusAreasFr: ["Cadre VASP BoZ", "Blockchain Secteur Minier", "Prévention Criminalité Financière", "Conformité LBC/FT", "Réglementation Valeurs Mobilières"],
    assets: {
      crypto: { status: "Emerging", note: "BoZ developing regulatory framework; informal use active", noteFr: "BoZ développe un cadre réglementaire ; usage informel actif" },
      stablecoins: { status: "Undefined", note: "Not specifically regulated", noteFr: "Pas spécifiquement réglementé" },
      defi: { status: "Undefined", note: "No guidance issued", noteFr: "Aucune directive publiée" },
      nfts: { status: "Undefined", note: "Not addressed", noteFr: "Non traité" },
      cbdc: { status: "Pilot", note: "BoZ conducting CBDC feasibility assessment", noteFr: "BoZ mène une évaluation de faisabilité MNBC" },
      p2p: { status: "Emerging", note: "Informal market active; no formal rules", noteFr: "Marché informel actif ; pas de règles formelles" },
    },
    timeline: [
      { date: "September 2025", title: "SEC Zambia Publishes Digital Asset Policy", desc: "Securities regulator releases draft policy for digital asset classification.", severity: "Positive", content: { en: { title: "SEC Zambia Publishes Digital Asset Policy", desc: "Securities regulator releases draft policy for digital asset classification." }, fr: { title: "La SEC de Zambie publie une politique sur les actifs numériques", desc: "Le régulateur des valeurs mobilières publie un projet de politique de classification des actifs numériques." } } },
      { date: "May 2025", title: "Mining Blockchain Pilot Approved", desc: "Government approves pilot for blockchain-based copper export tracking.", severity: "Positive", content: { en: { title: "Mining Blockchain Pilot Approved", desc: "Government approves pilot for blockchain-based copper export tracking." }, fr: { title: "Projet pilote blockchain minier approuvé", desc: "Le gouvernement approuve un projet pilote de traçabilité des exportations de cuivre basé sur la blockchain." } } },
      { date: "January 2024", title: "BoZ Blockchain Research Published", desc: "Bank of Zambia publishes research paper on CBDC and digital asset regulation.", severity: "Neutral", content: { en: { title: "BoZ Blockchain Research Published", desc: "Bank of Zambia publishes research paper on CBDC and digital asset regulation." }, fr: { title: "Publication de la recherche blockchain de la BoZ", desc: "La Banque de Zambie publie un document de recherche sur la MNBC et la réglementation des actifs numériques." } } },
      { date: "August 2022", title: "FATF Compliance Review", desc: "Zambia undergoes FATF mutual evaluation; crypto AML gaps identified.", severity: "Neutral", content: { en: { title: "FATF Compliance Review", desc: "Zambia undergoes FATF mutual evaluation; crypto AML gaps identified." }, fr: { title: "Examen de conformité GAFI", desc: "La Zambie subit une évaluation mutuelle du GAFI ; des lacunes LBC/FT crypto sont identifiées." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Framework in early development; forward signals positive" },
      enforcement: { level: "Medium", note: "Limited enforcement capacity; FATF compliance improving" },
      market: { level: "Medium", note: "Small but growing market; mining sector interest" },
    },
    trend: [22, 32, 42, 48, 54],
  },
  algeria: {
    name: "Algeria", flag: "🇩🇿", region: "North Africa", status: "Restricted", score: 38,
    policy: 38, innovation: 32, adoption: 35, risk: "High", lastUpdated: "June 2025",
    summary: "Algeria maintains the continent's most comprehensive legal prohibition on cryptocurrency, with the 2018 Finance Law banning all virtual currency transactions. Capital controls and a state-controlled financial system make liberalization unlikely in the near term. No CBDC or sandbox program has been announced, and there are no public signals of regulatory reform.",
    summaryFr: "L'Algérie maintient l'interdiction légale la plus complète du continent sur les cryptomonnaies. Les contrôles des capitaux et un système financier contrôlé par l'État rendent une libéralisation improbable à court terme. Aucun programme MNBC ou bac à sable n'a été annoncé.",
    focusAreas: ["Legal Crypto Prohibition", "Capital Control Enforcement", "Informal Market Monitoring", "State Banking Policy", "Future Reform Indicators"],
    focusAreasFr: ["Interdiction Légale Crypto", "Application Contrôle Capitaux", "Surveillance Marché Informel", "Politique Bancaire d'État", "Indicateurs Réforme Future"],
    assets: {
      crypto: { status: "Restricted", note: "Criminalized under 2018 Finance Law", noteFr: "Criminalisé par la loi de finances 2018" },
      stablecoins: { status: "Restricted", note: "Subject to general crypto prohibition", noteFr: "Soumis à l'interdiction générale des cryptos" },
      defi: { status: "Restricted", note: "No legal framework; use prohibited", noteFr: "Aucun cadre légal ; usage interdit" },
      nfts: { status: "Restricted", note: "No legal pathway", noteFr: "Aucune voie légale" },
      cbdc: { status: "None", note: "No CBDC program initiated", noteFr: "Aucun programme MNBC initié" },
      p2p: { status: "Restricted", note: "Prohibited; enforcement through banking channels", noteFr: "Interdit ; application via les canaux bancaires" },
    },
    timeline: [
      { date: "June 2025", title: "Finance Ministry Reaffirms Crypto Ban", desc: "Ministry of Finance reiterates prohibition in response to growing informal activity.", severity: "Restrictive", content: { en: { title: "Finance Ministry Reaffirms Crypto Ban", desc: "Ministry of Finance reiterates prohibition in response to growing informal activity." }, fr: { title: "Le Ministère des Finances réaffirme l'interdiction crypto", desc: "Le Ministère des Finances réitère l'interdiction en réponse à l'activité informelle croissante." } } },
      { date: "2022", title: "Enforcement Actions Against Crypto Users", desc: "Reports of prosecutions under 2018 Finance Law provisions.", severity: "Restrictive", content: { en: { title: "Enforcement Actions Against Crypto Users", desc: "Reports of prosecutions under 2018 Finance Law provisions." }, fr: { title: "Actions coercitives contre les utilisateurs crypto", desc: "Signalements de poursuites en vertu des dispositions de la loi de finances 2018." } } },
      { date: "2018", title: "Finance Law Criminalizes Crypto", desc: "Algeria's Finance Law formally bans virtual currency transactions.", severity: "Restrictive", content: { en: { title: "Finance Law Criminalizes Crypto", desc: "Algeria's Finance Law formally bans virtual currency transactions." }, fr: { title: "La loi de finances criminalise les cryptos", desc: "La loi de finances algérienne interdit formellement les transactions en monnaies virtuelles." } } },
      { date: "2017", title: "Bank of Algeria First Crypto Warning", desc: "Central bank issues first warning against cryptocurrency transactions.", severity: "Restrictive", content: { en: { title: "Bank of Algeria First Crypto Warning", desc: "Central bank issues first warning against cryptocurrency transactions." }, fr: { title: "Premier avertissement crypto de la Banque d'Algérie", desc: "La banque centrale émet son premier avertissement contre les transactions en cryptomonnaies." } } },
    ],
    riskScores: {
      regulatory: { level: "High", note: "Active criminalization with no liberalization signals" },
      enforcement: { level: "High", note: "Known prosecutions under Finance Law provisions" },
      market: { level: "High", note: "Underground activity carries severe legal exposure" },
    },
    trend: [28, 30, 32, 35, 38],
  },
  uganda: {
    name: "Uganda", flag: "🇺🇬", region: "East Africa", status: "Emerging", score: 52,
    policy: 52, innovation: 55, adoption: 58, risk: "Medium", lastUpdated: "August 2025",
    summary: "Uganda has taken a tentative but increasingly constructive approach to digital assets, with the Bank of Uganda studying crypto regulation and the Capital Markets Authority issuing initial guidance. A large unbanked population and strong mobile money infrastructure provide a foundation for Web3 adoption. Uganda's tech community is one of East Africa's most active.",
    summaryFr: "L'Ouganda a adopté une approche prudente mais de plus en plus constructive des actifs numériques. Une large population non bancarisée et une solide infrastructure d'argent mobile fournissent une base pour l'adoption Web3. La communauté tech ougandaise est l'une des plus actives d'Afrique de l'Est.",
    focusAreas: ["BoU VASP Study", "CMA Digital Securities", "Mobile Money Integration", "Financial Inclusion", "East African Community Framework"],
    focusAreasFr: ["Étude VASP BoU", "Titres Numériques CMA", "Intégration Argent Mobile", "Inclusion Financière", "Cadre Communauté Afrique de l'Est"],
    assets: {
      crypto: { status: "Emerging", note: "BoU studying regulation; no formal framework yet", noteFr: "La BoU étudie la réglementation ; pas encore de cadre formel" },
      stablecoins: { status: "Undefined", note: "Not specifically regulated", noteFr: "Pas spécifiquement réglementé" },
      defi: { status: "Undefined", note: "No regulatory guidance", noteFr: "Aucune directive réglementaire" },
      nfts: { status: "Undefined", note: "Not addressed", noteFr: "Non traité" },
      cbdc: { status: "Pilot", note: "BoU conducting CBDC feasibility research", noteFr: "La BoU mène une recherche de faisabilité MNBC" },
      p2p: { status: "Emerging", note: "Active informal market; mobile money integration", noteFr: "Marché informel actif ; intégration argent mobile" },
    },
    timeline: [
      { date: "August 2025", title: "CMA Issues Digital Securities Framework", desc: "Capital Markets Authority publishes rules for tokenized securities offerings.", severity: "Positive", content: { en: { title: "CMA Issues Digital Securities Framework", desc: "Capital Markets Authority publishes rules for tokenized securities offerings." }, fr: { title: "La CMA publie un cadre pour les titres numériques", desc: "L'Autorité des marchés de capitaux publie des règles pour les offres de titres tokenisés." } } },
      { date: "February 2025", title: "BoU CBDC Study Published", desc: "Bank of Uganda publishes CBDC research findings and next steps.", severity: "Neutral", content: { en: { title: "BoU CBDC Study Published", desc: "Bank of Uganda publishes CBDC research findings and next steps." }, fr: { title: "Publication de l'étude MNBC de la BoU", desc: "La Banque d'Ouganda publie les conclusions de sa recherche MNBC et les prochaines étapes." } } },
      { date: "July 2023", title: "National Fintech Policy Launched", desc: "Uganda launches National Fintech Policy including digital asset provisions.", severity: "Positive", content: { en: { title: "National Fintech Policy Launched", desc: "Uganda launches National Fintech Policy including digital asset provisions." }, fr: { title: "Lancement de la politique nationale fintech", desc: "L'Ouganda lance sa politique nationale fintech incluant des dispositions sur les actifs numériques." } } },
      { date: "2019", title: "BoU Issues Crypto Caution", desc: "Bank of Uganda warns public against unregulated cryptocurrency use.", severity: "Restrictive", content: { en: { title: "BoU Issues Crypto Caution", desc: "Bank of Uganda warns public against unregulated cryptocurrency use." }, fr: { title: "La BoU émet une mise en garde crypto", desc: "La Banque d'Ouganda met en garde le public contre l'utilisation non réglementée des cryptomonnaies." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Positive trajectory; formal framework pending" },
      enforcement: { level: "Medium", note: "Limited active enforcement; monitoring posture" },
      market: { level: "Medium", note: "Growing adoption; limited institutional infrastructure" },
    },
    trend: [22, 30, 40, 47, 52],
  },
  tunisia: {
    name: "Tunisia", flag: "🇹🇳", region: "North Africa", status: "Emerging", score: 61,
    policy: 61, innovation: 58, adoption: 60, risk: "Medium", lastUpdated: "February 2026",
    summary: "Tunisia has taken a more open approach to digital assets compared to its North African neighbors, with the Central Bank initiating CBDC research and the country actively studying VASP licensing frameworks. Tunisia has the highest Web3 developer density in North Africa and has positioned its digital economy ambitions around startup-friendly regulation.",
    summaryFr: "La Tunisie a adopté une approche plus ouverte des actifs numériques que ses voisins d'Afrique du Nord. La Tunisie a la plus forte densité de développeurs Web3 en Afrique du Nord et a positionné ses ambitions d'économie numérique autour d'une réglementation favorable aux startups.",
    focusAreas: ["Startup Act Fintech Provisions", "BCT Digital Dinar", "VASP Licensing Study", "Tech Hub Development", "Stablecoin Pilot"],
    focusAreasFr: ["Dispositions Fintech Startup Act", "Dinar Numérique BCT", "Étude Licences VASP", "Développement Hub Tech", "Pilote Stablecoin"],
    assets: {
      crypto: { status: "Emerging", note: "BCT studying regulation; informal market active", noteFr: "BCT étudie la réglementation ; marché informel actif" },
      stablecoins: { status: "Emerging", note: "Under review; digital dinar project underway", noteFr: "En cours d'examen ; projet dinar numérique en cours" },
      defi: { status: "Undefined", note: "No framework; academic interest growing", noteFr: "Pas de cadre ; intérêt académique croissant" },
      nfts: { status: "Undefined", note: "Not addressed in policy", noteFr: "Pas traité dans la politique" },
      cbdc: { status: "Pilot", note: "Digital dinar pilot under Banque Centrale de Tunisie", noteFr: "Pilote dinar numérique sous la Banque Centrale de Tunisie" },
      p2p: { status: "Emerging", note: "Informal tolerance; high developer use", noteFr: "Tolérance informelle ; fort usage par les développeurs" },
    },
    timeline: [
      { date: "February 2026", title: "BCT Digital Dinar Pilot Expands", desc: "Central bank expands digital dinar pilot to include retail payments.", severity: "Positive", content: { en: { title: "BCT Digital Dinar Pilot Expands", desc: "Central bank expands digital dinar pilot to include retail payments." }, fr: { title: "Expansion du projet pilote du dinar numérique", desc: "La banque centrale étend le projet pilote du dinar numérique aux paiements de détail." } } },
      { date: "September 2025", title: "VASP Consultation Paper Released", desc: "Banque Centrale de Tunisie releases consultation on VASP licensing.", severity: "Positive", content: { en: { title: "VASP Consultation Paper Released", desc: "Banque Centrale de Tunisie releases consultation on VASP licensing." }, fr: { title: "Publication du document de consultation VASP", desc: "La Banque Centrale de Tunisie publie une consultation sur les licences VASP." } } },
      { date: "June 2024", title: "Startup Act Extended to Web3 Firms", desc: "Tunisia's Startup Act extended to cover blockchain and Web3 companies.", severity: "Positive", content: { en: { title: "Startup Act Extended to Web3 Firms", desc: "Tunisia's Startup Act extended to cover blockchain and Web3 companies." }, fr: { title: "Le Startup Act étendu aux entreprises Web3", desc: "Le Startup Act tunisien est étendu pour couvrir les entreprises blockchain et Web3." } } },
      { date: "March 2022", title: "BCT Crypto Research Published", desc: "Central bank publishes research on crypto asset risks and opportunities.", severity: "Neutral", content: { en: { title: "BCT Crypto Research Published", desc: "Central bank publishes research on crypto asset risks and opportunities." }, fr: { title: "Publication de la recherche crypto de la BCT", desc: "La banque centrale publie une recherche sur les risques et opportunités des actifs crypto." } } },
      { date: "January 2020", title: "BCT First Crypto Warning", desc: "Central bank issues cautionary notice on cryptocurrency use.", severity: "Restrictive", content: { en: { title: "BCT First Crypto Warning", desc: "Central bank issues cautionary notice on cryptocurrency use." }, fr: { title: "Premier avertissement crypto de la BCT", desc: "La banque centrale émet un avis de prudence sur l'utilisation des cryptomonnaies." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Progressive posture in North Africa; framework pending" },
      enforcement: { level: "Medium", note: "Selective; startup-friendly regulatory culture" },
      market: { level: "Medium", note: "Strong developer base; macroeconomic headwinds" },
    },
    trend: [30, 40, 50, 57, 61],
  },
  botswana: {
    name: "Botswana", flag: "🇧🇼", region: "Southern Africa", status: "Emerging", score: 63,
    policy: 63, innovation: 58, adoption: 60, risk: "Medium", lastUpdated: "January 2026",
    summary: "Botswana has developed a clear regulatory posture for digital assets, with the Non-Bank Financial Institutions Regulatory Authority (NBFIRA) issuing formal guidance and exploring a licensing regime. The country's political stability, low corruption index, and diamond-driven sovereign wealth provide a strong foundation for institutional crypto engagement.",
    summaryFr: "Le Botswana a développé une posture réglementaire claire pour les actifs numériques. La stabilité politique du pays, son faible indice de corruption et sa richesse souveraine liée aux diamants fournissent une base solide pour l'engagement institutionnel crypto.",
    focusAreas: ["NBFIRA Licensing Framework", "CBDC Study", "Institutional Custody", "Diamond Tokenization", "SADC Regional Integration"],
    focusAreasFr: ["Cadre Licences NBFIRA", "Étude MNBC", "Garde Institutionnelle", "Tokenisation Diamants", "Intégration Régionale SADC"],
    assets: {
      crypto: { status: "Emerging", note: "NBFIRA issued formal crypto guidance; licensing pending", noteFr: "NBFIRA a publié des directives crypto formelles ; licences en attente" },
      stablecoins: { status: "Emerging", note: "Under review by BoB and NBFIRA", noteFr: "En cours d'examen par la BoB et NBFIRA" },
      defi: { status: "Undefined", note: "Not yet regulated", noteFr: "Pas encore réglementé" },
      nfts: { status: "Undefined", note: "Not addressed; diamond NFT pilots in discussion", noteFr: "Non traité ; pilotes NFT diamants en discussion" },
      cbdc: { status: "Pilot", note: "Bank of Botswana exploring digital pula", noteFr: "La Banque du Botswana explore le pula numérique" },
      p2p: { status: "Emerging", note: "Informal market; NBFIRA monitoring", noteFr: "Marché informel ; NBFIRA surveille" },
    },
    timeline: [
      { date: "January 2026", title: "NBFIRA Crypto Licensing Draft Issued", desc: "NBFIRA publishes draft licensing rules for digital asset service providers.", severity: "Positive", content: { en: { title: "NBFIRA Crypto Licensing Draft Issued", desc: "NBFIRA publishes draft licensing rules for digital asset service providers." }, fr: { title: "Projet de licences crypto de la NBFIRA", desc: "La NBFIRA publie un projet de règles de licences pour les prestataires de services d'actifs numériques." } } },
      { date: "July 2025", title: "Diamond NFT Tokenization Pilot", desc: "Government-backed pilot for blockchain-based diamond certification launched.", severity: "Positive", content: { en: { title: "Diamond NFT Tokenization Pilot", desc: "Government-backed pilot for blockchain-based diamond certification launched." }, fr: { title: "Projet pilote de tokenisation NFT des diamants", desc: "Un projet pilote soutenu par le gouvernement pour la certification des diamants basée sur la blockchain est lancé." } } },
      { date: "March 2024", title: "Bank of Botswana Digital Pula Study", desc: "BoB publishes digital currency feasibility report.", severity: "Neutral", content: { en: { title: "Bank of Botswana Digital Pula Study", desc: "BoB publishes digital currency feasibility report." }, fr: { title: "Étude sur le pula numérique de la Banque du Botswana", desc: "La BoB publie un rapport de faisabilité sur la monnaie numérique." } } },
      { date: "September 2022", title: "NBFIRA Publishes Crypto Position Paper", desc: "Regulator formally acknowledges crypto assets and signals intent to regulate.", severity: "Positive", content: { en: { title: "NBFIRA Publishes Crypto Position Paper", desc: "Regulator formally acknowledges crypto assets and signals intent to regulate." }, fr: { title: "La NBFIRA publie un document de position crypto", desc: "Le régulateur reconnaît formellement les actifs crypto et signale son intention de réglementer." } } },
      { date: "2021", title: "NBFIRA Issues Crypto Consumer Warning", desc: "Non-bank regulator warns consumers about unregulated crypto risks.", severity: "Restrictive", content: { en: { title: "NBFIRA Issues Crypto Consumer Warning", desc: "Non-bank regulator warns consumers about unregulated crypto risks." }, fr: { title: "La NBFIRA émet un avertissement crypto aux consommateurs", desc: "Le régulateur non bancaire avertit les consommateurs des risques des cryptos non réglementées." } } },
    ],
    riskScores: {
      regulatory: { level: "Medium", note: "Clear direction; formal framework arriving" },
      enforcement: { level: "Low", note: "Stable governance supports predictable enforcement" },
      market: { level: "Medium", note: "Stable economy; smaller market size" },
    },
    trend: [32, 42, 52, 58, 63],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Regulated: { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
  Emerging:  { bg: "#D4A017", light: "#fef9c3", text: "#854d0e" },
  Restricted:{ bg: "#dc2626", light: "#fee2e2", text: "#991b1b" },
  Undefined: { bg: "#9ca3af", light: "#f3f4f6", text: "#374151" },
  Active:    { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
  Pilot:     { bg: "#2563eb", light: "#dbeafe", text: "#1e40af" },
  None:      { bg: "#9ca3af", light: "#f3f4f6", text: "#374151" },
  Allowed:   { bg: "#16a34a", light: "#dcfce7", text: "#166534" },
};
const RISK_COLORS = { Low: "#16a34a", Medium: "#D4A017", High: "#dc2626" };
const RISK_BG     = { Low: "#dcfce7", Medium: "#fef9c3", High: "#fee2e2" };
const SEV_COLORS  = { Positive: "#16a34a", Neutral: "#6b7280", Restrictive: "#dc2626" };
const SEV_BG      = { Positive: "#dcfce7", Neutral: "#f3f4f6", Restrictive: "#fee2e2" };
const TREND_YEARS = ["2022", "2023", "2024", "2025", "2026"];


function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Undefined;
  return (
    <span className="inline-flex items-center text-[0.75rem] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: c.light, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: c.bg }} />
      {status}
    </span>
  );
}

function CircleScore({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke="#D4A017" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 72 72)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2rem] font-bold leading-none" style={{ color: "#D4A017" }}>{score}</span>
        <span className="text-[0.625rem] font-medium text-white/60 mt-1 uppercase tracking-wide">Readiness</span>
      </div>
    </div>
  );
}

function MiniScoreBar({ score }) {
  return (
    <div>
      <span className="text-[1.5rem] font-bold text-secondary">{score}</span>
      <div className="h-1 rounded-full bg-border mt-1 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: "#D4A017" }} />
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CountryProfile() {
  const { country } = useParams();
  const { language } = useLanguage();
  const T = t[language].countryProfile;
  const profile = useMemo(() => {
    if (!country) return null;
    const key = country.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const base = COUNTRY_PROFILES[key] ||
      Object.values(COUNTRY_PROFILES).find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === key) ||
      null;
    if (!base) return null;
    // Overlay scores from AWPII (the authoritative source)
    const awpii = awpiiData.find(a => a.key === country || a.key === key);
    if (awpii) {
      return {
        ...base,
        score: awpii.overall_score,
        policy: awpii.pillars?.clarity ?? base.policy,
        innovation: awpii.pillars?.innovation ?? base.innovation,
        adoption: awpii.pillars?.adoption ?? base.adoption,
      };
    }
    return base;
  }, [country]);

  const trendData = useMemo(() => {
    if (!profile) return [];
    return TREND_YEARS.map((y, i) => ({ year: y, score: profile.trend[i] }));
  }, [profile]);

  const relatedCountries = useMemo(() => {
    if (!profile) return [];
    return Object.values(COUNTRY_PROFILES)
      .filter(p => p.region === profile.region && p.name !== profile.name)
      .slice(0, 3);
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[1.5rem] font-bold text-secondary">{T.notFound}</p>
        <Link to="/country-tracker" className="text-[0.9375rem] font-semibold" style={{ color: "#D4A017" }}>
          {T.notFoundCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <title>{profile.name} Web3 Profile | Africa Web3 Institute</title>

      {/* Hero */}
      <section style={{ backgroundColor: "#0B1437" }} className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[0.75rem] text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">{T.breadcrumbHome}</Link>
            <span>/</span>
            <Link to="/country-tracker" className="hover:text-white/70 transition-colors">{T.breadcrumbTracker}</Link>
            <span>/</span>
            <span className="text-white/70">{profile.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[3rem] leading-none">{profile.flag}</span>
                <div>
                  <h1 className="text-[2.25rem] lg:text-[2.75rem] font-bold text-white leading-tight">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                      {profile.region}
                    </span>
                    <StatusPill status={profile.status} />
                  </div>
                </div>
              </div>
              <p className="text-[0.8125rem] text-white/40">{T.lastUpdated}: {profile.lastUpdated}</p>
              <Link to="/country-tracker" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-white/50 hover:text-white/80 transition-colors mt-4">
                <ArrowLeft className="w-3.5 h-3.5" /> {T.backToTracker}
              </Link>
            </div>
            {/* Right: circular score */}
            <CircleScore score={profile.score} />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { label: T.policyScore, value: profile.policy },
              { label: T.innovationScore, value: profile.innovation },
              { label: T.adoptionScore, value: profile.adoption },
            ].map(s => (
              <div key={s.label} className="px-6 py-6">
                <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-2">{s.label}</p>
                <MiniScoreBar score={s.value} />
              </div>
            ))}
            <div className="px-6 py-6">
              <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-2">{T.riskLevel}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[profile.risk] }} />
                <span className="text-[1.5rem] font-bold text-secondary">{T.riskLevels[profile.risk] || profile.risk}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">

        {/* Policy Summary */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Overview</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-8">{T.regulatoryOverview}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">{profile.summaryFr && language === 'fr' ? profile.summaryFr : profile.summary}</p>
            </div>
            <div className="bg-muted/40 border border-border rounded-lg p-6">
              <p className="text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground mb-4">{T.keyFocusAreas}</p>
              <ul className="space-y-2.5">
                {profile.focusAreas.map(area => (
                  <li key={area} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#D4A017" }} />
                    <span className="text-[0.875rem] text-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Asset Coverage */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Regulation</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.assetClassification}</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border" style={{ backgroundColor: "#F9FAFB" }}>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.assetType}</th>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.status}</th>
                    <th className="text-left px-5 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{T.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(profile.assets).map(([key, val], i) => (
                    <tr key={key} className="border-b border-border/50 last:border-0" style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                      <td className="px-5 py-3.5 font-semibold text-secondary text-[0.875rem]">{T.assets[key] || key}</td>
                      <td className="px-5 py-3.5"><StatusPill status={val.status} /></td>
                      <td className="px-5 py-3.5 text-[0.875rem] text-muted-foreground">{val.noteFr && lang === 'fr' ? val.noteFr : val.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>History</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-8">{T.timelineTitle}</h2>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {profile.timeline.map((ev, i) => (
                <div key={i} className={`relative flex flex-col lg:flex-row gap-4 lg:gap-8 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full border-2 border-white z-10 -translate-x-1/2 mt-4"
                    style={{ backgroundColor: SEV_COLORS[ev.severity] }} />
                  {/* Spacer on desktop */}
                  <div className="hidden lg:block lg:w-1/2" />
                  {/* Card */}
                  <div className="ml-10 lg:ml-0 lg:w-1/2 bg-white border border-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <span className="text-[0.8125rem] font-bold" style={{ color: "#D4A017" }}>{ev.date}</span>
                      <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ backgroundColor: SEV_BG[ev.severity], color: SEV_COLORS[ev.severity] }}>
                         {T.severity[ev.severity.toLowerCase()] || ev.severity}
                      </span>
                    </div>
                    <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{ev.content?.[language]?.title || ev.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed">{ev.content?.[language]?.desc || ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Risk</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.riskAssessment}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            {Object.entries(profile.riskScores).map(([key, val]) => (
              <div key={key} className="bg-white border border-border rounded-lg p-6"
                style={{ borderLeft: `4px solid ${RISK_COLORS[val.level]}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: RISK_COLORS[val.level] }} />
                  <span className="text-[0.8125rem] font-bold uppercase tracking-wide"
                    style={{ color: RISK_COLORS[val.level] }}>{T.riskLevels[val.level] || val.level} {lang === 'fr' ? 'Risque' : 'Risk'}</span>
                </div>
                <p className="text-[0.9375rem] font-semibold text-secondary mb-1">{key === 'regulatory' ? T.regulatoryRisk : key === 'enforcement' ? T.enforcementRisk : T.marketRisk}</p>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed">{val.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.75rem] text-muted-foreground/60">
            {T.riskDisclaimer}
          </p>
        </section>

        {/* Trend Chart */}
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Trend</p>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.trendTitle}</h2>
          <div className="bg-white border border-border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "0.8125rem" }}
                  formatter={(v) => [`${v}`, "Readiness Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="#D4A017" strokeWidth={2.5} dot={{ fill: "#D4A017", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Related Countries */}
        {relatedCountries.length > 0 && (
          <section>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>Compare</p>
            <h2 className="text-[1.5rem] font-bold text-secondary mb-6">{T.relatedTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedCountries.map(c => (
                <Link
                  key={c.name}
                  to={`/country-tracker/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="bg-white border border-border rounded-lg p-6 flex flex-col gap-3 hover:border-accent transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[1.75rem]">{c.flag}</span>
                    <div>
                      <p className="font-bold text-secondary text-[1rem]">{c.name}</p>
                      <p className="text-[0.75rem] text-muted-foreground">{c.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusPill status={c.status} />
                    <span className="text-[1.25rem] font-bold" style={{ color: "#D4A017" }}>{c.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Strip */}
      <section style={{ backgroundColor: "#0B1437" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[1.05rem] font-semibold text-white">
            {T.ctaTitle} {profile.name} {T.ctaAnd}
          </p>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/awpii"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
              style={{ backgroundColor: "#D4A017", color: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {T.ctaButton}
            </Link>
            <Link
              to="/country-tracker"
              className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {T.ctaBack}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}