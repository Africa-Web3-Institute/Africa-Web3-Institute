import { useState } from "react";
import { toast } from "sonner";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { visualizationsApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, PageHeader, Select,
  Table, Textarea, rowsOf, useApiData, useCurrentUser,
} from "../ui";

const TYPES = ["line", "bar", "area", "donut", "radar", "scatter", "geo", "table"];
const COLORS = ["#D4A017", "#10B981", "#38BDF8", "#A78BFA", "#F472B6", "#F97316", "var(--admin-label)"];
const tooltip = { contentStyle: { background: "var(--admin-line)", border: "1px solid var(--admin-grid)", borderRadius: 8, color: "var(--admin-tooltip-text)" } };

// Works out the x-axis (first text field) and series (numeric fields) from the data rows
function shape(data) {
  const rows = Array.isArray(data) ? data.filter((r) => r && typeof r === "object") : [];
  const first = rows[0] || {};
  const xKey = Object.keys(first).find((k) => typeof first[k] === "string") || Object.keys(first)[0];
  const series = Object.keys(first).filter((k) => k !== xKey && typeof first[k] === "number");
  return { rows, xKey, series };
}

export function ChartPreview({ viz, height = 260 }) {
  const { rows, xKey, series } = shape(viz.data);
  if (!rows.length) return <EmptyState title="No data to preview" />;
  if (!series.length || viz.type === "table" || viz.type === "geo") return <DataTable rows={rows} />;

  const axes = (
    <>
      <CartesianGrid stroke="var(--admin-grid)" vertical={false} />
      <XAxis dataKey={xKey} stroke="var(--admin-axis2)" fontSize={11} />
      <YAxis stroke="var(--admin-axis2)" fontSize={11} width={40} />
      <Tooltip {...tooltip} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
    </>
  );
  let chart;
  if (viz.type === "bar") {
    chart = <BarChart data={rows}>{axes}{series.map((s, i) => <Bar key={s} dataKey={s} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />)}</BarChart>;
  } else if (viz.type === "area") {
    chart = <AreaChart data={rows}>{axes}{series.map((s, i) => <Area key={s} dataKey={s} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.2} />)}</AreaChart>;
  } else if (viz.type === "donut" || viz.type === "pie") {
    chart = (
      <PieChart>
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Pie data={rows} dataKey={series[0]} nameKey={xKey} innerRadius="50%" outerRadius="80%" paddingAngle={2}>
          {rows.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
      </PieChart>
    );
  } else if (viz.type === "radar") {
    chart = (
      <RadarChart data={rows} outerRadius="70%">
        <PolarGrid stroke="var(--admin-grid)" />
        <PolarAngleAxis dataKey={xKey} stroke="var(--admin-axis2)" fontSize={11} />
        <Tooltip {...tooltip} />
        {series.map((s, i) => <Radar key={s} dataKey={s} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.25} />)}
      </RadarChart>
    );
  } else if (viz.type === "scatter" && series.length >= 2) {
    chart = (
      <ScatterChart>
        <CartesianGrid stroke="var(--admin-grid)" />
        <XAxis type="number" dataKey={series[0]} name={series[0]} stroke="var(--admin-axis2)" fontSize={11} />
        <YAxis type="number" dataKey={series[1]} name={series[1]} stroke="var(--admin-axis2)" fontSize={11} width={40} />
        <Tooltip {...tooltip} />
        <Scatter data={rows} fill={COLORS[0]} />
      </ScatterChart>
    );
  } else {
    chart = <LineChart data={rows}>{axes}{series.map((s, i) => <Line key={s} dataKey={s} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />)}</LineChart>;
  }
  return <div style={{ height }}><ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer></div>;
}

