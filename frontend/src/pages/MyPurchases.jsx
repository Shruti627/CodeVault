import { useEffect, useState } from "react";
import API from "../api/api";
import ProjectCard from "../components/ProjectCard";
import { motion } from "framer-motion";

export default function MyPurchases() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchOwned = async () => {
      try {
        const { data } = await API.get("/projects/owned");
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch library", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwned();
  }, []);

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="mp2-root" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="mp2-spinner" />
          <p className="mp2-loading-text">Decrypting Authorized Vault...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="mp2-root">

        {/* Ambient glows */}
        <div className="mp2-glow-tr" />
        <div className="mp2-glow-bl" />

        {/* Dot grid */}
        <div className="mp2-dotgrid" />

        <div className="mp2-inner">

          {/* ── HEADER ── */}
          <div className="mp2-header">

            <motion.div
              className="mp2-label-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mp2-label-line" />
              <span className="mp2-section-label">Verified Ownership</span>
            </motion.div>

            <div style={{ overflow: "hidden" }}>
              <motion.h1
                className="mp2-title"
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                My <span className="mp2-title-gold">Assets</span>
              </motion.h1>
            </div>

            <motion.p
              className="mp2-sub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              Access point for all acquired digital protocols and encrypted source archives.
            </motion.p>

            {/* count badge */}
            {projects.length > 0 && (
              <motion.div
                className="mp2-count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="mp2-count-num">{projects.length.toString().padStart(2, "0")}</span>
                <span className="mp2-count-label">Licensed Assets</span>
              </motion.div>
            )}
          </div>

          {/* ── EMPTY STATE ── */}
          {projects.length === 0 ? (
            <motion.div
              className="mp2-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mp2-empty-icon">◈</div>
              <p className="mp2-empty-title">Vault Empty</p>
              <p className="mp2-empty-sub">No licenses detected. Browse the marketplace to acquire projects.</p>
            </motion.div>
          ) : (
            /* ── GRID ── */
            <div className="mp2-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          )}

        </div>

        {/* Sidebar deco */}
        <div className="mp2-sidebar-deco">
          <span style={{ writingMode: "vertical-rl" }}>Authorized Access Layer</span>
        </div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .mp2-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    padding-top: 120px;
    padding-bottom: 100px;
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
    overflow: hidden;
  }

  /* ambient glows */
  .mp2-glow-tr {
    position: fixed; top: -200px; right: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .mp2-glow-bl {
    position: fixed; bottom: -300px; left: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* dot grid */
  .mp2-dotgrid {
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(201,168,76,0.045) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none; z-index: 0;
  }

  /* inner */
  .mp2-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative; z-index: 10;
  }

  /* header */
  .mp2-header { margin-bottom: 64px; }

  .mp2-label-row {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 20px;
  }
  .mp2-label-line {
    height: 1px; width: 40px;
    background: linear-gradient(90deg, #c9a84c, transparent);
    flex-shrink: 0;
  }
  .mp2-section-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c;
  }

  .mp2-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem);
    line-height: 0.88; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0 0 20px 0;
  }
  .mp2-title-gold {
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .mp2-sub {
    font-size: 0.85rem; color: #9994a8;
    line-height: 1.75; font-weight: 300;
    max-width: 46ch;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  /* count badge */
  .mp2-count {
    display: inline-flex; align-items: baseline; gap: 12px;
    padding: 10px 20px;
    background: rgba(201,168,76,0.06);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 100px;
  }
  .mp2-count-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; letter-spacing: 0.02em;
    background: linear-gradient(135deg, #e4c97e, #f0a030);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .mp2-count-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60;
  }

  /* loading */
  .mp2-spinner {
    width: 44px; height: 44px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: mp2-spin 0.8s linear infinite;
    margin-bottom: 16px;
  }
  @keyframes mp2-spin { to { transform: rotate(360deg); } }
  .mp2-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.4em; text-transform: uppercase;
    color: #c9a84c;
    animation: mp2-fade 1.2s ease-in-out infinite alternate;
  }
  @keyframes mp2-fade { from { opacity: 0.4; } to { opacity: 1; } }

  /* empty state */
  .mp2-empty {
    border: 1px solid rgba(201,168,76,0.1);
    background: rgba(201,168,76,0.02);
    border-radius: 20px;
    padding: 80px 40px;
    text-align: center;
    backdrop-filter: blur(12px);
    display: flex; flex-direction: column;
    align-items: center; gap: 12px;
  }
  .mp2-empty-icon {
    font-size: 2rem; color: rgba(201,168,76,0.3);
    margin-bottom: 4px;
  }
  .mp2-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.05em;
    color: rgba(240,237,232,0.2);
  }
  .mp2-empty-sub {
    font-size: 11px; color: #524f60;
    font-weight: 300; letter-spacing: 0.05em;
    max-width: 36ch;
  }

  /* grid */
  .mp2-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1024px) { .mp2-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .mp2-grid { grid-template-columns: 1fr; } }

  /* sidebar deco */
  .mp2-sidebar-deco {
    position: fixed; left: 20px; bottom: 40px;
    display: none;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: rgba(255,255,255,0.05);
    z-index: 5;
  }
  @media (min-width: 1280px) { .mp2-sidebar-deco { display: block; } }

  ::selection { background: #c9a84c; color: #09090e; }
`;
