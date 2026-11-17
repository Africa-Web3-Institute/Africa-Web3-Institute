import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { settingsApi } from "../../api/api";
import { Button, Card, DataState, EmptyState, Field, IconButton, Input, Notice, PageHeader, useApiData, useCurrentUser } from "../ui";

// Common settings shown as named fields; anything else appears under "Custom settings"
const KNOWN = [
  { key: "site_name", label: "Site name", placeholder: "Africa Web3 Institute" },
  { key: "contact_email", label: "Contact email", placeholder: "info@africaweb3institute.org", type: "email" },
  { key: "partnerships_email", label: "Partnerships email", placeholder: "partnerships@africaweb3institute.org", type: "email" },
  { key: "media_email", label: "Media email", placeholder: "media@africaweb3institute.org", type: "email" },
];

export default function Settings() {
  const { can } = useCurrentUser();
  const allowed = can("settings.manage");
  const { data, loading, error, reload } = useApiData(() => (allowed ? settingsApi.get() : Promise.resolve({ data: {} })), [allowed]);
  const [values, setValues] = useState({});
  const [custom, setCustom] = useState([]); // [{ key, value }]
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = data?.data || {};
    setValues(s);
    setCustom(Object.entries(s).filter(([k]) => !KNOWN.some((f) => f.key === k)).map(([key, value]) => ({ key, value })));
  }, [data]);

  if (!allowed) {
    return (
      <div>
        <PageHeader title="Settings" />
        <Card><EmptyState title="Settings access required" description="Your account doesn't have permission to change site settings. A superadmin can grant it in User Management." /></Card>
      </div>
    );
  }

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
      toast.success("Settings saved");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" description="Site-wide values stored in the backend." actions={<Button variant="primary" icon={Save} loading={busy} onClick={save}>Save settings</Button>} />
      <Notice>
        Settings are saved in the backend, but the public website doesn't read them yet — changing an email here
        won't change the address shown on the Contact page until the site is connected to these values.
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
