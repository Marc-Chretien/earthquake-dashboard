import { useState, useEffect } from "react";
import "./index.css";
import StatCards from "./components/StatCards";

function App() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        setQuakes(data.features);
        setLoading(false);
      })
      .catch((err) => {
        console.error("USGS fetch failed:", err);
        setError("Failed to load earthquake data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading earthquake data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <header>
        <h1>🌍 EarthWatch</h1>
        <p>{quakes.length} earthquakes in the last 24 hours</p>
      </header>
      <main>
        <StatCards quakes={quakes} />
      </main>
    </div>
  );
}

export default App;
