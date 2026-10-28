// src/admin/pages/AdminTracker.jsx
import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit2, X, Save, ChevronDown, Calendar, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { trackerApi } from "../../api/api";
import { useAuth } from "../../lib/AuthContext";

const STATUS_CONFIG = {
  live:     { label:"Live",         color:"#22c55e", bg:"rgba(34,197,94,0.12)",   border:"rgba(34,197,94,0.3)"   },
  proposed: { label:"Proposed",     color:"#f97316", bg:"rgba(249,115,22,0.12)",  border:"rgba(249,115,22,0.3)"  },
  review:   { label:"In Review",    color:"#a78bfa", bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.3)" },
  none:     { label:"No Framework", color:"#64748b", bg:"rgba(100,116,139,0.12)", border:"rgba(100,116,139,0.3)" },
};

const STATUSES  = ["all","live","proposed","review","none"];
const REGIONS   = ["All Regions","West Africa","East Africa","North Africa","Central Africa","Southern Africa"];
const ALL_TYPES = ["Fiat-backed","Asset-referenced","Crypto-backed","Commodity-backed"];

const AFRICAN_COUNTRIES = [
  { name:"Nigeria",flag:"🇳🇬" },{ name:"South Africa",flag:"🇿🇦" },{ name:"Kenya",flag:"🇰🇪" },
  { name:"Ghana",flag:"🇬🇭" },{ name:"Rwanda",flag:"🇷🇼" },{ name:"Egypt",flag:"🇪🇬" },
  { name:"Ethiopia",flag:"🇪🇹" },{ name:"Tanzania",flag:"🇹🇿" },{ name:"Uganda",flag:"🇺🇬" },
  { name:"Senegal",flag:"🇸🇳" },{ name:"Morocco",flag:"🇲🇦" },{ name:"Cameroon",flag:"🇨🇲" },
  { name:"Côte d'Ivoire",flag:"🇨🇮" },{ name:"Zimbabwe",flag:"🇿🇼" },{ name:"Zambia",flag:"🇿🇲" },
  { name:"Algeria",flag:"🇩🇿" },{ name:"Tunisia",flag:"🇹🇳" },{ name:"Botswana",flag:"🇧🇼" },
  { name:"Mauritius",flag:"🇲🇺" },{ name:"Seychelles",flag:"🇸🇨" },{ name:"Namibia",flag:"🇳🇦" },
];

function StatusPill({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.none;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
      style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.color }} />
      {s.label}
    </span>
  );
}

