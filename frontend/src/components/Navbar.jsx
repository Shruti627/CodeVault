import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const minimalRoutes = [
    "/login", "/register", "/register-seller",
    "/forgot-password", "/reset-password",
  ];
  const isMinimal = minimalRoutes.includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <nav className={`nb-root ${scrolled ? "nb-scrolled" : "nb-top"}`}>
        <div className="nb-inner">

          {/* ── LOGO ── */}
          <Link to="/" className="nb-logo">
            <span className="nb-logo-icon">◆</span>
            CodeVault
          </Link>

          {/* ── NAV LINKS ── */}
          {!isMinimal && (
            <div className="nb-links">

              {/* Always visible */}
              <Link to="/projects" className="nb-link">Projects</Link>

              {/* AI Assistant — buyer + seller only */}
              {(user?.role === "buyer" || user?.role === "seller") && (
                <Link
                  to={
                    localStorage.getItem("lastChatId")
                      ? `/ai-chat/${localStorage.getItem("lastChatId")}`
                      : "/ai-chat"
                  }
                  className="nb-link nb-link-teal"
                >
                  <span className="nb-ai-dot" />
                  AI Assistant
                </Link>
              )}

              {/* Buyer */}
              {user?.role === "buyer" && (
                <>
                  <Link to="/my-purchases" className="nb-link">My Library</Link>
                  <Link to="/register-seller" className="nb-link nb-link-gold">Become Seller</Link>
                </>
              )}

              {/* Seller */}
              {user?.role === "seller" && (
                <>
                  <Link to="/upload"      className="nb-link">Upload</Link>
                  <Link to="/my-projects" className="nb-link">My Projects</Link>
                </>
              )}

              {/* Admin */}
              {user?.role === "admin" && (
                <Link to="/admin/sellers" className="nb-link">Admin</Link>
              )}

              {/* Auth */}
              {!user ? (
                <div className="nb-auth-group">
                  <Link to="/login"    className="nb-btn-ghost">Login</Link>
                  <Link to="/register" className="nb-btn-primary">Register</Link>
                </div>
              ) : (
                <div className="nb-user-group">
                  <span className="nb-role-badge">{user.role}</span>
                  <button className="nb-logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </nav>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  /* ── root ── */
  .nb-root {
    position: fixed; top: 0; width: 100%; z-index: 50;
    transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
  }

  /* transparent at top */
  .nb-top {
    background: transparent;
    border-bottom: 1px solid transparent;
  }

  /* frosted on scroll */
  .nb-scrolled {
    background: rgba(9,9,14,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 4px 32px rgba(0,0,0,0.4);
  }

  /* inner container */
  .nb-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    height: 72px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* ── logo ── */
  .nb-logo {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.35rem; letter-spacing: 0.08em;
    color: #f0ede8; text-decoration: none;
    transition: color 0.2s;
  }
  .nb-logo:hover { color: #e4c97e; }
  .nb-logo-icon {
    font-size: 0.7rem; color: #c9a84c;
    transition: transform 0.3s;
  }
  .nb-logo:hover .nb-logo-icon { transform: rotate(45deg); }

  /* ── links row ── */
  .nb-links {
    display: flex; align-items: center; gap: 32px;
  }

  /* base link */
  .nb-link {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(240,237,232,0.5);
    text-decoration: none; position: relative;
    transition: color 0.2s;
  }
  .nb-link::after {
    content: '';
    position: absolute; bottom: -3px; left: 0;
    width: 100%; height: 1px;
    background: #c9a84c;
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.3s cubic-bezier(0.76,0,0.24,1);
  }
  .nb-link:hover { color: #f0ede8; }
  .nb-link:hover::after { transform: scaleX(1); transform-origin: left; }

  /* teal variant — AI link */
  .nb-link-teal {
    color: rgba(78,205,196,0.7);
    display: flex; align-items: center; gap: 7px;
  }
  .nb-link-teal:hover { color: #4ecdc4; }
  .nb-link-teal::after { background: #4ecdc4; }

  .nb-ai-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #4ecdc4; box-shadow: 0 0 6px #4ecdc4;
    flex-shrink: 0;
    animation: nb-pulse 2s ease-in-out infinite;
  }
  @keyframes nb-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }

  /* gold variant — Become Seller */
  .nb-link-gold { color: #c9a84c; }
  .nb-link-gold:hover { color: #e4c97e; }
  .nb-link-gold::after { background: #e4c97e; }

  /* ── auth buttons ── */
  .nb-auth-group { display: flex; align-items: center; gap: 12px; }

  .nb-btn-ghost {
    padding: 8px 20px;
    border: 1px solid rgba(201,168,76,0.28);
    border-radius: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #e4c97e; text-decoration: none;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .nb-btn-ghost:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.5);
    color: #f0ede8;
  }

  .nb-btn-primary {
    padding: 9px 20px;
    background: linear-gradient(135deg, #c9a84c, #f0a030);
    border-radius: 8px;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #09090e; text-decoration: none;
    box-shadow: 0 2px 12px rgba(201,168,76,0.25);
    transition: box-shadow 0.2s, filter 0.2s;
  }
  .nb-btn-primary:hover {
    box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    filter: brightness(1.05);
  }

  /* ── user group ── */
  .nb-user-group { display: flex; align-items: center; gap: 16px; }

  .nb-role-badge {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #524f60;
    padding: 4px 10px;
    background: rgba(201,168,76,0.05);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 100px;
  }

  .nb-logout-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(239,68,68,0.6);
    transition: color 0.2s;
    padding: 0;
  }
  .nb-logout-btn:hover { color: #ef4444; }

  ::selection { background: #c9a84c; color: #09090e; }
`;
