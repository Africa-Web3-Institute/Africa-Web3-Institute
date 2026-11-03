/**
 * ExploreAWI — "featured + 3" layout.
 *
 * Intelligence (the flagship) is a large featured card; Programs & Events,
 * About and Partnerships stack beside it. Text sits on the photo over a navy
 * gradient, and every card links straight to its page.
 *
 *  lg:  [ featured (2 cols × 3 rows) ][ small ]
 *                                      [ small ]
 *                                      [ small ]
 *  md:  featured full width, three small cards in a row beneath
 *  sm:  everything stacked
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, Users, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

const CARD_META = [
  { icon: BookOpen, href: "/intelligence", image: "/images/moments/roundtable-briefing.jpg" },
  { icon: CalendarDays, href: "/programs-events", image: "/images/moments/classroom-training.jpg" },
  { icon: Users, href: "/about", image: "/images/moments/speaker-session.jpg" },
  { icon: Mail, href: "/contact", image: "/images/moments/workshop-group.jpg" },
];

function ExploreCard({ card, meta, featured, delay, className = "" }) {
  const Icon = meta.icon;

  return (
    <Reveal delay={delay} className={className}>
      <Link
        to={meta.href}
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label={card.title}
        className={`group relative flex h-full w-full overflow-hidden rounded-[18px] bg-[#0B1437] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A017] ${
          featured ? "min-h-[340px] sm:min-h-[400px]" : "min-h-[170px]"
        }`}
      >
        {/* Photo (slow zoom on hover) */}
        <img
          src={meta.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />

        {/* Navy gradient keeps white text readable on any photo */}
        <div
          className="absolute inset-0"
          style={{
            background: featured
              ? "linear-gradient(to top, rgba(11,20,55,0.95) 0%, rgba(11,20,55,0.7) 38%, rgba(11,20,55,0.15) 75%, rgba(11,20,55,0.05) 100%)"
              : "linear-gradient(to top, rgba(11,20,55,0.95) 0%, rgba(11,20,55,0.78) 50%, rgba(11,20,55,0.35) 100%)",
          }}
        />

        {/* Content pinned to the bottom */}
        <div className={`relative z-10 mt-auto w-full ${featured ? "p-7 sm:p-9 lg:p-10" : "p-5 sm:p-6"}`}>
          <span
            className={`inline-flex items-center justify-center rounded-lg mb-4 backdrop-blur-sm ${featured ? "w-11 h-11" : "w-9 h-9"}`}
            style={{ backgroundColor: "rgba(212,160,23,0.16)", border: "1px solid rgba(212,160,23,0.45)" }}
          >
            <Icon className={featured ? "w-5 h-5" : "w-4 h-4"} style={{ color: "#D4A017" }} />
          </span>

          <h3
            className={`font-bold text-white leading-tight ${
              featured ? "font-display text-[1.75rem] sm:text-[2.125rem] mb-3" : "text-[1.125rem] mb-1.5"
            }`}
          >
            {card.title}
          </h3>

          <p
            className={`leading-relaxed ${featured ? "text-[0.9375rem] sm:text-[1rem] max-w-md mb-6" : "text-[0.8125rem] mb-3 line-clamp-2"}`}
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {card.description}
          </p>

          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold" style={{ color: "#D4A017" }}>
            {card.cta}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>

        {/* Gold rule that grows along the bottom edge on hover */}
        <span
          className="absolute left-0 bottom-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 z-20"
          style={{ backgroundColor: "#D4A017" }}
        />
      </Link>
    </Reveal>
  );
}

export default function ExploreAWI() {
  const { language } = useLanguage();
  const T = t[language].exploreAWI;
  const [featured, ...rest] = T.cards;

  return (
    <section id="explore-awi" className="py-20 lg:py-28 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header — centered */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-14 max-w-2xl mx-auto">
          <Reveal>
            <p className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
            <h2
              className="font-display font-bold text-secondary leading-snug tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              {T.heading}
            </h2>
          </Reveal>
          <motion.div
            className="h-[2px] w-16 mx-auto mt-6"
            style={{ backgroundColor: "#D4A017" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Featured + 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-rows-3 gap-5">
          <ExploreCard
            card={featured}
            meta={CARD_META[0]}
            featured
            delay={0}
            className="md:col-span-3 lg:col-span-2 lg:row-span-3"
          />
          {rest.map((card, i) => (
            <ExploreCard key={card.title} card={card} meta={CARD_META[i + 1]} delay={0.08 * (i + 1)} />
          ))}
        </div>
      </div>
    </section>
  );
}
