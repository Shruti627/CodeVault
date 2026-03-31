import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function RegisterBuyer() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("All fields are required"); return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match"); return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      login(res.data.token, res.data.user.role);
      toast.success("Welcome to CodeVault");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { label: "Full Name",        name: "name",            type: "text",     placeholder: "Alex Dev" },
    { label: "Email Address",    name: "email",           type: "email",    placeholder: "alex@example.com" },
    { label: "Create Password",  name: "password",        type: "password", placeholder: "••••••••" },
    { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

        .rb-root {
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

        /* ambient glows */
        .rb-root::before {
          content: '';
          position: fixed; top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .rb-root::after {
          content: '';
          position: fixed; bottom: -300px; left: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* card */
        .rb-card {
          position: relative;
          width: 100%; max-width: 980px;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.08);
          z-index: 10;
        }
        /* grain overlay */
        .rb-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 20;
        }

        @media (max-width: 720px) {
          .rb-card { grid-template-columns: 1fr; }
          .rb-left { display: none; }
        }

        /* ── LEFT ── */
        .rb-left {
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
        .rb-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .rb-badge {
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
        .rb-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22C55E; box-shadow: 0 0 8px #22C55E;
          animation: rb-pulse 2s ease-in-out infinite;
        }
        @keyframes rb-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.5); } }

        .rb-left h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          color: #f0ede8;
          margin: 0 0 20px 0;
          position: relative; z-index: 1;
        }
        .rb-left h2 .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.25);
        }
        .rb-left h2 .gold {
          background: linear-gradient(135deg, #e4c97e, #f0a030);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .rb-left p {
          font-size: 0.88rem; color: #9994a8;
          line-height: 1.75; font-weight: 300;
          max-width: 28ch; margin-bottom: 36px;
          position: relative; z-index: 1;
        }

        /* feature rows */
        .rb-feat {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 1;
        }
        .rb-feat:last-of-type { border-bottom: none; }
        .rb-feat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #c9a84c; flex-shrink: 0;
        }
        .rb-feat-title { font-size: 13px; font-weight: 700; color: #f0ede8; letter-spacing: -0.01em; margin-bottom: 2px; }
        .rb-feat-sub   { font-size: 11px; color: #524f60; font-weight: 300; }

        /* divider row */
        .rb-divider-row {
          display: flex; align-items: center; gap: 16px;
          position: relative; z-index: 1;
        }
        .rb-divider-line { height: 1px; width: 40px; background: linear-gradient(90deg, #c9a84c, transparent); }
        .rb-divider-text { font-size: 10px; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase; color: #524f60; }

        /* ghost */
        .rb-ghost {
          position: absolute; bottom: -30px; right: -20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12rem; color: rgba(201,168,76,0.04);
          line-height: 1; pointer-events: none; user-select: none;
        }

        /* ── RIGHT ── */
        .rb-right {
          padding: 52px 48px;
          background: #0e0e16;
          display: flex; flex-direction: column; justify-content: center;
        }

        .rb-section-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.45em; text-transform: uppercase;
          color: #c9a84c; display: block; margin-bottom: 12px;
        }

        .rb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.6rem, 4.5vw, 3.6rem);
          line-height: 0.9; letter-spacing: 0.01em;
          color: #f0ede8; margin: 0 0 36px 0;
        }
        .rb-title .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.28);
        }
        .rb-title .gold {
          background: linear-gradient(135deg, #e4c97e, #f0a030);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* fields */
        .rb-field { margin-bottom: 22px; }
        .rb-label {
          display: block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: #524f60; margin-bottom: 10px; transition: color 0.2s;
        }
        .rb-field:focus-within .rb-label { color: #c9a84c; }

        .rb-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 12px 4px;
          color: #f0ede8;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          outline: none; transition: border-color 0.2s;
          caret-color: #c9a84c;
        }
        .rb-input::placeholder { color: #524f60; }
        .rb-input:focus { border-color: rgba(201,168,76,0.5); }

        /* button */
        .rb-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #c9a84c 0%, #f0a030 100%);
          border: none; border-radius: 10px;
          color: #09090e;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; margin-top: 12px;
          box-shadow: 0 4px 24px rgba(201,168,76,0.3);
          transition: box-shadow 0.2s, filter 0.2s;
        }
        .rb-btn:hover  { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
        .rb-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* footer */
        .rb-footer {
          margin-top: 32px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; gap: 14px; align-items: center;
        }
        .rb-footer-link {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #9994a8; text-decoration: none; transition: color 0.2s;
        }
        .rb-footer-link:hover { color: #e4c97e; }
        .rb-footer-link .accent {
          background: linear-gradient(90deg, #c9a84c, #f0a030);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          border-bottom: 1px solid rgba(201,168,76,0.3);
        }
        .rb-switch-row {
          display: flex; align-items: center; gap: 12px;
          width: 100%; opacity: 0.35; transition: opacity 0.2s;
        }
        .rb-switch-row:hover { opacity: 1; }
        .rb-switch-line { height: 1px; flex: 1; background: rgba(201,168,76,0.25); }
        .rb-switch-link {
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #e4c97e;
          text-decoration: none; white-space: nowrap;
        }

        /* protocol */
        .rb-protocol {
          position: fixed; bottom: 24px; right: 40px;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.8em; text-transform: uppercase;
          color: rgba(255,255,255,0.04);
          pointer-events: none; z-index: 10;
        }

        ::selection { background: #c9a84c; color: #09090e; }
      `}} />

      <div className="rb-root">

        <motion.div
          className="rb-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ══════════ LEFT ══════════ */}
          <div className="rb-left">
            <div>
              <div className="rb-badge">
                <span className="rb-badge-dot" />
                Access Granted
              </div>

              <h2>
                Own The<br />
                <span className="outline">Source</span><br />
                <span className="gold">Code.</span>
              </h2>

              <p>
                Stop building from scratch. Access the vault of
                industry-standard, production-ready codebases.
              </p>
            </div>

            {/* Features */}
            <div>
              {[
                { icon: "✦", title: "Verified Codebases",  sub: "Reviewed by senior engineers" },
                { icon: "◈", title: "Instant Access",      sub: "Download & deploy same day" },
                { icon: "⟳", title: "Ongoing Support",     sub: "Docs + architecture notes" },
              ].map((f) => (
                <div className="rb-feat" key={f.title}>
                  <div className="rb-feat-icon">{f.icon}</div>
                  <div>
                    <div className="rb-feat-title">{f.title}</div>
                    <div className="rb-feat-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider row */}
            <div className="rb-divider-row">
              <div className="rb-divider-line" />
              <span className="rb-divider-text">Buyer License / 2025</span>
            </div>

            {/* Ghost watermark */}
            <div className="rb-ghost">BUY</div>
          </div>

          {/* ══════════ RIGHT ══════════ */}
          <div className="rb-right">

            <span className="rb-section-label">Standard Buyer Authentication</span>
            <h2 className="rb-title">
              Join<br />
              <span className="gold">Bazaar.</span>
            </h2>

            {FIELDS.map((field) => (
              <div className="rb-field" key={field.name}>
                <label className="rb-label">{field.label}</label>
                <input
                  className="rb-input"
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
            ))}

            <motion.button
              className="rb-btn"
              onClick={submit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Creating Account..." : "Generate Account →"}
            </motion.button>

            <div className="rb-footer">
              <Link to="/login" className="rb-footer-link">
                Existing Member?&nbsp;<span className="accent">Sign In</span>
              </Link>
              <div className="rb-switch-row">
                <div className="rb-switch-line" />
                <Link to="/register-seller" className="rb-switch-link">Switch to Seller Account</Link>
                <div className="rb-switch-line" />
              </div>
            </div>

          </div>
        </motion.div>

        <div className="rb-protocol">CodeVault / Secure-Layer-X</div>

      </div>
    </>
  );
}
