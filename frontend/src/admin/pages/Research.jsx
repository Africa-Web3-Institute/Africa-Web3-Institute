import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Copy, Download, ExternalLink, FileText, Plus, Quote, RefreshCw, Trash2, TrendingUp } from "lucide-react";
import { publicationsApi, researchApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, PageHeader, Select,
  StatCard, Table, Tabs, Textarea, fmtDate, fmtNumber, rowsOf, useApiData, useCurrentUser,
} from "../ui";

const SOURCE_TYPES = ["academic", "policy", "media", "government", "industry"];

export default function Research() {
  const [tab, setTab] = useState("impact");
  return (
    <div>
      <PageHeader title="Research Impact" description="How AWI publications are downloaded and cited." />
      <Tabs value={tab} onChange={setTab} tabs={[
        { value: "impact", label: "Impact by publication" },
        { value: "citations", label: "Citations" },
        { value: "report", label: "Impact report" },
      ]} />
      {tab === "impact" && <Impact />}
      {tab === "citations" && <Citations />}
      {tab === "report" && <Report />}
    </div>
  );
}

function useImpact() {
  return useApiData(() => researchApi.impact());
}

function Impact() {
  const { data, loading, error, reload } = useImpact();
  const d = data?.impactDashboard;
  const [open, setOpen] = useState(null);
  const pubs = d?.publicationsImpact || [];
  const top = Math.max(1, ...pubs.map((p) => p.engagementScore));

  return (
    <DataState loading={loading} error={error} onRetry={reload} data={data}>
      {d && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={BookOpen} label="Publications" value={fmtNumber(d.totalPublications)} />
            <StatCard icon={Download} tone="green" label="Total downloads" value={fmtNumber(d.totalDownloads)} />
            <StatCard icon={Quote} tone="purple" label="Citations recorded" value={fmtNumber(d.totalCitations)} />
          </div>
          <Card padded={false} title="Ranked by engagement" actions={<Button icon={RefreshCw} onClick={reload}>Refresh</Button>}>
            <p className="px-5 pt-4 text-xs text-gray-500">Engagement score = downloads × 1.5 + citations × 10. Click a row to see its citations.</p>
            <Table
              rows={pubs}
              onRowClick={(p) => setOpen(p)}
              columns={[
                { key: "title", label: "Publication", render: (p) => <div><p className="text-white">{p.title}</p>{p.category && <p className="text-xs text-gray-500">{p.category}</p>}</div> },
                { key: "downloads", label: "Downloads", render: (p) => fmtNumber(p.downloads) },
                { key: "citationCount", label: "Citations", render: (p) => fmtNumber(p.citationCount) },
                {
                  key: "engagementScore", label: "Engagement", className: "w-48",
                  render: (p) => (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: `${(p.engagementScore / top) * 100}%` }} /></div>
                      <span className="text-xs text-gray-300 w-8 text-right">{p.engagementScore}</span>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      )}
      <Modal open={!!open} wide title={open?.title || ""} onClose={() => setOpen(null)}>
        {open && (open.citations.length === 0
          ? <EmptyState title="No citations recorded" description="Add one from the Citations tab." />
          : open.citations.map((c) => <CitationItem key={c.id} c={c} />))}
      </Modal>
    </DataState>
  );
}

function CitationItem({ c, onDelete }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-white">{c.citationSource}</p>
          <p className="text-xs text-gray-500 mt-0.5">{fmtDate(c.citationDate)} · <Badge tone="blue">{c.sourceType}</Badge></p>
        </div>
        <div className="flex gap-1 shrink-0">
          {c.citationUrl && <a href={c.citationUrl} target="_blank" rel="noreferrer"><IconButton icon={ExternalLink} label="Open source" /></a>}
          {onDelete && <IconButton icon={Trash2} tone="danger" label="Delete" onClick={() => onDelete(c)} />}
        </div>
      </div>
      {c.quote && <p className="text-sm text-gray-300 italic mt-2">“{c.quote}”</p>}
    </div>
  );
}

