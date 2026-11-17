import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Building2, DollarSign, ExternalLink, Globe2, Lightbulb, Pencil, Plus, Trash2, TrendingUp, Users } from "lucide-react";
import { web3Api } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, Notice, PageHeader,
  SearchInput, Select, StatCard, Table, Tabs, Textarea, fmtMoney, fmtNumber, rowsOf, useApiData, useCurrentUser,
} from "../ui";

const STAGES = ["Pre-Seed", "Seed", "Pre-Series A", "Series A", "Series B", "Series C", "Growth", "Acquired"];
const METRIC_CATEGORIES = ["Adoption", "Market Volume", "Investment", "Regulation", "Infrastructure", "Talent"];
const chartTooltip = { contentStyle: { background: "#1f2937", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb" }, cursor: { fill: "rgba(255,255,255,0.04)" } };

export default function StateOfWeb3() {
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <PageHeader title="State of Web3 in Africa" description="Ecosystem metrics, adoption indicators and the startup directory behind the State of Web3 dashboard." />
      <Tabs value={tab} onChange={setTab} tabs={[
        { value: "overview", label: "Overview" },
        { value: "startups", label: "Startups" },
        { value: "metrics", label: "Ecosystem metrics" },
        { value: "adoption", label: "Adoption" },
      ]} />
      {tab === "overview" && <Overview />}
      {tab === "startups" && <Startups />}
      {tab === "metrics" && <Metrics />}
      {tab === "adoption" && <Adoption />}
    </div>
  );
}

function Overview() {
  const { data, loading, error, reload } = useApiData(() => web3Api.dashboard());
  const d = data?.dashboard;
  const categories = Object.entries(d?.categoryBreakdown || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  return (
    <DataState loading={loading} error={error} onRetry={reload} data={data}>
      {d && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Building2} label="Startups tracked" value={fmtNumber(d.summary.totalTrackedStartups)} />
            <StatCard icon={DollarSign} tone="green" label="Funding tracked" value={fmtMoney(d.summary.totalEcosystemFundingUsd)} />
            <StatCard icon={Users} tone="blue" label="Startup users" value={fmtNumber(d.summary.totalActiveUsers)} />
            <StatCard icon={Globe2} tone="purple" label="Top AWPII markets" value={(d.summary.topCountriesByAWPII || []).length} hint={(d.summary.topCountriesByAWPII || []).join(", ")} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <Card title="Startups by category" className="lg:col-span-3">
              {categories.length === 0 ? <EmptyState title="No startups yet" /> : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categories} layout="vertical" margin={{ left: 20, right: 16 }}>
                      <CartesianGrid stroke="#374151" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={150} stroke="#9ca3af" fontSize={12} />
                      <Tooltip {...chartTooltip} />
                      <Bar dataKey="count" name="Startups" fill="#D4A017" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
            <Card title="Key insights" className="lg:col-span-2">
              <ul className="space-y-3">
                {(d.keyInsights || []).map((k) => (
                  <li key={k} className="flex gap-2 text-sm text-gray-300"><Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />{k}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-4">These insights are currently written into the backend code, not edited here.</p>
            </Card>
          </div>
          <Card title="Ecosystem metrics" padded={false}><MetricsTable rows={d.ecosystemMetrics || []} /></Card>
        </div>
      )}
    </DataState>
  );
}

function MetricsTable({ rows }) {
  if (!rows.length) return <EmptyState title="No metrics recorded" />;
  return (
    <Table
      rows={rows}
      columns={[
        { key: "indicator", label: "Indicator", render: (m) => <div><p className="text-white">{m.indicator}</p><p className="text-xs text-gray-500">{m.category}</p></div> },
        { key: "value", label: "Value", render: (m) => <span className="text-white">{fmtNumber(m.value)} <span className="text-gray-500 text-xs">{m.unit}</span></span> },
        { key: "growthRate", label: "Growth", render: (m) => <span className={Number(m.growthRate) >= 0 ? "text-emerald-400" : "text-red-400"}>{Number(m.growthRate) >= 0 ? "+" : ""}{m.growthRate}%</span> },
        { key: "country", label: "Region" },
        { key: "year", label: "Year" },
      ]}
    />
  );
}

function Metrics() {
  const [category, setCategory] = useState("");
  const { data, loading, error, reload } = useApiData(() => web3Api.getMetrics({ category }), [category]);
  const [adding, setAdding] = useState(false);
  const rows = rowsOf(data);
  return (
    <>
      <Card padded={false} title="Ecosystem metrics" actions={<Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add metric</Button>}>
        <div className="p-4 border-b border-gray-700 sm:w-64">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: "", label: "All categories" }, ...METRIC_CATEGORIES]} />
        </div>
        <DataState loading={loading} error={error} onRetry={reload} data={data}><MetricsTable rows={rows} /></DataState>
      </Card>
      {adding && <AddMetric onClose={() => setAdding(false)} onSaved={reload} />}
    </>
  );
}

