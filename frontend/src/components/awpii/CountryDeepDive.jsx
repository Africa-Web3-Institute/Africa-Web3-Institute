
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { COUNTRY_DATA } from "../../data/countryData";

const getGradeBadgeClass = (grade) => {
  if (grade.includes("AA")) return "bg-[#14532d] text-white";
  if (grade.startsWith("A")) return "bg-[#166534] text-white";
  if (grade.startsWith("BBB")) return "bg-yellow-600 text-white";
  if (grade.startsWith("BB")) return "bg-amber-600 text-white";
  return "bg-red-600 text-white";
};

const SEVERITY_DOT = {
  Positive: "bg-green-500",
  Neutral: "bg-amber-500",
  Restrictive: "bg-red-500",
};

export default function CountryDeepDive({ selectedCountry, language }) {
  const radarData = selectedCountry.pillars ? [
    { subject: language === "fr" ? "Clarté" : "Clarity", value: selectedCountry.pillars.clarity },
    { subject: language === "fr" ? "Soutien" : "Policy Support", value: selectedCountry.pillars.policy_support },
    { subject: language === "fr" ? "Innovation" : "Innovation", value: selectedCountry.pillars.innovation },
    { subject: language === "fr" ? "Adoption" : "Adoption", value: selectedCountry.pillars.adoption },
  ] : [];

  const countryProfile = COUNTRY_DATA[selectedCountry.key];
  const recentEvents = countryProfile?.timeline?.slice(0, 3) || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-5 mb-5 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selectedCountry.flag}</span>
          <div>
            <h3 className="font-bold text-secondary text-2xl tracking-tight leading-none mb-1.5">{selectedCountry.content[language].name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Rank #{selectedCountry.rank}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${getGradeBadgeClass(selectedCountry.grade)}`}>
                {selectedCountry.grade}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 text-right">
            <span className="block text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-wider">Overall Score</span>
            <span className="text-3xl font-extrabold text-secondary leading-none">{selectedCountry.overall_score}</span>
          </div>
          <Link
            to={`/country-tracker/${selectedCountry.key}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent border border-accent/40 hover:bg-accent hover:text-white px-3 py-2.5 rounded-lg transition-all whitespace-nowrap"
          >
            Full Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Key Update — prominent */}
      <div className="mb-5 flex gap-2 bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
        <span className="text-xs font-bold text-accent shrink-0">
          {language === "fr" ? "Mise à Jour :" : "Key Update:"}
        </span>
        <span className="text-xs text-muted-foreground font-medium leading-relaxed">{selectedCountry.content[language].key_update}</span>
      </div>

      {selectedCountry.pillars ? (
        <>
          {/* Radar + SWOT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
            <div className="flex flex-col items-center w-full">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Pillar Distribution</h4>
              <div className="w-full min-h-[260px] h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={selectedCountry.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SWOT Insights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-green-100 bg-green-50/10 dark:border-green-950 dark:bg-green-950/5 p-3 rounded-lg">
                  <p className="text-xs font-extrabold text-green-700 dark:text-green-400 mb-1">{language === "fr" ? "Forces" : "Strengths"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedCountry.content[language].swot.strengths}</p>
                </div>
                <div className="border border-red-100 bg-red-50/10 dark:border-red-950 dark:bg-red-950/5 p-3 rounded-lg">
                  <p className="text-xs font-extrabold text-red-700 dark:text-red-400 mb-1">{language === "fr" ? "Faiblesses" : "Weaknesses"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedCountry.content[language].swot.weaknesses}</p>
                </div>
                <div className="border border-amber-100 bg-amber-50/10 dark:border-amber-950 dark:bg-amber-950/5 p-3 rounded-lg">
                  <p className="text-xs font-extrabold text-amber-700 dark:text-amber-400 mb-1">{language === "fr" ? "Opportunités" : "Opportunities"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedCountry.content[language].swot.opportunities}</p>
                </div>
                <div className="border border-slate-200 bg-slate-50/10 dark:border-slate-800 dark:bg-slate-900/5 p-3 rounded-lg">
                  <p className="text-xs font-extrabold text-secondary dark:text-slate-300 mb-1">{language === "fr" ? "Menaces" : "Threats"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedCountry.content[language].swot.threats}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Policy Events */}
          {recentEvents.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent Policy Events</h4>
              <div className="space-y-2.5">
                {recentEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[event.severity] || "bg-slate-400"}`} />
                    <div>
                      <span className="text-xs font-semibold text-foreground">{event.content?.[language]?.title || event.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-10 px-6 text-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto mb-2">
            {language === "fr"
              ? "Les scores détaillés des piliers et SWOT sont publiés pour le Top 10 des pays leaders."
              : "Detailed SWOT analyses and pillar scores are published for the Top 10 leading countries."}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {language === "fr"
              ? "Les profils complets des marchés émergents seront étendus dans les prochaines mises à jour."
              : "Full emerging market profiles will be expanded in the next quarterly snapshots."}
          </p>
          {recentEvents.length > 0 && (
            <div className="text-left mt-5 border-t border-slate-200 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent Policy Events</h4>
              <div className="space-y-2.5">
                {recentEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[event.severity] || "bg-slate-400"}`} />
                    <div>
                      <span className="text-xs font-semibold text-foreground">{event.content?.[language]?.title || event.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}