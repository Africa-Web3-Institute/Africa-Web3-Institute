import { useState } from "react";
import { Search, Edit2, Trash2, Plus, BarChart2 } from "lucide-react";

const MOCK_DATA = [
  { id: 1, country: "European Union", status: "Live", framework: "MiCA" },
  { id: 2, country: "United Kingdom", status: "In Review", framework: "FSMA 2023" },
  { id: 3, country: "UAE", status: "Live", framework: "VARA" },
];

export default function RegulatoryTracker() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Regulatory Tracker</h1>
          <p className="text-gray-400 text-sm mt-1">Global framework mapping</p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Add Framework
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search regions..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Jurisdiction</th>
                <th className="px-6 py-4 font-medium">Framework</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MOCK_DATA.map(row => (
                <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                    <BarChart2 size={14} className="text-gray-500" /> {row.country}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{row.framework}</td>
                  <td className="px-6 py-4 text-gray-300">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      row.status === 'Live' ? 'bg-green-900/50 text-green-400' :
                      'bg-purple-900/50 text-purple-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
