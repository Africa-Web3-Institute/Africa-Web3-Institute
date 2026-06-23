import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    let attempts = 0;

    const scroll = () => {
      const el = document.getElementById(id);

      if (el) {
        const yOffset = -80; // safe offset for sticky headers
        const y =
          el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }

      if (attempts < 10) {
        attempts++;
        setTimeout(scroll, 100);
      }
    };

    setTimeout(scroll, 150);
  }, [pathname, hash]);

  return null;
}