import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function FinalCTA() {
  const { language } = useLanguage();
  const T = t[language].finalCTA;
  const navigate = useNavigate();

  return (
    <section className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: "#0B1437" }}>
      {/* Background photo */}
      <img
        src="/images/moments/workshop-group.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-kb"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, #0B1437 5%, rgba(11,20,55,0.88) 55%, rgba(11,20,55,0.82) 100%)" }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-[1]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #D4A017 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Ucresco-style warm glow, bottom-left */}
      <motion.div
        className="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(212,160,23,0.16) 0%, transparent 70%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Floating gold orb, top-right */}
      <motion.div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(212,160,23,0.09) 0%, transparent 70%)" }}
        animate={{ y: [0, -24, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px 0px" }}
      >
        <motion.h2
          variants={item}
          className="font-display font-bold text-white leading-snug tracking-tight mb-10"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
        >
          {T.heading}
        </motion.h2>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center justify-center gap-2 text-[0.9rem] font-semibold px-8 py-4 rounded-full"
            style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
            whileHover={{ scale: 1.04, backgroundColor: "#b8891a" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            {T.cta1} <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/intelligence")}
            className="inline-flex items-center justify-center gap-2 text-[0.9rem] font-semibold px-8 py-4 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.26)", color: "rgba(255,255,255,0.9)" }}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            {T.cta2}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