// ─── Edit Modal ─────────────────────────────────────────────────────────────
function EntryModal({ entry, onClose, onSave, isSuperAdmin }) {
  const isEdit = !!entry?.id;
  const [form, setForm] = useState({
    name:        entry?.name        || "",
    flag:        entry?.flag        || "🌍",
    region:      entry?.region      || "West Africa",
    status:      entry?.status      || "review",
    framework:   entry?.framework   || "",
    regulator:   entry?.regulator   || "",
    types:       entry?.types       || [],
    since:       entry?.since       || "—",
    lastUpdated: entry?.lastUpdated || "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleType = (t) => set("types",
    form.types.includes(t) ? form.types.filter(x => x !== t) : [...form.types, t]
  );

  const handleCountryChange = (name) => {
    const found = AFRICAN_COUNTRIES.find(c => c.name === name);
    set("name", name);
    if (found) set("flag", found.flag);
  };

  const handleSave = async () => {
    if (!form.name) { setError("Country name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...entry, ...form, id: entry?.id || Date.now() });
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
          <h2 className="text-white font-semibold">{isEdit ? `Edit — ${entry.name}` : "Add Country"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />{error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Country *</label>
              {isEdit ? (
                <input value={form.name} disabled className="w-full bg-gray-900 border border-gray-700 text-gray-400 text-sm rounded-lg px-3 py-2" />
              ) : (
                <select value={form.name} onChange={e => handleCountryChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                  <option value="">Select country…</option>
                  {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Region</label>
              <select value={form.region} onChange={e => set("region", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                {REGIONS.slice(1).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.slice(1).map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button key={s} type="button" onClick={() => set("status", s)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                    style={form.status === s
                      ? { background:cfg.bg, color:cfg.color, borderColor:cfg.border }
                      : { background:"transparent", color:"#6b7280", borderColor:"#374151" }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Framework Description</label>
            <textarea value={form.framework} onChange={e => set("framework", e.target.value)} rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600 resize-none" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Regulator(s)</label>
            <input value={form.regulator} onChange={e => set("regulator", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Stablecoin Types</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map(t => (
                <button key={t} type="button" onClick={() => toggleType(t)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-colors"
                  style={form.types.includes(t)
                    ? { background:"rgba(212,160,23,0.15)", color:"#D4A017", borderColor:"rgba(212,160,23,0.4)" }
                    : { background:"transparent", color:"#6b7280", borderColor:"#374151" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">In Effect Since</label>
              <input value={form.since} onChange={e => set("since", e.target.value)} placeholder="e.g. 2023 or —"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Updated</label>
              <input value={form.lastUpdated} onChange={e => set("lastUpdated", e.target.value)} placeholder="e.g. April 2026"
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
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><Save size={13} />{isEdit ? "Save Changes" : "Add Country"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminTracker() {
  const { isSuperAdmin } = useAuth();
  const [data,         setData]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [modal,        setModal]        = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await trackerApi.getAll();
      setData(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load tracker data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.framework?.toLowerCase().includes(q) || c.regulator?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchRegion = regionFilter === "All Regions" || c.region === regionFilter;
    return matchSearch && matchStatus && matchRegion;
  }), [data, search, statusFilter, regionFilter]);

  const handleSave = async (entry) => {
    const identifier = entry.key || entry.id || entry.name?.toLowerCase().replace(/\s+/g,"");
    if (entry.id && data.find(c => c.id === entry.id)) {
      const saved = await trackerApi.update(identifier, entry);
      setData(prev => prev.map(c => c.id === entry.id ? { ...c, ...saved } : c));
    } else {
      // New entry — tracker API only supports PUT, so add locally until backend supports POST
      setData(prev => [...prev, { ...entry, id: Date.now() }]);
    }
    setModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">Regulatory Tracker</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage African country stablecoin regulatory status and frameworks</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {isSuperAdmin && (
            <button onClick={() => setModal({ mode:"add" })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor:"#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor="#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor="#D4A017"}>
              <Plus size={15} /> Add Country
            </button>
          )}
        </div>
      </div>

      {/* Status summary — clickable filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATUSES.slice(1).map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = data.filter(c => c.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className="rounded-xl p-4 text-left transition-all"
              style={{ backgroundColor: statusFilter === s ? cfg.bg : "#1a1f2e", border:`1px solid ${statusFilter === s ? cfg.border : "#1f2937"}` }}>
              <p className="text-xs text-gray-400 mb-1">{cfg.label}</p>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country, framework, regulator…"
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
        </div>
        <div className="relative">
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 pr-7 focus:outline-none appearance-none">
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <span className="text-gray-500 text-xs ml-auto">{filtered.length} of {data.length}</span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading tracker data…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:760 }}>
              <thead>
                <tr className="border-b text-left" style={{ backgroundColor:"#111827", borderColor:"#1f2937" }}>
                  {["Country","Status","Framework","Regulator","Since","Updated",""].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-14 text-center text-slate-500 text-sm">No countries match your filters.</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id || c.key} className="border-b transition-colors"
                    style={{ borderColor:"#1f2937", backgroundColor: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor="rgba(212,160,23,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor= i%2===0 ? "transparent" : "rgba(255,255,255,0.01)"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{c.flag}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{c.name}</p>
                          <p className="text-slate-500 text-[11px]">{c.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                    <td className="px-4 py-3 max-w-[220px]"><p className="text-slate-400 text-xs leading-snug">{c.framework}</p></td>
                    <td className="px-4 py-3"><span className="text-slate-400 text-xs font-mono">{c.regulator}</span></td>
                    <td className="px-4 py-3"><span className="text-slate-500 text-xs font-mono">{c.since}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={10} />{c.lastUpdated}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSuperAdmin && (
                        <button onClick={() => setModal({ mode:"edit", data:c })}
                          className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-gray-700 transition-colors">
                          <Edit2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t text-[11px] text-slate-500 flex justify-between" style={{ borderColor:"#1f2937" }}>
          <span>{filtered.length} of {data.length} countries</span>
          <span>Live data from API · Superadmin required to edit</span>
        </div>
      </div>

      {modal && (
        <EntryModal entry={modal.data} onClose={() => setModal(null)} onSave={handleSave} isSuperAdmin={isSuperAdmin} />
      )}
    </div>
  );
}
