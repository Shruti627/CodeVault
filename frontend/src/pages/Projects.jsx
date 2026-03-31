import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="proj-root">

        {/* Ambient glows */}
        <div className="proj-glow-tr" />
        <div className="proj-glow-bl" />

        {/* Dot grid */}
        <div className="proj-dotgrid" />

        <div className="proj-inner">

          {/* ── HERO ── */}
          <motion.div
            className="proj-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status badge */}
            <div className="proj-badge">
              <motion.span
                animate={{ scale: [1, 1.45, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="proj-badge-dot"
              />
              The Digital Exchange
            </div>

            <h1 className="proj-h1">
              Elite<br />
              <span className="proj-h1-outline">Source Code</span>
            </h1>

            <p className="proj-sub">
              Premium production-ready architectures. Verified by experts.<br />
              Ready for instant deployment.
            </p>

            {/* Decorative divider */}
            <div className="proj-divider-row">
              <div className="proj-divider-line" />
              <span className="proj-divider-text">Verified Marketplace</span>
              <div className="proj-divider-line" />
            </div>
          </motion.div>

          {/* ── LOADING ── */}
          {loading ? (
            <div className="proj-loading">
              <div className="proj-spinner" />
              <span className="proj-loading-text">Accessing Vault...</span>
            </div>
          ) : (
            /* ── GRID ── */
            <div className="proj-grid">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Sidebar deco */}
        <div className="proj-sidebar-deco">
          <span style={{ writingMode: "vertical-rl" }}>CodeVault Marketplace</span>
        </div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .proj-root {
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
  .proj-glow-tr {
    position: fixed; top: -200px; right: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .proj-glow-bl {
    position: fixed; bottom: -300px; left: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* dot grid overlay */
  .proj-dotgrid {
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(201,168,76,0.045) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none; z-index: 0;
  }

  /* inner */
  .proj-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative; z-index: 10;
  }

  /* ── hero ── */
  .proj-hero {
    text-align: center;
    margin-bottom: 80px;
  }

  /* status badge */
  .proj-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.22);
    border-radius: 100px;
    padding: 6px 18px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 32px;
  }
  .proj-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22C55E; box-shadow: 0 0 8px #22C55E;
    display: inline-block; flex-shrink: 0;
  }

  /* headline */
  .proj-h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 12vw, 10rem);
    line-height: 0.85; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0 0 28px 0;
  }
  .proj-h1-outline {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(240,237,232,0.3);
  }

  /* subtext */
  .proj-sub {
    font-size: 1rem; color: #9994a8;
    line-height: 1.75; font-weight: 300;
    max-width: 52ch; margin: 0 auto 36px;
  }

  /* divider row */
  .proj-divider-row {
    display: flex; align-items: center; justify-content: center; gap: 20px;
  }
  .proj-divider-line {
    height: 1px; width: 60px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
  }
  .proj-divider-text {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #524f60;
  }

  /* loading */
  .proj-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 280px; gap: 16px;
  }
  .proj-spinner {
    width: 44px; height: 44px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: proj-spin 0.8s linear infinite;
  }
  @keyframes proj-spin { to { transform: rotate(360deg); } }
  .proj-loading-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: #524f60;
  }

  /* grid */
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1024px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .proj-grid { grid-template-columns: 1fr; } }

  /* sidebar deco */
  .proj-sidebar-deco {
    position: fixed; left: 20px; bottom: 40px;
    display: none;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: rgba(255,255,255,0.05);
    z-index: 5;
  }
  @media (min-width: 1280px) { .proj-sidebar-deco { display: block; } }

  ::selection { background: #c9a84c; color: #09090e; }
`;
