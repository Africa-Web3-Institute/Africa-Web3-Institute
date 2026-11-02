import { useState, useEffect } from "react";
import {
  FileText,
  BookOpen,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  publicationsApi,
  articlesApi,
  blogsApi,
  enforcementApi,
  awpiiApi,
  trackerApi,
  analyticsApi,
} from "../../api/api";

// "Reports" no longer has its own admin page: reports are Publications in the
// "State of Web3 Africa" / "Monthly African Stablecoin Adoption Report" categories.
const QUICK_ACTIONS = [
  { label: "Add Publication or Report", href: "/admin/adminpublications", icon: BookOpen, color: "#D4A017" },
  { label: "Write Article or Blog Post", href: "/admin/articles", icon: FileText, color: "#3b82f6" },
  { label: "Add Enforcement Event", href: "/admin/enforcement", icon: TrendingUp, color: "#ef4444" },
];

// GET /api/analytics needs the admin login but is not in api.js, so it is called here.
// Same base address as the live feed (analyticsApi.sseUrl() is `${API_BASE}/live`).
// No redirect on 401: that card just shows "Couldn't load".
async function adminGet(path) {
  let token = null;
  try {
    token = JSON.parse(localStorage.getItem("awi_admin_user"))?.token || null;
  } catch {
    /* no stored login */
  }
  const base = analyticsApi.sseUrl().replace(/\/live$/, "");
  const res = await fetch(`${base}${path}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const rowsOf = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null);

// SQLite timestamps look like "2026-10-21 09:15:00" (UTC, no zone). Free-text dates are ignored.
const toTime = (v) => {
  if (!v || typeof v !== "string") return 0;
  if (!/^\d{4}-\d{2}-\d{2}/.test(v)) return 0;
  const iso = v.includes("T") ? v : v.replace(" ", "T");
  const t = Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + "Z");
  return Number.isNaN(t) ? 0 : t;
};
const ago = (t) => {
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    publications: null,
    articles: null,
    blogs: null,
    enforcement: null,
    awpii: null,
    tracker: null,
    subscribers: null,
  });

  // Live visitor numbers: the backend streams them (Server-Sent Events) from /api/live.
  // "Active" there means a visitor whose browser pinged in the last 30 seconds.
  const [live, setLive] = useState(null);
  const [liveState, setLiveState] = useState("connecting"); // connecting | ok | error

  useEffect(() => {
    if (typeof EventSource === "undefined") {
      setLiveState("error");
      return undefined;
    }
    let es;
    try {
      es = new EventSource(analyticsApi.sseUrl());
    } catch {
      setLiveState("error");
      return undefined;
    }
    const pick = (m) =>
      m ? { activeUsers: m.activeUsers, totalSessions: m.totalSessions, totalPageViews: m.totalPageViews } : null;
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const metrics = msg.type === "init" ? msg.data?.metrics : msg.type === "metrics" ? msg.data : null;
        if (metrics) {
          setLive(pick(metrics));
          setLiveState("ok");
        }
      } catch {
        /* ignore a malformed message */
      }
    };
    es.onerror = () => setLiveState((s) => (s === "ok" ? s : "error")); // the browser reconnects by itself
    return () => es.close();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      // Each call is independent -- one endpoint failing shouldn't blank
      // out the cards that did load successfully.
      const safe = (label, p) =>
        p.then(rowsOf).catch((err) => {
          console.error(`Failed to load ${label}`, err);
          return null;
        });
      const [publications, articles, blogs, enforcement, awpii, tracker, subscribers] = await Promise.all([
        safe("publications", publicationsApi.getAll()),
        safe("articles", articlesApi.getAll()),
        safe("blogs", blogsApi.getAll()),
        safe("enforcement events", enforcementApi.getAll()),
        safe("AWPII data", awpiiApi.getAll()),
        safe("tracker data", trackerApi.getAll()),
        // GET /api/analytics (login required) -> { report: { totalSubscribers, ... } } = active subscribers
        adminGet("/analytics")
          .then((r) => (Number.isFinite(Number(r?.report?.totalSubscribers)) ? Number(r.report.totalSubscribers) : null))
          .catch((err) => {
            console.error("Failed to load newsletter report", err);
            return null;
          }),
      ]);
      if (cancelled) return;
      setData({ publications, articles, blogs, enforcement, awpii, tracker, subscribers });
      setLoading(false);
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());
  const count = (list) => (list === null ? null : list.length);

  const allFailed = !loading && Object.values(data).every((v) => v === null);
  const connected = !loading && !allFailed;

  // Real total from publications.downloads (incremented by GET /api/publications/:id/download)
  const totalDownloads =
    data.publications === null
      ? null
      : data.publications.reduce((sum, p) => sum + (Number(p.downloads) || 0), 0);

  const STATS = [
    {
      label: "Total Publications",
      value: loading ? null : fmt(count(data.publications)),
      sub: data.publications === null && !loading ? "Couldn't load" : null,
      icon: BookOpen,
      color: "#D4A017",
    },
    {
      label: "Articles Published",
      value: loading ? null : fmt(count(data.articles)),
      sub:
        data.articles === null && !loading
          ? "Couldn't load"
          : data.blogs !== null && !loading
          ? `+ ${data.blogs.length} blog post${data.blogs.length === 1 ? "" : "s"}`
          : null,
      icon: FileText,
      color: "#3b82f6",
    },
    {
      label: "Report Downloads",
      value: loading ? null : fmt(totalDownloads),
      sub: data.publications === null && !loading ? "Couldn't load" : null,
      icon: Download,
      color: "#10b981",
    },
    {
      label: "Active Now",
      value: liveState === "connecting" ? null : liveState === "ok" ? fmt(live?.activeUsers) : "—",
      sub:
        liveState === "ok"
          ? `Last 30 sec · ${fmt(live?.totalSessions)} sessions · ${fmt(live?.totalPageViews)} page views`
          : liveState === "error"
          ? "Live feed unavailable"
          : null,
      live: liveState === "ok",
      icon: Users,
      color: "#8b5cf6",
    },
  ];

  const OVERVIEW = [
    { label: "Countries Tracked", value: loading ? null : fmt(count(data.tracker)), sub: "Regulatory Tracker" },
    { label: "Enforcement Events", value: loading ? null : fmt(count(data.enforcement)), sub: "Enforcement Watch" },
    { label: "AWPII Nations", value: loading ? null : fmt(count(data.awpii)), sub: "Policy Index" },
    {
      label: "Newsletter Subs",
      value: loading ? null : fmt(data.subscribers),
      sub: data.subscribers === null && !loading ? "Couldn't load" : "Active subscribers",
    },
  ];

  // Real "recently updated" list built from the content tables (there is no activity-log endpoint).
  const recent = [
    ...(data.publications || []).map((r) => ({ kind: "Publication", title: r.title, t: toTime(r.updatedAt) || toTime(r.createdAt), href: "/admin/adminpublications" })),
    ...(data.articles || []).map((r) => ({ kind: "Article", title: r.title, t: toTime(r.updatedAt) || toTime(r.createdAt), href: "/admin/articles" })),
    ...(data.blogs || []).map((r) => ({ kind: "Blog post", title: r.title, t: toTime(r.updatedAt) || toTime(r.publishedAt) || toTime(r.createdAt), href: "/admin/articles" })),
  ]
    .filter((r) => r.title && r.t)
    .sort((a, b) => b.t - a.t)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {allFailed && (
        <div role="alert" className="rounded-xl border border-red-800 bg-red-950/50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-300 text-sm font-semibold">Can't reach the backend</p>
            <p className="text-red-300/80 text-xs mt-1">
              None of the dashboard data could be loaded. Check that the API is running and that
              VITE_API_URL points to it.
            </p>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div
        className="rounded-xl px-6 py-5 flex items-center justify-between"
        style={{ backgroundColor: "#0B1437", border: "1px solid #1e3a5f" }}
      >
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#D4A017" }}>
            Africa Web3 Institute
          </p>
          <h2 className="text-white text-xl font-bold">Welcome back!</h2>
          <p className="text-gray-400 text-sm mt-1">Here's what's happening with your platform today.</p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={
              allFailed
                ? { backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }
                : { backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }
            }
          >
            <span className={`w-1.5 h-1.5 rounded-full ${allFailed ? "bg-red-400" : "bg-yellow-400 animate-pulse"}`} />
            {loading ? "Connecting…" : connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-5" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
              </div>

              <p className="text-white text-2xl font-bold flex items-center gap-2">
                {stat.value === null ? <Loader2 size={18} className="animate-spin text-gray-500" /> : stat.value}
              </p>

              {stat.sub ? (
                <p className="text-xs mt-1 text-gray-500">{stat.sub}</p>
              ) : loading ? (
                <p className="text-xs mt-1 text-gray-600">Loading…</p>
              ) : (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#4ade80" }}>
                  <ArrowUpRight size={12} />
                  Live from backend
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
          <h3 className="text-white text-sm font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${action.color}20` }}>
                    <Icon size={14} style={{ color: action.color }} />
                  </div>
                  <span className="text-gray-300">{action.label}</span>
                  <ArrowUpRight size={12} className="ml-auto text-gray-500" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Not an activity log (no such endpoint yet): the most recently changed content, from the content tables. */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-semibold">Recently Updated Content</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={18} className="animate-spin text-gray-500" />
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-400 text-sm">Nothing here yet.</p>
              <p className="text-gray-600 text-xs mt-1">Publications, articles and blog posts will appear here as you add them.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {recent.map((r, i) => (
                <li key={`${r.kind}-${i}`}>
                  <Link to={r.href} className="flex items-center gap-3 py-2.5 hover:bg-gray-800/40 rounded-lg px-2 -mx-2 transition-colors">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-900 text-gray-400 border border-gray-700 flex-shrink-0">
                      {r.kind}
                    </span>
                    <span className="text-gray-200 text-sm truncate">{r.title}</span>
                    <span className="ml-auto text-gray-500 text-xs whitespace-nowrap">{ago(r.t)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Platform Overview */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1a1f2e", border: "1px solid #1f2937" }}>
        <h3 className="text-white text-sm font-semibold mb-4">Platform Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {OVERVIEW.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold flex items-center justify-center gap-2" style={{ color: "#D4A017" }}>
                {item.value === null ? <Loader2 size={16} className="animate-spin text-gray-600" /> : item.value}
              </p>
              <p className="text-gray-300 text-xs font-medium mt-1">{item.label}</p>
              <p className="text-gray-600 text-xs">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}