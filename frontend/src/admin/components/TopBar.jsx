import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronRight, ExternalLink, KeyRound, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { authApi } from "../../api/api";
import { Button, Field, Modal, PasswordInput, useCurrentUser } from "../ui";

const ROLE_LABEL = { superadmin: "Superadmin", admin: "Admin", editor: "Editor", viewer: "Viewer" };

const STATUS = {
  online: { dot: "bg-emerald-400", label: "Backend online" },
  offline: { dot: "bg-red-500", label: "Backend unreachable" },
  checking: { dot: "bg-gray-500 animate-pulse", label: "Checking backend…" },
};

export default function TopBar({ pageTitle, section, unreadMessages = 0, apiStatus = "checking", onMenu, theme = "dark", onToggleTheme, onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  // "Change my password" from the Jump to… search
  useEffect(() => {
    const open = () => setPwOpen(true);
    window.addEventListener("awi:change-password", open);
    return () => window.removeEventListener("awi:change-password", open);
  }, []);
  const { logout, user } = useAuth();
  const { can } = useCurrentUser();
  const navigate = useNavigate();
  const status = STATUS[apiStatus] || STATUS.checking;

  const name = (user?.name && !/^(super)?admin$/i.test(user.name) ? user.name : "") || user?.email || "Admin";
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "AD";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30 shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onMenu} aria-label="Open menu" className="lg:hidden -ml-1 p-2 rounded-lg text-gray-300 hover:bg-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            {section && (
              <p className="hidden sm:flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-gray-500 leading-none mb-1">
                {section} <ChevronRight className="w-3 h-3" />
              </p>
            )}
            <h2 className="text-lg sm:text-xl font-semibold text-white truncate leading-tight">{pageTitle}</h2>
          </div>
        </div>

        {/* Jump to… */}
        <button
          onClick={onSearch}
          className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-4 rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Jump to a page or action…</span>
          <kbd className="ml-auto rounded border border-gray-600 px-1.5 py-0.5 text-[10px] font-sans">Ctrl K</kbd>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={onSearch} aria-label="Jump to a page" className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
            <Search className="w-5 h-5" />
          </button>
          {/* Backend status */}
          <span
            className="hidden xl:inline-flex items-center gap-2 rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300"
            title={apiStatus === "offline" ? "The admin console can't reach the backend. Check the Railway service and the VITE_API_URL setting." : undefined}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            View site <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Light / dark */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Unread messages */}
          {can("messages.view") && (
          <Link
            to="/admin/messages"
            aria-label={`${unreadMessages} unread messages`}
            title={unreadMessages ? `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}` : "No unread messages"}
            className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center">
                {unreadMessages > 99 ? "99+" : unreadMessages}
              </span>
            )}
          </Link>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold text-sm">
                {initials}
              </div>
              <span className="hidden md:block text-left">
                <span className="block text-sm font-medium text-gray-200 leading-tight">{name}</span>
                <span className="block text-[11px] text-gray-500 leading-tight">{ROLE_LABEL[user?.role] || user?.role || "Admin"}</span>
              </span>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white truncate">{name}</p>
                    {user?.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
                  </div>
                  <button
                    onClick={() => { setIsDropdownOpen(false); setPwOpen(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
    </header>
  );
}

function ChangePasswordModal({ onClose }) {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (form.next.length < 10) return toast.error("Use a new password of at least 10 characters");
    if (form.next !== form.confirm) return toast.error("The new passwords don't match");
    setBusy(true);
    try {
      const res = await authApi.changePassword(form.current, form.next);
      if (res?.token) updateUser({ token: res.token });
      toast.success("Password changed. Any other signed-in devices have been signed out.");
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
      title="Change your password"
      onClose={onClose}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={submit}>Change password</Button></>}
    >
      <Field label="Current password" required>
        <PasswordInput autoComplete="current-password" value={form.current} onChange={set("current")} />
      </Field>
      <Field label="New password" required hint="At least 10 characters.">
        <PasswordInput autoComplete="new-password" value={form.next} onChange={set("next")} />
      </Field>
      <Field label="Confirm new password" required>
        <PasswordInput autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
      </Field>
    </Modal>
  );
}
