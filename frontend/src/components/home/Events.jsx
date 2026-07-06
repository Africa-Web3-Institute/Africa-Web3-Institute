import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";
import EventsNetworkVisual from "./EventsNetworkVisual";

const scrollTo = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
};

/* ── Shared buttons ─────────────────────────────────────── */
function PrimaryBtn({ children }) {
  return (
    <motion.button
      onClick={() => scrollTo("#contact")}
      className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5"
      style={{ backgroundColor: "#0B1437", color: "#fff" }}
      whileHover={{ scale: 1.04, backgroundColor: "#D4A017" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}

function OutlineBtn({ children }) {
  return (
    <motion.button
      onClick={() => scrollTo("#contact")}
      className="inline-flex items-center text-[0.8125rem] font-semibold px-5 py-2.5 border"
      style={{ borderColor: "#0B1437", color: "#0B1437" }}
      whileHover={{ scale: 1.04, backgroundColor: "#0B1437", color: "#fff" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}

/* ── Event card ─────────────────────────────────────────── */
function EventCard({ event, T }) {
  return (
    <motion.div
      className="bg-white p-6 lg:p-8 flex flex-col gap-5"
      style={{ border: "1px solid hsl(var(--border))" }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(11,20,55,0.10)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {event.country && (
        <span
          className="inline-block self-start text-[0.6875rem] font-semibold tracking-wider uppercase px-2.5 py-1 border"
          style={{ color: "#D4A017", borderColor: "#D4A017" }}
        >
          {event.country}
        </span>
      )}

      <h3 className="text-[1rem] font-bold leading-snug" style={{ color: "#0B1437" }}>
        {event.title}
      </h3>

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

      {event.description && (
        <p className="text-[0.875rem] text-muted-foreground leading-[1.75]">{event.description}</p>
      )}

      {event.outcomes?.length > 0 && (
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

      {event.topics?.length > 0 && (
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

      {event.ctas?.length > 0 && (
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
    </motion.div>
  );
}

/* ── Month section ──────────────────────────────────────── */
function MonthSection({ groups, T }) {
  const labels = [];
  groups.forEach((g) => {
    const last = labels[labels.length - 1];
    if (last && last.month === g.month) last.span += 1;
    else labels.push({ month: g.month, span: 1 });
  });
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {labels.map((l, i) => (
          <div key={i} className="flex items-center gap-4" style={{ gridColumn: `span ${l.span} / span ${l.span}` }}>
            <h3 className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase shrink-0" style={{ color: "#D4A017" }}>
              {l.month}
            </h3>
            <motion.div
              className="flex-1 h-px"
              style={{ backgroundColor: "#D4A017", opacity: 0.25 }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((g, i) => (
          <Reveal key={i} delay={(i % 3) * 0.08} className="flex flex-col gap-5">
            {g.events.map((event) => (
              <EventCard key={event.title} event={event} T={T} />
            ))}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────── */
export default function Events() {
  const { language } = useLanguage();
  const T = t[language]?.events || t["en"].events;

  const bannerRef = useRef(null);
  const bannerIn  = useInView(bannerRef, { once: true, margin: "-80px 0px" });

  return (
    <section id="events" className="py-24 lg:py-32 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Intro: text + animated visual ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <Reveal as="div" className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
            <h2
              className="font-display font-bold leading-snug tracking-tight mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.375rem)", color: "#0B1437" }}
            >
              {T.heading}
            </h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.82] mb-3">{T.intro1}</p>
            <p className="text-[1rem] text-muted-foreground leading-[1.82]">{T.intro2}</p>
          </Reveal>

          {/* Image panel with animated border accent */}
          <div ref={bannerRef} className="relative">
            <motion.div
              className="relative w-full aspect-[4/3] overflow-hidden"
              style={{ border: "1px solid hsl(var(--border))" }}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={bannerIn ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <EventsNetworkVisual />
            </motion.div>

            {/* Decorative gold border corner */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 hidden lg:block"
              style={{ border: "2px solid #D4A017" }}
              initial={{ opacity: 0, x: 16, y: 16 }}
              animate={bannerIn ? { opacity: 0.4, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* ── Month-by-month event cards ────────────────────── */}
        <div className="space-y-16">
          {T.months.map((monthGroup, idx) =>
            monthGroup.section ? (
              <MonthSection key={idx} groups={monthGroup.section} T={T} />
            ) : (
              <div key={monthGroup.month}>
                <div className="flex items-center gap-4 mb-8">
                  <h3
                    className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase shrink-0"
                    style={{ color: "#D4A017" }}
                  >
                    {monthGroup.month}
                  </h3>
                  <motion.div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#D4A017", opacity: 0.25 }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {monthGroup.events.map((event, i) => (
                    <Reveal key={event.title} delay={(i % 3) * 0.08}>
                      <EventCard event={event} T={T} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* ── Partner CTA ───────────────────────────────────── */}
        <motion.div
          className="mt-20 p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative overflow-hidden"
          style={{ border: "1px solid hsl(var(--border))" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ borderColor: "#D4A017" }}
        >
          {/* Sweep shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(212,160,23,0.04) 50%, transparent 60%)",
              x: "-100%",
            }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8 }}
          />
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
        </motion.div>
      </div>
    </section>
  );
}
