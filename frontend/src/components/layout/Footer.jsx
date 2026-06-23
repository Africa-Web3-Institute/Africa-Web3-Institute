import { Link } from "react-router-dom";
import {
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaTwitter as Twitter,
} from "react-icons/fa6";

import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";

export default function Footer() {
  const { language } = useLanguage();
  const T = t[language].footer;

  // detect hash links safely


 const renderLinks = (section) => (
  <div>
    <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4A017] mb-5">
      {section.title}
    </h4>

    <ul className="space-y-3">
      {section.links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
  return (
    <footer className="bg-[#0B1437] border-t border-[#D4A017]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">

          {/* BRAND */}
          <div>
            <Link to="/">
              <img
                src="https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/23d3c088d_80f640b57_Logo1.png"
                alt="Africa Web3 Institute logo"
                className="h-9 mb-5"
              />
            </Link>

            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-sm">
              {T.description}
            </p>

            <a
              href="mailto:info@africaweb3institute.org"
              className="text-sm text-white/40 hover:text-[#D4A017] transition-colors block mb-6"
            >
              info@africaweb3institute.org
            </a>

            {/* SOCIALS */}
            <div className="flex gap-3">
              <a
                href="https://x.com/AfricaWeb3_Inst"
                target="_blank"
                rel="noopener noreferrer"
                   aria-label="Africa Web3 Institute on X (Twitter)"
                className="w-9 h-9 flex items-center justify-center rounded transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>"
              
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/company/africa-web3-institute/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Africa Web3 Institute on LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
              
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://www.facebook.com/share/1GPDn5xK8G/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Africa Web3 Institute on Facebook"
                 className="w-9 h-9 flex items-center justify-center rounded transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4A017"; e.currentTarget.style.color = "#D4A017"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
                <Facebook className="w-4 h-4" />
              </a>
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
            <p className="text-xs text-white/30">
              {T.copyright}
            </p>

            <span className="inline-block mt-2 text-[10px] tracking-widest uppercase px-3 py-1 border border-[#D4A017]/30 text-[#D4A017]">
              {T.badge}
            </span>
          </div>

          <div className="flex gap-6 text-xs">
            <Link
              to="/privacy-policy"
              className="text-white/30 hover:text-white transition-colors"
            >
              {T.privacy}
            </Link>

            <Link
              to="/terms-of-use"
              className="text-white/30 hover:text-white transition-colors"
            >
              {T.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}