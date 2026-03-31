import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLayout() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="adm-root">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="adm-sidebar">

          {/* dot grid */}
          <div className="adm-sidebar-dotgrid" />

          {/* top gold glow */}
          <div className="adm-sidebar-glow" />

          <div className="adm-sidebar-inner">

            {/* Logo / title */}
            <div className="adm-brand">
              <span className="adm-section-label">System Root</span>
              <h2 className="adm-brand-title">
                Admin <span className="adm-brand-outline">OS</span>
              </h2>
            </div>

            {/* Navigation */}
            <nav className="adm-nav">
              <AdminNavLink to="/admin/sellers"  label="Sellers"  icon="◈" />
              <AdminNavLink to="/admin/projects" label="Projects" icon="▣" />
              <AdminNavLink to="/admin/buyers"   label="Buyers"   icon="◒" />
            </nav>

            {/* Admin footer */}
            <div className="adm-footer">
              <div className="adm-footer-card">
                <div className="adm-avatar">A</div>
                <div>
                  <p className="adm-avatar-name">Master Admin</p>
                  <p className="adm-avatar-sub">Authorized Access</p>
                </div>
                {/* live indicator */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="adm-live-dot"
                />
              </div>
            </div>

          </div>
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="adm-main">
          {/* ambient glow */}
          <div className="adm-main-glow-tr" />
          <div className="adm-main-glow-bl" />
          <div className="adm-main-inner">
            <Outlet />
          </div>
        </main>

      </div>
    </>
  );
}

// ─── NavLink component — unchanged behaviour ──────────────────────────────────
function AdminNavLink({ to, label, icon }) {
  return (
    <NavLink to={to} className="adm-navlink-wrap">
      {({ isActive }) => (
        <div className={`adm-navlink ${isActive ? "adm-navlink-active" : "adm-navlink-idle"}`}>
          <div className="adm-navlink-left">
            <span className={`adm-navlink-icon ${isActive ? "adm-icon-active" : "adm-icon-idle"}`}>
              {icon}
            </span>
            <span className="adm-navlink-label">{label}</span>
          </div>

          {isActive && (
            <motion.div
              layoutId="activeGlow"
              className="adm-active-dot"
            />
          )}
        </div>
      )}
    </NavLink>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  /* ── root layout ── */
  .adm-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    display: flex;
    padding-top: 72px; /* navbar height */
  }

  /* ── sidebar ── */
  .adm-sidebar {
    width: 272px;
    flex-shrink: 0;
    background: #0e0e16;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .adm-sidebar-dotgrid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(201,168,76,0.055) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none; z-index: 0;
  }

  .adm-sidebar-glow {
    position: absolute; top: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .adm-sidebar-inner {
    position: relative; z-index: 10;
    display: flex; flex-direction: column;
    height: 100%; padding: 32px 24px;
  }

  /* brand */
  .adm-brand { margin-bottom: 44px; }

  .adm-section-label {
    display: block;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 10px;
  }

  .adm-brand-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem; line-height: 0.9;
    letter-spacing: 0.01em; color: #f0ede8; margin: 0;
  }
  .adm-brand-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.3);
  }

  /* nav */
  .adm-nav {
    flex: 1;
    display: flex; flex-direction: column; gap: 6px;
  }

  .adm-navlink-wrap { display: block; text-decoration: none; }

  .adm-navlink {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px; border-radius: 12px;
    transition: background 0.2s, border-color 0.2s;
    border: 1px solid transparent;
    cursor: pointer;
  }

  /* active state */
  .adm-navlink-active {
    background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.07) 100%);
    border-color: rgba(201,168,76,0.28);
    box-shadow: 0 0 20px rgba(201,168,76,0.07);
  }

  /* idle state */
  .adm-navlink-idle {
    background: transparent;
    border-color: transparent;
  }
  .adm-navlink-idle:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.06);
  }

  .adm-navlink-left {
    display: flex; align-items: center; gap: 14px;
  }

  .adm-navlink-icon { font-size: 13px; transition: color 0.2s; }
  .adm-icon-active  { color: #c9a84c; }
  .adm-icon-idle    { color: #524f60; }
  .adm-navlink-idle:hover .adm-icon-idle { color: #9994a8; }

  .adm-navlink-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    transition: color 0.2s;
  }
  .adm-navlink-active .adm-navlink-label { color: #e4c97e; }
  .adm-navlink-idle   .adm-navlink-label { color: #524f60; }
  .adm-navlink-idle:hover .adm-navlink-label { color: #9994a8; }

  /* active indicator dot */
  .adm-active-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #c9a84c;
    box-shadow: 0 0 10px rgba(201,168,76,0.6);
    flex-shrink: 0;
  }

  /* footer */
  .adm-footer {
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .adm-footer-card {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: rgba(201,168,76,0.05);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 14px;
    position: relative;
  }
  .adm-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #c9a84c, #f0a030);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.05em;
    color: #09090e; flex-shrink: 0;
  }
  .adm-avatar-name {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #f0ede8; margin-bottom: 3px;
  }
  .adm-avatar-sub {
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #524f60;
  }
  .adm-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22C55E; box-shadow: 0 0 8px #22C55E;
    position: absolute; top: 12px; right: 14px;
    flex-shrink: 0;
  }

  /* ── main content ── */
  .adm-main {
    flex: 1;
    position: relative;
    overflow-y: auto;
    background: #09090e;
  }
  .adm-main-glow-tr {
    position: fixed; top: -200px; right: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .adm-main-glow-bl {
    position: fixed; bottom: -300px; left: 272px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.025) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .adm-main-inner {
    position: relative; z-index: 10; height: 100%;
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
