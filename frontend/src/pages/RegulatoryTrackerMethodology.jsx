import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileDown, Flag, Mail } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";

const NAVY = "#0B1437";
const GOLD = "#D4A017";

function SectionKicker({ children }) {
  return <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: GOLD }}>{children}</p>;
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full text-sm" style={{ minWidth: "560px" }}>
        <thead>
          <tr className="border-b border-border" style={{ backgroundColor: "#F9FAFB" }}>
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0" style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[0.8125rem] text-foreground align-top leading-relaxed">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-4 border border-border rounded-lg p-4 bg-white">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[0.8125rem]" style={{ backgroundColor: NAVY }}>
            {i + 1}
          </div>
          <div>
            <p className="font-semibold text-secondary text-[0.9375rem] mb-0.5">{s.title}</p>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RegulatoryTrackerMethodology() {
  const { language } = useLanguage();
  const T = (t[language] && t[language].methodology) || {};

  return (
    <div className="bg-background text-foreground" style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Hero */}
      <section style={{ backgroundColor: NAVY }} className="py-10 lg:py-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[0.75rem] text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">{T.breadcrumbHome || "Home"}</Link>
            <span>/</span>
            <Link to="/country-tracker" className="hover:text-white/70 transition-colors">{T.breadcrumbTracker || "Regulatory Tracker"}</Link>
            <span>/</span>
            <span className="text-white/70">{T.breadcrumbMethodology || "Methodology"}</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: GOLD }}>
            {T.kicker || "AWI Regulatory Tracker Methodology \u2014 Version 1.0"}
          </p>
          <h1 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-bold text-white leading-tight mb-4">
            {T.heroTitle || "Traceable claims. Precise statuses. Accountable updates."}
          </h1>
          <p className="text-[0.9375rem] sm:text-[1.0625rem] max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {T.heroSubtitle || "This methodology governs how the Africa Web3 Institute identifies, verifies, classifies, reviews and publishes developments in digital-asset regulation across African jurisdictions."}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 space-y-16">

        {/* Regulatory intelligence built for trust */}
        <section>
          <SectionKicker>{T.s1Kicker || "Why This Exists"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s1Title || "Regulatory intelligence built for trust"}</h2>
          <div className="rounded-lg p-5 mb-5" style={{ backgroundColor: "#F3F4FF", borderLeft: `3px solid ${GOLD}` }}>
            <p className="text-[0.9375rem] font-semibold text-secondary">
              {T.corePublicationRule || "Core publication rule: every public regulatory claim must carry at least one traceable source, a clearly stated legal status, a verification date and accountable editorial ownership."}
            </p>
          </div>
          <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
            {T.s1Body || "The tracker is policy intelligence, not legal advice. It records what an authority has enacted, published, proposed, announced or implemented, while keeping factual reporting separate from AWI analysis."}
          </p>
        </section>

        {/* What the tracker covers */}
        <section>
          <SectionKicker>{T.s2Kicker || "Scope"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s2Title || "What the tracker covers"}</h2>
          <p className="text-[0.9375rem] text-muted-foreground leading-relaxed mb-5">
            {T.s2Body || "An item is included when it materially affects the legal status, supervision, taxation, licensing, market access, prudential treatment, consumer protection, enforcement or institutional use of digital assets in an African jurisdiction."}
          </p>
          <SimpleTable
            headers={[T.include || "Include", T.usuallyExclude || "Usually exclude"]}
            rows={[
              ["Acts, regulations, rules, directives and gazetted notices", "Routine speeches with no new policy position"],
              ["Licensing, sandbox, enforcement and supervisory actions", "Product launches without regulatory significance"],
              ["Consultations and draft frameworks with stated deadlines", "Unverified rumours or unattributed claims"],
              ["Tax, AML/CFT, payments and cross-border measures", "Commentary that merely repeats an existing rule"],
            ]}
          />
        </section>

        {/* Seven-step verification process */}
        <section>
          <SectionKicker>{T.s3Kicker || "Process"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s3Title || "Seven-step verification process"}</h2>
          <StepList steps={[
            { title: T.step1Title || "Discovery", body: T.step1Body || "The researcher logs the development, jurisdiction, authority, dates and candidate sources." },
            { title: T.step2Title || "Evidence capture", body: T.step2Body || "The researcher archives the primary document or stable official URL and records the access date." },
            { title: T.step3Title || "Classification", body: T.step3Body || "The researcher assigns source tier, regulatory status and affected stakeholder categories." },
            { title: T.step4Title || "Country review", body: T.step4Body || "A named reviewer checks the legal posture, local terminology, effective date and material omissions." },
            { title: T.step5Title || "Editorial approval", body: T.step5Body || "AWI's designated editor validates the wording, evidence trail and separation of fact from analysis." },
            { title: T.step6Title || "Publication", body: T.step6Body || "The approved master entry is published before any derivative social content." },
            { title: T.step7Title || "Post-publication control", body: T.step7Body || "Amendments, withdrawn proposals and corrections are timestamped in the revision history." },
          ]} />
        </section>

        {/* Four-tier source hierarchy */}
        <section>
          <SectionKicker>{T.s4Kicker || "Evidence Standards"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s4Title || "Four-tier source hierarchy"}</h2>
          <SimpleTable
            headers={[T.tier || "Tier", T.type || "Type", T.examples || "Examples", T.permittedUse || "Permitted use"]}
            rows={[
              ["Tier 1", "Binding primary", "Gazette, statute, regulation, court decision, formal regulator instrument", "Required for claims that a rule is legally in force"],
              ["Tier 2", "Official primary", "Regulator notice, consultation, sandbox list, enforcement release, ministry publication", "Sufficient for official proposals, announcements and actions"],
              ["Tier 3", "Authoritative secondary", "Recognised law firm, professional body, academic or multilateral analysis", "Corroboration or provisional reporting only"],
              ["Tier 4", "Media / industry", "Reputable specialist media or market participant publication", "Discovery lead; never sole basis for a confirmed legal claim"],
            ]}
          />
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-4">
            {T.s4Note || "Minimum evidence standard: one Tier 1 or Tier 2 source for a confirmed entry. If only Tier 3 or Tier 4 evidence is available, the entry must be labelled Under Verification and cannot claim that a legal obligation is definitively in force."}
          </p>
        </section>

        {/* Regulatory labels and confidence ratings */}
        <section>
          <SectionKicker>{T.s5Kicker || "Labels"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s5Title || "Regulatory labels and confidence ratings"}</h2>
          <h3 className="text-[1rem] font-bold text-secondary mb-3">{T.statusTaxonomy || "Status taxonomy"}</h3>
          <SimpleTable
            headers={[T.status || "Status", T.meaning || "Meaning", T.editorialRequirement || "Editorial requirement"]}
            rows={[
              ["Enacted", "Formally adopted and legally binding", "Effective date and binding instrument confirmed"],
              ["Published", "Officially issued; force or implementation may be pending", "Authority page or official document confirmed"],
              ["Proposed", "Draft rule, bill or consultation", "Do not describe obligations as final"],
              ["Announced", "Authority statement without published instrument", "Attribute precisely to the announcing authority"],
              ["Operational Guidance", "Implementation instructions or supervisory expectations", "Identify affected entities and commencement date"],
              ["Under Verification", "Credible report lacks adequate primary evidence", "Publish cautiously or hold from public release"],
            ]}
          />
          <h3 className="text-[1rem] font-bold text-secondary mb-3 mt-8">{T.confidenceRating || "Confidence rating"}</h3>
          <SimpleTable
            headers={[T.rating || "Rating", T.threshold || "Threshold", T.publicationTreatment || "Publication treatment"]}
            rows={[
              ["High", "Tier 1/2 evidence; dates and scope confirmed; country review complete", "Publish as confirmed"],
              ["Moderate", "Official evidence exists but scope, date or interpretation remains incomplete", "Publish with explicit qualification"],
              ["Low / Under Verification", "Secondary reporting only, conflicting accounts or missing official text", "Under verification; normally hold from social graphics"],
            ]}
          />
        </section>

        {/* Mandatory fields */}
        <section>
          <SectionKicker>{T.s6Kicker || "Data Standards"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s6Title || "Mandatory fields for verified entries"}</h2>
          <SimpleTable
            headers={[T.fieldGroup || "Field group", T.requiredFields || "Required fields"]}
            rows={[
              ["Identification", "Country; competent authority; development title; policy domain; dates announced and published; effective date; consultation deadline."],
              ["Substance", "Neutral description of what changed; stakeholders affected; practical implications; separate AWI analysis."],
              ["Evidence", "Primary-source URL or document reference; backup source; source tier; access date; archived copy location."],
              ["Governance", "Regulatory status; confidence rating; researcher; country reviewer; editorial approver; last verified date; revision number."],
            ]}
          />
          <div className="rounded-lg p-5 mt-5" style={{ backgroundColor: "#F3F4FF", borderLeft: `3px solid ${GOLD}` }}>
            <p className="text-[0.875rem] font-semibold text-secondary">
              {T.minimumPublishableUnit || "Minimum publishable unit: one primary source + one status label + one verification date + one accountable reviewer. If any element is missing, the entry remains Under Verification."}
            </p>
          </div>
        </section>

        {/* Independent review and accountability */}
        <section>
          <SectionKicker>{T.s7Kicker || "Governance"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s7Title || "Independent review and accountability"}</h2>
          <SimpleTable
            headers={[T.role || "Role", T.coreDuty || "Core duty", T.accountability || "Accountability"]}
            rows={[
              ["Researcher", "Collect evidence; draft neutral summary; complete mandatory fields", "Named on internal record and full tracker entry"],
              ["Country reviewer", "Validate jurisdiction-specific interpretation and context", "Named, with role/institution and conflict disclosure"],
              ["Editorial approver", "Apply methodology consistently; approve publication", "AWI Policy & Research leadership"],
              ["Communications", "Create derivative graphics without changing the approved meaning", "Source link and status label must remain visible"],
              ["Technical custodian", "Maintain source archive, version history and broken-link checks", "Monthly integrity report"],
            ]}
          />
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-4">
            {T.s7Note || "Reviewers disclose relevant professional, client or commercial conflicts. A conflicted reviewer may advise but cannot provide final independent approval."}
          </p>
        </section>

        {/* Corrections and updates */}
        <section>
          <SectionKicker>{T.s8Kicker || "Corrections"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s8Title || "Corrections and updates"}</h2>
          <SimpleTable
            headers={[T.control || "Control", T.requirement || "Requirement"]}
            rows={[
              ["Correction notice", "State what changed, why, the correction date and the approving editor."],
              ["Version history", "Keep superseded entries accessible and link them to the current version."],
              ["Disclosure", "Reviewers disclose relevant employment, client, investment or advocacy interests."],
              ["Recusal", "A conflicted reviewer may advise but cannot provide final independent approval."],
              ["Link integrity", "Check primary-source links monthly and time-sensitive consultations before deadline."],
            ]}
          />
        </section>

        {/* Important notice and citation */}
        <section>
          <SectionKicker>{T.s9Kicker || "Notice"}</SectionKicker>
          <h2 className="text-[1.5rem] font-bold text-secondary mb-4">{T.s9Title || "Important notice and suggested citation"}</h2>
          <div className="border border-border rounded-lg p-5 bg-white mb-5">
            <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
              {T.importantNotice || "The Africa Web3 Regulatory Tracker provides policy intelligence for informational purposes and does not constitute legal advice. Organisations should seek independent legal counsel before making compliance decisions based on tracker entries."}
            </p>
          </div>
          <div className="border border-border rounded-lg p-5" style={{ backgroundColor: "#F9FAFB" }}>
            <p className="text-[0.6875rem] font-bold tracking-wider uppercase text-muted-foreground mb-2">{T.suggestedCitation || "Suggested citation"}</p>
            <p className="text-[0.875rem] text-secondary font-mono leading-relaxed">
              Africa Web3 Institute. ({new Date().getFullYear()}). <em>Africa Web3 Regulatory Tracker</em>. Retrieved from africaweb3institute.org/country-tracker
            </p>
          </div>
          <p className="text-[0.75rem] text-muted-foreground/70 mt-4">
            {T.versionLine || "Version 1.0 \u2014 Africa Web3 Institute \u2014 September 2026"}
          </p>
        </section>
      </div>

      {/* Action strip */}
      <section style={{ backgroundColor: NAVY }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <p className="text-[1.0625rem] font-semibold text-white">{T.ctaTitle || "Questions about a specific classification?"}</p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/country-tracker"
                className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-md transition-colors"
                style={{ backgroundColor: GOLD, color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8891a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = GOLD}>
                <ArrowLeft className="w-4 h-4" /> {T.ctaPrimary || "Return to Regulatory Tracker"}
              </Link>
              <a href="/AWI_Regulatory_Tracker_Methodology_v1.pdf" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold px-5 py-2.5 rounded-md border transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                <FileDown className="w-4 h-4" /> {T.ctaSecondary || "Download Methodology Version 1.0"}
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            <a href="mailto:policy@africaweb3institute.org?subject=Regulatory%20Tracker%20-%20Possible%20Error"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Flag className="w-3.5 h-3.5" style={{ color: GOLD }} /> {T.ctaIntegrity || "Report a Possible Error"}
            </a>
            <a href="mailto:info@africaweb3institute.org?subject=Subscribe%20-%20Regulatory%20Updates"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Mail className="w-3.5 h-3.5" style={{ color: GOLD }} /> {T.ctaRetention || "Subscribe to Regulatory Updates"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
