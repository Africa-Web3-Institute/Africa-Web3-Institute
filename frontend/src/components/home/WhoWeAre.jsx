import { Link } from "react-router-dom";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function WhoWeAre() {
  const { language } = useLanguage();
  const T = t[language].whoWeAre;

  return (
    <section id="who-we-are" className="py-16 lg:py-24 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
            <h2 className="font-display text-[2rem] lg:text-[2.75rem] font-bold leading-snug text-secondary mb-8">
              {T.heading}
            </h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-5">{T.p1}</p>
            <p className="text-[1rem] text-muted-foreground leading-[1.85]">{T.p2}</p>
            <div className="mt-8">
              <Link to="/about"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
              style={{ backgroundColor: "#0B1437", color: "#fff" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1a2a5e"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0B1437"}>
                
{T.buttonCTA}
              </Link>
            </div>
               <div className="mt-6 flex flex-wrap gap-6">
      {T.tags.map((tag) => (
        <div key={tag} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#D4A017" }} />
          <span className="text-[0.8125rem] font-medium text-muted-foreground">{tag}</span>
        </div>
      ))}
    </div>
          </div>
          <div className="relative">
            <div
              className="w-full aspect-[4/3] overflow-hidden"
              style={{ border: "1px solid hsl(var(--border))" }}>
              
              <img src="https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/97ec84da4_African_Web3_Think_Tank__1_.png"

              alt="Africa Web3 Institute team"
              className="w-full h-full object-cover" />
              
            </div>
            {/* Gold accent corner */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 hidden lg:block"
              style={{ border: "2px solid #D4A017", opacity: 0.4 }} />
            
          </div>
        </div>
      </div>
    </section>);

}