import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Eye, Link2, MousePointerClick, Plus, RefreshCw, Send, Users } from "lucide-react";
import { API_BASE_URL, newsletterApi } from "../../api/api";
import {
  Badge, Button, Card, DataState, EmptyState, Field, IconButton, Input, Modal, Notice, PageHeader, SearchInput, Select,
  StatCard, Table, Tabs, Textarea, fmtDate, fmtNumber, rowsOf, useApiData,
} from "../ui";

const SEGMENTS = ["general", "policy_makers", "investors", "developers", "researchers"];
const segmentLabel = (s) => (s || "general").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Newsletter() {
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <PageHeader title="Newsletter" description="Subscribers, published editions and campaign performance." />
      <Notice tone="warn">
        The backend doesn't send emails yet. Publishing an edition adds it to the public archive, and logging a campaign
        records it for reporting, but no email is delivered to subscribers until an email service is connected.
      </Notice>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "subscribers", label: "Subscribers" },
          { value: "editions", label: "Editions archive" },
          { value: "campaigns", label: "Campaigns" },
        ]}
      />
      {tab === "overview" && <Overview />}
      {tab === "subscribers" && <Subscribers />}
      {tab === "editions" && <Editions />}
      {tab === "campaigns" && <Campaigns />}
    </div>
  );
}

/* ── Overview ───────────────────────────────────────────────────────────── */

