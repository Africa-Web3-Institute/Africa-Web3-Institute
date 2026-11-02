// src/data/regulatoryUpdates.js
// Africa Web3 Regulatory Tracker — data model aligned to
// "AWI Regulatory Tracker Methodology v1.0" (Sept 2026).
//
// STATUS TAXONOMY (methodology §5): Enacted | Published | Proposed | Announced |
//   Operational Guidance | Under Verification
// CONFIDENCE (methodology §9): High | Moderate | Low / Under Verification
//
// IMPORTANT — data honesty note for whoever maintains this file:
// Only the 8 entries covering the August 2026 batch (ids 26–33) have been run
// through the methodology's source-tiering exercise (see methodology §11,
// "Worked example: August 2026 tracker source audit"). Every other legacy
// entry (ids 1–25) is intentionally set to confidence: "Low / Under Verification"
// with sourceUrl: null, because per methodology §4 and the "minimum publishable
// unit" rule (§11 box), an entry cannot carry a confirmed confidence rating
// without a recorded Tier 1/2 source, reviewer and lastVerified date — none of
// which exist yet for the legacy rows. This is the pending "Audit all 25
// displayed entries" item from the implementation brief §9, not a bug.
// Replace placeholders as each legacy entry clears review.

export const STATUSES = [
  "Enacted",
  "Published",
  "Proposed",
  "Announced",
  "Operational Guidance",
  "Under Verification",
];

export const CONFIDENCE_LEVELS = ["High", "Moderate", "Low / Under Verification"];

