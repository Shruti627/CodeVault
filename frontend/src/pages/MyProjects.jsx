import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get("/projects/my")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="mp-root" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div className="mp-spinner" />
          <span className="mp-loading-text">Syncing Assets...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="mp-root">

        {/* Ambient glows */}
        <div className="mp-glow-top" />
        <div className="mp-glow-bottom" />

        <div className="mp-inner">

          {/* ── HEADER ── */}
          <div className="mp-header">
            <div>
              <span className="mp-section-label">Seller Dashboard</span>
              <h1 className="mp-title">
                My <span className="mp-title-outline">Archive</span>
              </h1>
            </div>

            <div className="mp-count-wrap">
              <span className="mp-count-num">
                {projects.length.toString().padStart(2, "0")}
              </span>
              <p className="mp-count-label">Total Deployments</p>
            </div>
          </div>

          {/* ── EMPTY STATE ── */}
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mp-empty"
            >
              <div className="mp-empty-icon">◈</div>
              <p className="mp-empty-text">Archive is empty.</p>
              <p className="mp-empty-sub">Start your first deployment to see it here.</p>
            </motion.div>
          ) : (
            /* ── GRID ── */
            <div className="mp-grid">
              <AnimatePresence>
                {projects.map((p, index) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5 }}
                    className="mp-card"
                  >
                    {/* Status indicator */}
                    <div className="mp-status-row">
                      <div className={`mp-status-dot ${p.isApproved ? "mp-dot-live" : "mp-dot-pending"}`} />
                      <span className="mp-status-text">
                        {p.isApproved ? "Live" : "Pending Review"}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mp-card-title">{p.title}</h2>

                    {/* Description */}
                    <p className="mp-card-desc">{p.description}</p>

                    {/* Tech stack pills */}
                    <div className="mp-tags">
                      {p.techStack.map((tech, i) => (
                        <span key={i} className="mp-tag">{tech}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mp-card-footer">
                      <div>
                        <p className="mp-price-label">Market Value</p>
                        <span className="mp-price">₹{p.price.toLocaleString()}</span>
                      </div>
                      <motion.button
                        className="mp-arrow-btn"
                        whileHover={{ scale: 1.1, background: "linear-gradient(135deg, #c9a84c, #f0a030)", borderColor: "#c9a84c" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        →
                      </motion.button>
                    </div>

                    {/* Ghost index number */}
                    <div className="mp-ghost-num">#{index + 1}</div>

                    {/* Top shimmer line — appears on hover via CSS */}
                    <div className="mp-shimmer-line" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Vertical sidebar deco */}
        <div className="mp-sidebar-deco">
          <span style={{ writingMode: "vertical-rl" }}>Internal Archive Layer</span>
        </div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .mp-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    padding-top: 120px;
    padding-bottom: 80px;
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
    overflow: hidden;
  }

  /* ambient glows */
  .mp-glow-top {
    position: fixed; top: -200px; right: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .mp-glow-bottom {
    position: fixed; bottom: -300px; left: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* loading */
  .mp-spinner {
    width: 44px; height: 44px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: mp-spin 0.8s linear infinite;
  }
  @keyframes mp-spin { to { transform: rotate(360deg); } }

  .mp-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: #524f60;
  }

  /* inner container */
  .mp-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative; z-index: 10;
  }

  /* header */
  .mp-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 64px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .mp-section-label {
    display: block;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 12px;
  }

  .mp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 6rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0;
  }
  .mp-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  .mp-count-wrap { text-align: right; }
  .mp-count-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.5rem; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    display: block; line-height: 1;
  }
  .mp-count-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60; margin-top: 4px;
  }

  /* empty state */
  .mp-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 280px;
    border: 1px dashed rgba(201,168,76,0.15);
    border-radius: 20px;
    background: rgba(201,168,76,0.02);
    gap: 12px;
  }
  .mp-empty-icon {
    font-size: 2rem; color: rgba(201,168,76,0.3);
    margin-bottom: 4px;
  }
  .mp-empty-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.05em;
    color: rgba(240,237,232,0.2);
  }
  .mp-empty-sub {
    font-size: 11px; color: #524f60;
    font-weight: 300; letter-spacing: 0.05em;
  }

  /* grid */
  .mp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1024px) { .mp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .mp-grid { grid-template-columns: 1fr; } }

  /* card */
  .mp-card {
    position: relative;
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 36px 32px;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .mp-card:hover {
    border-color: rgba(201,168,76,0.25);
    box-shadow: 0 0 32px rgba(201,168,76,0.06), 0 24px 48px rgba(0,0,0,0.5);
  }

  /* top shimmer line on hover */
  .mp-shimmer-line {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .mp-card:hover .mp-shimmer-line { opacity: 1; }

  /* status */
  .mp-status-row {
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 20px;
  }
  .mp-status-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }
  .mp-dot-live    { background: #22C55E; box-shadow: 0 0 10px rgba(34,197,94,0.6); }
  .mp-dot-pending { background: #f0a030; box-shadow: 0 0 10px rgba(240,160,48,0.5); }
  .mp-status-text {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60;
  }

  /* card title */
  .mp-card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.7rem; letter-spacing: 0.02em;
    color: #f0ede8; margin: 0 0 12px 0; line-height: 1.1;
    padding-right: 16px;
    transition: color 0.2s;
  }
  .mp-card:hover .mp-card-title { color: #e4c97e; }

  /* card desc */
  .mp-card-desc {
    font-size: 0.82rem; color: #9994a8;
    line-height: 1.75; font-weight: 300;
    display: -webkit-box;
    -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden; margin-bottom: 20px;
  }

  /* tags */
  .mp-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 28px; }
  .mp-tag {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    background: rgba(201,168,76,0.07);
    border: 1px solid rgba(201,168,76,0.15);
    color: #9994a8;
    padding: 4px 10px; border-radius: 6px;
    transition: border-color 0.2s, color 0.2s;
  }
  .mp-card:hover .mp-tag {
    border-color: rgba(201,168,76,0.25);
    color: #c9a84c;
  }

  /* footer */
  .mp-card-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .mp-price-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60; margin-bottom: 4px;
  }
  .mp-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; letter-spacing: 0.02em;
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* arrow button */
  .mp-arrow-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.25);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: #e4c97e;
    cursor: pointer;
    transition: background 0.22s, border-color 0.22s, color 0.22s;
  }

  /* ghost number */
  .mp-ghost-num {
    position: absolute; bottom: -12px; right: 16px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5rem; letter-spacing: 0.02em;
    color: rgba(201,168,76,0.04);
    line-height: 1; pointer-events: none; user-select: none;
  }

  /* sidebar deco */
  .mp-sidebar-deco {
    position: fixed; left: 24px; bottom: 40px;
    display: none;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: rgba(255,255,255,0.06);
  }
  @media (min-width: 1024px) { .mp-sidebar-deco { display: block; } }

  ::selection { background: #c9a84c; color: #09090e; }
`;
