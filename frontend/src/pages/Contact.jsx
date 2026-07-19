import { Mail } from "lucide-react";
import ContactSection from "../components/home/ContactSection";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const CONTACTS = [
  { icon: "📧", labelKey: "generalEnquiries", email: "info@africaweb3institute.org" },
  { icon: "🤝", labelKey: "partnerships", email: "partnerships@africaweb3institute.org" },
  { icon: "📰", labelKey: "media", email: "media@africaweb3institute.org" },
];

export default function Contact() {
  const { language } = useLanguage();
  const T = t[language].about;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* CONTACT CTA */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
              {T.contactTag}
            </p>
            <h2 className="text-[1.75rem] font-bold text-secondary mb-3">{T.contactTitle}</h2>
            <p className="text-muted-foreground">{T.contactSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACTS.map((c) => (
              <div key={c.email} className="p-8 border border-border bg-white flex flex-col items-center text-center">
                <p className="text-[1.75rem] mb-4">{c.icon}</p>
                <p className="text-[0.875rem] font-bold text-secondary mb-2">{T[c.labelKey]}</p>
                <p className="text-[0.8125rem] text-muted-foreground mb-5 break-all">{c.email}</p>
                <a href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 transition-colors"
                  style={{ backgroundColor: "#0B1437", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D4A017"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0B1437"}
                >
                  <Mail className="w-3.5 h-3.5" /> {T.sendEmail}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
