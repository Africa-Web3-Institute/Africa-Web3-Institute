// src/admin/pages/Articles.jsx
// Admin: write articles and blog posts with the block editor. Saves through the existing
// articlesApi / blogsApi, so the public site shows them as soon as they are published.
import { useEffect, useState } from "react";
import { Search, Edit2, Trash2, Plus, FileText, BookOpen, ArrowLeft, Loader2, Eye, PenLine } from "lucide-react";
import { articlesApi, blogsApi } from "../../api/api";
import BlockEditor from "../../components/BlockEditor";
import BlockRenderer from "../../components/BlockRenderer";
import { parseContent, serializeBlocks, estimateReadTime, autoExcerpt, newBlock } from "../../lib/blocks";

// The current backend list endpoints hide drafts, so a saved draft would vanish from this screen.
// Flip to true once the backend lists drafts for logged-in admins (see the notes shipped with this file).
const BACKEND_LISTS_DRAFTS = false;

const getId = (i) => i?.id ?? i?._id;
const listOf = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const today = () => new Date().toISOString().split("T")[0];
const isLive = (kind, i) => (kind === "blogs" ? i.isPublished === undefined || Boolean(Number(i.isPublished)) : i.status !== "draft");

const CATEGORIES = ["Policy", "Research", "Analysis", "Stablecoins", "Regulation", "Announcement", "Published Articles", "Thought Leadership"];
const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4A017]";
const labelCls = "block text-xs font-semibold text-gray-300 mb-1";

const blank = (kind) => ({
  title: "",
  slug: "",
  slugTouched: false,
  category: kind === "blogs" ? "Thought Leadership" : "Policy",
  author: "AWI Research Fellow",
  authorRole: "Research Fellow",
  excerpt: "",
  image: "",
  date: today(),
  readTime: "",
  featured: false,
  published: true,
});

