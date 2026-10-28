import { useEffect, useState } from "react";
import {
  Plus, Search, Edit2, Trash2,
  Download, X, ChevronDown, FileText,
  BookOpen, BarChart2, TrendingUp, Calendar, Loader2, Upload,
} from "lucide-react";
import { publicationsApi } from "../../api/api";

// ─── Listings currently built into the public Publications page ───────────
// Used only by the "Import current website listings" button, which saves them to the
// database once so they can be edited here. Status "Published" + available:false keeps them
// looking exactly as they do today ("Coming soon" card).
const L = (category, title, description, date, author, downloadUrl, available) =>
  ({ category, title, description, date, author, downloadUrl, available, status: "Published" });
const LEGACY_LISTINGS = [
  L("State of Web3 Africa", "State of Web3 Africa 2026 — Q1 Report", "A comprehensive review of blockchain adoption, policy developments, and ecosystem growth across 18+ African nations in Q1 2026.", "March 2026", "AWI Research Team", "https://media.base44.com/files/public/69f0c79c7957f32b49dcc978/59df44ac1_Q1Report.pdf", true),
  L("State of Web3 Africa", "State of Web3 Africa 2026 — Q2 Report", "Quarterly intelligence on stablecoin adoption, regulatory changes, and capital flows across African Web3 markets.", "June 2026", "AWI Research Team", "", false),
  L("Policy Brief", "VASP Licensing Frameworks in Anglophone Africa", "Comparative analysis of virtual asset service provider licensing requirements across Nigeria, South Africa, Kenya, Ghana, and Rwanda.", "April 2026", "AWI Policy Team", "", false),
  L("Policy Brief", "Stablecoin Regulation in Francophone Africa", "Policy brief examining the BCEAO and BEAC regional frameworks and their implications for stablecoin adoption across Francophone African nations.", "March 2026", "AWI Policy Team", "", false),
  L("Policy Brief", "CBDCs and Financial Inclusion in Sub-Saharan Africa", "Analysis of active and pilot CBDC programmes across Sub-Saharan Africa and their potential to accelerate financial inclusion.", "February 2026", "AWI Policy Team", "", false),
  L("Policy Brief", "AML/CFT Compliance for African VASPs", "Guidance brief on FATF Travel Rule implementation and AML/CFT obligations for virtual asset service providers operating in African jurisdictions.", "January 2026", "AWI Policy Team", "", false),
  L("Published Articles", "Why Africa Needs Its Own Web3 Policy Framework", "Op-ed examining why African nations must develop indigenous Web3 regulatory frameworks rather than adopting Western models wholesale.", "April 2026", "AWI Executive Director", "", false),
  L("Published Articles", "The Stablecoin Revolution in African Cross-Border Trade", "Analysis of how stablecoins are reshaping intra-African trade settlement and what it means for the AfCFTA digital payment infrastructure.", "March 2026", "AWI Research Team", "", false),
  L("Published Articles", "Binance vs Nigeria: What It Means for African Crypto Regulation", "In-depth analysis of the Nigeria-Binance regulatory standoff and its implications for VASP regulation across the continent.", "January 2026", "AWI Policy Team", "", false),
  L("Published Research", "Africa Web3 Policy & Innovation Index (AWPII) 2025", "The definitive annual ranking of 18+ African nations on Web3 policy readiness, blockchain innovation activity, and digital asset adoption metrics.", "December 2025", "AWI Research Team", "", false),
  L("Published Research", "Blockchain for Agricultural Supply Chains in Africa", "Research paper examining blockchain implementations in African agricultural supply chains with case studies from Kenya, Ghana, and Ethiopia.", "November 2025", "AWI Research Team", "", false),
  L("Published Research", "DeFi Adoption Patterns in Sub-Saharan Africa", "Empirical research on decentralised finance usage patterns, barriers to adoption, and opportunities across Sub-Saharan African markets.", "October 2025", "AWI Research Team", "", false),
];

// The database stores whatever it was given; show a consistent shape.
const STATUS_LIST = ["Published", "Draft", "Review"];
const normStatus = (v) => STATUS_LIST.find((x) => x.toLowerCase() === String(v || "published").toLowerCase()) || "Published";
const norm = (p) => ({
  ...p,
  title: p.title || "",
  author: p.author || "",
  category: p.category || "",
  date: p.date || "",
  description: p.description || "",
  downloadUrl: p.downloadUrl || "",
  status: normStatus(p.status),
  available: Boolean(Number(p.available)),
  downloads: Number(p.downloads) || 0, // counted by the backend when visitors click Download
});
const hasLink = (p) => p.downloadUrl && p.downloadUrl !== "#";

const CATEGORIES = [
  "All Categories",
  "State of Web3 Africa",
  "Monthly African Stablecoin Adoption Report",
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
  "Monthly African Stablecoin Adoption Report": TrendingUp,
  "Policy Brief":            FileText,
  "Published Articles":      BookOpen,
  "Published Research":      FileText,
};

