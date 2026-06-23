import React from "react";
import { Link } from "react-router-dom";

export default function TermsOfUse() {
  return (
    <div className="bg-background text-foreground">
      <title>Terms of Use | Africa Web3 Institute</title>

      {/* Hero */}
      <section className="py-16 border-b border-border" style={{ background: "linear-gradient(135deg, hsl(220 20% 8%) 0%, hsl(224 82% 14%) 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>Legal</p>
          <h1 className="text-[2rem] lg:text-[2.75rem] font-bold text-white leading-snug mb-3">
            Terms of Use — Africa Web3 Institute
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Last updated: May 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-[1.85]">
              By accessing or using the Africa Web3 Institute website (africaweb3institute.org), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use this website. We reserve the right to update these terms at any time; continued use of the site constitutes acceptance of any changes.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">2. Use of Content</h2>
            <p className="text-muted-foreground leading-[1.85]">
              All content on this website — including reports, articles, research papers, graphics, and data — is provided for informational and educational purposes. You may share or reference our content for non-commercial purposes, provided you clearly attribute Africa Web3 Institute and link back to the original source. Commercial use, reproduction, or redistribution of our research without written permission is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground leading-[1.85]">
              All intellectual property rights in the content of this website, including but not limited to the Africa Web3 Policy and Innovation Index (AWPII), Africa Blockchain Awards materials, logos, and branding, are owned by or licensed to Africa Web3 Institute. Nothing on this site grants you any licence or right to use our intellectual property without prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">4. Disclaimer</h2>
            <p className="text-muted-foreground leading-[1.85]">
              The information on this website is provided in good faith and for general informational purposes only. Africa Web3 Institute makes no warranties or representations about the accuracy, completeness, or suitability of the content for any particular purpose. Nothing on this site constitutes legal, financial, or investment advice.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-[1.85]">
              To the fullest extent permitted by applicable law, Africa Web3 Institute shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of, or inability to use, this website or its content. This includes, without limitation, loss of data, loss of profits, or business interruption.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">6. Contact</h2>
            <p className="text-muted-foreground leading-[1.85]">
              For questions regarding these Terms of Use, please contact:{" "}
              <a href="mailto:info@africaweb3institute.org" className="text-accent underline underline-offset-4">
                info@africaweb3institute.org
              </a>
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <Link to="/" className="text-[0.875rem] text-muted-foreground hover:text-secondary transition-colors">
              ← Back to Africa Web3 Institute homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}