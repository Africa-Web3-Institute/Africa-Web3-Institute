import { useState } from "react";
import { Save } from "lucide-react";

export default function Settings() {
  const [siteName, setSiteName] = useState("Africa Web3 Institute");
  const [contactEmail, setContactEmail] = useState("info@africaweb3institute.org");

  const handleSave = (e) => {
    e.preventDefault();
    // mock save action
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure global application settings</p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-700 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Save size={18} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}