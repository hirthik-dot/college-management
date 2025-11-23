import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Contact Icon Component
function ContactIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="#b4bac8"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "50%",
        background: "#e6e8ef",
        padding: "3px",
        cursor: "pointer",
      }}
    >
      <circle cx="12" cy="8" r="4" />
      <rect x="4" y="16" width="16" height="4" rx="2" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "Guest", has_arrears: false });
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { label: "Dashboard", to: "/student/dashboard" },
    { label: "Workspace", to: "/student/workspace" },
    { label: "Assessments", to: "/student/assessments" },
    { label: "AI Assistant", to: "/student/ai" },
    { label: "Analytics", to: "/student/analytics" },
    { label: "Arrears", to: "/student/arrears" },
  ];

  // Detect API URL: local vs production
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch profile from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (!data.error) setProfile(data);
      })
      .catch((err) => {
        console.error("❌ Profile fetch error:", err);
        setProfile({ name: "Guest", has_arrears: false });
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Hide navbar on certain pages
  const HIDE_ON_PATHS = ["/", "/login/student", "/login/faculty", "/login/admin"];
  if (HIDE_ON_PATHS.includes(location.pathname)) return null;

  return (
    <div style={{ padding: "10px 14px" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f9f7f7",
          padding: "5px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          minHeight: "56px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.48rem" }}>
          <span
            style={{
              fontWeight: 750,
              fontSize: "1rem",
              color: "#174fd6",
              letterSpacing: "-1px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "19px",
                height: "19px",
                background: "#f4f6ff",
                borderRadius: "50%",
                verticalAlign: "middle",
                textAlign: "center",
                fontSize: "0.83rem",
                marginRight: 7,
              }}
            >
              🛡️
            </span>
            EduConnect Hub
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontWeight: 600,
                fontSize: "0.90rem",
                color: location.pathname === link.to ? "#174fd6" : "#75829e",
                background: location.pathname === link.to ? "#eaf1ff" : "none",
                padding: "6px 12px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "background .15s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {/* Download Icon */}
          <span
            style={{
              fontSize: "1.01rem",
              color: "#174fd6",
              height: "19px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            ⬇️
          </span>

          {/* Profile */}
          <Link
            to="/student/profile"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "0.3rem" }}
          >
            <ContactIcon />
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.90rem",
                color: "#75829e",
                padding: "0 10px",
              }}
            >
              {loading ? "Loading..." : profile.name}
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#ff7875")}
            onMouseLeave={(e) => (e.target.style.background = "#ff4d4f")}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
