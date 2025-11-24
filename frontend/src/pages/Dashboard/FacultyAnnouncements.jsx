import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

/**
 * AnnouncementsGlass.jsx (connected to backend)
 *
 * Changes from demo:
 * - removed SAMPLE constant
 * - fetches announcements from backend on mount (GET /api/announcements)
 * - posts new announcements to backend (POST /api/announcements/create)
 * - normalizes backend _id -> id so UI code remains the same
 *
 * Keep the rest of the UI exactly as before.
 */

/* ---------- Configuration ---------- */
const API = "http://localhost:5000/api/announcements";

/* ---------- Helpers ---------- */
const nowISO = () => new Date().toISOString();
const shortDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
};
const formatDateTime = (iso) => {
  if (!iso) return "Now";
  const d = new Date(iso);
  return d.toLocaleString();
};

/* ---------- Component ---------- */
export default function AnnouncementsGlass() {
  // now start with empty array and load from backend
  const [anns, setAnns] = useState([]);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All/Active/Scheduled/Expired/Pinned
  const [sortBy, setSortBy] = useState("latest"); // latest / views / acks
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // UI modals / panels
  const [createOpen, setCreateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(null); // announcement object
  const [attachView, setAttachView] = useState(null);

  /* ---------- Derived lists & stats ---------- */
  const categories = useMemo(
    () => ["All", "Exam", "Events", "General", "Attendance", "Fees"],
    []
  );

  const filtered = useMemo(() => {
    let out = anns.filter((a) => {
      if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
      if (statusFilter === "Active" && a.status !== "Active") return false;
      if (statusFilter === "Scheduled" && a.status !== "Scheduled") return false;
      if (statusFilter === "Expired" && a.status !== "Expired") return false;
      if (statusFilter === "Pinned" && !a.pinned) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!(a.title.toLowerCase().includes(s) || a.body.toLowerCase().includes(s)))
          return false;
      }
      return true;
    });

    if (sortBy === "latest")
      out.sort(
        (x, y) =>
          new Date(y.postedAt || y.createdAt || nowISO()) -
          new Date(x.postedAt || x.createdAt || nowISO())
      );
    if (sortBy === "views") out.sort((x, y) => (y.views || 0) - (x.views || 0));
    if (sortBy === "acks") out.sort((x, y) => (y.acks || 0) - (x.acks || 0));
    return out;
  }, [anns, categoryFilter, statusFilter, q, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const total = anns.length;
    const active = anns.filter((a) => a.status === "Active").length;
    const scheduled = anns.filter((a) => a.status === "Scheduled").length;
    const pinned = anns.filter((a) => a.pinned).length;
    return { total, active, scheduled, pinned };
  }, [anns]);

  /* ---------- Backend integration ---------- */

  // load announcements from backend and normalize _id -> id
  async function loadAnnouncements() {
    try {
      const res = await axios.get(API);
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((x) => ({
        // keep original fields, but add id for compatibility with UI
        ...x,
        id: x._id || x.id || String(Math.random()).slice(2),
        // normalize postedAt: many backends use postedAt or createdAt
        postedAt: x.postedAt || x.createdAt || x.postedAt,
        // ensure numeric fields exist
        views: typeof x.views === "number" ? x.views : 0,
        acks: typeof x.acks === "number" ? x.acks : 0,
        pinned: !!x.pinned,
      }));
      setAnns(normalized);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      // keep anns as-is (empty or previously loaded)
    }
  }

  // run on mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  // create announcement via backend, then prepend to list (normalized)
  async function createAnnouncement(payload) {
    // payload should contain title and body at minimum to satisfy backend validation
    if (!payload.title || !payload.body) {
      alert("Title and body are required");
      return;
    }

    try {
      // backend route you use: POST /api/announcements/create
      const res = await axios.post(`${API}/create`, {
        title: payload.title,
        body: payload.body,
        category: payload.category || "General",
        pinned: !!payload.pinned,
        scheduledAt: payload.scheduledAt || null,
        // if your backend expects postedAt or createdAt it will set it; we don't force it here
        expiresAt: payload.expiresAt || null,
        targets: payload.targets || ["All Students"],
        attachments: payload.attachments || [],
      });

      const x = res.data;
      const normalized = {
        ...x,
        id: x._id || x.id || String(Math.random()).slice(2),
        postedAt: x.postedAt || x.createdAt || nowISO(),
        views: typeof x.views === "number" ? x.views : 0,
        acks: typeof x.acks === "number" ? x.acks : 0,
        pinned: !!x.pinned,
      };

      setAnns((s) => [normalized, ...s]);
      setCreateOpen(false);
    } catch (err) {
      console.error("Create announcement failed:", err);
      alert(err.response?.data?.message || "Error creating announcement");
    }
  }

  /* ---------- Local/UI actions (operate on loaded list) ---------- */

  // toggle pin locally (does not call backend unless you add PATCH API)
  function togglePin(id) {
    setAnns((s) => s.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  }

  // duplicate locally
  function duplicateAnn(a) {
    const copy = {
      ...a,
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      title: a.title + " (copy)",
      postedAt: nowISO(),
      views: 0,
      acks: 0,
    };
    setAnns((s) => [copy, ...s]);
  }
const API = "http://localhost:5000/api/announcements";

async function expireAnn(id) {
  try {
    const res = await axios.patch(`${API}/${id}/expire`);
    console.log("Expired:", res.data);
    setAnns(prev => prev.map(a => (a.id === id ? { ...a, status: "Expired" } : a)));
  } catch (err) {
    console.error("Failed to expire:", err.response?.data || err.message);
    alert("Failed to expire announcement");
  }
}

 



  // ack locally
  function ackAnn(id) {
    setAnns((s) =>
      s.map((a) => (a.id === id ? { ...a, acks: (a.acks || 0) + 1, views: (a.views || 0) + 1 } : a))
    );
  }

  // view -> open preview and increment views locally
  function viewAnn(id) {
    setAnns((s) => s.map((a) => (a.id === id ? { ...a, views: (a.views || 0) + 1 } : a)));
    const a = anns.find((x) => x.id === id);
    setPreviewOpen(a);
  }

  /* ---------- UI render ---------- */
  return (
    <div style={pageWrap}>
      <div style={header}>
        <div>
          <h1 style={title}>Announcements</h1>
          <p style={subtitle}>
            
          </p>
        </div>

        <div style={headerRight}>
          <input
            placeholder="Search title or body..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            style={searchInput}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={select}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={select}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
            <option value="Pinned">Pinned</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={select}>
            <option value="latest">Sort: Latest</option>
            <option value="views">Sort: Most Views</option>
            <option value="acks">Sort: Most Acks</option>
          </select>

          <button style={primaryBtn} onClick={() => setCreateOpen(true)}>
            + New Announcement
          </button>
        </div>
      </div>

      {/* stats */}
      <div style={statsRow}>
        <statCard styleObj={{}} label="Total" value={stats.total} />
        <statCard styleObj={{}} label="Active" value={stats.active} />
        <statCard styleObj={{}} label="Scheduled" value={stats.scheduled} />
        <statCard styleObj={{}} label="Pinned" value={stats.pinned} />
      </div>

      <div style={columns}>
        <main style={mainCol}>
          {/* timeline / list */}
          <div style={glassContainer}>
            {pageItems.length === 0 && <div style={empty}>No announcements found.</div>}

            {pageItems.map((a) => (
              <div key={a.id} style={glassCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={categoryTag(a.category)}>{a.category}</div>
                      <h3 style={cardTitle}>{a.title}</h3>
                      {a.pinned && <div style={pinnedBadge}>📌 Pinned</div>}
                    </div>

                    <div style={cardBody}>
                      {a.body && a.body.length > 190 ? a.body.slice(0, 190) + "…" : a.body}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={metaText}>Posted: {formatDateTime(a.postedAt)}</div>
                      <div style={metaText}>Expires: {a.expiresAt ? shortDate(a.expiresAt) : "—"}</div>
                      <div style={metaText}>Targets: {(a.targets || []).join(", ")}</div>
                      <div style={metaText}>Views: {a.views || 0}</div>
                      <div style={metaText}>Acks: {a.acks || 0}</div>
                      {a.attachments?.length > 0 && (
                        <button onClick={() => setAttachView(a.attachments[0])} style={attachBtn}>
                          📎 {a.attachments[0].name}
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>{a.status}</div>
                    <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                      <button onClick={() => { viewAnn(a.id); }} style={ghostBtn}>
                        View
                      </button>
                      <button onClick={() => togglePin(a.id)} style={ghostBtn}>
                        {a.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button onClick={() => duplicateAnn(a)} style={ghostBtn}>
                        Duplicate
                      </button>
                      <button onClick={() => expireAnn(a.id)} style={dangerBtn}>
                        Expire
                      </button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => ackAnn(a.id)} style={ackBtn}>
                        Mark as read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} style={pageBtn}>
                Prev
              </button>
              <div style={{ alignSelf: "center", color: "#334155" }}>
                {page}/{totalPages}
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={pageBtn}>
                Next
              </button>
            </div>
          </div>
        </main>

        <aside style={sideCol}>
          <div style={sidebarGlass}>
            <h4 style={{ margin: 0 }}>Pinned</h4>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {anns.filter((x) => x.pinned).map((p) => (
                <div key={p.id} style={pinnedItem}>
                  <div style={{ fontWeight: 800 }}>{p.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{shortDate(p.postedAt)}</div>
                </div>
              ))}
              {anns.filter((x) => x.pinned).length === 0 && <div style={{ color: "#94a3b8" }}>No pinned announcements</div>}
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div style={sidebarGlass}>
            <h4 style={{ margin: 0 }}>Quick Actions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <button style={primaryBtn} onClick={() => setCreateOpen(true)}>
                + New Announcement
              </button>
              <button style={ghostBtn} onClick={() => alert("Export demo")}>
                Export CSV
              </button>
              <button style={ghostBtn} onClick={() => alert("Bulk pin demo")}>
                Bulk Pin (demo)
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- Create Modal ---------- */}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={createAnnouncement} />}

      {/* ---------- Preview Panel ---------- */}
      {previewOpen && (
        <Modal onClose={() => setPreviewOpen(null)} title={previewOpen.title}>
          <div style={{ marginBottom: 10 }}>{previewOpen.body}</div>
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>
            Category: {previewOpen.category} • Targets: {(previewOpen.targets || []).join(", ")}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {previewOpen.attachments?.map((f, i) => (
              <button key={i} style={attachBtn} onClick={() => setAttachView(f)}>
                📎 {f.name}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#64748b" }}>Views: {previewOpen.views} • Acks: {previewOpen.acks}</div>
            <div>
              <button style={ghostBtn} onClick={() => duplicateAnn(previewOpen)}>
                Duplicate
              </button>
              <button style={dangerBtn} onClick={() => expireAnn(previewOpen.id)}>
                Expire
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Attachment Viewer */}
      {attachView && (
        <Modal onClose={() => setAttachView(null)} title={`Attachment: ${attachView.name}`}>
          <div style={{ color: "#334155" }}>Preview not available in demo. File: {attachView.name}</div>
          <div style={{ marginTop: 12 }}>
            <button style={primaryBtn} onClick={() => alert("Download demo")}>
              Download
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Create Modal component ---------- */
function CreateModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [targets, setTargets] = useState(["All Students"]);
  const [schedule, setSchedule] = useState("now"); // now / later
  const [scheduledAt, setScheduledAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [pinned, setPinned] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");

  function submit() {
    if (!title.trim() || !body.trim()) return alert("Title and body required");
    const payload = {
      title,
      body,
      category,
      targets,
      schedule,
      scheduledAt: schedule === "later" ? scheduledAt : null,
      expiresAt: expiresAt || null,
      pinned,
      attachments: attachmentName ? [{ name: attachmentName, url: "#" }] : [],
    };
    onCreate(payload);
  }

  return (
    <Modal title="Create Announcement" onClose={onClose}>
      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={formInput} />
        <textarea placeholder="Write announcement (supports basic text)" value={body} onChange={(e) => setBody(e.target.value)} rows={6} style={formText} />
        <div style={{ display: "flex", gap: 8 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={formSelect}>
            <option>General</option>
            <option>Exam</option>
            <option>Events</option>
            <option>Attendance</option>
            <option>Fees</option>
          </select>

          <input placeholder="Targets (comma separated)" value={targets.join(", ")} onChange={(e) => setTargets(e.target.value.split(",").map(s => s.trim()))} style={formInput} />

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> Pin
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="radio" name="sch" value="now" checked={schedule === "now"} onChange={() => setSchedule("now")} /> Post now
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="radio" name="sch" value="later" checked={schedule === "later"} onChange={() => setSchedule("later")} /> Schedule later
          </label>
          {schedule === "later" && <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={formInput} />}
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} style={formInput} />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input placeholder="Attachment name (mock)" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} style={formInput} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button style={ghostBtn} onClick={onClose}>Cancel</button>
            <button style={primaryBtn} onClick={submit}>Create</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Small components used in layout ---------- */

function statCard({ styleObj, label, value }) {
  return (
    <div style={{ ...statCardStyle, ...styleObj }}>
      <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function Modal({ children, title, onClose }) {
  return (
    <div style={modalBackdrop}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------- Styles (glassmorphism + gradients) ---------- */

const pageWrap = {
  fontFamily: "Inter, Roboto, system-ui, sans-serif",
  padding: 24,
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f6f8fb,#eef6ff)",
  color: "#0f172a",
};

const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 };
const title = { margin: 0, fontSize: 24, fontWeight: 900 };
const subtitle = { margin: 0, color: "#475569" };
const headerRight = { display: "flex", gap: 8, alignItems: "center" };

const searchInput = { padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.6)", backdropFilter: "blur(6px)", outline: "none", width: 280 };
const select = { padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.5)" };

const primaryBtn = { background: "linear-gradient(90deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 12, cursor: "pointer", fontWeight: 800 };
const ghostBtn = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.6)", padding: "8px 10px", borderRadius: 10, cursor: "pointer" };
const dangerBtn = { background: "linear-gradient(90deg,#ef4444,#f97316)", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 10, cursor: "pointer" };
const ackBtn = { background: "linear-gradient(90deg,#10b981,#059669)", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 10, cursor: "pointer" };

const statsRow = { display: "flex", gap: 12, marginBottom: 16 };
const statCardStyle = { padding: 12, borderRadius: 12, minWidth: 110, background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.35))", boxShadow: "0 8px 30px rgba(2,6,23,0.06)", backdropFilter: "blur(6px)" };

const columns = { display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" };
const mainCol = { minWidth: 0 };
const sideCol = { position: "sticky", top: 24 };

const glassContainer = { display: "flex", flexDirection: "column", gap: 12 };

const glassCard = {
  borderRadius: 14,
  padding: 16,
  background: "linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))",
  boxShadow: "0 20px 40px rgba(12,18,40,0.06)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.6)",
};

const categoryTag = (cat) => ({
  background: "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
  color: "#0f172a",
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 12,
  border: "1px solid rgba(255,255,255,0.45)",
});

const cardTitle = { margin: 0, fontSize: 18, fontWeight: 900 };
const cardBody = { marginTop: 8, color: "#334155" };

const metaText = { color: "#64748b", fontSize: 13 };

const pinnedBadge = { marginLeft: 8, background: "linear-gradient(90deg,#fff8e1,#fff4e6)", color: "#92400e", padding: "6px 8px", borderRadius: 8, fontWeight: 800 };

const attachBtn = { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.55)", padding: "6px 8px", borderRadius: 8, cursor: "pointer" };

const empty = { padding: 12, borderRadius: 10, background: "linear-gradient(90deg,#fff7ed,#fffaf0)", color: "#92400e" };

const sidebarGlass = { padding: 14, borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))", boxShadow: "0 18px 40px rgba(2,6,23,0.06)", border: "1px solid rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" };

const pinnedItem = { padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.5)" };

const pageBtn = { padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.6)", cursor: "pointer" };

const modalBackdrop = { position: "fixed", inset: 0, background: "rgba(3,7,18,0.45)", display: "grid", placeItems: "center", zIndex: 9999 };
const modalBox = { width: 760, maxWidth: "96vw", borderRadius: 12, padding: 18, background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,255,0.85))", boxShadow: "0 30px 80px rgba(2,6,23,0.55)" };
const closeBtn = { background: "transparent", border: "none", fontSize: 20, cursor: "pointer" };

const formInput = { padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)", outline: "none", minWidth: 160 };
const formText = { padding: 12, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)", minWidth: 320, outline: "none" };
const formSelect = { padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)" };

/* ---------------- END ---------------- */
