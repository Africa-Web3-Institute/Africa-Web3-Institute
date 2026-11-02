// src/components/ui/CountryFlag.jsx
// Renders a country flag image using flagcdn.com
// Works on all browsers including Windows

const ISO_CODES = {
  "Nigeria": "ng",
  "Rwanda": "rw",
  "South Africa": "za",
  "Kenya": "ke",
  "Ghana": "gh",
  "Egypt": "eg",
  "Ethiopia": "et",
  "Senegal": "sn",
  "Tanzania": "tz",
  "Morocco": "ma",
  "Cameroon": "cm",
  "Côte d'Ivoire": "ci",
  "Zimbabwe": "zw",
  "Zambia": "zm",
  "Algeria": "dz",
  "Uganda": "ug",
  "Tunisia": "tn",
  "Botswana": "bw",
  "DR Congo": "cd",
  "Congo": "cg",
  "Mali": "ml",
  "Burkina Faso": "bf",
  "Guinea": "gn",
  "Niger": "ne",
  "Togo": "tg",
  "Benin": "bj",
  "Madagascar": "mg",
  "Burundi": "bi",
  "Chad": "td",
  "Central African Republic": "cf",
  "Gabon": "ga",
  "Comoros": "km",
  "South Sudan": "ss",
  "Liberia": "lr",
  "Sierra Leone": "sl",
  "Gambia": "gm",
  "Guinea-Bissau": "gw",
  "Mauritania": "mr",
  "Cape Verde": "cv",
  "Equatorial Guinea": "gq",
  "São Tomé and Príncipe": "st",
  "Djibouti": "dj",
  "Eritrea": "er",
  "Somalia": "so",
  "Libya": "ly",
  "Sudan": "sd",
  "Angola": "ao",
  "Mozambique": "mz",
  "Malawi": "mw",
  "Namibia": "na",
  "Lesotho": "ls",
  "Eswatini": "sz",
  "Mauritius": "mu",
  "Seychelles": "sc",
};

export default function CountryFlag({ name, size = 24, className = "" }) {
  const code = ISO_CODES[name];
  if (!code) return null;

  // flagcdn.com only supports these fixed widths: 20, 40, 80, 160, 320
  // Pick the closest supported size
  const getSupportedWidth = (s) => {
    if (s <= 20) return 20;
    if (s <= 40) return 40;
    if (s <= 80) return 80;
    if (s <= 160) return 160;
    return 320;
  };

  const w = getSupportedWidth(size * 2);

  return (
    <img
      src={`https://flagcdn.com/w${w}/${code}.png`}
      srcSet={`https://flagcdn.com/w${w * 2 <= 320 ? w * 2 : 320}/${code}.png 2x`}
      width={size * 1.5}
      height={size}
      alt={`${name} flag`}
      className={`inline-block object-cover rounded-sm shrink-0 ${className}`}
      style={{ aspectRatio: "3/2" }}
      loading="lazy"
      decoding="async"
    />
  );
}