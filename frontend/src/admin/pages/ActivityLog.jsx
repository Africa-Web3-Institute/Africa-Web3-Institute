import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, LogIn, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { activityApi } from "../../api/api";
import {
  Badge, Button, Card, DataState, EmptyState, Input, PageHeader, SearchInput, Select, Table, fmtDate, rowsOf, useApiData, useCurrentUser,
} from "../ui";
import { ROLE_INFO } from "./Users";

const ACTIONS = {
  create: { label: "Created", tone: "green", icon: Plus },
  update: { label: "Edited", tone: "blue", icon: Pencil },
  delete: { label: "Deleted", tone: "red", icon: Trash2 },
  send: { label: "Sent", tone: "purple", icon: Send },
  login: { label: "Signed in", tone: "gray", icon: LogIn },
  login_failed: { label: "Failed sign-in", tone: "yellow", icon: AlertTriangle },
};
const PAGE = 50;

export default function ActivityLog() {
  const { isSuperadmin } = useCurrentUser();
  const [params, setParams] = useSearchParams();
  const filters = {
    userId: params.get("userId") || "",
    action: params.get("action") || "",
    entityType: params.get("entityType") || "",
    q: params.get("q") || "",
    from: params.get("from") || "",
    to: params.get("to") || "",
  };
  const setFilter = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };
  const [search, setSearch] = useState(filters.q);
  useEffect(() => {
    const t = setTimeout(() => { if (search !== filters.q) setFilter("q", search.trim()); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [params]);

  const key = params.toString();
  const log = useApiData(() => (isSuperadmin ? activityApi.list({ ...filters, limit }) : Promise.resolve(null)), [isSuperadmin, key, limit]);
  const summary = useApiData(() => (isSuperadmin ? activityApi.summary() : Promise.resolve(null)), [isSuperadmin]);

  if (!isSuperadmin) {
    return (
      <div>
        <PageHeader title="Activity Log" />
        <Card><EmptyState title="Not available" description="Your account doesn't have access to the activity log." /></Card>
      </div>
    );
  }

  const accounts = rowsOf(summary.data);
  const rows = rowsOf(log.data);
  const total = log.data?.total || 0;
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <PageHeader
        title="Activity Log"
        description="Everything each account has created, edited, deleted or sent, plus sign-ins. Newest first."
      />

      {/* One card per account */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {accounts.map((a) => {
          const selected = String(a.id) === filters.userId;
          return (
            <button
              key={a.id}
              onClick={() => setFilter("userId", selected ? "" : String(a.id))}
              className={`text-left rounded-xl border p-4 transition-colors ${selected ? "border-yellow-500 bg-yellow-500/5" : "border-gray-700 bg-gray-800 hover:border-gray-500"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold truncate">{a.name || a.email}</p>
                  <p className="text-xs text-gray-400 truncate">{a.email}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!a.active && <Badge tone="red">Disabled</Badge>}
                  <Badge tone={ROLE_INFO[a.role]?.tone || "gray"}>{ROLE_INFO[a.role]?.label || a.role}</Badge>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="text-emerald-300">{a.created} created</span>
                <span className="text-sky-300">{a.updated} edited</span>
                <span className="text-red-300">{a.deleted} deleted</span>
                {a.failedLogins > 0 && <span className="text-yellow-300">{a.failedLogins} failed sign-ins</span>}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Last active: {a.lastActivityAt ? fmtDate(a.lastActivityAt, true) : "no activity yet"}
              </p>
            </button>
          );
        })}
      </div>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-700 flex flex-wrap gap-3 items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search titles, people…" className="w-full sm:w-64" />
          <div className="w-44">
            <Select
              value={filters.userId}
              onChange={(e) => setFilter("userId", e.target.value)}
              options={[{ value: "", label: "All accounts" }, ...accounts.map((a) => ({ value: String(a.id), label: a.email }))]}
            />
          </div>
          <div className="w-40">
            <Select
              value={filters.action}
              onChange={(e) => setFilter("action", e.target.value)}
              options={[{ value: "", label: "All actions" }, ...Object.entries(ACTIONS).map(([value, a]) => ({ value, label: a.label }))]}
            />
          </div>
          <div className="w-44">
            <Select
              value={filters.entityType}
              onChange={(e) => setFilter("entityType", e.target.value)}
              options={[{ value: "", label: "All areas" }, ...(log.data?.entityTypes || []).map((t) => ({ value: t, label: t }))]}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Input type="date" value={filters.from} onChange={(e) => setFilter("from", e.target.value)} aria-label="From date" />
            to
            <Input type="date" value={filters.to} onChange={(e) => setFilter("to", e.target.value)} aria-label="To date" />
          </div>
          {hasFilters && (
            <button onClick={() => { setSearch(""); setParams({}, { replace: true }); }} className="text-xs text-gray-400 hover:text-white underline">
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-gray-500">{total.toLocaleString()} {total === 1 ? "entry" : "entries"}</span>
        </div>

        <DataState
          loading={log.loading && !log.data}
          error={log.error}
          onRetry={log.reload}
          data={log.data}
          isEmpty={rows.length === 0}
          empty={<EmptyState title={hasFilters ? "Nothing matches these filters" : "No activity recorded yet"} description={hasFilters ? undefined : "Changes made in the admin console will appear here."} />}
        >
          <Table
            rows={rows}
            columns={[
              { key: "createdAt", label: "When", className: "whitespace-nowrap w-40", render: (a) => <span className="text-gray-400 text-xs">{fmtDate(a.createdAt, true)}</span> },
              {
                key: "user",
                label: "Who",
                render: (a) => (
                  <button onClick={() => a.userId && setFilter("userId", String(a.userId))} className="text-left">
                    <span className="block text-gray-200 text-sm">{a.userName || a.userEmail || "Unknown"}</span>
                    {a.userName && <span className="block text-[11px] text-gray-500">{a.userEmail}</span>}
                  </button>
                ),
              },
              {
                key: "action",
                label: "Action",
                render: (a) => {
                  const info = ACTIONS[a.action] || { label: a.action, tone: "gray" };
                  const Icon = info.icon;
                  return (
                    <Badge tone={info.tone}>
                      {Icon && <Icon className="w-3 h-3 mr-1" />}
                      {info.label}
                    </Badge>
                  );
                },
              },
              { key: "entityType", label: "Area", render: (a) => <span className="text-gray-300 text-xs">{a.entityType || "—"}</span> },
              { key: "summary", label: "Item / details", render: (a) => <span className="text-gray-200 text-sm">{a.summary || <span className="text-gray-500">—</span>}</span> },
            ]}
          />
          {rows.length < total && (
            <div className="p-4 border-t border-gray-700 text-center">
              <Button loading={log.loading} onClick={() => setLimit((l) => Math.min(l + PAGE, 200))} disabled={limit >= 200}>
                {limit >= 200 ? "Use the filters to narrow down older entries" : `Show more (${(total - rows.length).toLocaleString()} older)`}
              </Button>
            </div>
          )}
        </DataState>
      </Card>
    </div>
  );
}
