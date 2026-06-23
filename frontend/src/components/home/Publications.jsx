import { useState } from "react";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage} from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function Publications() {
  const [active, setActive] = useState(null);
  const { language } = useLanguage();
  const T = t[language].publications;

  return (
    <section id="publications" className="py-24 lg:py-36 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* Left label */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
            <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug mb-8">
              {T.heading}
            </h2>
            {/* Featured AWPII card */}
            <div
              className="p-7 mt-4"
              style={{ border: "1px solid rgba(212,160,23,0.5)", backgroundColor: "rgba(212,160,23,0.04)" }}
            >
              <p className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "#D4A017" }}>
                Featured Report
              </p>
              <h3 className="font-display text-[1rem] font-bold text-secondary mb-3 leading-snug">
                Africa Web3 Policy &amp; Innovation Index
              </h3>
              <p className="text-[0.8125rem] text-muted-foreground leading-snug mb-5">
                A quarterly definitive benchmark for regulatory clarity across 54 African nations. 2026 Index coming in January, 2027.
              </p>
              <Link
                to="/awpii"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2.5 px-5 transition-all"
                style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
              >
                <Download className="w-3.5 h-3.5" /> View AWPII
              </Link>
            </div>
          </div>

          {/* Right: publication list */}
          <div className="divide-y divide-border">
            {T.items.map((pub) => (
              <div key={pub.title}>
                {pub.isDashboard ? (
                  <div className="py-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[0.6875rem] font-bold tracking-wider uppercase px-2.5 py-1"
                        style={{ color: "#D4A017", border: "1px solid rgba(212,160,23,0.4)" }}
                      >
                        {pub.tag}
                      </span>
                      <span className="text-[0.75rem] text-muted-foreground">{pub.year}</span>
                    </div>
                    <h3 className="font-display text-[1.0625rem] font-bold text-secondary leading-snug mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-[0.875rem] text-muted-foreground leading-[1.75] mb-5">
                      {pub.description}
                    </p>
                    <a
                      href={pub.dashboardUrl}
                      className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2.5 px-5 transition-all"
                      style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> {pub.dashboardCta}
                    </a>
                  </div>
                ) : (
                  <div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActive(active === pub.title ? null : pub.title)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
                          event.preventDefault();
                          setActive(active === pub.title ? null : pub.title);
                        }
                      }}
                      aria-expanded={active === pub.title}
                      className="py-8 flex items-start justify-between gap-6 group cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-[0.6875rem] font-bold tracking-wider uppercase px-2.5 py-1"
                            style={{ color: "#D4A017", border: "1px solid rgba(212,160,23,0.4)" }}
                          >
                            {pub.tag}
                          </span>
                          <span className="text-[0.75rem] text-muted-foreground">{pub.year}</span>
                        </div>
                        <h3 className="font-display text-[1.0625rem] font-bold text-secondary group-hover:text-primary transition-colors leading-snug">
                          {pub.title}
                        </h3>
                        <p className="mt-2 text-[0.875rem] text-muted-foreground leading-[1.75]">
                          {pub.description}
                        </p>
                        {pub.downloadLabel && (
                          <a
                            href={pub.downloadUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2 px-4 transition-all"
                            style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                          >
                            <Download className="w-3.5 h-3.5" /> {pub.downloadLabel}
                          </a>
                        )}
                      </div>
                      <ArrowRight
                        className="w-4 h-4 mt-1 shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: "rgba(212,160,23,0.5)" }}
                      />
                    </div>
                    {active === pub.title && (
                      <div className="pb-8">
                        <p
                          className="text-[0.8125rem] font-medium text-muted-foreground border-l-2 pl-4"
                          style={{ borderColor: "#D4A017" }}
                        >
                          {T.comingSoon}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}