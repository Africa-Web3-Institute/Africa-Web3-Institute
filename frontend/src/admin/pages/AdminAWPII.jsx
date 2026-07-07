// src/admin/pages/AdminAWPII.jsx
import { useState, useEffect, useMemo } from "react";
import { Search, Edit2, Save, X, ChevronDown, TrendingUp, TrendingDown, Minus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { awpiiApi } from "../../api/api";
import { useAuth } from "../../lib/AuthContext";

const GRADES = ["AA+","AA-","A+","A","A-","BBB+","BBB-","BB+","BB","B+","B-","C+","C","C-","D"];
const REGIONS = ["All Regions","West Africa","East Africa","North Africa","Central Africa","Southern Africa"];
const RISKS   = ["All Risks","Low","Medium","High"];

const GRADE_COLORS = {
  "AA+": { bg:"rgba(20,83,45,0.4)",   text:"#4ade80", border:"rgba(74,222,128,0.3)"   },
  "AA-": { bg:"rgba(20,83,45,0.3)",   text:"#4ade80", border:"rgba(74,222,128,0.25)"  },
  "A+":  { bg:"rgba(22,101,52,0.3)",  text:"#86efac", border:"rgba(134,239,172,0.25)" },
  "A":   { bg:"rgba(22,101,52,0.25)", text:"#86efac", border:"rgba(134,239,172,0.2)"  },
  "A-":  { bg:"rgba(22,101,52,0.2)",  text:"#86efac", border:"rgba(134,239,172,0.2)"  },
  "BBB+":{ bg:"rgba(212,160,23,0.15)",text:"#D4A017", border:"rgba(212,160,23,0.3)"   },
  "BBB-":{ bg:"rgba(212,160,23,0.15)",text:"#D4A017", border:"rgba(212,160,23,0.3)"   },
  "BB+": { bg:"rgba(212,160,23,0.1)", text:"#fbbf24", border:"rgba(251,191,36,0.25)"  },
  "BB":  { bg:"rgba(212,160,23,0.1)", text:"#fbbf24", border:"rgba(251,191,36,0.25)"  },
  "B+":  { bg:"rgba(220,38,38,0.15)", text:"#f87171", border:"rgba(248,113,113,0.3)"  },
  "B-":  { bg:"rgba(220,38,38,0.15)", text:"#f87171", border:"rgba(248,113,113,0.3)"  },
  "C+":  { bg:"rgba(220,38,38,0.2)",  text:"#ef4444", border:"rgba(239,68,68,0.3)"    },
};

const RISK_COLORS = {
  Low:    { text:"#4ade80", bg:"rgba(74,222,128,0.1)"   },
  Medium: { text:"#fbbf24", bg:"rgba(251,191,36,0.1)"   },
  High:   { text:"#f87171", bg:"rgba(248,113,113,0.1)"  },
};

function ScoreBar({ value }) {
  const color = value >= 80 ? "#4ade80" : value >= 65 ? "#D4A017" : value >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{value}</span>
    </div>
  );
}

function GradePill({ grade }) {
  const g = GRADE_COLORS[grade] || { bg:"rgba(100,116,139,0.2)", text:"#94a3b8", border:"rgba(148,163,184,0.2)" };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded font-mono"
      style={{ background: g.bg, color: g.text, border: `1px solid ${g.border}` }}>
      {grade}
    </span>
  );
}

function TrendIcon({ trend }) {
  if (trend === "up")   return <TrendingUp   className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down") return <TrendingDown  className="w-3.5 h-3.5 text-red-400" />;
  return                       <Minus         className="w-3.5 h-3.5 text-slate-500" />;
}

