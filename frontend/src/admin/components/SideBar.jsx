import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart2,
  Calendar,
  Map,
  ShieldAlert,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,

} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Publications", href: "/admin/adminpublications", icon: BookOpen }
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AWPII Data", href: "/admin/awpii", icon: Map },
      { label: "Regulatory Tracker", href: "/admin/analytics", icon: BarChart2 },
      { label: "Enforcement Watch", href: "/admin/enforcement", icon: ShieldAlert },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function NavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-yellow-500/10 text-yellow-400"
            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full transition-opacity ${
              isActive ? "bg-yellow-400 opacity-100" : "opacity-0"
            }`}
          />
          <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          {!collapsed && <span className="truncate">{item.label}</span>}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-800 border border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function SideBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const {logout}=useAuth();
  const [logoutHover, setLogoutHover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-gray-900 border-r border-gray-800 transition-all duration-200 flex-shrink-0 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo / Brand */}
      <div className={`flex items-center gap-2.5 h-16 px-4 border-b border-gray-800 shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-gray-900 font-extrabold text-xs flex-shrink-0">
          AW
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">AWI Admin</p>
            <p className="text-gray-500 text-[11px] leading-tight truncate">Africa Web3 Institute</p>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p
                className="px-3 mb-2 font-bold uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "#6b7280",
                }}
              >
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — collapse toggle + logout */}
      <div className="border-t border-gray-800 p-3 space-y-1 shrink-0">
        <button
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          onClick={handleLogout}
          className="group relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          {!collapsed && <span>Sign out</span>}
          {collapsed && logoutHover && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-800 border border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-200 shadow-lg z-50">
              Sign out
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