function Citations() {
  const { isSuperadmin } = useCurrentUser();
  const citations = useApiData(() => researchApi.getCitations());
  const pubs = useApiData(() => publicationsApi.getAll());
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const pubList = rowsOf(pubs.data);
  const titleOf = (id) => pubList.find((p) => Number(p.id) === Number(id))?.title || `Publication #${id}`;
  const rows = rowsOf(citations.data).filter((c) => filter === "all" || Number(c.publicationId) === Number(filter));

  const remove = async () => {
    setBusy(true);
    try {
      await researchApi.removeCitation(toDelete.id);
      toast.success("Citation deleted");
      setToDelete(null);
      citations.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Card
        padded={false}
        title="Citations"
        actions={<Button variant="primary" icon={Plus} onClick={() => setAdding(true)} disabled={!pubList.length}>Add citation</Button>}
      >
        <div className="p-4 border-b border-gray-700 sm:w-96">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={[{ value: "all", label: "All publications" }, ...pubList.map((p) => ({ value: String(p.id), label: p.title }))]} />
        </div>
        <DataState loading={citations.loading} error={citations.error} onRetry={citations.reload} data={citations.data} isEmpty={rows.length === 0} empty={<EmptyState title="No citations recorded" />}>
          <Table
            rows={rows}
            columns={[
              { key: "citationSource", label: "Cited by", render: (c) => <div><p className="text-white">{c.citationSource}</p>{c.quote && <p className="text-xs text-gray-500 italic line-clamp-1">“{c.quote}”</p>}</div> },
              { key: "publicationId", label: "Publication", render: (c) => <span className="text-gray-400">{titleOf(c.publicationId)}</span> },
              { key: "sourceType", label: "Type", render: (c) => <Badge tone="blue">{c.sourceType}</Badge> },
              { key: "citationDate", label: "Date", render: (c) => fmtDate(c.citationDate) },
              {
                key: "actions", label: "", className: "text-right w-20",
                render: (c) => (
                  <div className="flex justify-end gap-1">
                    {c.citationUrl && <a href={c.citationUrl} target="_blank" rel="noreferrer"><IconButton icon={ExternalLink} label="Open source" /></a>}
                    {isSuperadmin && <IconButton icon={Trash2} tone="danger" label="Delete" onClick={() => setToDelete(c)} />}
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>
      {adding && <AddCitation publications={pubList} onClose={() => setAdding(false)} onSaved={citations.reload} />}
      <ConfirmDialog open={!!toDelete} message={`Delete the citation from ${toDelete?.citationSource}?`} onConfirm={remove} onCancel={() => setToDelete(null)} busy={busy} />
    </>
  );
}

function AddCitation({ publications, onClose, onSaved }) {
  const [form, setForm] = useState({
    publicationId: String(publications[0]?.id ?? ""), citationSource: "", sourceType: "academic",
    citationDate: new Date().toISOString().slice(0, 10), citationUrl: "", quote: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async () => {
    if (!form.citationSource.trim()) return toast.error("Enter who cited the publication");
    setBusy(true);
    try {
      await researchApi.addCitation({ ...form, publicationId: Number(form.publicationId) });
      toast.success("Citation added");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open wide title="Add citation" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Add citation</Button></>}>
      <Field label="Publication" required><Select value={form.publicationId} onChange={set("publicationId")} options={publications.map((p) => ({ value: String(p.id), label: p.title }))} /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Cited by" required className="sm:col-span-2"><Input value={form.citationSource} onChange={set("citationSource")} placeholder="e.g. World Bank Fintech Report 2026" /></Field>
        <Field label="Source type"><Select value={form.sourceType} onChange={set("sourceType")} options={SOURCE_TYPES} /></Field>
        <Field label="Date"><Input type="date" value={form.citationDate} onChange={set("citationDate")} /></Field>
        <Field label="Link" className="sm:col-span-2"><Input type="url" value={form.citationUrl} onChange={set("citationUrl")} placeholder="https://…" /></Field>
      </div>
      <Field label="Quote (optional)"><Textarea value={form.quote} onChange={set("quote")} /></Field>
    </Modal>
  );
}

function Report() {
  const { data, loading, error, reload } = useImpact();
  const text = data?.impactDashboard?.automatedReportSummary || "";
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); toast.success("Report copied"); } catch { toast.error("Couldn't copy"); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    Object.assign(document.createElement("a"), { href: url, download: `awi-research-impact-${new Date().toISOString().slice(0, 10)}.md` }).click();
    URL.revokeObjectURL(url);
  };
  return (
    <DataState loading={loading} error={error} onRetry={reload} data={data}>
      <Card
        title="Generated impact report"
        actions={<div className="flex gap-2"><Button icon={RefreshCw} onClick={reload}>Regenerate</Button><Button icon={Copy} onClick={copy}>Copy</Button><Button variant="primary" icon={FileText} onClick={download}>Download .md</Button></div>}
      >
        <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono bg-gray-900/60 border border-gray-700 rounded-lg p-4">{text}</pre>
        <p className="text-xs text-gray-500 mt-3"><TrendingUp className="w-3.5 h-3.5 inline -mt-0.5" /> Generated by the backend from current download and citation data each time it loads.</p>
      </Card>
    </DataState>
  );
}
