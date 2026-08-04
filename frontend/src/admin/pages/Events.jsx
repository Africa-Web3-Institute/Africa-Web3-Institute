import { useState, useEffect, useMemo } from "react";
import { Search, Edit2, Trash2, Plus, Calendar } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

// ─── Date helpers (same as public Events page) ────────────
const isFutureDate = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = {
    Jan: 0, January: 0,
    Feb: 1, February: 1,
    Mar: 2, March: 2,
    Apr: 3, April: 3,
    May: 4, May: 4,
    Jun: 5, June: 5,
    Jul: 6, July: 6,
    Aug: 7, August: 7,
    Sep: 8, September: 8,
    Oct: 9, October: 9,
    Nov: 10, November: 10,
    Dec: 11, December: 11
  };

  const parseDate = (str) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = monthNames[parts[1]];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const rangeMatch = str.match(/(\d+)\s*[–-]\s*(\d+)\s+(\w+)\s+(\d+)/);
    if (rangeMatch) {
      const endDay = parseInt(rangeMatch[2], 10);
      const month = monthNames[rangeMatch[3]];
      const year = parseInt(rangeMatch[4], 10);
      if (!isNaN(endDay) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, endDay);
      }
    }
    const parsed = new Date(str);
    if (!isNaN(parsed)) return parsed;
    return null;
  };

  const eventDate = parseDate(dateStr);
  if (!eventDate) return false;
  return eventDate >= today;
};

// ─── Flatten nested months into a flat array ───────────────
const flattenEvents = (months) => {
  const result = [];
  months.forEach((monthGroup) => {
    if (monthGroup.section) {
      monthGroup.section.forEach((sub) => {
        sub.events.forEach((ev) => {
          result.push({
            ...ev,
            id: ev.id || `${ev.title}-${ev.date}`,
            month: sub.month,
          });
        });
      });
    } else {
      monthGroup.events.forEach((ev) => {
        result.push({
          ...ev,
          id: ev.id || `${ev.title}-${ev.date}`,
          month: monthGroup.month,
        });
      });
    }
  });
  return result;
};

export default function Events() {
  const { language } = useLanguage();
  const T = t[language]?.events || t["en"].events;

  // ─── Initial events from translation ──────────────────────
  const initialEvents = useMemo(() => {
    if (!T.months) return [];
    return flattenEvents(T.months);
  }, [T.months]);

  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Persist changes to localStorage (for now) ────────────
  useEffect(() => {
    const stored = localStorage.getItem("adminEvents");
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminEvents", JSON.stringify(events));
  }, [events]);

  // ─── CRUD handlers ──────────────────────────────────────────
  const handleDelete = (id) => {
    if (!window.confirm("Delete this event?")) return;
    setEvents(events.filter(ev => ev.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Edit event ${id}`);
  };

  const handleAdd = () => {
    alert("Create new event");
  };

  // ─── Filter by search ──────────────────────────────────────
  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-white p-8">Loading events...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage institute events and webinars ({events.length} total)
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> New Event
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(ev => {
                const isFuture = isFutureDate(ev.date);
                const status = isFuture ? "Upcoming" : "Past";
                return (
                  <tr key={ev.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" /> {ev.title}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{ev.date}</td>
                    <td className="px-6 py-4 text-gray-300">{ev.location || "—"}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        status === "Upcoming"
                          ? "bg-blue-900/50 text-blue-400"
                          : "bg-gray-700 text-gray-300"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(ev.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}