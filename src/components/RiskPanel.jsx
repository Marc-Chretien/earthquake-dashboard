import { useState } from "react";
import { calculateRiskScore } from "../utils/riskCalculator";

function RiskPanel({ onLocationQuakes }) {
  const [status, setStatus] = useState("idle");
  const [risk, setRisk] = useState(null);
  const [localStats, setLocalStats] = useState(null);
  const [locationName, setLocationName] = useState("");

  async function handleCheckRisk() {
    setStatus("locating");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus("fetching");

        try {
          // Reverse geocode to get city name
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const city =
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village ||
            "your area";
          setLocationName(city);

          // Fetch quakes within 500km, last 30 days
          const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${latitude}&longitude=${longitude}&maxradiuskm=500&starttime=${getDateDaysAgo(
            30
          )}&minmagnitude=1.0`;
          const res = await fetch(url);
          const data = await res.json();
          const quakes = data.features;

          const riskResult = calculateRiskScore(quakes);
          const biggest = quakes.reduce(
            (max, q) => Math.max(max, q.properties.mag ?? 0),
            0
          );

          setRisk(riskResult);
          setLocalStats({
            total: quakes.length,
            biggest: biggest.toFixed(1),
            significant: quakes.filter((q) => q.properties.mag >= 4.0).length,
          });
          onLocationQuakes(quakes);
          setStatus("done");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied")
    );
  }

  return (
    <div className="risk-panel">
      <h2 className="panel-title">Local Risk Assessment</h2>

      {status === "idle" && (
        <button className="risk-btn" onClick={handleCheckRisk}>
          📍 Check My Risk
        </button>
      )}

      {status === "locating" && (
        <p className="status-text">Getting your location...</p>
      )}
      {status === "fetching" && (
        <p className="status-text">Analyzing seismic activity near you...</p>
      )}
      {status === "denied" && (
        <p className="status-text error-text">
          Location access denied. Enable it in your browser to use this feature.
        </p>
      )}
      {status === "error" && (
        <p className="status-text error-text">
          Something went wrong. Try again.
        </p>
      )}

      {status === "done" && risk && localStats && (
        <div className="risk-result">
          <p className="risk-location">📍 {locationName}</p>
          <div className="risk-score" style={{ color: risk.color }}>
            <span className="risk-number">{risk.score}</span>
            <span className="risk-label">{risk.label} Risk</span>
          </div>
          <div className="risk-stats">
            <div className="risk-stat">
              <p className="risk-stat-value">{localStats.total}</p>
              <p className="risk-stat-label">Quakes (30d)</p>
            </div>
            <div className="risk-stat">
              <p className="risk-stat-value">{localStats.biggest}M</p>
              <p className="risk-stat-label">Biggest</p>
            </div>
            <div className="risk-stat">
              <p className="risk-stat-value">{localStats.significant}</p>
              <p className="risk-stat-label">Mag 4.0+</p>
            </div>
          </div>
          <button
            className="risk-btn risk-btn-secondary"
            onClick={() => {
              setStatus("idle");
              setRisk(null);
              setLocalStats(null);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

export default RiskPanel;
