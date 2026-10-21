// src/pages/Contact.js
import { Mail, Copy, Check, Send } from "lucide-react";
import { useState } from "react";
import ContactSection from "../components/home/ContactSection";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const CONTACTS = [
  {
    icon: "📧",
    labelKey: "generalEnquiries",
    email: "info@africaweb3institute.org",
    description: "General questions about our work and initiatives.",
  },
  {
    icon: "🤝",
    labelKey: "partnerships",
    email: "partnerships@africaweb3institute.org",
    description: "Collaborate with us on research, events, or projects.",
  },
  {
    icon: "📰",
    labelKey: "media",
    email: "media@africaweb3institute.org",
    description: "Press inquiries, interviews, and media kits.",
  },
];

function ContactCard({ c, T }) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-border/60 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-[#D4A017]/30 hover:-translate-y-1">
      <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-3xl mb-5 group-hover:bg-[#D4A017]/20 transition-colors">
        {c.icon}
      </div>
      <p className="text-[1rem] font-bold text-secondary mb-1.5">{T[c.labelKey]}</p>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{c.description}</p>
      <p className="text-[0.875rem] font-medium text-secondary bg-[#F8F9FB] px-4 py-2 rounded-full border border-border/40 mb-5 break-all">
        {c.email}
      </p>

      <div className="flex items-center gap-3">
        <a
          href={`mailto:${c.email}`}
          className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-full transition-all bg-[#0B1437] text-white hover:bg-[#D4A017] shadow-sm hover:shadow-md"
        >
          <Mail className="w-3.5 h-3.5" />
          {c.sendEmail || "Email"}
        </a>

        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 bg-white text-secondary hover:border-[#D4A017] hover:bg-[#D4A017]/5 transition-all group"
            aria-label="Copy email address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground group-hover:text-[#D4A017]" />
            )}
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-[0.65rem] font-medium whitespace-nowrap rounded-md shadow-lg pointer-events-none bg-[#0B1437] text-white"
            >
              {copied ? "Copied!" : "Copy email address"}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#0B1437]" />
            </div>
          )}
        </div>
      </div>

      {copied && (
        <p className="text-[0.65rem] mt-3 text-green-600 font-medium animate-pulse">
          ✓ Copied to clipboard
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <div className="min-h-screen bg-white" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>

      <section className="py-20 border-b border-border bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="inline-block text-xs font-semibold tracking-[0.22em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
              {T.contactTag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{T.contactTitle}</h2>
            <p className="text-muted-foreground text-[0.9375rem] max-w-2xl mx-auto">
              {T.contactSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTACTS.map((c) => (
              <ContactCard key={c.email} c={c} T={T} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}