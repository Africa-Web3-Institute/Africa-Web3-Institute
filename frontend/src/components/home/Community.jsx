import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import JoinModal from "../../components/home/JoinModal";
import Reveal from "../common/Reveal";

export default function Community() {
  const { language } = useLanguage();
  const T = t[language].community;
  const [showJoin, setShowJoin] = useState(false);
  const bannerRef = useRef(null);
  const inView    = useInView(bannerRef, { once: true, margin: "-80px 0px" });

  const handleCta = (idx) => {
    if (idx === 0) setShowJoin(true);
    else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="community" className="border-b border-border overflow-hidden">

      {/* ── Full-bleed video / image banner ─────────────────── */}
      <div
        ref={bannerRef}
        className="relative overflow-hidden"
        style={{ height: "54vh", minHeight: 380, maxHeight: 540 }}
      >
        {/* Ambient video */}
        <video
          className="video-bg"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/slide-2.jpg"
          aria-hidden="true"
        >
          <source src="/videos/community-ambient.mp4" type="video/mp4" />
        </video>

        {/* Image (always present as base layer) */}
        <motion.img
          src="/images/hero/slide-2.jpg"
          alt={language === "fr" ? "Communauté Africa Web3" : "Africa Web3 Community"}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.07 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,20,55,0.92) 0%, rgba(11,20,55,0.42) 55%, rgba(11,20,55,0.15) 100%)",
          }}
        />

        {/* Gold top accent */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: "#D4A017", scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Centered heading over image */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
          <motion.p
            className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: "#D4A017" }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.45 }}
          >
            {T.eyebrow}
          </motion.p>
          <motion.h2
            className="font-display font-bold text-white leading-snug max-w-2xl mx-auto"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.875rem)" }}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {T.heading}
          </motion.h2>
        </div>
      </div>

      {/* ── Pathway cards ────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {T.paths.map((path, i) => (
              <Reveal
                key={path.label}
                delay={i * 0.1}
                className="p-10 lg:p-12 flex flex-col group"
              >
                <motion.div
                  className="flex flex-col h-full"
                  whileHover={{ backgroundColor: "#FAFAF8" }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Number + label */}
                  <span
                    className="text-[0.6875rem] font-bold tracking-[0.22em] uppercase mb-6 block"
                    style={{ color: "#D4A017" }}
                  >
                    {String(i + 1).padStart(2, "0")} — {path.label}
                  </span>

                  <h3
                    className="font-display text-[1.125rem] font-bold mb-4 leading-snug"
                    style={{ color: "#0B1437" }}
                  >
                    {path.title}
                  </h3>

                  <p
                    className="text-[0.875rem] leading-[1.82] flex-1"
                    style={{ color: "#6B7280" }}
                  >
                    {path.description}
                  </p>

                  <motion.button
                    className="mt-8 self-start inline-flex items-center gap-2 text-[0.8125rem] font-semibold"
                    style={{ color: "#D4A017" }}
                    onClick={() => handleCta(i)}
                    whileHover={{ x: 4, opacity: 0.8 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    {path.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}
    </section>
  );
}
