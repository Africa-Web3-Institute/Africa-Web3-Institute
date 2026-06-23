import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage} from "../../lib/LanguageContext";

const COPY = {
  en: {
    title: "Join the Institute",
    sub: "Become part of Africa's leading Web3 policy community.",
    name: "Full Name", namePh: "Your full name",
    email: "Email", emailPh: "your@email.com",
    country: "Country", countryPh: "Your country",
    role: "Role",
    roles: ["Developer", "Policymaker", "Entrepreneur", "Researcher", "Other"],
    submit: "Submit Application",
    success: "Thank you for applying! We'll be in touch soon.",
    cancel: "Cancel",
  },
  fr: {
    title: "Rejoindre l'Institut",
    sub: "Rejoignez la principale communauté de politique Web3 africaine.",
    name: "Nom complet", namePh: "Votre nom complet",
    email: "E-mail", emailPh: "votre@email.com",
    country: "Pays", countryPh: "Votre pays",
    role: "Rôle",
    roles: ["Développeur", "Décideur politique", "Entrepreneur", "Chercheur", "Autre"],
    submit: "Soumettre ma candidature",
    success: "Merci pour votre candidature ! Nous vous contacterons bientôt.",
    cancel: "Annuler",
  },
};

export default function JoinModal({ onClose }) {
  const { language } = useLanguage();
  const C = COPY[language];
  const [form, setForm] = useState({ name: "", email: "", country: "", role: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
    if (!form.country.trim()) e.country = true;
    if (!form.role) e.role = true;
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const inputClass = (field) => `w-full text-[0.875rem] px-3 py-2.5 rounded-lg border outline-none transition-colors ${errors[field] ? "border-red-400" : "border-gray-200 focus:border-yellow-500"}`;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" role="button" tabIndex={0} style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); onClose(); } }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[1rem] font-semibold" style={{ color: "#111827" }}>{C.title}</h2>
            <p className="text-[0.75rem] mt-0.5" style={{ color: "#6B7280" }}>{C.sub}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FAEEDA" }}>
                <span className="text-xl">✓</span>
              </div>
              <p className="text-[0.9375rem] font-medium" style={{ color: "#111827" }}>{C.success}</p>
              <button onClick={onClose} className="mt-5 text-[0.8125rem] font-semibold px-5 py-2 rounded-lg" style={{ backgroundColor: "#D4A017", color: "#fff" }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[0.75rem] font-medium mb-1.5" style={{ color: "#374151" }}>{C.name}</label>
                <input className={inputClass("name")} placeholder={C.namePh} value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: false }); }} />
              </div>
              <div>
                <label className="block text-[0.75rem] font-medium mb-1.5" style={{ color: "#374151" }}>{C.email}</label>
                <input type="email" className={inputClass("email")} placeholder={C.emailPh} value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }); }} />
              </div>
              <div>
                <label className="block text-[0.75rem] font-medium mb-1.5" style={{ color: "#374151" }}>{C.country}</label>
                <input className={inputClass("country")} placeholder={C.countryPh} value={form.country}
                  onChange={e => { setForm({ ...form, country: e.target.value }); setErrors({ ...errors, country: false }); }} />
              </div>
              <div>
                <label className="block text-[0.75rem] font-medium mb-1.5" style={{ color: "#374151" }}>{C.role}</label>
                <select className={inputClass("role")} value={form.role}
                  onChange={e => { setForm({ ...form, role: e.target.value }); setErrors({ ...errors, role: false }); }}>
                  <option value="">— Select —</option>
                  {C.roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 text-[0.875rem] font-semibold py-2.5 rounded-lg transition-all"
                  style={{ backgroundColor: "#D4A017", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
                  {C.submit}
                </button>
                <button type="button" onClick={onClose} className="px-4 text-[0.875rem] rounded-lg border border-gray-200 transition-all"
                  style={{ color: "#374151" }}>
                  {C.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}