// ─── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({ country, onClose, onSave }) {
  const [form, setForm] = useState({
    grade:         country.grade         || "BBB+",
    overall_score: country.overall_score || 0,
    policy:        country.policy        || 0,
    innovation:    country.innovation    || 0,
    adoption:      country.adoption      || 0,
    risk:          country.risk          || "Medium",
    lastUpdated:   country.lastUpdated   || "",
    trend:         country.trend         || "stable",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave({ ...country, ...form });
    } catch (err) {
      setError(err.message || "Save failed.");
      setSaving(false);
    }
  };

  const NumField = ({ label, name }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <input type="number" min={0} max={100} value={form[name]}
        onChange={e => set(name, Number(e.target.value))}
        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor:"rgba(0,0,0,0.7)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:"#1f2937" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <h2 className="text-white font-semibold">{country.name}</h2>
              <p className="text-slate-500 text-xs">{country.region}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />{error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Grade</label>
              <select value={form.grade} onChange={e => set("grade", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Risk Level</label>
              <select value={form.risk} onChange={e => set("risk", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                {["Low","Medium","High"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumField label="Overall Score"    name="overall_score" />
            <NumField label="Policy Score"     name="policy" />
            <NumField label="Innovation Score" name="innovation" />
            <NumField label="Adoption Score"   name="adoption" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Trend</label>
              <select value={form.trend} onChange={e => set("trend", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600">
                <option value="up">↑ Up</option>
                <option value="stable">→ Stable</option>
                <option value="down">↓ Down</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Updated</label>
              <input type="text" value={form.lastUpdated} onChange={e => set("lastUpdated", e.target.value)}
                placeholder="e.g. April 2026"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-gray-700 hover:border-gray-500 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor:"#D4A017" }}
              onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor="#b8891a")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor="#D4A017")}>
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><Save size={13} />Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminAWPII() {
  const { isSuperAdmin } = useAuth();
  const [data,         setData]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [riskFilter,   setRiskFilter]   = useState("All Risks");
  const [editing,      setEditing]      = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await awpiiApi.getAll();
      setData(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load AWPII data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.grade?.toLowerCase().includes(q);
    const matchRegion = regionFilter === "All Regions" || c.region === regionFilter;
    const matchRisk   = riskFilter   === "All Risks"   || c.risk   === riskFilter;
    return matchSearch && matchRegion && matchRisk;
  }), [data, search, regionFilter, riskFilter]);

  const avgScore = data.length
    ? (data.reduce((s, c) => s + (Number(c.overall_score) || 0), 0) / data.length).toFixed(1)
    : "—";

  const handleSave = async (updated) => {
    // PUT /api/awpii/:country — use key or id
    const identifier = updated.key || updated.id || updated.name?.toLowerCase().replace(/\s+/g, "");
    const saved = await awpiiApi.update(identifier, updated);
    setData(prev => prev.map(c =>
      (c.id === updated.id || c.key === updated.key) ? { ...c, ...saved } : c
    ));
    setEditing(null);
  };

  const Select = ({ value, onChange, options }) => (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 pr-7 focus:outline-none appearance-none">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">AWPII Data</h1>
          <p className="text-gray-400 text-sm mt-0.5">Africa Web3 Policy & Innovation Index — manage country scores and grades</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
            {data.length} countries · avg {avgScore}
          </span>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:"AA / A Rated",   value: data.filter(c => c.grade?.startsWith("A")).length,                                        color:"#4ade80" },
          { label:"BBB / BB Rated", value: data.filter(c => c.grade?.startsWith("B") && (c.grade?.length <= 4)).length,              color:"#D4A017" },
          { label:"B / C Rated",    value: data.filter(c => ["B+","B-","C+","C","C-","D"].includes(c.grade)).length,                 color:"#f87171" },
          { label:"Low Risk",       value: data.filter(c => c.risk === "Low").length,                                                 color:"#38bdf8" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            {loading
              ? <div className="h-8 w-10 bg-gray-700 animate-pulse rounded" />
              : <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            }
          </div>
        ))}
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country or grade…"
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600" />
        </div>
        <Select value={regionFilter} onChange={setRegionFilter} options={REGIONS} />
        <Select value={riskFilter}   onChange={setRiskFilter}   options={RISKS} />
        <span className="text-gray-500 text-xs ml-auto">{filtered.length} of {data.length}</span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor:"#1a1f2e", border:"1px solid #1f2937" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-500 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading AWPII data…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:800 }}>
              <thead>
                <tr className="border-b text-left" style={{ backgroundColor:"#111827", borderColor:"#1f2937" }}>
                  {["Country","Grade","Overall","Policy","Innovation","Adoption","Risk","Trend","Updated",""].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-14 text-center text-slate-500 text-sm">No countries found.</td></tr>
                ) : filtered.map((c, i) => {
                  const riskColor = RISK_COLORS[c.risk] || RISK_COLORS.Medium;
                  return (
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
                      <td className="px-4 py-3"><GradePill grade={c.grade} /></td>
                      <td className="px-4 py-3 min-w-[100px]"><ScoreBar value={Number(c.overall_score) || 0} /></td>
                      <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={Number(c.policy) || 0} /></td>
                      <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={Number(c.innovation) || 0} /></td>
                      <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={Number(c.adoption) || 0} /></td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{ color: riskColor.text, background: riskColor.bg }}>{c.risk}</span>
                      </td>
                      <td className="px-4 py-3"><TrendIcon trend={c.trend} /></td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-mono whitespace-nowrap">{c.lastUpdated}</td>
                      <td className="px-4 py-3">
                        {isSuperAdmin && (
                          <button onClick={() => setEditing(c)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-gray-700 transition-colors">
                            <Edit2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t text-[11px] text-slate-500 flex justify-between" style={{ borderColor:"#1f2937" }}>
          <span>{filtered.length} of {data.length} countries</span>
          <span>Live data from API · Superadmin required to edit</span>
        </div>
      </div>

      {editing && (
        <EditModal country={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}
