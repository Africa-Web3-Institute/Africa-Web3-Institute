import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { SideBar,TopBar } from "../components";
import CommandPalette from "../components/CommandPalette";
import { NAV_SECTIONS } from "../components/SideBar";
import { authApi, contactApi, systemApi } from "../../api/api";
import { useAuth } from "../../lib/AuthContext";
import { useCurrentUser } from "../ui";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/messages": "Messages",
  "/admin/adminpublications": "Publications",
  "/admin/articles": "Articles & Blogs",
  "/admin/events": "Events",
  "/admin/newsletter": "Newsletter",
  "/admin/policy-tracker": "AWPII & Tracker",
  "/admin/enforcement": "Enforcement Watch",
  "/admin/state-of-web3": "State of Web3",
  "/admin/research": "Research Impact",
  "/admin/visualizations": "Visualizations",
  "/admin/analytics": "Site Analytics",
  "/admin/users": "User Management",
  "/admin/activity": "Activity Log",
  "/admin/settings": "Settings",
};

const POLL_MS = 30000;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [apiStatus, setApiStatus] = useState("checking"); // checking | online | offline
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Light / dark theme for the console: remembered per browser, first visit follows the device
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("awi_admin_theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch { /* storage unavailable */ }
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      try { localStorage.setItem("awi_admin_theme", next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Ctrl+K / ⌘K opens "Jump to…"
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => setPaletteOpen(false), [location.pathname]);
  // Close the phone menu after choosing a page
  useEffect(() => setMobileNav(false), [location.pathname]);
  const { updateUser } = useAuth();
  const { can } = useCurrentUser();
  const canReadMessages = can("messages.view");

  useEffect(() => {
    const user = localStorage.getItem("awi_admin_user");
    if (!user) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Backend health + unread message count, refreshed on navigation and every 30s
  const refreshStatus = useCallback(async () => {
    try {
      await systemApi.health();
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
      return;
    }
    // Pick up role / permission changes a superadmin made since sign-in
    try {
      const res = await authApi.me();
      if (res?.user) updateUser({ role: res.user.role, permissions: res.user.permissions, name: res.user.name, email: res.user.email });
    } catch {
      /* a 401 here signs the user out (handled in api.js) */
    }
    if (!canReadMessages) return;
    try {
      const res = await contactApi.getAll("unread");
      setUnreadMessages(Number(res?.unreadCount) || 0);
    } catch {
      /* the Messages page shows its own error */
    }
  }, [updateUser, canReadMessages]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus, location.pathname]);

  useEffect(() => {
    const id = setInterval(refreshStatus, POLL_MS);
    return () => clearInterval(id);
  }, [refreshStatus]);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";
  const section = NAV_SECTIONS.find((s) => s.items.some((i) => i.href === location.pathname))?.label;

  return (
    <div className="admin-root flex h-screen overflow-hidden bg-gray-900" data-theme={theme}>
      {mobileNav && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileNav(false)} aria-hidden="true" />}
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} badges={{ unreadMessages }} mobileOpen={mobileNav} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          pageTitle={pageTitle}
          section={section}
          unreadMessages={unreadMessages}
          apiStatus={apiStatus}
          onMenu={() => setMobileNav(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSearch={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} theme={theme} onToggleTheme={toggleTheme} />
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </div>
  );
}
