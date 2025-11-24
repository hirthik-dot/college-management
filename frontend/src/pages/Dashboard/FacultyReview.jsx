import React, { useMemo, useState } from "react";

/**
 * LeaveRequestsAttractive.jsx
 * Modern Gradient UI (Option 2) — Attractive, polished Leave/On-Duty management
 *
 * - Demo client-side state. Replace accept/reject/save handlers with backend calls.
 * - Inline styles & CSS-in-JS for easy drop-in. Convert to CSS/Tailwind if you prefer.
 */

/* ---------------- Demo data ---------------- */
const DEMO = [
  {
    id: 1,
    name: "Arun Kumar",
    roll: "21CS043",
    dept: "CSE",
    year: "3rd",
    type: "Leave",
    from: "2025-11-01",
    to: "2025-11-03",
    submittedAt: "2025-10-31T09:22:00",
    reason:
      "I had to undergo a minor procedure. Doctor advised rest for 3 days. I will submit medical certificate.",
    attachments: [{ name: "medical_cert.pdf", url: "#" }],
    status: "Pending",
    previousLeaves: 2,
    previousODs: 1,
    attendancePct: 78,
  },
  {
    id: 2,
    name: "Priya S",
    roll: "21CS052",
    dept: "CSE",
    year: "3rd",
    type: "On Duty",
    from: "2025-11-05",
    to: "2025-11-05",
    submittedAt: "2025-11-01T12:12:00",
    reason: "Participating in college hackathon representing the institute.",
    attachments: [{ name: "invite.pdf", url: "#" }],
    status: "Pending",
    previousLeaves: 0,
    previousODs: 3,
    attendancePct: 92,
  },
  {
    id: 3,
    name: "Ravi Kumar",
    roll: "21CS021",
    dept: "CSE",
    year: "3rd",
    type: "Leave",
    from: "2025-11-10",
    to: "2025-11-12",
    submittedAt: "2025-11-03T08:05:00",
    reason:
      "Family event out of station. Request leave for 3 days. Will catch up via notes.",
    attachments: [],
    status: "Approved",
    approvalNote: "Approved. Submit assignment on return.",
    previousLeaves: 1,
    previousODs: 0,
    attendancePct: 84,
  },
  {
    id: 4,
    name: "Sneha",
    roll: "21CS078",
    dept: "CSE",
    year: "3rd",
    type: "Leave",
    from: "2025-11-02",
    to: "2025-11-02",
    submittedAt: "2025-11-01T19:20:00",
    reason:
      "High fever; unable to attend classes. Attached prescription and brief note from doctor.",
    attachments: [{ name: "prescription.jpg", url: "#" }],
    status: "Rejected",
    rejectionReason: "Insufficient documentation — upload prescription.",
    previousLeaves: 0,
    previousODs: 0,
    attendancePct: 65,
  },
  // duplicate some to fill the UI
  {
    id: 5,
    name: "Riya Patel",
    roll: "21CS033",
    dept: "CSE",
    year: "3rd",
    type: "On Duty",
    from: "2025-11-08",
    to: "2025-11-08",
    submittedAt: "2025-11-04T10:05:00",
    reason: "Official sports event.",
    attachments: [],
    status: "Pending",
    previousLeaves: 1,
    previousODs: 0,
    attendancePct: 88,
  },
];

/* ---------------- Utilities ---------------- */
const formatDate = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString();
};
const shortStamp = (iso) => new Date(iso).toLocaleString();