function Overview() {
  const { data, loading, error, reload } = useApiData(() => newsletterApi.getAnalytics());
  const r = data?.report;
  const segments = Object.entries(r?.segmentBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...segments.map(([, n]) => n));

  return (
    <DataState loading={loading} error={error} onRetry={reload} data={data}>
      {r && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Active subscribers" value={fmtNumber(r.totalSubscribers)} />
            <StatCard icon={Send} tone="blue" label="Campaigns logged" value={fmtNumber(r.totalCampaignsSent)} hint={`${fmtNumber(r.totalEmailsSent)} recipients in total`} />
            <StatCard icon={Eye} tone="green" label="Open rate" value={`${r.averageOpenRatePercent}%`} hint={`${fmtNumber(r.totalOpens)} opens`} />
            <StatCard icon={MousePointerClick} tone="purple" label="Click-through rate" value={`${r.clickThroughRatePercent}%`} hint={`${fmtNumber(r.totalClicks)} clicks`} />
          </div>
          <Card title="Subscribers by audience">
            {segments.length === 0 ? (
              <EmptyState title="No subscribers yet" />
            ) : (
              <ul className="space-y-3">
                {segments.map(([seg, n]) => (
                  <li key={seg}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{segmentLabel(seg)}</span>
                      <span className="text-gray-400">{fmtNumber(n)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(n / max) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </DataState>
  );
}

/* ── Subscribers ────────────────────────────────────────────────────────── */

function Subscribers() {
  const { data, loading, error, reload } = useApiData(() => newsletterApi.getSubscribers());
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [adding, setAdding] = useState(false);

  const all = rowsOf(data);
  const rows = all.filter((s) => {
    const q = query.trim().toLowerCase();
    return (segment === "all" || (s.segment || "general") === segment) && (!q || `${s.email} ${s.name}`.toLowerCase().includes(q));
  });

  const exportCsv = () => {
    const header = "email,name,segment,status,subscribedAt\n";
    const body = rows
      .map((s) => [s.email, s.name, s.segment || s.source || "", s.status, s.subscribedAt].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "awi-subscribers.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card
        padded={false}
        title={`Subscribers${data ? ` (${rows.length})` : ""}`}
        actions={
          <div className="flex gap-2">
            <Button icon={Download} onClick={exportCsv} disabled={!rows.length}>Export CSV</Button>
            <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add subscriber</Button>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-700">
          <SearchInput value={query} onChange={setQuery} placeholder="Search email or name…" className="flex-1" />
          <div className="sm:w-56">
            <Select value={segment} onChange={(e) => setSegment(e.target.value)} options={[{ value: "all", label: "All audiences" }, ...SEGMENTS.map((s) => ({ value: s, label: segmentLabel(s) }))]} />
          </div>
        </div>
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No subscribers found" />}>
          <Table
            rows={rows}
            columns={[
              { key: "email", label: "Email", render: (s) => <span className="text-white">{s.email}</span> },
              { key: "name", label: "Name", render: (s) => s.name || "—" },
              { key: "segment", label: "Audience", render: (s) => <Badge tone="blue">{segmentLabel(s.segment || s.source)}</Badge> },
              { key: "status", label: "Status", render: (s) => <Badge tone={s.status === "active" ? "green" : "gray"}>{s.status}</Badge> },
              { key: "subscribedAt", label: "Subscribed", render: (s) => fmtDate(s.subscribedAt) },
            ]}
          />
        </DataState>
      </Card>
      <AddSubscriber open={adding} onClose={() => setAdding(false)} onSaved={reload} />
    </>
  );
}

function AddSubscriber({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ email: "", name: "", segment: "general" });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Enter a valid email address");
    setBusy(true);
    try {
      const res = await newsletterApi.addSubscriber(form);
      toast.success(res?.message || "Subscriber added");
      setForm({ email: "", name: "", segment: "general" });
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} title="Add subscriber" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Add</Button></>}>
      <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Audience" hint="Used to target campaigns."><Select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} options={SEGMENTS.map((s) => ({ value: s, label: segmentLabel(s) }))} /></Field>
    </Modal>
  );
}

/* ── Editions archive ───────────────────────────────────────────────────── */

function Editions() {
  const { data, loading, error, reload } = useApiData(() => newsletterApi.getNewsletters());
  const [composing, setComposing] = useState(false);
  const [viewing, setViewing] = useState(null);
  const rows = rowsOf(data);

  const view = async (row) => {
    try {
      setViewing(await newsletterApi.getById(row.id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Card
        padded={false}
        title="Published editions"
        actions={
          <div className="flex gap-2">
            <Button icon={RefreshCw} onClick={reload}>Refresh</Button>
            <Button variant="primary" icon={Plus} onClick={() => setComposing(true)}>Publish edition</Button>
          </div>
        }
      >
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No editions published yet" />}>
          <Table
            rows={rows}
            onRowClick={view}
            columns={[
              { key: "edition", label: "#", render: (n) => n.edition ?? "—", className: "w-12" },
              { key: "title", label: "Title", render: (n) => <span className="text-white">{n.title}</span> },
              { key: "description", label: "Summary", render: (n) => <span className="line-clamp-2 text-gray-400">{n.description || "—"}</span> },
              { key: "date", label: "Date", render: (n) => fmtDate(n.date) },
              { key: "readTime", label: "Read time" },
            ]}
          />
        </DataState>
      </Card>
      <Compose open={composing} onClose={() => setComposing(false)} onSaved={reload} nextEdition={Math.max(0, ...rows.map((r) => Number(r.edition) || 0)) + 1} />
      <Modal open={!!viewing} wide title={viewing ? `${viewing.edition ? `#${viewing.edition} · ` : ""}${viewing.title}` : ""} onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <p className="text-xs text-gray-500">{fmtDate(viewing.date)} · {viewing.readTime}</p>
            {viewing.description && <p className="text-sm text-gray-300">{viewing.description}</p>}
            <div className="text-sm text-gray-200 whitespace-pre-wrap bg-gray-900/60 border border-gray-700 rounded-lg p-4">{viewing.content || "No content."}</div>
            {viewing.url && viewing.url !== "#" && <a className="text-sm text-yellow-400 hover:underline" href={viewing.url} target="_blank" rel="noreferrer">Open link</a>}
          </>
        )}
      </Modal>
    </>
  );
}

function Compose({ open, onClose, onSaved, nextEdition }) {
  const blank = { title: "", edition: "", date: new Date().toISOString().slice(0, 10), description: "", content: "", readTime: "4 min read", url: "" };
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async () => {
    if (!form.title.trim()) return toast.error("A title is required");
    setBusy(true);
    try {
      await newsletterApi.sendNewsletter({ ...form, edition: form.edition || nextEdition });
      toast.success("Edition published to the archive");
      setForm(blank);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} wide title="Publish a newsletter edition" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Publish to archive</Button></>}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Title" required className="sm:col-span-2"><Input value={form.title} onChange={set("title")} /></Field>
        <Field label="Edition #"><Input type="number" placeholder={String(nextEdition)} value={form.edition} onChange={set("edition")} /></Field>
        <Field label="Date"><Input type="date" value={form.date} onChange={set("date")} /></Field>
        <Field label="Read time"><Input value={form.readTime} onChange={set("readTime")} /></Field>
        <Field label="Link (optional)"><Input type="url" placeholder="https://…" value={form.url} onChange={set("url")} /></Field>
      </div>
      <Field label="Summary" hint="Shown in the newsletter archive list."><Textarea value={form.description} onChange={set("description")} /></Field>
      <Field label="Content"><Textarea value={form.content} onChange={set("content")} style={{ minHeight: 200 }} /></Field>
    </Modal>
  );
}

/* ── Campaigns ──────────────────────────────────────────────────────────── */

function Campaigns() {
  const { data, loading, error, reload } = useApiData(() => newsletterApi.getCampaigns());
  const [creating, setCreating] = useState(false);
  const [tracking, setTracking] = useState(null);
  const rows = rowsOf(data);
  const rate = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

  return (
    <>
      <Card padded={false} title="Campaigns" actions={<Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>Log campaign</Button>}>
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No campaigns logged yet" />}>
          <Table
            rows={rows}
            columns={[
              { key: "title", label: "Campaign", render: (c) => <div><p className="text-white">{c.title}</p><p className="text-xs text-gray-500">{c.subject}</p></div> },
              { key: "segment", label: "Audience", render: (c) => <Badge tone="blue">{c.segment === "all" ? "All" : segmentLabel(c.segment)}</Badge> },
              { key: "totalSent", label: "Recipients", render: (c) => fmtNumber(c.totalSent) },
              { key: "opens", label: "Opens", render: (c) => `${fmtNumber(c.opens)} (${rate(c.opens, c.totalSent)})` },
              { key: "clicks", label: "Clicks", render: (c) => `${fmtNumber(c.clicks)} (${rate(c.clicks, c.opens)})` },
              { key: "sentAt", label: "Date", render: (c) => fmtDate(c.sentAt) },
              { key: "actions", label: "", className: "w-10", render: (c) => <IconButton icon={Link2} label="Tracking links" onClick={() => setTracking(c)} /> },
            ]}
          />
        </DataState>
      </Card>
      <NewCampaign open={creating} onClose={() => setCreating(false)} onSaved={reload} />
      <TrackingLinks campaign={tracking} onClose={() => setTracking(null)} />
    </>
  );
}

function NewCampaign({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ title: "", subject: "", segment: "all" });
  const [busy, setBusy] = useState(false);
  const options = useMemo(() => [{ value: "all", label: "All subscribers" }, ...SEGMENTS.map((s) => ({ value: s, label: segmentLabel(s) }))], []);
  const submit = async () => {
    if (!form.title.trim() || !form.subject.trim()) return toast.error("Title and subject are required");
    setBusy(true);
    try {
      const res = await newsletterApi.createCampaign(form);
      toast.success(`Campaign logged for ${fmtNumber(res?.totalSent)} subscribers`);
      setForm({ title: "", subject: "", segment: "all" });
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} title="Log a campaign" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Log campaign</Button></>}>
      <p className="text-xs text-gray-400">Records the campaign and its audience size for reporting. Opens and clicks are counted when tracked links are used in the email.</p>
      <Field label="Campaign name" required><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Email subject" required><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
      <Field label="Audience"><Select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} options={options} /></Field>
    </Modal>
  );
}

// Open/click tracking URLs to paste into a campaign email. {{subscriber_id}} is
// replaced per recipient by whatever tool sends the email.
function TrackingLinks({ campaign, onClose }) {
  if (!campaign) return null;
  const base = `${API_BASE_URL}/track`;
  const links = [
    { label: "Open-tracking pixel", hint: "Add as a 1×1 image at the bottom of the email.", value: `<img src="${base}/open/${campaign.id}/{{subscriber_id}}" width="1" height="1" alt="" />` },
    { label: "Tracked link", hint: "Use instead of a plain link; replace the url= value with your destination.", value: `${base}/click/${campaign.id}/{{subscriber_id}}?url=https://www.africaweb3institute.org/publications` },
  ];
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); toast.success("Copied"); } catch { toast.error("Couldn't copy"); }
  };
  return (
    <Modal open wide title={`Tracking links · ${campaign.title}`} onClose={onClose}>
      <p className="text-xs text-gray-400">Paste these into the campaign email so opens and clicks are counted here. Replace <code className="text-yellow-300">{"{{subscriber_id}}"}</code> with each recipient's subscriber ID (most email tools can merge this in).</p>
      {links.map((l) => (
        <div key={l.label}>
          <p className="text-xs font-medium text-gray-300 mb-1">{l.label}</p>
          <div className="flex gap-2">
            <code className="flex-1 text-xs text-gray-200 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 break-all">{l.value}</code>
            <IconButton icon={Copy} label="Copy" onClick={() => copy(l.value)} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{l.hint}</p>
        </div>
      ))}
    </Modal>
  );
}
