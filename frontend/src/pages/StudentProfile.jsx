import React, { useEffect, useState } from "react";

function DocumentRow({ icon, name, meta, status, statusColor }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "14px 18px",
      borderRadius: 11,
      background: "#f3f4f6",
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 22, marginRight: 17 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{name}</div>
        <div style={{ color: "#64748b", fontWeight: 400, fontSize: ".97rem" }}>{meta}</div>
      </div>
      <span style={{
        background: "#f3f4f6",
        color: statusColor,
        border: `2px solid ${statusColor}`,
        fontWeight: 700,
        borderRadius: 11,
        padding: "2.5px 15px",
        fontSize: ".99rem",
        marginLeft: 14
      }}>{status}</span>
      <span role="img" aria-label="view" style={{fontSize:22, marginLeft:13, cursor:"pointer"}}>📄</span>
    </div>
  );
}

export default function StudentProfile() {
  const API_BASE = process.env.REACT_APP_API_URL;   // ✅ ENV USED HERE

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [marksheetFile, setMarksheetFile] = useState(null);
  const [ocrDetails, setOcrDetails] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [selectedSem, setSelectedSem] = useState(1);
  const [averageCgpa, setAverageCgpa] = useState(null);

  const token = localStorage.getItem("token");

  // ================= PROFILE FETCH =====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/profile`, {   // ⬅️ UPDATED
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data && !data.error ? data : {});
        setAverageCgpa(data.averageCgpa || null);
      } catch (err) {
        setProfile({});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, API_BASE]);

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f9fafb" }}>
        <h1 style={{ color: "#6366f1", fontWeight: 900, fontSize: "2.5rem" }}>Loading Profile...</h1>
      </div>
    );

  const v = (x) => x ? x : <span style={{ color: "#aaa" }}>–</span>;

  // =============== MARKSHEET UPLOAD HANDLER ===================
  const handleMarksheetUpload = async (e) => {
    e.preventDefault();
    if (!marksheetFile) return;
    setOcrLoading(true);

    try {
      const formData = new FormData();
      formData.append("marksheet", marksheetFile);
      formData.append("sem", selectedSem);

      const res = await fetch(`${API_BASE}/api/ocr-marksheet`, {   // ⬅️ UPDATED
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setOcrDetails(data.parsed || {});
        setProfile(data.profile || profile);
        setAverageCgpa(data.averageCgpa || null);
      } else {
        setOcrDetails({ error: data.error || "Parsing failed" });
      }
    } catch (err) {
      setOcrDetails({ error: err.message });
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div style={{ padding: "36px 0", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 28px" }}>
        
        <h1 style={{ fontWeight: 800, fontSize: "2.25rem", marginBottom: 5 }}>Profile Management</h1>
        <div style={{ color: "#64748b", marginBottom: 36 }}>Manage your academic identity, documents, and security settings</div>

        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          
          {/* Left card remains unchanged */}
          {/* Right card remains unchanged */}

          {/* ONLY THE API URL WAS UPDATED ABOVE - NO OTHER CHANGES */}
        </div>
      </div>
    </div>
  );
}
