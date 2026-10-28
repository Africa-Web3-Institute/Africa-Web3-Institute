import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

export default function NewsletterLanding() {
  const { language } = useLanguage();
  const T = t[language].newsletterLanding;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: T.successMessage || "You're in! Check your inbox." });
        setEmail("");
      } else {
        setStatus({ type: "error", message: data.message || T.errorMessage });
      }
    } catch {
      setStatus({ type: "error", message: T.errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ─── Hero with background image ──────────────────────────────────── */}
      <section
        className="relative flex-1 flex items-center justify-center px-6 py-16 md:py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/newsletter_hero.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for readability */}
<div
  className="absolute inset-0"
  style={{
    background: `
      radial-gradient(
        circle at center,
        rgba(11, 20, 55, 0.4) 0%,
        rgba(11, 20, 55, 0.8) 100%
      )
    `,
  }}
/>
        {/* Content – stays on top of the overlay */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
              style={{
                border: "1px solid rgba(212,160,23,0.5)",
                color: "#D4A017",
                backgroundColor: "rgba(212,160,23,0.15)",
              }}
            >
              {T.badge || "Weekly Newsletter"}
            </span>
          </div>

          {/* Headline – now white */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            {T.headline || "Web3 Intelligence, Straight from Africa"}
          </h1>

          {/* Subhead – light gray/white */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {T.description ||
              "Dive into emerging markets, blockchain innovations, and the future of finance – curated for African founders, developers, and investors."}
          </p>

          {/* Email form – keep inputs light */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={T.emailPlaceholder || "Your email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#111827" }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-colors whitespace-nowrap"
                style={{ backgroundColor: "#D4A017" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b8890e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D4A017")}
              >
                {isSubmitting ? T.subscribing || "Subscribing…" : T.cta || "Get Started →"}
              </button>
            </div>
            {status.message && (
              <p
                className={`mt-3 text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}
              >
                {status.message}
              </p>
            )}
          </form>

          {/* Social proof – light gray */}
          <p className="text-sm text-white/70">
            {T.socialProof || "Join 5,000+ African innovators discovering new markets every week."}
          </p>

          {/* Archive link – gold */}
          <div className="mt-8">
            <Link
              to="/newsletters/archive"
              className="text-sm font-medium transition-colors"
              style={{ color: "#D4A017" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E8C266")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D4A017")}
            >
              {T.archiveLink || "Browse the archive →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Feature section remains unchanged ──────────────────────────── */}
      <section className="border-t border-gray-100 py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
              {T.feature1Title || "Market Intel"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {T.feature1Desc || "5‑minute reads on AI, DeFi, and Web3 trends across the continent."}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
              {T.feature2Title || "Founder Stories"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {T.feature2Desc || "Interviews with builders shaping Africa's digital economy."}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
              {T.feature3Title || "Opportunities"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {T.feature3Desc || "Grants, jobs, and events curated for the community."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}