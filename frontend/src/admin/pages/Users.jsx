import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, X, Users as UsersIcon } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const API_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3001';
  const token = localStorage.getItem("awi_admin_token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setUsers(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      name: formData.get("name"),
      role: formData.get("role")
    };
    
    // Only include password if provided
    const pwd = formData.get("password");
    if (pwd) data.password = pwd;

    try {
      const isEdit = !!modal.id;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/api/admin/users/${modal.id}` : `${API_URL}/api/admin/users`;
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        fetchUsers();
        setModal(null);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to save user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(e => e.id !== id));
        setDeleteTarget(null);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-yellow-500" />
            User Management
          </h1>
          <p className="text-gray-400 mt-1">Manage admin and editor accounts</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[calc(100vh-200px)]">
        <div className="p-4 border-b border-gray-800 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
                <th className="px-6 py-3 font-medium text-gray-400">Name</th>
                <th className="px-6 py-3 font-medium text-gray-400">Email</th>
                <th className="px-6 py-3 font-medium text-gray-400">Role</th>
                <th className="px-6 py-3 font-medium text-gray-400">Created At</th>
                <th className="px-6 py-3 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${
                        u.role === "superadmin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setModal(u)}
                        className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-md transition-colors mr-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
              <h3 className="font-semibold text-lg">{modal.id ? "Edit" : "Add"} User</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={modal.email}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  name="name"
                  defaultValue={modal.name}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <select
                  name="role"
                  defaultValue={modal.role || "editor"}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                >
                  <option value="editor">Editor</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password {modal.id && "(Leave blank to keep current)"}</label>
                <input
                  name="password"
                  type="password"
                  required={!modal.id}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete User?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete {deleteTarget.email}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
