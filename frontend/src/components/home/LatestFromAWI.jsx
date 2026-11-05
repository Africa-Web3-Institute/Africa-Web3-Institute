import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Download, FileText, MapPin, Scale, CalendarDays } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import { publicationsApi } from "../../api/api";
import { trackDownload } from "../../api/publicContent";
import { filterUpcoming } from "../../lib/eventDates";
import { REGULATORY_UPDATES, STATUS_COLORS } from "../../data/RegulatoryUpdates";
import { PUBLICATIONS } from "../../pages/Publications";
import CountryFlag from "../CountryFlag";
import Reveal from "../common/Reveal";

const COPY = {
  en: {
    eyebrow: "Latest from AWI",
    heading: "Research, regulation and events",
    research: "Latest Research",
    regulation: "Latest Regulatory Update",
    event: "Upcoming Event",
    download: "Download report",
    allPublications: "All publications",
    openTracker: "Open the tracker",
    allEvents: "All events",
  },
  fr: {
    eyebrow: "Dernières nouvelles de l'AWI",
    heading: "Recherche, réglementation et événements",
    research: "Dernière publication",
    regulation: "Dernière mise à jour réglementaire",
    event: "Prochain événement",
    download: "Télécharger le rapport",
    allPublications: "Toutes les publications",
    openTracker: "Ouvrir le tracker",
    allEvents: "Tous les événements",
  },
};

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// "20 August 2026" / "August 2026" -> Date (tracker dates are English)
const parseTrackerDate = (str) => {
  const m = String(str || "").toLowerCase().match(/(\d{1,2}\s+)?([a-z]+)\s+(\d{4})/);
  if (!m || !MONTHS.includes(m[2])) return null;
  return new Date(Number(m[3]), MONTHS.indexOf(m[2]), m[1] ? Number.parseInt(m[1], 10) : 1);
};

const isDownloadable = (p) => p.available && p.downloadUrl && p.downloadUrl !== "#";

/* ── Shared card shell ───────────────────────────────────── */
function Card({ icon: Icon, label, children, footer, delay }) {
  return (
    <Reveal
      delay={delay}
      className="group bg-white border border-border rounded-2xl p-6 lg:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D4A017]/40"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B1437" }}>
          <Icon className="w-4 h-4" style={{ color: "#D4A017" }} />
        </span>
        <span className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase" style={{ color: "#D4A017" }}>
          {label}
        </span>
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
      <div className="mt-6 pt-4 border-t border-border/60">{footer}</div>
    </Reveal>
  );
}

const footerLinkClass = "inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-colors";

export default function LatestFromAWI() {
  const { language } = useLanguage();
  const C = COPY[language] || COPY.en;
  const statusLabels = t[language]?.tracker?.statuses || {};
  const eventMonths = (t[language]?.events || t.en.events).months;

  // Same source as the Publications page: API first, built-in list as fallback.
  const [publications, setPublications] = useState(PUBLICATIONS);
  const [fromApi, setFromApi] = useState(false);
  useEffect(() => {
    let mounted = true;
    publicationsApi
      .getAll()
      .then((res) => {
        const list = res?.data || (Array.isArray(res) ? res : []);
        if (!mounted || !list?.length) return;
        setPublications(
          list
            .filter((p) => String(p.status || "published").toLowerCase() === "published")
            .map((p) => ({ ...p, available: p.available === undefined ? true : Boolean(Number(p.available)) }))
        );
        setFromApi(true);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const report = useMemo(() => publications.find(isDownloadable) || publications[0], [publications]);

  // Most recent update that links to an official source
  const update = useMemo(
    () =>
      [...REGULATORY_UPDATES]
        .filter((u) => u.sourceUrl)
        .sort((a, b) => (parseTrackerDate(b.publishedDate) || 0) - (parseTrackerDate(a.publishedDate) || 0))[0],
    []
  );

  // First upcoming event (month groups are in chronological order)
  const nextEvent = useMemo(() => {
    for (const group of eventMonths || []) {
      const subs = group.section ? filterUpcoming(group.section) : [filterUpcoming(group)];
      const ev = subs.flatMap((s) => s.events)[0];
      if (ev) return ev;
    }
    return null;
  }, [eventMonths]);

  const statusColor = update && (STATUS_COLORS[update.status] || STATUS_COLORS["Under Verification"]);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-12 lg:mb-14">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#D4A017" }}>
            {C.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary">{C.heading}</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Research */}
          {report && (
            <Card
              icon={FileText}
              label={C.research}
              delay={0}
              footer={
                isDownloadable(report) ? (
                  <a
                    href={report.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => fromApi && trackDownload(report.id)}
                    className={footerLinkClass}
                    style={{ color: "#D4A017" }}
                  >
                    <Download className="w-3.5 h-3.5" /> {C.download}
                  </a>
                ) : (
                  <Link to="/publications" className={footerLinkClass} style={{ color: "#D4A017" }}>
                    {C.allPublications} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )
              }
            >
              {report.category && (
                <span className="self-start text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                  {report.category}
                </span>
              )}
              <h3 className="text-[1.0625rem] font-bold text-secondary leading-snug mb-2">{report.title}</h3>
              {report.description && (
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed line-clamp-3 mb-3">{report.description}</p>
              )}
              {report.date && <p className="mt-auto text-[0.75rem] text-muted-foreground">{report.date}</p>}
            </Card>
          )}

          {/* Regulatory tracker */}
          {update && (
            <Card
              icon={Scale}
              label={C.regulation}
              delay={0.08}
              footer={
                <Link to="/regulatory-tracker" className={footerLinkClass} style={{ color: "#D4A017" }}>
                  {C.openTracker} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <CountryFlag emoji={update.flag} size={18} />
                <span className="text-[0.8125rem] font-semibold text-secondary">{update.country}</span>
                <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full ml-auto"
                  style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                  {statusLabels[update.status] || update.status}
                </span>
              </div>
              <h3 className="text-[1.0625rem] font-bold text-secondary leading-snug mb-2">
                {language === "fr" ? update.titleFr || update.title : update.title}
              </h3>
              <p className="text-[0.875rem] text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                {language === "fr" ? update.summaryFr || update.summary : update.summary}
              </p>
              <p className="mt-auto text-[0.75rem] text-muted-foreground">
                {update.authority} · {update.publishedDate}
              </p>
            </Card>
          )}

          {/* Upcoming event */}
          {nextEvent && (
            <Card
              icon={CalendarDays}
              label={C.event}
              delay={0.16}
              footer={
                <Link to="/events" className={footerLinkClass} style={{ color: "#D4A017" }}>
                  {C.allEvents} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            >
              {nextEvent.country && (
                <span className="self-start text-[0.6875rem] font-bold tracking-[0.12em] uppercase px-2.5 py-1 mb-3"
                  style={{ border: "1px solid #D4A017", color: "#B8860B" }}>
                  {nextEvent.country}
                </span>
              )}
              <h3 className="text-[1.0625rem] font-bold text-secondary leading-snug mb-4">{nextEvent.title}</h3>
              <div className="mt-auto space-y-2 text-[0.8125rem] text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#D4A017" }} /> {nextEvent.date}
                </p>
                {nextEvent.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#D4A017" }} /> {nextEvent.location}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
