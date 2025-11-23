import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
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
    fetch('http://localhost:5000/api/admin/stats', {
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "inherit",
      padding: "40px", // Add padding since navbar is removed
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      {/* Page Header */}
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

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* Total Students */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "28px",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
        }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>👨‍🎓</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>
            {stats.totalStudents || "1,234"}
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Total Students</div>
        </div>

        {/* Total Faculty */}
        <div style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          padding: "28px",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)"
        }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>👨‍🏫</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>
            {stats.totalFaculty || "87"}
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Faculty Members</div>
        </div>

        {/* Total Courses */}
        <div style={{
          background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          padding: "28px",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(250, 112, 154, 0.3)"
        }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>📚</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>
            {stats.totalCourses || "145"}
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Active Courses</div>
        </div>

        {/* Active Sessions */}
        <div style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          padding: "28px",
          borderRadius: "16px",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)"
        }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>⚡</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>
            {stats.activeSessions || "342"}
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Active Sessions</div>
        </div>
      </div>

      {/* Tabs and Tab Content */}
      {/* ... rest of your tabs and content remains unchanged ... */}
    </div>
  );
}
