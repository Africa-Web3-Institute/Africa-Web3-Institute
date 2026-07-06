import {
  FileText,
  BookOpen,
  BarChart2,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  {
    label: "Total Publications",
    value: "16",
    change: "+2 this month",
    icon: BookOpen,
    color: "#D4A017",
  },
  {
    label: "Articles Published",
    value: "13",
    change: "+3 this month",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    label: "Report Downloads",
    value: "1,240",
    change: "+18% this month",
    icon: Download,
    color: "#10b981",
  },
  {
    label: "Active Users",
    value: "3,200+",
    change: "+120 this week",
    icon: Users,
    color: "#8b5cf6",
  },
];

const RECENT_ACTIVITY = [
  {
    action: "Publication added",
    item: "State of Web3 Africa Q1 2026",
    time: "2 hours ago",
    type: "create",
  },
  {
    action: "Article updated",
    item: "Why Africa Needs Its Own Web3 Policy Framework",
    time: "5 hours ago",
    type: "update",
  },
  {
    action: "Enforcement event added",
    item: "CBN Issues Updated VASP Guidelines",
    time: "Yesterday",
    type: "create",
  },
  {
    action: "User registered",
    item: "new.member@example.com",
    time: "Yesterday",
    type: "user",
  },
  {
    action: "Report downloaded",
    item: "AWPII 2025 Annual Report",
    time: "2 days ago",
    type: "download",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Add Publication",
    href: "/admin/adminpublications",
    icon: BookOpen,
    color: "#D4A017",
  },
  {
    label: "Write Article",
    href: "/admin/articles",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    label: "Add Report",
    href: "/admin/reports",
    icon: BarChart2,
    color: "#10b981",
  },
  {
    label: "Add Enforcement Event",
    href: "/admin/enforcement",
    icon: TrendingUp,
    color: "#ef4444",
  },
];

const TYPE_COLORS = {
  create: {
    bg: "#052e16",
    text: "#4ade80",
    label: "Created",
  },
  update: {
    bg: "#172554",
    text: "#60a5fa",
    label: "Updated",
  },
  user: {
    bg: "#2e1065",
    text: "#c084fc",
    label: "User",
  },
  download: {
    bg: "#422006",
    text: "#fb923c",
    label: "Download",
  },
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div
        className="rounded-xl px-6 py-5 flex items-center justify-between"
        style={{
          backgroundColor: "#0B1437",
          border: "1px solid #1e3a5f",
        }}
      >
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "#D4A017" }}
          >
            Africa Web3 Institute
          </p>

          <h2 className="text-white text-xl font-bold">
            Welcome back!
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(212,160,23,0.15)",
              color: "#D4A017",
              border: "1px solid rgba(212,160,23,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Live — May 2026
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#1a1f2e",
                border: "1px solid #1f2937",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-medium">
                  {stat.label}
                </p>

                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${stat.color}20`,
                  }}
                >
                  <Icon
                    size={15}
                    style={{ color: stat.color }}
                  />
                </div>
              </div>

              <p className="text-white text-2xl font-bold">
                {stat.value}
              </p>

              <p
                className="text-xs mt-1 flex items-center gap-1"
                style={{ color: "#4ade80" }}
              >
                <ArrowUpRight size={12} />
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "#1a1f2e",
            border: "1px solid #1f2937",
          }}
        >
          <h3 className="text-white text-sm font-semibold mb-4">
            Quick Actions
          </h3>

          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${action.color}20`,
                    }}
                  >
                    <Icon
                      size={14}
                      style={{ color: action.color }}
                    />
                  </div>

                  <span className="text-gray-300">
                    {action.label}
                  </span>

                  <ArrowUpRight
                    size={12}
                    className="ml-auto text-gray-500"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{
            backgroundColor: "#1a1f2e",
            border: "1px solid #1f2937",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-semibold">
              Recent Activity
            </h3>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity) => {
              const tc =
                TYPE_COLORS[activity.type] ||
                TYPE_COLORS.create;

              return (
                <div
                  key={`${activity.type}-${activity.item}`}
                  className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  style={{
                    borderColor: "#1f2937",
                  }}
                >
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                    style={{
                      backgroundColor: tc.bg,
                      color: tc.text,
                    }}
                  >
                    {tc.label}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs font-medium truncate">
                      {activity.item}
                    </p>

                    <p className="text-gray-500 text-xs">
                      {activity.action}
                    </p>
                  </div>

                  <p className="text-gray-600 text-xs shrink-0">
                    {activity.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "#1a1f2e",
          border: "1px solid #1f2937",
        }}
      >
        <h3 className="text-white text-sm font-semibold mb-4">
          Platform Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Countries Tracked",
              value: "18",
              sub: "Regulatory Tracker",
            },
            {
              label: "Enforcement Events",
              value: "25",
              sub: "Enforcement Watch",
            },
            {
              label: "AWPII Nations",
              value: "18+",
              sub: "Policy Index",
            },
            {
              label: "Newsletter Subs",
              value: "—",
              sub: "Connect backend",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center"
            >
              <p
                className="text-2xl font-bold"
                style={{ color: "#D4A017" }}
              >
                {item.value}
              </p>

              <p className="text-gray-300 text-xs font-medium mt-1">
                {item.label}
              </p>

              <p className="text-gray-600 text-xs">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}