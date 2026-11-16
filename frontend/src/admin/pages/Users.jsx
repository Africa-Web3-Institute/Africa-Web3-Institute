import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { usersApi } from "../../api/api";
import {
  Badge, Button, Card, ConfirmDialog, DataState, EmptyState, Field, IconButton, Input, Modal, Notice, PageHeader,
  SearchInput, Select, Table, fmtDate, rowsOf, useApiData, useCurrentUser,
} from "../ui";

const ROLES = [
  { value: "editor", label: "Editor — manage content" },
  { value: "superadmin", label: "Superadmin — full access, users and settings" },
];

export default function Users() {
  const { user: me, isSuperadmin } = useCurrentUser();
  const { data, loading, error, reload } = useApiData(() => (isSuperadmin ? usersApi.getAll() : Promise.resolve([])), [isSuperadmin]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // {} for new, user row for edit
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!isSuperadmin) {
    return (
      <div>
        <PageHeader title="User Management" />
        <Card><EmptyState title="Superadmin access required" description="Only superadmins can manage admin accounts. Ask a superadmin to change your role or password." /></Card>
      </div>
    );
  }

  const rows = rowsOf(data).filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.trim().toLowerCase()));

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

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Who can sign in to the admin console, and what they can do."
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing({})}>Add user</Button>}
      />
      <Notice>
        <ShieldCheck className="w-4 h-4 inline -mt-0.5 mr-1" />
        If you still sign in with the default password <code className="text-yellow-300">admin</code>, change it now with the key icon next to your account.
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
                label: "Name",
                render: (u) => (
                  <span className="text-white">
                    {u.name || "—"} {Number(u.id) === Number(me?.id) && <Badge tone="yellow">You</Badge>}
                  </span>
                ),
              },
              { key: "email", label: "Email" },
              { key: "role", label: "Role", render: (u) => <Badge tone={u.role === "superadmin" ? "purple" : "gray"}>{u.role}</Badge> },
              { key: "createdAt", label: "Added", render: (u) => fmtDate(u.createdAt) },
              {
                key: "actions",
                label: "",
                className: "text-right w-28",
                render: (u) => (
                  <div className="flex justify-end gap-1">
                    <IconButton icon={KeyRound} label="Change password" onClick={() => setEditing({ ...u, passwordOnly: true })} />
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(u)} />
                    <IconButton icon={Trash2} tone="danger" label="Remove" onClick={() => setToDelete(u)} />
                  </div>
                ),
              },
            ]}
          />
        </DataState>
      </Card>

      {editing && <UserForm user={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      <ConfirmDialog
        open={!!toDelete}
        title="Remove user?"
        message={`${toDelete?.email} will no longer be able to sign in.`}
        confirmLabel="Remove"
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
}

function UserForm({ user, onClose, onSaved }) {
  const isNew = !user.id;
  const passwordOnly = !!user.passwordOnly;
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", role: user.role || "editor", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Enter a valid email address");
    if ((isNew || passwordOnly) && form.password.length < 10) return toast.error("Use a password of at least 10 characters");
    if (form.password && form.password !== form.confirm) return toast.error("The passwords don't match");
    setBusy(true);
    try {
      // The update endpoint replaces email, name and role, so always send all three
      const payload = { name: form.name, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) };
      if (isNew) await usersApi.create(payload);
      else await usersApi.update(user.id, payload);
      toast.success(isNew ? "User added" : passwordOnly ? "Password changed" : "User updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? "Add user" : passwordOnly ? `Change password · ${user.email}` : "Edit user"}
      onClose={onClose}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>{isNew ? "Add user" : "Save"}</Button></>}
    >
      {!passwordOnly && (
        <>
          <Field label="Name"><Input value={form.name} onChange={set("name")} /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={set("email")} /></Field>
          <Field label="Role"><Select value={form.role} onChange={set("role")} options={ROLES} /></Field>
        </>
      )}
      <Field label={isNew ? "Password" : "New password"} required={isNew || passwordOnly} hint={!isNew && !passwordOnly ? "Leave blank to keep the current password." : "At least 10 characters."}>
        <Input type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
      </Field>
      {(form.password || isNew || passwordOnly) && (
        <Field label="Confirm password"><Input type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} /></Field>
      )}
    </Modal>
  );
}
