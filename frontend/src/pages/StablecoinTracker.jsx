import { useState, Suspense, lazy } from "react";
import TrackerHeader from "../components/tracker/TrackerHeader";
import StatCards from "../components/tracker/StatsCard";
import FilterBar from "../components/tracker/FilterBar";
import MapLegend from "../components/tracker/MapLegend";
import HighlightsPanel from "../components/tracker/HighlightsPanel";
import CountriesTable from "../components/tracker/CountriesTable";
import IssuersGrid from "../components/tracker/IssuersGrid";

const AfricaMap = lazy(() => import("../components/tracker/AfricaMap"));

const TABS = ["Countries", "Issuers"];

function SearchIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

export default function StablecoinTracker() {
  const [activeNav, setActiveNav] = useState("Countries");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Countries");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative top-20 z-50">
    

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <TrackerHeader activeNav={activeNav} onNavChange={setActiveNav} />
        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-1.5">
            Global Stablecoin{" "}
            <span className="text-primary">Regulation Tracker</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
            Monitor stablecoin laws, licensing frameworks, and regulatory status
            across 54 Africa countries — updated continuously.
          </p>
        </div>

        {/* Stat cards */}
        <StatCards />

        {/* Map card */}
        <div className="rounded-xl border border-border bg-card/50 overflow-hidden mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
            <MapLegend />
          </div>

          <Suspense
            fallback={
              <div className="h-[420px] flex items-center justify-center bg-muted/20">
                <div className="text-muted-foreground text-sm flex items-center gap-2">
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
        <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border">
            <div className="flex gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Countries" && (
              <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-3 py-1.5 flex-1 max-w-xs">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search country, framework, regulator…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground text-xs">
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {activeTab === "Countries" ? (
            <CountriesTable filter={activeFilter} search={search} />
          ) : (
            <IssuersGrid />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span>
          © 2026 AWI. Powered by{" "}
          <a href="https://stride.sc" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            STRIDE
          </a>{" "}
          data. For informational purposes only — not legal or financial advice.
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live data
        </span>
      </footer>
    </div>
  );
}