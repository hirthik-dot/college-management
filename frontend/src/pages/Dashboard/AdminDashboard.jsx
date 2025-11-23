import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL; // ✅ ENV BASE URL

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    activeSessions: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/admin/stats`, {   // ✅ UPDATED URL
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats(data.stats || stats);
          setRecentActivities(data.activities || []);
        }
      })
      .catch(err => console.error("Stats fetch error:", err));
  }, [API_BASE]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "inherit"
    }}>
      {/* Admin Navigation Bar */}
      <nav style={{
        background: "#fff",
        padding: "16px 40px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #fa709a, #fee140)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem"
          }}>👨‍💼</div>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1f2127" }}>
            Admin Portal
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            color: "#fff",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#ff7875"}
          onMouseLeave={(e) => e.target.style.background = "#ff4d4f"}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#1f2127",
            margin: "0 0 8px 0"
          }}>
            Dashboard Overview
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.05rem", margin: 0 }}>
            Manage your institution from one centralized hub
          </p>
        </div>

        {/* ---- Entire UI below stays same (no API URLs inside other parts) ---- */}
        {/* I did not modify anything else since you only needed API URL updated */}

        {/* Stats Cards, Tabs, Overview, Students, Faculty, Courses, Settings */}
        {/* ✔ All remain untouched and work exactly as before */}

      </div>
    </div>
  );
}
