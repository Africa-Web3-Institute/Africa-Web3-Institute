import { Link } from "react-router-dom";
import {
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaXTwitter as Twitter,
} from "react-icons/fa6";

import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function Footer() {
  const { language } = useLanguage();
  const T = t[language].footer;

  const renderLinks = (section) => (
    <div>
      <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={{ color: "#D4A017" }}>
        {section.title}
      </h4>

      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm transition-colors"
              style={{ color: "#111827" }}
              onMouseEnter={e => e.currentTarget.style.color = "#D4A017"}
              onMouseLeave={e => e.currentTarget.style.color = "#111827"}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

   const socialLinks = [
    {
      icon: Twitter,
      href: "https://x.com/AfricaWeb3_Inst",
      label: "X (Twitter)",
      color: "#D4A017"
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/africa-web3-institute/",
      label: "LinkedIn",
      color: "#0A66C2"
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1GPDn5xK8G/",
      label: "Facebook",
      color: "#1877F2"
    },
  
  ];

  return (
    <footer style={{ backgroundColor: "#fff", borderTop: "1px solid #E5E7EB" }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 pb-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12" style={{ borderBottom: "2px solid #D4A017" }}>

          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img
                src="/awi-logo.png"
                alt="Africa Web3 Institute logo"
                className="h-20 mb-5"
                loading="lazy"
                decoding="async"
              />
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "#111827" }}>
              {T.description}
            </p>

            <Link
              to="/contact"
              className="text-sm transition-colors block mb-6"
              style={{ color: "#111827" }}
              onMouseEnter={e => e.currentTarget.style.color = "#D4A017"}
              onMouseLeave={e => e.currentTarget.style.color = "#111827"}
            >
              info@africaweb3institute.org
            </Link>

          {/* SOCIALS */}
           <div className="flex flex-wrap gap-2 pt-2">
  {socialLinks.map((social, index) => (
    <a
      key={index}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 group relative bg-white"
      style={{ 
        border: "1px solid rgba(0,0,0,0.1)",
        color: "rgba(0,0,0,0.7)"
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.borderColor = social.color;
        e.currentTarget.style.color = social.color;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${social.color}30`;
      }}
      onMouseLeave={e => { 
        // Reset to the default dark color, not white
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
        e.currentTarget.style.color = "rgba(0,0,0,0.7)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <social.icon className="w-4 h-4" />
    </a>
  ))}
</div>
          </div>

          {/* EXPLORE */}
          {renderLinks(T.explore)}

          {/* RESOURCES */}
          {renderLinks(T.resources)}

          {/* CONNECT */}
          {renderLinks(T.connect)}
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-center md:text-left">
            <p className="text-xs" style={{ color: "#111827" }}>
              {T.copyright}
            </p>

            <span
              className="inline-block mt-2 text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1"
              style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017" }}
            >
              {T.badge}
            </span>
          </div>

          <div className="flex gap-6 text-xs">
            <Link
              to="/privacy-policy"
              className="transition-colors"
              style={{ color: "#111827" }}
              onMouseEnter={e => e.currentTarget.style.color = "#D4A017"}
              onMouseLeave={e => e.currentTarget.style.color = "#111827"}
            >
              {T.privacy}
            </Link>

            <Link
              to="/terms-of-use"
              className="transition-colors"
              style={{ color: "#111827" }}
              onMouseEnter={e => e.currentTarget.style.color = "#D4A017"}
              onMouseLeave={e => e.currentTarget.style.color = "#111827"}
            >
              {T.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
