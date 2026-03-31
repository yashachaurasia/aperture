const CONFIG = {
  "Consider Irrigating": { bg: "#fdecea", color: "#c0392b", icon: "🔴" },
  "Investigate":         { bg: "#fef9e7", color: "#d4860a", icon: "🟡" },
  "No Action Needed":    { bg: "#eafaf1", color: "#1e8449", icon: "🟢" },
};

export default function StatusBadge({ status }) {
  const { bg, color, icon } = CONFIG[status] || { bg: "#eee", color: "#333", icon: "⚪" };
  return (
    <span style={{ backgroundColor: bg, color, borderRadius: 20, padding: "5px 14px", fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
      {icon} {status}
    </span>
  );
}