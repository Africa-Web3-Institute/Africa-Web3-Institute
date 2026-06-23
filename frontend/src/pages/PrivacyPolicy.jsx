import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="bg-background text-foreground">
      <title>Privacy Policy | Africa Web3 Institute</title>

      {/* Hero */}
      <section className="py-16 border-b border-border" style={{ background: "linear-gradient(135deg, hsl(220 20% 8%) 0%, hsl(224 82% 14%) 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#D4A017" }}>Legal</p>
          <h1 className="text-[2rem] lg:text-[2.75rem] font-bold text-white leading-snug mb-3">
            Privacy Policy — Africa Web3 Institute
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Last updated: May 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">1. What Data We Collect</h2>
            <p className="text-muted-foreground leading-[1.85] mb-3">
              We may collect personal information you voluntarily provide when you contact us, sign up for our newsletter, submit a nomination, or otherwise engage with our services. This may include your name, email address, organisation, and any information you include in correspondence with us.
            </p>
            <p className="text-muted-foreground leading-[1.85]">
              We also automatically collect certain non-personal data through analytics tools, including your IP address, browser type, pages visited, and referring URLs. This data is used in aggregate form and is not linked to your personal identity.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">2. How We Use Your Data</h2>
            <p className="text-muted-foreground leading-[1.85] mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "Respond to your enquiries and requests",
                "Send newsletters and research updates (only if you opt in)",
                "Process award nominations",
                "Improve the quality of our website and services",
                "Comply with legal obligations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[0.45rem] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-[1.85] mt-4">
              We will never sell, rent, or share your personal data with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">3. Cookies</h2>
            <p className="text-muted-foreground leading-[1.85]">
              Our website may use cookies — small text files stored on your device — to improve your browsing experience and gather aggregate analytics data. You can disable cookies in your browser settings, though this may affect the functionality of certain parts of the site.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-[1.85]">
              We may use third-party services such as analytics providers or email delivery platforms. These providers may process your data in accordance with their own privacy policies. We only work with providers who meet adequate data protection standards.
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground leading-[1.85] mb-3">
              Depending on your location, you may have the right to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "Access the personal data we hold about you",
                "Request correction of inaccurate data",
                "Request deletion of your data",
                "Withdraw consent to marketing communications at any time",
                "Lodge a complaint with a relevant data protection authority",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[0.45rem] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-bold text-secondary mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-[1.85]">
              If you have any questions about this privacy policy or how we handle your data, please contact us at:{" "}
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