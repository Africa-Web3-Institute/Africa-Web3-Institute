import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { History, KeyRound, Pencil, Plus, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { authApi, usersApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, Notice, PageHeader,
  PasswordInput, SearchInput, Select, Table, fmtDate, rowsOf, useApiData, useCurrentUser,
} from "../ui";

export const ROLE_INFO = {
  superadmin: { label: "Superadmin", tone: "purple", description: "Everything, including superadmin accounts, settings and the activity log" },
  admin: { label: "Admin", tone: "blue", description: "All content, AWPII, inbox and newsletters; adds admins, editors and viewers" },
  editor: { label: "Editor", tone: "gray", description: "Create, edit and delete content; read messages and newsletter stats" },
  viewer: { label: "Viewer", tone: "green", description: "Dashboard and site analytics only; can't change anything" },
};
const roleOptions = (isSuperadmin) =>
  Object.entries(ROLE_INFO)
    .filter(([value]) => isSuperadmin || value !== "superadmin")
    .map(([value, r]) => ({ value, label: `${r.label} — ${r.description}` }));

export default function Users() {
  const { user: me, isSuperadmin, can } = useCurrentUser();
  const canManage = can("users.manage");
  const { data, loading, error, reload } = useApiData(() => (canManage ? usersApi.getAll() : Promise.resolve([])), [canManage]);
  const catalog = useApiData(() => (canManage ? authApi.permissions() : Promise.resolve(null)), [canManage]);
  // Admins can see superadmin accounts but not change them
  const canTouch = (u) => isSuperadmin || u.role !== "superadmin";
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // {} for new, user row for edit
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!canManage) {
    return (
      <div>
        <PageHeader title="User Management" />
        <Card><EmptyState title="Admin access required" description="Only admins and superadmins can manage accounts. You can change your own password from the menu under your name (top right)." /></Card>
      </div>
    );
  }

  const rows = rowsOf(data).filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(query.trim().toLowerCase()));
  const permLabel = Object.fromEntries((catalog.data?.permissions || []).map((p) => [p.key, p.label]));

  const remove = async () => {
    setBusy(true);
    try {
      await usersApi.remove(toDelete.id);
      toast.success("User removed");
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (u) => {
    try {
      await usersApi.update(u.id, { active: !u.active });
      toast.success(u.active ? `${u.email} can no longer sign in` : `${u.email} can sign in again`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Who can sign in to the admin console, their role, and anything they're specifically allowed or denied."
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>Add user</Button>}
      />
      <Notice>
        <ShieldCheck className="w-4 h-4 inline -mt-0.5 mr-1" />
        Changes take effect immediately, even for people who are already signed in.
        {isSuperadmin ? (
          <> Everything each account does is recorded in the <Link to="/admin/activity" className="underline text-sky-300">Activity Log</Link>.</>
        ) : (
          <> Superadmin accounts can only be changed by a superadmin.</>
        )}
      </Notice>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-700">
          <SearchInput value={query} onChange={setQuery} placeholder="Search users…" className="max-w-md" />
        </div>
        <DataState loading={loading} error={error} onRetry={reload} data={data} isEmpty={rows.length === 0} empty={<EmptyState title="No users found" />}>
          <Table
            rows={rows}
            columns={[
              {
                key: "name",
                label: "Account",
                render: (u) => (
                  <div>
                    <p className="text-white">
                      {u.name || "—"} {Number(u.id) === Number(me?.id) && <Badge tone="yellow">You</Badge>}
                    </p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                ),
              },
              {
                key: "role",
                label: "Role",
                render: (u) => {
                  const custom = Object.entries(u.overrides || {});
                  return (
                    <div className="space-y-1">
                      <Badge tone={ROLE_INFO[u.role]?.tone || "gray"}>{ROLE_INFO[u.role]?.label || u.role}</Badge>
                      {custom.length > 0 && (
                        <p className="text-[11px] text-gray-400 leading-snug">
                          {custom.map(([k, v]) => (
                            <span key={k} className={`mr-2 ${v ? "text-emerald-300" : "text-red-300"}`}>{v ? "+" : "−"} {permLabel[k] || k}</span>
                          ))}
                        </p>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "active",
                label: "Status",
                render: (u) => (u.active ? <Badge tone="green">Active</Badge> : <Badge tone="red">Disabled</Badge>),
              },
              { key: "lastLoginAt", label: "Last sign-in", render: (u) => (u.lastLoginAt ? fmtDate(u.lastLoginAt, true) : <span className="text-gray-500">Never</span>) },
              {
                key: "actions",
                label: "",
                className: "text-right w-48",
                render: (u) => !canTouch(u) ? (
                  <span className="text-[11px] text-gray-500">Superadmin only</span>
                ) : (
                  <div className="flex justify-end items-center gap-1">
                    {Number(u.id) !== Number(me?.id) && (
                      <button onClick={() => toggleActive(u)} className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700">
                        {u.active ? "Disable" : "Enable"}
                      </button>
                    )}
                    {isSuperadmin && (
                      <Link to={`/admin/activity?userId=${u.id}`} title="View activity" aria-label="View activity" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                        <History className="w-4 h-4" />
                      </Link>
                    )}
                    <IconButton icon={KeyRound} label="Set password" onClick={() => setEditing({ ...u, passwordOnly: true })} />
                    <IconButton icon={Pencil} label="Edit role & permissions" onClick={() => setEditing(u)} />
                    {Number(u.id) !== Number(me?.id) && <IconButton icon={Trash2} tone="danger" label="Remove" onClick={() => setToDelete(u)} />}
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>

      {editing && <UserForm user={editing} catalog={catalog.data} isSuperadmin={isSuperadmin} onClose={() => setEditing(null)} onSaved={reload} />}
      <ConfirmDialog
        open={!!toDelete}
        title="Remove user?"
        message={`${toDelete?.email} will no longer be able to sign in. Their past activity stays in the log. (To block them temporarily, use Disable instead.)`}
        confirmLabel="Remove"
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
}

function UserForm({ user, catalog, isSuperadmin, onClose, onSaved }) {
  const isNew = !user.id;
  const passwordOnly = !!user.passwordOnly;
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", role: user.role || "editor", password: "", confirm: "" });
  const [overrides, setOverrides] = useState(user.overrides || {});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const permissions = catalog?.permissions || [];
  const defaults = useMemo(() => new Set(catalog?.roleDefaults?.[form.role] || []), [catalog, form.role]);
  const isOn = (key) => (key in overrides ? overrides[key] : defaults.has(key));

  // Store only the differences from the role's defaults
  const toggle = (key) => {
    const next = !isOn(key);
    const copy = { ...overrides };
    if (next === defaults.has(key)) delete copy[key];
    else copy[key] = next;
    setOverrides(copy);
  };
  const cleanOverrides = () => Object.fromEntries(Object.entries(overrides).filter(([k, v]) => v !== defaults.has(k)));

  const groups = permissions.reduce((acc, p) => ((acc[p.group] = acc[p.group] || []).push(p), acc), {});

  const submit = async () => {
    if (!passwordOnly && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Enter a valid email address");
    if ((isNew || passwordOnly) && form.password.length < 10) return toast.error("Use a password of at least 10 characters");
    if (form.password && form.password.length < 10) return toast.error("Use a password of at least 10 characters");
    if (form.password && form.password !== form.confirm) return toast.error("The passwords don't match");
    setBusy(true);
    try {
      const payload = passwordOnly
        ? { password: form.password }
        : {
            name: form.name,
            email: form.email.trim().toLowerCase(),
            role: form.role,
            permissions: form.role === "superadmin" ? {} : cleanOverrides(),
            ...(form.password ? { password: form.password } : {}),
          };
      if (isNew) await usersApi.create(payload);
      else await usersApi.update(user.id, payload);
      toast.success(isNew ? "User added" : passwordOnly ? "Password set" : "User updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const customCount = Object.keys(cleanOverrides()).length;

  return (
    <Modal
      open
      wide={!passwordOnly}
      title={isNew ? "Add user" : passwordOnly ? `Set password · ${user.email}` : `Edit ${user.email}`}
      onClose={onClose}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>{isNew ? "Add user" : "Save"}</Button></>}
    >
      {!passwordOnly && (
        <>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Name"><Input value={form.name} onChange={set("name")} /></Field>
            <Field label="Email" required><Input type="email" value={form.email} onChange={set("email")} /></Field>
          </div>
          <Field label="Role"><Select value={form.role} onChange={set("role")} options={roleOptions(isSuperadmin)} /></Field>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-300">
                Permissions {customCount > 0 && <span className="text-yellow-300 font-normal">· {customCount} changed from the {ROLE_INFO[form.role]?.label} defaults</span>}
              </p>
              {form.role !== "superadmin" && customCount > 0 && (
                <button type="button" onClick={() => setOverrides({})} className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-white">
                  <RotateCcw className="w-3 h-3" /> Reset to role defaults
                </button>
              )}
            </div>
            {form.role === "superadmin" ? (
              <p className="text-xs text-gray-400 rounded-lg border border-gray-700 px-3 py-2.5">
                Superadmins always have every permission, and can manage accounts and see the activity log.
              </p>
            ) : !catalog ? (
              <p className="text-xs text-gray-400">Loading permissions…</p>
            ) : (
              <div className="rounded-lg border border-gray-700 divide-y divide-gray-700">
                {Object.entries(groups).map(([group, perms]) => (
                  <div key={group} className="px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{group}</p>
                    {perms.map((p) => {
                      const on = isOn(p.key);
                      const changed = p.key in overrides && overrides[p.key] !== defaults.has(p.key);
                      return (
                        <label key={p.key} className="flex items-start gap-3 py-1.5 cursor-pointer">
                          <input type="checkbox" checked={on} onChange={() => toggle(p.key)} className="mt-0.5 accent-yellow-500" />
                          <span className="flex-1">
                            <span className="text-sm text-gray-200">{p.label}</span>
                            {changed && <span className={`ml-2 text-[10px] font-semibold ${on ? "text-emerald-300" : "text-red-300"}`}>{on ? "ALLOWED" : "DENIED"}</span>}
                            <span className="block text-[11px] text-gray-500">{p.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ))}
                <p className="px-3 py-2 text-[11px] text-gray-500">Managing accounts comes with the Admin role. The activity log is for superadmins only.</p>
              </div>
            )}
          </div>
        </>
      )}
      <Field label={isNew ? "Password" : "New password"} required={isNew || passwordOnly} hint={!isNew && !passwordOnly ? "Leave blank to keep the current password." : "At least 10 characters. Share it privately; they can change it from the menu under their name."}>
        <PasswordInput autoComplete="new-password" value={form.password} onChange={set("password")} />
      </Field>
      {(form.password || isNew || passwordOnly) && (
        <Field label="Confirm password"><PasswordInput autoComplete="new-password" value={form.confirm} onChange={set("confirm")} /></Field>
      )}
    </Modal>
  );
}
