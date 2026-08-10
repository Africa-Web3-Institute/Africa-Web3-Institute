import { ISSUERS, STRIDE_COUNTRY_IDS } from "../../data/trackerCountries";
import StatusPill from "./StatusPill";
import CountryFlag from "../CountryFlag";

// ISSUERS only carry a free-text `country` string, no ISO code, so match
// against the African country names already tracked in STRIDE_COUNTRY_IDS
// (same approach used in HighlightsPanel).
const AFRICAN_NAMES = Object.keys(STRIDE_COUNTRY_IDS);
function isAfricanIssuer(issuer) {
  return AFRICAN_NAMES.some((name) => issuer.country?.includes(name));
}

const africanIssuers = ISSUERS.filter(isAfricanIssuer);

export default function IssuersGrid() {
  if (africanIssuers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-400">No licensed African issuers tracked yet.</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Check back as STRIDE's data expands, or add verified entries as they're confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
      {africanIssuers.map((issuer) => (
        <div
          key={issuer.name}
          className="border border-white/[0.07] rounded-xl p-4 bg-white/[0.02] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <p className="font-semibold text-[13px] text-slate-200 leading-tight">
                {issuer.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                <CountryFlag emoji={issuer.flag} size={14} />
                {issuer.country}
              </p>
            </div>
            <StatusPill status={issuer.status} size="xs" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {issuer.coins.map((coin) => (
              <span
                key={coin}
                className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8]"
              >
                {coin}
              </span>
            ))}
          </div>

          {issuer.licensed.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-widest font-semibold">
                Licensed in
              </p>
              <div className="flex flex-wrap gap-1">
                {issuer.licensed.map((l) => (
                  <span
                    key={l}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
