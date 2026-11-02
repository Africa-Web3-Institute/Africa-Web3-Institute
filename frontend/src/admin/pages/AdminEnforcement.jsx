// src/admin/pages/AdminEnforcement.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search, Plus, Edit2, Trash2, X, Save,
  ChevronDown, Calendar, ShieldAlert, ExternalLink,
  Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { enforcementApi } from "../../api/api";
import { useAuth } from "../../lib/AuthContext";

const SEVERITY_CONFIG = {
  Positive:    { color:"#4ade80", bg:"rgba(74,222,128,0.12)",  border:"rgba(74,222,128,0.3)"  },
  Neutral:     { color:"#94a3b8", bg:"rgba(148,163,184,0.12)", border:"rgba(148,163,184,0.3)" },
  Restrictive: { color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.3)" },
};

const CATEGORIES = [
  "All Categories",
  "Regulatory Update","License Granted","Exchange Action",
  "Ban / Prohibition","Consultation","Advisory",
  "Framework Published","Blockchain Policy","Tax / AML",
  "Investigation","Other",
];

const SEVERITIES = ["All","Positive","Neutral","Restrictive"];

const AFRICAN_COUNTRIES = [
  { name:"Nigeria",flag:"🇳🇬" },{ name:"South Africa",flag:"🇿🇦" },{ name:"Kenya",flag:"🇰🇪" },
  { name:"Ghana",flag:"🇬🇭" },{ name:"Rwanda",flag:"🇷🇼" },{ name:"Egypt",flag:"🇪🇬" },
  { name:"Ethiopia",flag:"🇪🇹" },{ name:"Tanzania",flag:"🇹🇿" },{ name:"Uganda",flag:"🇺🇬" },
  { name:"Senegal",flag:"🇸🇳" },{ name:"Morocco",flag:"🇲🇦" },{ name:"Cameroon",flag:"🇨🇲" },
  { name:"Côte d'Ivoire",flag:"🇨🇮" },{ name:"Zimbabwe",flag:"🇿🇼" },{ name:"Zambia",flag:"🇿🇲" },
  { name:"Algeria",flag:"🇩🇿" },{ name:"Tunisia",flag:"🇹🇳" },{ name:"Botswana",flag:"🇧🇼" },
  { name:"Mauritius",flag:"🇲🇺" },{ name:"Seychelles",flag:"🇸🇨" },{ name:"Namibia",flag:"🇳🇦" },
];

function SeverityPill({ severity }) {
  const s = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Neutral;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.color }} />
      {severity}
    </span>
  );
}

