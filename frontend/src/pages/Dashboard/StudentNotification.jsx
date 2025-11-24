import React, { useEffect, useState } from "react";

export default function StudentNotifications() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/announcements`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching announcements:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Optional: auto-remove expired announcements every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncements((prev) =>
        prev.filter(
          (a) =>
            a.status !== "Expired" &&
            (!a.expiresAt || new Date(a.expiresAt) > new Date())
        )
      );
    }, 60 * 1000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter out expired before rendering (instant effect)
  const visibleAnnouncements = announcements.filter(
    (a) =>
      a.status !== "Expired" &&
      (!a.expiresAt || new Date(a.expiresAt) > new Date())
  );

  return (
    <div style={{ padding: "25px 40px" }}>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          marginBottom: "20px",
          color: "#174fd6",
        }}
      >
        Notifications / Announcements
      </h2>

      {loading ? (
        <p style={{ color: "#75829e" }}>Loading announcements…</p>
      ) : visibleAnnouncements.length === 0 ? (
        <p style={{ color: "#75829e" }}>No announcements found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {visibleAnnouncements.map((a) => (
            <div
              key={a._id}
              style={{
                padding: "18px 22px",
                background: "#f9f9ff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #174fd6",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#333",
                }}
              >
                {a.title}
              </h3>

              <p
                style={{
                  margin: "8px 0",
                  color: "#555",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-line",
                }}
              >
                {a.body}
              </p>

              {a.category && (
                <span
                  style={{
                    padding: "4px 10px",
                    background: "#eaf1ff",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#174fd6",
                  }}
                >
                  {a.category}
                </span>
              )}

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.8rem",
                  color: "#75829e",
                }}
              >
                📅 {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