/* ---------------- Component ---------------- */
export default function LeaveRequestsAttractive() {
  const [requests, setRequests] = useState(DEMO);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Pending, Approved, Rejected
  const [typeFilter, setTypeFilter] = useState("All"); // All, Leave, On Duty
  const [sortBy, setSortBy] = useState("recent"); // recent, fromDate, name
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // UI state for modals/panels
  const [profile, setProfile] = useState(null); // student object
  const [viewReason, setViewReason] = useState(null); // {text}
  const [viewAttach, setViewAttach] = useState(null); // file obj
  const [rejectModal, setRejectModal] = useState({ open: false, req: null, reason: "" });
  const [approveModal, setApproveModal] = useState({ open: false, req: null, note: "" });

  // Derived & filtered
  const filtered = useMemo(() => {
    let out = requests.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (q) {
        const qq = q.toLowerCase();
        if (
          !(
            r.name.toLowerCase().includes(qq) ||
            r.roll.toLowerCase().includes(qq) ||
            (r.reason && r.reason.toLowerCase().includes(qq))
          )
        )
          return false;
      }
      return true;
    });
    if (sortBy === "recent") out.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    if (sortBy === "fromDate") out.sort((a, b) => new Date(a.from) - new Date(b.from));
    if (sortBy === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [requests, statusFilter, typeFilter, q, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7);
    let todayCount = 0,
      monthCount = 0,
      approved = 0,
      rejected = 0,
      pending = 0;
    for (const r of requests) {
      if (r.submittedAt.startsWith(today)) todayCount++;
      if (r.submittedAt.slice(0, 7) === month) monthCount++;
      if (r.status === "Approved") approved++;
      if (r.status === "Rejected") rejected++;
      if (r.status === "Pending") pending++;
    }
    return { todayCount, monthCount, approved, rejected, pending };
  }, [requests]);

  /* ---------- Actions (demo updates local state) ---------- */
  function openReject(req) {
    setRejectModal({ open: true, req, reason: "" });
  }
  function submitReject() {
    const { req, reason } = rejectModal;
    if (!reason.trim()) return alert("Please enter rejection reason.");
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: "Rejected", rejectionReason: reason } : r)));
    setRejectModal({ open: false, req: null, reason: "" });
  }

  function openApprove(req) {
    setApproveModal({ open: true, req, note: "" });
  }
  function submitApprove() {
    const { req, note } = approveModal;
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: "Approved", approvalNote: note || "" } : r)));
    setApproveModal({ open: false, req: null, note: "" });
  }

  function downloadAttach(f) {
    setViewAttach(f);
  }

  function clearFilters() {
    setQ("");
    setStatusFilter("All");
    setTypeFilter("All");
    setSortBy("recent");
    setPage(1);
  }

  /* ---------- UI ---------- */
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Leave & On-Duty Requests</h1>
          <p style={styles.subtitle}>Approve or reject student requests. Rejection requires a short reason.</p>
        </div>
        <div style={styles.headerActions}>
          <input placeholder="Search name / roll / reason" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} style={styles.search} />
          <button style={styles.ghost} onClick={clearFilters}>Reset</button>
          <button style={styles.primary}>Export CSV</button>
        </div>
      </header>

      {/* Main two-column layout */}
      <div style={styles.columns}>
        {/* Left: main */}
        <main style={styles.main}>
          {/* Stats row */}
          <div style={styles.statsRow}>
            <StatCard label="Today" value={stats.todayCount} accent />
            <StatCard label="This Month" value={stats.monthCount} />
            <StatCard label="Approved" value={stats.approved} color="#16a34a" />
            <StatCard label="Rejected" value={stats.rejected} color="#ef4444" />
            <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
          </div>

          {/* Filters area */}
          <div style={styles.filterBar}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select style={styles.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="All">All status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select style={styles.select} value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="All">All types</option>
                <option value="Leave">Leave</option>
                <option value="On Duty">On Duty</option>
              </select>

              <select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Sort: Recent</option>
                <option value="fromDate">Sort: From date</option>
                <option value="name">Sort: Student name</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={styles.smallNote}>{filtered.length} results</div>
              <div style={styles.pageControls}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} style={styles.pageBtn}>‹</button>
                <div style={styles.pageNumber}>{page}/{totalPages}</div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={styles.pageBtn}>›</button>
              </div>
            </div>
          </div>

          {/* Request list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pageItems.length === 0 && <div style={styles.empty}>No requests found</div>}

            {pageItems.map((r) => (
              <article key={r.id} style={styles.card}>
                <div style={{ display: "flex", gap: 12, width: "100%" }}>
                  <div style={styles.avatar}>{r.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={styles.nameRow}>
                          <button onClick={() => setProfile(r)} style={styles.nameBtn}>{r.name}</button>
                          <div style={styles.meta}>{r.roll} • {r.dept}</div>
                        </div>

                        <div style={styles.smallMeta}>
                          <strong>{r.type}</strong> • {formatDate(r.from)} → {formatDate(r.to)} • submitted {shortStamp(r.submittedAt)}
                        </div>

                        <div style={{ marginTop: 8, color: "#374151" }}>
                          {r.reason.length > 110 ? r.reason.slice(0,110) + "…" : r.reason}
                          {r.reason.length > 110 && <button onClick={() => setViewReason(r)} style={styles.link}> View full</button>}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <StatusPill status={r.status} />
                        <div style={{ display: "flex", gap: 8 }}>
                          {r.attachments?.length > 0 && (
                            <button onClick={() => downloadAttach(r.attachments[0])} style={styles.attachBtn}>📎 {r.attachments[0].name}</button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        {r.status === "Pending" ? (
                          <>
                            <button onClick={() => openApprove(r)} style={styles.acceptBtn}>Accept</button>
                            <button onClick={() => openReject(r)} style={styles.rejectBtn}>Reject</button>
                          </>
                        ) : (
                          <div style={{ color: "#6b7280", fontSize: 13 }}>
                            {r.status === "Approved" ? `Approved • ${r.approvalNote || "—"}` : `Rejected • ${r.rejectionReason || "—"}`}
                          </div>
                        )}

                        <button onClick={() => alert("Open detailed view (demo)")} style={styles.viewBtn}>View</button>
                      </div>

                      <div style={{ color: "#6b7280", fontSize: 13, textAlign: "right" }}>
                        <div>{r.previousLeaves} leaves • {r.previousODs} ODs</div>
                        <div>Attendance: <strong style={{ color: r.attendancePct < 75 ? "#ef4444" : "#10b981" }}>{r.attendancePct}%</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right: sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sideH}>Quick Actions</h3>
            <button style={styles.sidePrimary} onClick={() => alert("Create manual request (demo)")}>➕ Create manual</button>
            <button style={styles.sideGhost} onClick={() => alert("Send reminders (demo)")}>📤 Send reminders</button>
            <button style={styles.sideGhost} onClick={() => alert("Export (demo)")}>📥 Export CSV</button>
          </div>

          <div style={{...styles.sidebarCard, marginTop:12}}>
            <h3 style={styles.sideH}>Summary</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <Mini label="Total" value={requests.length} />
              <Mini label="Pending" value={stats.pending} color="#f59e0b" />
              <Mini label="Approved" value={stats.approved} color="#16a34a" />
              <Mini label="Rejected" value={stats.rejected} color="#ef4444" />
            </div>
          </div>

          <div style={{...styles.sidebarCard, marginTop:12, background: "linear-gradient(180deg,#ffffff,#f8fafc)"}}>
            <h3 style={styles.sideH}>Notice</h3>
            <p style={{ margin: 0, color: "#4b5563" }}>Students' medical documents are confidential — share only with authorised staff.</p>
          </div>
        </aside>
      </div>

      {/* ---------- Modals & small popups ---------- */}

      {/* Profile panel */}
      {profile && (
        <Modal title={`${profile.name} — Profile`} onClose={() => setProfile(null)}>
          <div style={{ display: "grid", gap: 10 }}>
            <div><strong>Roll:</strong> {profile.roll}</div>
            <div><strong>Dept:</strong> {profile.dept} • {profile.year}</div>
            <div><strong>Attendance:</strong> {profile.attendancePct}%</div>
            <div><strong>Previous Leaves:</strong> {profile.previousLeaves}</div>
            <div><strong>Previous ODs:</strong> {profile.previousODs}</div>
            <div style={{ marginTop: 8 }}>
              <button style={styles.copyBtn} onClick={() => { navigator.clipboard?.writeText(profile.roll); alert("Roll copied"); }}>Copy Roll</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Full reason */}
      {viewReason && (
        <Modal title="Full Reason" onClose={() => setViewReason(null)}>
          <div style={{ whiteSpace: "pre-wrap" }}>{viewReason.reason}</div>
        </Modal>
      )}

      {/* Attachment */}
      {viewAttach && (
        <Modal title={`Attachment: ${viewAttach.name}`} onClose={() => setViewAttach(null)}>
          <div>
            <p style={{ color: "#374151" }}>Preview not available in demo. File: <strong>{viewAttach.name}</strong></p>
            <button style={styles.primary} onClick={() => alert("Download (demo)")}>Download</button>
          </div>
        </Modal>
      )}

      {/* Reject modal */}
      {rejectModal.open && (
        <Modal title={`Reject ${rejectModal.req.name}`} onClose={() => setRejectModal({ open:false, req:null, reason:"" })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "#374151" }}>Please provide a short reason for rejection (required):</div>
            <textarea value={rejectModal.reason} onChange={(e) => setRejectModal(s => ({ ...s, reason: e.target.value }))} rows={5} style={styles.textarea} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.ghost} onClick={() => setRejectModal({ open:false, req:null, reason:"" })}>Cancel</button>
              <button style={styles.rejectBtn} onClick={submitReject}>Submit Rejection</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Approve modal */}
      {approveModal.open && (
        <Modal title={`Approve ${approveModal.req.name}`} onClose={() => setApproveModal({ open:false, req:null, note:"" })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "#374151" }}>Optional approval note for student:</div>
            <textarea value={approveModal.note} onChange={(e) => setApproveModal(s => ({ ...s, note: e.target.value }))} rows={4} style={styles.textarea} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.ghost} onClick={() => setApproveModal({ open:false, req:null, note:"" })}>Cancel</button>
              <button style={styles.acceptBtn} onClick={submitApprove}>Confirm Approve</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Reusable mini components ---------------- */

