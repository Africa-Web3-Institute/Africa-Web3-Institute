import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Calendar, ArrowRight, Inbox, AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

export default function NewsletterArchive() {
  const { language } = useLanguage();
  const T = t[language]?.newsletterArchive || {};

  const [newsletters, setNewsletters] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    fetch("/api/newsletters")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        setNewsletters(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0B1437] py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/Awi_Website_pics.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-10 h-10 mx-auto mb-5 text-[#D4A017]" />
          <p className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
            {T.badge || "Weekly Newsletter"}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {T.title || "Newsletter Archive"}
          </h1>
          {T.subtitle && (
            <p className="text-white/70 mt-4 max-w-xl mx-auto leading-relaxed">
              {T.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ─── CONTENT ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {status === "loading" && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl p-6 animate-pulse"
              >
                <div className="h-3 w-24 bg-[#F8F9FB] rounded mb-4" />
                <div className="h-5 w-2/3 bg-[#F8F9FB] rounded mb-3" />
                <div className="h-4 w-full bg-[#F8F9FB] rounded mb-2" />
                <div className="h-4 w-4/5 bg-[#F8F9FB] rounded" />
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-16 border border-border rounded-2xl bg-[#F8F9FB]">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-[#D4A017]" />
            <p className="text-secondary font-semibold mb-1">
              {T.errorTitle || "Couldn't load the archive"}
            </p>
            <p className="text-sm text-muted-foreground">
              {T.errorMessage || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {status === "success" && newsletters.length === 0 && (
          <div className="text-center py-16 border border-border rounded-2xl bg-[#F8F9FB]">
            <Inbox className="w-8 h-8 mx-auto mb-3 text-[#D4A017]" />
            <p className="text-secondary font-semibold mb-1">
              {T.emptyTitle || "No issues yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {T.emptyMessage || "Check back soon for our first newsletter."}
            </p>
          </div>
        )}

        {status === "success" && newsletters.length > 0 && (
          <div className="space-y-5">
            {newsletters.map((item) => (
              <article
                key={item.id}
                className="group bg-white border border-border rounded-2xl p-6 hover:shadow-lg hover:border-[#D4A017]/40 transition-all duration-300"
              >
                {item.date && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                    {item.date}
                  </p>
                )}

                <h2 className="text-xl font-bold text-secondary mb-2">
                  <Link
                    to={item.link}
                    className="hover:text-[#D4A017] transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>

                {item.excerpt && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.excerpt}
                  </p>
                )}

                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A017] group-hover:gap-2.5 transition-all"
                >
                  {T.readMore || "Read More"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}