// src/components/Analytics.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, startHeartbeat } from "../lib/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
    const stop = startHeartbeat(location.pathname);
    return () => stop();
  }, [location.pathname]);

  return null;
}