function DataTable({ rows }) {
  const keys = Object.keys(rows[0] || {});
  return (
    <div className="overflow-auto max-h-64 border border-gray-700 rounded-lg">
      <table className="w-full text-xs">
        <thead className="bg-gray-900/60 text-gray-400"><tr>{keys.map((k) => <th key={k} className="px-3 py-2 text-left font-medium">{k}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-gray-700/60">{keys.map((k) => <td key={k} className="px-3 py-1.5 text-gray-300">{String(r[k] ?? "")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function Visualizations() {
  const { can } = useCurrentUser();
  const canDelete = can("content.delete");
  const { data, loading, error, reload } = useApiData(() => visualizationsApi.getAll());
  const [category, setCategory] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const all = rowsOf(data);
  const categories = [...new Set(all.map((v) => v.category).filter(Boolean))].sort();
  const rows = all.filter((v) => category === "all" || v.category === category);

  // Opens the full record from the detail endpoint
  const view = async (v) => {
    try {
      const res = await visualizationsApi.getBySlug(v.slug);
      setViewing(res?.data || v);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await visualizationsApi.remove(toDelete.id);
      toast.success("Visualization deleted");
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Visualizations"
        description="Chart definitions and datasets stored in the backend for research pages."
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>New visualization</Button>}
      />
      <Card padded={false}>
        <div className="p-4 border-b border-gray-700 sm:w-64">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: "all", label: "All categories" }, ...categories]} />
        </div>
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No visualizations yet" />}>
          <Table
            rows={rows}
            onRowClick={view}
            columns={[
              { key: "title", label: "Title", render: (v) => <div><p className="text-white">{v.title}</p><p className="text-xs text-gray-500 font-mono">{v.slug}</p></div> },
              { key: "category", label: "Category", render: (v) => <Badge tone="blue">{v.category}</Badge> },
              { key: "type", label: "Type", render: (v) => <Badge>{v.type}</Badge> },
              { key: "rows", label: "Data points", render: (v) => (Array.isArray(v.data) ? v.data.length : 0) },
              {
                key: "actions", label: "", className: "text-right w-28",
                render: (v) => (
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <IconButton icon={Eye} label="Preview" onClick={() => view(v)} />
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(v)} />
                    {canDelete && <IconButton icon={Trash2} tone="danger" label="Delete" onClick={() => setToDelete(v)} />}
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>

      <Modal open={!!viewing} wide title={viewing?.title || ""} onClose={() => setViewing(null)}>
        {viewing && (
          <>
            {viewing.description && <p className="text-sm text-gray-400">{viewing.description}</p>}
            <ChartPreview viz={viewing} height={320} />
          </>
        )}
      </Modal>
      {editing && <VizForm item={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      <ConfirmDialog open={!!toDelete} message={`Delete "${toDelete?.title}"?`} onConfirm={remove} onCancel={() => setToDelete(null)} busy={busy} />
    </div>
  );
}

function VizForm({ item, onClose, onSaved }) {
  const isNew = !item.id;
  const [form, setForm] = useState({
    slug: item.slug || "", title: item.title || "", category: item.category || "General", type: item.type || "line",
    description: item.description || "",
    config: JSON.stringify(item.config || {}, null, 2),
    data: JSON.stringify(item.data || [{ label: "2025", value: 10 }, { label: "2026", value: 20 }], null, 2),
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const parse = (text, name) => {
    try { return JSON.parse(text || (name === "data" ? "[]" : "{}")); } catch { throw new Error(`${name === "data" ? "Data" : "Config"} isn't valid JSON`); }
  };
  let preview = null;
  try { preview = { ...form, data: parse(form.data, "data") }; } catch { preview = null; }

  const submit = async () => {
    try {
      if (!form.title.trim()) throw new Error("A title is required");
      if (isNew && !/^[a-z0-9-]+$/.test(form.slug)) throw new Error("Slug: lowercase letters, numbers and hyphens only");
      const payload = { ...form, config: parse(form.config, "config"), data: parse(form.data, "data") };
      if (!Array.isArray(payload.data)) throw new Error("Data must be a JSON array of rows");
      setBusy(true);
      if (isNew) await visualizationsApi.create(payload);
      else await visualizationsApi.update(item.id, payload);
      toast.success(isNew ? "Visualization created" : "Visualization updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open wide title={isNew ? "New visualization" : `Edit ${item.title}`} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Save</Button></>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title" required><Input value={form.title} onChange={set("title")} /></Field>
        <Field label="Slug" required hint={isNew ? "Used in the URL, e.g. stablecoin-volume" : "Can't be changed after creation."}>
          <Input value={form.slug} onChange={set("slug")} disabled={!isNew} />
        </Field>
        <Field label="Category"><Input value={form.category} onChange={set("category")} /></Field>
        <Field label="Chart type"><Select value={form.type} onChange={set("type")} options={TYPES} /></Field>
      </div>
      <Field label="Description"><Textarea value={form.description} onChange={set("description")} style={{ minHeight: 70 }} /></Field>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="Data (JSON array)" hint="One object per point: a text field for the label, number fields for each series.">
          <textarea value={form.data} onChange={set("data")} spellCheck={false} className="w-full min-h-[200px] bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-yellow-500/60" />
        </Field>
        <div>
          <p className="text-xs font-medium text-gray-300 mb-1.5">Preview</p>
          <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/40">
            {preview ? <ChartPreview viz={preview} height={200} /> : <p className="text-xs text-red-400 py-10 text-center">Fix the JSON to see a preview.</p>}
          </div>
        </div>
      </div>
      <Field label="Config (JSON object, optional)" hint="Extra display options such as axis labels or units.">
        <textarea value={form.config} onChange={set("config")} spellCheck={false} className="w-full min-h-[80px] bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-yellow-500/60" />
      </Field>
    </Modal>
  );
}
