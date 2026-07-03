import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, X, Save, ChevronDown, Calendar, ShieldAlert, ExternalLink } from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOCK_ENFORCEMENT = [
  { id: 1,  country: "Nigeria",      flag: "🇳🇬", date: "March 2026",    title: "CBN Issues Updated VASP Guidelines",                    description: "Central Bank of Nigeria updates virtual asset service provider compliance requirements, including enhanced KYC/AML provisions.", severity: "Positive",    category: "Regulatory Update",  regulator: "CBN",            sourceUrl: "" },
  { id: 2,  country: "Nigeria",      flag: "🇳🇬", date: "November 2025", title: "SEC Approves First Digital Asset Exchange",              description: "Nigeria's SEC grants its first full operating license to a digital asset exchange under the Investment & Securities Act 2025.", severity: "Positive",    category: "License Granted",    regulator: "SEC Nigeria",    sourceUrl: "" },
  { id: 3,  country: "Nigeria",      flag: "🇳🇬", date: "February 2024", title: "Binance Exits Nigerian Market",                          description: "Binance suspends Nigerian naira operations and trading pairs following a regulatory standoff with CBN and EFCC investigation.", severity: "Restrictive", category: "Exchange Action",    regulator: "CBN / EFCC",     sourceUrl: "" },
  { id: 4,  country: "South Africa", flag: "🇿🇦", date: "February 2026", title: "FSCA Issues VASP Compliance Update",                    description: "Updated compliance requirements for registered virtual asset providers including new AML reporting thresholds.", severity: "Positive",    category: "Regulatory Update",  regulator: "FSCA",           sourceUrl: "" },
  { id: 5,  country: "South Africa", flag: "🇿🇦", date: "June 2023",     title: "First VASP Licenses Issued",                            description: "FSCA begins issuing operating licenses to crypto service providers under the FAIS Act crypto asset classification.", severity: "Positive",    category: "License Granted",    regulator: "FSCA",           sourceUrl: "" },
  { id: 6,  country: "Kenya",        flag: "🇰🇪", date: "April 2026",    title: "CMA Publishes Draft Crypto Regulations",                 description: "Capital Markets Authority releases draft regulatory framework for virtual asset service providers for public comment.", severity: "Neutral",     category: "Consultation",       regulator: "CMA Kenya",      sourceUrl: "" },
  { id: 7,  country: "Egypt",        flag: "🇪🇬", date: "December 2025", title: "CBE Reaffirms Crypto Ban",                               description: "Central Bank of Egypt issues formal statement reaffirming prohibition on cryptocurrency trading and payments.", severity: "Restrictive", category: "Ban / Prohibition",  regulator: "CBE",            sourceUrl: "" },
  { id: 8,  country: "Algeria",      flag: "🇩🇿", date: "June 2025",     title: "Algeria Reaffirms Crypto Prohibition",                  description: "Ministry of Finance reaffirms the 2018 finance law prohibition on cryptocurrency transactions and digital assets.", severity: "Restrictive", category: "Ban / Prohibition",  regulator: "MoF Algeria",    sourceUrl: "" },
  { id: 9,  country: "Rwanda",       flag: "🇷🇼", date: "January 2026",  title: "Rwanda Issues Comprehensive Crypto Regulations",         description: "National Bank of Rwanda publishes full virtual asset regulatory framework with clear licensing pathways.", severity: "Positive",    category: "Framework Published",regulator: "NBR",            sourceUrl: "" },
  { id: 10, country: "Ghana",        flag: "🇬🇭", date: "January 2026",  title: "SEC Ghana Issues Crypto Advisory",                      description: "Securities and Exchange Commission issues investor advisory on crypto asset risks and unregistered operators.", severity: "Neutral",     category: "Advisory",           regulator: "SEC Ghana",      sourceUrl: "" },
  { id: 11, country: "Morocco",      flag: "🇲🇦", date: "January 2026",  title: "Government Announces Crypto Regulation Study",           description: "Moroccan government formally announces study into developing a comprehensive crypto regulatory framework.", severity: "Positive",    category: "Regulatory Update",  regulator: "Bank Al-Maghrib",sourceUrl: "" },
  { id: 12, country: "Tanzania",     flag: "🇹🇿", date: "October 2025",  title: "Bank of Tanzania Opens Crypto Consultation",             description: "Central bank invites public comments on proposed framework for virtual asset regulation and VASP licensing.", severity: "Positive",    category: "Consultation",       regulator: "BOT",            sourceUrl: "" },
  { id: 13, country: "Ethiopia",     flag: "🇪🇹", date: "November 2025", title: "Land Registry Blockchain Pilot Expands",                 description: "Ethiopian government expands blockchain land registry pilot to 3 additional regions following successful initial rollout.", severity: "Positive",    category: "Blockchain Policy",  regulator: "Ministry of Land",sourceUrl: "" },
  { id: 14, country: "Zambia",       flag: "🇿🇲", date: "September 2025","title": "SEC Zambia Opens Crypto Consultation",                 description: "Securities regulator opens public consultation on virtual asset regulation and licensing requirements.", severity: "Positive",    category: "Consultation",       regulator: "SEC Zambia",     sourceUrl: "" },
];

