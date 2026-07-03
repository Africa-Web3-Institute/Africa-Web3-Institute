const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || "http://localhost:3001";

function getSessionId() {
  let id = sessionStorage.getItem("awi_session_id");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
    sessionStorage.setItem("awi_session_id", id);
  }
  return id;
}

function getReferrer() {
  const ref = document.referrer;
  if (!ref) return "Direct";
  if (ref.includes("google")) return "Google Search";
  if (ref.includes("linkedin")) return "LinkedIn";
  if (ref.includes("twitter") || ref.includes("x.com")) return "Twitter/X";
  if (ref.includes("github")) return "GitHub";
  return ref;
}

export async function trackEvent(eventName, path, eventData = null) {
  try {
    await fetch(`${ANALYTICS_URL}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventName,
        path: path || window.location.pathname,
        referrer: getReferrer(),
        eventData,
      }),
    });
  } catch {
    // Fail silently
  }
}

export function trackPageView(path) {
  trackEvent("pageview", path);
}

export function startHeartbeat(path) {
  const interval = setInterval(() => {
    trackEvent("heartbeat", path);
  }, 20000);
  return () => clearInterval(interval);
}