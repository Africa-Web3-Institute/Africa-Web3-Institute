// Date helpers for the events data in translations.js (English + French month names).
// Shared by the Events section and the home page "Latest from AWI" strip.

// Strip accents and lowercase, so "août" / "décembre" match "aout" / "decembre"
const normalizeToken = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Covers English and French month names (full + common abbreviations)
const MONTH_NAMES = {
  jan: 0, january: 0, janvier: 0,
  feb: 1, february: 1, fevrier: 1,
  mar: 2, march: 2, mars: 2,
  apr: 3, april: 3, avril: 3,
  may: 4, mai: 4,
  jun: 5, june: 5, juin: 5,
  jul: 6, july: 6, juillet: 6,
  aug: 7, august: 7, aout: 7,
  sep: 8, sept: 8, september: 8, septembre: 8,
  oct: 9, october: 9, octobre: 9,
  nov: 10, november: 10, novembre: 10,
  dec: 11, december: 11, decembre: 11,
};

// ─── Helper: filter only events with a future date ──────
export const filterUpcoming = (monthData) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFuture = (dateStr) => {
    if (!dateStr) return false;

    // Helper to parse a single date like "20 August 2026" or "20 août 2026"
    const parseDate = (str) => {
      // Try to match "DD Month YYYY" (also handles "DD–DD Month YYYY" since
      // parseInt stops at the first non-digit character, e.g. "24–25" -> 24)
      const parts = str.trim().split(/\s+/);
      if (parts.length === 3) {
        const day = Number.parseInt(parts[0], 10);
        const month = MONTH_NAMES[normalizeToken(parts[1])];
        const year = Number.parseInt(parts[2], 10);
        if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
          return new Date(year, month, day);
        }
      }

      // Fallback: match "DD–DD Month YYYY" (range) – use the END date.
      // \S+ (not \w+) so accented month names like "décembre" match fully.
      const rangeMatch = str.match(/(\d+)\s*[–-]\s*(\d+)\s+(\S+)\s+(\d+)/);
      if (rangeMatch) {
        const endDay = Number.parseInt(rangeMatch[2], 10);
        const month = MONTH_NAMES[normalizeToken(rangeMatch[3])];
        const year = Number.parseInt(rangeMatch[4], 10);
        if (!Number.isNaN(endDay) && month !== undefined && !Number.isNaN(year)) {
          return new Date(year, month, endDay);
        }
      }

      // Try to parse as a standard date
      const parsed = new Date(str);
      if (!Number.isNaN(parsed)) return parsed;

      return null;
    };

    const eventDate = parseDate(dateStr);
    if (!eventDate) return false;

    // Return true if the event is today or in the future
    return eventDate >= today;
  };

  // Handle both single month groups and section arrays
  if (Array.isArray(monthData)) {
    return monthData
      .map((sub) => ({
        ...sub,
        events: sub.events.filter((ev) => isFuture(ev.date)),
      }))
      .filter((sub) => sub.events.length > 0);
  }

  // Single month group
  return {
    ...monthData,
    events: monthData.events.filter((ev) => isFuture(ev.date)),
  };
};
