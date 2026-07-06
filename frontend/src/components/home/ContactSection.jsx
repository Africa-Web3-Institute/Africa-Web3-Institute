import { useState } from "react";
import { base44 } from "../../api/base44Client";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import Reveal from "../common/Reveal";

export default function ContactSection() {
  const { language } = useLanguage();
  const T = t[language].contact;

  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });



//this needs to be ediited after backend is done, to handle the response properly and show success or error messages accordingly
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const response = await base44.functions.invoke("sendContactEmail", { ...form, honeypot });
    setLoading(false);
    if (response.data?.success) {
      setSubmitted(true);
    } else {
      setError(true);
    }
  };

  const inputClass =
    "w-full border border-border bg-white px-4 py-3 text-[0.875rem] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary";

  return (
    <section id="contact" className="py-28 lg:py-36 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left */}
          <Reveal as="div">
            <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>{T.eyebrow}</p>
            <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug mb-6">{T.heading}</h2>
            <p className="text-[1rem] text-muted-foreground leading-[1.85]">{T.body}</p>
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#D4A017" }}>
                {T.enquiriesLabel}
              </p>
              <a
                href="mailto:info@africaweb3institute.org"
                className="text-[1rem] font-medium text-secondary hover:text-primary transition-colors"
              >
                info@africaweb3institute.org
              </a>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal as="div" delay={0.1}>
            {submitted ? (
              <div className="border border-border p-10 flex flex-col items-start justify-center h-full">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-3">
                  {T.successEyebrow}
                </p>
                <p className="text-[1rem] font-semibold text-secondary leading-snug">{T.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-semibold tracking-wide uppercase text-muted-foreground mb-1.5">
                      {T.labels.name}
                    </label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder={T.placeholders.name} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-semibold tracking-wide uppercase text-muted-foreground mb-1.5">
                      {T.labels.email}
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder={T.placeholders.email} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.75rem] font-semibold tracking-wide uppercase text-muted-foreground mb-1.5">
                    {T.labels.organization}
                  </label>
                  <input name="organization" value={form.organization} onChange={handleChange} placeholder={T.placeholders.organization} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[0.75rem] font-semibold tracking-wide uppercase text-muted-foreground mb-1.5">
                    {T.labels.message}
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={T.placeholders.message} className={`${inputClass} resize-none`} />
                </div>
                {error && (
                  <p className="text-[0.875rem] text-destructive">
                    {T.errorMsg}{" "}
                    <a href="mailto:info@africaweb3institute.org" className="underline">
                      info@africaweb3institute.org
                    </a>.
                  </p>
                )}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-[0.875rem] font-semibold px-8 py-3.5 transition-all disabled:opacity-60"
                    style={{ backgroundColor: "#D4A017", color: "#0B1437" }}
                  >
                    {loading ? T.sending : T.submit}
                  </button>
                </div>
              </form>
            )}
          </Reveal>

        </div>
      </div>
    </section>
  );
}