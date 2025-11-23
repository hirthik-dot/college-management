import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Simple contact/faculty icon
function ContactIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="#b4bac8"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "50%",
        background: "#e6e8ef",
        padding: "3px"
      }}>
      <circle cx="12" cy="8" r="4" />
      <rect x="4" y="16" width="16" height="4" rx="2" />
    </svg>
  );
}

export default function FacultyNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Faculty nav links: Dashboard is always 1st
  const navLinks = [
    { label: "Dashboard", to: "/faculty/dashboard" },
    { label: "Assignments", to: "/faculty/dashboard?view=assignments" },
    { label: "Announcements", to: "/faculty/dashboard?view=announcements" },
    { label: "Students", to: "/faculty/dashboard?view=students" },
    { label: "Leave Apporval", to: "/faculty/dashboard?view=review" }
  ];

  const handleLogout = () => {
    // Clear session, redirect to landing page
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: ""}}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f9f7ff",
          padding: "5px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          minHeight: "56px",
          maxWidth: "1500px",
          margin: "0 auto"
        }}
      >
        {/* Logo and title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.48rem" }}>
          <span style={{
            fontWeight: 750,
            fontSize: "1.05rem",
            color: "#3e5dec",
            letterSpacing: "-1px"
          }}>
            <span style={{
              display: "inline-block",
              width: "21px",
              height: "21px",
              background: "#e3edff",
              borderRadius: "50%",
              verticalAlign: "middle",
              textAlign: "center",
              fontSize: "0.99rem",
              marginRight: 7
            }}>
              🎓
            </span>
            Faculty 
          </span>
        </div>

        {/* Nav Links (5 options, first is dashboard) */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontWeight: 600,
                fontSize: "0.90rem",
                color: location.pathname + location.search === link.to ? "#2d50e6" : "#75829e",
                background: location.pathname + location.search === link.to ? "#eaf1ff" : "none",
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

        {/* Right Section (icon + name + logout) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <ContactIcon />
            <span style={{
              fontWeight: 600,
              fontSize: "0.90rem",
              color: "#75829e",
              padding: "0 10px"
            }}>
              Faculty
            </span>
          </span>
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
