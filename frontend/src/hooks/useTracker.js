import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const TELEMETRY_ENDPOINT = 'http://localhost:3001/api/event';
const HEARTBEAT_INTERVAL_MS = 10000;

export function useTracker() {
  const location = useLocation();

  // Helper to send telemetry events
  const track = useCallback(async (eventName, eventData = {}) => {
    let sessionId = sessionStorage.getItem('awi_analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('awi_analytics_session_id', sessionId);
    }

    const payload = {
      sessionId,
      eventName,
      path: location.pathname + location.search,
      referrer: document.referrer && !document.referrer.includes(window.location.origin) 
        ? document.referrer 
        : 'Direct',
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || navigator.userLanguage,
      eventData,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
    } catch (err) {
      // Fail silently in browser console to not disrupt user experience if telemetry server is down
      console.debug('Telemetry tracking deferred:', err.message);
    }
  }, [location]);

  // Track pageview on location change
  useEffect(() => {
    // Avoid double pageview firing for the analytics dashboard itself
    if (location.pathname === '/analytics') {
      return;
    }

    track('pageview');

    // Heartbeat setup
    const heartbeatTimer = setInterval(() => {
      track('heartbeat');
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(heartbeatTimer);
    };
  }, [location.pathname, location.search, track]);

  // Auto-track clicks on elements with data-analytics-event attribute
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const target = e.target.closest('[data-analytics-event]');
      if (target) {
        const eventName = target.getAttribute('data-analytics-event');
        let eventData = {};
        
        try {
          const rawData = target.getAttribute('data-analytics-data');
          if (rawData) {
            eventData = JSON.parse(rawData);
          }
        } catch (err) {
          console.error('Failed to parse telemetry metadata:', err);
        }

        if (!eventData.text) {
          eventData.text = target.innerText.trim().substring(0, 40);
        }
        if (target.id) {
          eventData.elementId = target.id;
        }

        track(eventName, eventData);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [track]);

  // Expose to window for global access
  useEffect(() => {
    window.tracker = { track };
  }, [track]);

  return { track };
}
