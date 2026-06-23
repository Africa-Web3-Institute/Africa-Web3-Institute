import React from "react";
import {FaLinkedin as Linkedin} from "react-icons/fa6";
import {useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";





export default function AdvisoryBoardCard({ member }) {
  const [hovered, setHovered] = React.useState(false);
  const { language } = useLanguage();
    const T = t[language].about;

  return (
    <div
      role="article"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setHovered(!hovered);
        }
      }}
      className="bg-white flex flex-col items-center text-center transition-all duration-200 overflow-hidden"
      style={{
        border: hovered ? "1.5px solid #D4A017" : "1.5px solid hsl(var(--border))",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Photo */}
      <div className="w-full aspect-square overflow-hidden"
        style={{ maxHeight: "360px" }}>
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0B1437" }}>
            <span className="text-[2rem] font-bold" style={{ color: "#D4A017" }}>
              {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col items-center flex-1">
        {/* Advisory badge */}
        <span
          className="text-[0.625rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 mb-3"
          style={{ backgroundColor: "rgba(212,160,23,0.1)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}
        >
          {T.advisoryTitle}
        </span>

        <p className="text-[1rem] font-bold text-secondary mb-1 leading-snug">{member.name}</p>

        {member.country && (
          <p className="text-[0.8125rem] font-medium mb-4" style={{ color: "#D4A017" }}>
            {member.country}
          </p>
        )}

        {/* LinkedIn */}
        {member.linkedin && (
          <a
            href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="mt-auto w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}