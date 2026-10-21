import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SideBar,TopBar } from "../components";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/adminpublications": "Publications",
  "/admin/analytics": "Analytics",
  "/admin/articles": "Articles",
  "/admin/reports": "Reports",
  "/admin/events": "Events",
  "/admin/awpii": "AWPII Data",
  "/admin/tracker": "Regulatory Tracker",
  "/admin/enforcement": "Enforcement Watch",
  "/admin/users": "User Management",
  "/admin/settings": "Settings",
  "/admin/policy-tracker": "Policy Tracker",
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("awi_admin_user");
    if (!user) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}