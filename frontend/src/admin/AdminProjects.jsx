import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { toast } from "react-hot-toast";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadProjects = async () => {
    try {
      const res = await API.get("/projects/admin");
      setProjects(res.data);
    } catch {
      toast.error("Failed to sync project database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const approveProject = async (id) => {
    try {
      await API.patch(`/projects/${id}/approve`);
      toast.success("Security Clearance Granted");
      loadProjects();
    } catch {
      toast.error("Approval sequence failed");
    }
  };

  const rejectProject = async (id) => {
    const reason = prompt("Enter Rejection Protocol Reason:");
    if (!reason) return;
    try {
      await API.patch(`/projects/${id}/reject`, { reason });
      toast.success("Project Entry Denied");
      loadProjects();
    } catch {
      toast.error("Rejection sequence failed");
    }
  };

  // ── derived counts (same logic as original) ────────────────────────────────
  const incoming = projects.filter((p) => !p.isApproved && !p.rejectionReason).length;
  const active   = projects.filter((p) =>  p.isApproved).length;
  const rejected = projects.filter((p) =>  p.rejectionReason).length;

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="ap-loading">
          <div className="ap-loader-track">
            <motion.div
              className="ap-loader-bar"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <span className="ap-loading-text">System Decrypting...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="ap-root">

        {/* ── HEADER ── */}
        <div className="ap-header">
          <div>
            <span className="ap-section-label">Administrative Layer</span>
            <h1 className="ap-title">
              Control <span className="ap-title-outline">Center</span>
            </h1>
          </div>

          {/* Stats panel */}
          <div className="ap-stats-panel">
            <div className="ap-stat">
              <p className="ap-stat-label">Incoming</p>
              <p className="ap-stat-num ap-num-amber">{incoming.toString().padStart(2,"0")}</p>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <p className="ap-stat-label">Active Assets</p>
              <p className="ap-stat-num ap-num-green">{active.toString().padStart(2,"0")}</p>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <p className="ap-stat-label">Refused</p>
              <p className="ap-stat-num ap-num-red">{rejected.toString().padStart(2,"0")}</p>
            </div>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="ap-table-wrap">

          {/* Head */}
          <div className="ap-table-head">
            <div className="ap-col-4">Project Identity</div>
            <div className="ap-col-3">Seller Metadata</div>
            <div className="ap-col-2">Security Status</div>
            <div className="ap-col-3 ap-right">Administrative Actions</div>
          </div>

          {/* Rows */}
          <AnimatePresence>
            {projects.map((p, index) => (
              <motion.div
                key={p._id}
                className="ap-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16,1,0.3,1] }}
              >
                {/* shimmer */}
                <div className="ap-row-shimmer" />

                {/* Project identity */}
                <div className="ap-col-4">
                  <p className="ap-project-title">{p.title}</p>
                  <p className="ap-uid">UUID: {p._id}</p>
                </div>

                {/* Seller */}
                <div className="ap-col-3">
                  <p className="ap-seller-email">{p.seller?.email || "EXTERNAL_USER"}</p>
                  <p className="ap-seller-sub">Verification Level 01</p>
                </div>

                {/* Status */}
                <div className="ap-col-2">
                  {p.isApproved ? (
                    <div className="ap-status-row">
                      <div className="ap-dot ap-dot-green" />
                      <span className="ap-status-text ap-status-green">Authorized</span>
                    </div>
                  ) : p.rejectionReason ? (
                    <div className="ap-status-row">
                      <div className="ap-dot ap-dot-red" />
                      <span className="ap-status-text ap-status-red">Refused</span>
                    </div>
                  ) : (
                    <div className="ap-status-row">
                      <div className="ap-dot ap-dot-amber ap-dot-pulse" />
                      <span className="ap-status-text ap-status-amber">Awaiting Clear</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ap-col-3 ap-right ap-actions">
                  {!p.isApproved && !p.rejectionReason ? (
                    <>
                      <motion.button
                        className="ap-btn-approve"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveProject(p._id)}
                      >
                        Approve ✦
                      </motion.button>
                      <motion.button
                        className="ap-btn-deny"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => rejectProject(p._id)}
                      >
                        Deny ✕
                      </motion.button>
                    </>
                  ) : (
                    <span className="ap-immutable">Immutable Record</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <div className="ap-empty">
              <div className="ap-empty-icon">▣</div>
              <p className="ap-empty-title">No Projects Found</p>
              <p className="ap-empty-sub">No records in the system yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ap-footer">
          <span>Restricted Access Only</span>
          <span>Administrative Protocol v4.0.1</span>
        </div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  /* loading */
  .ap-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 20px;
    font-family: 'Cabinet Grotesk', sans-serif;
    background: #09090e;
  }
  .ap-loader-track {
    width: 240px; height: 3px;
    background: rgba(201,168,76,0.1);
    border-radius: 100px; overflow: hidden;
  }
  .ap-loader-bar {
    height: 100%; width: 50%;
    background: linear-gradient(90deg, #c9a84c, #f0a030);
    border-radius: 100px;
    box-shadow: 0 0 12px rgba(201,168,76,0.6);
  }
  .ap-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: #524f60;
  }

  /* root */
  .ap-root {
    padding: 40px;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    color: #f0ede8;
    min-height: 100vh;
    position: relative;
  }

  /* header */
  .ap-header {
    display: flex; flex-wrap: wrap;
    align-items: flex-end; justify-content: space-between; gap: 24px;
    margin-bottom: 40px; padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .ap-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 10px;
  }

  .ap-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0;
  }
  .ap-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  /* stats panel */
  .ap-stats-panel {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 24px;
    background: rgba(201,168,76,0.04);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 16px;
  }
  .ap-stat { text-align: center; }
  .ap-stat-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60; margin-bottom: 6px;
  }
  .ap-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem; letter-spacing: 0.02em; line-height: 1;
  }
  .ap-num-amber {
    background: linear-gradient(135deg, #f0a030, #e4c97e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ap-num-green { color: #22C55E; }
  .ap-num-red   { color: #ef4444; }
  .ap-stat-divider {
    width: 1px; height: 40px;
    background: rgba(255,255,255,0.06); flex-shrink: 0;
  }

  /* table */
  .ap-table-wrap {
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 24px 48px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(201,168,76,0.07);
  }

  .ap-table-head {
    display: grid;
    grid-template-columns: 4fr 3fr 2fr 3fr;
    gap: 16px; padding: 20px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase; color: #524f60;
  }

  /* row */
  .ap-row {
    display: grid;
    grid-template-columns: 4fr 3fr 2fr 3fr;
    gap: 16px; padding: 22px 32px;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    position: relative; transition: background 0.2s; cursor: default;
  }
  .ap-row:last-child { border-bottom: none; }
  .ap-row:hover { background: rgba(201,168,76,0.03); }

  .ap-row-shimmer {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .ap-row:hover .ap-row-shimmer { opacity: 1; }

  /* cols */
  .ap-col-4 {} .ap-col-3 {} .ap-col-2 {}
  .ap-right { text-align: right; }

  /* project title */
  .ap-project-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.25rem; letter-spacing: 0.03em;
    color: #f0ede8; margin: 0 0 4px 0; transition: color 0.2s;
  }
  .ap-row:hover .ap-project-title { color: #e4c97e; }
  .ap-uid {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 8px; color: #524f60; letter-spacing: 0.04em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-width: 260px;
  }

  /* seller */
  .ap-seller-email {
    font-size: 12px; font-weight: 300; color: #9994a8;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-width: 200px;
  }
  .ap-seller-sub {
    font-size: 8px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #524f60; margin-top: 3px;
  }

  /* status */
  .ap-status-row { display: flex; align-items: center; gap: 8px; }
  .ap-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }
  .ap-dot-green  { background: #22C55E; box-shadow: 0 0 8px rgba(34,197,94,0.6); }
  .ap-dot-red    { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
  .ap-dot-amber  { background: #f0a030; box-shadow: 0 0 8px rgba(240,160,48,0.5); }
  .ap-dot-pulse  { animation: ap-pulse 1.5s ease-in-out infinite; }
  @keyframes ap-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

  .ap-status-text {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
  }
  .ap-status-green { color: rgba(34,197,94,0.85); }
  .ap-status-red   { color: rgba(239,68,68,0.85); }
  .ap-status-amber { color: rgba(240,160,48,0.9); }

  /* actions */
  .ap-actions { display: flex; justify-content: flex-end; gap: 10px; align-items: center; }

  .ap-btn-approve {
    padding: 8px 18px;
    background: linear-gradient(135deg, #c9a84c, #f0a030);
    border: none; border-radius: 8px;
    color: #09090e;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(201,168,76,0.25);
    transition: box-shadow 0.2s, filter 0.2s;
  }
  .ap-btn-approve:hover {
    box-shadow: 0 6px 24px rgba(201,168,76,0.4); filter: brightness(1.05);
  }

  .ap-btn-deny {
    padding: 8px 18px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    color: #ef4444;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .ap-btn-deny:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.45);
    color: #ff6b6b;
  }

  .ap-immutable {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: #524f60; font-style: italic;
  }

  /* empty */
  .ap-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px; gap: 10px; text-align: center;
  }
  .ap-empty-icon { font-size: 2rem; color: rgba(201,168,76,0.25); }
  .ap-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.05em;
    color: rgba(240,237,232,0.15);
  }
  .ap-empty-sub { font-size: 11px; color: #524f60; font-weight: 300; }

  /* footer */
  .ap-footer {
    display: flex; justify-content: space-between;
    margin-top: 32px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.6em; text-transform: uppercase;
    color: rgba(255,255,255,0.06);
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
