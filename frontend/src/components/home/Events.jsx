import { MapPin, Calendar } from "lucide-react";
import { useLanguage} from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};



function PrimaryBtn({ children }) {
  return (
    <button
      onClick={() => scrollTo("#contact")}
      className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
      style={{ backgroundColor: "#0B1437", color: "#fff" }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D4A017"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0B1437"}
    >
      {children}
    </button>
  );
}


function OutlineBtn({ children }) {
  return (
    <button
      onClick={() => scrollTo("#contact")}
      className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border transition-colors"
      style={{ borderColor: "#0B1437", color: "#0B1437" }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#0B1437"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#0B1437"; }}
    >
      {children}
    </button>
  );
}

function EventCard({ event, T }) {
  return (
    <div
      className="bg-white p-6 lg:p-8 flex flex-col gap-5"
      style={{ border: "1px solid hsl(var(--border))" }}
    >
      {/* Country tag */}
      {event.country && (
        <span
          className="inline-block self-start text-[0.6875rem] font-semibold tracking-wider uppercase px-2.5 py-1 border"
          style={{ color: "#D4A017", borderColor: "#D4A017" }}
        >
          {event.country}
        </span>
      )}

      {/* Title */}
      <h3 className="text-[1rem] font-bold leading-snug" style={{ color: "#0B1437" }}>
        {event.title}
      </h3>

      {/* Meta: date + location */}
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium" style={{ color: "#0B1437" }}>
          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#D4A017" }} />
          {event.date}
        </span>
        {event.location && (
          <span className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.location}
          </span>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{event.description}</p>
      )}

      {/* Key Outcomes */}
      {event.outcomes && event.outcomes.length > 0 && (
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            {T.keyOutcomes}
          </p>
          <ul className="space-y-2">
            {event.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5">
                <span className="mt-[0.45rem] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D4A017" }} />
                <span className="text-[0.875rem] text-foreground leading-snug">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Topics */}
      {event.topics && event.topics.length > 0 && (
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            {T.keyTopics}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {event.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2.5">
                <span className="mt-[0.45rem] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#D4A017" }} />
                <span className="text-[0.8125rem] text-foreground leading-snug">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      {event.ctas && event.ctas.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border mt-auto">
          {event.ctas.map((cta) =>
            cta.variant === "outline" ? (
              <OutlineBtn key={cta.label}>{cta.label}</OutlineBtn>
            ) : (
              <PrimaryBtn key={cta.label}>{cta.label} →</PrimaryBtn>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function Events() {
const { language } = useLanguage();
const T = t[language]?.events || t["en"].events;


 return (
    <section id="events" className="py-24 lg:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Intro */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h2 className="text-[1.75rem] lg:text-[2.25rem] font-bold leading-snug tracking-tight mb-5" style={{ color: "#0B1437" }}>
            {T.heading}
          </h2>
          <p className="text-[1rem] text-muted-foreground leading-[1.8] mb-3">{T.intro1}</p>
          <p className="text-[1rem] text-muted-foreground leading-[1.8]">{T.intro2}</p>
        </div>

        {/* Month-by-month sections */}
        <div className="space-y-16">
          {T.months.map((monthGroup) => (
            <div key={monthGroup.month}>
              {/* Month heading */}
              <div className="flex items-center gap-4 mb-8">
                <h3
                  className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase shrink-0"
                  style={{ color: "#D4A017" }}
                >
                  {monthGroup.month}
                </h3>
                <div className="flex-1 h-px" style={{ backgroundColor: "#D4A017", opacity: 0.25 }} />
              </div>

              {/* Events grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {monthGroup.events.map((event) => (
                  <EventCard key={event.title} event={event} T={T} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Partner CTA */}
        <div
          className="mt-20 p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.partnerLabel}
            </p>
            <h3 className="text-[1.375rem] font-bold leading-snug max-w-lg" style={{ color: "#0B1437" }}>
              {T.partnerHeading}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <PrimaryBtn>{T.partnerCta1}</PrimaryBtn>
            <OutlineBtn>{T.partnerCta2}</OutlineBtn>
          </div>
        </div>

      </div>
    </section>
  );
}