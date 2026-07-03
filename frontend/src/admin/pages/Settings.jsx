import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3001';
  const token = localStorage.getItem("awi_admin_token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setSettings(json.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const data = {
      siteName: formData.get("siteName"),
      contactEmail: formData.get("contactEmail"),
      maintenanceMode: formData.get("maintenanceMode") === "on" ? "true" : "false"
    };

    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Settings saved successfully");
        fetchSettings();
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-yellow-500" />
          System Settings
        </h1>
        <p className="text-gray-400 mt-1">Configure global application settings</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
              <input
                name="siteName"
                defaultValue={settings.siteName || "Africa Web3 Institute"}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Email</label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={settings.contactEmail || "info@africaweb3institute.org"}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                defaultChecked={settings.maintenanceMode === "true"}
                className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500 focus:ring-offset-gray-900"
              />
              <span className="text-sm font-medium text-gray-300">Enable Maintenance Mode</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">When enabled, public visitors will see a maintenance page.</p>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-gray-900 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}