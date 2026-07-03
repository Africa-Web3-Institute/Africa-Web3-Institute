import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/SideBar";
import TopBar from "./components/TopBar";

const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/publications": "Publications",
  "/admin/articles": "Articles",
  "/admin/reports": "Reports",
  "/admin/events": "Events",
  "/admin/awpii": "AWPII Data",
  "/admin/analytics": "Regulatory Tracker",
  "/admin/enforcement": "Enforcement Watch",
  "/admin/users": "User Management",
  "/admin/settings": "Settings",
};

const PAGE_ICONS = {
  "/admin/dashboard": "📊",
  "/admin/publications": "📚",
  "/admin/articles": "📝",
  "/admin/reports": "📈",
  "/admin/events": "📅",
  "/admin/awpii": "📊",
  "/admin/analytics": "📍",
  "/admin/enforcement": "⚖️",
  "/admin/users": "👥",
  "/admin/settings": "⚙️",
};

export default function AdminApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Auth guard — check localStorage until real auth is wired
  useEffect(() => {
    const user = localStorage.getItem("awi_admin_user");
    if (!user) {
      navigate("/admin/login");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";
  const pageIcon = PAGE_ICONS[location.pathname] || "📋";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50 -z-10"></div>
      
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out">
        <TopBar pageTitle={pageTitle} pageIcon={pageIcon} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header with Animation */}
            <div className="mb-6 md:mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl md:text-3xl">{pageIcon}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {pageTitle}
                </h1>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                Welcome back! Here's what's happening with your {pageTitle.toLowerCase()} today.
              </p>
            </div>

            {/* Content with glassmorphism effect */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

 
    </div>
  );
}