import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";

export default function RegisterSeller() {
  const navigate = useNavigate();

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
      await API.post("/auth/register-seller", form);
      toast.success("Seller registered. Awaiting approval.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { label: "Full Name",           name: "name",            type: "text",     placeholder: "John Doe" },
    { label: "Email Address",       name: "email",           type: "email",    placeholder: "dev@CodeVault.com" },
    { label: "Access Key (Password)",name: "password",       type: "password", placeholder: "••••••••" },
    { label: "Confirm Access Key",  name: "confirmPassword", type: "password", placeholder: "••••••••" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

        .rs-root {
          min-height: 100vh;
          background: #09090e;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; overflow: hidden; position: relative;
          font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
        }

        /* ambient glows */
        .rs-root::before {
          content: '';
          position: fixed; top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .rs-root::after {
          content: '';
          position: fixed; bottom: -300px; left: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* card */
        .rs-card {
          position: relative;
          width: 100%; max-width: 980px;
          border-radius: 24px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.08);
          z-index: 10;
        }
        /* grain */
        .rs-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 20;
        }

        @media (max-width: 720px) {
          .rs-card { grid-template-columns: 1fr; }
          .rs-left { display: none; }
        }

        /* ── LEFT ── */
        .rs-left {
          position: relative;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 52px 44px;
          background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }
        /* dot grid */
        .rs-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }

        /* phase badge */
        .rs-phase {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(78,205,196,0.08);
          border: 1px solid rgba(78,205,196,0.2);
          border-radius: 100px; padding: 5px 14px;
          font-size: 10px; letter-spacing: 0.45em;
          text-transform: uppercase; color: #4ecdc4;
          font-weight: 600; margin-bottom: 32px; width: fit-content;
        }
        .rs-phase-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c9a84c; box-shadow: 0 0 8px #c9a84c;
          animation: rs-pulse 2s ease-in-out infinite;
        }
        @keyframes rs-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.5); } }

        .rs-left h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 5vw, 4.5rem);
          line-height: 0.9; letter-spacing: 0.01em;
          color: #f0ede8; margin: 0 0 20px 0;
          position: relative; z-index: 1;
        }
        .rs-left h2 .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.25);
        }
        .rs-left h2 .teal {
          background: linear-gradient(135deg, #4ecdc4, #e4c97e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .rs-left p {
          font-size: 0.88rem; color: #9994a8;
          line-height: 1.75; font-weight: 300;
          max-width: 28ch; margin-bottom: 36px;
          position: relative; z-index: 1;
        }

        /* perks */
        .rs-perk {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 1;
        }
        .rs-perk:last-of-type { border-bottom: none; }
        .rs-perk-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(78,205,196,0.08);
          border: 1px solid rgba(78,205,196,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #4ecdc4; flex-shrink: 0;
        }
        .rs-perk-title { font-size: 13px; font-weight: 700; color: #f0ede8; letter-spacing: -0.01em; margin-bottom: 2px; }
        .rs-perk-sub   { font-size: 11px; color: #524f60; font-weight: 300; }

        /* protocol row */
        .rs-protocol-row {
          display: flex; align-items: center; gap: 14px;
          position: relative; z-index: 1;
        }
        .rs-protocol-line { height: 1px; width: 40px; background: linear-gradient(90deg, #4ecdc4, transparent); }
        .rs-protocol-text { font-size: 10px; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase; color: #524f60; }

        /* ghost */
        .rs-ghost {
          position: absolute; bottom: -30px; left: -20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12rem; color: rgba(78,205,196,0.03);
          line-height: 1; pointer-events: none; user-select: none;
        }

        /* ── RIGHT ── */
        .rs-right {
          padding: 52px 48px;
          background: #0e0e16;
          display: flex; flex-direction: column; justify-content: center;
        }

        .rs-section-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.45em; text-transform: uppercase;
          color: #4ecdc4; display: block; margin-bottom: 12px;
        }

        .rs-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.4rem, 4vw, 3.4rem);
          line-height: 0.9; letter-spacing: 0.01em;
          color: #f0ede8; margin: 0 0 10px 0;
        }
        .rs-title .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(240,237,232,0.28);
        }
        .rs-subtitle {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: #524f60; margin-bottom: 36px; display: block;
        }

        /* approval notice */
        .rs-notice {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(78,205,196,0.05);
          border: 1px solid rgba(78,205,196,0.15);
          border-radius: 12px; padding: 14px 16px;
          margin-bottom: 28px;
        }
        .rs-notice-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .rs-notice-text { font-size: 11px; color: #9994a8; line-height: 1.6; font-weight: 300; }
        .rs-notice-text strong { color: #4ecdc4; font-weight: 600; }

        /* fields */
        .rs-field { margin-bottom: 20px; }
        .rs-label {
          display: block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: #524f60; margin-bottom: 10px; transition: color 0.2s;
        }
        .rs-field:focus-within .rs-label { color: #c9a84c; }

        .rs-input {
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
        .rs-input::placeholder { color: #524f60; }
        .rs-input:focus { border-color: rgba(201,168,76,0.5); }

        /* button */
        .rs-btn {
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
        .rs-btn:hover  { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
        .rs-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* footer */
        .rs-footer {
          margin-top: 28px; padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; gap: 14px; align-items: center;
        }
        .rs-footer-link {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #9994a8; text-decoration: none; transition: color 0.2s;
        }
        .rs-footer-link:hover { color: #e4c97e; }
        .rs-footer-link .accent {
          background: linear-gradient(90deg, #c9a84c, #f0a030);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .rs-switch-row {
          display: flex; align-items: center; gap: 12px;
          width: 100%; opacity: 0.3; transition: opacity 0.2s;
        }
        .rs-switch-row:hover { opacity: 1; }
        .rs-switch-line { height: 1px; flex: 1; background: rgba(255,255,255,0.08); }
        .rs-switch-link {
          font-size: 9px; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: #9994a8;
          text-decoration: none; white-space: nowrap; transition: color 0.2s;
        }
        .rs-switch-link:hover { color: #e4c97e; }

        /* watermark */
        .rs-watermark {
          position: fixed; bottom: 24px; left: 40px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.5em; text-transform: uppercase;
          color: rgba(255,255,255,0.04);
          pointer-events: none; z-index: 10;
        }

        ::selection { background: #c9a84c; color: #09090e; }
      `}} />

      <div className="rs-root">

        <motion.div
          className="rs-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ══════════ LEFT ══════════ */}
          <div className="rs-left">
            <div>
              <div className="rs-phase">
                <span className="rs-phase-dot" />
                Phase 01: Onboarding
              </div>

              <h2>
                Sell Your<br />
                <span className="outline">Masterpieces</span><br />
                <span className="teal">Today.</span>
              </h2>

              <p>
                Join the elite circle of developers. Turn your
                side-projects into a high-revenue passive income stream.
              </p>
            </div>

            {/* Perks */}
            <div>
              {[
                { icon: "✦", title: "Revenue Share",      sub: "Keep the majority of every sale" },
                { icon: "◈", title: "Admin Promotion",    sub: "Featured listing after approval" },
                { icon: "⟳", title: "Passive Income",     sub: "Sell once, earn indefinitely" },
              ].map((p) => (
                <div className="rs-perk" key={p.title}>
                  <div className="rs-perk-icon">{p.icon}</div>
                  <div>
                    <div className="rs-perk-title">{p.title}</div>
                    <div className="rs-perk-sub">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Protocol row */}
            <div className="rs-protocol-row">
              <div className="rs-protocol-line" />
              <span className="rs-protocol-text">Verified Seller Protocol</span>
            </div>

            {/* Ghost */}
            <div className="rs-ghost">SELL</div>
          </div>

          {/* ══════════ RIGHT ══════════ */}
          <div className="rs-right">

            <span className="rs-section-label">Awaiting Admin Verification</span>
            <h2 className="rs-title">
              Create <span className="outline">Seller</span> Account
            </h2>
            <span className="rs-subtitle">Post-signup admin review required</span>

            {/* Approval notice */}
            <div className="rs-notice">
              <span className="rs-notice-icon">◈</span>
              <p className="rs-notice-text">
                Your account will be reviewed by our team.
                You'll receive an email once <strong>approved to list projects</strong>.
              </p>
            </div>

            {FIELDS.map((field) => (
              <div className="rs-field" key={field.name}>
                <label className="rs-label">{field.label}</label>
                <input
                  className="rs-input"
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
              className="rs-btn"
              onClick={submit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Initializing..." : "Request Seller Access →"}
            </motion.button>

            <div className="rs-footer">
              <Link to="/login" className="rs-footer-link">
                Already a member?&nbsp;<span className="accent">Login</span>
              </Link>
              <div className="rs-switch-row">
                <div className="rs-switch-line" />
                <Link to="/register" className="rs-switch-link">Register as Buyer instead</Link>
                <div className="rs-switch-line" />
              </div>
            </div>

          </div>
        </motion.div>

        <div className="rs-watermark">© CodeVault Systems 2025</div>

      </div>
    </>
  );
}
