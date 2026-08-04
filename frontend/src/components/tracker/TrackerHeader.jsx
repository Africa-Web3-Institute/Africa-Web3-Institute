import { useState } from "react";

const NAV_LINKS = ["Countries", "Issuers", "Currencies", "Stablecoins", "Blockchains", "Updates"];

export default function TrackerHeader({ activeNav, onNavChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.07] relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        {/* Top row: logo + desktop nav + badge + hamburger */}
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

          {/* Desktop nav – hidden on mobile */}
          <nav className="hidden md:flex items-center flex-nowrap gap-0.5 md:gap-1 lg:gap-1.5 overflow-x-auto scrollbar-hide justify-start lg:justify-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => onNavChange(link)}
                className={`shrink-0 px-2 md:px-2.5 lg:px-3 py-1.5 rounded-md text-[11px] md:text-[12px] lg:text-[13px] font-medium transition-colors whitespace-nowrap ${
                  activeNav === link
                    ? "text-[#22c55e] bg-[#22c55e]/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Right side: badge + hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Badge */}
            <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold font-mono bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] px-2.5 py-1 rounded-full whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="hidden xs:inline">LIVE DATA</span>
              <span className="xs:hidden">LIVE</span>
            </span>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown – shown below header */}
        {mobileOpen && (
          <div className="absolute top-14 left-0 right-0 bg-[#0a1628]/98 backdrop-blur-md border-b border-white/[0.07] p-4 flex flex-col gap-1 z-40 shadow-2xl md:hidden">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  onNavChange(link);
                  setMobileOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                  activeNav === link
                    ? "text-[#22c55e] bg-[#22c55e]/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .xs\\:inline {
          display: inline;
        }
        @media (max-width: 475px) {
          .xs\\:inline {
            display: none;
          }
          .xs\\:hidden {
            display: inline;
          }
        }
      `}</style>
    </header>
  );
}