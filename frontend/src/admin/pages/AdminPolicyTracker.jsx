// src/admin/pages/AdminPolicyTracker.jsx
import { useState, useEffect } from "react";
import { Save, AlertCircle, RefreshCw, Loader2, FileText, Globe, TrendingUp } from "lucide-react";
import awpiiDataFallback from "../../data/awpiiData";
import { COUNTRIES as trackerCountriesFallback } from "../../data/trackerCountries";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminPolicyTracker() {
  const [awpiiData, setAwpiiData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const awpiiRes = await fetch(`${API_URL}/api/awpii`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      const awpiiJson = await awpiiRes.json();
      if (awpiiJson.data && awpiiJson.data.length > 0) {
        setAwpiiData(awpiiJson.data.map(item => ({
          countryKey: item.country,
          score: item.score,
          ...item.details
        })));
      } else {
        setAwpiiData(awpiiDataFallback.map(item => {
          const { key, overall_score, ...rest } = item;
          return { countryKey: key, score: overall_score, ...rest };
        }));
      }

      const trackerRes = await fetch(`${API_URL}/api/tracker`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      const trackerJson = await trackerRes.json();
      if (trackerJson.data && trackerJson.data.length > 0) {
        setTrackerData(trackerJson.data.map(item => ({
          countryName: item.country,
          status: item.status,
          ...item.details
        })));
      } else {
        setTrackerData(trackerCountriesFallback.map(item => {
          const { name, status, ...rest } = item;
          return { countryName: name, status, ...rest };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch data, using fallback", err);
      setAwpiiData(awpiiDataFallback.map(item => {
        const { key, overall_score, ...rest } = item;
        return { countryKey: key, score: overall_score, ...rest };
      }));
      setTrackerData(trackerCountriesFallback.map(item => {
        const { name, status, ...rest } = item;
        return { countryName: name, status, ...rest };
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAwpiiChange = (index, field, value) => {
    const newData = [...awpiiData];
    newData[index][field] = value;
    setAwpiiData(newData);
  };

  const handleTrackerChange = (index, field, value) => {
    const newData = [...trackerData];
    newData[index][field] = value;
    setTrackerData(newData);
  };

  const handleSaveAwpii = async (item) => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const { countryKey, score, ...details } = item;
      const res = await fetch(`${API_URL}/api/awpii/${countryKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ score: Number(score), details: JSON.stringify(details) })
      });
      if (!res.ok) throw new Error("Failed to save AWPII score");
      setMessage({ text: "AWPII Score saved successfully", type: "success" });
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleSaveTracker = async (item) => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const { countryName, status, ...details } = item;
      const res = await fetch(`${API_URL}/api/tracker/${countryName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ status, details: JSON.stringify(details) })
      });
      if (!res.ok) throw new Error("Failed to save Tracker status");
      setMessage({ text: "Tracker status saved successfully", type: "success" });
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  // ─── Loading skeletons ──────────────────────────────────────
  const TableSkeleton = ({ rows = 5, cols = 5 }) => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-800 rounded-t-lg mb-2" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-2 mb-2">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="h-8 bg-gray-800 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );

  // ─── Status badge component ─────────────────────────────────
  const StatusBadge = ({ status }) => {
    const colors = {
      live: { bg: "bg-green-900/30", text: "text-green-400", dot: "bg-green-400" },
      proposed: { bg: "bg-blue-900/30", text: "text-blue-400", dot: "bg-blue-400" },
      review: { bg: "bg-yellow-900/30", text: "text-yellow-400", dot: "bg-yellow-400" },
      none: { bg: "bg-gray-800", text: "text-gray-400", dot: "bg-gray-500" },
    };
    const s = colors[status] || colors.none;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="text-yellow-500" size={24} />
            Policy Tracker Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage AWPII scores and regulatory tracker statuses for African countries.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-700 hover:border-yellow-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Flash message */}
      {message.text && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-green-500/10 border-green-500/30 text-green-400"
          }`}
        >
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        {/* ─── Regulatory Tracker ────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-yellow-500" size={20} />
            <h2 className="text-xl font-semibold">Regulatory Tracker Status</h2>
            <span className="text-sm text-gray-500 ml-auto">
              {trackerData.length} countries
            </span>
          </div>

          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/80 border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Framework</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Regulator</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Since</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {trackerData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-800/40 transition-colors group"
                      >
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          {item.flag && <span className="text-lg">{item.flag}</span>}
                          {item.countryName}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.status || "none"}
                            onChange={(e) => handleTrackerChange(index, "status", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 w-full max-w-[140px]"
                          >
                            <option value="live">Live</option>
                            <option value="proposed">Proposed</option>
                            <option value="review">In Review</option>
                            <option value="none">No Framework</option>
                          </select>
                          <StatusBadge status={item.status || "none"} />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.framework || ""}
                            onChange={(e) => handleTrackerChange(index, "framework", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 w-full min-w-[100px]"
                            placeholder="e.g. VASP Act"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.regulator || ""}
                            onChange={(e) => handleTrackerChange(index, "regulator", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 w-full min-w-[120px]"
                            placeholder="e.g. Central Bank"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.since || ""}
                            onChange={(e) => handleTrackerChange(index, "since", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 w-24"
                            placeholder="e.g. 2023"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleSaveTracker(item)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-yellow-600 hover:bg-yellow-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-gray-800 text-xs text-gray-500 flex justify-between items-center">
                <span>{trackerData.length} entries</span>
                <span>Edits are saved individually</span>
              </div>
            </div>
          )}
        </section>

        {/* ─── AWPII Scores ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-yellow-500" size={20} />
            <h2 className="text-xl font-semibold">AWPII Scores</h2>
            <span className="text-sm text-gray-500 ml-auto">
              {awpiiData.length} countries
            </span>
          </div>

          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/80 border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Momentum</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {awpiiData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-800/40 transition-colors group"
                      >
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          {item.flag && <span className="text-lg">{item.flag}</span>}
                          {item.countryKey}
                          {item.id && <span className="text-xs text-gray-500">(#{item.id})</span>}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.rank || ""}
                            onChange={(e) => handleAwpiiChange(index, "rank", parseInt(e.target.value))}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white w-16 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.grade || ""}
                            onChange={(e) => handleAwpiiChange(index, "grade", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white w-20 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            placeholder="A+"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.1"
                            value={item.score || ""}
                            onChange={(e) => handleAwpiiChange(index, "score", parseFloat(e.target.value))}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white w-20 font-bold text-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.momentum || ""}
                            onChange={(e) => handleAwpiiChange(index, "momentum", e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-white w-full min-w-[100px] focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            placeholder="e.g. Up"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleSaveAwpii(item)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-yellow-600 hover:bg-yellow-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-gray-800 text-xs text-gray-500 flex justify-between items-center">
                <span>{awpiiData.length} entries</span>
                <span>Edits are saved individually</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}