// ─── Modal ─────────────────────────────────────────────────────────────────
function PublicationModal({ publication, onClose, onSave, saving, error }) {
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
    onSave({ ...publication, ...form });
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
              placeholder="https://... (PDF or page). Leave empty if not ready"
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

          {error && (
            <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 text-red-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

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
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#D4A017" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Publication"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────
function DeleteConfirm({ publication, onClose, onConfirm, error }) {
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
        {error && <p role="alert" className="text-red-400 text-xs text-center mb-4">{error}</p>}
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

// ─── Publication Card (mobile) ───────────────────────────────────────────
function PublicationCard({ pub, onEdit, onDelete }) {
  const ss = STATUS_STYLES[pub.status] || STATUS_STYLES.Draft;
  const Icon = CATEGORY_ICONS[pub.category] || FileText;

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: "rgba(212,160,23,0.12)" }}
        >
          <Icon size={14} style={{ color: "#D4A017" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-snug">
            {pub.title}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{pub.author}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400">{pub.category}</span>
        <span className="text-gray-600">•</span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
          {pub.status}
        </span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1 text-gray-400">
          <Calendar size={11} />
          {pub.date}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-700/50">
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          {pub.available && hasLink(pub) ? (
            <>
              <Download size={12} />
              <span>{pub.downloads.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(pub)}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(pub)}
            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminPublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [importing, setImporting] = useState(false);

  const listFrom = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
  const load = async () => {
    try {
      const res = await publicationsApi.getAll();
      setPublications(listFrom(res).map(norm));
      setLoadError("");
    } catch (err) {
      setLoadError(err.message || "Could not load publications.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

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

  const payloadOf = (pub) => ({
    title: pub.title.trim(),
    description: pub.description || "",
    category: pub.category,
    author: pub.author || "",
    status: pub.status,
    date: pub.date || "",
    available: pub.available ? 1 : 0,
    downloadUrl: (pub.downloadUrl || "").trim(),
  });

  const handleSave = async (pub) => {
    setFormError("");
    if (!pub.title.trim()) return setFormError("Please add a title.");
    const url = (pub.downloadUrl || "").trim();
    if (url && !/^(https?:\/\/|\/)/i.test(url) && url !== "#") return setFormError("The download address must start with https:// (or /).");
    setSaving(true);
    try {
      if (pub.id) {
        await publicationsApi.update(pub.id, payloadOf(pub));
        setPublications(prev => prev.map(p => (p.id === pub.id ? norm({ ...p, ...payloadOf(pub) }) : p)));
      } else {
        await publicationsApi.create(payloadOf(pub));
        await load(); // the server does not return the new row, so reload to get its id
      }
      setModal(null);
    } catch (err) {
      setFormError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setFormError("");
    try {
      await publicationsApi.remove(id);
      setPublications(prev => prev.filter(p => p.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      setFormError((err.message || "Could not delete.") + " (Only super-admins can delete.)");
    }
  };

  // One-time: save the listings currently built into the public page, skipping any already present.
  const handleImport = async () => {
    const have = new Set(publications.map(p => p.title.trim().toLowerCase()));
    const todo = LEGACY_LISTINGS.filter(l => !have.has(l.title.toLowerCase()));
    if (!todo.length) return setNotice("Everything is already imported.");
    if (!window.confirm(`Save ${todo.length} listings from the current website into the database?`)) return;
    setImporting(true);
    setNotice("");
    let done = 0;
    try {
      for (const l of todo) {
        await publicationsApi.create(payloadOf(l));
        done += 1;
      }
      setNotice(`Imported ${done} listings. Review them below, then ask to remove the built-in list from the website code.`);
    } catch (err) {
      setNotice(`Stopped after ${done} of ${todo.length}: ${err.message || "error"}`);
    } finally {
      setImporting(false);
      await load();
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">Publications</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage all AWI publications, reports, and research documents
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={handleImport}
          disabled={importing || loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50"
          title="Save the listings currently built into the public page, so you can edit them here"
        >
          <Upload size={16} />
          {importing ? "Importing…" : "Import current website listings"}
        </button>
        <button
          onClick={() => { setFormError(""); setModal({ mode: "add" }); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors w-full sm:w-auto"
          style={{ backgroundColor: "#D4A017" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
        >
          <Plus size={16} />
          Add Publication
        </button>
        </div>
      </div>

      {notice && (
        <div role="status" className="rounded-lg border border-gray-700 bg-gray-900 text-gray-300 text-sm px-4 py-3">{notice}</div>
      )}
      {loadError && (
        <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 text-red-300 text-sm px-4 py-3">{loadError}</div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Published", value: published, color: "#10b981" },
          { label: "In Review", value: inReview, color: "#D4A017" },
          { label: "Drafts", value: drafts, color: "#6b7280" },
          { label: "Total Downloads", value: publications.reduce((sum, p) => sum + p.downloads, 0).toLocaleString(), color: "#3b82f6" },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
          >
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center p-4 rounded-xl"
        style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}
      >
        {/* Search */}
        <div className="relative w-full md:flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search publications..."
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Category filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-600 appearance-none"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-600 appearance-none"
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <p className="text-gray-500 text-xs ml-auto hidden md:block">
          {filtered.length} of {publications.length} publications
        </p>
      </div>

      {/* ─── Table (desktop) ───────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden hidden md:block"
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
                    {loading ? "Loading…" : publications.length ? "No publications match your filters." : "No publications yet. Click “Add Publication”, or import the current website listings."}
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
                        {pub.available && hasLink(pub) ? (
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
                            onClick={() => { setFormError(""); setModal({ mode: "edit", data: pub }); }}
                            aria-label={`Edit ${pub.title}`}
                            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => { setFormError(""); setDeleteTarget(pub); }}
                            aria-label={`Delete ${pub.title}`}
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

      {/* ─── Cards (mobile) ────────────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            {loading ? "Loading…" : "No publications match your filters."}
          </div>
        ) : (
          filtered.map(pub => (
            <PublicationCard
              key={pub.id}
              pub={pub}
              onEdit={pub => { setFormError(""); setModal({ mode: "edit", data: pub }); }}
              onDelete={setDeleteTarget}
            />
          ))
        )}
        <p className="text-gray-500 text-xs text-center pt-2">
          {filtered.length} of {publications.length} publications
        </p>
      </div>

      {/* Modals */}
      {modal && (
        <PublicationModal
          publication={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
          error={formError}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          publication={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          error={formError}
        />
      )}
    </div>
  );
}