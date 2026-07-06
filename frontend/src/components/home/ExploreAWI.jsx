/**
 * ExploreAWI — Ucresco-inspired image card grid.
 *
 * Each card has:
 *  - A full-height image with Ken-Burns scale on hover
 *  - Ucresco-style gold corner brackets (top-left + bottom-right) that animate in on hover
 *  - A floating icon badge sitting on the image/content boundary
 *  - Framer Motion entrance + hover animations
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, Users, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

const CARD_META = [
  {
    icon: BookOpen,
    accent: "#D4A017",
    iconBg: "rgba(212,160,23,0.12)",
    href: "/intelligence",
    image: "/images/moments/speaker-session.jpg",
  },
  {
    icon: CalendarDays,
    accent: "#D4A017",
    iconBg: "rgba(212,160,23,0.12)",
    href: "/programs-events",
    image: "/images/moments/policy-convening.jpg",
  },
  {
    icon: Users,
    accent: "#D4A017",
    iconBg: "rgba(212,160,23,0.12)",
    href: "/about",
    image: "/images/moments/roundtable-briefing.jpg",
  },
  {
    icon: Mail,
    accent: "#D4A017",
    iconBg: "rgba(212,160,23,0.12)",
    href: "/contact",
    image: "/images/moments/workshop-group.jpg",
  },
];

/* Gold corner brackets — Ucresco signature image treatment, animate in on card hover */
function CornerBrackets() {
  const cls = "absolute w-7 h-7 pointer-events-none z-20 opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100";
  return (
    <>
      <span className={`${cls} top-3 left-3`} style={{ borderTop: "2px solid #D4A017", borderLeft: "2px solid #D4A017" }} />
      <span className={`${cls} top-3 right-3`} style={{ borderTop: "2px solid #D4A017", borderRight: "2px solid #D4A017", transitionDelay: "0.04s" }} />
      <span className={`${cls} bottom-3 left-3`} style={{ borderBottom: "2px solid #D4A017", borderLeft: "2px solid #D4A017", transitionDelay: "0.08s" }} />
      <span className={`${cls} bottom-3 right-3`} style={{ borderBottom: "2px solid #D4A017", borderRight: "2px solid #D4A017", transitionDelay: "0.12s" }} />
    </>
  );
}

function ExploreCard({ card, meta, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const navigate = useNavigate();
  const Icon = meta.icon;

  const handleClick = () => navigate(meta.href);

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      aria-label={card.title}
    >
      <motion.div
        className="w-full h-full bg-white flex flex-col overflow-hidden rounded-[18px]"
        style={{ border: "1px solid hsl(var(--border))" }}
        whileHover={{ y: -6, borderColor: "#D4A017", boxShadow: "0 24px 48px rgba(11,20,55,0.16)" }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Image area */}
        <div className="relative w-full overflow-hidden shrink-0 rounded-t-[18px]" style={{ height: "clamp(210px, 22vw, 280px)" }}>
          {/* Ken-Burns on hover */}
          <motion.img
            src={meta.image}
            alt={card.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gradient */}
          <div
            className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(to top, rgba(11,20,55,0.65) 0%, rgba(11,20,55,0.15) 55%, transparent 100%)" }}
          />

          {/* Ucresco gold corner brackets — visible on group hover */}
          <CornerBrackets />

          {/* Floating icon badge — sits on boundary line */}
          <span
            className="absolute bottom-0 left-7 translate-y-1/2 z-30 inline-flex items-center justify-center w-12 h-12 rounded-xl shadow-lg"
            style={{
              backgroundColor: "#fff",
              border: `1.5px solid rgba(212,160,23,0.35)`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: meta.accent }} />
          </span>
        </div>

        {/* Content area */}
        <div className="flex flex-col flex-1 px-7 pt-9 pb-7 gap-3">
          <motion.h3
            className="text-[1.0625rem] font-bold leading-snug"
            style={{ color: "#0B1437" }}
            whileHover={{ color: "#D4A017" }}
            transition={{ duration: 0.2 }}
          >
            {card.title}
          </motion.h3>

          <p className="text-[0.875rem] leading-[1.75] flex-1" style={{ color: "#6B7280" }}>
            {card.description}
          </p>

          {/* CTA link */}
          <motion.span
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold mt-3 pt-4"
            style={{
              color: meta.accent,
              borderTop: "1px solid hsl(var(--border))",
            }}
            whileHover={{ gap: "8px" }}
            transition={{ duration: 0.2 }}
          >
            {card.cta}
            <motion.span
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExploreAWI() {
  const { language } = useLanguage();
  const T = t[language].exploreAWI;

  return (
    <section id="explore-awi" className="py-24 lg:py-32 border-b border-border bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* Section header — centered */}
        <div className="flex flex-col items-center text-center mb-14 max-w-2xl mx-auto">
          <Reveal>
            <p
              className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: "#D4A017" }}
            >
              {T.eyebrow}
            </p>
            <h2
              className="font-display font-bold text-secondary leading-snug tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              {T.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Animated gold rule — Ucresco style */}
            <motion.div
              className="h-[2px] w-full max-w-[64px] mx-auto mt-6"
              style={{ backgroundColor: "#D4A017" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </Reveal>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {T.cards.map((card, i) => (
            <ExploreCard key={card.title} card={card} meta={CARD_META[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
