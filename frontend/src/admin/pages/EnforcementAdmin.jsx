import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { enforcementApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, Notice, PageHeader,
  SearchInput, Select, Table, Textarea, fmtDate, rowsOf, useApiData, useCurrentUser,
} from "../ui";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "under_review", label: "Under review" },
  { value: "resolved", label: "Resolved" },
  { value: "appealed", label: "Appealed" },
];
const STATUS_TONE = { active: "red", under_review: "yellow", resolved: "green", appealed: "purple" };
const statusLabel = (s) => STATUSES.find((x) => x.value === s)?.label || s || "—";

export default function EnforcementAdmin() {
  const { isSuperadmin } = useCurrentUser();
  const { data, loading, error, reload } = useApiData(() => enforcementApi.getAll());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = rowsOf(data).filter((e) => {
    const q = query.trim().toLowerCase();
    return (status === "all" || e.status === status) && (!q || `${e.title} ${e.country} ${e.description}`.toLowerCase().includes(q));
  });

  const remove = async () => {
    setBusy(true);
    try {
      await enforcementApi.remove(toDelete.id);
      toast.success("Action deleted");
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
        title="Enforcement Watch"
        description="Regulatory enforcement actions recorded in the backend."
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>Add action</Button>}
      />
      <Notice tone="warn">
        The public Enforcement Watch page still uses the data built into the website, so actions added here don't appear
        there yet. They're stored and ready for when that page is connected.
      </Notice>
      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-700">
          <SearchInput value={query} onChange={setQuery} placeholder="Search title, country or description…" className="flex-1" />
          <div className="sm:w-48"><Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: "all", label: "All statuses" }, ...STATUSES]} /></div>
        </div>
        <DataState
          loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0}
          empty={<EmptyState title="No enforcement actions yet" description="Add the first one to start the backend record." action={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>Add action</Button>} />}
        >
          <Table
            rows={rows}
            columns={[
              { key: "title", label: "Action", render: (e) => <div><p className="text-white">{e.title}</p>{e.description && <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{e.description}</p>}</div> },
              { key: "country", label: "Country" },
              { key: "date", label: "Date", render: (e) => fmtDate(e.date) },
              { key: "status", label: "Status", render: (e) => <Badge tone={STATUS_TONE[e.status] || "gray"}>{statusLabel(e.status)}</Badge> },
              {
                key: "actions", label: "", className: "text-right w-20",
                render: (e) => (
                  <div className="flex justify-end gap-1">
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(e)} />
                    {isSuperadmin && <IconButton icon={Trash2} tone="danger" label="Delete" onClick={() => setToDelete(e)} />}
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>
      {editing && <EnforcementForm item={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      <ConfirmDialog open={!!toDelete} message={`Delete "${toDelete?.title}"?`} onConfirm={remove} onCancel={() => setToDelete(null)} busy={busy} />
    </div>
  );
}

function EnforcementForm({ item, onClose, onSaved }) {
  const isNew = !item.id;
  const [form, setForm] = useState({
    title: item.title || "", description: item.description || "", country: item.country || "",
    date: (item.date || new Date().toISOString()).slice(0, 10), status: item.status || "active",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.title.trim()) return toast.error("A title is required");
    setBusy(true);
    try {
      // The update endpoint replaces every field, so always send the whole record
      if (isNew) await enforcementApi.create(form);
      else await enforcementApi.update(item.id, form);
      toast.success(isNew ? "Action added" : "Action updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open title={isNew ? "Add enforcement action" : "Edit enforcement action"} onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Save</Button></>}>
      <Field label="Title" required><Input value={form.title} onChange={set("title")} placeholder="e.g. SEC fines unlicensed exchange" /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Country"><Input value={form.country} onChange={set("country")} /></Field>
        <Field label="Date"><Input type="date" value={form.date} onChange={set("date")} /></Field>
        <Field label="Status"><Select value={form.status} onChange={set("status")} options={STATUSES} /></Field>
      </div>
      <Field label="Description"><Textarea value={form.description} onChange={set("description")} /></Field>
    </Modal>
  );
}
