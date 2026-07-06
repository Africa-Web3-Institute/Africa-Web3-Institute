import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function WhyAfrica() {
  const { language } = useLanguage();
  const T = t[language].whyAfrica;
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      className="py-24 lg:py-36 border-b border-border relative overflow-hidden"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #0B1437 1px, transparent 0)", backgroundSize: "28px 28px" }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Image — left, with floating promise card */}
          <motion.div
            className="relative pb-12 pr-8 lg:pr-12 order-2 lg:order-1"
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Outer "mat" frame — creates the nested double-border look */}
            <div
              className="relative w-full aspect-[4/3] rounded-[32px] p-4"
              style={{ backgroundColor: "#fff", border: "1px solid rgba(11,20,55,0.08)", boxShadow: "0 8px 28px rgba(11,20,55,0.08)" }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-[20px]">
                <motion.img
                  src="/images/hero/slide-3.jpg"
                  alt="Africa Web3 Institute"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.12 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(11,20,55,0.32) 0%, transparent 50%)" }}
                />
              </div>
            </div>

            {/* Floating "promise" card — animates in after the image settles */}
            <motion.div
              className="absolute bottom-0 right-0 max-w-[16rem] rounded-2xl bg-white px-6 py-5"
              style={{ boxShadow: "0 20px 44px rgba(11,20,55,0.18)" }}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "#D4A017" }}>
                {T.promiseLabel}
              </p>
              <p className="text-[0.875rem] font-semibold leading-snug" style={{ color: "#0B1437" }}>
                {T.promiseText}
              </p>
            </motion.div>

            {/* Decorative gold corner accent */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl pointer-events-none hidden lg:block"
              style={{ border: "2px solid rgba(212,160,23,0.4)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* Text — right */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-6" style={{ color: "#D4A017" }}>
              {T.eyebrow}
            </p>
            <blockquote className="mb-7">
              <p className="font-display text-[1.875rem] lg:text-[2.375rem] font-bold text-secondary leading-[1.3] tracking-tight">
                {T.quote}
              </p>
            </blockquote>
            <motion.div
              className="h-px mb-7"
              style={{ backgroundColor: "#D4A017" }}
              initial={{ width: 0 }}
              animate={inView ? { width: 48 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <p className="text-[1rem] text-muted-foreground leading-[1.85] mb-8">
              {T.body}
            </p>

            <motion.button
              onClick={() => navigate("/about")}
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold"
              style={{ color: "#D4A017" }}
              whileHover={{ gap: "10px" }}
              transition={{ duration: 0.2 }}
            >
              {T.learnMore}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
