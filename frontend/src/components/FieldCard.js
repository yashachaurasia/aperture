import StatusBadge from "./StatusBadge";

export default function FieldCard({ field }) {
  const {
    name,
    current_soil_moisture,
    stress_threshold,
    ideal_soil_moisture,
    status,
    explanation,
  } = field;

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <h2 style={styles.name}>{name}</h2>
        <StatusBadge status={status} />
      </div>

      <p style={styles.explanation}>{explanation}</p>

      <div style={styles.stats}>
        <Stat label="Current Moisture" value={current_soil_moisture} />
        <Stat label="Stress Threshold" value={stress_threshold} />
        <Stat label="Ideal Moisture" value={ideal_soil_moisture} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value.toFixed(2)}</span>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "24px 28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { margin: 0, fontSize: "1.2rem", fontWeight: 600, color: "#1a1a2e" },
  explanation: {
    margin: "0 0 20px",
    color: "#555",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  stats: { display: "flex", gap: 24, flexWrap: "wrap" },
  stat: { display: "flex", flexDirection: "column", gap: 2 },
  statLabel: { fontSize: "0.75rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" },
  statValue: { fontSize: "1.1rem", fontWeight: 600, color: "#1a1a2e" },
};