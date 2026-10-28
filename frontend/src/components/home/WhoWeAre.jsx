import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Globe, Users, FileSearch, Zap } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

const PILLAR_STYLES = [
  { Icon: Globe,       bg: "rgba(212,160,23,0.12)", color: "#D4A017" },
  { Icon: FileSearch,  bg: "rgba(212,160,23,0.12)", color: "#D4A017" },
  { Icon: Users,       bg: "rgba(212,160,23,0.12)", color: "#D4A017" },
  { Icon: Zap,         bg: "rgba(212,160,23,0.12)", color: "#D4A017" },
];

export default function WhoWeAre() {
  const { language } = useLanguage();
  const T  = t[language].whoWeAre;
  const Tw = t[language].whatWeDo;

  const imgRef  = useRef(null);
  const imgView = useInView(imgRef, { once: true, margin: "-80px 0px" });

  return (
    <section id="who-we-are" className="border-b border-border bg-white overflow-hidden">

      {/* ── Split: image + text ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">

        {/* Image panel */}
        <div ref={imgRef} className="relative overflow-hidden order-2 lg:order-1 min-h-[360px] lg:min-h-0">
          <motion.img
            src="/images/hero/slide-3.jpg"
            alt="Africa Web3 Institute — community"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={imgView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Mobile gradient */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{ background: "linear-gradient(to top, rgba(11,20,55,0.65) 0%, transparent 60%)" }}
          />
          {/* Gold left stripe */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1"
            style={{ backgroundColor: "#D4A017" }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={imgView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Overlay badge */}
          <motion.div
            className="absolute bottom-8 left-6 glass px-4 py-3 hidden lg:block"
            initial={{ opacity: 0, y: 20 }}
            animate={imgView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-white/60 mb-0.5">Est.</p>
            <p className="text-[1rem] font-bold text-white">Africa Web3 Institute</p>
          </motion.div>
        </div>

        {/* Text panel */}
        <div className="order-1 lg:order-2 flex flex-col justify-center px-8 lg:px-14 py-16 lg:py-20">
          <Reveal delay={0}>
            <p className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className="font-display font-bold leading-snug mb-6"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.625rem)", color: "#0B1437" }}
            >
              {T.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-[1rem] leading-[1.85] mb-4" style={{ color: "#4B5563" }}>{T.p1}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="text-[1rem] leading-[1.85] mb-8" style={{ color: "#4B5563" }}>{T.p2}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-wrap gap-2.5 mb-9">
              {T.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-[0.75rem] font-semibold px-3.5 py-1.5 tracking-wide"
                  style={{ backgroundColor: "rgba(11,20,55,0.06)", color: "#0B1437" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.28 + i * 0.06, duration: 0.4 }}
                  whileHover={{ backgroundColor: "rgba(212,160,23,0.12)", color: "#8a6500" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 350, damping: 20 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 self-start text-[0.875rem] font-semibold px-6 py-3 transition-colors"
                style={{ backgroundColor: "#0B1437", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D4A017")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B1437")}
              >
                {T.buttonCTA} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* ── What We Do pillars ─────────────────────────────── */}
      <div className="border-t border-border" style={{ backgroundColor: "#F8F8F6" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <Reveal className="mb-9">
            <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#9CA3AF" }}>
              {Tw.eyebrow}
            </p>
            <h3 className="text-[1.125rem] font-semibold" style={{ color: "#111827" }}>
              {Tw.heading}
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Tw.pillars.map((pillar, i) => {
              const { Icon, bg, color } = PILLAR_STYLES[i] || PILLAR_STYLES[0];
              return (
                <Reveal key={pillar.title} delay={i * 0.08}>
                  <motion.div
                    className="bg-white border border-border p-6 flex flex-col gap-3 h-full card-hover cursor-default"
                    whileHover={{ borderColor: "#D4A017" }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: bg }}
                      whileHover={{ scale: 1.12, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </motion.div>
                    <p className="text-[0.875rem] font-semibold" style={{ color: "#111827" }}>{pillar.title}</p>
                    <p className="text-[0.8125rem] leading-[1.72]" style={{ color: "#6B7280" }}>{pillar.description}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
