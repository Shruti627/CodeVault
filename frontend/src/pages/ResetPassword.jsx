import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [otp, setOtp]         = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  if (!state?.email) {
    navigate("/forgot-password");
    return null;
  }

  const reset = async () => {
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/reset-password-otp", {
        email: state.email,
        otp: otp.trim(),
        newPassword: password,
      });
      toast.success("Identity Verified. Password Updated.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="rp-root">

        {/* Ambient glows */}
        <div className="rp-glow-tr" />
        <div className="rp-glow-bl" />
        <div className="rp-glow-center" />

        <motion.div
          className="rp-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* grain */}
          <div className="rp-grain" />

          {/* Sidebar decoration — inside card as vertical text */}
          <div className="rp-side-deco">Recovery Protocol</div>

          {/* ── HEADER ── */}
          <div className="rp-header">
            <span className="rp-section-label">Verification Required</span>

            <div style={{ overflow: "hidden" }}>
              <motion.h2
                className="rp-title"
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                Reset <span className="rp-title-outline">Keys</span>
              </motion.h2>
            </div>

            <motion.p
              className="rp-sub"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Finalizing security update for:<br />
              <span className="rp-email">{state.email}</span>
            </motion.p>
          </div>

          {/* ── FIELDS ── */}
          <div className="rp-body">

            {/* OTP */}
            <div className="rp-field">
              <label className="rp-label">OTP Code</label>
              <input
                type="text"
                className="rp-input rp-otp-input"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && reset()}
                maxLength={6}
              />
            </div>

            {/* New Password */}
            <div className="rp-field">
              <label className="rp-label">New Password</label>
              <input
                type="password"
                className="rp-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && reset()}
              />
            </div>

            {/* Submit */}
            <motion.button
              className="rp-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              disabled={loading}
            >
              {loading ? "Updating Systems..." : "Re-Authorize Account →"}
            </motion.button>

          </div>

          {/* ── RESEND ── */}
          <div className="rp-footer">
            <button className="rp-resend-btn" onClick={() => navigate("/forgot-password")}>
              Didn't get the code? Resend OTP
            </button>
          </div>

        </motion.div>

        {/* Watermark */}
        <div className="rp-watermark">Recovery Protocol — Secure Layer</div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .rp-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 24px; overflow: hidden; position: relative;
  }

  /* ambient glows */
  .rp-glow-tr {
    position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .rp-glow-bl {
    position: fixed; bottom: -300px; left: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .rp-glow-center {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  /* card */
  .rp-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 480px;
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 52px 48px;
    text-align: center;
    box-shadow: 0 40px 80px rgba(0,0,0,0.65),
                inset 0 1px 0 rgba(201,168,76,0.08);
    overflow: hidden;
  }

  /* grain */
  .rp-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  /* side deco */
  .rp-side-deco {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    font-size: 8px; font-weight: 700;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(201,168,76,0.12);
    pointer-events: none; z-index: 1;
  }

  /* header */
  .rp-header {
    position: relative; z-index: 1;
    margin-bottom: 40px;
  }

  .rp-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 16px;
  }

  .rp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0 0 20px 0;
  }
  .rp-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  .rp-sub {
    font-size: 10px; font-weight: 300;
    color: #524f60; letter-spacing: 0.2em;
    text-transform: uppercase; line-height: 1.8;
  }
  .rp-email {
    color: #9994a8; text-transform: lowercase;
    font-style: italic; letter-spacing: 0.05em;
  }

  /* body */
  .rp-body {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 28px;
  }

  .rp-field { text-align: left; }

  .rp-label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #524f60; margin-bottom: 10px; transition: color 0.2s;
  }
  .rp-field:focus-within .rp-label { color: #c9a84c; }

  .rp-input {
    width: 100%;
    background: transparent;
    border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 14px 4px;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 400;
    outline: none; transition: border-color 0.2s;
    caret-color: #c9a84c;
  }
  .rp-input::placeholder { color: #524f60; }
  .rp-input:focus { border-color: rgba(201,168,76,0.5); }

  /* OTP input — wide letter spacing + bold like original */
  .rp-otp-input {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 20px; font-weight: 700;
    letter-spacing: 0.5em; text-align: center;
  }

  /* button */
  .rp-btn {
    width: 100%; padding: 17px;
    background: linear-gradient(135deg, #c9a84c 0%, #f0a030 100%);
    border: none; border-radius: 12px;
    color: #09090e;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 800;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(201,168,76,0.3);
    transition: box-shadow 0.2s, filter 0.2s;
    margin-top: 8px;
  }
  .rp-btn:hover  { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
  .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }

  /* footer */
  .rp-footer {
    position: relative; z-index: 1;
    margin-top: 32px;
  }
  .rp-resend-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: #524f60; transition: color 0.2s;
  }
  .rp-resend-btn:hover { color: #e4c97e; }

  /* watermark */
  .rp-watermark {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: rgba(255,255,255,0.05);
    white-space: nowrap; pointer-events: none; z-index: 5;
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
