import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

export default function Publications() {
  const [active, setActive] = useState(null);
  const { language } = useLanguage();
  const T = t[language].publications;

  return (
    <section id="publications" className="py-24 lg:py-36 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* ── Left sticky label + featured card ─────────── */}
          <Reveal as="div" className="lg:sticky lg:top-24">
            <p
              className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#D4A017" }}
            >
              {T.eyebrow}
            </p>
            <h2
              className="font-display font-bold text-secondary leading-snug mb-8"
              style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)" }}
            >
              {T.heading}
            </h2>

            {/* Featured AWPII card */}
            <motion.div
              className="p-7 mt-4 relative overflow-hidden"
              style={{
                border: "1px solid rgba(212,160,23,0.45)",
                backgroundColor: "rgba(212,160,23,0.04)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ borderColor: "#D4A017" }}
            >
              {/* Shimmer sweep on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(212,160,23,0.07) 50%, transparent 60%)",
                  x: "-100%",
                }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.65 }}
              />

              <p
                className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-3"
                style={{ color: "#D4A017" }}
              >
                Featured Report
              </p>
              <h3 className="font-display text-[1rem] font-bold text-secondary mb-3 leading-snug">
                Africa Web3 Policy &amp; Innovation Index
              </h3>
              <p className="text-[0.8125rem] text-muted-foreground leading-snug mb-5">
                A quarterly definitive benchmark for regulatory clarity across 54 African nations. 2026 Index coming in January, 2027.
              </p>
              <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 360, damping: 22 }}>
                <Link
                  to="/awpii"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2.5 px-5 transition-colors"
                  style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                >
                  <Download className="w-3.5 h-3.5" /> View AWPII
                </Link>
              </motion.div>
            </motion.div>
          </Reveal>

          {/* ── Right: publication list ─────────────────────── */}
          <div className="divide-y divide-border">
            {T.items.map((pub, i) => (
              <Reveal as="div" key={pub.title} delay={Math.min(i, 5) * 0.06}>
                {pub.isDashboard ? (
                  <div className="py-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[0.6875rem] font-bold tracking-wider uppercase px-2.5 py-1"
                        style={{ color: "#D4A017", border: "1px solid rgba(212,160,23,0.4)" }}
                      >
                        {pub.tag}
                      </span>
                      <span className="text-[0.75rem] text-muted-foreground">{pub.year}</span>
                    </div>
                    <h3 className="font-display text-[1.0625rem] font-bold text-secondary leading-snug mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-[0.875rem] text-muted-foreground leading-[1.75] mb-5">
                      {pub.description}
                    </p>
                    <Link
                      to={pub.dashboardUrl}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2.5 px-5"
                      style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> {pub.dashboardCta}
                    </Link>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActive(active === pub.title ? null : pub.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive(active === pub.title ? null : pub.title);
                        }
                      }}
                      aria-expanded={active === pub.title}
                      className="py-8 flex items-start justify-between gap-6 group cursor-pointer"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-[0.6875rem] font-bold tracking-wider uppercase px-2.5 py-1"
                            style={{ color: "#D4A017", border: "1px solid rgba(212,160,23,0.4)" }}
                          >
                            {pub.tag}
                          </span>
                          <span className="text-[0.75rem] text-muted-foreground">{pub.year}</span>
                        </div>
                        <h3 className="font-display text-[1.0625rem] font-bold text-secondary group-hover:text-primary transition-colors leading-snug">
                          {pub.title}
                        </h3>
                        <p className="mt-2 text-[0.875rem] text-muted-foreground leading-[1.75]">
                          {pub.description}
                        </p>
                        {pub.downloadLabel && (
                          <a
                            href={pub.downloadUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold py-2 px-4"
                            style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                          >
                            <Download className="w-3.5 h-3.5" /> {pub.downloadLabel}
                          </a>
                        )}
                      </div>

                      <motion.div
                        animate={{ rotate: active === pub.title ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight
                          className="w-4 h-4 mt-1 shrink-0"
                          style={{ color: "rgba(212,160,23,0.55)" }}
                        />
                      </motion.div>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {active === pub.title && (
                        <motion.div
                          key="expand"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            className="pb-8 text-[0.8125rem] font-medium text-muted-foreground border-l-2 pl-4"
                            style={{ borderColor: "#D4A017" }}
                          >
                            {T.comingSoon}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
