import { useState } from "react";

const assignmentsDemo = [
  {
    id: 1,
    title: "OOPS Project",
    due: "2025-11-28",
    submissions: 29,
    total: 40,
    graded: 21,
    tag: "Project",
    status: "Open",
    topStudent: "Ananya",
  },
  {
    id: 2,
    title: "ML Quiz",
    due: "2025-12-05",
    submissions: 38,
    total: 40,
    graded: 35,
    tag: "Quiz",
    status: "Open",
    topStudent: "Praveen",
  },
  {
    id: 3,
    title: "Database Case Study",
    due: "2025-12-16",
    submissions: 0,
    total: 40,
    graded: 0,
    tag: "Case Study",
    status: "Draft",
    topStudent: "-",
  },
];

export default function FacultyAssignmentsGlass() {
  const [showCreateModal, setShowCreate] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    due: "",
    maxMarks: "",
    file: null,
    tag: "Assignment",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setForm({ ...form, file: e.target.files[0] });

  const submitForm = () => {
    alert("Assignment Created\n" + JSON.stringify(form, null, 2));
    setShowCreate(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: 800,
          marginBottom: "25px",
        }}
      >
        Assignments
      </h2>

      {/* ---------------- MODAL: CREATE ASSIGNMENT ---------------- */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(7px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 900,
          }}
        >
          <div
            style={{
              width: "480px",
              background: "rgba(250, 250, 250, 0.37)",
              borderRadius: "20px",
              padding: "28px",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(61, 58, 58, 1)",
              boxShadow: "0 0 25px rgba(174, 150, 150, 0.15)",
              color: "#ffffffff",
            }}
          >
            <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
              Create Assignment
            </h3>

            <input
              name="title"
              placeholder="Title"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="subject"
              placeholder="Subject"
              onChange={handleChange}
              style={inputStyle}
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
            <input
              type="date"
              name="due"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="number"
              name="maxMarks"
              placeholder="Max Marks"
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.txt"
              onChange={handleFile}
              style={{ ...inputStyle, padding: "10px" }}
            />

            <button style={btnPrimary} onClick={submitForm}>
              Create Assignment
            </button>
            <button style={btnCancel} onClick={() => setShowCreate(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------------- GLASS CARDS ---------------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "25px",
        }}
      >
        {assignmentsDemo.map((a) => (
          <div
            key={a.id}
            style={glassCard}
            onClick={() => setShowDetails(a)}
          >
            <h3 style={cardTitle}>{a.title}</h3>
            <span style={tagStyle}>{a.tag}</span>

            <p style={textNormal}>
              Due: <b style={{ color: "#ffdf76" }}>{a.due}</b>
            </p>

            <p style={textNormal}>
              Submissions:{" "}
              <b style={{ color: "#74ffcc" }}>
                {a.submissions}/{a.total}
              </b>
            </p>

            <p style={textNormal}>
              Graded: <span style={{ color: "#76b7ff" }}>{a.graded}</span>
            </p>

            <p style={textNormal}>
              Status:{" "}
              <span
                style={{
                  color: a.status === "Draft" ? "#ff9f54" : "#7aff9c",
                }}
              >
                {a.status}
              </span>
            </p>

            <p style={textNormal}>
              Top Student:{" "}
              <b style={{ color: "#eac6ff" }}>{a.topStudent}</b>
            </p>
          </div>
        ))}
      </div>

      {/* ---------------- DETAILS SIDEBAR ---------------- */}
      {showDetails && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            width: "380px",
            background: "rgba(79, 75, 75, 0.38)",
            backdropFilter: "blur(25px)",
            borderLeft: "1px solid rgba(241, 11, 11, 0.25)",
            padding: "25px",
            color: "#fff",
            boxShadow: "-8px 0 20px rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        >
          <button
            onClick={() => setShowDetails(null)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "1.6rem",
              float: "right",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <h2 style={{ marginTop: "30px" }}>{showDetails.title}</h2>

          <div style={{ marginTop: "20px", fontSize: "1.1rem" }}>
            <p>📅 Due Date: {showDetails.due}</p>
            <p>🟢 Submissions: {showDetails.submissions}</p>
            <p>📘 Total Students: {showDetails.total}</p>
            <p>⭐ Graded: {showDetails.graded}</p>
            <p>🏆 Top Student: {showDetails.topStudent}</p>
            <p>📌 Status: {showDetails.status}</p>
          </div>

          <button style={btnPrimaryFull}>View Submissions</button>
        </div>
      )}

      {/* ---------------- Floating Add Button ---------------- */}
      <button
        onClick={() => setShowCreate(true)}
        style={floatBtn}
      >
        +
      </button>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const inputStyle = {
  width: "100%",
  padding: "14px 14px",
  background: "rgba(56, 54, 54, 0.14)",
  borderRadius: "10px",
  border: "1px solid rgba(180, 174, 174, 0.85)",
  color: "white",
  marginBottom: "12px",
  fontSize: "1.05rem",
};

const btnPrimary = {
  width: "100%",
  background: "linear-gradient(90deg,#66e0ff,#2fb8ff)",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  color: "#000",
  fontWeight: 700,
  marginTop: "10px",
  cursor: "pointer",
};

const btnCancel = {
  width: "100%",
  background: "rgba(216, 211, 211, 0.51)",
  padding: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "12px",
  color: "#fff",
  fontWeight: 600,
  marginTop: "10px",
  cursor: "pointer",
};

const glassCard = {
  background: "rgba(112, 109, 109, 0.46)",
  padding: "24px",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 0 20px rgba(255,255,255,0.15)",
  cursor: "pointer",
  transition: "0.3s",
};

const cardTitle = {
  color: "#fff",
  fontSize: "1.3rem",
  marginBottom: "8px",
};

const tagStyle = {
  padding: "4px 10px",
  background: "rgba(98, 0, 209, 1)",
  borderRadius: "8px",
  color: "#a4a0a6bb",
  fontSize: "0.85rem",
  fontWeight: 700,
};

const textNormal = {
  color: "#ffffffff",
  marginTop: "10px",
};

const btnPrimaryFull = {
  marginTop: "25px",
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "12px",
  fontWeight: 700,
  color: "#000",
  cursor: "pointer",
};

const floatBtn = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(90deg,#66e0ff,#2fb8ff)",
  border: "none",
  fontSize: "2rem",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(146, 132, 132, 0.4)",
};
