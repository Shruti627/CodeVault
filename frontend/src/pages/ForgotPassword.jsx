import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
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

      <div className="fp-root">

        {/* Ambient glows */}
        <div className="fp-glow-center" />
        <div className="fp-glow-tl" />
        <div className="fp-glow-br" />

        <motion.div
          className="fp-card"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* grain */}
          <div className="fp-grain" />

          {/* Decorative corner label */}
          <div className="fp-corner-deco">P-BAZAAR Recovery</div>

          {/* ── HEADER ── */}
          <div className="fp-header">
            <span className="fp-section-label">Security Protocol</span>
            <h2 className="fp-title">
              Lost <span className="fp-title-outline">Access?</span>
            </h2>
            <p className="fp-sub">
              Initiate account recovery via verified email channel
            </p>
          </div>

          {/* ── INPUT ── */}
          <div className="fp-body">
            <div className="fp-field">
              <label className="fp-label">Registered Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="fp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>

            <motion.button
              className="fp-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Transmitting..." : "Send Recovery OTP →"}
            </motion.button>
          </div>

          {/* ── BACK ── */}
          <div className="fp-footer">
            <button className="fp-back-btn" onClick={() => navigate("/login")}>
              ← Return to Authorization
            </button>
          </div>

        </motion.div>

        {/* Footer watermark */}
        <div className="fp-watermark">System Security Layer v2.0</div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .fp-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 24px; overflow: hidden; position: relative;
  }

  /* ambient glows */
  .fp-glow-center {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .fp-glow-tl {
    position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .fp-glow-br {
    position: fixed; bottom: -300px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* card */
  .fp-card {
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

  /* grain overlay */
  .fp-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  /* corner deco */
  .fp-corner-deco {
    position: absolute; top: 16px; right: 20px;
    font-size: 8px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(201,168,76,0.15);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    pointer-events: none; z-index: 1;
  }

  /* header */
  .fp-header {
    position: relative; z-index: 1;
    margin-bottom: 40px;
  }

  .fp-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 16px;
  }

  .fp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0 0 16px 0;
  }
  .fp-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  .fp-sub {
    font-size: 11px; font-weight: 300;
    color: #524f60; letter-spacing: 0.15em;
    text-transform: uppercase; line-height: 1.7;
    max-width: 28ch; margin: 0 auto;
  }

  /* body */
  .fp-body {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 28px;
  }

  .fp-field { text-align: left; }

  .fp-label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #524f60; margin-bottom: 10px;
    transition: color 0.2s;
  }
  .fp-field:focus-within .fp-label { color: #c9a84c; }

  .fp-input {
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
  .fp-input::placeholder { color: #524f60; }
  .fp-input:focus { border-color: rgba(201,168,76,0.5); }

  /* button */
  .fp-btn {
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
  }
  .fp-btn:hover  { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
  .fp-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }

  /* footer */
  .fp-footer {
    position: relative; z-index: 1;
    margin-top: 36px; padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .fp-back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: #524f60; transition: color 0.2s;
  }
  .fp-back-btn:hover { color: #e4c97e; }

  /* watermark */
  .fp-watermark {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.8em; text-transform: uppercase;
    color: rgba(255,255,255,0.05);
    white-space: nowrap; pointer-events: none; z-index: 5;
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
