import React from "react";

/**
 * Shared section header used across all homepage sections.
 * eyebrow: small all-caps label
 * heading: main H2
 * align: "left" | "center"
 */
export default function SectionHeader({ eyebrow, heading, align = "left" }) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "text-center" : ""}>
      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-3">
        {eyebrow}
      </p>
      <h2 className="text-[1.75rem] lg:text-[2rem] font-bold text-secondary leading-snug tracking-tight">
        {heading}
      </h2>
    </div>
  );
}