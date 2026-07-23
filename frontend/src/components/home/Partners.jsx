import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Aerochain from "../../assets/aerochain_logo.png";
import Nesolearn from "../../assets/nesolearn.png";

const PARTNERS = [
  {
    name: "Smart World Education",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/8e996d543_smartworldlogo1.png",
    url: "https://www.swedu.me/"
  },
  {
    name: "Decentrix Africa",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/9e8e906bc_IMG-20260530-WA00011.jpg",
    url: "https://decentrix.africa/"
  },
  {
    name: "Almstins",
    logo: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/0e14ec7cc_IMG_20260610_145916_072.jpg",
    url: "https://almstins.com/login"
  },
  {
    name: "aerochainafrica",
    logo: Aerochain,
    url: "https://aerochainafrica.com"
  },
  {
    name: "Nesolearn",
    logo: Nesolearn,
    url: "https://nesolearn.com"
  }
];

export default function Partners() {
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <section className="py-20 border-b border-border" style={{ background: "hsl(220 14% 97%)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.partnersTag}
          </p>
          <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.partnersTitle}</h2>
          <p className="text-muted-foreground">{T.partnersSubtitle}</p>
        </div>
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <style>{`
            @keyframes partnersMarquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .partners-track {
              animation: partnersMarquee 22s linear infinite;
            }
            .partners-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="partners-track flex items-stretch gap-4 w-max">
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-[160px] aspect-3/2 flex items-center justify-center bg-white border border-border p-3 transition-all hover:scale-105"
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D4A017"}
                onMouseLeave={e => e.currentTarget.style.borderColor = ""}
              >
                <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
