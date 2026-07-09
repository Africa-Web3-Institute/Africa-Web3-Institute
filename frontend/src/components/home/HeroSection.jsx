import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

const slides = [
  "/images/hero/slide-1.jpg",
  "/images/hero/slide-1.jpg.png",
  "/images/hero/slide-2.jpg",
];

const INTERVAL_MS = 7000;

const STATS_EN = [
  { value: "18+", label: "Countries" },
  { value: "10+", label: "Policy Reports" },
  { value: "3,000+", label: "Members" },
];
const STATS_FR = [
  { value: "18+", label: "Pays" },
  { value: "10+", label: "Rapports" },
  { value: "3 000+", label: "Membres" },
];

/* ─── stagger container ──────────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};
const statItem = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: 0.7 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  const { language } = useLanguage();
  const T = t[language].hero;
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const stats = language === "fr" ? STATS_FR : STATS_EN;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const scrollDown = () => {
    document.getElementById("explore-awi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col"
      style={{ backgroundColor: "#0B1437" }}
    >
        {/* ── Video ambient background layer ─────────────────── */}
        <div className="absolute inset-0 z-0">
          {/* Ambient looping video — muted, autoplay, no controls */}
          <video
            className="video-bg animate-kb"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero/slide-1.jpg"
            aria-hidden="true"
          >
            {/* 
              Drop an actual .mp4 into /public/videos/hero-ambient.mp4 to activate.
              Falls back gracefully to the poster image until then.
            */}
            <source src="/videos/hero-ambient.mp4" type="video/mp4" />
          </video>

          {/* Slide images crossfade over / fallback when video absent */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            >
              <img
                src={slides[current]}
                alt=""
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.06)", transition: "transform 10s ease-out" }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Multi-layer gradient overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(11,20,55,0.96) 0%, rgba(11,20,55,0.93) 47.5%, rgba(11,20,55,0.6) 57.5%, rgba(11,20,55,0.15) 71.25%, rgba(11,20,55,0.08) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(11,20,55,0.9) 0%, transparent 55%)",
            }}
          />
          {/* Noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
        </div>

        {/* ── Gold top accent line ───────────────────────────── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] z-20"
          style={{ background: "linear-gradient(90deg, #D4A017, rgba(212,160,23,0.4), transparent)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── Decorative floating orbs ──────────────────────── */}
        <motion.div
          className="absolute top-24 right-12 w-64 h-64 rounded-full pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)" }}
          animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-48 h-48 rounded-full pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)" }}
          animate={{ y: [0, 18, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* ── Main content ──────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex items-start">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full pt-44 lg:pt-48 pb-16 lg:pb-20">
            <motion.div
              className="max-w-3xl"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* Established badge */}
              <motion.div variants={item} className="inline-flex items-center gap-2.5 mb-8">
                <span
                  className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase px-3.5 py-1.5"
                  style={{
                    backgroundColor: "rgba(212,160,23,0.14)",
                    color: "#D4A017",
                    border: "1px solid rgba(212,160,23,0.4)",
                  }}
                >
                  {T.established}
                </span>
                <span className="text-[0.75rem] font-medium" style={{ color: "rgba(255,255,255,0.48)" }}>
                  {T.subheading}
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={item}
                className="font-bold text-white leading-[1.2] tracking-tight mb-6"
                style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
              >
                {T.h1}
              </motion.h1>

              {/* Animated gold separator */}
              <motion.div
                variants={item}
                className="w-14 h-[3px] mb-7"
                style={{ backgroundColor: "#D4A017" }}
              />

              {/* Intro paragraph */}
              <motion.p
                variants={item}
                className="text-[1.0625rem] leading-[1.82] mb-11 max-w-[520px]"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                {T.intro}
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={item} className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate("/intelligence")}
                  className="inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold px-8 py-3.5"
                  style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                  whileHover={{ scale: 1.03, backgroundColor: "#b8891a" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  {T.cta1} <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 text-[0.9375rem] font-medium px-8 py-3.5"
                  style={{ border: "1px solid rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.88)" }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.09)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  {T.cta2}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Stats bar ─────────────────────────────────────── */}
        <div
          className="relative z-10 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            backgroundColor: "rgba(11,20,55,0.72)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-white/10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="px-6 py-5 text-center group cursor-default"
                  custom={i}
                  variants={statItem}
                  initial="hidden"
                  animate="show"
                >
                  <p
                    className="text-[1.75rem] font-bold leading-none mb-1"
                    style={{ color: "#D4A017" }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase"
                    style={{ color: "rgba(255,255,255,0.48)" }}
                  >
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide indicators ──────────────────────────────── */}
        <div className="absolute bottom-[6.5rem] right-7 z-10 flex flex-col gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full origin-top"
              style={{ width: 3, backgroundColor: i === current ? "#D4A017" : "rgba(255,255,255,0.3)" }}
              animate={{ height: i === current ? 28 : 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Scroll cue ────────────────────────────────────── */}
        <motion.button
          onClick={scrollDown}
          className="absolute bottom-[5.75rem] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          aria-label="Scroll down"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>
    </section>
  );
}
