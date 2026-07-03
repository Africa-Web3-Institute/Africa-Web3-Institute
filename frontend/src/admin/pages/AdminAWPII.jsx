import { useState, useMemo } from "react";
import { Search, Edit2, Save, X, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Mock data — replace with API calls ───────────────────────────────────
const MOCK_AWPII = [
  { id: 1, key: "southafrica", name: "South Africa", flag: "🇿🇦", region: "Southern Africa", grade: "AA+", overall_score: 88.7, policy: 93, innovation: 89, adoption: 87, risk: "Low", lastUpdated: "February 2026", trend: "up" },
  { id: 2, key: "mauritius",   name: "Mauritius",    flag: "🇲🇺", region: "East Africa",    grade: "AA-", overall_score: 85.8, policy: 89, innovation: 87, adoption: 80, risk: "Low", lastUpdated: "2024",          trend: "up" },
  { id: 3, key: "kenya",       name: "Kenya",        flag: "🇰🇪", region: "East Africa",    grade: "AA-", overall_score: 87.4, policy: 91, innovation: 88, adoption: 88, risk: "Medium", lastUpdated: "April 2026",  trend: "up" },
  { id: 4, key: "rwanda",      name: "Rwanda",       flag: "🇷🇼", region: "East Africa",    grade: "AA-", overall_score: 83.1, policy: 80, innovation: 85, adoption: 82, risk: "Low",    lastUpdated: "January 2026",trend: "up" },
  { id: 5, key: "nigeria",     name: "Nigeria",      flag: "🇳🇬", region: "West Africa",    grade: "A+",  overall_score: 82.5, policy: 83, innovation: 79, adoption: 93, risk: "Medium", lastUpdated: "March 2026",  trend: "stable" },
  { id: 6, key: "ghana",       name: "Ghana",        flag: "🇬🇭", region: "West Africa",    grade: "A+",  overall_score: 84.2, policy: 85, innovation: 87, adoption: 84, risk: "Medium", lastUpdated: "January 2026",trend: "up" },
  { id: 7, key: "morocco",     name: "Morocco",      flag: "🇲🇦", region: "North Africa",   grade: "A",   overall_score: 82.0, policy: 80, innovation: 83, adoption: 83, risk: "High",   lastUpdated: "January 2026",trend: "up" },
  { id: 8, key: "seychelles",  name: "Seychelles",   flag: "🇸🇨", region: "East Africa",    grade: "A",   overall_score: 80.2, policy: 83, innovation: 80, adoption: 77, risk: "Low",    lastUpdated: "2025",        trend: "stable" },
  { id: 9, key: "namibia",     name: "Namibia",      flag: "🇳🇦", region: "Southern Africa",grade: "A-",  overall_score: 76.8, policy: 77, innovation: 78, adoption: 76, risk: "Low",    lastUpdated: "2026",        trend: "up" },
  { id: 10,key: "botswana",    name: "Botswana",     flag: "🇧🇼", region: "Southern Africa",grade: "A-",  overall_score: 75.6, policy: 75, innovation: 76, adoption: 75, risk: "Medium", lastUpdated: "January 2026",trend: "stable" },
  { id: 11,key: "uganda",      name: "Uganda",       flag: "🇺🇬", region: "East Africa",    grade: "BBB+",overall_score: 74.2, policy: 74, innovation: 74, adoption: 75, risk: "Medium", lastUpdated: "August 2025", trend: "up" },
  { id: 12,key: "ethiopia",    name: "Ethiopia",     flag: "🇪🇹", region: "East Africa",    grade: "BBB-",overall_score: 71.8, policy: 71, innovation: 72, adoption: 72, risk: "Medium", lastUpdated: "November 2025",trend: "up" },
  { id: 13,key: "tanzania",    name: "Tanzania",     flag: "🇹🇿", region: "East Africa",    grade: "BBB-",overall_score: 71.5, policy: 71, innovation: 71, adoption: 72, risk: "Medium", lastUpdated: "October 2025",trend: "up" },
  { id: 14,key: "zambia",      name: "Zambia",       flag: "🇿🇲", region: "Southern Africa",grade: "BB+", overall_score: 69.4, policy: 69, innovation: 69, adoption: 70, risk: "Medium", lastUpdated: "September 2025",trend: "up" },
  { id: 15,key: "tunisia",     name: "Tunisia",      flag: "🇹🇳", region: "North Africa",   grade: "BB",  overall_score: 63.5, policy: 63, innovation: 64, adoption: 63, risk: "Medium", lastUpdated: "February 2026",trend: "stable" },
  { id: 16,key: "senegal",     name: "Senegal",      flag: "🇸🇳", region: "West Africa",    grade: "BB",  overall_score: 64.5, policy: 64, innovation: 65, adoption: 64, risk: "Medium", lastUpdated: "February 2026",trend: "stable" },
  { id: 17,key: "cotedivoire", name: "Côte d'Ivoire",flag: "🇨🇮", region: "West Africa",    grade: "BB",  overall_score: 64.3, policy: 64, innovation: 64, adoption: 65, risk: "Medium", lastUpdated: "November 2025",trend: "up" },
  { id: 18,key: "cameroon",    name: "Cameroon",     flag: "🇨🇲", region: "Central Africa", grade: "B+",  overall_score: 58.5, policy: 58, innovation: 58, adoption: 59, risk: "Medium", lastUpdated: "December 2025",trend: "stable" },
  { id: 19,key: "zimbabwe",    name: "Zimbabwe",     flag: "🇿🇼", region: "Southern Africa",grade: "B+",  overall_score: 56.0, policy: 56, innovation: 50, adoption: 60, risk: "Medium", lastUpdated: "March 2026",  trend: "up" },
  { id: 20,key: "algeria",     name: "Algeria",      flag: "🇩🇿", region: "North Africa",   grade: "B-",  overall_score: 52.5, policy: 52, innovation: 53, adoption: 52, risk: "High",   lastUpdated: "June 2025",   trend: "stable" },
  { id: 21,key: "egypt",       name: "Egypt",        flag: "🇪🇬", region: "North Africa",   grade: "C+",  overall_score: 41.3, policy: 41, innovation: 41, adoption: 42, risk: "High",   lastUpdated: "December 2025",trend: "down" },
];

const GRADES = ["AA+","AA-","A+","A","A-","BBB+","BBB-","BB+","BB","B+","B-","C+","C","C-","D"];
const REGIONS = ["All Regions","West Africa","East Africa","North Africa","Central Africa","Southern Africa"];
const RISKS   = ["All Risks","Low","Medium","High"];

const GRADE_COLORS = {
  "AA+": { bg: "rgba(20,83,45,0.4)",  text: "#4ade80", border: "rgba(74,222,128,0.3)" },
  "AA-": { bg: "rgba(20,83,45,0.3)",  text: "#4ade80", border: "rgba(74,222,128,0.25)" },
  "A+":  { bg: "rgba(22,101,52,0.3)", text: "#86efac", border: "rgba(134,239,172,0.25)" },
  "A":   { bg: "rgba(22,101,52,0.25)",text: "#86efac", border: "rgba(134,239,172,0.2)" },
  "A-":  { bg: "rgba(22,101,52,0.2)", text: "#86efac", border: "rgba(134,239,172,0.2)" },
  "BBB+":{ bg: "rgba(212,160,23,0.15)",text: "#D4A017",border: "rgba(212,160,23,0.3)" },
  "BBB-":{ bg: "rgba(212,160,23,0.15)",text: "#D4A017",border: "rgba(212,160,23,0.3)" },
  "BB+": { bg: "rgba(212,160,23,0.1)", text: "#fbbf24",border: "rgba(251,191,36,0.25)" },
  "BB":  { bg: "rgba(212,160,23,0.1)", text: "#fbbf24",border: "rgba(251,191,36,0.25)" },
  "B+":  { bg: "rgba(220,38,38,0.15)", text: "#f87171",border: "rgba(248,113,113,0.3)" },
  "B-":  { bg: "rgba(220,38,38,0.15)", text: "#f87171",border: "rgba(248,113,113,0.3)" },
  "C+":  { bg: "rgba(220,38,38,0.2)",  text: "#ef4444",border: "rgba(239,68,68,0.3)" },
};

const RISK_COLORS = {
  Low:    { text: "#4ade80", bg: "rgba(74,222,128,0.1)"  },
  Medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },
  High:   { text: "#f87171", bg: "rgba(248,113,113,0.1)" },
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
  const g = GRADE_COLORS[grade] || { bg: "rgba(100,116,139,0.2)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded font-mono" style={{ background: g.bg, color: g.text, border: `1px solid ${g.border}` }}>
      {grade}
    </span>
  );
}