export const REGULATORY_UPDATES = [
  // ─────────────────────────────────────────────────────────────────────────
  // AUGUST 2026 BATCH — audited against methodology §11 worked example
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 26, country: "Nigeria", flag: "🇳🇬", region: "West Africa",
    authority: "SEC Nigeria",
    title: "SEC Proposes Comprehensive Digital-Asset Rulebook",
    titleFr: "La SEC propose un règlement complet sur les actifs numériques",
    category: "VASP Regulation",
    status: "Proposed", confidence: "Moderate",
    publishedDate: "20 August 2026", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: "https://sec.gov.ng/for-investors/proposed-rules-digital-and-virtual-assets-operations-custody-and-markets/",
    sourceTier: 2, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "SEC exposes proposed rules covering issuance, tokenisation, trading, custody, transfers, settlement and advisory activities, including approval for foreign-currency stablecoins and substantial minimum-capital requirements.",
    summaryFr: "La SEC expose un projet de règles couvrant l'émission, la tokenisation, le trading, la garde, les transferts, le règlement et les services de conseil, incluant l'approbation de stablecoins en devises étrangères et d'importantes exigences de capital minimum.",
    methodologyNote: "Record consultation status, deadline and later amendments.",
  },
  {
    id: 27, country: "Ghana", flag: "🇬🇭", region: "West Africa",
    authority: "Bank of Ghana",
    title: "Virtual Assets Coordinating Committee Established",
    titleFr: "Création du Comité de Coordination des Actifs Virtuels",
    category: "VASP Regulation",
    status: "Under Verification", confidence: "Low / Under Verification",
    publishedDate: "25 August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "Bank of Ghana inaugurates a cross-agency committee (BoG, SEC, Ministry of Finance, Cyber Security Authority, Financial Intelligence Centre) to coordinate implementation of the VASP Act; BoG chairs the body for its first two years.",
    summaryFr: "La Banque du Ghana inaugure un comité interagences (BoG, SEC, ministère des Finances, Autorité de cybersécurité, Centre de renseignement financier) pour coordonner la mise en œuvre de la loi VASP ; la BoG préside l'organe pour ses deux premières années.",
    methodologyNote: "Source mismatch: the embedded link repeats the sandbox notice. Obtain the BoG inauguration notice before confirming.",
  },
  {
    id: 28, country: "Ghana", flag: "🇬🇭", region: "West Africa",
    authority: "SEC Ghana",
    title: "SEC Expands Virtual-Asset Sandbox to 20 Participants",
    titleFr: "La SEC étend son bac à sable des actifs virtuels à 20 participants",
    category: "Licensing",
    status: "Published", confidence: "Moderate",
    publishedDate: "19 August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: "https://sec.gov.gh/public-notice-full-list-of-virtual-asset-sandbox-participants/",
    sourceTier: 2, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "SEC publishes the full list of 20 sandbox participants, spanning tokenised gold, Treasury bills, bonds, trade finance, commodity exchanges, brokerage and real-world-asset custody, including state entities GoldBod and the Ghana Commodity Exchange.",
    summaryFr: "La SEC publie la liste complète des 20 participants au bac à sable, couvrant l'or tokenisé, les bons du Trésor, les obligations, le financement commercial, les bourses de matières premières, le courtage et la garde d'actifs réels, incluant les entités étatiques GoldBod et la Bourse des matières premières du Ghana.",
    methodologyNote: "Confirm whether admission authorises live activity and under what conditions.",
  },
  {
    id: 29, country: "Nigeria", flag: "🇳🇬", region: "West Africa",
    authority: "SEC Nigeria",
    title: "SEC Clears Three More VASPs for Incubation Programme",
    titleFr: "Trois nouveaux VASP admis au programme d'incubation de la SEC",
    category: "Licensing",
    status: "Published", confidence: "Moderate",
    publishedDate: "August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: "https://sec.gov.ng/for-investors/sec-nigeria-clears-additional-vasps-for-accelerated-regulatory-incubation-programme/",
    sourceTier: 2, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "SEC admits Pisi Payments Solution, BC Access Nigeria and Yellow Card Financial into its Accelerated Regulatory Incubation Programme with Approval-in-Principle, short of a final licence.",
    summaryFr: "La SEC admet Pisi Payments Solution, BC Access Nigeria et Yellow Card Financial dans son programme accéléré d'incubation réglementaire avec une approbation de principe, en deçà d'une licence finale.",
    methodologyNote: "Retain \u2018Approval-in-Principle\u2019 wording; do not describe it as a final licence.",
  },
  {
    id: 30, country: "Nigeria", flag: "🇳🇬", region: "West Africa",
    authority: "Central Bank of Nigeria",
    title: "CBN Opens Dedicated VASP/Stablecoin Sandbox Track",
    titleFr: "La CBN ouvre un volet sandbox dédié VASP/stablecoin",
    category: "Stablecoin Policy",
    status: "Under Verification", confidence: "Low / Under Verification",
    publishedDate: "August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: "https://www.dentonsacaslaw.com/en/insights/newsletters/2026/august/28/dentons-acas-law-financial-services-market-intelligence/cbn-regulatory-sandbox-cohort",
    sourceTier: 3, sourceProvisional: true,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "Central Bank launches Cohort 2 of its Regulatory Sandbox with a dedicated Virtual Asset Service Provider Track covering stablecoins, payments, settlement, custody, wallets and fiat on/off-ramps.",
    summaryFr: "La Banque centrale lance la Cohorte 2 de son bac à sable réglementaire avec un volet dédié aux prestataires de services d'actifs virtuels couvrant les stablecoins, les paiements, le règlement, la garde et les rampes fiat.",
    methodologyNote: "Only law-firm (Tier 3) analysis on file. Replace or supplement with the official CBN cohort notice and application materials.",
  },
  {
    id: 31, country: "Nigeria", flag: "🇳🇬", region: "West Africa",
    authority: "Nigeria Revenue Service",
    title: "NRS Issues Virtual Asset Taxation Guidelines",
    titleFr: "La NRS publie des directives sur la fiscalité des actifs virtuels",
    category: "Taxation",
    status: "Under Verification", confidence: "Low / Under Verification",
    publishedDate: "3 August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: "https://infusionlawyers.com/2026/08/04/understanding-the-nrs-guidelines-on-the-taxation-of-virtual-assets/",
    sourceTier: 3, sourceProvisional: true,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "Nigeria Revenue Service releases operational guidelines clarifying tax treatment of cryptocurrencies, stablecoins, NFTs and other virtual assets, including gains from trading, sales, staking and mining.",
    summaryFr: "La Nigeria Revenue Service publie des directives opérationnelles clarifiant le traitement fiscal des cryptomonnaies, stablecoins, NFT et autres actifs virtuels, y compris les gains issus du trading, des ventes, du staking et du minage.",
    methodologyNote: "Only law-firm (Tier 3) analysis on file. Locate and archive the NRS guideline itself before confirming obligations.",
  },
  {
    id: 32, country: "South Africa", flag: "🇿🇦", region: "Southern Africa",
    authority: "National Treasury / South African Reserve Bank",
    title: "Treasury and SARB Publish Draft Cross-Border Crypto Manual",
    titleFr: "Publication du projet de manuel des actifs crypto transfrontaliers",
    category: "Banking Guidance",
    status: "Proposed", confidence: "Moderate",
    publishedDate: "3 August 2026", effectiveDate: "Not stated", consultationDeadline: "30 September 2026",
    sourceUrl: "https://www.sarb.co.za/en/home/publications/publication-detail-pages/media-releases/2026/crypto-assets",
    sourceTier: 2, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "National Treasury and SARB publish the draft Crypto Assets Manual for Cross-Border Activities, proposing a dedicated CASP authorisation regime, reporting requirements and conditions for transfers involving foreign platforms and self-hosted wallets; comments open until 30 September 2026.",
    summaryFr: "Le National Treasury et la SARB publient le projet de manuel des actifs crypto pour les activités transfrontalières, proposant un régime d'autorisation CASP dédié et de nouvelles exigences de déclaration ; consultation ouverte jusqu'au 30 septembre 2026.",
    methodologyNote: "Track the stated 30 September 2026 comment deadline and final outcome.",
  },
  {
    id: 33, country: "Mauritius", flag: "🇲🇺", region: "East Africa",
    authority: "Financial Services Commission Mauritius",
    title: "FSC Issues Dedicated Stablecoin Guidance",
    titleFr: "La FSC publie des directives dédiées aux stablecoins",
    category: "Stablecoin Policy",
    status: "Under Verification", confidence: "Low / Under Verification",
    publishedDate: "August 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: "https://www.mariblock.com/stories/mauritius-tightens-stablecoin-rules-as-global-regulatory-pressure-builds",
    sourceTier: 4, sourceProvisional: true,
    reviewer: "Pending reviewer assignment", lastVerified: "4 September 2026", revision: 1,
    summary: "Financial Services Commission introduces stablecoin-specific rules requiring compliance with the existing VASP regime and, where applicable, Bank of Mauritius no-objection, plus minimum capital, full reserve backing, five-day redemption and independent attestations; algorithmic and yield-bearing stablecoins will not be approved.",
    summaryFr: "La Commission des services financiers introduit des règles spécifiques aux stablecoins exigeant la conformité au régime VASP existant et, le cas échéant, un avis de non-objection de la Banque de Maurice, ainsi qu'un capital minimum, une couverture intégrale des réserves, un rachat sous cinq jours et des attestations indépendantes ; les stablecoins algorithmiques et à rendement ne seront pas approuvés.",
    methodologyNote: "Specialist-media (Tier 4) report only. Obtain the FSC guidance document and any Bank of Mauritius no-objection requirements.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEGACY ENTRIES — pending audit against methodology (brief §9, item 3)
  // Status reflects best-effort taxonomy mapping; confidence intentionally
  // held at "Low / Under Verification" until each is sourced and reviewed.
  // ─────────────────────────────────────────────────────────────────────────
  { id: 1, country: "Kenya", flag: "🇰🇪", region: "East Africa", authority: "Capital Markets Authority of Kenya",
    title: "CMA Publishes Crypto Licensing Draft", titleFr: "La CMA publie un projet de licences crypto",
    category: "Licensing", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "April 2026", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Capital Markets Authority releases draft rules for digital asset exchanges, opening a public comment period for industry stakeholders.",
    summaryFr: "L'Autorité des marchés des capitaux publie des règles préliminaires pour les échanges d'actifs numériques, ouvrant une période de commentaires publics pour les parties prenantes du secteur." },

  { id: 2, country: "Nigeria", flag: "🇳🇬", region: "West Africa", authority: "Central Bank of Nigeria",
    title: "CBN Issues Updated VASP Guidelines", titleFr: "La CBN publie des directives VASP actualisées",
    category: "VASP Regulation", status: "Operational Guidance", confidence: "Low / Under Verification",
    publishedDate: "March 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Central Bank of Nigeria updates VASP compliance requirements, including enhanced KYC and AML obligations for licensed operators.",
    summaryFr: "La Banque centrale du Nigeria met à jour les exigences de conformité VASP, incluant des obligations KYC et LBC/FT renforcées pour les opérateurs agréés." },

  { id: 3, country: "Zimbabwe", flag: "🇿🇼", region: "Southern Africa", authority: "Reserve Bank of Zimbabwe",
    title: "RBZ Publishes VASP Consultation", titleFr: "La RBZ publie une consultation VASP",
    category: "VASP Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "March 2026", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Reserve Bank of Zimbabwe opens a public consultation on a formal VASP licensing framework.",
    summaryFr: "La Banque de réserve du Zimbabwe ouvre une consultation publique sur un cadre formel de licences VASP." },

  { id: 4, country: "South Africa", flag: "🇿🇦", region: "Southern Africa", authority: "Financial Sector Conduct Authority",
    title: "FSCA Issues Institutional Custody Guidelines", titleFr: "La FSCA publie des directives de garde institutionnelle",
    category: "Banking Guidance", status: "Operational Guidance", confidence: "Low / Under Verification",
    publishedDate: "February 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "FSCA publishes formal rules for custody of digital assets by banks and licensed financial institutions.",
    summaryFr: "La FSCA publie des règles formelles pour la garde des actifs numériques par les banques et les institutions financières agréées." },

  { id: 5, country: "Tunisia", flag: "🇹🇳", region: "North Africa", authority: "Banque Centrale de Tunisie",
    title: "BCT Digital Dinar Pilot Expands", titleFr: "Le pilote du Dinar numérique de la BCT s'étend",
    category: "CBDC", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "February 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Banque Centrale de Tunisie expands the digital dinar pilot to include retail payment use cases across the country.",
    summaryFr: "La Banque Centrale de Tunisie étend le pilote du dinar numérique aux cas d'usage de paiement au détail à travers le pays." },

  { id: 6, country: "Senegal", flag: "🇸🇳", region: "West Africa", authority: "AWI / BCEAO",
    title: "Dakar Web3 Policy Forum", titleFr: "Forum politique Web3 de Dakar",
    category: "VASP Regulation", status: "Announced", confidence: "Low / Under Verification",
    publishedDate: "February 2026", effectiveDate: "Not applicable", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    editorialFlag: "AWI-convened event, not an authority action \u2014 check against methodology \u00a73 inclusion criteria before next publish cycle.",
    summary: "AWI co-hosts the first Francophone Web3 policy roundtable, producing recommendations on VASP licensing for UEMOA member states.",
    summaryFr: "AWI co-organise la première table ronde francophone sur la politique Web3, produisant des recommandations sur les licences VASP pour les États membres de l'UEMOA." },

  { id: 7, country: "Morocco", flag: "🇲🇦", region: "North Africa", authority: "Parliament of Morocco",
    title: "Draft Crypto Legalization Bill Tabled", titleFr: "Projet de loi de légalisation crypto déposé",
    category: "VASP Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "January 2026", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Parliament formally introduces legislation to regulate digital assets, signaling a shift from prohibition toward a supervised licensing framework.",
    summaryFr: "Le Parlement introduit formellement une législation pour réglementer les actifs numériques, signalant un passage de l'interdiction vers un cadre de licences supervisé." },

  { id: 8, country: "Botswana", flag: "🇧🇼", region: "Southern Africa", authority: "NBFIRA Botswana",
    title: "NBFIRA Crypto Licensing Draft Issued", titleFr: "La NBFIRA publie un projet de licences crypto",
    category: "Licensing", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "January 2026", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "NBFIRA publishes draft licensing rules for digital asset service providers operating in Botswana.",
    summaryFr: "La NBFIRA publie des règles préliminaires de licences pour les prestataires de services sur actifs numériques opérant au Botswana." },

  { id: 9, country: "Rwanda", flag: "🇷🇼", region: "East Africa", authority: "National Bank of Rwanda",
    title: "VASP Licensing Framework Updated", titleFr: "Mise à jour du cadre de licences VASP",
    category: "VASP Regulation", status: "Operational Guidance", confidence: "Low / Under Verification",
    publishedDate: "January 2026", effectiveDate: "Q1 2026 (stated)", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Rwanda updates its VASP compliance requirements to align with the FATF Travel Rule, effective Q1 2026.",
    summaryFr: "Le Rwanda met à jour ses exigences de conformité VASP pour s'aligner sur la Travel Rule du GAFI, effective au T1 2026." },

  { id: 10, country: "Ghana", flag: "🇬🇭", region: "West Africa", authority: "Securities and Exchange Commission Ghana",
    title: "SEC Fintech Regulatory Sandbox Opens", titleFr: "Ouverture du bac à sable réglementaire fintech SEC",
    category: "Licensing", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "January 2026", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Ghana SEC opens a regulatory sandbox for digital asset and fintech companies, accepting applications for the first cohort.",
    summaryFr: "La SEC du Ghana ouvre un bac à sable réglementaire pour les entreprises d'actifs numériques et fintech, acceptant les candidatures pour la première cohorte." },

  { id: 11, country: "Egypt", flag: "🇪🇬", region: "North Africa", authority: "Central Bank of Egypt",
    title: "CBE Issues Crypto Risk Circular", titleFr: "La CBE publie une circulaire sur les risques crypto",
    category: "Banking Guidance", status: "Operational Guidance", confidence: "Low / Under Verification",
    publishedDate: "December 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Central Bank of Egypt reissues a formal circular on cryptocurrency risks, reaffirming restrictions on bank facilitation of crypto transactions.",
    summaryFr: "La Banque centrale d'Égypte réémet une circulaire formelle sur les risques des cryptomonnaies, réaffirmant les restrictions sur la facilitation des transactions crypto par les banques." },

  { id: 12, country: "Cameroon", flag: "🇨🇲", region: "Central Africa", authority: "AWI / BEAC",
    title: "AWI Francophone Policy Workshop in Yaoundé", titleFr: "Atelier de politique francophone AWI à Yaoundé",
    category: "VASP Regulation", status: "Announced", confidence: "Low / Under Verification",
    publishedDate: "December 2025", effectiveDate: "Not applicable", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    editorialFlag: "AWI-convened event, not an authority action \u2014 check against methodology \u00a73 inclusion criteria before next publish cycle.",
    summary: "AWI hosts a Web3 policy sensitization workshop for Cameroonian regulators and policymakers on VASP frameworks and AML/CFT obligations.",
    summaryFr: "AWI organise un atelier de sensibilisation à la politique Web3 pour les régulateurs et décideurs camerounais sur les cadres VASP et les obligations LBC/FT." },

  { id: 13, country: "Nigeria", flag: "🇳🇬", region: "West Africa", authority: "Securities and Exchange Commission Nigeria",
    title: "SEC Approves First Digital Asset Exchange", titleFr: "La SEC approuve le premier échange d'actifs numériques",
    category: "Licensing", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "November 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Nigeria's SEC grants the first full operating license to a digital asset exchange under the updated digital assets framework.",
    summaryFr: "La SEC du Nigeria accorde la première licence d'exploitation complète à un échange d'actifs numériques dans le cadre du dispositif actualisé." },

  { id: 14, country: "Tanzania", flag: "🇹🇿", region: "East Africa", authority: "Bank of Tanzania",
    title: "BoT Publishes VASP Discussion Paper", titleFr: "La BoT publie un document de discussion VASP",
    category: "VASP Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "October 2025", effectiveDate: "Not applicable", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Bank of Tanzania releases a public consultation on digital asset oversight and potential VASP licensing requirements.",
    summaryFr: "La Banque de Tanzanie publie une consultation publique sur la supervision des actifs numériques et les exigences potentielles de licences VASP." },

  { id: 15, country: "Tunisia", flag: "🇹🇳", region: "North Africa", authority: "Banque Centrale de Tunisie",
    title: "VASP Consultation Paper Released", titleFr: "Publication du document de consultation VASP",
    category: "VASP Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "September 2025", effectiveDate: "Not applicable", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Banque Centrale de Tunisie releases consultation on licensing requirements for virtual asset service providers.",
    summaryFr: "La Banque Centrale de Tunisie publie une consultation sur les exigences de licences pour les prestataires de services sur actifs virtuels." },

  { id: 16, country: "Zambia", flag: "🇿🇲", region: "Southern Africa", authority: "Securities and Exchange Commission Zambia",
    title: "SEC Zambia Publishes Digital Asset Policy", titleFr: "La SEC Zambie publie une politique sur les actifs numériques",
    category: "Securities Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "September 2025", effectiveDate: "Not stated", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Zambia's Securities and Exchange Commission releases draft policy for digital asset classification and licensing requirements.",
    summaryFr: "La Commission des valeurs mobilières de Zambie publie un projet de politique pour la classification et les exigences de licences des actifs numériques." },

  { id: 17, country: "Uganda", flag: "🇺🇬", region: "East Africa", authority: "Capital Markets Authority Uganda",
    title: "CMA Issues Digital Securities Framework", titleFr: "La CMA publie un cadre pour les titres numériques",
    category: "Securities Regulation", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "August 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Uganda's Capital Markets Authority publishes rules for tokenized securities offerings, providing the first formal digital asset securities guidance.",
    summaryFr: "L'Autorité des marchés des capitaux de l'Ouganda publie des règles pour les offres de titres tokenisés, constituant les premières directives formelles sur les actifs numériques." },

  { id: 18, country: "Cameroon", flag: "🇨🇲", region: "Central Africa", authority: "BEAC",
    title: "BEAC Issues Regional Crypto AML/CFT Guidance", titleFr: "La BEAC publie des directives régionales LBC/FT crypto",
    category: "AML/CFT", status: "Operational Guidance", confidence: "Low / Under Verification",
    publishedDate: "August 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Bank of Central African States issues AML/CFT guidance for member states on virtual asset service providers.",
    summaryFr: "La Banque des États de l'Afrique centrale publie des directives LBC/FT pour les États membres sur les prestataires de services sur actifs virtuels." },

  { id: 19, country: "Algeria", flag: "🇩🇿", region: "North Africa", authority: "Ministry of Finance Algeria",
    title: "Finance Ministry Reaffirms Crypto Ban", titleFr: "Le ministère des Finances réaffirme l'interdiction crypto",
    category: "VASP Regulation", status: "Announced", confidence: "Low / Under Verification",
    publishedDate: "June 2025", effectiveDate: "2018 Finance Law (existing)", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Ministry of Finance reiterates the prohibition on cryptocurrency transactions in response to growing informal market activity.",
    summaryFr: "Le ministère des Finances réitère l'interdiction des transactions en cryptomonnaies en réponse à une activité croissante sur le marché informel." },

  { id: 20, country: "Ghana", flag: "🇬🇭", region: "West Africa", authority: "Bank of Ghana",
    title: "e-Cedi CBDC Pilot Expansion", titleFr: "Extension du pilote MNBC e-Cedi",
    category: "CBDC", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "July 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Bank of Ghana expands the e-Cedi CBDC pilot to rural and agricultural communities, broadening financial inclusion coverage.",
    summaryFr: "La Banque du Ghana étend le pilote MNBC e-Cedi aux communautés rurales et agricoles, élargissant la couverture de l'inclusion financière." },

  { id: 21, country: "Côte d'Ivoire", flag: "🇨🇮", region: "West Africa", authority: "BCEAO",
    title: "BCEAO VASP Consultation Participation", titleFr: "Participation à la consultation VASP de la BCEAO",
    category: "VASP Regulation", status: "Proposed", confidence: "Low / Under Verification",
    publishedDate: "June 2025", effectiveDate: "Not applicable", consultationDeadline: "Not stated",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Côte d'Ivoire participates in the BCEAO regional VASP licensing consultation for UEMOA member states.",
    summaryFr: "La Côte d'Ivoire participe à la consultation régionale de la BCEAO sur les licences VASP pour les États membres de l'UEMOA." },

  { id: 22, country: "Zambia", flag: "🇿🇲", region: "Southern Africa", authority: "Government of Zambia",
    title: "Mining Blockchain Pilot Approved", titleFr: "Approbation du pilote blockchain minier",
    category: "Digital Payments", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "May 2025", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Government approves a pilot for blockchain-based copper export tracking, supporting supply chain transparency and trade settlement.",
    summaryFr: "Le gouvernement approuve un pilote de traçabilité des exportations de cuivre par blockchain, soutenant la transparence de la chaîne d'approvisionnement et le règlement commercial." },

  { id: 23, country: "South Africa", flag: "🇿🇦", region: "Southern Africa", authority: "Financial Sector Conduct Authority",
    title: "First CASP Licences Granted", titleFr: "Premières licences CASP accordées",
    category: "Licensing", status: "Published", confidence: "Low / Under Verification",
    publishedDate: "November 2024", effectiveDate: "Not stated", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "FSCA grants the first batch of Crypto Asset Service Provider licences, formally recognizing licensed digital asset operators.",
    summaryFr: "La FSCA accorde le premier lot de licences de prestataires de services sur crypto-actifs, reconnaissant formellement les opérateurs agréés d'actifs numériques." },

  { id: 24, country: "Kenya", flag: "🇰🇪", region: "East Africa", authority: "Kenya Revenue Authority",
    title: "Finance Act Introduces Digital Asset Tax", titleFr: "La loi de finances introduit une taxe sur les actifs numériques",
    category: "Taxation", status: "Enacted", confidence: "Low / Under Verification",
    publishedDate: "March 2024", effectiveDate: "March 2024 (stated)", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Kenya's Finance Act imposes a 3% digital asset tax, formally acknowledging cryptocurrency within the national tax framework.",
    summaryFr: "La loi de finances du Kenya impose une taxe de 3% sur les actifs numériques, reconnaissant formellement les cryptomonnaies dans le cadre fiscal national." },

  { id: 25, country: "Rwanda", flag: "🇷🇼", region: "East Africa", authority: "National Bank of Rwanda",
    title: "Rwanda Enacts Virtual Asset Act", titleFr: "Le Rwanda adopte la loi sur les actifs virtuels",
    category: "VASP Regulation", status: "Enacted", confidence: "Low / Under Verification",
    publishedDate: "March 2024", effectiveDate: "March 2024 (stated)", consultationDeadline: "Not applicable",
    sourceUrl: null, sourceTier: null, sourceProvisional: false,
    reviewer: "Pending reviewer assignment", lastVerified: null, revision: 1,
    summary: "Comprehensive legislation regulating all classes of digital assets enacted, establishing a full VASP licensing regime.",
    summaryFr: "Une législation complète réglementant toutes les classes d'actifs numériques est adoptée, établissant un régime complet de licences VASP." },
];

