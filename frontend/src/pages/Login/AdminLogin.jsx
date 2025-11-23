import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    activeSessions: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats(data.stats || stats);
          setRecentActivities(data.activities || []);
        }
      })
      .catch((err) => console.error("Stats fetch error:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "inherit" }}>
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
        zIndex: 100,
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
            fontSize: "1.3rem",
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
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#ff7875")}
          onMouseLeave={(e) => (e.target.style.background = "#ff4d4f")}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#1f2127",
            margin: "0 0 8px 0",
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
          marginBottom: "40px",
        }}>
          {/* Total Students */}
          <StatCard icon="👨‍🎓" count={stats.totalStudents} label="Total Students" gradient="135deg, #667eea 0%, #764ba2 100%" />
          {/* Total Faculty */}
          <StatCard icon="👨‍🏫" count={stats.totalFaculty} label="Faculty Members" gradient="135deg, #f093fb 0%, #f5576c 100%" />
          {/* Total Courses */}
          <StatCard icon="📚" count={stats.totalCourses} label="Active Courses" gradient="135deg, #fa709a 0%, #fee140 100%" />
          {/* Active Sessions */}
          <StatCard icon="⚡" count={stats.activeSessions} label="Active Sessions" gradient="135deg, #4facfe 0%, #00f2fe 100%" />
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "4px",
        }}>
          {["overview", "students", "faculty", "courses", "settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab ? "linear-gradient(135deg, #fa709a, #fee140)" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          minHeight: "400px",
        }}>
          {activeTab === "overview" && <OverviewTab activities={recentActivities} />}
          {activeTab === "students" && <PlaceholderTab icon="👨‍🎓" title="Student management interface coming soon..." />}
          {activeTab === "faculty" && <PlaceholderTab icon="👨‍🏫" title="Faculty management interface coming soon..." />}
          {activeTab === "courses" && <PlaceholderTab icon="📚" title="Course management interface coming soon..." />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({ icon, count, label, gradient }) {
  return (
    <div style={{
      background: `linear-gradient(${gradient})`,
      padding: "28px",
      borderRadius: "16px",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}>
      <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>
        {count}
      </div>
      <div style={{ fontSize: "1rem", opacity: 0.9 }}>{label}</div>
    </div>
  );
}

function PlaceholderTab({ icon, title }) {
  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{icon}</div>
      <p style={{ fontSize: "1.1rem" }}>{title}</p>
    </div>
  );
}

function OverviewTab({ activities }) {
  return (
    <div>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px", color: "#1f2127" }}>
        Recent Activities
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {activities.length > 0 ? activities.map((activity, index) => (
          <div key={index} style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            transition: "all 0.3s",
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              background: `${activity.color || "#ccc"}20`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              marginRight: "16px",
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#1f2127", marginBottom: "4px" }}>
                {activity.action}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                by {activity.user}
              </div>
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{activity.time}</div>
          </div>
        )) : <p>No recent activities</p>}
      </div>
    </div>
  );
}

function SettingsTab() {
  const settings = [
    { icon: "🔔", title: "Notifications", desc: "Manage system notifications and alerts" },
    { icon: "🔐", title: "Security", desc: "Configure security and authentication settings" },
    { icon: "📧", title: "Email Templates", desc: "Customize email templates for communications" },
    { icon: "🎨", title: "Appearance", desc: "Customize portal theme and branding" },
    { icon: "🗄️", title: "Database", desc: "Manage database backups and maintenance" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {settings.map((setting, index) => (
        <div key={index} style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          background: "#f9fafb",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          cursor: "pointer",
          transition: "all 0.3s",
        }}>
          <div style={{ fontSize: "2rem", marginRight: "20px" }}>{setting.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1f2127", marginBottom: "4px" }}>
              {setting.title}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>{setting.desc}</div>
          </div>
          <div style={{ fontSize: "1.5rem", color: "#9ca3af" }}>›</div>
        </div>
      ))}
    </div>
  );
}
