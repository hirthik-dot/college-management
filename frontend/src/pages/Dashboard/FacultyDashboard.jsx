import FacultyAssignments from "./FacultyAssignments";
import FacultyAnnouncements from "./FacultyAnnouncements";
import FacultyStudents from "./FacultyStudents";
import FacultyReview from "./FacultyReview";
import { useLocation } from "react-router-dom";
import { useState } from "react";

// Sample data for overview and notifications
const OVERVIEW = [
  { title: "Assignments", value: 2, subtitle: "Due Today" },
  { title: "Pending Grades", value: 3, subtitle: "Awaiting Review" },
  { title: "Students", value: 1, subtitle: "Arrears" },
  { title: "Latest Update", value: "", subtitle: "Quiz extended" },
];

const NOTIFICATIONS = [
  { text: "3 new submissions received in AI Lab assignment.", time: "10 mins ago" },
  { text: "1 new leave request awaiting approval.", time: "30 mins ago" },
  { text: "Internal marks update due tonight.", time: "1 hr ago" },
  { text: "New announcement posted in CSE Dept.", time: "2 hrs ago" },
];

export default function FacultyDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "dashboard";

  const [quickActionClicked, setQuickActionClicked] = useState("");

  // Common inline styles
  const sectionStyle = {
    borderRadius: "18px",
    padding: "30px",
    background: "linear-gradient(90deg,#f9f5ff 80%,#f2e8ff 100%)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  const overviewCardStyle = {
    background: "rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
    transition: "transform 0.25s, box-shadow 0.25s",
  };

  const quickBtn = {
    padding: "14px 20px",
    background: "#7b2ff7",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(123,47,247,0.25)",
    transition: "0.25s",
  };

  const quickBtnActive = {
    ...quickBtn,
    background: "#5a0ecc",
    boxShadow: "0 6px 15px rgba(90,14,204,0.35)",
  };

  const notifCard = {
    background: "rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
  };

  return (
    <div style={{ padding: 30, fontFamily: "Inter, sans-serif" }}>
      {view === "dashboard" && (
        <section style={sectionStyle}>
          {/* Title */}
          <h2 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: 10 }}>Faculty Dashboard</h2>
          <p style={{ marginBottom: 25, fontWeight: 600, color: "#363636" }}>
            Manage assignments, announcements, students, and reviews — all in one place.
          </p>

          {/* Overview Panel */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {OVERVIEW.map((item, idx) => (
              <div
                key={idx}
                style={{
                  ...overviewCardStyle,
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
              >
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <p style={{ marginTop: 6 }}>
                  {item.subtitle}: <b>{item.value}</b>
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h3 style={{ marginTop: 30, marginBottom: 14, fontWeight: 700 }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["Create Assignment", "Post Announcement", "View Students", "Check Submissions", "Start Review"].map(
              (action) => (
                <button
                  key={action}
                  style={quickActionClicked === action ? quickBtnActive : quickBtn}
                  onClick={() => setQuickActionClicked(action)}
                >
                  {action}
                </button>
              )
            )}
          </div>

          {/* Notifications */}
          <h3 style={{ marginTop: 32, marginBottom: 14, fontWeight: 700 }}>Notifications</h3>
          <div style={notifCard}>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: "1.8rem" }}>
              {NOTIFICATIONS.map((note, idx) => (
                <li key={idx}>
                  {note.text} <span style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginTop: 2 }}>{note.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {view === "assignments" && <FacultyAssignments />}
      {view === "announcements" && <FacultyAnnouncements />}
      {view === "students" && <FacultyStudents />}
      {view === "review" && <FacultyReview />}
    </div>
  );
}