function TrendIcon({ trend }) {
  if (trend === "up")     return <TrendingUp   className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down")   return <TrendingDown  className="w-3.5 h-3.5 text-red-400" />;
  return                         <Minus         className="w-3.5 h-3.5 text-slate-500" />;
}

// ─── Edit Modal ────────────────────────────────────────────────────────────
function EditModal({ country, onClose, onSave }) {
  const [form, setForm] = useState({
    grade:         country.grade,
    overall_score: country.overall_score,
    policy:        country.policy,
    innovation:    country.innovation,
    adoption:      country.adoption,
    risk:          country.risk,
    lastUpdated:   country.lastUpdated,
    trend:         country.trend,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const Field = ({ label, name, type = "number", min, max }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        min={min} max={max}
        value={form[name]}
        onChange={e => set(name, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1f2937" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <h2 className="text-white font-semibold">{country.name}</h2>
              <p className="text-slate-500 text-xs">{country.region}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Grade + Risk row */}
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

          {/* Scores */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Overall Score" name="overall_score" min={0} max={100} />
            <Field label="Policy Score"  name="policy"        min={0} max={100} />
            <Field label="Innovation Score" name="innovation"  min={0} max={100} />
            <Field label="Adoption Score"   name="adoption"    min={0} max={100} />
          </div>

          {/* Trend + Date */}
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
            <Field label="Last Updated" name="lastUpdated" type="text" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-gray-700 hover:border-gray-500 transition-colors">Cancel</button>
            <button onClick={() => onSave({ ...country, ...form })}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}>
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function AdminAWPII() {
  const [data, setData] = useState(MOCK_AWPII);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [riskFilter, setRiskFilter] = useState("All Risks");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.grade.toLowerCase().includes(q);
    const matchRegion = regionFilter === "All Regions" || c.region === regionFilter;
    const matchRisk   = riskFilter   === "All Risks"   || c.risk   === riskFilter;
    return matchSearch && matchRegion && matchRisk;
  }), [data, search, regionFilter, riskFilter]);

  const avgScore = (data.reduce((s, c) => s + c.overall_score, 0) / data.length).toFixed(1);

  const handleSave = (updated) => {
    setData(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditing(null);
  };

  const Select = ({ value, onChange, options }) => (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-1 focus:ring-yellow-600 appearance-none">
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
        <span className="text-xs text-slate-500 font-mono bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
          {data.length} countries · avg score {avgScore}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "AA / A Rated",  value: data.filter(c => c.grade.startsWith("A")).length,   color: "#4ade80" },
          { label: "BBB / BB Rated",value: data.filter(c => c.grade.startsWith("B") && c.grade.length <= 4).length, color: "#D4A017" },
          { label: "B / C Rated",   value: data.filter(c => ["B+","B-","C+","C","C-","D"].includes(c.grade)).length, color: "#f87171" },
          { label: "Low Risk",      value: data.filter(c => c.risk === "Low").length,           color: "#38bdf8" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 rounded-xl" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
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
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 800 }}>
            <thead>
              <tr className="border-b text-left" style={{ backgroundColor: "#111827", borderColor: "#1f2937" }}>
                {["Country","Grade","Overall","Policy","Innovation","Adoption","Risk","Trend","Updated",""].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const riskColor = RISK_COLORS[c.risk] || RISK_COLORS.Medium;
                return (
                  <tr key={c.id} className="border-b transition-colors"
                    style={{ borderColor: "#1f2937", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(212,160,23,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}>
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
                    <td className="px-4 py-3 min-w-[100px]"><ScoreBar value={c.overall_score} /></td>
                    <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={c.policy} /></td>
                    <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={c.innovation} /></td>
                    <td className="px-4 py-3 min-w-[80px]"><ScoreBar value={c.adoption} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: riskColor.text, background: riskColor.bg }}>{c.risk}</span>
                    </td>
                    <td className="px-4 py-3"><TrendIcon trend={c.trend} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono whitespace-nowrap">{c.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing(c)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-gray-700 transition-colors" title="Edit scores">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t text-[11px] text-slate-500 flex justify-between" style={{ borderColor: "#1f2937" }}>
          <span>{filtered.length} of {data.length} countries</span>
          <span>Data source: AWI Research Team — replace with API when ready</span>
        </div>
      </div>

      {editing && <EditModal country={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  );
}
