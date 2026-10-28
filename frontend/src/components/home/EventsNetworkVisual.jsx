const SATELLITES = 6;
const CX = 200;
const CY = 150;
const RX = 140;
const RY = 98;

const nodes = Array.from({ length: SATELLITES }, (_, i) => {
  const angle = (i / SATELLITES) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + RX * Math.cos(angle),
    y: CY + RY * Math.sin(angle),
    delay: i * 0.35,
  };
});

const dots = Array.from({ length: 24 }, (_, i) => ({
  x: 20 + (i % 8) * 48,
  y: 20 + Math.floor(i / 8) * 40,
}));

// Purely decorative — the surrounding heading/copy already conveys the section's
// meaning, so this is aria-hidden and every animation is disabled under
// prefers-reduced-motion rather than exposed as content a screen reader needs.
export default function EventsNetworkVisual() {
  return (
    <div className="evnet-visual w-full h-full" aria-hidden="true">
      <style>{`
        .evnet-visual .evnet-orbit,
        .evnet-visual .evnet-pulse-ring,
        .evnet-visual .evnet-node {
          transform-box: fill-box;
          transform-origin: center;
        }
        .evnet-visual .evnet-orbit { animation: evnet-rotate 50s linear infinite; }
        .evnet-visual .evnet-pulse-ring { animation: evnet-pulse 2.6s ease-in-out infinite; }
        .evnet-visual .evnet-line { stroke-dasharray: 6 8; animation: evnet-dash 3.2s linear infinite; }
        .evnet-visual .evnet-node { animation: evnet-breathe 3s ease-in-out infinite; }

        @keyframes evnet-rotate { to { transform: rotate(360deg); } }
        @keyframes evnet-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(1.4); }
        }
        @keyframes evnet-dash { to { stroke-dashoffset: -140; } }
        @keyframes evnet-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        @media (prefers-reduced-motion: reduce) {
          .evnet-visual .evnet-orbit,
          .evnet-visual .evnet-pulse-ring,
          .evnet-visual .evnet-line,
          .evnet-visual .evnet-node {
            animation: none !important;
          }
        }
      `}</style>
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#0B1437" />

        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="1.4" fill="#D4A017" opacity="0.08" />
        ))}

        <circle className="evnet-orbit" cx={CX} cy={CY} r="122" fill="none" stroke="#D4A017" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 10" />
        <circle className="evnet-pulse-ring" cx={CX} cy={CY} r="34" fill="none" stroke="#D4A017" strokeWidth="1.5" />

        {nodes.map((n, i) => (
          <line
            key={`line-${i}`}
            className="evnet-line"
            x1={CX} y1={CY} x2={n.x} y2={n.y}
            stroke="#D4A017" strokeOpacity="0.35" strokeWidth="1.5"
            style={{ animationDelay: `${n.delay}s` }}
          />
        ))}

        {nodes.map((n, i) => (
          <circle
            key={`node-${i}`}
            className="evnet-node"
            cx={n.x} cy={n.y} r="5"
            fill="#D4A017" fillOpacity="0.85"
            style={{ animationDelay: `${n.delay}s` }}
          />
        ))}

        <circle cx={CX} cy={CY} r="10" fill="#D4A017" />
        <circle cx={CX} cy={CY} r="10" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
    </div>
  );
}