function Editor({ kind, item, onClose, onSaved }) {
  const editing = Boolean(item);
  const [form, setForm] = useState(() =>
    item
      ? {
          title: item.title || "",
          slug: item.slug || "",
          slugTouched: true,
          category: item.category || "Policy",
          author: item.author || "",
          authorRole: item.authorRole || "",
          excerpt: item.excerpt || "",
          image: item.image || item.coverImage || "",
          date: (item.date || today()).slice(0, 10),
          readTime: item.readTime || "",
          featured: Boolean(Number(item.featured)),
          published: isLive(kind, item),
        }
      : blank(kind)
  );
  const [blocks, setBlocks] = useState(() => (item ? parseContent(item.content) : [newBlock("paragraph")]));
  const [mode, setMode] = useState("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    setError("");
    if (!form.title.trim()) return setError("Please add a title.");
    const slug = form.slug.trim() || slugify(form.title);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return setError("Slug can only use lowercase letters, numbers and dashes.");
    const content = serializeBlocks(blocks);
    if (!JSON.parse(content).blocks.length) return setError("Add some content before saving.");
    if (kind === "blogs" && !form.author.trim()) return setError("Blog posts need an author.");

    const live = BACKEND_LISTS_DRAFTS ? form.published : true;
    const common = {
      ...(item || {}), // update replaces every column, so send back what we are not editing
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || autoExcerpt(blocks),
      content,
      category: form.category,
      author: form.author.trim(),
      authorRole: form.authorRole.trim(),
      date: form.date,
      readTime: form.readTime.trim() || estimateReadTime(blocks),
      featured: form.featured ? 1 : 0,
    };
    const payload =
      kind === "blogs"
        ? { ...common, coverImage: form.image.trim(), isPublished: live ? 1 : 0 }
        : { ...common, image: form.image.trim(), status: live ? "published" : "draft", available: 1, type: item?.type || "article" };

    setSaving(true);
    try {
      const api = kind === "blogs" ? blogsApi : articlesApi;
      const res = editing ? await api.update(getId(item), payload) : await api.create(payload);
      const created = res?.data && typeof res.data === "object" ? res.data : null;
      onSaved(editing ? { ...payload, id: getId(item) } : created || { ...payload, id: Date.now() });
    } catch (err) {
      setError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={16} /> Back to list
        </button>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-700 overflow-hidden text-sm">
            <button onClick={() => setMode("write")} className={`px-3 py-1.5 flex items-center gap-1.5 ${mode === "write" ? "bg-gray-800 text-[#D4A017]" : "text-gray-400"}`}>
              <PenLine size={14} /> Write
            </button>
            <button onClick={() => setMode("preview")} className={`px-3 py-1.5 flex items-center gap-1.5 ${mode === "preview" ? "bg-gray-800 text-[#D4A017]" : "text-gray-400"}`}>
              <Eye size={14} /> Preview
            </button>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#D4A017] text-slate-950 font-bold text-sm hover:bg-[#b88a12] disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-800 bg-red-950/50 text-red-300 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {mode === "preview" ? (
        <div className="bg-white rounded-xl p-8 max-w-3xl mx-auto text-slate-900" data-testid="preview">
          <p className="text-sm text-slate-500 mb-2">{form.category} · {form.date} · {form.readTime || estimateReadTime(blocks)}</p>
          <h1 className="text-3xl font-bold mb-3">{form.title || "Untitled"}</h1>
          {form.author && <p className="text-sm text-slate-500 mb-6">By {form.author}{form.authorRole ? `, ${form.authorRole}` : ""}</p>}
          {form.image && <img src={form.image} alt="" className="rounded-xl mb-6 w-full" />}
          <BlockRenderer blocks={blocks} />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4 min-w-0">
            <div>
              <label className={labelCls} htmlFor="f-title">Title *</label>
              <input
                id="f-title"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  set({ title, ...(form.slugTouched ? {} : { slug: slugify(title) }) });
                }}
                placeholder="e.g. The Future of Stablecoins in Pan-African Settlements"
                className={`${inputCls} text-lg font-semibold`}
              />
            </div>
            <BlockEditor value={blocks} onChange={setBlocks} />
          </div>

          <aside className="space-y-4 bg-gray-900 border border-gray-800 rounded-xl p-4 h-fit">
            <div>
              <label className={labelCls} htmlFor="f-slug">Web address (slug)</label>
              <input id="f-slug" value={form.slug} onChange={(e) => set({ slug: e.target.value, slugTouched: true })} className={`${inputCls} font-mono text-xs`} />
              <p className="text-[11px] text-gray-500 mt-1">/{kind === "blogs" ? "blog" : "news"}/{form.slug || "…"}</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="f-cat">Category</label>
              <input id="f-cat" list="cats" value={form.category} onChange={(e) => set({ category: e.target.value })} className={inputCls} />
              <datalist id="cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="f-ex">Summary (cards & Google)</label>
              <textarea id="f-ex" rows={3} value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="Leave empty to use the first paragraph" className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="f-img">Cover image address</label>
              <input id="f-img" value={form.image} onChange={(e) => set({ image: e.target.value })} placeholder="https://…" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="f-author">Author</label>
                <input id="f-author" value={form.author} onChange={(e) => set({ author: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-role">Role</label>
                <input id="f-role" value={form.authorRole} onChange={(e) => set({ authorRole: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="f-date">Date</label>
                <input id="f-date" type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-rt">Read time</label>
                <input id="f-rt" value={form.readTime} onChange={(e) => set({ readTime: e.target.value })} placeholder={estimateReadTime(blocks)} className={inputCls} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} /> Feature prominently
            </label>
            {BACKEND_LISTS_DRAFTS && (
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} /> Published (untick to keep as draft)
              </label>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default function Articles() {
  const [tab, setTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null); // { item|null }

  useEffect(() => {
    (async () => {
      const [a, b] = await Promise.allSettled([articlesApi.getAll(), blogsApi.getAll()]);
      if (a.status === "fulfilled") setArticles(listOf(a.value));
      if (b.status === "fulfilled") setBlogs(listOf(b.value));
      if (a.status === "rejected" && b.status === "rejected") setLoadError(a.reason?.message || "Could not load content.");
      setLoading(false);
    })();
  }, []);

  const list = tab === "articles" ? articles : blogs;
  const setList = tab === "articles" ? setArticles : setBlogs;
  const q = search.toLowerCase();
  const filtered = list.filter((i) => (i.title || "").toLowerCase().includes(q) || (i.category || "").toLowerCase().includes(q));

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await (tab === "articles" ? articlesApi : blogsApi).remove(getId(item));
      setList((p) => p.filter((x) => String(getId(x)) !== String(getId(item))));
    } catch (err) {
      alert("Could not delete: " + (err.message || "unknown error") + "\n(Only super-admins can delete.)");
    }
  };

  if (editor) {
    return (
      <Editor
        key={getId(editor.item) ?? "new"}
        kind={tab}
        item={editor.item}
        onClose={() => setEditor(null)}
        onSaved={(saved) => {
          setList((prev) =>
            editor.item
              ? prev.map((x) => (String(getId(x)) === String(getId(editor.item)) ? { ...x, ...saved } : x))
              : [saved, ...prev]
          );
          setEditor(null);
        }}
      />
    );
  }

  const noun = tab === "articles" ? "Article" : "Blog Post";
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles & Blog</h1>
          <p className="text-gray-400 text-sm mt-1">Write with blocks. Published items appear on the public site.</p>
        </div>
        <button onClick={() => setEditor({ item: null })} className="flex items-center gap-2 bg-[#D4A017] hover:bg-[#b88a12] text-slate-950 px-4 py-2 rounded-lg font-semibold">
          <Plus size={18} /> New {noun}
        </button>
      </div>

      <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
        {[["articles", "Articles", FileText, articles.length], ["blogs", "Blog posts", BookOpen, blogs.length]].map(([k, label, Icon, n]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${tab === k ? "bg-gray-800 text-[#D4A017] border border-gray-700" : "text-gray-400 hover:text-white"}`}>
            <Icon size={16} /> {label} ({n})
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#D4A017]" />
          </div>
        </div>
        {loading ? (
          <div className="py-16 text-center text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A017]" /></div>
        ) : loadError ? (
          <p className="py-12 text-center text-red-300 text-sm">{loadError}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4">Title</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Author</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((i) => (
                  <tr key={getId(i)} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4"><p className="text-slate-100 font-semibold">{i.title}</p><p className="text-xs text-gray-400 font-mono">/{tab === "blogs" ? "blog" : "news"}/{i.slug}</p></td>
                    <td className="px-6 py-4 text-gray-300 text-xs">{i.category || "—"}</td>
                    <td className="px-6 py-4 text-gray-300 text-xs">{i.author || "—"}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{(i.date || "").slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${isLive(tab, i) ? "bg-green-950 text-green-400" : "bg-gray-700 text-gray-300"}`}>{isLive(tab, i) ? "Published" : "Draft"}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => setEditor({ item: i })} aria-label={`Edit ${i.title}`} title="Edit" className="text-gray-400 hover:text-[#D4A017]"><Edit2 size={16} /></button>
                      <button onClick={() => remove(i)} aria-label={`Delete ${i.title}`} title="Delete" className="text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">{list.length ? "Nothing matches your search." : `No ${noun.toLowerCase()}s yet. Click “New ${noun}” to write the first one.`}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
