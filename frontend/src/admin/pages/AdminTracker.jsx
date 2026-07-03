import { useState, useEffect } from "react";
import { Search, Edit2, Plus, X, BarChart2 } from "lucide-react";

export default function AdminTracker() {
  const [trackerList, setTrackerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const API_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3001';
  const token = localStorage.getItem("awi_admin_token");

  useEffect(() => {
    fetchTrackerList();
  }, []);

  const fetchTrackerList = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tracker`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setTrackerList(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const country = formData.get("country");
    const status = formData.get("status");
    const details = formData.get("details");

    try {
      const res = await fetch(`${API_URL}/api/tracker/${country}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, details })
      });
      if (res.ok) {
        fetchTrackerList();
        setModal(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = trackerList.filter(s => s.country.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-yellow-500" />
            Regulatory Tracker
          </h1>
          <p className="text-gray-400 mt-1">Manage country regulatory statuses</p>
        </div>
        <button
          onClick={() => setModal({ country: "", status: "Friendly", details: "" })}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Country
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[calc(100vh-200px)]">
        <div className="p-4 border-b border-gray-800 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-800/50 sticky top-0">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-400">Country</th>
                <th className="px-6 py-3 font-medium text-gray-400">Status</th>
                <th className="px-6 py-3 font-medium text-gray-400">Details</th>
                <th className="px-6 py-3 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No data found</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.country} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{s.country}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md ${
                        s.status === "Friendly" ? "bg-green-500/20 text-green-400" :
                        s.status === "Hostile" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 truncate max-w-[300px]">{s.details}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setModal(s)}
                        className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="font-semibold text-lg">{modal.country ? "Edit" : "Add"} Country</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input
                  name="country"
                  defaultValue={modal.country}
                  readOnly={!!modal.country}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 read-only:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={modal.status}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                >
                  <option value="Friendly">Friendly</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Hostile">Hostile</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Details</label>
                <textarea
                  name="details"
                  defaultValue={modal.details}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors">Save Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
