import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
}

const STATS_EN = [
  { value: 18, label: "Countries", suffix: "+" },
  { value: 10, label: "Policy reports", suffix: "+" },
  { value: 3000, label: "Members", suffix: "+" },
  { value: 12, label: "Partner governments", suffix: "" },
];
const STATS_FR = [
  { value: 18, label: "Pays", suffix: "+" },
  { value: 10, label: "Rapports politiques", suffix: "+" },
  { value: 3000, label: "Membres", suffix: "+" },
  { value: 12, label: "Gouvernements partenaires", suffix: "" },
];

function StatCard({ value, label, suffix, started }) {
  const num = useCountUp(value, 1800, started);
  return (
    <div className="rounded-xl text-center py-4 px-3" style={{ backgroundColor: "#F7F8FA" }}>
      <p className="text-[1.625rem] font-semibold leading-none mb-1" style={{ color: "#D4A017" }}>
        {num}{suffix}
      </p>
      <p className="text-[0.75rem]" style={{ color: "#6B7280" }}>{label}</p>
    </div>
  );
}

export default function StatsBar() {
  const { language } = useLanguage();
  const stats = language === "fr" ? STATS_FR : STATS_EN;
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-6 px-6 lg:px-8 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} started={started} />
        ))}
      </div>
    </div>
  );
}