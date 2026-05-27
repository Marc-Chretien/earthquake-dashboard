function StatCards({ quakes }) {
  const today = quakes.length;

  const biggest = quakes
    .reduce((max, q) => {
      return q.properties.mag > max ? q.properties.mag : max;
    }, 0)
    .toFixed(1);

  const significant = quakes.filter((q) => q.properties.mag >= 4.0).length;

  const stats = [
    { label: "Quakes (24h)", value: today, color: "var(--accent)" },
    { label: "Biggest", value: biggest + " M", color: "var(--danger)" },
    { label: "Magnitude 4.0+", value: significant, color: "var(--warning)" },
  ];

  return (
    <div className="stat-cards">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <p className="stat-value" style={{ color: stat.color }}>
            {stat.value}
          </p>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatCards;
