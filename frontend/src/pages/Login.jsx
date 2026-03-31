import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate("/projects");
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Email and password are required"); return; }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.user.role);
      toast.success("Welcome Back");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

        .login-root {
          min-height: 100vh;
          background: #09090e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
          position: relative;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
        }

        /* ── ambient glows ── */
        .login-root::before {
          content: '';
          position: fixed;
          top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-root::after {
          content: '';
          position: fixed;
          bottom: -300px; left: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        /* grain */
        .login-card-wrap {
          position: relative;
          width: 100%; max-width: 960px;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.08);
          z-index: 10;
        }
        .login-card-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 20;
        }

        @media (max-width: 720px) {
          .login-card-wrap { grid-template-columns: 1fr; }
          .login-left { display: none; }
        }

        /* ── LEFT PANEL ── */
        .login-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 44px;
          background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        /* dot grid */
        .login-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .login-left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 10px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: #c9a84c;
          font-weight: 600;
          margin-bottom: 32px;
          width: fit-content;
        }
        .login-left-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 8px #22C55E;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.5); } }

        .login-left h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          color: #f0ede8;
          margin: 0 0 20px 0;
          position: relative; z-index: 1;
        }
        .login-left h2 .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.25);
        }
        .login-left h2 .gold {
          background: linear-gradient(135deg, #e4c97e, #f0a030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-left p {
          font-size: 0.88rem;
          color: #9994a8;
          line-height: 1.75;
          font-weight: 300;
          max-width: 28ch;
          margin-bottom: 40px;
          position: relative; z-index: 1;
        }

        .login-left-tags {
          display: flex;
          gap: 16px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #524f60;
          position: relative; z-index: 1;
        }
        .login-left-tags span { transition: color 0.2s; cursor: default; }
        .login-left-tags span:hover { color: #c9a84c; }

        /* ghost "PB" */
        .login-left-ghost {
          position: absolute;
          bottom: -30px; right: -20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12rem;
          color: rgba(201,168,76,0.04);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        /* feature rows */
        .login-feature-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 1;
        }
        .login-feature-row:last-child { border-bottom: none; }
        .login-feature-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #c9a84c;
          flex-shrink: 0;
        }
        .login-feature-title {
          font-size: 13px; font-weight: 700;
          color: #f0ede8; letter-spacing: -0.01em;
          margin-bottom: 2px;
        }
        .login-feature-sub {
          font-size: 11px; color: #524f60; font-weight: 300;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          padding: 52px 48px;
          background: #0e0e16;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: #c9a84c;
          display: block;
          margin-bottom: 12px;
        }

        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.8rem, 5vw, 4rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          color: #f0ede8;
          margin: 0 0 40px 0;
        }
        .login-title .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.28);
        }

        /* field */
        .login-field { margin-bottom: 28px; }
        .login-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #524f60;
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .login-field:focus-within .login-label { color: #c9a84c; }

        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 4px;
          color: #f0ede8;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s;
          caret-color: #c9a84c;
        }
        .login-input::placeholder { color: #524f60; }
        .login-input:focus { border-color: rgba(201,168,76,0.5); }

        /* primary btn */
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #c9a84c 0%, #f0a030 100%);
          border: none;
          border-radius: 10px;
          color: #09090e;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 4px 24px rgba(201,168,76,0.3);
          transition: box-shadow 0.2s, filter 0.2s;
        }
        .login-btn:hover { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* footer links */
        .login-footer {
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .login-link-center {
          display: block;
          text-align: center;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #524f60;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-link-center:hover { color: #e4c97e; }
        .login-link-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .login-link {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9994a8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-link:hover { color: #e4c97e; }
        .login-link-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        /* footer protocol */
        .login-protocol {
          position: fixed;
          bottom: 24px; left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.06);
          white-space: nowrap;
          z-index: 10;
        }

        ::selection { background: #c9a84c; color: #09090e; }
      `}} />

      <div className="login-root">

        <motion.div
          className="login-card-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ══════════ LEFT PANEL ══════════ */}
          <div className="login-left">

            <div>
              {/* Status badge */}
              <div className="login-left-badge">
                <span className="login-left-badge-dot" />
                Marketplace Live
              </div>

              <h2>
                Enter The<br />
                <span className="outline">Verified</span><br />
                <span className="gold">Marketplace.</span>
              </h2>

              <p>
                Your gateway to premium, production-ready codebases —
                reviewed by senior engineers and ready to deploy.
              </p>
            </div>

            {/* Feature rows */}
            <div>
              {[
                { icon: "✦", title: "Admin Verified",   sub: "Every codebase reviewed" },
                { icon: "◈", title: "Production Ready", sub: "Auth, APIs, DBs included" },
                { icon: "⟳", title: "Instant Deploy",   sub: "Clone → configure → ship" },
              ].map((f) => (
                <div className="login-feature-row" key={f.title}>
                  <div className="login-feature-icon">{f.icon}</div>
                  <div>
                    <div className="login-feature-title">{f.title}</div>
                    <div className="login-feature-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="login-left-tags">
              <span>Security</span>
              <span>Quality</span>
              <span>Speed</span>
            </div>

            {/* Ghost watermark */}
            <div className="login-left-ghost">PB</div>
          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div className="login-right">

            <span className="login-section-label">Authentication</span>
            <h2 className="login-title">
              Welcome<br />
              <span className="outline">Back.</span>
            </h2>

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input
                type="email"
                className="login-input"
                placeholder="developer@CodeVault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Submit */}
            <motion.button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Verifying..." : "Authorize Access →"}
            </motion.button>

            {/* Footer links */}
            <div className="login-footer">
              <Link to="/forgot-password" className="login-link-center">
                Recovery Key Lost?
              </Link>
              <div className="login-link-row">
                <Link to="/register"        className="login-link">Register Buyer</Link>
                <div className="login-link-dot" />
                <Link to="/register-seller" className="login-link">Register Seller</Link>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Protocol watermark */}
        <div className="login-protocol">CodeVault Protocol v2.0</div>

      </div>
    </>
  );
}
