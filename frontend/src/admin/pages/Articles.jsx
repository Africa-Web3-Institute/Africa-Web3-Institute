// src/admin/pages/Articles.jsx
import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, FileText, BookOpen, X, Check, Loader2 } from "lucide-react";
import { articlesApi, blogsApi } from "../../api/api";
import { NEWS_DATA } from "../../pages/News";

export default function Articles() {
  const [activeTab, setActiveTab] = useState("articles"); // "articles" | "blogs"
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Policy",
    author: "AWI Research Fellow",
    authorTitle: "Research Fellow",
    excerpt: "",
    content: "",
    readTime: "5 min read",
    tag: "Analysis",
    featured: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, blogRes] = await Promise.allSettled([
        articlesApi.getAll(),
        blogsApi.getAll(),
      ]);

      if (artRes.status === "fulfilled") {
        const list = artRes.value?.data || (Array.isArray(artRes.value) ? artRes.value : []);
        setArticles(list.length > 0 ? list : NEWS_DATA);
      } else {
        setArticles(NEWS_DATA);
      }

      if (blogRes.status === "fulfilled") {
        const list = blogRes.value?.data || (Array.isArray(blogRes.value) ? blogRes.value : []);
        setBlogs(list);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentList = activeTab === "articles" ? articles : blogs;

  // Filter based on search
  const filtered = currentList.filter((item) =>
    (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${activeTab === "articles" ? "article" : "blog post"}?`)) {
      return;
    }

    try {
      if (activeTab === "articles") {
        await articlesApi.remove(id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        await blogsApi.remove(id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      alert("Failed to delete item: " + (err.message || "Unknown error"));
    }
  };

  // Open modal
  const handleOpenAdd = () => {
    setFormData({
      title: "",
      slug: "",
      category: activeTab === "articles" ? "Policy" : "Stablecoins",
      author: "AWI Research Fellow",
      authorTitle: "Research Fellow",
      excerpt: "",
      content: "",
      readTime: "5 min read",
      tag: "Analysis",
      featured: false,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  // Submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert("Please enter title and slug");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        date: new Date().toISOString().split("T")[0],
      };

      if (activeTab === "articles") {
        const res = await articlesApi.create(payload);
        const created = res?.data || { ...payload, id: Date.now() };
        setArticles((prev) => [created, ...prev]);
      } else {
        const res = await blogsApi.create(payload);
        const created = res?.data || { ...payload, id: Date.now() };
        setBlogs((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to create: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles & Thought Leadership</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage public news, investigative articles, and research blogs
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#D4A017] hover:bg-[#b88a12] text-slate-950 px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} /> New {activeTab === "articles" ? "Article" : "Blog Post"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "articles"
              ? "bg-gray-800 text-[#D4A017] border border-gray-700"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FileText size={16} /> News & Articles ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "blogs"
              ? "bg-gray-800 text-[#D4A017] border border-gray-700"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <BookOpen size={16} /> Thought Leadership Blogs ({blogs.length})
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "articles" ? "articles" : "blogs"}...`}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#D4A017]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A017]" />
              <p className="text-sm">Loading content from database...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Title & Slug</th>
                  <th className="px-6 py-4 font-medium">Category / Tag</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">
                      <div className="flex items-center gap-2">
                        {activeTab === "articles" ? (
                          <FileText size={16} className="text-gray-500 shrink-0" />
                        ) : (
                          <BookOpen size={16} className="text-gray-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-slate-100 font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-400 font-mono">/{activeTab === "articles" ? "news" : "blog"}/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-900 text-gray-300 border border-gray-700">
                        {item.category || item.tag || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-xs">
                      {item.author || "AWI Team"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{item.date}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          item.featured
                            ? "bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {item.featured ? "Featured" : "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No records found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={20} className="text-[#D4A017]" />
                Create New {activeTab === "articles" ? "News Article" : "Blog Post"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. The Future of Stablecoins in Pan-African Settlements"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="future-of-stablecoins-africa"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Policy / Stablecoins / Research"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise summary for cards and search snippets..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Content (Markdown supported)</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed body text, headings with ##, bullet points with * ..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D4A017] focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs text-gray-300">
                  Feature prominently on the page header
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#D4A017] text-slate-950 font-bold text-sm hover:bg-[#b88a12] transition-colors disabled:opacity-60 flex items-center gap-1.5"
                >
                  {submitting ? "Publishing..." : "Publish to Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