const SEVERITY_CONFIG = {
  Positive:    { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.3)"  },
  Neutral:     { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)" },
  Restrictive: { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" },
};

const CATEGORIES = [
  "All Categories",
  "Regulatory Update",
  "License Granted",
  "Exchange Action",
  "Ban / Prohibition",
  "Consultation",
  "Advisory",
  "Framework Published",
  "Blockchain Policy",
  "Tax / AML",
  "Investigation",
  "Other",
];

const SEVERITIES = ["All", "Positive", "Neutral", "Restrictive"];

const AFRICAN_COUNTRIES = [
  { name: "Nigeria", flag: "🇳🇬" }, { name: "South Africa", flag: "🇿🇦" }, { name: "Kenya", flag: "🇰🇪" },
  { name: "Ghana", flag: "🇬🇭" }, { name: "Rwanda", flag: "🇷🇼" }, { name: "Egypt", flag: "🇪🇬" },
  { name: "Ethiopia", flag: "🇪🇹" }, { name: "Tanzania", flag: "🇹🇿" }, { name: "Uganda", flag: "🇺🇬" },
  { name: "Senegal", flag: "🇸🇳" }, { name: "Morocco", flag: "🇲🇦" }, { name: "Cameroon", flag: "🇨🇲" },
  { name: "Côte d'Ivoire", flag: "🇨🇮" }, { name: "Zimbabwe", flag: "🇿🇼" }, { name: "Zambia", flag: "🇿🇲" },
  { name: "Algeria", flag: "🇩🇿" }, { name: "Tunisia", flag: "🇹🇳" }, { name: "Botswana", flag: "🇧🇼" },
  { name: "Mauritius", flag: "🇲🇺" }, { name: "Seychelles", flag: "🇸🇨" }, { name: "Namibia", flag: "🇳🇦" },
];

function SeverityPill({ severity }) {
  const s = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Neutral;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {severity}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function EntryModal({ entry, onClose, onSave }) {
  const isEdit = !!entry?.id;
  const [form, setForm] = useState({
    country:     entry?.country     || "",
    flag:        entry?.flag        || "🌍",
    date:        entry?.date        || "",
    title:       entry?.title       || "",
    description: entry?.description || "",
    severity:    entry?.severity    || "Neutral",
    category:    entry?.category    || "Regulatory Update",
    regulator:   entry?.regulator   || "",
    sourceUrl:   entry?.sourceUrl   || "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCountryChange = (name) => {
    const found = AFRICAN_COUNTRIES.find(c => c.name === name);
    set("country", name);
    if (found) set("flag", found.flag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1f2937" }}>
          <h2 className="text-white font-semibold">{isEdit ? "Edit Enforcement Event" : "Add Enforcement Event"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Country + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Country *</label>
              <select value={form.country} onChange={e => handleCountryChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                <option value="">Select country…</option>
                {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</label>
              <input value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. March 2026"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Event Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Short descriptive title"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              placeholder="Detailed description of the enforcement action or regulatory event…"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600 resize-none" />
          </div>

          {/* Severity + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Severity</label>
              <div className="flex gap-2">
                {SEVERITIES.slice(1).map(s => {
                  const cfg = SEVERITY_CONFIG[s];
                  return (
                    <button key={s} type="button" onClick={() => set("severity", s)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                      style={form.severity === s
                        ? { background: cfg.bg, color: cfg.color, borderColor: cfg.border }
                        : { background: "transparent", color: "#6b7280", borderColor: "#374151" }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Regulator + Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Regulator</label>
              <input value={form.regulator} onChange={e => set("regulator", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Source URL</label>
              <input value={form.sourceUrl} onChange={e => set("sourceUrl", e.target.value)} placeholder="https://…"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-gray-700">Cancel</button>
            <button onClick={() => onSave({ ...entry, ...form, id: entry?.id || Date.now() })}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
              <Save size={14} /> {isEdit ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ entry, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-400" /></div>
        <h3 className="text-white font-semibold text-center mb-2">Delete Event</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          Delete <span className="text-white font-medium">"{entry.title}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 border border-gray-700">Cancel</button>
          <button onClick={() => onConfirm(entry.id)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function AdminEnforcement() {
  const [data, setData] = useState(MOCK_ENFORCEMENT);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => data.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.country.toLowerCase().includes(q) || e.regulator.toLowerCase().includes(q);
    const matchSeverity = severityFilter === "All" || e.severity === severityFilter;
    const matchCategory = categoryFilter === "All Categories" || e.category === categoryFilter;
    return matchSearch && matchSeverity && matchCategory;
  }), [data, search, severityFilter, categoryFilter]);

  const handleSave = (entry) => {
    setData(prev => entry.id && prev.find(e => e.id === entry.id)
      ? prev.map(e => e.id === entry.id ? entry : e)
      : [...prev, { ...entry, id: Date.now() }]);
    setModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">Enforcement Watch</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track regulatory enforcement actions, crackdowns, and policy events across Africa</p>
        </div>
        <button onClick={() => setModal({ mode: "add" })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#D4A017" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
          <Plus size={15} /> Add Event
        </button>
      </div>

      {/* Severity summary — clickable filter */}
      <div className="grid grid-cols-3 gap-3">
        {SEVERITIES.slice(1).map(s => {
          const cfg = SEVERITY_CONFIG[s];
          const count = data.filter(e => e.severity === s).length;
          return (
            <button key={s} onClick={() => setSeverityFilter(severityFilter === s ? "All" : s)}
              className="rounded-xl p-4 text-left transition-all"
              style={{
                backgroundColor: severityFilter === s ? cfg.bg : "#1a1f2e",
                border: `1px solid ${severityFilter === s ? cfg.border : "#1f2937"}`,
              }}>
              <p className="text-xs text-gray-400 mb-1">{s}</p>
              <p className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 rounded-xl" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, countries, regulators…"
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
        </div>
        <div className="relative">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 pr-7 focus:outline-none appearance-none">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <span className="text-gray-500 text-xs ml-auto">{filtered.length} of {data.length} events</span>
      </div>

      {/* Events list — card style, not table, since descriptions are long */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl p-14 text-center text-slate-500 text-sm" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
            No events match your filters.
          </div>
        ) : filtered.map(e => (
          <div key={e.id} className="rounded-xl p-4 transition-colors group"
            style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
            onMouseEnter={ev => ev.currentTarget.style.borderColor = "rgba(212,160,23,0.2)"}
            onMouseLeave={ev => ev.currentTarget.style.borderColor = "#1f2937"}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Severity bar */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: SEVERITY_CONFIG[e.severity]?.color || "#94a3b8" }} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-base leading-none">{e.flag}</span>
                    <span className="text-white text-sm font-semibold">{e.country}</span>
                    <SeverityPill severity={e.severity} />
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-400">{e.category}</span>
                  </div>

                  <p className="text-white text-[13px] font-medium leading-snug mb-1">{e.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{e.description}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Calendar size={10} />{e.date}
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <ShieldAlert size={10} />{e.regulator}
                    </span>
                    {e.sourceUrl && (
                      <a href={e.sourceUrl} target="_blank" rel="noreferrer"
                        className="text-[#D4A017] text-[11px] flex items-center gap-1 hover:underline">
                        <ExternalLink size={10} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal({ mode: "edit", data: e })}
                  className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-gray-700 transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteTarget(e)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-gray-700 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] text-slate-600 pt-2">
        {filtered.length} of {data.length} events · Replace mock data with API when backend is ready
      </div>

      {modal && <EntryModal entry={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
      {deleteTarget && <DeleteConfirm entry={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={id => { setData(p => p.filter(e => e.id !== id)); setDeleteTarget(null); }} />}
    </div>
  );
}
