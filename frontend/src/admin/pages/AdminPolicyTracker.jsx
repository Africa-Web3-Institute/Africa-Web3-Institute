import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, AlertCircle, RefreshCw } from "lucide-react";
import AdminLayout from "../Layouts/AdminLayout";
import awpiiDataFallback from "../../data/awpiiData";
import { COUNTRIES as trackerCountriesFallback } from "../../data/trackerCountries";

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
      // Fetch AWPII
      const awpiiRes = await fetch("http://localhost:3001/api/awpii", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const awpiiJson = await awpiiRes.json();
      
      if (awpiiJson.data && awpiiJson.data.length > 0) {
        setAwpiiData(awpiiJson.data.map(item => ({
          countryKey: item.country,
          score: item.score,
          ...item.details
        })));
      } else {
        // Fallback
        setAwpiiData(awpiiDataFallback.map(item => {
          const { key, overall_score, ...rest } = item;
          return { countryKey: key, score: overall_score, ...rest };
        }));
      }

      // Fetch Tracker
      const trackerRes = await fetch("http://localhost:3001/api/tracker", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const trackerJson = await trackerRes.json();
      
      if (trackerJson.data && trackerJson.data.length > 0) {
        setTrackerData(trackerJson.data.map(item => ({
          countryName: item.country,
          status: item.status,
          ...item.details
        })));
      } else {
        // Fallback
        setTrackerData(trackerCountriesFallback.map(item => {
          const { name, status, ...rest } = item;
          return { countryName: name, status, ...rest };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch data, using fallback", err);
      // Fallback AWPII
      setAwpiiData(awpiiDataFallback.map(item => {
        const { key, overall_score, ...rest } = item;
        return { countryKey: key, score: overall_score, ...rest };
      }));
      // Fallback Tracker
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
      const res = await fetch(`http://localhost:3001/api/awpii/${countryKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ score: Number(score), details: JSON.stringify(details) })
      });
      
      if (!res.ok) throw new Error("Failed to save AWPII score");
      setMessage({ text: "AWPII Score saved successfully", type: "success" });
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`http://localhost:3001/api/tracker/${countryName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ status, details: JSON.stringify(details) })
      });
      
      if (!res.ok) throw new Error("Failed to save Tracker status");
      setMessage({ text: "Tracker status saved successfully", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary">Policy Tracker Management</h1>
          <button onClick={fetchData} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-md mb-6 flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-12">
          {/* Tracker Section */}
          <section>
            <h2 className="text-lg font-bold text-secondary mb-4 border-b pb-2">Regulatory Tracker Status (Countries)</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading Tracker data...</p>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Country</th>
                      <th className="px-4 py-3 font-semibold">Status Indicator</th>
                      <th className="px-4 py-3 font-semibold">Framework</th>
                      <th className="px-4 py-3 font-semibold">Regulator</th>
                      <th className="px-4 py-3 font-semibold">Since</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {trackerData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          {item.flag} {item.countryName}
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={item.status} 
                            onChange={(e) => handleTrackerChange(index, 'status', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-full"
                          >
                            <option value="live">Live</option>
                            <option value="proposed">Proposed</option>
                            <option value="review">In Review</option>
                            <option value="none">No Framework</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.framework || ""} 
                            onChange={(e) => handleTrackerChange(index, 'framework', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-full" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.regulator || ""} 
                            onChange={(e) => handleTrackerChange(index, 'regulator', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-full" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.since || ""} 
                            onChange={(e) => handleTrackerChange(index, 'since', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-full" 
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleSaveTracker(item)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* AWPII Section */}
          <section>
            <h2 className="text-lg font-bold text-secondary mb-4 border-b pb-2">AWPII Scores</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading AWPII data...</p>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Key (ID)</th>
                      <th className="px-4 py-3 font-semibold">Rank</th>
                      <th className="px-4 py-3 font-semibold">Grade</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Momentum</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {awpiiData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          {item.flag} {item.countryKey} ({item.id})
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={item.rank || ""} 
                            onChange={(e) => handleAwpiiChange(index, 'rank', parseInt(e.target.value))}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-16" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.grade || ""} 
                            onChange={(e) => handleAwpiiChange(index, 'grade', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-20" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            step="0.1"
                            value={item.score || ""} 
                            onChange={(e) => handleAwpiiChange(index, 'score', parseFloat(e.target.value))}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-20 font-bold text-accent" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.momentum || ""} 
                            onChange={(e) => handleAwpiiChange(index, 'momentum', e.target.value)}
                            className="border border-input rounded px-2 py-1 bg-transparent text-sm w-full" 
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleSaveAwpii(item)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
