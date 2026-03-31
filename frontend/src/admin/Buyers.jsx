import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { toast } from "react-hot-toast";

export default function Buyers() {
  const [buyers, setBuyers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBuyers = async () => {
    try {
      const res = await API.get("/admin/buyers");
      setBuyers(res.data);
    } catch {
      toast.error("Failed to sync buyer database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBuyers(); }, []);

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="by-loading">
          <div className="by-spinner" />
          <span className="by-loading-text">Indexing Buyers...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="by-root">

        {/* ── HEADER ── */}
        <div className="by-header">
          <div>
            <span className="by-section-label">Consumer Management</span>
            <h1 className="by-title">
              Buyer <span className="by-title-outline">Database</span>
            </h1>
          </div>
          <div className="by-count-wrap">
            <span className="by-count-num">
              {buyers.length.toString().padStart(2, "0")}
            </span>
            <p className="by-count-label">Total Nodes</p>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="by-table-wrap">

          {/* Table header */}
          <div className="by-table-head">
            <div className="by-col-5">Identity</div>
            <div className="by-col-4">Email Address</div>
            <div className="by-col-3 by-right">Access Level</div>
          </div>

          {/* Rows */}
          <div className="by-rows">
            <AnimatePresence>
              {buyers.map((b, index) => (
                <motion.div
                  key={b._id}
                  className="by-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* shimmer line on hover */}
                  <div className="by-row-shimmer" />

                  <div className="by-col-5">
                    <p className="by-name">{b.name}</p>
                    <p className="by-uid">UID: {b._id.toUpperCase()}</p>
                  </div>

                  <div className="by-col-4">
                    <span className="by-email">{b.email}</span>
                  </div>

                  <div className="by-col-3 by-right">
                    <span className="by-badge">Standard Buyer</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {buyers.length === 0 && (
              <div className="by-empty">
                <div className="by-empty-icon">◒</div>
                <p className="by-empty-text">No Buyer Entities Found</p>
                <p className="by-empty-sub">No records in the system yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  /* ── loading ── */
  .by-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 60vh; gap: 16px;
    font-family: 'Cabinet Grotesk', sans-serif;
  }
  .by-spinner {
    width: 44px; height: 44px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: by-spin 0.8s linear infinite;
  }
  @keyframes by-spin { to { transform: rotate(360deg); } }
  .by-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: #524f60; font-style: italic;
  }

  /* ── page root ── */
  .by-root {
    padding: 40px;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    color: #f0ede8;
    position: relative;
  }

  /* ── header ── */
  .by-header {
    display: flex; justify-content: space-between;
    align-items: flex-end; flex-wrap: wrap; gap: 16px;
    margin-bottom: 40px; padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .by-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 10px;
  }

  .by-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0;
  }
  .by-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  .by-count-wrap { text-align: right; }
  .by-count-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem; letter-spacing: -0.02em; line-height: 1;
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    display: block;
  }
  .by-count-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60; margin-top: 4px;
  }

  /* ── table wrapper ── */
  .by-table-wrap {
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(201,168,76,0.07);
  }

  /* table head */
  .by-table-head {
    display: grid;
    grid-template-columns: 5fr 4fr 3fr;
    gap: 16px;
    padding: 20px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60;
  }

  /* rows container */
  .by-rows { }

  /* row */
  .by-row {
    display: grid;
    grid-template-columns: 5fr 4fr 3fr;
    gap: 16px;
    padding: 22px 32px;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    position: relative;
    transition: background 0.2s;
    cursor: default;
  }
  .by-row:last-child { border-bottom: none; }
  .by-row:hover { background: rgba(201,168,76,0.03); }

  /* shimmer top line on hover */
  .by-row-shimmer {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .by-row:hover .by-row-shimmer { opacity: 1; }

  /* cols */
  .by-col-5 { grid-column: span 1; }
  .by-col-4 { grid-column: span 1; }
  .by-col-3 { grid-column: span 1; }
  .by-right  { text-align: right; }

  /* name */
  .by-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem; letter-spacing: 0.03em;
    color: #f0ede8; margin: 0 0 4px 0;
    transition: color 0.2s;
  }
  .by-row:hover .by-name { color: #e4c97e; }

  /* uid */
  .by-uid {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 9px; color: #524f60;
    letter-spacing: 0.05em;
  }

  /* email */
  .by-email {
    font-size: 13px; font-weight: 300;
    color: #9994a8; font-style: italic;
  }

  /* badge */
  .by-badge {
    display: inline-block;
    padding: 5px 14px;
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 100px;
    background: rgba(201,168,76,0.06);
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: #9994a8;
    transition: border-color 0.2s, color 0.2s;
  }
  .by-row:hover .by-badge {
    border-color: rgba(201,168,76,0.35);
    color: #c9a84c;
  }

  /* empty */
  .by-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px; gap: 10px; text-align: center;
  }
  .by-empty-icon { font-size: 2rem; color: rgba(201,168,76,0.25); }
  .by-empty-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.05em;
    color: rgba(240,237,232,0.15);
  }
  .by-empty-sub {
    font-size: 11px; color: #524f60; font-weight: 300;
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
