import { motion } from "framer-motion";
import { Scale, BookOpen, Lightbulb } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

const ICONS = [Scale, BookOpen, Lightbulb];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Programs() {
  const { language } = useLanguage();
  const T = t[language].programs;

  return (
    <section id="programs" className="relative overflow-hidden py-24 lg:py-36 border-b border-border">

      {/* ── Video / image background ─────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Ambient video — falls back to image poster */}
        <video
          className="video-bg animate-kb"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/slide-1.jpg"
          aria-hidden="true"
        >
          <source src="/videos/programs-ambient.mp4" type="video/mp4" />
        </video>
        {/* Fallback image (always rendered, video stacks on top when available) */}
        <img
          src="/images/hero/slide-1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,20,55,0.84)" }} />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,160,23,0.8) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <Reveal className="text-center mb-16 max-w-2xl mx-auto">
          <p
            className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-4"
            style={{ color: "#D4A017" }}
          >
            {T.eyebrow}
          </p>
          <h2
            className="font-display font-bold text-white leading-snug"
            style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)" }}
          >
            {T.heading}
          </h2>
          {/* Animated gold rule */}
          <motion.div
            className="w-12 h-[3px] mx-auto mt-6"
            style={{ backgroundColor: "#D4A017" }}
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </Reveal>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          {T.items.map((program, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={program.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px 0px" }}
                className="bg-white p-10 flex flex-col group relative overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {/* Hover shine sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(212,160,23,0.06) 50%, transparent 60%)",
                    x: "-100%",
                  }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  className="w-12 h-12 flex items-center justify-center mb-8 flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(212,160,23,0.1)",
                    border: "1px solid rgba(212,160,23,0.25)",
                  }}
                  whileHover={{ scale: 1.12, rotate: 6, backgroundColor: "rgba(212,160,23,0.18)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
                </motion.div>

                <h3 className="font-display text-[1.125rem] font-bold text-secondary mb-4 leading-snug">
                  {program.title}
                </h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.82] flex-1">
                  {program.description}
                </p>

                {/* Bottom gold accent line — animates in on hover */}
                <motion.div
                  className="mt-8 h-[2px]"
                  style={{ backgroundColor: "#D4A017", scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
