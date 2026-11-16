import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ExternalLink, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

const STATUS = {
  online: { dot: "bg-emerald-400", label: "Backend online" },
  offline: { dot: "bg-red-500", label: "Backend unreachable" },
  checking: { dot: "bg-gray-500 animate-pulse", label: "Checking backend…" },
};

export default function TopBar({ pageTitle, unreadMessages = 0, apiStatus = "checking" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const status = STATUS[apiStatus] || STATUS.checking;

  const name = user?.name || user?.email || "Admin";
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "AD";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30 shrink-0">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        <h2 className="text-xl font-semibold text-white truncate">{pageTitle}</h2>

        <div className="flex items-center gap-2">
          {/* Backend status */}
          <span
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300"
            title={apiStatus === "offline" ? "The admin console can't reach the backend. Check the Railway service and the VITE_API_URL setting." : undefined}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            View site <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Unread messages */}
          <Link
            to="/admin/messages"
            aria-label={`${unreadMessages} unread messages`}
            title={unreadMessages ? `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}` : "No unread messages"}
            className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-gray-900 text-[10px] font-bold flex items-center justify-center">
                {unreadMessages > 99 ? "99+" : unreadMessages}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-semibold text-sm">
                {initials}
              </div>
              <span className="hidden md:block text-left">
                <span className="block text-sm font-medium text-gray-200 leading-tight">{name}</span>
                <span className="block text-[11px] text-gray-500 leading-tight capitalize">{user?.role || "admin"}</span>
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
                  {user?.role === "superadmin" && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      Change password
                    </Link>
                  )}
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
    </header>
  );
}
