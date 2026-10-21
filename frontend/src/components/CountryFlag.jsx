// src/components/CountryFlag.jsx
const EMOJI_TO_ISO = {
  // Non-African (kept from original)
  "🇸🇬": "sg", // Singapore
  "🇦🇪": "ae", // UAE
  "🇭🇰": "hk", // Hong Kong
  "🇧🇭": "bh", // Bahrain
  "🇸🇻": "sv", // El Salvador
  "🇯🇵": "jp", // Japan
  "🇨🇭": "ch", // Switzerland
  "🇪🇺": "eu", // European Union

  // All 54 African Union member states, A-Z
  "🇩🇿": "dz", // Algeria
  "🇦🇴": "ao", // Angola
  "🇧🇯": "bj", // Benin
  "🇧🇼": "bw", // Botswana
  "🇧🇫": "bf", // Burkina Faso
  "🇧🇮": "bi", // Burundi
  "🇨🇻": "cv", // Cabo Verde
  "🇨🇲": "cm", // Cameroon
  "🇨🇫": "cf", // Central African Republic
  "🇹🇩": "td", // Chad
  "🇰🇲": "km", // Comoros
  "🇨🇬": "cg", // Congo (the)
  "🇨🇩": "cd", // Congo (the Democratic Republic of the)
  "🇨🇮": "ci", // Cote d'Ivoire
  "🇩🇯": "dj", // Djibouti
  "🇪🇬": "eg", // Egypt
  "🇬🇶": "gq", // Equatorial Guinea
  "🇪🇷": "er", // Eritrea
  "🇸🇿": "sz", // Eswatini
  "🇪🇹": "et", // Ethiopia
  "🇬🇦": "ga", // Gabon
  "🇬🇲": "gm", // Gambia
  "🇬🇭": "gh", // Ghana
  "🇬🇳": "gn", // Guinea
  "🇬🇼": "gw", // Guinea-Bissau
  "🇰🇪": "ke", // Kenya
  "🇱🇸": "ls", // Lesotho
  "🇱🇷": "lr", // Liberia
  "🇱🇾": "ly", // Libya
  "🇲🇬": "mg", // Madagascar
  "🇲🇼": "mw", // Malawi
  "🇲🇱": "ml", // Mali
  "🇲🇷": "mr", // Mauritania
  "🇲🇺": "mu", // Mauritius
  "🇲🇦": "ma", // Morocco
  "🇲🇿": "mz", // Mozambique
  "🇳🇦": "na", // Namibia
  "🇳🇪": "ne", // Niger
  "🇳🇬": "ng", // Nigeria
  "🇷🇼": "rw", // Rwanda
  "🇸🇹": "st", // Sao Tome and Principe
  "🇸🇳": "sn", // Senegal
  "🇸🇨": "sc", // Seychelles
  "🇸🇱": "sl", // Sierra Leone
  "🇸🇴": "so", // Somalia
  "🇿🇦": "za", // South Africa
  "🇸🇸": "ss", // South Sudan
  "🇸🇩": "sd", // Sudan
  "🇹🇿": "tz", // Tanzania
  "🇹🇬": "tg", // Togo
  "🇹🇳": "tn", // Tunisia
  "🇺🇬": "ug", // Uganda
  "🇿🇲": "zm", // Zambia
  "🇿🇼": "zw", // Zimbabwe
};

export default function CountryFlag({ emoji, size = 20, className = "" }) {
  const iso = EMOJI_TO_ISO[emoji];

  if (!iso) {
    // fallback: just render the emoji as-is
    return <span className={className} style={{ fontSize: size }}>{emoji}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/${size > 30 ? "40x30" : "20x15"}/${iso}.png`}
      srcSet={`https://flagcdn.com/${size > 30 ? "80x60" : "40x30"}/${iso}.png 2x`}
      alt={iso.toUpperCase()}
      width={size > 30 ? 40 : 20}
      height={size > 30 ? 30 : 15}
      className={`inline-block rounded-sm object-cover ${className}`}
      style={{ verticalAlign: "middle" }}
      loading="lazy"
      decoding="async"
    />
  );
}
