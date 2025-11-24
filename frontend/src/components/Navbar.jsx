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

// Notification Bell Icon
function BellIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="#75829e"
      style={{
        cursor: "pointer",
        padding: "4px",
        background: "#e6e8ef",
        borderRadius: "50%",
      }}
    >
      <path d="M12 2C10.34 2 9 3.34 9 5V6.1C6.72 7.1 5 9.39 5 12V17L3 19V20H21V19L19 17V12C19 9.39 17.28 7.1 15 6.1V5C15 3.34 13.66 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "Guest" });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const navLinks = [
    { label: "Dashboard", to: "/student/dashboard" },
    { label: "Workspace", to: "/student/workspace" },
    { label: "Assessments", to: "/student/assessments" },
    { label: "AI Assistant", to: "/student/ai" },
    { label: "Analytics", to: "/student/analytics" },
    { label: "Arrears", to: "/student/arrears" },
  ];

  // Fetch Profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  // Fetch unread count live
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchUnread() {
      try {
        const res = await fetch(`${apiUrl}/api/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Compare with readAnnouncements in user profile
        const readIds = profile.readAnnouncements || [];
        const unread = data.filter((ann) => !readIds.includes(ann._id));
        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    }

    // Initial fetch
    fetchUnread();

    // Poll every 10 seconds
    const interval = setInterval(fetchUnread, 10000);

    return () => clearInterval(interval);
  }, [apiUrl, profile.readAnnouncements]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "19px",
                height: "19px",
                background: "#f4f6ff",
                borderRadius: "50%",
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
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {/* Bell With Unread Badge */}
          <Link to="/student-notifications" style={{ position: "relative" }}>
            <BellIcon />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: "#ff4d4f",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to="/student/profile"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: "0.3rem",
            }}
          >
            <ContactIcon />
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.90rem",
                color: "#75829e",
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
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
