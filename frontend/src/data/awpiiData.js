// src/data/awpiiData.js
// Official May 2026 Snapshot data for the Africa Web3 Policy & Innovation Index (AWPII)
// Bilingual: English (en) and French (fr)

const awpiiData = [
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
      en: {
        name: "South Africa",
        key_update: "CARF live; capital flow draft regs",
        swot: {
          strengths: "World-class regulatory clarity (300+ FSCA CASPs, CARF live since March 1, 2026), strong TradFi integration, robust enforcement, and institutional maturity.",
          weaknesses: "Transitional uncertainties around capital controls and relatively high compliance burden for smaller players.",
          opportunities: "Finalize stablecoin framework (rand-pegged focus) and expand tokenized asset pilots in supply chains/public services.",
          threats: "The proposed Capital Flow Management Regulations could introduce stricter reporting or approval requirements for crypto-related outflows, potentially slowing cross-border innovation."
        }
      },
      fr: {
        name: "Afrique du Sud",
        key_update: "CARF en vigueur ; projets de réglementation des flux de capitaux",
        swot: {
          strengths: "Clarté réglementaire de classe mondiale (plus de 300 CASP agréés par la FSCA, CARF en vigueur depuis le 1er mars 2026), forte intégration TradFi, application rigoureuse et maturité institutionnelle.",
          weaknesses: "Incertitudes transitoires autour des contrôles de capitaux et charge de conformité relativement élevée pour les petits acteurs.",
          opportunities: "Finaliser le cadre des stablecoins (axé sur le rand) et étendre les projets pilotes d'actifs tokenisés dans les chaînes d'approvisionnement et les services publics.",
          threats: "Les propositions de réglementation sur la gestion des flux de capitaux pourraient introduire des exigences plus strictes de déclaration ou d'approbation pour les sorties liées aux cryptos, freinant potentiellement l'innovation transfrontalière."
        }
      }
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
      en: {
        name: "Kenya",
        key_update: "Draft VASP Regs 2026 released",
        swot: {
          strengths: "Africa's first standalone VASP Act (2025) + Draft VASP Regulations 2026 provide comprehensive structure; excellent mobile money synergy (M-Pesa).",
          weaknesses: "High proposed capital thresholds (e.g., KES 500M for some licenses) may exclude local startups.",
          opportunities: "Rapid licensing rollout post-draft regulations; expand stablecoin/remittance use cases.",
          threats: "Potential regulatory overlap or coordination friction between CBK and CMA could slow implementation; high compliance costs might favor foreign players."
        }
      },
      fr: {
        name: "Kenya",
        key_update: "Publication du projet de réglementation VASP 2026",
        swot: {
          strengths: "Première loi VASP autonome d'Afrique (2025) + projet de réglementation VASP 2026 offrant une structure complète ; excellente synergie avec l'argent mobile (M-Pesa).",
          weaknesses: "Des seuils de capital élevés proposés (ex. : 500M KES pour certaines licences) peuvent exclure les startups locales.",
          opportunities: "Déploiement rapide des licences après la réglementation ; étendre les cas d'usage des stablecoins et des transferts de fonds.",
          threats: "Un chevauchement réglementaire potentiel ou des frictions de coordination entre la CBK et la CMA pourraient ralentir la mise en œuvre ; des coûts de conformité élevés pourraient favoriser les acteurs étrangers."
        }
      }
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
      en: {
        name: "Mauritius",
        key_update: "Stable mature framework",
        swot: {
          strengths: "Mature VAITOS framework, clear licensing classes, FATF alignment, and attractive tax environment.",
          weaknesses: "Smaller domestic market limits raw adoption volume.",
          opportunities: "Deepen linkages with mainland African markets as a gateway.",
          threats: "Global shifts in offshore regulations or increased scrutiny on tax-friendly jurisdictions could reduce appeal for international VASPs."
        }
      },
      fr: {
        name: "Maurice",
        key_update: "Cadre mature et stable",
        swot: {
          strengths: "Cadre VAITOS mature, classes de licences claires, alignement FATF et environnement fiscal attractif.",
          weaknesses: "Un marché domestique plus petit limite le volume brut d'adoption.",
          opportunities: "Approfondir les liens avec les marchés continentaux africains en tant que passerelle.",
          threats: "Les évolutions mondiales des réglementations offshore ou une surveillance accrue des juridictions fiscalement avantageuses pourraient réduire l'attrait pour les VASP internationaux."
        }
      }
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
      en: {
        name: "Ghana",
        key_update: "Sandbox pilots active",
        swot: {
          strengths: "VASP Act enforced + active regulatory sandbox (11 firms in pilots); gold-backed stablecoin exploration adds unique innovation angle.",
          weaknesses: "Early-stage implementation — full licensing still scaling.",
          opportunities: "Convert successful sandbox pilots into mainstream licenses; integrate gold-backed tokens with cedi ecosystem.",
          threats: "Execution risks in sandbox-to-full regime transition; potential BoG/SEC coordination challenges."
        }
      },
      fr: {
        name: "Ghana",
        key_update: "Projets pilotes du bac à sable actifs",
        swot: {
          strengths: "Loi VASP appliquée + bac à sable réglementaire actif (11 entreprises en phase pilote) ; l'exploration de stablecoins adossés à l'or ajoute un angle d'innovation unique.",
          weaknesses: "Mise en œuvre à un stade précoce — l'octroi complet de licences est encore en cours de déploiement.",
          opportunities: "Convertir les pilotes réussis du bac à sable en licences générales ; intégrer les jetons adossés à l'or avec l'écosystème du cedi.",
          threats: "Risques d'exécution dans la transition du bac à sable au régime complet ; défis potentiels de coordination entre la BoG et la SEC."
        }
      }
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
      en: {
        name: "Nigeria",
        key_update: "Strong SEC enforcement + volume leader",
        swot: {
          strengths: "Massive adoption scale (#6 global Chainalysis); ISA 2025 + SEC licensing/tax enforcement provide legal foundation.",
          weaknesses: "High compliance costs and capital requirements disadvantage smaller VASPs.",
          opportunities: "Streamline licensing to boost local innovation; expand institutional on-ramps.",
          threats: "FX controls and CBN monetary policy caution could trigger sudden restrictions; macroeconomic volatility (inflation) drives usage but adds uncertainty."
        }
      },
      fr: {
        name: "Nigeria",
        key_update: "Application rigoureuse de la SEC + leader en volume",
        swot: {
          strengths: "Échelle d'adoption massive (6e mondial selon Chainalysis) ; ISA 2025 + application des licences/fiscalité par la SEC fournissent une base juridique.",
          weaknesses: "Des coûts de conformité et des exigences de capital élevés désavantagent les petits VASP.",
          opportunities: "Rationaliser l'octroi de licences pour stimuler l'innovation locale ; élargir les passerelles institutionnelles.",
          threats: "Les contrôles de change et la prudence de la politique monétaire de la CBN pourraient déclencher des restrictions soudaines ; la volatilité macroéconomique (inflation) stimule l'utilisation mais ajoute de l'incertitude."
        }
      }
    }
  },
  {
    id: "RWA",
    key: "rwanda",
    flag: "🇷🇼",
    rank: 6,
    overall_score: 83.1,
    grade: "A",
    tier_color: "Green",
    momentum: "Strong Upward",
    pillars: { clarity: 80, policy_support: 85, innovation: 85, adoption: 82 },
    content: {
      en: {
        name: "Rwanda",
        key_update: "Draft law advancing; digital hub focus",
        swot: {
          strengths: "Proactive national blockchain strategy and digital economy vision.",
          weaknesses: "Smaller market size limits scale.",
          opportunities: "Finalize and implement draft virtual assets law; position as East Africa's innovation testbed.",
          threats: "Over-reliance on government-led initiatives may slow private-sector dynamism if private investment lags."
        }
      },
      fr: {
        name: "Rwanda",
        key_update: "Projet de loi en progression ; focus sur le hub numérique",
        swot: {
          strengths: "Stratégie nationale proactive pour la blockchain et vision de l'économie numérique.",
          weaknesses: "La taille réduite du marché limite l'échelle.",
          opportunities: "Finaliser et mettre en œuvre le projet de loi sur les actifs virtuels ; se positionner comme le banc d'essai de l'innovation en Afrique de l'Est.",
          threats: "Une dépendance excessive aux initiatives gouvernementales pourrait ralentir le dynamisme du secteur privé si l'investissement privé tarde."
        }
      }
    }
  },
  {
    id: "MAR",
    key: "morocco",
    flag: "🇲🇦",
    rank: 7,
    overall_score: 82.0,
    grade: "A",
    tier_color: "Green",
    momentum: "Upward",
    pillars: { clarity: 80, policy_support: 82, innovation: 83, adoption: 83 },
    content: {
      en: {
        name: "Morocco",
        key_update: "Draft Bill 42.25 progressing",
        swot: {
          strengths: "Rapid shift from 2017 ban via advancing Draft Bill 42.25.",
          weaknesses: "Licensing framework still in transition.",
          opportunities: "Formalize underground adoption into regulated channels.",
          threats: "Political or regional delays in passing the final bill could stall momentum."
        }
      },
      fr: {
        name: "Maroc",
        key_update: "Projet de loi 42.25 en progression",
        swot: {
          strengths: "Transition rapide depuis l'interdiction de 2017 grâce au projet de loi 42.25 en cours.",
          weaknesses: "Le cadre de licences est encore en transition.",
          opportunities: "Formaliser l'adoption souterraine dans des canaux réglementés.",
          threats: "Des retards politiques ou régionaux dans l'adoption de la loi finale pourraient freiner l'élan."
        }
      }
    }
  },
  {
    id: "SYC",
    key: "seychelles",
    flag: "🇸🇨",
    rank: 8,
    overall_score: 80.2,
    grade: "A-",
    tier_color: "Green",
    momentum: "Stable",
    pillars: { clarity: 83, policy_support: 80, innovation: 80, adoption: 77 },
    content: {
      en: {
        name: "Seychelles",
        key_update: "Offshore licensing appeal",
        swot: {
          strengths: "Flexible VASP licensing and offshore appeal.",
          weaknesses: "Limited domestic market.",
          opportunities: "Serve as bridge for African and Indian Ocean Web3 flows.",
          threats: "Global crackdowns on offshore jurisdictions could impact attractiveness."
        }
      },
      fr: {
        name: "Seychelles",
        key_update: "Attractivité des licences offshore",
        swot: {
          strengths: "Licences VASP flexibles et attractivité offshore.",
          weaknesses: "Marché domestique limité.",
          opportunities: "Servir de pont pour les flux Web3 africains et de l'océan Indien.",
          threats: "Les répressions mondiales contre les juridictions offshore pourraient impacter l'attractivité."
        }
      }
    }
  },
  {
    id: "NAM",
    key: "namibia",
    flag: "🇳🇦",
    rank: 9,
    overall_score: 76.8,
    grade: "A-",
    tier_color: "Green",
    momentum: "Steady Upward",
    pillars: { clarity: 77, policy_support: 76, innovation: 78, adoption: 76 },
    content: {
      en: {
        name: "Namibia",
        key_update: "Licensing + FATF alignment",
        swot: {
          strengths: "Solid licensing regime and FATF alignment.",
          weaknesses: "Smaller ecosystem scale.",
          opportunities: "Leverage Southern Africa regional integration.",
          threats: "Slow implementation pace compared to faster-moving peers."
        }
      },
      fr: {
        name: "Namibie",
        key_update: "Licences + alignement FATF",
        swot: {
          strengths: "Régime de licences solide et alignement FATF.",
          weaknesses: "Échelle réduite de l'écosystème.",
          opportunities: "Tirer parti de l'intégration régionale de l'Afrique australe.",
          threats: "Rythme de mise en œuvre lent par rapport aux pairs plus rapides."
        }
      }
    }
  },
  {
    id: "BWA",
    key: "botswana",
    flag: "🇧🇼",
    rank: 10,
    overall_score: 75.6,
    grade: "A-",
    tier_color: "Green",
    momentum: "Steady Upward",
    pillars: { clarity: 75, policy_support: 76, innovation: 76, adoption: 75 },
    content: {
      en: {
        name: "Botswana",
        key_update: "Virtual Assets Act updates",
        swot: {
          strengths: "Updated Virtual Assets Act aligned with FATF.",
          weaknesses: "Early-stage ecosystem development.",
          opportunities: "Build on Southern Africa momentum.",
          threats: "Resource constraints may slow full rollout of framework."
        }
      },
      fr: {
        name: "Botswana",
        key_update: "Mises à jour de la loi sur les actifs virtuels",
        swot: {
          strengths: "Loi sur les actifs virtuels mise à jour et alignée sur le FATF.",
          weaknesses: "Développement de l'écosystème à un stade précoce.",
          opportunities: "S'appuyer sur l'élan de l'Afrique australe.",
          threats: "Des contraintes de ressources peuvent ralentir le déploiement complet du cadre."
        }
      }
    }
  },
  {
    id: "UGA",
    key: "uganda",
    flag: "🇺🇬",
    rank: 11,
    overall_score: 74.2,
    grade: "A-",
    tier_color: "Green",
    momentum: "Steady Upward",
    content: {
      en: { name: "Uganda", key_update: "Grassroots strength" },
      fr: { name: "Ouganda", key_update: "Force de la base communautaire" }
    }
  },
  {
    id: "ETH",
    key: "ethiopia",
    flag: "🇪🇹",
    rank: 12,
    overall_score: 71.8,
    grade: "BBB+",
    tier_color: "Yellow",
    momentum: "Steady Upward",
    content: {
      en: { name: "Ethiopia", key_update: "High adoption despite limited formal regs" },
      fr: { name: "Éthiopie", key_update: "Forte adoption malgré une réglementation formelle limitée" }
    }
  },
  {
    id: "TZA",
    key: "tanzania",
    flag: "🇹🇿",
    rank: 13,
    overall_score: 71.5,
    grade: "BBB+",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Tanzania", key_update: "Cautious but active underground use" },
      fr: { name: "Tanzanie", key_update: "Utilisation souterraine prudente mais active" }
    }
  },
  {
    id: "ZMB",
    key: "zambia",
    flag: "🇿🇲",
    rank: 14,
    overall_score: 69.4,
    grade: "BBB-",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Zambia", key_update: "Draft discussions ongoing" },
      fr: { name: "Zambie", key_update: "Discussions sur le projet en cours" }
    }
  },
  {
    id: "SEN",
    key: "senegal",
    flag: "🇸🇳",
    rank: 15,
    overall_score: 64.5,
    grade: "BB+",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Senegal", key_update: "ECOWAS fintech influence" },
      fr: { name: "Sénégal", key_update: "Influence fintech de la CEDEAO" }
    }
  },
  {
    id: "CIV",
    key: "cotedivoire",
    flag: "🇨🇮",
    rank: 16,
    overall_score: 64.3,
    grade: "BB+",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Côte d'Ivoire", key_update: "Mobile money potential" },
      fr: { name: "Côte d'Ivoire", key_update: "Potentiel de l'argent mobile" }
    }
  },
  {
    id: "TUN",
    key: "tunisia",
    flag: "🇹🇳",
    rank: 17,
    overall_score: 63.5,
    grade: "BB",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Tunisia", key_update: "Underground active" },
      fr: { name: "Tunisie", key_update: "Activité souterraine" }
    }
  },
  {
    id: "CMR",
    key: "cameroon",
    flag: "🇨🇲",
    rank: 18,
    overall_score: 58.5,
    grade: "BB",
    tier_color: "Yellow",
    momentum: "Stable",
    content: {
      en: { name: "Cameroon", key_update: "CEMAC restrictions persist" },
      fr: { name: "Cameroun", key_update: "Les restrictions CEMAC persistent" }
    }
  },
  {
    id: "DZA",
    key: "algeria",
    flag: "🇩🇿",
    rank: 19,
    overall_score: 52.5,
    grade: "BB-",
    tier_color: "Red",
    momentum: "Stable",
    content: {
      en: { name: "Algeria", key_update: "Explicit ban" },
      fr: { name: "Algérie", key_update: "Interdiction explicite" }
    }
  },
  {
    id: "EGY",
    key: "egypt",
    flag: "🇪🇬",
    rank: 20,
    overall_score: 41.3,
    grade: "B-",
    tier_color: "Red",
    momentum: "Stable",
    content: {
      en: { name: "Egypt", key_update: "Strict prohibition (Law 194/2020)" },
      fr: { name: "Égypte", key_update: "Interdiction stricte (Loi 194/2020)" }
    }
  }
];

export default awpiiData;