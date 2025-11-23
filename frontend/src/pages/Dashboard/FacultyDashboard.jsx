import FacultyAssignments from "./FacultyAssignments";
import FacultyAnnouncements from "./FacultyAnnouncements";
import FacultyStudents from "./FacultyStudents";
import FacultyReview from "./FacultyReview";
import { useLocation } from "react-router-dom";

export default function FacultyDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "dashboard";

  const card = {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
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

  const quickBtnOutline = {
    ...quickBtn,
    background: "#fff",
    color: "#7b2ff7",
    border: "2px solid #7b2ff7",
    boxShadow: "none",
  };

  return (
    <div style={{ maxWidth: 1300, margin: "36px auto", padding: "0 22px" }}>
      
      {view === "dashboard" && (
        <section
          style={{
            background: "linear-gradient(90deg,#f9f5ff 80%,#f2e8ff 100%)",
            borderRadius: "18px",
            padding: "30px 34px",
            boxShadow: "0 2px 16px #e2d9ff55",
          }}
        >
          {/* Title */}
          <h2 style={{ fontWeight: 800, fontSize: "1.6rem", marginBottom: 10 }}>
            Faculty Dashboard
          </h2>
          <p style={{ marginBottom: 25, fontWeight: 600, color: "#363636" }}>
            Manage assignments, announcements, students and reviews — all in one place.
          </p>

          {/* Overview Panel */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div style={card}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Assignments</h3>
              <p style={{ marginTop: 6 }}>Due Today: <b>2</b></p>
            </div>

            <div style={card}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Pending Grades</h3>
              <p style={{ marginTop: 6 }}><b>3</b> awaiting review</p>
            </div>

            <div style={card}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Students</h3>
              <p style={{ marginTop: 6 }}>Arrears: <b>1</b></p>
            </div>

            <div style={card}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Latest Update</h3>
              <p style={{ marginTop: 6 }}>Quiz extended</p>
            </div>
          </div>

          {/* Quick Actions */}
          <h3 style={{ marginBottom: 14, marginTop: 25, fontWeight: 700 }}>
            Quick Actions
          </h3>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button style={quickBtn}>Create Assignment</button>
            <button style={quickBtn}>Post Announcement</button>
            <button style={quickBtnOutline}>View Students</button>
            <button style={quickBtnOutline}>Check Submissions</button>
            <button style={quickBtn}>Start Review</button>
          </div>

          {/* Notification Panel */}
          <h3 style={{ marginBottom: 14, marginTop: 32, fontWeight: 700 }}>
            Notifications
          </h3>

          <div style={{ ...card, background: "#faf7ff" }}>
            <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.8rem" }}>
              <li><b>3 new submissions</b> received in AI Lab assignment.</li>
              <li><b>1 new leave request</b> awaiting approval.</li>
              <li>Reminder: <b>Internal marks update due tonight.</b></li>
              <li>New announcement posted in CSE Dept.</li>
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
