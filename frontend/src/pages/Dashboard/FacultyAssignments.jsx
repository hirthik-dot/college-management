import React, { useMemo, useState } from "react";
import "./AssignmentsGlass.css";

// ---------- Sample Data ----------
const SAMPLE = [
  {
    id: 1,
    title: "AI Assignment 1",
    body: "Complete the AI assignment on Neural Networks and submit by Dec 5.",
    category: "AI",
    pinned: true,
    dueAt: "2025-12-05",
    postedAt: "2025-11-10T09:20:00",
    attachments: [{ name: "assignment1.pdf", url: "#" }],
    status: "Active",
  },
  {
    id: 2,
    title: "Database Assignment",
    body: "Design ER diagram for library management system.",
    category: "DB",
    pinned: false,
    dueAt: "2025-11-30",
    postedAt: "2025-11-12T11:00:00",
    attachments: [],
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Web Dev Mini Project",
    body: "Build a simple React project with CRUD functionality.",
    category: "Web",
    pinned: false,
    dueAt: "2025-12-10",
    postedAt: "2025-11-09T07:30:00",
    attachments: [{ name: "project-guidelines.pdf", url: "#" }],
    status: "Active",
  },
];

// ---------- Helpers ----------
const nowISO = () => new Date().toISOString();
const shortDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");

// ---------- Main Component ----------
export default function AssignmentsGlass() {
  const [assignments, setAssignments] = useState(SAMPLE);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [createOpen, setCreateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(null);

  const categories = useMemo(() => ["All", "AI", "DB", "Web", "OS", "Networking"], []);

  const filtered = useMemo(() => {
    let out = assignments.filter((a) => {
      if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (q && !a.title.toLowerCase().includes(q.toLowerCase()) && !a.body.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
    out.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    return out;
  }, [assignments, categoryFilter, statusFilter, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const addAssignment = (payload) => {
    const newItem = {
      id: Date.now(),
      title: payload.title,
      body: payload.body,
      category: payload.category || "General",
      pinned: !!payload.pinned,
      dueAt: payload.dueAt || null,
      postedAt: nowISO(),
      attachments: payload.attachments || [],
      status: "Active",
    };
    setAssignments((prev) => [newItem, ...prev]);
    setCreateOpen(false);
  };

  const togglePin = (id) =>
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));

  const viewAssignment = (id) => {
    const a = assignments.find((x) => x.id === id);
    setPreviewOpen(a);
  };

  return (
    <div className="assign-page-wrap">
      {/* Header */}
      <div className="assign-header">
        <div>
          <h1 className="assign-title">Assignments</h1>
          <p className="assign-subtitle">
            View, manage, and track assignments. Glassmorphism style for a premium look.
          </p>
        </div>

        <div className="assign-header-right">
          <input
            className="assign-search-input"
            placeholder="Search title or body..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select className="assign-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="assign-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
          </select>
          <button className="assign-btn-primary" onClick={() => setCreateOpen(true)}>+ New Assignment</button>
        </div>
      </div>

      {/* Columns */}
      <div className="assign-columns">
        <main className="assign-main-col">
          <div className="assign-glass-container">
            {pageItems.length === 0 && <div style={{ color: "#94a3b8" }}>No assignments found.</div>}
            {pageItems.map((a) => (
              <div key={a.id} className="assign-glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="assign-card-title">{a.title}</div>
                      {a.pinned && <div style={{ color: "#f59e0b" }}>📌 Pinned</div>}
                    </div>
                    <div className="assign-card-body">{a.body}</div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
                      Due: {shortDate(a.dueAt)} | Category: {a.category}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button className="assign-btn-ghost" onClick={() => viewAssignment(a.id)}>View</button>
                    <button className="assign-btn-ghost" onClick={() => togglePin(a.id)}>
                      {a.pinned ? "Unpin" : "Pin"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
              <button className="assign-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <div style={{ alignSelf: "center", color: "#334155" }}>{page}/{totalPages}</div>
              <button className="assign-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
        </main>

        <aside className="assign-side-col">
          <div className="assign-sidebar-glass">
            <h4>Pinned</h4>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {assignments.filter((x) => x.pinned).map((p) => (
                <div key={p.id} className="assign-pinned-item">
                  <div style={{ fontWeight: 800 }}>{p.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{shortDate(p.postedAt)}</div>
                </div>
              ))}
              {assignments.filter((x) => x.pinned).length === 0 && <div style={{ color: "#94a3b8" }}>No pinned assignments</div>}
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={addAssignment} />}
      {previewOpen && <PreviewModal assignment={previewOpen} onClose={() => setPreviewOpen(null)} />}
    </div>
  );
}

// ---------- Advanced Create Modal ----------
function CreateModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [dueAt, setDueAt] = useState("");
  const [file, setFile] = useState(null);
  const [pinned, setPinned] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !dueAt) return alert("Title and Due Date are required!");
    onCreate({ title, body, category, dueAt, pinned, attachments: file ? [file] : [] });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(3,7,18,0.45)", display: "grid",
      placeItems: "center", zIndex: 9999, overflowY: "auto", padding: 20
    }}>
      <div style={{
        width: 500, maxWidth: "95vw", borderRadius: 16, padding: 24,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)", display: "flex",
        flexDirection: "column", gap: 12
      }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Create Assignment</h3>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Title <span style={{ color: "#ef4444" }}>*</span>
          <input
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)" }}
            value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Description
          <textarea
            style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)", minHeight: 80 }}
            value={body} onChange={e => setBody(e.target.value)} placeholder="Assignment details"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Category
          <select
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)" }}
            value={category} onChange={e => setCategory(e.target.value)}
          >
            <option>General</option>
            <option>AI</option>
            <option>DB</option>
            <option>Web</option>
            <option>OS</option>
            <option>Networking</option>
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Due Date <span style={{ color: "#ef4444" }}>*</span>
          <input
            type="date"
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)" }}
            value={dueAt} onChange={e => setDueAt(e.target.value)}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Attach File
          <input type="file" onChange={e => setFile(e.target.files[0])} />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={pinned} onChange={() => setPinned(!pinned)} />
          Pin Assignment
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            style={{
              padding: "10px 14px", borderRadius: 12, border: "none",
              background: "linear-gradient(90deg,#7c3aed,#06b6d4)", color: "#fff", fontWeight: 800,
              cursor: "pointer"
            }}
            onClick={handleSubmit}
          >
            Create
          </button>
          <button
            style={{
              padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)",
              background: "rgba(255,255,255,0.65)", cursor: "pointer"
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Preview Modal ----------
function PreviewModal({ assignment, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(3,7,18,0.45)",
      display: "grid", placeItems: "center", zIndex: 9999, overflowY: "auto", padding: 20
    }}>
      <div style={{
        width: 500, maxWidth: "95vw", borderRadius: 16, padding: 24,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)", display: "flex",
        flexDirection: "column", gap: 12
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{assignment.title}</h3>
          <button style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }} onClick={onClose}>✕</button>
        </div>
        <p style={{ margin: 0, color: "#334155" }}>{assignment.body}</p>
        <p style={{ margin: 0, color: "#334155" }}><strong>Category:</strong> {assignment.category}</p>
        <p style={{ margin: 0, color: "#334155" }}><strong>Due:</strong> {shortDate(assignment.dueAt)}</p>
      </div>
    </div>
  );
}
