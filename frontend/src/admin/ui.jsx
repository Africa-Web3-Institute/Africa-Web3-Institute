// Shared building blocks for the admin console, so every page has the same
// look and the same loading / empty / error behaviour.
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Eye, EyeOff, Inbox, Loader2, RefreshCw, Search, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

/* ── Data hook ──────────────────────────────────────────────────────────── */

// Runs `fetcher` on mount (and on reload()); exposes { data, loading, error, reload }.
export function useApiData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message || "Something went wrong" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload, setData: (data) => setState((s) => ({ ...s, data })) };
}

// Normalise the backend's mixed response shapes ({data:[...]}, [...]) to an array
export const rowsOf = (res) => (Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []);

// can("content.delete") — superadmins can do everything; everyone else gets the
// permissions the backend sent at sign-in (refreshed by AdminLayout every 30s).
// The backend enforces the same rules; this only hides buttons that would fail.
export function useCurrentUser() {
  const { user } = useAuth();
  const isSuperadmin = user?.role === "superadmin";
  const can = (key) => isSuperadmin || (Array.isArray(user?.permissions) && user.permissions.includes(key));
  return { user, isSuperadmin, can };
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

export const fmtNumber = (n) => (n === null || n === undefined || n === "" ? "—" : Number(n).toLocaleString());

export const fmtMoney = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
};

export const fmtDate = (value, withTime = false) => {
  if (!value) return "—";
  // SQLite CURRENT_TIMESTAMP is UTC without a zone marker
  const d = new Date(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value) ? value.replace(" ", "T") + "Z" : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, withTime
    ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "numeric", month: "short", year: "numeric" });
};

/* ── Layout ─────────────────────────────────────────────────────────────── */

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-gray-400 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, children, className = "", padded = true }) {
  return (
    <section className={`bg-gray-800 border border-gray-700 rounded-xl ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-700">
          {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
          {actions}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = "yellow" }) {
  const tones = {
    yellow: "bg-yellow-500/10 text-yellow-400",
    green: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-sky-500/10 text-sky-400",
    red: "bg-red-500/10 text-red-400",
    purple: "bg-violet-500/10 text-violet-400",
  };
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-start gap-4">
      {Icon && (
        <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Icon className="w-5 h-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 truncate">{value}</p>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-700 mb-6 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
            value === t.value ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          {t.label}
          {t.count !== undefined && t.count !== null && (
            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${value === t.value ? "bg-yellow-400/15" : "bg-gray-700"}`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Controls ───────────────────────────────────────────────────────────── */

export function Button({ variant = "secondary", icon: Icon, loading, children, className = "", ...props }) {
  const variants = {
    primary: "bg-yellow-500 text-black hover:bg-yellow-400",
    secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30",
    ghost: "text-gray-300 hover:bg-gray-700",
  };
  return (
    <button
      type="button"
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function IconButton({ icon: Icon, label, tone = "default", ...props }) {
  const tones = {
    default: "text-gray-400 hover:text-white hover:bg-gray-700",
    danger: "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
  };
  return (
    <button type="button" aria-label={label} title={label} className={`p-1.5 rounded-md transition-colors ${tones[tone]}`} {...props}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
      />
    </div>
  );
}

const inputCls =
  "w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-500/60";

export function Field({ label, hint, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-gray-300 mb-1.5">
        {label} {required && <span className="text-yellow-400">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

export const Input = (props) => <input className={inputCls} {...props} />;

// Password field with an eye button to show or hide what's typed
export function PasswordInput({ className = "", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <input {...props} type={visible ? "text" : "password"} className={`${className || inputCls} pr-10`} />
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setVisible((v) => !v); }}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </span>
  );
}
export const Textarea = (props) => <textarea className={`${inputCls} min-h-[110px] resize-y`} {...props} />;
export function Select({ options, ...props }) {
  return (
    <select className={inputCls} {...props}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}

export function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-700 text-gray-300",
    yellow: "bg-yellow-500/15 text-yellow-300",
    green: "bg-emerald-500/15 text-emerald-300",
    blue: "bg-sky-500/15 text-sky-300",
    red: "bg-red-500/15 text-red-300",
    purple: "bg-violet-500/15 text-violet-300",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

/* ── States ─────────────────────────────────────────────────────────────── */

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
      <Loader2 className="w-4 h-4 animate-spin" /> {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-14 px-4">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <div>
        <p className="text-sm font-medium text-white">Couldn't load this data</p>
        <p className="text-xs text-gray-400 mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-14 px-4">
      <Inbox className="w-8 h-8 text-gray-600" />
      <div>
        <p className="text-sm font-medium text-gray-200">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-1 max-w-md">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Renders the right state for a useApiData() result, otherwise children
export function DataState({ loading, error, onRetry, isEmpty, empty, children, data }) {
  if (loading && !data) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (isEmpty) return empty || <EmptyState />;
  return children;
}

export function Notice({ children, tone = "info" }) {
  const tones = {
    info: "border-sky-500/30 bg-sky-500/5 text-sky-200",
    warn: "border-yellow-500/30 bg-yellow-500/5 text-yellow-200",
  };
  return <div className={`rounded-lg border px-4 py-3 text-xs leading-relaxed mb-6 ${tones[tone]}`}>{children}</div>;
}

/* ── Table ──────────────────────────────────────────────────────────────── */

// columns: [{ key, label, render?(row), className? }]
export function Table({ columns, rows, rowKey = "id", onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-700">
            {columns.map((c) => (
              <th key={c.key} className={`px-5 py-3 font-medium ${c.className || ""}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[rowKey] ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-gray-700/60 last:border-0 ${onRowClick ? "cursor-pointer hover:bg-gray-700/40" : ""}`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-3 text-gray-300 align-top ${c.className || ""}`}>
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Dialogs ────────────────────────────────────────────────────────────── */

export function Modal({ open, title, onClose, children, footer, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={`relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} bg-gray-800 border border-gray-700 rounded-xl shadow-2xl my-8`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-700">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Delete", onConfirm, onCancel, busy }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="danger" loading={busy} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-300">{message}</p>
    </Modal>
  );
}