function AddMetric({ onClose, onSaved }) {
  const [form, setForm] = useState({ category: "Adoption", indicator: "", value: "", unit: "", country: "Continental Africa", year: new Date().getFullYear(), growthRate: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async () => {
    if (!form.indicator.trim() || form.value === "") return toast.error("Indicator and value are required");
    setBusy(true);
    try {
      await web3Api.createMetric({ ...form, value: Number(form.value), year: Number(form.year), growthRate: Number(form.growthRate) || 0 });
      toast.success("Metric added");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open title="Add ecosystem metric" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Add metric</Button></>}>
      <p className="text-xs text-gray-400">The backend can add metrics but not edit or delete them, so double-check before saving.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category"><Select value={form.category} onChange={set("category")} options={METRIC_CATEGORIES} /></Field>
        <Field label="Indicator" required><Input value={form.indicator} onChange={set("indicator")} placeholder="e.g. Estimated crypto users" /></Field>
        <Field label="Value" required><Input type="number" step="any" value={form.value} onChange={set("value")} /></Field>
        <Field label="Unit"><Input value={form.unit} onChange={set("unit")} placeholder="e.g. Millions" /></Field>
        <Field label="Region / country"><Input value={form.country} onChange={set("country")} /></Field>
        <Field label="Year"><Input type="number" value={form.year} onChange={set("year")} /></Field>
        <Field label="Growth rate (%)"><Input type="number" step="any" value={form.growthRate} onChange={set("growthRate")} /></Field>
      </div>
    </Modal>
  );
}

function Adoption() {
  const { data, loading, error, reload } = useApiData(() => web3Api.adoption());
  const a = data?.adoption;
  return (
    <DataState loading={loading} error={error} onRetry={reload} data={data}>
      {a && (
        <div className="space-y-6">
          <Notice>The continental adoption index and total crypto users below are fixed values in the backend code. Top markets come from the AWPII scores.</Notice>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Activity} label="Continental adoption index" value={a.continentalAdoptionIndex} />
            <StatCard icon={Users} tone="blue" label="Active crypto users" value={`${a.totalActiveCryptoUsersMillions}M`} />
          </div>
          <Card title="Top markets by AWPII score" padded={false}>
            {(a.topPerformingMarkets || []).length === 0 ? <EmptyState title="No AWPII scores yet" /> : (
              <Table
                rowKey="country"
                rows={a.topPerformingMarkets}
                columns={[
                  { key: "country", label: "Country", render: (m) => <span className="text-white">{m.country}</span> },
                  { key: "score", label: "Score", render: (m) => <span className="text-white font-semibold">{m.score}</span> },
                  { key: "momentum", label: "Momentum", render: (m) => <span className="inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" />{m.momentum}</span> },
                  { key: "tierColor", label: "Tier", render: (m) => <Badge tone={m.tierColor === "Green" ? "green" : m.tierColor === "Yellow" ? "yellow" : "red"}>{m.tierColor}</Badge> },
                ]}
              />
            )}
          </Card>
          <Card title="Adoption & market volume metrics" padded={false}><MetricsTable rows={a.regionalMetrics || []} /></Card>
        </div>
      )}
    </DataState>
  );
}

function Startups() {
  const { can } = useCurrentUser();
  const canDelete = can("content.delete");
  const { data, loading, error, reload } = useApiData(() => web3Api.getStartups());
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = rowsOf(data).filter((s) => {
    const q = query.trim().toLowerCase();
    return (!stage || s.fundingStage === stage) && (!q || `${s.name} ${s.country} ${s.category}`.toLowerCase().includes(q));
  });

  const remove = async () => {
    setBusy(true);
    try {
      await web3Api.removeStartup(toDelete.id);
      toast.success("Startup removed");
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Card padded={false} title="Startup directory" actions={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>Add startup</Button>}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-700">
          <SearchInput value={query} onChange={setQuery} placeholder="Search name, country or category…" className="flex-1" />
          <div className="sm:w-48"><Select value={stage} onChange={(e) => setStage(e.target.value)} options={[{ value: "", label: "All stages" }, ...STAGES]} /></div>
        </div>
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No startups found" />}>
          <Table
            rows={rows}
            columns={[
              { key: "name", label: "Startup", render: (s) => <div><p className="text-white">{s.name}</p><p className="text-xs text-gray-500">{s.category}</p></div> },
              { key: "country", label: "Country" },
              { key: "fundingStage", label: "Stage", render: (s) => <Badge tone="purple">{s.fundingStage}</Badge> },
              { key: "fundingTotalUsd", label: "Funding", render: (s) => fmtMoney(s.fundingTotalUsd) },
              { key: "activeUsers", label: "Users", render: (s) => fmtNumber(s.activeUsers) },
              {
                key: "actions", label: "", className: "text-right w-28",
                render: (s) => (
                  <div className="flex justify-end gap-1">
                    {s.website && <a href={s.website} target="_blank" rel="noreferrer"><IconButton icon={ExternalLink} label="Website" /></a>}
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(s)} />
                    {canDelete && <IconButton icon={Trash2} tone="danger" label="Remove" onClick={() => setToDelete(s)} />}
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>
      {editing && <StartupForm item={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      <ConfirmDialog open={!!toDelete} title="Remove startup?" message={`Remove ${toDelete?.name} from the directory?`} confirmLabel="Remove" onConfirm={remove} onCancel={() => setToDelete(null)} busy={busy} />
    </>
  );
}

function StartupForm({ item, onClose, onSaved }) {
  const isNew = !item.id;
  const [form, setForm] = useState({
    name: item.name || "", country: item.country || "", category: item.category || "", fundingStage: item.fundingStage || "Seed",
    fundingTotalUsd: item.fundingTotalUsd ?? "", foundedYear: item.foundedYear || new Date().getFullYear(),
    description: item.description || "", website: item.website || "", activeUsers: item.activeUsers ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async () => {
    if (!form.name.trim() || !form.country.trim() || !form.category.trim()) return toast.error("Name, country and category are required");
    setBusy(true);
    try {
      const payload = { ...form, fundingTotalUsd: Number(form.fundingTotalUsd) || 0, activeUsers: Number(form.activeUsers) || 0, foundedYear: Number(form.foundedYear) || undefined };
      if (isNew) await web3Api.createStartup(payload);
      else await web3Api.updateStartup(item.id, payload);
      toast.success(isNew ? "Startup added" : "Startup updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open wide title={isNew ? "Add startup" : `Edit ${item.name}`} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Save</Button></>}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Name" required><Input value={form.name} onChange={set("name")} /></Field>
        <Field label="Country" required><Input value={form.country} onChange={set("country")} /></Field>
        <Field label="Category" required><Input value={form.category} onChange={set("category")} placeholder="e.g. Payments & Exchange" /></Field>
        <Field label="Funding stage"><Select value={form.fundingStage} onChange={set("fundingStage")} options={STAGES} /></Field>
        <Field label="Total funding (USD)"><Input type="number" value={form.fundingTotalUsd} onChange={set("fundingTotalUsd")} /></Field>
        <Field label="Active users"><Input type="number" value={form.activeUsers} onChange={set("activeUsers")} /></Field>
        <Field label="Founded"><Input type="number" value={form.foundedYear} onChange={set("foundedYear")} /></Field>
        <Field label="Website" className="sm:col-span-2"><Input type="url" value={form.website} onChange={set("website")} placeholder="https://…" /></Field>
      </div>
      <Field label="Description"><Textarea value={form.description} onChange={set("description")} /></Field>
    </Modal>
  );
}
