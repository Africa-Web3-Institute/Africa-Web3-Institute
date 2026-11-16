import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Archive, CheckCheck, Mail, MailOpen, RefreshCw, Reply, Trash2 } from "lucide-react";
import { contactApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, PageHeader, SearchInput, Tabs,
  fmtDate, useApiData, useCurrentUser,
} from "../ui";

const STATUS_TONE = { unread: "yellow", read: "gray", replied: "green", archived: "blue" };

export default function Messages() {
  const { isSuperadmin } = useCurrentUser();
  const { data, loading, error, reload, setData } = useApiData(() => contactApi.getAll());
  const [tab, setTab] = useState("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const messages = data?.data || [];
  const counts = useMemo(() => {
    const c = { unread: 0, read: 0, replied: 0, archived: 0 };
    messages.forEach((m) => { c[m.status] = (c[m.status] || 0) + 1; });
    return c;
  }, [messages]);

  const visible = messages.filter((m) => {
    const inTab = tab === "inbox" ? m.status !== "archived" : tab === "all" ? true : m.status === tab;
    const q = query.trim().toLowerCase();
    const matches = !q || [m.name, m.email, m.organization, m.subject, m.message].join(" ").toLowerCase().includes(q);
    return inTab && matches;
  });
  const selected = messages.find((m) => m.id === selectedId) || null;

  const patchLocal = (id, status) =>
    setData({ ...data, data: messages.map((m) => (m.id === id ? { ...m, status } : m)) });

  const setStatus = async (msg, status, quiet = false) => {
    try {
      await contactApi.setStatus(msg.id, status);
      patchLocal(msg.id, status);
      if (!quiet) toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const open = (msg) => {
    setSelectedId(msg.id);
    if (msg.status === "unread") setStatus(msg, "read", true);
  };

  const remove = async () => {
    setBusy(true);
    try {
      await contactApi.remove(toDelete.id);
      setData({ ...data, data: messages.filter((m) => m.id !== toDelete.id) });
      if (selectedId === toDelete.id) setSelectedId(null);
      toast.success("Message deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const replyHref = (m) =>
    `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message to Africa Web3 Institute"}`)}`;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Messages sent through the website's contact form."
        actions={<Button icon={RefreshCw} onClick={reload} loading={loading && !!data}>Refresh</Button>}
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "inbox", label: "Inbox", count: messages.length - counts.archived },
          { value: "unread", label: "Unread", count: counts.unread },
          { value: "replied", label: "Replied", count: counts.replied },
          { value: "archived", label: "Archived", count: counts.archived },
          { value: "all", label: "All", count: messages.length },
        ]}
      />

      <DataState loading={loading} error={error} onRetry={reload} data={data}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* List */}
          <Card padded={false} className="lg:col-span-2 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <SearchInput value={query} onChange={setQuery} placeholder="Search name, email or text…" />
            </div>
            {visible.length === 0 ? (
              <EmptyState title="No messages here" description={query ? "Try a different search." : "New contact form messages will appear here."} />
            ) : (
              <ul className="max-h-[65vh] overflow-y-auto divide-y divide-gray-700/60">
                {visible.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => open(m)}
                      className={`w-full text-left px-4 py-3 transition-colors ${selectedId === m.id ? "bg-yellow-500/5" : "hover:bg-gray-700/40"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${m.status === "unread" ? "font-semibold text-white" : "text-gray-300"}`}>
                          {m.status === "unread" && <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2 align-middle" />}
                          {m.name}
                        </span>
                        <span className="text-[11px] text-gray-500 shrink-0">{fmtDate(m.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{m.subject || "Website Inquiry"}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{m.message}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Reading pane */}
          <Card className="lg:col-span-3">
            {!selected ? (
              <EmptyState title="Select a message" description="Choose a message on the left to read it and reply." />
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-white">{selected.subject || "Website Inquiry"}</h2>
                    <p className="text-sm text-gray-300 mt-1">
                      {selected.name} · <a className="text-yellow-400 hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>
                    </p>
                    {selected.organization && <p className="text-xs text-gray-500 mt-0.5">{selected.organization}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">{fmtDate(selected.createdAt, true)}</p>
                  </div>
                  <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
                </div>

                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-900/60 border border-gray-700 rounded-lg p-4">
                  {selected.message}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <a href={replyHref(selected)} onClick={() => selected.status !== "replied" && setStatus(selected, "replied", true)}>
                    <Button variant="primary" icon={Reply}>Reply by email</Button>
                  </a>
                  {selected.status !== "replied" && <Button icon={CheckCheck} onClick={() => setStatus(selected, "replied")}>Mark replied</Button>}
                  {selected.status !== "unread" && <Button icon={Mail} onClick={() => setStatus(selected, "unread")}>Mark unread</Button>}
                  {selected.status === "archived"
                    ? <Button icon={MailOpen} onClick={() => setStatus(selected, "read")}>Move to inbox</Button>
                    : <Button icon={Archive} onClick={() => setStatus(selected, "archived")}>Archive</Button>}
                  {isSuperadmin && <Button variant="danger" icon={Trash2} onClick={() => setToDelete(selected)}>Delete</Button>}
                </div>
              </div>
            )}
          </Card>
        </div>
      </DataState>

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete the message from ${toDelete?.name}? This can't be undone.`}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
}