export const STATUS_COLORS = {
  Enacted:               { bg: "#dcfce7", text: "#166534", dot: "#16a34a" },
  Published:             { bg: "#e0f2fe", text: "#0369a1", dot: "#0284c7" },
  Proposed:              { bg: "#ede9fe", text: "#5b21b6", dot: "#7c3aed" },
  Announced:             { bg: "#fef9c3", text: "#854d0e", dot: "#D4A017" },
  "Operational Guidance":{ bg: "#ccfbf1", text: "#0f766e", dot: "#0d9488" },
  "Under Verification":  { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
};

export const CONFIDENCE_COLORS = {
  High:                       { bg: "#dcfce7", text: "#166534", dot: "#16a34a" },
  Moderate:                   { bg: "#fef9c3", text: "#854d0e", dot: "#D4A017" },
  "Low / Under Verification": { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
};

export const CATEGORY_COLORS = {
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

export const REGIONS = ["All Regions", "West Africa", "East Africa", "North Africa", "Central Africa", "Southern Africa"];
export const CATEGORIES = ["All Categories", "VASP Regulation", "Stablecoin Policy", "CBDC", "Taxation", "Licensing", "AML/CFT", "Banking Guidance", "Securities Regulation", "Digital Payments"];
export const STATUSES_LIST = ["All Statuses", ...STATUSES];
export const CONFIDENCE_LIST = ["All Confidence Levels", ...CONFIDENCE_LEVELS];
export const DATE_RANGES = ["All Dates", "This month", "Last 3 months", "This year", "Custom range"];

export const TRACKER_META = {
  lastVerified: "September 2026",
  countriesTracked: 18,
};