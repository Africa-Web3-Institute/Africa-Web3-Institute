import { useState, useEffect } from "react";
import { COUNTRIES, ISSUERS } from "../data/trackerCountries"; // fallback

export function useTrackerData() {
  const [countries, setCountries] = useState(COUNTRIES); // starts with static data
  const [issuers, setIssuers] = useState(ISSUERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_STRIDE_API_KEY;
    const baseUrl = import.meta.env.VITE_STRIDE_BASE_URL;

    if (!apiKey) return; // no key = use static data

    setLoading(true);

    Promise.all([
      fetch(`${baseUrl}/countries`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      }).then((r) => r.json()),

      fetch(`${baseUrl}/issuers`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      }).then((r) => r.json()),
    ])
      .then(([countriesData, issuersData]) => {
        setCountries(countriesData);
        setIssuers(issuersData);
      })
      .catch((err) => {
        console.error("STRIDE API error:", err);
        setError(err.message);
        // keeps static fallback data on error
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, issuers, loading, error };
}