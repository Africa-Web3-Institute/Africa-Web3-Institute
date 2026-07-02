import { useState, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2,
  Download, Eye, X, ChevronDown, FileText,
  BookOpen, BarChart2, TrendingUp, Calendar,
} from "lucide-react";

// Removed mock data array

const CATEGORIES = [
  "All Categories",
  "State of Web3 Africa",
  "Monthly Stablecoin Report",
  "Policy Brief",
  "Published Articles",
  "Published Research",
];

const STATUSES = ["All Statuses", "Published", "Draft", "Review"];

const STATUS_STYLES = {
  Published: { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
  Draft:     { bg: "bg-gray-800",  text: "text-gray-400",  dot: "bg-gray-400"  },
  Review:    { bg: "bg-yellow-950",text: "text-yellow-400",dot: "bg-yellow-400" },
};

const CATEGORY_ICONS = {
  "State of Web3 Africa":    BarChart2,
  "Monthly Stablecoin Report": TrendingUp,
  "Policy Brief":            FileText,
  "Published Articles":      BookOpen,
  "Published Research":      FileText,
};

// ─── Modal ─────────────────────────────────────────────────────────────────
function PublicationModal({ publication, onClose, onSave }) {
  const isEdit = !!publication?.id;
  const [form, setForm] = useState({
    title: publication?.title || "",
    category: publication?.category || "Policy Brief",
    status: publication?.status || "Draft",
    date: publication?.date || "",
    author: publication?.author || "",
    available: publication?.available || false,
    downloadUrl: publication?.downloadUrl || "",
    description: publication?.description || "",
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...publication, ...form, id: publication?.id || Date.now() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#1f2937" }}
        >
          <h2 className="text-white font-semibold">
            {isEdit ? "Edit Publication" : "Add Publication"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => set("title", e.target.value)}
              required
              placeholder="Publication title"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Brief description of the publication"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600 resize-none"
            />
          </div>

          {/* Category + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
              >
                {CATEGORIES.slice(1).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={form.status}
                onChange={e => set("status", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
              >
                {STATUSES.slice(1).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Author + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Author
              </label>
              <input
                value={form.author}
                onChange={e => set("author", e.target.value)}
                placeholder="e.g. AWI Research Team"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Date
              </label>
              <input
                value={form.date}
                onChange={e => set("date", e.target.value)}
                placeholder="e.g. May 2026"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
              />
            </div>
          </div>

          {/* Download URL */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Download URL
            </label>
            <input
              value={form.downloadUrl}
              onChange={e => set("downloadUrl", e.target.value)}
              placeholder="https://... or leave empty"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600"
            />
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-white font-medium">Available for download</p>
              <p className="text-xs text-gray-500">Show download button on public site</p>
            </div>
            <button
              type="button"
              onClick={() => set("available", !form.available)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ backgroundColor: form.available ? "#D4A017" : "#374151" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.available ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {isEdit ? "Save Changes" : "Add Publication"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────
function DeleteConfirm({ publication, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
      >
        <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-center mb-2">Delete Publication</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{publication.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(publication.id)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminPublications() {
  const [publications, setPublications] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", data?: pub }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3001';
  const token = localStorage.getItem("awi_admin_token");

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/publications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setPublications(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filtered = publications.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = categoryFilter === "All Categories" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All Statuses" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  // Stats
  const published = publications.filter(p => p.status === "Published").length;
  const drafts = publications.filter(p => p.status === "Draft").length;
  const inReview = publications.filter(p => p.status === "Review").length;
  const totalDownloads = publications.reduce((sum, p) => sum + p.downloads, 0);

  const handleSave = async (pub) => {
    try {
      const isEdit = !!pub.id;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/api/publications/${pub.id}` : `${API_URL}/api/publications`;
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(pub)
      });
      
      if (res.ok) {
        fetchPublications();
        setModal(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/publications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        setDeleteTarget(null);
      } else {
        alert("Failed to delete publication. Only superadmins can delete.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Publications</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage all AWI publications, reports, and research documents
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#D4A017" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
        >
          <Plus size={16} />
          Add Publication
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Published", value: published, color: "#10b981" },
          { label: "In Review", value: inReview, color: "#D4A017" },
          { label: "Drafts", value: drafts, color: "#6b7280" },
          { label: "Total Downloads", value: totalDownloads.toLocaleString(), color: "#3b82f6" },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
          >
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 items-center p-4 rounded-xl"
        style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search publications..."
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-600 appearance-none"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-600 appearance-none"
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <p className="text-gray-500 text-xs ml-auto">
          {filtered.length} of {publications.length} publications
        </p>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "700px" }}>
            <thead>
              <tr
                className="text-left border-b"
                style={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
              >
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500">Title</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500">Date</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500 text-center">Downloads</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-500 text-sm">
                    No publications match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((pub, i) => {
                  const ss = STATUS_STYLES[pub.status] || STATUS_STYLES.Draft;
                  const Icon = CATEGORY_ICONS[pub.category] || FileText;
                  return (
                    <tr
                      key={pub.id}
                      className="border-b transition-colors"
                      style={{
                        borderColor: "#1f2937",
                        backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(212,160,23,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
                    >
                      {/* Title */}
                      <td className="px-5 py-4" style={{ maxWidth: "280px" }}>
                        <div className="flex items-start gap-3">
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: "rgba(212,160,23,0.12)" }}
                          >
                            <Icon size={13} style={{ color: "#D4A017" }} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                              {pub.title}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">{pub.author}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{pub.category}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {pub.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs whitespace-nowrap">
                          <Calendar size={11} />
                          {pub.date}
                        </div>
                      </td>

                      {/* Downloads */}
                      <td className="px-5 py-4 text-center">
                        {pub.available ? (
                          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs">
                            <Download size={11} />
                            {pub.downloads.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setModal({ mode: "edit", data: pub })}
                            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-gray-500 hover:text-blue-400 hover:bg-gray-700 transition-colors"
                            title="Preview"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(pub)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <PublicationModal
          publication={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          publication={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}