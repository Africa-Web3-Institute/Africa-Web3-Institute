// src/components/CountryFlag.jsx
const EMOJI_TO_ISO = {
  "🇳🇬": "ng", "🇿🇦": "za", "🇰🇪": "ke", "🇷🇼": "rw",
  "🇬🇭": "gh", "🇪🇬": "eg", "🇪🇹": "et", "🇸🇳": "sn",
  "🇹🇿": "tz", "🇲🇦": "ma", "🇨🇲": "cm", "🇨🇮": "ci",
  "🇿🇼": "zw", "🇿🇲": "zm", "🇩🇿": "dz", "🇺🇬": "ug",
  "🇹🇳": "tn", "🇧🇼": "bw", "🇲🇺": "mu", "🇸🇨": "sc",
  "🇳🇦": "na", "🇸🇬": "sg", "🇦🇪": "ae", "🇭🇰": "hk",
  "🇧🇭": "bh", "🇸🇻": "sv", "🇯🇵": "jp", "🇨🇭": "ch",
  "🇪🇺": "eu",
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
    />
  );
}