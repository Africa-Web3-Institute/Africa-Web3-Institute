import { COUNTRIES, ISSUERS, AFRICA_ISOS, STRIDE_COUNTRY_IDS } from "../../data/trackerCountries";
import CountryFlag from "../CountryFlag";

const MAX_ITEMS = 4;

function isAfrican(c) {
  return (c.iso || []).some((code) => AFRICA_ISOS.has(code));
}

// ISSUERS don't carry ISO codes, only a free-text `country` string, so we
// match against the African country names we already track elsewhere.
const AFRICAN_NAMES = Object.keys(STRIDE_COUNTRY_IDS);
function issuerIsAfrican(i) {
  return AFRICAN_NAMES.some((name) => i.country?.includes(name));
}

function countryDetail(c) {
  return c.since && c.since !== "—" ? `${c.framework} — ${c.since}` : c.framework;
}

function issuerDetail(i) {
  const coins = (i.coins || []).join(", ");
  return i.country ? `${coins} — ${i.country}` : coins;
}

const liveCountries = COUNTRIES.filter(isAfrican).filter((c) => c.status === "live").slice(0, MAX_ITEMS);
const proposedCountries = COUNTRIES.filter(isAfrican).filter((c) => c.status === "proposed").slice(0, MAX_ITEMS);
const liveIssuers = ISSUERS.filter((i) => i.status === "live").filter(issuerIsAfrican).slice(0, MAX_ITEMS);

const HIGHLIGHTS = [
  {
    label: "Live Frameworks",
    dot: "#22c55e",
    items: liveCountries.map((c) => ({ flag: c.flag, name: c.name, detail: countryDetail(c) })),
  },
  {
    label: "Proposed Legislation",
    dot: "#f97316",
    items: proposedCountries.map((c) => ({ flag: c.flag, name: c.name, detail: countryDetail(c) })),
  },
  {
    label: "Key Issuers",
    dot: "#a78bfa",
    items: liveIssuers.map((i) => ({ flag: i.flag, name: i.name, detail: issuerDetail(i) })),
  },
];

export default function HighlightsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      {HIGHLIGHTS.map((group) => (
        <div
          key={group.label}
          className="rounded-xl border border-white/[0.07] bg-[#0f2040]/70 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: group.dot }}
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {group.label}
            </p>
          </div>

          {group.items.length === 0 ? (
            <p className="text-[12px] text-slate-500 py-2.5">No entries yet.</p>
          ) : (
            <div className="space-y-0">
              {group.items.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-start gap-3 py-2.5 ${i < group.items.length - 1 ? "border-b border-white/[0.05]" : ""}`}
                >
                  <span className="shrink-0 mt-0.5">
                    <CountryFlag emoji={item.flag} size={20} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-200 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
