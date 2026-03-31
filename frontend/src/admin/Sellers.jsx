import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { toast } from "react-hot-toast";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = async () => {
    try {
      const res = await API.get("/admin/sellers");
      setSellers(res.data);
    } catch {
      toast.error("Failed to interface with personnel database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSellers(); }, []);

  const approveSeller = async (id) => {
    try {
      await API.patch(`/admin/sellers/${id}/approve`);
      toast.success("Merchant Identity Verified");
      loadSellers();
    } catch {
      toast.error("Authorization failed");
    }
  };

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="sl-loading">
          <div className="sl-spinner" />
          <span className="sl-loading-text">Scanning Entities...</span>
        </div>
      </>
    );
  }

  const pending  = sellers.filter((s) => !s.isApproved).length;
  const approved = sellers.filter((s) =>  s.isApproved).length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="sl-root">

        {/* ── HEADER ── */}
        <div className="sl-header">
          <div>
            <span className="sl-section-label">Entity Management</span>
            <h1 className="sl-title">
              Seller <span className="sl-title-outline">Registry</span>
            </h1>
          </div>

          {/* Quick stats */}
          <div className="sl-stats">
            <div className="sl-stat">
              <span className="sl-stat-num sl-stat-gold">
                {sellers.length.toString().padStart(2, "0")}
              </span>
              <span className="sl-stat-label">Total</span>
            </div>
            <div className="sl-stat-divider" />
            <div className="sl-stat">
              <span className="sl-stat-num sl-stat-green">
                {approved.toString().padStart(2, "0")}
              </span>
              <span className="sl-stat-label">Authorized</span>
            </div>
            <div className="sl-stat-divider" />
            <div className="sl-stat">
              <span className="sl-stat-num sl-stat-amber">
                {pending.toString().padStart(2, "0")}
              </span>
              <span className="sl-stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="sl-table-wrap">

          {/* Head */}
          <div className="sl-table-head">
            <div className="sl-col-4">Full Identity</div>
            <div className="sl-col-4">Email Channel</div>
            <div className="sl-col-2">Auth Status</div>
            <div className="sl-col-2 sl-right">Clearance</div>
          </div>

          {/* Rows */}
          <div className="sl-rows">
            <AnimatePresence>
              {sellers.map((s, index) => (
                <motion.div
                  key={s._id}
                  className="sl-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* shimmer line */}
                  <div className="sl-row-shimmer" />

                  {/* Name */}
                  <div className="sl-col-4">
                    <p className="sl-name">{s.name}</p>
                    <p className="sl-uid">ID: {s._id.slice(-8).toUpperCase()}</p>
                  </div>

                  {/* Email */}
                  <div className="sl-col-4">
                    <span className="sl-email">{s.email}</span>
                  </div>

                  {/* Status */}
                  <div className="sl-col-2">
                    <div className="sl-status-row">
                      <div className={`sl-status-dot ${s.isApproved ? "sl-dot-live" : "sl-dot-pending"}`} />
                      <span className={`sl-status-text ${s.isApproved ? "sl-text-live" : "sl-text-pending"}`}>
                        {s.isApproved ? "Authorized" : "Awaiting Check"}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="sl-col-2 sl-right">
                    {!s.isApproved ? (
                      <motion.button
                        className="sl-approve-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveSeller(s._id)}
                      >
                        Verify ✦
                      </motion.button>
                    ) : (
                      <div className="sl-approved-dots">
                        <div className="sl-dot-sm" />
                        <div className="sl-dot-sm" />
                        <div className="sl-dot-sm" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sellers.length === 0 && (
              <div className="sl-empty">
                <div className="sl-empty-icon">◈</div>
                <p className="sl-empty-title">No Seller Entities Found</p>
                <p className="sl-empty-sub">No records in the system yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sl-footer">
          <span>Restricted Access Only</span>
          <span>Secure Protocol v4.0.1</span>
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
  .sl-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 60vh; gap: 16px;
    font-family: 'Cabinet Grotesk', sans-serif;
  }
  .sl-spinner {
    width: 44px; height: 44px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: sl-spin 0.8s linear infinite;
  }
  @keyframes sl-spin { to { transform: rotate(360deg); } }
  .sl-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: #524f60; font-style: italic;
  }

  /* root */
  .sl-root {
    padding: 40px;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    color: #f0ede8;
    position: relative;
  }

  /* header */
  .sl-header {
    display: flex; justify-content: space-between;
    align-items: flex-end; flex-wrap: wrap; gap: 24px;
    margin-bottom: 40px; padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .sl-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 10px;
  }

  .sl-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0;
  }
  .sl-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  /* stats */
  .sl-stats {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 24px;
    background: rgba(201,168,76,0.04);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 16px;
  }
  .sl-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .sl-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.02em; line-height: 1;
  }
  .sl-stat-gold  {
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sl-stat-green { color: #22C55E; }
  .sl-stat-amber { color: #f0a030; }
  .sl-stat-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase; color: #524f60;
  }
  .sl-stat-divider {
    width: 1px; height: 36px;
    background: rgba(255,255,255,0.06);
  }

  /* table */
  .sl-table-wrap {
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 24px 48px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(201,168,76,0.07);
  }

  .sl-table-head {
    display: grid;
    grid-template-columns: 4fr 4fr 2fr 2fr;
    gap: 16px; padding: 20px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase; color: #524f60;
  }

  .sl-rows {}

  .sl-row {
    display: grid;
    grid-template-columns: 4fr 4fr 2fr 2fr;
    gap: 16px; padding: 22px 32px;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    position: relative; transition: background 0.2s; cursor: default;
  }
  .sl-row:last-child { border-bottom: none; }
  .sl-row:hover { background: rgba(201,168,76,0.03); }

  .sl-row-shimmer {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .sl-row:hover .sl-row-shimmer { opacity: 1; }

  /* cols */
  .sl-col-4 {}
  .sl-col-2 {}
  .sl-right { text-align: right; }

  /* name */
  .sl-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem; letter-spacing: 0.03em;
    color: #f0ede8; margin: 0 0 4px 0; transition: color 0.2s;
  }
  .sl-row:hover .sl-name { color: #e4c97e; }
  .sl-uid {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 9px; color: #524f60; letter-spacing: 0.05em;
  }

  /* email */
  .sl-email { font-size: 13px; font-weight: 300; color: #9994a8; }

  /* status */
  .sl-status-row { display: flex; align-items: center; gap: 8px; }
  .sl-status-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }
  .sl-dot-live    { background: #22C55E; box-shadow: 0 0 8px rgba(34,197,94,0.6); }
  .sl-dot-pending { background: #f0a030; box-shadow: 0 0 8px rgba(240,160,48,0.5); animation: sl-pulse 1.5s ease-in-out infinite; }
  @keyframes sl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .sl-status-text {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
  }
  .sl-text-live    { color: rgba(34,197,94,0.8); }
  .sl-text-pending { color: rgba(240,160,48,0.85); }

  /* approve button */
  .sl-approve-btn {
    padding: 8px 18px;
    background: linear-gradient(135deg, #c9a84c, #f0a030);
    border: none; border-radius: 8px;
    color: #09090e;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(201,168,76,0.25);
    transition: box-shadow 0.2s, filter 0.2s;
  }
  .sl-approve-btn:hover {
    box-shadow: 0 6px 24px rgba(201,168,76,0.4);
    filter: brightness(1.05);
  }

  /* approved dots */
  .sl-approved-dots { display: flex; justify-content: flex-end; gap: 4px; align-items: center; }
  .sl-dot-sm {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(201,168,76,0.2);
  }

  /* empty */
  .sl-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px; gap: 10px; text-align: center;
  }
  .sl-empty-icon { font-size: 2rem; color: rgba(201,168,76,0.25); }
  .sl-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.05em;
    color: rgba(240,237,232,0.15);
  }
  .sl-empty-sub { font-size: 11px; color: #524f60; font-weight: 300; }

  /* footer */
  .sl-footer {
    display: flex; justify-content: space-between;
    margin-top: 32px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.6em; text-transform: uppercase;
    color: rgba(255,255,255,0.06);
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
