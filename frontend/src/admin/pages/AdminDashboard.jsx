// Admin dashboard. One page for every role, read top to bottom:
//   1. Greeting: who you are and what your role lets you do
//   2. Needs attention: unread messages, drafts, failed sign-ins (only what applies)
//   3. At a glance: headline numbers
//   4. Activity (team activity for superadmins, your own work for everyone else) + shortcuts
//   5. Content pipeline + intelligence & audience numbers
// Sections and shortcuts only appear when the account has the permission behind them.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowRight, BookOpen, Building2, Download, FileEdit, FileText, Globe2, History, Inbox, LineChart,
  Mail, Map, PenLine, Plus, Radio, ShieldAlert, ShieldCheck, Trash2, Users, Pencil, Send, LogIn,
} from "lucide-react";
import {
  activityApi, analyticsApi, articlesApi, authApi, awpiiApi, blogsApi, contactApi, enforcementApi, publicationsApi, trackerApi, web3Api,
} from "../../api/api";
import { useCurrentUser } from "../ui";

/* ── Helpers ────────────────────────────────────────────────────────────── */

const ROLE = {
  superadmin: { label: "Superadmin", blurb: "Full access, including accounts, permissions and the activity log.", chip: "bg-violet-500/15 text-violet-200 border-violet-400/30" },
  admin: { label: "Admin", blurb: "All content, AWPII, the inbox and newsletters, plus adding admins, editors and viewers.", chip: "bg-sky-500/15 text-sky-200 border-sky-400/30" },
  editor: { label: "Editor", blurb: "Create, edit and delete content, read messages and follow newsletter results.", chip: "bg-gray-500/20 text-gray-200 border-gray-400/30" },
  viewer: { label: "Viewer", blurb: "View the dashboard and site analytics. Nothing can be changed from this account.", chip: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" },
};

const ACTION = {
  create: { label: "created", icon: Plus, cls: "bg-emerald-500/15 text-emerald-300" },
  update: { label: "edited", icon: Pencil, cls: "bg-sky-500/15 text-sky-300" },
  delete: { label: "deleted", icon: Trash2, cls: "bg-red-500/15 text-red-300" },
  send: { label: "sent", icon: Send, cls: "bg-violet-500/15 text-violet-300" },
  login: { label: "signed in", icon: LogIn, cls: "bg-gray-600/40 text-gray-300" },
  login_failed: { label: "failed to sign in", icon: AlertTriangle, cls: "bg-yellow-500/15 text-yellow-300" },
};

const rowsOf = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null);
const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());