// ─── Add / Edit Modal ────────────────────────────────────────────────────────
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
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCountryChange = (name) => {
    const found = AFRICAN_COUNTRIES.find(c => c.name === name);
    set("country", name);
    if (found) set("flag", found.flag);
  };

  const handleSave = async () => {
    if (!form.title)   { setError("Title is required.");   return; }
    if (!form.country) { setError("Country is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...entry, ...form });
    } catch (err) {
      setError(err.message || "Save failed.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(0,0,0,0.7)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:"#1f2937" }}>
          <h2 className="text-white font-semibold">{isEdit ? "Edit Enforcement Event" : "Add Enforcement Event"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />{error}
            </div>
          )}

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
              <div className="flex gap-1.5">
                {SEVERITIES.slice(1).map(s => {
                  const cfg = SEVERITY_CONFIG[s];
                  return (
                    <button key={s} type="button" onClick={() => set("severity", s)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors"
                      style={form.severity === s
                        ? { background:cfg.bg, color:cfg.color, borderColor:cfg.border }
                        : { background:"transparent", color:"#6b7280", borderColor:"#374151" }}>
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
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor:"#D4A017" }}
              onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor="#b8891a")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor="#D4A017")}>
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><Save size={13} />{isEdit ? "Save Changes" : "Add Event"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ──────────────────────────────────────────────────────────
function DeleteConfirm({ entry, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(0,0,0,0.7)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
        <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-center mb-2">Delete Event</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          Delete <span className="text-white font-medium">"{entry.title}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 border border-gray-700">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={13} className="animate-spin" /> : null} Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminEnforcement() {
  const { isSuperAdmin } = useAuth();
  const [data,           setData]           = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [search,         setSearch]         = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [modal,          setModal]          = useState(null);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [deleteLoading,  setDeleteLoading]  = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await enforcementApi.getAll();
      setData(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load enforcement data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => data.filter(e => {
    const q = search.toLowerCase();
    const matchSearch   = !q || e.title?.toLowerCase().includes(q) || e.country?.toLowerCase().includes(q) || e.regulator?.toLowerCase().includes(q);
    const matchSeverity = severityFilter === "All" || e.severity === severityFilter;
    const matchCategory = categoryFilter === "All Categories" || e.category === categoryFilter;
    return matchSearch && matchSeverity && matchCategory;
  }), [data, search, severityFilter, categoryFilter]);

  const handleSave = async (entry) => {
    if (entry.id && data.find(e => e.id === entry.id)) {
      // Update existing
      const saved = await enforcementApi.update(entry.id, entry);
      setData(prev => prev.map(e => e.id === entry.id ? { ...e, ...saved } : e));
    } else {
      // Create new
      const created = await enforcementApi.create(entry);
      setData(prev => [created, ...prev]);
    }
    setModal(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await enforcementApi.remove(deleteTarget.id);
      setData(prev => prev.filter(e => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Delete failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">Enforcement Watch</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track regulatory enforcement actions, crackdowns, and policy events across Africa</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={() => setModal({ mode:"add" })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor:"#D4A017" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor="#b8891a"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor="#D4A017"}>
            <Plus size={15} /> Add Event
          </button>
        </div>
      </div>

      {/* Severity summary — clickable filters */}
      <div className="grid grid-cols-3 gap-3">
        {SEVERITIES.slice(1).map(s => {
          const cfg = SEVERITY_CONFIG[s];
          const count = data.filter(e => e.severity === s).length;
          return (
            <button key={s} onClick={() => setSeverityFilter(severityFilter === s ? "All" : s)}
              className="rounded-xl p-4 text-left transition-all"
              style={{ backgroundColor: severityFilter === s ? cfg.bg : "#1a1f2e", border:`1px solid ${severityFilter === s ? cfg.border : "#1f2937"}` }}>
              <p className="text-xs text-gray-400 mb-1">{s}</p>
              {loading
                ? <div className="h-8 w-8 bg-gray-700 animate-pulse rounded" />
                : <p className="text-2xl font-bold" style={{ color:cfg.color }}>{count}</p>
              }
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2"><AlertCircle size={15} />{error}</div>
          <button onClick={fetchData} className="underline text-xs font-semibold">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 rounded-xl" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
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

      {/* Events list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-500 text-sm"
          style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937", borderRadius:"0.75rem" }}>
          <Loader2 size={16} className="animate-spin" /> Loading events…
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl p-14 text-center text-slate-500 text-sm" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
              No events match your filters.
            </div>
          ) : filtered.map(e => (
            <div key={e.id} className="rounded-xl p-4 transition-colors group"
              style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor="rgba(212,160,23,0.2)"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor="#1f2937"}>
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

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Calendar size={10} />{e.date}
                      </span>
                      {e.regulator && (
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <ShieldAlert size={10} />{e.regulator}
                        </span>
                      )}
                      {e.sourceUrl && (
                        <a href={e.sourceUrl} target="_blank" rel="noreferrer"
                          className="text-[#D4A017] text-[11px] flex items-center gap-1 hover:underline">
                          <ExternalLink size={10} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions — visible on hover */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ mode:"edit", data:e })}
                    className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-gray-700 transition-colors">
                    <Edit2 size={13} />
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => setDeleteTarget(e)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-gray-700 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-[11px] text-slate-600 pt-2">
        {filtered.length} of {data.length} events · Live data from API
      </div>

      {modal && (
        <EntryModal entry={modal.data} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          entry={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
