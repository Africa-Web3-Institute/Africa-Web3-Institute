import { ISSUERS } from "../../data/trackerCountries";
import StatusPill from "./StatusPill";

export default function IssuersGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
      {ISSUERS.map((issuer) => (
        <div
          key={issuer.name}
          className="border border-white/[0.07] rounded-xl p-4 bg-white/[0.02] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <p className="font-semibold text-[13px] text-slate-200 leading-tight">
                {issuer.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {issuer.flag} {issuer.country}
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