// SQLite timestamps ("2026-10-21 09:15:00") are UTC without a zone marker
const toTime = (v) => {
  if (!v || typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(v)) return 0;
  const iso = v.includes("T") ? v : v.replace(" ", "T");
  const t = Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + "Z");
  return Number.isNaN(t) ? 0 : t;
};
const ago = (t) => {
  if (!t) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

// GET /api/analytics (newsletter report) isn't in api.js and shouldn't sign the user out on failure
async function adminGet(path) {
  let token = null;
  try { token = JSON.parse(localStorage.getItem("awi_admin_user"))?.token || null; } catch { /* none */ }
  const base = analyticsApi.sseUrl().replace(/\/live$/, "");
  const res = await fetch(`${base}${path}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ── Small building blocks ──────────────────────────────────────────────── */

function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{children}</h2>
      {action}
    </div>
  );
}

function Panel({ title, icon: Icon, action, children, className = "" }) {
  return (
    <section className={`min-w-0 bg-gray-800/80 border border-gray-700/80 rounded-2xl ${className}`}>
      <header className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        {Icon && <Icon className="w-4 h-4 text-yellow-400" />}
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {action && <div className="ml-auto">{action}</div>}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

const Skeleton = ({ className = "" }) => <span className={`block rounded bg-gray-700/60 animate-pulse ${className}`} />;

function Metric({ label, value, hint, icon: Icon, accent, to, live }) {
  const body = (
    <div className="relative h-full overflow-hidden rounded-2xl border border-gray-700/80 bg-gray-800/80 p-5 transition-colors group-hover:border-gray-500">
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}1f`, color: accent }}>
          <Icon className="w-[18px] h-[18px]" />
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {value === null ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold text-white tracking-tight">{value}</p>}
        {live && <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" /><span className="relative w-2 h-2 rounded-full bg-emerald-400" /></span>}
      </div>
      <p className="mt-1.5 text-xs text-gray-500 min-h-[1rem]">{hint}</p>
    </div>
  );
  return to ? <Link to={to} className="group block h-full">{body}</Link> : <div className="group h-full">{body}</div>;
}

function AttentionCard({ to, icon: Icon, tone, title, text }) {
  const tones = {
    yellow: "border-yellow-500/30 bg-yellow-500/[0.06] text-yellow-300",
    sky: "border-sky-500/30 bg-sky-500/[0.06] text-sky-300",
    red: "border-red-500/30 bg-red-500/[0.06] text-red-300",
  };
  return (
    <Link to={to} className={`group min-w-0 flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors hover:bg-white/[0.03] ${tones[tone]}`}>
      <span className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center shrink-0"><Icon className="w-[18px] h-[18px]" /></span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-gray-400 truncate">{text}</span>
      </span>
      <ArrowRight className="w-4 h-4 ml-auto shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

function ActivityRow({ a, showWho }) {
  const info = ACTION[a.action] || { label: a.action, icon: Pencil, cls: "bg-gray-600/40 text-gray-300" };
  const Icon = info.icon;
  return (
    <li className="flex items-start gap-3 py-3">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${info.cls}`}><Icon className="w-3.5 h-3.5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-300 leading-snug">
          {showWho && <span className="font-semibold text-white">{(a.userName && !/^(super)?admin$/i.test(a.userName) ? a.userName : a.userEmail) || "Someone"} </span>}
          {showWho ? info.label : info.label.charAt(0).toUpperCase() + info.label.slice(1)}{" "}
          {a.entityType && !String(a.action).startsWith("login") && <span className="text-gray-400">{a.entityType.toLowerCase()}</span>}
          {a.summary && <span className="text-gray-200"> · {a.summary}</span>}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{ago(toTime(a.createdAt))}</p>
      </div>
    </li>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function AdminDashboard() {
  const { user, isSuperadmin, can } = useCurrentUser();
  const role = ROLE[user?.role] || ROLE.editor;
  const firstName = (user?.name && !/^(super)?admin$/i.test(user.name) ? user.name : (user?.email || "").split("@")[0]).split(" ")[0];
  const canMessages = can("messages.view");
  const canContent = can("content.view");
  const canAnalytics = can("analytics.view");
  // Viewers (and anyone without editing rights) get a read-only dashboard
  const canWork = isSuperadmin || can("content.create") || can("content.edit");
  const canNewsletter = can("newsletter.view");

  const [loading, setLoading] = useState(true);
  const [d, setD] = useState({});
  const [live, setLive] = useState(null);
  const [liveState, setLiveState] = useState("connecting");
  const [pipelineTab, setPipelineTab] = useState("all");

  // Live visitors (Server-Sent Events from /api/live; "active" = pinged in the last 30 seconds)
  useEffect(() => {
    if (typeof EventSource === "undefined") { setLiveState("error"); return undefined; }
    let es;
    try { es = new EventSource(analyticsApi.sseUrl()); } catch { setLiveState("error"); return undefined; }
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const m = msg.type === "init" ? msg.data?.metrics : msg.type === "metrics" ? msg.data : null;
        if (m) { setLive({ active: m.activeUsers, sessions: m.totalSessions, views: m.totalPageViews }); setLiveState("ok"); }
      } catch { /* ignore */ }
    };
    es.onerror = () => setLiveState((s) => (s === "ok" ? s : "error"));
    return () => es.close();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const safe = (p, map = rowsOf) => p.then(map).catch(() => null);
    const skip = Promise.resolve(null);
    (async () => {
      const staffList = { includeDrafts: 1, limit: 500 };
      const [publications, articles, blogs, enforcement, awpii, tracker, startups, subscribers, unread, team, summary, mine, system] = await Promise.all([
        safe(publicationsApi.getAll()),
        safe(articlesApi.getAll(staffList)),
        safe(blogsApi.getAll(staffList)),
        safe(enforcementApi.getAll()),
        safe(awpiiApi.getAll()),
        safe(trackerApi.getAll()),
        safe(web3Api.getStartups()),
        canNewsletter ? safe(adminGet("/analytics"), (r) => (Number.isFinite(Number(r?.report?.totalSubscribers)) ? Number(r.report.totalSubscribers) : null)) : skip,
        canMessages ? safe(contactApi.getAll("unread"), (r) => Number(r?.unreadCount) || 0) : skip,
        isSuperadmin ? safe(activityApi.list({ limit: 8 }), (r) => r) : skip,
        isSuperadmin ? safe(activityApi.summary()) : skip,
        !isSuperadmin ? safe(authApi.myActivity(8), (r) => r) : skip,
        isSuperadmin ? safe(authApi.systemStatus(), (r) => r) : skip,
      ]);
      if (cancelled) return;
      setD({ publications, articles, blogs, enforcement, awpii, tracker, startups, subscribers, unread, team, summary, mine, system });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [isSuperadmin, canMessages, canNewsletter]);

  const val = (v) => (loading ? null : fmt(v));
  const len = (list) => (list ? list.length : null);

  const isDraft = (kind, r) => (kind === "Blog post" ? Number(r.isPublished ?? 1) === 0 : String(r.status || "").toLowerCase() === "draft");
  const content = useMemo(() => [
    ...(d.articles || []).map((r) => ({ kind: "Article", r })),
    ...(d.blogs || []).map((r) => ({ kind: "Blog post", r })),
    ...(d.publications || []).map((r) => ({ kind: "Publication", r })),
  ].map(({ kind, r }) => ({
    kind,
    title: r.title,
    author: r.author,
    draft: kind !== "Publication" && isDraft(kind, r),
    t: toTime(r.updatedAt) || toTime(r.publishedAt) || toTime(r.createdAt),
    href: kind === "Publication" ? "/admin/adminpublications" : "/admin/articles",
  })).filter((x) => x.title).sort((a, b) => b.t - a.t), [d.articles, d.blogs, d.publications]);

  const drafts = content.filter((c) => c.draft);
  const pipeline = (pipelineTab === "drafts" ? drafts : content).slice(0, 7);
  const downloads = d.publications ? d.publications.reduce((s, p) => s + (Number(p.downloads) || 0), 0) : null;
  const liveArticles = d.articles ? d.articles.filter((r) => !isDraft("Article", r)).length : null;
  const liveBlogs = d.blogs ? d.blogs.filter((r) => !isDraft("Blog post", r)).length : null;
  const failedLogins = (d.summary || []).reduce((s, u) => s + (Number(u.failedLogins) || 0), 0);
  const allFailed = !loading && [d.publications, d.articles, d.blogs, d.enforcement, d.awpii, d.tracker].every((v) => v === null);

  const sys = d.system;
  const attention = [
    isSuperadmin && sys && !sys.database?.persistent && { to: "/admin", icon: AlertTriangle, tone: "red", title: "Data is not on a persistent volume", text: "Accounts, content and activity are wiped on every deploy. Attach a volume in Railway." },
    isSuperadmin && sys && !sys.jwtSecretConfigured && { to: "/admin", icon: ShieldAlert, tone: "red", title: "JWT_SECRET is not set", text: "Add a long random JWT_SECRET in Railway Variables, then redeploy" },
    isSuperadmin && sys?.recoveryVariablesSet && { to: "/admin", icon: ShieldAlert, tone: "yellow", title: "Remove the recovery variables", text: "Delete SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD from Railway Variables" },
    isSuperadmin && sys?.defaultPasswordAccounts?.length > 0 && { to: "/admin/users", icon: ShieldAlert, tone: "yellow", title: `${sys.defaultPasswordAccounts.length} account${sys.defaultPasswordAccounts.length === 1 ? "" : "s"} can't sign in (default password)`, text: `Set a new password for ${sys.defaultPasswordAccounts.join(", ")}` },
    canMessages && d.unread > 0 && { to: "/admin/messages", icon: Inbox, tone: "yellow", title: `${d.unread} unread message${d.unread === 1 ? "" : "s"}`, text: "From the website contact form" },
    can("content.edit") && drafts.length > 0 && { to: "/admin/articles", icon: FileEdit, tone: "sky", title: `${drafts.length} draft${drafts.length === 1 ? "" : "s"} not yet published`, text: drafts.slice(0, 2).map((x) => x.title).join(" · ") },
    isSuperadmin && failedLogins > 0 && { to: "/admin/activity?action=login_failed", icon: ShieldAlert, tone: "red", title: `${failedLogins} failed sign-in${failedLogins === 1 ? "" : "s"}`, text: "Check they were your team, not someone guessing passwords" },
  ].filter(Boolean);

  const shortcuts = [
    can("content.create") && { label: "Write a blog post or article", to: "/admin/articles", icon: PenLine, accent: "#60a5fa" },
    can("content.create") && { label: "Add a publication or report", to: "/admin/adminpublications", icon: BookOpen, accent: "#D4A017" },
    can("content.create") && { label: "Log an enforcement event", to: "/admin/enforcement", icon: ShieldAlert, accent: "#f87171" },
    can("policy.edit") && { label: "Update AWPII & tracker", to: "/admin/policy-tracker", icon: Map, accent: "#34d399" },
    can("content.create") && { label: "Add a startup", to: "/admin/state-of-web3", icon: Building2, accent: "#2dd4bf" },
    can("newsletter.send") && { label: "Send a newsletter", to: "/admin/newsletter", icon: Mail, accent: "#a78bfa" },
    can("users.manage") && { label: "Manage accounts", to: "/admin/users", icon: Users, accent: "#c084fc" },
  ].filter(Boolean).slice(0, 6);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {allFailed && (
        <div role="alert" className="rounded-2xl border border-red-800 bg-red-950/50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-300 text-sm font-semibold">Can't reach the backend</p>
            <p className="text-red-300/80 text-xs mt-1">None of the dashboard data could be loaded. Check the Railway service and the VITE_API_URL setting.</p>
          </div>
        </div>
      )}

      {/* 1. Greeting */}
      <section className="admin-hero relative overflow-hidden rounded-3xl px-6 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#D4A017]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-0 w-56 h-56 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#D4A017]">{today}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{greeting()}, <span className="capitalize">{firstName || "there"}</span></h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${role.chip}`}>
                <ShieldCheck className="w-3.5 h-3.5" /> {role.label}
              </span>
              <span className="text-sm text-gray-400">{role.blurb}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:shrink-0">
            {[
              { label: "Visitors now", value: liveState === "ok" ? fmt(live?.active) : liveState === "connecting" ? null : "—", icon: Radio },
              { label: "Page views", value: liveState === "ok" ? fmt(live?.views) : liveState === "connecting" ? null : "—", icon: LineChart },
              { label: "Live content", value: loading ? null : fmt((liveArticles || 0) + (liveBlogs || 0) + (len(d.publications) || 0)), icon: Globe2 },
            ].map((k) => (
              <div key={k.label} className="admin-hero-tile rounded-2xl px-3 sm:px-4 py-3 sm:min-w-[104px]">
                <k.icon className="w-4 h-4 text-[#D4A017]" />
                <div className="mt-2 h-7 flex items-center">{k.value === null ? <Skeleton className="h-6 w-10" /> : <p className="text-xl font-bold text-white">{k.value}</p>}</div>
                <p className="text-[11px] text-gray-400">{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Needs attention */}
      {attention.length > 0 && (
        <section>
          <SectionLabel>Needs your attention</SectionLabel>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {attention.map((a) => <AttentionCard key={a.title} {...a} />)}
          </div>
        </section>
      )}

      {/* 3. At a glance */}
      <section>
        <SectionLabel>At a glance</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Publications" value={val(len(d.publications))} hint="Reports, briefs and analyses" icon={BookOpen} accent="#D4A017" to={canContent ? "/admin/adminpublications" : undefined} />
          <Metric label="Articles & blog posts" value={loading ? null : fmt((liveArticles ?? 0) + (liveBlogs ?? 0))} hint={loading ? "" : `${fmt(liveArticles)} articles · ${fmt(liveBlogs)} blog posts${drafts.length ? ` · ${drafts.length} draft${drafts.length === 1 ? "" : "s"}` : ""}`} icon={FileText} accent="#60a5fa" to={canContent ? "/admin/articles" : undefined} />
          <Metric label="Report downloads" value={val(downloads)} hint="All time, across publications" icon={Download} accent="#34d399" />
          {canNewsletter ? (
            <Metric label="Newsletter subscribers" value={val(d.subscribers)} hint="Active subscribers" icon={Mail} accent="#a78bfa" to="/admin/newsletter" />
          ) : (
            <Metric label="Visitors right now" value={liveState === "ok" ? fmt(live?.active) : liveState === "connecting" ? null : "—"} hint={liveState === "ok" ? `${fmt(live?.sessions)} sessions today` : "Live feed unavailable"} icon={Radio} accent="#a78bfa" live={liveState === "ok"} />
          )}
        </div>
      </section>

      {/* 4. Activity + shortcuts */}
      {canWork && (
      <section className="grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title={isSuperadmin ? "Team activity" : "Your recent work"}
          icon={History}
          action={isSuperadmin
            ? <Link to="/admin/activity" className="text-xs font-medium text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1">Full activity log <ArrowRight className="w-3 h-3" /></Link>
            : d.mine?.last30Days && <span className="text-[11px] text-gray-500">Last 30 days: {d.mine.last30Days.created} created · {d.mine.last30Days.updated} edited</span>}
        >
          {loading ? (
            <div className="space-y-4 py-2">{[0, 1, 2, 3].map((i) => <div key={i} className="flex gap-3"><Skeleton className="w-8 h-8 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2.5 w-20" /></div></div>)}</div>
          ) : (() => {
            const rows = isSuperadmin ? rowsOf(d.team) || [] : rowsOf(d.mine) || [];
            if (!rows.length) {
              return (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-300">{isSuperadmin ? "No activity recorded yet." : "You haven't made any changes yet."}</p>
                  <p className="text-xs text-gray-500 mt-1">{isSuperadmin ? "Changes made by any account will show up here." : "Things you create or edit will show up here."}</p>
                </div>
              );
            }
            return <ul className="divide-y divide-gray-700/60">{rows.map((a) => <ActivityRow key={a.id} a={a} showWho={isSuperadmin} />)}</ul>;
          })()}
        </Panel>

        <div className="space-y-4">
          <Panel title="Shortcuts" icon={Plus}>
            {shortcuts.length ? (
              <div className="grid gap-2">
                {shortcuts.map((s) => (
                  <Link key={s.label} to={s.to} className="group flex items-center gap-3 rounded-xl border border-gray-700/70 bg-gray-900/40 px-3 py-2.5 hover:border-gray-500 hover:bg-gray-900/70 transition-colors">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.accent}1f`, color: s.accent }}><s.icon className="w-4 h-4" /></span>
                    <span className="text-sm text-gray-200">{s.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Your account can view content but not change it.</p>
            )}
          </Panel>

          {isSuperadmin && (
            <Panel title="Team" icon={Users} action={<Link to="/admin/users" className="text-xs text-gray-400 hover:text-white">Manage</Link>}>
              {loading ? <Skeleton className="h-24 w-full" /> : (
                <ul className="space-y-3">
                  {(d.summary || []).map((u) => {
                    const r = ROLE[u.role] || ROLE.editor;
                    const name = u.name && !/^(super)?admin$/i.test(u.name) ? u.name : u.email.split("@")[0];
                    return (
                      <li key={u.id}>
                        <Link to={`/admin/activity?userId=${u.id}`} className="flex items-center gap-3 group">
                          <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">{name.slice(0, 2)}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-gray-200 truncate group-hover:text-white capitalize">{name}</span>
                            <span className="block text-[11px] text-gray-500">{u.lastActivityAt ? `Active ${ago(toTime(u.lastActivityAt))}` : "No activity yet"}</span>
                          </span>
                          {!u.active && <span className="text-[10px] font-semibold text-red-300">Disabled</span>}
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${r.chip}`}>{r.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </section>

      )}

      {/* 5. Content + intelligence */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Content pipeline"
          icon={FileText}
          action={
            <div className="flex rounded-lg bg-gray-900/60 p-0.5 text-xs">
              {[["all", "Latest"], ["drafts", `Drafts${drafts.length ? ` (${drafts.length})` : ""}`]].map(([k, l]) => (
                <button key={k} onClick={() => setPipelineTab(k)} className={`px-3 py-1 rounded-md transition-colors ${pipelineTab === k ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>{l}</button>
              ))}
            </div>
          }
        >
          {loading ? (
            <div className="space-y-3">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
          ) : pipeline.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">{pipelineTab === "drafts" ? "No drafts waiting. Everything is published." : "No content yet."}</p>
          ) : (
            <ul className="divide-y divide-gray-700/60">
              {pipeline.map((c, i) => (
                <li key={`${c.kind}-${i}`}>
                  <Link to={canContent ? c.href : "#"} onClick={(e) => !canContent && e.preventDefault()} className={`flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg transition-colors ${canContent ? "hover:bg-gray-900/40" : "cursor-default"}`}>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${c.draft ? "bg-sky-500/15 text-sky-300" : "bg-emerald-500/15 text-emerald-300"}`}>{c.draft ? "Draft" : "Live"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-gray-200 truncate">{c.title}</span>
                      <span className="block text-[11px] text-gray-500">{c.kind}{c.author ? ` · ${c.author}` : ""}</span>
                    </span>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">{ago(c.t)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Intelligence coverage" icon={Globe2}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Countries tracked", value: val(len(d.tracker)), to: "/admin/policy-tracker", icon: Map },
              { label: "AWPII nations", value: val(len(d.awpii)), to: "/admin/policy-tracker", icon: LineChart },
              { label: "Enforcement events", value: val(len(d.enforcement)), to: "/admin/enforcement", icon: ShieldAlert },
              { label: "Startups in directory", value: val(len(d.startups)), to: "/admin/state-of-web3", icon: Building2 },
            ].map((t) => (
              <Link key={t.label} to={canContent ? t.to : "#"} onClick={(e) => !canContent && e.preventDefault()} className={`rounded-xl border border-gray-700/70 bg-gray-900/40 p-3.5 transition-colors ${canContent ? "hover:border-gray-500" : "cursor-default"}`}>
                <t.icon className="w-4 h-4 text-[#D4A017]" />
                <div className="mt-2 h-7 flex items-center">{t.value === null ? <Skeleton className="h-6 w-10" /> : <p className="text-xl font-bold text-white">{t.value}</p>}</div>
                <p className="text-[11px] text-gray-400 leading-tight">{t.label}</p>
              </Link>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
