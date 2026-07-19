const NAV_LINKS = ["Countries", "Issuers", "Currencies", "Stablecoins", "Blockchains", "Updates"];

export default function TrackerHeader({ activeNav, onNavChange }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-black font-extrabold text-xs leading-none">
              AW
            </div>
            <span className="font-bold text-sm text-slate-100 hidden sm:block tracking-tight">
              AWI Stablecoin Tracker
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => onNavChange(link)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  activeNav === link
                    ? "text-[#22c55e] bg-[#22c55e]/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Badge */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold font-mono bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              LIVE DATA
            </span>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden gap-1 pb-2 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => onNavChange(link)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                activeNav === link
                  ? "text-[#22c55e] bg-[#22c55e]/10"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
