import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../lib/LanguageContext";

const COPY = {
  en: {
    heading: "Stay ahead of Africa's Web3 policy landscape",
    sub: "Weekly intelligence brief — free for all members.",
    placeholder: "Your email address",
    cta: "Subscribe",
    success: "You're in. Next brief lands in your inbox soon.",
    error: "Please enter a valid email address.",
  },
  fr: {
    heading: "Restez à la pointe du paysage politique Web3 africain",
    sub: "Briefing hebdomadaire — gratuit pour tous les membres.",
    placeholder: "Votre adresse e-mail",
    cta: "S'abonner",
    success: "C'est noté. Le prochain briefing arrive bientôt.",
    error: "Veuillez entrer une adresse e-mail valide.",
  },
};

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function NewsletterStrip() {
  const { language } = useLanguage();
  const C = COPY[language];
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError(true); return; }
    setError(false);
    setDone(true);
  };

  return (
    <motion.div
      className="border-b border-white/10"
      style={{ backgroundColor: "#0B1437" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex items-center justify-between gap-8 flex-wrap">

        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[0.9375rem] font-semibold text-white leading-snug">{C.heading}</p>
          <p className="text-[0.75rem] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{C.sub}</p>
        </motion.div>

        {/* Right: form or success */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.p
                key="success"
                className="text-[0.875rem] font-semibold"
                style={{ color: "#D4A017" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                ✓ {C.success}
              </motion.p>
            ) : (
              <motion.div
                key="form"
                className="flex flex-col gap-1.5 items-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <motion.div
                    className="relative"
                    animate={{ scale: focused ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(false); }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder={C.placeholder}
                      className="text-[0.8125rem] px-4 py-2.5 outline-none w-52 lg:w-68 text-white placeholder:text-white/35"
                      style={{
                        border: `1px solid ${error ? "#EF4444" : focused ? "rgba(212,160,23,0.7)" : "rgba(255,255,255,0.18)"}`,
                        backgroundColor: "rgba(255,255,255,0.07)",
                        transition: "border-color 0.25s",
                      }}
                    />
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="text-[0.8125rem] font-semibold px-5 py-2.5 flex-shrink-0"
                    style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                    whileHover={{ scale: 1.04, backgroundColor: "#b8891a" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  >
                    {C.cta}
                  </motion.button>
                </form>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-[0.72rem]"
                      style={{ color: "#FCA5A5" }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {C.error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
