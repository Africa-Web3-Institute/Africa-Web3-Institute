import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { SideBar,TopBar } from "../components";
import { contactApi, systemApi } from "../../api/api";

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
  "/admin/settings": "Settings",
};

const POLL_MS = 30000;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [apiStatus, setApiStatus] = useState("checking"); // checking | online | offline
  const navigate = useNavigate();
  const location = useLocation();

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
    try {
      const res = await contactApi.getAll("unread");
      setUnreadMessages(Number(res?.unreadCount) || 0);
    } catch {
      /* the Messages page shows its own error */
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus, location.pathname]);

  useEffect(() => {
    const id = setInterval(refreshStatus, POLL_MS);
    return () => clearInterval(id);
  }, [refreshStatus]);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} badges={{ unreadMessages }} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar pageTitle={pageTitle} unreadMessages={unreadMessages} apiStatus={apiStatus} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </div>
  );
}
