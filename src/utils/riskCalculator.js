export function calculateRiskScore(quakes) {
  if (quakes.length === 0)
    return { score: 0, label: "Minimal", color: "#10b981" };

  const weightedSum = quakes.reduce((sum, quake) => {
    const mag = quake.properties.mag ?? 0;
    const depth = quake.geometry.coordinates[2] ?? 100;

    // Higher magnitude = exponentially more dangerous
    const magWeight = Math.pow(10, mag - 1);

    // Shallower quakes are more dangerous (depth in km)
    const depthWeight = Math.max(0.1, 1 - depth / 300);

    return sum + magWeight * depthWeight;
  }, 0);

  // Normalize to 0-100
  const score = Math.min(100, Math.round(weightedSum / 50));

  if (score >= 60) return { score, label: "High", color: "#ef4444" };
  if (score >= 30) return { score, label: "Moderate", color: "#f59e0b" };
  if (score >= 10) return { score, label: "Low", color: "#6366f1" };
  return { score, label: "Minimal", color: "#10b981" };
}
