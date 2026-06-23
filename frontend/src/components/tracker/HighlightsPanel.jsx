const HIGHLIGHTS = [
  {
    label: "Live Frameworks",
    dot: "#22c55e",
    items: [
      { flag: "🇪🇺", country: "European Union", detail: "MiCA — Full implementation 2024" },
      { flag: "🇸🇬", country: "Singapore", detail: "MAS Payment Services Act" },
      { flag: "🇦🇪", country: "UAE", detail: "VARA / ADGM frameworks" },
      { flag: "🇭🇰", country: "Hong Kong", detail: "HKMA Stablecoin Ordinance" },
    ],
  },
  {
    label: "Proposed Legislation",
    dot: "#f97316",
    items: [
      { flag: "🇺🇸", country: "United States", detail: "GENIUS Act — Senate 2025" },
      { flag: "🇬🇧", country: "United Kingdom", detail: "FCA Stablecoin Regime" },
      { flag: "🇧🇷", country: "Brazil", detail: "BACEN Virtual Asset Framework" },
      { flag: "🇨🇦", country: "Canada", detail: "OSFI Digital Asset Guidance" },
    ],
  },
  {
    label: "Key Issuers",
    dot: "#a78bfa",
    items: [
      { flag: "🏦", country: "Circle Internet Financial", detail: "USDC, EURC — US/EU/SG licensed" },
      { flag: "🏦", country: "Tether Operations", detail: "USDT, EURT — El Salvador / BVI" },
      { flag: "🏦", country: "Paxos Trust", detail: "USDP, PYUSD — NYDFS regulated" },
      { flag: "🏦", country: "SG — FORGE", detail: "EURCV — MiCA regulated, France" },
    ],
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

          <div className="space-y-0">
            {group.items.map((item, i) => (
              <div
                key={item.country}
                className={`flex items-start gap-3 py-2.5 ${i < group.items.length - 1 ? "border-b border-white/[0.05]" : ""}`}
              >
                <span className="text-xl leading-none shrink-0 mt-0.5">{item.flag}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-200 leading-tight">
                    {item.country}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
