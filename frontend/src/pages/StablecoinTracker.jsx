import { useState, Suspense, lazy } from "react";
import TrackerHeader from "../components/tracker/TrackerHeader";
import StatCards from "../components/tracker/StatsCard";
import FilterBar from "../components/tracker/FilterBar";
import MapLegend from "../components/tracker/MapLegend";
import HighlightsPanel from "../components/tracker/HighlightsPanel";
import CountriesTable from "../components/tracker/CountriesTable";
import IssuersGrid from "../components/tracker/IssuersGrid";
//import { useTrackerData } from "../hooks/stablecoin";

// Lazy-load the map so Leaflet CSS doesn't block initial render
const AfricaMap = lazy(() => import("../components/tracker/AfricaMap"));

const TABS = ["Countries", "Issuers"];

function SearchIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

export default function StablecoinTracker() {
  const [activeNav, setActiveNav] = useState("Countries");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Countries");
  const [search, setSearch] = useState("");
  {/*const { countries, issuers, loading, error } = useTrackerData();*/}

  return (
    <div className="min-h-screen bg-[#071525] text-slate-100 font-sans">
    
      <TrackerHeader activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-1.5">
            Global Stablecoin{" "}
            <span className="text-[#22c55e]">Regulation Tracker</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Monitor stablecoin laws, licensing frameworks, and regulatory status
            across 54 Africa countries — updated continuously.
          </p>
        </div>

        {/* Stat cards */}
        <StatCards />

        {/* Map card */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0f2040]/50 overflow-hidden mb-5">
          {/* Map toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.07]">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
            <MapLegend />
          </div>

          {/* Map */}
          <Suspense
            fallback={
              <div className="h-[420px] flex items-center justify-center bg-[#071525]">
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading map…
                </div>
              </div>
            }
          >
            <AfricaMap activeFilter={activeFilter} />
          </Suspense>
        </div>

        {/* Highlights */}
        <HighlightsPanel />

        {/* Table card */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0f2040]/50 overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.07]">
            {/* Tabs */}
            <div className="flex gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "text-[#22c55e] border-[#22c55e]"
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search — only for countries tab */}
            {activeTab === "Countries" && (
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 flex-1 max-w-xs">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search country, framework, regulator…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300 text-xs">
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "Countries" ? (
            <CountriesTable filter={activeFilter} search={search} />
          ) : (
            <IssuersGrid />
          )}

      {/* Pass live data down to table and grid */}
      {/*<CountriesTable filter={activeFilter} search={search} countries={countries} />
      <IssuersGrid issuers={issuers} />*/}

      {/* Optional loading indicator */}
      {/*{loading && (
        <div className="fixed bottom-4 right-4 bg-[#0f2040] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Syncing live data…
        </div>
      )}*/}
     
        </div>   
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>
          © 2026 AWI. Powered by{" "}
          <a href="https://stride.sc" target="_blank" rel="noreferrer" className="hover:text-[#22c55e] transition-colors">
            STRIDE
          </a>{" "}
          data. For informational purposes only — not legal or financial advice.
        </span>
      </footer>
    </div>
  );
}
