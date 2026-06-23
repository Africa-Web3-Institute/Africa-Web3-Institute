import { useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Users, FileText, Clock, Percent, Zap, 
  Database, Network, Send, Cpu, Server, MapPin, AlertTriangle
} from 'lucide-react';

//URLs for analytics API
const ANALYTICS_BASE = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:3001';
const SSE_URL = `${ANALYTICS_BASE}/api/live`;
const INGEST_URL = `${ANALYTICS_BASE}/api/event`;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

// Colors for Pie/Donut charts
const COLORS = ['#D4A017', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('blueprint');
  const [connected, setConnected] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Simulation parameters
  const [simCountry, setSimCountry] = useState('NG');
  const [simPage, setSimPage] = useState('/');
  const [simEvent, setSimEvent] = useState('pageview');

  // Connect to SSE stream — bounded retries, no infinite console spam
  useEffect(() => {
    const connect = () => {
      let es;
      try {
        es = new EventSource(SSE_URL);
      } catch (err) {
        setConnectionFailed(true);
        return;
      }
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setConnectionFailed(false);
        retryCountRef.current = 0;
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        retryCountRef.current += 1;

        if (retryCountRef.current >= MAX_RETRIES) {
          setConnectionFailed(true);
          return;
        }
        retryTimeoutRef.current = setTimeout(connect, RETRY_DELAY_MS);
      };

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          const { type, data } = payload;

          if (type === 'init') {
            setMetrics(data.metrics);
            setHistory(data.history || []);
          } else if (type === 'metrics') {
            setMetrics(data);
          } else if (type === 'event') {
            setHistory(prev => [data, ...prev].slice(0, 50));
            triggerBlueprintParticles(data);
          }
        } catch {
          // ignore malformed payloads
        }
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  const handleManualRetry = () => {
    retryCountRef.current = 0;
    setConnectionFailed(false);
    if (eventSourceRef.current) eventSourceRef.current.close();
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    // re-trigger the connect effect by forcing a fresh EventSource
    const es = new EventSource(SSE_URL);
    eventSourceRef.current = es;
    es.onopen = () => { setConnected(true); setConnectionFailed(false); retryCountRef.current = 0; };
    es.onerror = () => {
      setConnected(false);
      es.close();
      setConnectionFailed(true);
    };
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        const { type, data } = payload;
        if (type === 'init') { setMetrics(data.metrics); setHistory(data.history || []); }
        else if (type === 'metrics') setMetrics(data);
        else if (type === 'event') { setHistory(prev => [data, ...prev].slice(0, 50)); triggerBlueprintParticles(data); }
      } catch {}
    };
  };

  // Animate particles along SVG blueprint paths when an event is received
  const triggerBlueprintParticles = (event) => {
    const newParticles = [];
    const baseId = particleIdRef.current;

    let color = '#D4A017';
    if (event.eventName === 'add_to_cart' || event.eventName === 'checkout') color = '#10b981';
    if (event.eventName === 'heartbeat') color = '#3b82f6';
    if (event.eventName === 'newsletter_subscribe') color = '#8b5cf6';

    newParticles.push({ id: `${baseId}-s1`, path: 'M 70 130 L 230 130', color, delay: 0, duration: 0.5 });
    newParticles.push({ id: `${baseId}-s2`, path: 'M 230 130 L 390 130', color, delay: 0.4, duration: 0.5 });
    newParticles.push({ id: `${baseId}-s3a`, path: 'M 390 130 C 430 130, 470 70, 550 70', color, delay: 0.8, duration: 0.6 });
    newParticles.push({ id: `${baseId}-s3b`, path: 'M 390 130 C 430 130, 470 190, 550 190', color, delay: 0.8, duration: 0.6 });
    newParticles.push({ id: `${baseId}-s4a`, path: 'M 550 70 C 630 70, 670 130, 710 130', color, delay: 1.3, duration: 0.6 });
    newParticles.push({ id: `${baseId}-s4b`, path: 'M 550 190 C 630 190, 670 130, 710 130', color, delay: 1.3, duration: 0.6 });
    newParticles.push({ id: `${baseId}-s5`, path: 'M 710 130 L 830 130', color, delay: 1.8, duration: 0.5 });

    setParticles(prev => [...prev, ...newParticles]);
    particleIdRef.current += 1;

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2800);
  };

  // Trigger simulated event
  const handleSimulate = async () => {
    const fakeSessionId = 'sim_' + Math.random().toString(36).substring(2, 8);

    const agents = [
      { browser: 'Chrome', os: 'Android' },
      { browser: 'Safari', os: 'iOS' },
      { browser: 'Firefox', os: 'Ubuntu' },
      { browser: 'Edge', os: 'Windows' }
    ];
    const agent = agents[Math.floor(Math.random() * agents.length)];

    const payload = {
      sessionId: fakeSessionId,
      eventName: simEvent,
      path: simPage,
      referrer: 'Google Search',
      screen: '1920x1080',
      language: 'en-US',
      simulatedGeo: simCountry,
      simulatedAgent: agent,
      eventData: simEvent !== 'pageview' && simEvent !== 'heartbeat'
        ? { simulatedAction: true, buttonText: 'Interactive Simulation' }
        : null
    };

    try {
      await fetch(INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // backend not running — silently ignore, connectionFailed banner already communicates this
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const pageViewsData = metrics ? Object.entries(metrics.pageViews).map(([name, pv]) => ({ name, pv })).sort((a,b) => b.pv - a.pv).slice(0, 5) : [];
  const referralData = metrics ? Object.entries(metrics.referrers).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5) : [];
  const countryData = metrics ? Object.entries(metrics.countries).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5) : [];

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-3.75rem)] p-6 lg:p-8 font-sans">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-500 fill-yellow-500/20 w-7 h-7" />
            Real-Time Data Pipeline Blueprint
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Visualizing telemetry ingestion, aggregation, and SSE broadcasts inside the Africa Web Institute.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            connected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : connectionFailed
              ? 'bg-slate-800/60 text-slate-400 border-slate-700'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : connectionFailed ? 'bg-slate-500' : 'bg-rose-400'}`} />
            {connected ? 'Pipeline Connected' : connectionFailed ? 'Not Connected' : 'Connecting to Server...'}
          </div>

          <a
           href={`${ANALYTICS_BASE}/api/export`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all"
          >
            <Database className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
            Tableau CSV Export
          </a>

          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'blueprint' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Blueprint
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'dashboard' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Analytics Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Disconnected banner */}
      {connectionFailed && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Analytics backend isn't running at <code className="bg-black/20 px-1 py-0.5 rounded">{ANALYTICS_BASE}</code>.
                Start the analytics server, or set <code className="bg-black/20 px-1 py-0.5 rounded">VITE_ANALYTICS_URL</code> in your <code className="bg-black/20 px-1 py-0.5 rounded">.env</code>.
              </span>
            </div>
            <button
              onClick={handleManualRetry}
              className="flex-shrink-0 px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Side: Interactive Simulator Panel */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-md font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Cpu className="text-amber-500 w-4 h-4" />
              Traffic Ingestion Simulator
            </h2>
            <p className="text-xs text-slate-400 my-4 leading-relaxed">
              Manually ingest raw tracking payloads into the system to verify the pipeline's end-to-end telemetry logic.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Event Name</label>
                <select
                  value={simEvent}
                  onChange={(e) => setSimEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="pageview">pageview (Page transition)</option>
                  <option value="heartbeat">heartbeat (User active ping)</option>
                  <option value="newsletter_subscribe">newsletter_subscribe (Custom Action)</option>
                  <option value="report_download">report_download (File Download)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">African Origin (Mock IP)</label>
                <select
                  value={simCountry}
                  onChange={(e) => setSimCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="NG">Lagos, Nigeria</option>
                  <option value="ZA">Johannesburg, South Africa</option>
                  <option value="KE">Nairobi, Kenya</option>
                  <option value="EG">Cairo, Egypt</option>
                  <option value="SN">Dakar, Senegal</option>
                  <option value="RW">Kigali, Rwanda</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Target Destination</label>
                <select
                  value={simPage}
                  onChange={(e) => setSimPage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="/">Home Page</option>
                  <option value="/about">About Us</option>
                  <option value="/awpii">AWPII Policy Index</option>
                  <option value="/country-tracker">Regulatory Tracker</option>
                  <option value="/publications">Publications</option>
                  <option value="/enforcement-watch">Enforcement Watch</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={connectionFailed}
            className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            Ingest Telemetry Packet
          </button>
        </div>

        {/* Center/Right Area */}
        <div className="lg:col-span-3 space-y-6">

          {/* Real-time Status Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Visitors</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-400 animate-pulse">
                  {metrics ? metrics.activeUsers : 0}
                </h3>
              </div>
              <Users className="text-emerald-500/20 w-8 h-8" />
            </div>

            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Views</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">
                  {metrics ? metrics.totalPageViews : 0}
                </h3>
              </div>
              <FileText className="text-slate-500/20 w-8 h-8" />
            </div>

            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Session</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">
                  {metrics ? formatDuration(metrics.avgSessionDuration) : '0s'}
                </h3>
              </div>
              <Clock className="text-slate-500/20 w-8 h-8" />
            </div>

            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bounce Rate</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">
                  {metrics ? `${metrics.bounceRate}%` : '0%'}
                </h3>
              </div>
              <Percent className="text-slate-500/20 w-8 h-8" />
            </div>
          </div>

          {/* Tab Content 1: Pipeline Blueprint Visualizer */}
          {activeTab === 'blueprint' && (
            <div className="space-y-6">

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Network className="text-amber-500 w-4 h-4" />
                  Live Event Traversal Node Graph
                </h3>

                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox="0 0 900 260"
                    className="w-full min-w-[800px] h-[260px]"
                    style={{ background: 'rgba(2, 6, 23, 0.5)', borderRadius: '10px' }}
                  >
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                      </marker>
                      <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4A017" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    <path d="M 70 130 L 230 130" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 230 130 L 390 130" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 390 130 C 430 130, 470 70, 550 70" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 390 130 C 430 130, 470 190, 550 190" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 550 70 C 630 70, 670 130, 710 130" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 550 190 C 630 190, 670 130, 710 130" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    <path d="M 710 130 L 830 130" stroke="#1e293b" strokeWidth="2.5" markerEnd="url(#arrow)" />

                    {particles.map(p => (
                      <circle key={p.id} r="5" fill={p.color} className="filter drop-shadow-[0_0_4px_currentColor]">
                        <animateMotion
                          dur={`${p.duration}s`}
                          path={p.path}
                          begin={`${p.delay}s`}
                          fill="freeze"
                        />
                      </circle>
                    ))}

                    {/* Node 1: Client SDK */}
                    <g transform="translate(70, 130)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <circle r="6" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '3s' }} />
                      <circle r="5" fill="#3b82f6" />
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">CLIENT SDK</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">useTracker.js</text>
                    </g>

                    {/* Node 2: Ingestion API */}
                    <g transform="translate(230, 130)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Server className="w-5 h-5 text-amber-500" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">INGESTION API</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">POST /api/event</text>
                    </g>

                    {/* Node 3: Router & Parser */}
                    <g transform="translate(390, 130)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Network className="w-5 h-5 text-indigo-400" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">PARSER & ROUTER</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">Geo / Device Parse</text>
                    </g>

                    {/* Node 4A: Aggregation Engine */}
                    <g transform="translate(550, 70)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Activity className="w-5 h-5 text-emerald-400" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">AGGREGATOR</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">In-Memory Maps</text>
                    </g>

                    {/* Node 4B: Circular Buffer Log */}
                    <g transform="translate(550, 190)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Database className="w-5 h-5 text-rose-400" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">LOG STORE</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">Circular Array</text>
                    </g>

                    {/* Node 5: SSE Stream Broadcaster */}
                    <g transform="translate(710, 130)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">SSE BROADCAST</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">/api/live stream</text>
                    </g>

                    {/* Node 6: Visualization */}
                    <g transform="translate(830, 130)">
                      <circle r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <Activity className="w-5 h-5 text-teal-400" />
                      </foreignObject>
                      <text y="-30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">UI DASHBOARD</text>
                      <text y="35" textAnchor="middle" fill="#64748b" fontSize="8">Recharts Panel</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Server Diagnostics & Live Log Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Server className="text-amber-500 w-4 h-4" />
                    In-Memory Pipeline Diagnostics
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-slate-850 pb-2">
                      <span className="text-slate-400">Total Packets Ingested</span>
                      <span className="font-semibold text-slate-200">
                        {metrics ? metrics.diagnostics.eventsProcessed : 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 pb-2">
                      <span className="text-slate-400">Total Bandwidth Transferred</span>
                      <span className="font-semibold text-slate-200">
                        {metrics ? `${(metrics.diagnostics.bytesIngested / 1024).toFixed(2)} KB` : '0 KB'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 pb-2">
                      <span className="text-slate-400">Avg Ingestion Latency</span>
                      <span className="font-semibold text-emerald-400">
                        {metrics ? `${metrics.diagnostics.avgProcessingTimeMs} ms` : '0 ms'}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-400">Memory Database Engine</span>
                      <span className="font-semibold text-sky-400">Active Map/Store</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Activity className="text-amber-500 w-4 h-4" />
                    Live Event Stream Logs
                  </h3>

                  <div className="h-[155px] overflow-y-auto font-mono text-[11px] space-y-2.5 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                    {history.length === 0 ? (
                      <div className="text-slate-500 text-center py-10">Waiting for live data...</div>
                    ) : (
                      history.map((evt) => (
                        <div key={evt.id} className="p-2 bg-slate-950/70 border-l-2 border-amber-500 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">
                              {new Date(evt.timestamp).toLocaleTimeString()}
                            </span>
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                              evt.eventName === 'pageview' ? 'bg-amber-500/10 text-amber-400' :
                              evt.eventName === 'heartbeat' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {evt.eventName}
                            </span>
                            <span className="text-slate-300 font-semibold text-[10px]">{evt.path}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] flex items-center gap-1.5 self-end sm:self-auto">
                            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-semibold flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {evt.country}
                            </span>
                            <span className="text-slate-500 text-[9px]">({evt.browser} / {evt.os})</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab Content 2: Analytics Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                  Ingestion Timeline (Pageviews / Hour)
                </h3>
                <div className="h-64">
                  {metrics && metrics.hourlyStats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.hourlyStats}>
                        <XAxis
                          dataKey="hour"
                          stroke="#64748b"
                          fontSize={10}
                          tickFormatter={(h) => `${h}:00`}
                        />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                          labelFormatter={(h) => `Hour ${h}:00`}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#D4A017"
                          strokeWidth={2.5}
                          dot={{ fill: '#D4A017', strokeWidth: 1 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">No chart data loaded</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                    Top Visited Destinations
                  </h3>
                  <div className="h-44">
                    {pageViewsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pageViewsData} layout="vertical">
                          <XAxis type="number" stroke="#64748b" fontSize={9} />
                          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={80} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                          <Bar dataKey="pv" fill="#D4A017" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-xs">No metrics yet</div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                    Traffic by African Nation
                  </h3>
                  <div className="h-44 flex items-center justify-center relative">
                    {countryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={countryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={56}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {countryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-slate-500 text-xs">No metrics yet</div>
                    )}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[9px] max-w-[100px] overflow-hidden">
                      {countryData.map((entry, idx) => (
                        <div key={entry.name} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-slate-300 truncate">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                    Traffic Acquisition Channels
                  </h3>
                  <div className="h-44">
                    {referralData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referralData}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                          <YAxis stroke="#64748b" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-xs">No metrics yet</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
