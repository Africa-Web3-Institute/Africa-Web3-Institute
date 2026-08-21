import { useState, useEffect } from "react";
import {
  FileText,
  BookOpen,
  BarChart2,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { publicationsApi, enforcementApi, awpiiApi, trackerApi } from "../../api/api";

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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    publications: null,
    enforcement: null,
    awpii: null,
    tracker: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      setLoading(true);
      // Each call is independent -- one endpoint failing shouldn't blank
      // out the cards that did load successfully.
      const [publications, enforcement, awpii, tracker] = await Promise.all([
        publicationsApi.getAll().catch((err) => { console.error("Failed to load publications", err); return null; }),
        enforcementApi.getAll().catch((err) => { console.error("Failed to load enforcement events", err); return null; }),
        awpiiApi.getAll().catch((err) => { console.error("Failed to load AWPII data", err); return null; }),
        trackerApi.getAll().catch((err) => { console.error("Failed to load tracker data", err); return null; }),
      ]);

      if (cancelled) return;

      setCounts({
        publications: Array.isArray(publications?.data) ? publications.data.length : null,
        enforcement: Array.isArray(enforcement?.data) ? enforcement.data.length : null,
        awpii: Array.isArray(awpii?.data) ? awpii.data.length : null,
        tracker: Array.isArray(tracker?.data) ? tracker.data.length : null,
      });
      setLoading(false);
    }

    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  const fmt = (n) => (n === null ? "—" : String(n));

  // Stats we can back with a real endpoint right now. Articles Published,
  // Report Downloads, and Active Users don't have a matching function in
  // api.js yet -- rather than guess at an endpoint/response shape (which
  // is exactly how the tracker/awpii bugs happened), they're marked as
  // not connected instead of showing a fabricated number.
  const STATS = [
    {
      label: "Total Publications",
      value: loading ? null : fmt(counts.publications),
      sub: counts.publications === null && !loading ? "Connect backend" : null,
      icon: BookOpen,
      color: "#D4A017",
    },
    {
      label: "Articles Published",
      value: "—",
      sub: "Connect backend",
      icon: FileText,
      color: "#3b82f6",
    },
    {
      label: "Report Downloads",
      value: "—",
      sub: "Connect backend",
      icon: Download,
      color: "#10b981",
    },
    {
      label: "Active Users",
      value: "—",
      sub: "Connect backend",
      icon: Users,
      color: "#8b5cf6",
    },
  ];

  const OVERVIEW = [
    {
      label: "Countries Tracked",
      value: loading ? null : fmt(counts.tracker),
      sub: "Regulatory Tracker",
    },
    {
      label: "Enforcement Events",
      value: loading ? null : fmt(counts.enforcement),
      sub: "Enforcement Watch",
    },
    {
      label: "AWPII Nations",
      value: loading ? null : fmt(counts.awpii),
      sub: "Policy Index",
    },
    {
      label: "Newsletter Subs",
      value: "—",
      sub: "Connect backend",
    },
  ];

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
            Live
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

              <p className="text-white text-2xl font-bold flex items-center gap-2">
                {stat.value === null ? (
                  <Loader2 size={18} className="animate-spin text-gray-500" />
                ) : (
                  stat.value
                )}
              </p>

              {stat.sub ? (
                <p className="text-xs mt-1 text-gray-500">{stat.sub}</p>
              ) : (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#4ade80" }}>
                  <ArrowUpRight size={12} />
                  Live from backend
                </p>
              )}
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

        {/* Recent Activity -- no activity-log endpoint exists yet, so
            this is an honest empty state instead of the previous static
            fake list (which would've looked live but never changed). */}
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

          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-400 text-sm">Activity feed isn't connected yet.</p>
            <p className="text-gray-600 text-xs mt-1">
              Needs an activity-log endpoint (e.g. GET /api/admin/activity) to show real events here.
            </p>
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
          {OVERVIEW.map((item) => (
            <div
              key={item.label}
              className="text-center"
            >
              <p
                className="text-2xl font-bold flex items-center justify-center gap-2"
                style={{ color: "#D4A017" }}
              >
                {item.value === null ? (
                  <Loader2 size={16} className="animate-spin text-gray-600" />
                ) : (
                  item.value
                )}
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
