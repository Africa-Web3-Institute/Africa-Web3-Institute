import { useState } from "react";
import { Search, Edit2, Trash2, Plus, Users as UsersIcon } from "lucide-react";

const MOCK_DATA = [
  { id: 1, name: "Superadmin", email: "admin@africaweb3institute.org", role: "superadmin", lastActive: "Just now" },
  { id: 2, name: "Editor A", email: "editorA@africaweb3institute.org", role: "editor", lastActive: "2 hours ago" },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage admin access and roles</p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Invite User
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MOCK_DATA.map(row => (
                <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                    <UsersIcon size={14} className="text-gray-500" /> {row.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{row.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      row.role === 'superadmin' ? 'bg-purple-900/50 text-purple-400' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{row.lastActive}</td>
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
