function getMagnitudeColor(mag) {
  if (mag >= 5.0) return "var(--danger)";
  if (mag >= 3.0) return "var(--warning)";
  return "var(--safe)";
}

function RecentList({ quakes }) {
  const recent = quakes
    .sort((a, b) => b.properties.time - a.properties.time)
    .slice(0, 10);

  return (
    <div className="recent-list">
      <h2 className="panel-title">Recent Activity</h2>
      {recent.map((quake) => {
        const mag = quake.properties.mag?.toFixed(1) ?? "?";
        const place = quake.properties.place ?? "Unknown location";
        const time = new Date(quake.properties.time).toLocaleTimeString();

        return (
          <div className="quake-item" key={quake.id}>
            <div
              className="mag-badge"
              style={{
                backgroundColor: getMagnitudeColor(quake.properties.mag),
              }}
            >
              {mag}
            </div>
            <div className="quake-info">
              <p className="quake-place">{place}</p>
              <p className="quake-time">{time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentList;
