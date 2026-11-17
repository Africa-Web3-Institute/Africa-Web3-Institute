// Settings: every account's own profile and password, plus site-wide values for
// accounts allowed to manage them. Completing the profile (name + job title) and
// replacing a password someone else set are required before using the console.
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Circle, KeyRound, Plus, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { authApi, settingsApi } from "../../api/api";
import { useAuth } from "../../lib/AuthContext";
import { Badge, Button, Card, DataState, Field, IconButton, Input, Notice, PageHeader, PasswordInput, Textarea, fmtDate, useApiData, useCurrentUser } from "../ui";

const ROLE = {
  superadmin: { label: "Superadmin", tone: "purple" },
  admin: { label: "Admin", tone: "blue" },
  editor: { label: "Editor", tone: "gray" },
  viewer: { label: "Viewer", tone: "green" },
};

export default function Settings() {
  const { user, can } = useCurrentUser();
  const { updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mustChangePassword = !!user?.mustChangePassword;
  const profileComplete = user?.profileComplete !== false;
  const setupNeeded = mustChangePassword || !profileComplete;

  useEffect(() => {
    if (location.hash === "#security") document.getElementById("security")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  const done = (patch) => {
    updateUser(patch);
    const next = { ...user, ...patch };
    if (!next.mustChangePassword && next.profileComplete !== false && setupNeeded) {
      toast.success("All set. Welcome to the AWI admin console.");
      navigate("/admin");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Settings" description="Your profile, your password and how you appear to the team." />

      {setupNeeded && (
        <div className="mb-6 rounded-2xl border border-yellow-500/40 bg-yellow-500/[0.07] p-5">
          <p className="text-sm font-semibold text-white">Finish setting up your account to continue</p>
          <p className="text-xs text-gray-400 mt-1">These steps are required before you can use the rest of the console.</p>
          <ul className="mt-3 space-y-2 text-sm">
            <Step done={profileComplete} label="Complete your profile (full name and job title)" />
            <Step done={!mustChangePassword} label="Replace the password you were given with your own" />
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <ProfileCard user={user} onSaved={done} highlight={!profileComplete} />
        <SecurityCard mustChange={mustChangePassword} onChanged={done} />
        {can("settings.manage") && !setupNeeded && <SiteSettings />}
      </div>
    </div>
  );
}

function Step({ done, label }) {
  return (
    <li className={`flex items-center gap-2 ${done ? "text-emerald-300" : "text-gray-200"}`}>
      {done ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 text-yellow-400" />}
      <span className={done ? "line-through opacity-80" : ""}>{label}</span>
    </li>
  );
}

/* ── Profile ────────────────────────────────────────────────────────────── */

function ProfileCard({ user, onSaved, highlight }) {
  const [form, setForm] = useState({ name: "", jobTitle: "", phone: "", bio: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setForm({ name: user?.name && !/^(super)?admin$/i.test(user.name) ? user.name : "", jobTitle: user?.jobTitle || "", phone: user?.phone || "", bio: user?.bio || "" });
  }, [user?.id, user?.name, user?.jobTitle, user?.phone, user?.bio]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const role = ROLE[user?.role] || { label: user?.role, tone: "gray" };
  const initials = (form.name || user?.email || "?").split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

  const save = async () => {
    if (form.name.trim().length < 2) return toast.error("Enter your full name");
    if (form.jobTitle.trim().length < 2) return toast.error("Enter your job title");
    setBusy(true);
    try {
      const res = await authApi.updateProfile(form);
      toast.success("Profile saved");
      const u = res?.user || {};
      onSaved({ name: u.name, jobTitle: u.jobTitle, phone: u.phone, bio: u.bio, profileComplete: u.profileComplete });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`rounded-2xl border bg-gray-800 ${highlight ? "border-yellow-500/50" : "border-gray-700"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-700 p-5">
        <span className="w-16 h-16 rounded-2xl bg-yellow-500 text-black flex items-center justify-center text-xl font-extrabold shrink-0">{initials || <UserRound />}</span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-white truncate">{form.name || "Your name"}</p>
          <p className="text-sm text-gray-400 truncate">{form.jobTitle || "Your job title"} · {user?.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <Badge tone={role.tone}>{role.label}</Badge>
            {user?.createdAt && <span>Member since {fmtDate(user.createdAt)}</span>}
            {user?.lastLoginAt && <span>· Last sign-in {fmtDate(user.lastLoginAt, true)}</span>}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><UserRound className="w-4 h-4 text-yellow-400" /> Profile</h2>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4 mb-4">
          <Field label="Full name" required><Input value={form.name} onChange={set("name")} placeholder="e.g. Yves Bambara" autoComplete="name" /></Field>
          <Field label="Job title" required><Input value={form.jobTitle} onChange={set("jobTitle")} placeholder="e.g. Research Lead" autoComplete="organization-title" /></Field>
          <Field label="Email" hint="Used to sign in. Ask your administrator to change it."><Input value={user?.email || ""} disabled /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={set("phone")} placeholder="+233 …" autoComplete="tel" /></Field>
        </div>
        <Field className="mb-4" label="Short bio" hint={`${form.bio.length}/300 · Shown to your team only.`}>
          <Textarea value={form.bio} maxLength={300} onChange={set("bio")} placeholder="A line or two about your role at AWI" />
        </Field>
        <div className="flex justify-end">
          <Button variant="primary" icon={Save} loading={busy} onClick={save}>Save profile</Button>
        </div>
      </div>
    </section>
  );
}

/* ── Password ───────────────────────────────────────────────────────────── */

function SecurityCard({ mustChange, onChanged }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (form.next.length < 10) return toast.error("Use a new password of at least 10 characters");
    if (form.next !== form.confirm) return toast.error("The new passwords don't match");
    setBusy(true);
    try {
      const res = await authApi.changePassword(form.current, form.next);
      toast.success("Password changed. Any other signed-in devices have been signed out.");
      setForm({ current: "", next: "", confirm: "" });
      onChanged({ ...(res?.token ? { token: res.token } : {}), mustChangePassword: false });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="security" className={`rounded-2xl border bg-gray-800 p-5 scroll-mt-6 ${mustChange ? "border-yellow-500/50" : "border-gray-700"}`}>
      <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2"><KeyRound className="w-4 h-4 text-yellow-400" /> Password</h2>
      <p className="text-xs text-gray-400 mb-4">
        {mustChange
          ? "You're signed in with a password someone else set. Choose your own to continue."
          : "Changing your password signs you out on your other devices."}
      </p>
      <div className="grid sm:grid-cols-3 gap-x-4 gap-y-4 mb-4">
        <Field label={mustChange ? "Password you were given" : "Current password"} required>
          <PasswordInput autoComplete="current-password" value={form.current} onChange={set("current")} />
        </Field>
        <Field label="New password" required hint="At least 10 characters.">
          <PasswordInput autoComplete="new-password" value={form.next} onChange={set("next")} />
        </Field>
        <Field label="Confirm new password" required>
          <PasswordInput autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
        </Field>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-gray-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Common passwords are refused.</p>
        <Button variant="primary" icon={KeyRound} loading={busy} onClick={submit}>Change password</Button>
      </div>
    </section>
  );
}

/* ── Site settings (accounts with "Manage settings") ───────────────────── */

// Common settings shown as named fields; anything else appears under "Custom settings"
const KNOWN = [
  { key: "site_name", label: "Site name", placeholder: "Africa Web3 Institute" },
  { key: "contact_email", label: "Contact email", placeholder: "info@africaweb3institute.org", type: "email" },
  { key: "partnerships_email", label: "Partnerships email", placeholder: "partnerships@africaweb3institute.org", type: "email" },
  { key: "media_email", label: "Media email", placeholder: "media@africaweb3institute.org", type: "email" },
];

function SiteSettings() {
  const { data, loading, error, reload } = useApiData(() => settingsApi.get(), []);
  const [values, setValues] = useState({});
  const [custom, setCustom] = useState([]); // [{ key, value }]
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = data?.data || {};
    setValues(s);
    setCustom(Object.entries(s).filter(([k]) => !KNOWN.some((f) => f.key === k)).map(([key, value]) => ({ key, value })));
  }, [data]);

  const save = async () => {
    const payload = {};
    KNOWN.forEach((f) => { if (values[f.key] !== undefined) payload[f.key] = values[f.key]; });
    for (const row of custom) {
      const key = row.key.trim();
      if (!key) continue;
      if (!/^[a-z0-9_]+$/i.test(key)) return toast.error(`"${key}" — use letters, numbers and underscores only`);
      payload[key] = row.value;
    }
    setBusy(true);
    try {
      await settingsApi.update(payload);
      toast.success("Site settings saved");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 pt-2">
        <div>
          <h2 className="text-base font-semibold text-white">Site settings</h2>
          <p className="text-xs text-gray-400">Site-wide values stored in the backend.</p>
        </div>
        <Button variant="primary" icon={Save} loading={busy} onClick={save}>Save site settings</Button>
      </div>
      <Notice>
        The public website doesn't read these values yet: changing an email here won't change the address shown on the Contact page until the site is connected to them.
      </Notice>
      <DataState loading={loading} error={error} onRetry={reload} data={data}>
        <div className="space-y-6">
          <Card title="General">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {KNOWN.map((f) => (
                <Field key={f.key} label={f.label}>
                  <Input type={f.type || "text"} placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                </Field>
              ))}
            </div>
          </Card>
          <Card title="Custom settings" actions={<Button icon={Plus} onClick={() => setCustom([...custom, { key: "", value: "" }])}>Add setting</Button>}>
            {custom.length === 0 ? (
              <p className="text-sm text-gray-500">No custom settings.</p>
            ) : (
              <div className="space-y-3">
                {custom.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-2/5"><Input placeholder="key_name" value={row.key} onChange={(e) => setCustom(custom.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))} /></div>
                    <div className="flex-1"><Input placeholder="Value" value={row.value ?? ""} onChange={(e) => setCustom(custom.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))} /></div>
                    <IconButton icon={Trash2} tone="danger" label="Remove from form" onClick={() => setCustom(custom.filter((_, j) => j !== i))} />
                  </div>
                ))}
                <p className="text-xs text-gray-500">Removing a row only drops it from this form; the backend has no delete for settings, so a saved value stays until you overwrite it.</p>
              </div>
            )}
          </Card>
        </div>
      </DataState>
    </div>
  );
}
