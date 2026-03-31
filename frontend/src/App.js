import { useEffect, useState } from "react";
import FieldCard from "./components/FieldCard";

export default function App() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/fields/")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch fields");
        return r.json();
      })
      .then(setFields)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Field Status</h1>
        <p style={styles.subtitle}>
          Soil moisture recommendations for your fields
        </p>
      </header>

      <main style={styles.main}>
        {loading && <p style={styles.message}>Loading fields...</p>}
        {error && <p style={{ ...styles.message, color: "#c0392b" }}>{error}</p>}
        {!loading && !error && fields.map((f) => (
          <FieldCard key={f.id} field={f} />
        ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f5f6f8",
    minHeight: "100vh",
    padding: "0 0 48px",
  },
  header: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: "32px 40px",
    marginBottom: "32px",
  },
  title: { margin: 0, fontSize: "1.8rem", fontWeight: 700 },
  subtitle: { margin: "6px 0 0", opacity: 0.7, fontSize: "1rem" },
  main: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gap: 20,
  },
  message: { textAlign: "center", color: "#666", fontSize: "1rem" },
};