function StatCard({ label, value, color = "#0f172a", accent }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(90deg,#eef2ff,#eef9ff)" : "#fff",
      padding: 14, borderRadius: 12, minWidth: 110, boxShadow: "0 8px 20px rgba(2,6,23,0.04)"
    }}>
      <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function Mini({ label, value, color = "#0f172a" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: "#374151" }}>
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Pending: { bg: "linear-gradient(180deg,#fff7ed,#fffaf0)", color: "#b45309" },
    Approved: { bg: "linear-gradient(180deg,#ecfdf5,#f0fdf4)", color: "#16a34a" },
    Rejected: { bg: "linear-gradient(180deg,#fff1f2,#fff7f8)", color: "#ef4444" },
  };
  const s = map[status] || map.Pending;
  return <div style={{ padding: "6px 10px", borderRadius: 999, background: s.bg, color: s.color, fontWeight: 800 }}>{status}</div>;
}

function Modal({ children, title, onClose }) {
  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Styles (central) ---------------- */
const styles = {
  page: {
    minHeight: "100vh",             // allow page to grow
    padding: 26,
    fontFamily: "Inter, Roboto, system-ui, sans-serif",
    background: "linear-gradient(180deg,#f8fafc,#f1f5f9)",
    color: "#0f172a",
    boxSizing: "border-box"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  h1: { margin: 0, fontSize: 24, color: "#0b1220" },
  subtitle: { margin: 0, color: "#475569" },
  headerActions: { display: "flex", gap: 8, alignItems: "center" },
  search: { padding: "10px 12px", borderRadius: 12, border: "1px solid #e6eefc", width: 320, outline: "none" },
  ghost: { background: "transparent", border: "1px solid transparent", padding: "10px 12px", borderRadius: 10, color: "#374151", cursor: "pointer" },
  primary: { background: "linear-gradient(90deg,#4f46e5,#06b6d4)", color: "#fff", padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800 },

  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 20,
    alignItems: "start",
    overflow: "visible"  // allow content to grow beyond viewport
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "visible"  // important to prevent scroll cutoff
  },

  statsRow: { display: "flex", gap: 12, marginBottom: 12 },

  filterBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12 },
  select: { padding: "10px 12px", borderRadius: 10, border: "1px solid #e6eefc", outline: "none" },
  smallNote: { color: "#64748b", fontSize: 13 },

  pageControls: { display: "flex", alignItems: "center", gap: 8 },
  pageBtn: { width: 34, height: 34, borderRadius: 8, border: "1px solid #e6eefc", background: "#fff", cursor: "pointer" },
  pageNumber: { fontWeight: 800 },

  empty: { padding: 12, borderRadius: 10, background: "linear-gradient(90deg,#fff7ed,#fffaf0)", color: "#92400e" },

  card: { background: "linear-gradient(180deg,#fff,#fbfdff)", padding: 14, borderRadius: 14, boxShadow: "0 12px 30px rgba(2,6,23,0.06)", transition: "transform 160ms ease, box-shadow 160ms ease" },
  avatar: { width: 54, height: 54, borderRadius: 12, background: "linear-gradient(90deg,#e6eefc,#eef9ff)", display: "grid", placeItems: "center", fontWeight: 900, color: "#0f172a" },

  nameRow: { display: "flex", gap: 8, alignItems: "center" },
  nameBtn: { background: "none", border: "none", padding: 0, margin: 0, fontWeight: 900, color: "#0f172a", cursor: "pointer", fontSize: 16 },
  meta: { color: "#6b7280", fontSize: 13 },
  smallMeta: { color: "#374151", marginTop: 4 },

  link: { marginLeft: 8, background: "none", border: "none", color: "#0ea5e9", cursor: "pointer", fontWeight: 700 },

  attachBtn: { background: "linear-gradient(90deg,#eef2ff,#f8fdff)", border: "none", padding: "6px 10px", borderRadius: 10, cursor: "pointer", fontWeight: 700 },

  acceptBtn: { background: "linear-gradient(90deg,#10b981,#059669)", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 800 },
  rejectBtn: { background: "linear-gradient(90deg,#ef4444,#f97316)", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 800 },
  viewBtn: { background: "transparent", border: "1px solid #e6eefc", padding: "8px 10px", borderRadius: 10, cursor: "pointer" },

  sidebarCard: { background: "linear-gradient(180deg,#fff,#fbfdff)", padding: 16, borderRadius: 12, boxShadow: "0 12px 30px rgba(163, 169, 196, 0.04)" },
  sideH: { margin: 0, marginBottom: 8 },

  sidePrimary: { background: "linear-gradient(90deg,#06b6d4,#4f46e5)", color: "#fff", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800 },
  sideGhost: { background: "transparent", border: "1px solid #e6eefc", padding: "10px 12px", borderRadius: 10, cursor: "pointer" },

  textarea: { padding: 10, borderRadius: 8, border: "1px solid #e6eefc",  outline: "none" },

  copyBtn: { background: "linear-gradient(90deg,#eef2ff,#eef9ff)", border: "none", padding: "8px 10px", borderRadius: 8, cursor: "pointer" },

  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(2,6,23,0.45)", display: "grid", placeItems: "center", zIndex: 9999 },
  modal: { width: 720, background: "linear-gradient(180deg,#fff,#fbfdff)", borderRadius: 12, padding: 18, boxShadow: "0 30px 80px rgba(2,6,23,0.45)" },
  closeBtn: { border: "none", background: "transparent", fontSize: 20, cursor: "pointer" },
};
