import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * HubPage — section landing page (Intelligence, Programs & Events):
 * navy hero + a grid of link cards. `T` is the translations block with
 * { eyebrow, heading, body, items: [{ title, description, href, icon }] }.
 */
export default function HubPage({ T, language }) {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      <section style={{ backgroundColor: "#0B1437" }} className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {T.eyebrow}
          </p>
          <h1 className="text-[2rem] lg:text-[3rem] font-bold text-white leading-tight mb-4">
            {T.heading}
          </h1>
          <p className="text-[1.0625rem] max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
            {T.body}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* 6-column grid so a trailing row of 2 cards spans the full width instead of leaving a gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 lg:gap-6">
            {T.items.map((item, i) => {
              const n = T.items.length;
              const lastRowStart = n - (n % 3 || 3);
              const lgSpan = i >= lastRowStart && n % 3 === 2 ? "lg:col-span-3" : "lg:col-span-2";
              const smSpan = n % 2 === 1 && i === n - 1 ? "sm:col-span-2" : "";
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`group text-left bg-white border border-border rounded-xl p-6 lg:p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D4A017]/40 ${smSpan} ${lgSpan}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-[1.5rem] bg-[#D4A017]/10 group-hover:bg-[#D4A017]/20 transition-colors">
                      {item.icon}
                    </span>
                    <h3 className="text-[1rem] lg:text-[1.0625rem] font-bold text-secondary leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-[0.875rem] text-muted-foreground leading-relaxed">{item.description}</p>
                  <span className="mt-auto pt-4 border-t border-border/50 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold" style={{ color: "#D4A017" }}>
                    {language === "fr" ? "Ouvrir" : "Open"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
