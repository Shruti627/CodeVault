/**
 * CodeVault — Landing Page
 * Fonts  : Bebas Neue (display) + Cabinet Grotesk (body) + JetBrains Mono (code)  ← UNCHANGED
 * Colors : ChatPage palette — #09090e base · #c9a84c gold · #4ecdc4 teal          ← SWAPPED
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import API from "../api/api";
import { useAuth } from "../auth/AuthContext";

// ─── Animation Variants ──────────────────────────────────────────────────────
const SPRING      = { type: "spring", stiffness: 300, damping: 30 };
const SPRING_SLOW = { type: "spring", stiffness: 120, damping: 25 };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { ...SPRING_SLOW, delay: i * 0.1 } }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Static Data ─────────────────────────────────────────────────────────────
//data
const TECH_TAGS = [
  "React", "Node.js", "Python", "MongoDB", "Spring Boot",
  "PostgreSQL", "Docker", "AWS", "Next.js", "FastAPI",
  "Redis", "AI/ML", "Microservices", "GraphQL", "Kafka",
];

const CATEGORIES = [
  { label: "E-Commerce",      icon: "🛒", count: "24 projects" },
  { label: "AI / ML",         icon: "🤖", count: "18 projects" },
  { label: "SaaS Dashboards", icon: "📊", count: "31 projects" },
  { label: "FinTech",         icon: "💳", count: "12 projects" },
  { label: "Social Platforms",icon: "👥", count: "9 projects"  },
  { label: "DevTools",        icon: "🔧", count: "15 projects" },
  { label: "Healthcare",      icon: "🏥", count: "7 projects"  },
  { label: "EdTech",          icon: "🎓", count: "11 projects" },
];

const FEATURES = [
  { num: "01", icon: "✦", title: "Admin Verified",   accent: "Architecture reviewed",
    body: "Every codebase is reviewed by senior engineers for architecture quality, security practices, and production-readiness. No templates. No shortcuts." },
  { num: "02", icon: "◈", title: "Production Ready", accent: "Deployable day one",
    body: "Complete systems. Auth flows, APIs, databases, CI/CD pipelines. Not a starter kit — a foundation you can actually build revenue on." },
  { num: "03", icon: "⟳", title: "Instant Velocity", accent: "Skip months of work",
    body: "Stop rebuilding solved problems. Start with a verified foundation and spend every engineering hour on what makes your product different." },
];

const STEPS = [
  ["01", "Register", "Buyer or seller. Two minutes. No credit card needed to browse."],
  ["02", "Browse",   "Filter by stack, domain, price. Read full technical specs and demo access."],
  ["03", "Verify",   "Live demo + codebase preview before any purchase decision."],
  ["04", "Deploy",   "Clone → configure → ship. Docs, support, and architecture notes included."],
];

const TESTIMONIALS = [
  { name: "Anvesh Samrit",  role: "Final-Year Student → Hired",  avatar: "AS",
    text: "The MERN project I bought had architecture I'd only seen at funded companies. Presented it in my interview. Got the offer." },
  { name: "Saurabh Asnare", role: "Founder, EarlyStage",         avatar: "SA",
    text: "Cut MVP build time from 3 months to 3 weeks. The code was clean enough that our first engineer didn't ask a single question about structure." },
  { name: "Gaurav Barbhai", role: "Senior Full-Stack Engineer",   avatar: "GB",
    text: "I've seen a lot of project marketplaces. This is the only one where the code doesn't embarrass you in a code review." },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useElementMouse(ref) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const fn = (e) => { const r = el.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); };
    el.addEventListener("mousemove", fn);
    return () => el.removeEventListener("mousemove", fn);
  }, [ref, x, y]);
  return { x, y };
}

function useCursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  useEffect(() => {
    const fn = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);
  return { sx, sy };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Typing terminal — teal + gold colors from ChatPage */
function CodeTerminal() {
  const lines = [
    { t: "$ git clone bazaar/saas-dashboard",  c: "#f0ede8" },
    { t: "✓  Cloning repository...",            c: "#524f60" },
    { t: "$ npm install && npm run dev",        c: "#f0ede8" },
    { t: "✓  847 packages installed  (3.2s)",  c: "#524f60" },
    { t: "✓  Auth service    :3001  RUNNING",  c: "#4ecdc4" },
    { t: "✓  API gateway     :4000  RUNNING",  c: "#4ecdc4" },
    { t: "✓  Dashboard       :3000  READY",    c: "#c9a84c" },
  ];
  const [vis, setVis] = useState(0);
  useEffect(() => {
    if (vis >= lines.length) return;
    const t = setTimeout(() => setVis((v) => v + 1), 500 + vis * 55);
    return () => clearTimeout(t);
  }, [vis, lines.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "linear-gradient(135deg, #13131e 0%, #1a1a28 100%)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 14,
        padding: "26px 30px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13, lineHeight: 2.1,
        backdropFilter: "blur(16px)",
        minWidth: 380,
        boxShadow: "0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(201,168,76,0.08)",
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
      </div>
      {lines.slice(0, vis).map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} style={{ color: l.c }}>
          {l.t}
          {i === vis - 1 && (
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity }}
              style={{ display: "inline-block", width: 8, height: 13, background: "#c9a84c", marginLeft: 4, verticalAlign: "middle", borderRadius: 1 }} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** 3D tilt card with gold cursor glow */
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const { x, y } = useElementMouse(ref);
  const [hovered, setHovered] = useState(false);
  const rotX = useSpring(useTransform(y, (v) => hovered && ref.current ? -((v / ref.current.offsetHeight) - 0.5) * 13 : 0), SPRING);
  const rotY = useSpring(useTransform(x, (v) => hovered && ref.current ? ((v / ref.current.offsetWidth) - 0.5) * 13 : 0), SPRING);
  return (
    <motion.div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...style, rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", transformPerspective: 900, position: "relative", overflow: "hidden" }}>
      {hovered && (
        <motion.div style={{ position: "absolute", pointerEvents: "none", zIndex: 0, width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)", left: x, top: y }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

/** Magnetic button */
function MagneticBtn({ children, to, btnStyle }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22 });
  const sy = useSpring(y, { stiffness: 280, damping: 22 });
  const onMove = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX-(r.left+r.width/2))*0.32); y.set((e.clientY-(r.top+r.height/2))*0.32); };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ display: "inline-block" }}>
      <motion.div style={{ x: sx, y: sy }}>
        <Link to={to} style={{ textDecoration: "none", ...btnStyle }}>{children}</Link>
      </motion.div>
    </div>
  );
}

/** Heading reveal from clip mask */
function RevealText({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div initial={{ y: "108%" }} animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1], delay }} style={style}>
        {children}
      </motion.div>
    </div>
  );
}

/** Count-up on scroll */
function Counter({ to, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let cur = 0; const step = Math.max(1, Math.ceil(to / 38));
    const id = setInterval(() => { cur = Math.min(cur + step, to); setVal(cur); if (cur >= to) clearInterval(id); }, 28);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const { sx: glowX, sy: glowY } = useCursorGlow();
  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();

  // BG image parallaxes — text does NOT fade
  const heroImgY = useTransform(scrollY, [0, 700], [0, 180]);

  useEffect(() => {
    API.get("/projects").then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  // ── ChatPage color tokens ──────────────────────────────────────────────────
  const T = {
    bgBase:    "#09090e",   // was #080808
    bgCard:    "#13131e",   // was #111111
    bgOverlay: "#1a1a28",   // new purple-navy surface
    gold:      "#c9a84c",   // main accent  (was #E8341C red)
    goldLt:    "#e4c97e",   // light accent (was #F0EDE8 cream)
    amber:     "#f0a030",   // warm accent
    teal:      "#4ecdc4",   // secondary accent
    textPri:   "#f0ede8",   // primary text (same as old cream — unchanged)
    textSec:   "#9994a8",   // secondary text
    textMuted: "#524f60",   // muted text
    borderSub: "rgba(255,255,255,0.06)",
    borderMid: "rgba(255,255,255,0.10)",
  };

  // ── Style shortcuts — FONTS UNCHANGED, only colors swapped ────────────────
  const S = {
    sectionLabel: {
      fontSize: 10, letterSpacing: "0.42em",
      textTransform: "uppercase", color: T.gold, fontWeight: 600,
      fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif",
    },
    h2: {
      fontFamily: "'Bebas Neue', sans-serif",          // ← kept
      fontSize: "clamp(3.2rem, 6vw, 5.2rem)",
      letterSpacing: "0.01em", lineHeight: 0.93, color: T.textPri,
    },
    h2Outline: {
      fontFamily: "'Bebas Neue', sans-serif",          // ← kept
      fontSize: "clamp(3.2rem, 6vw, 5.2rem)",
      letterSpacing: "0.01em", lineHeight: 0.93,
      color: "transparent", WebkitTextStroke: "1px rgba(240,237,232,0.22)",
    },
    body: {
      fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif",  // ← kept
      fontSize: "0.88rem", color: T.textSec, lineHeight: 1.8, fontWeight: 400,
    },
    cardBase: {
      background: T.bgCard,
      border: `1px solid ${T.borderSub}`,
      borderRadius: 12,
    },
    btnPrimary: {
      background: `linear-gradient(135deg, ${T.gold} 0%, ${T.amber} 100%)`,
      color: T.bgBase,
      padding: "14px 32px", fontWeight: 700,
      fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif",
      fontSize: 12, letterSpacing: "0.1em",
      textTransform: "uppercase", borderRadius: 8,
      display: "inline-block",
      boxShadow: "0 4px 20px rgba(201,168,76,0.28)",
    },
    btnGhost: {
      border: "1px solid rgba(201,168,76,0.28)", color: T.goldLt,
      padding: "13px 28px", fontWeight: 600,
      fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif",
      fontSize: 12, letterSpacing: "0.1em",
      textTransform: "uppercase", borderRadius: 8,
      display: "inline-block",
    },
  };

  return (
    <div style={{ background: T.bgBase, color: T.textPri, fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── Fonts + Global CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        ::selection { background: #c9a84c; color: #09090e; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a28; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #524f60; }

        @keyframes marquee-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mtrack  { animation: marquee-l 30s linear infinite; }
        .mtrack2 { animation: marquee-l 22s linear infinite reverse; }

        .grain { position: relative; }
        .grain::after {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");
          background-repeat: repeat; pointer-events: none; z-index: 5;
        }

        .dotgrid {
          background-image: radial-gradient(circle, rgba(201,168,76,0.055) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Gold shimmer — badge */
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .badge-shimmer {
          background: linear-gradient(90deg, #c9a84c 0%, #e4c97e 45%, #c9a84c 65%, #f0a030 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 2.8s linear infinite;
        }

        /* Gold card glow on hover */
        .glowcard { transition: border-color 0.3s, box-shadow 0.3s; }
        .glowcard:hover {
          border-color: rgba(201,168,76,0.28) !important;
          box-shadow: 0 0 28px rgba(201,168,76,0.07), 0 28px 56px rgba(0,0,0,0.55);
        }

        .ulink { position: relative; text-decoration: none; }
        .ulink::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.35s cubic-bezier(0.76,0,0.24,1); }
        .ulink:hover::after { transform: scaleX(1); transform-origin: left; }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }

        .cat-chip { transition: border-color 0.2s, background 0.2s, transform 0.2s; cursor: default; }
        .cat-chip:hover { border-color: rgba(201,168,76,0.35) !important; background: rgba(201,168,76,0.07) !important; transform: translateY(-2px); }
      `}} />

      {/* Ambient glows — ChatPage style */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 700, height: 700, background: "radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -300, left: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Cursor glow */}
      <motion.div style={{
        position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1,
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 72%)",
        x: useTransform(glowX, (v) => v - 240),
        y: useTransform(glowY, (v) => v - 240),
      }} />

      {/* Scroll progress — gold gradient */}
      <motion.div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${T.gold}, ${T.amber})`,
        scaleX: scrollYProgress, transformOrigin: "left", zIndex: 1000,
      }} />

      {/* ════════════════════════════ HERO ════════════════════════════ */}
      <section className="grain dotgrid" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 120, paddingBottom: 100, zIndex: 2 }}>

        {/* BG parallax — text is NOT wrapped in this, so text stays visible */}
        <motion.div style={{ y: heroImgY, position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=2000&q=80"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.055, filter: "grayscale(1) contrast(1.25)" }} alt="" />
        </motion.div>

        {/* Gold + teal gradient overlays — ChatPage ambient feel */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 70% at 72% 50%, rgba(201,168,76,0.07) 0%, transparent 68%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 15% 70%, rgba(78,205,196,0.04) 0%, transparent 65%)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: `linear-gradient(to bottom, transparent, ${T.bgBase})`, zIndex: 2 }} />

        {/* Content grid — no opacity transform so text stays visible */}
        <div style={{ position: "relative", zIndex: 3, maxWidth: 1200, margin: "0 auto", padding: "0 48px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center" }}>
          <div>
            {/* Status pill */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 12px #22C55E" }} />
              <span style={{ ...S.sectionLabel, color: T.textMuted }}>Verified Developer Marketplace</span>
            </motion.div>

            {/* Headline — Bebas Neue, UNCHANGED font */}
            {[
              { text: "Production",  color: T.textPri, delay: 0.08 },
              { text: "Grade Code.", outline: true,    delay: 0.18 },
              { text: "Verified.",   color: T.goldLt,  delay: 0.28 },  // was red, now light gold
            ].map(({ text, color, outline, delay }) => (
              <div key={text} style={{ overflow: "hidden" }}>
                <motion.h1 initial={{ y: "108%" }} animate={{ y: "0%" }} transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay }}
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4.5rem, 11vw, 10rem)", lineHeight: 0.88, letterSpacing: "0.01em", margin: 0,
                    color: outline ? "transparent" : color,
                    WebkitTextStroke: outline ? "1px rgba(240,237,232,0.3)" : undefined }}>
                  {text}
                </motion.h1>
              </div>
            ))}

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.65 }}
              style={{ maxWidth: "48ch", ...S.body, fontSize: "1.02rem", color: T.textSec, marginTop: 28, marginBottom: 44 }}>
              Buy and sell production-ready projects — MERN, AI/ML, microservices, and beyond.
              Every codebase reviewed by senior engineers before it reaches the marketplace.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.88 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <MagneticBtn to="/projects" btnStyle={S.btnPrimary}>Browse Projects →</MagneticBtn>
              {!user && <MagneticBtn to="/register-seller" btnStyle={S.btnGhost}>Sell Your Code</MagneticBtn>}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              style={{ display: "flex", gap: 44, marginTop: 60, paddingTop: 44, borderTop: `1px solid ${T.borderSub}`, flexWrap: "wrap" }}>
              {[[120,"+","","Verified Projects"],[40,"+","","Active Sellers"],[3,"×","","Faster to Market"],[48,"","hr","Avg. Deploy"]].map(([n, pre, suf, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", letterSpacing: "0.02em", lineHeight: 1,
                    background: `linear-gradient(135deg, ${T.goldLt}, ${T.amber})`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    <Counter to={n} prefix={pre} suffix={suf} />
                  </div>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginTop: 7 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Terminal */}
          <div style={{ flexShrink: 0 }}><CodeTerminal /></div>
        </div>
      </section>

      {/* ── Tech Marquee ── */}
      <div style={{ borderTop: `1px solid ${T.borderSub}`, borderBottom: `1px solid ${T.borderSub}`, padding: "16px 0", overflow: "hidden", background: "#0e0e16", position: "relative", zIndex: 2 }}>
        <div className="mtrack" style={{ display: "flex", gap: 52, whiteSpace: "nowrap", fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.42em", textTransform: "uppercase", color: T.textMuted }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 52, alignItems: "center" }}>
              {TECH_TAGS.map((t, j) => (
                <span key={j} style={{ cursor: "default", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = T.goldLt}
                  onMouseLeave={e => e.target.style.color = T.textMuted}>{t}</span>
              ))}
              <span style={{ color: T.gold, opacity: 0.4 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ MANIFESTO ════════════ */}
<section
  style={{
    padding: "110px 56px",
    background: T.bgOverlay, // unchanged
    position: "relative",
    overflow: "hidden",
    zIndex: 2,
  }}
>

  {/* Right Side Premium Fill */}
<div
  style={{
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "40%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {/* Grid Pattern */}
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      maskImage: "linear-gradient(to left, transparent, black 40%)",
      WebkitMaskImage: "linear-gradient(to left, transparent, black 40%)",
    }}
  />

  {/* Vertical Gradient Accent Line */}
  <div
    style={{
      position: "absolute",
      right: "20%",
      height: "60%",
      width: 1,
      background: `linear-gradient(${T.gold}, ${T.teal}, transparent)`,
      opacity: 0.4,
      filter: "blur(0.5px)",
    }}
  />

  {/* Soft Glow Orb */}
  <div
    style={{
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${T.teal}22, transparent 70%)`,
      filter: "blur(60px)",
      animation: "floatSlow 12s ease-in-out infinite",
    }}
  />
</div>
  <div
    style={{
      maxWidth: 1100,
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    }}
  >
    {/* Top Label */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          height: 1,
          width: 56,
          background: `linear-gradient(90deg, ${T.gold}, transparent)`,
        }}
      />
      <span
        style={{
          ...S.sectionLabel,
          color: T.textMuted,
          letterSpacing: "0.18em",
          fontSize: "0.75rem",
        }}
      >
        CodeVault PRINCIPLE
      </span>
    </motion.div>

    {/* Headline */}
    <RevealText
      delay={0}
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
        letterSpacing: "0.025em",
        color: T.textPri,
        lineHeight: 1.15,
        maxWidth: "25ch",
      }}
    >
      The best engineers don't start from zero —
    </RevealText>

    <RevealText
      delay={0.12}
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
        letterSpacing: "0.025em",
        lineHeight: 1.15,
        background: `linear-gradient(90deg, ${T.gold}, ${T.teal})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      they start from verified.
    </RevealText>

    {/* Subtle Divider */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        marginTop: 36,
        width: 80,
        height: 1,
        background: `linear-gradient(90deg, ${T.gold}, ${T.teal}, transparent)`,
        opacity: 0.6,
      }}
    />

    {/* Premium Description Block */}
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        marginTop: 28,
        maxWidth: 640,
        color: T.textMuted,
        fontSize: "1.05rem",
        lineHeight: 1.7,
        letterSpacing: "0.01em",
      }}
    >
      Every system we build is grounded in validated logic, proven
      architectures, and real execution data. Innovation is not randomness —
      it’s precision, refinement, and leveraging what already works at scale.
    </motion.p>

    {/* Bottom Signature Line */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 42,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: T.teal,
          boxShadow: `0 0 12px ${T.teal}`,
        }}
      />
      <span
        style={{
          color: T.textMuted,
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
        }}
      >
        VERIFIED SYSTEM DESIGN • ZERO GUESSWORK
      </span>
    </motion.div>
  </div>
</section>

      <div className="divider" />

      {/* ════════════ FEATURES ════════════ */}
   <section
  style={{
    padding: "140px 0",
    background: "#0d0d14",
    position: "relative",
    zIndex: 2,
  }}
>
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
    
    {/* Heading */}
    <div style={{ marginBottom: 90 }}>
      <RevealText style={S.sectionLabel}>Why CodeVault</RevealText>
      <RevealText delay={0.08} style={S.h2}>Code That Ships,</RevealText>
      <RevealText delay={0.17} style={S.h2Outline}>
        Not Code That Sits.
      </RevealText>
    </div>

    {/* GRID */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 28,
      }}
    >
      {[
        {
          num: "01",
          icon: "⚡",
          title: "AI Engineering Assistant",
          body: "Analyze, validate, and optimize projects instantly with built-in AI guidance.",
          accent: "AI POWERED",
          color: T.teal,
        },
        ...FEATURES,
      ].slice(0, 4).map(({ num, icon, title, body, accent, color = T.gold }, i) => (
        <motion.div
          key={num}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          whileHover={{ y: -8 }}
          style={{
            position: "relative",
            borderRadius: 18,
            padding: "36px 30px",
            background: "linear-gradient(180deg, #12121a 0%, #0e0e15 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          {/* subtle inner glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 80% 0%, ${color}18, transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          {/* corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 60,
              height: 60,
              background: `radial-gradient(circle at top left, ${color}33, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* TOP */}
          <div>
            {/* icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                fontSize: "1.1rem",
              }}
            >
              {icon}
            </div>

            {/* accent */}
            <span
              style={{
                ...S.sectionLabel,
                fontSize: "0.7rem",
                color: T.textMuted,
                display: "block",
                marginBottom: 10,
                letterSpacing: "0.12em",
              }}
            >
              {accent}
            </span>

            {/* title */}
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: T.textPri,
                marginBottom: 12,
              }}
            >
              {title}
            </h3>

            {/* divider */}
            <div
              style={{
                width: 32,
                height: 2,
                background: color,
                opacity: 0.7,
                marginBottom: 14,
              }}
            />

            {/* body */}
            <p style={{ ...S.body, lineHeight: 1.7 }}>{body}</p>
          </div>

          {/* BOTTOM */}
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* tiny detail */}
            <div
              style={{
                height: 1,
                flex: 1,
                background: `linear-gradient(90deg, ${color}, transparent)`,
                opacity: 0.3,
              }}
            />

            {/* ghost number */}
            <span
              style={{
                fontSize: "3.2rem",
                opacity: 0.05,
                fontFamily: "'Bebas Neue', sans-serif",
                marginLeft: 10,
              }}
            >
              {num}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <div className="divider" />

      {/* ════════════ STATS TICKER ════════════ */}
<section
  style={{
    padding: "100px 0",
    background: T.bgBase,
    position: "relative",
    overflow: "hidden",
    zIndex: 2,
  }}
>
  {/* Ambient Glow */}
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: 900,
      height: 350,
      background:
        "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
      pointerEvents: "none",
    }}
  />

  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 48px",
      position: "relative",
      zIndex: 1,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 28, // 👉 THIS is the key (spacing)
      }}
    >
      {[
        { val: 120, suf: "+", label: "Codebases verified", color: T.gold },
        { val: 40, suf: "+", label: "Trusted sellers", color: T.teal },
        { val: 98, suf: "%", label: "Deployment success", color: T.goldLt },
        { val: 3, suf: "×", label: "Faster time-to-market", color: T.amber },
      ].map(({ val, suf, label, color }, i) => (
        <motion.div
          key={label}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          whileHover={{ y: -10, scale: 1.02 }}
          style={{
            position: "relative",
            borderRadius: 18,
            padding: "34px 28px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Glow Behind */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              background: `radial-gradient(circle at 80% 20%, ${color}22, transparent 60%)`,
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />

          {/* Top Accent Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 2,
              borderRadius: "18px 18px 0 0",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: 0.6,
            }}
          />

          {/* Label */}
          <div
            style={{
              ...S.sectionLabel,
              color: T.textMuted,
              letterSpacing: "0.12em",
              fontSize: "0.75rem",
            }}
          >
            {label}
          </div>

          {/* Value */}
          <div
            style={{
              marginTop: 14,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "3.2rem",
              letterSpacing: "0.02em",
              lineHeight: 1,
              background: `linear-gradient(135deg, ${color}, ${T.textSec})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <Counter to={val} suffix={suf} />
          </div>

          {/* Bottom Accent */}
          <div
            style={{
              marginTop: 20,
              width: 36,
              height: 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, transparent)`,
              opacity: 0.7,
            }}
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>
      <div className="divider" />

      {/* ════════════ WORKFLOW ════════════ */}
   <section
  style={{
    padding: "110px 0",
    background: "#0d0d14",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* ambient glow */}
  <div
    style={{
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 900,
      height: 320,
      background:
        "radial-gradient(ellipse, rgba(201,168,76,0.06), transparent 70%)",
      pointerEvents: "none",
    }}
  />

  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 48px",
      position: "relative",
      zIndex: 1,
    }}
  >
    {/* HEADER */}
    <div style={{ marginBottom: 60 }}>
      <RevealText style={S.sectionLabel}>How It Works</RevealText>
      <RevealText delay={0.08} style={S.h2}>Four Steps.</RevealText>
      <RevealText delay={0.17} style={S.h2Outline}>
        Zero Friction.
      </RevealText>

      {/* 🔥 HERO STATEMENT */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ marginTop: 24 }}
      >
        <p
          style={{
            fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)",
            lineHeight: 1.5,
            maxWidth: "46ch",
            color: T.textMuted,
          }}
        >
          Built for developers who value{" "}
          <span style={{ color: T.textPri, fontWeight: 600 }}>
            speed
          </span>.
        </p>

        <p
          style={{
            fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
            lineHeight: 1.35,
            maxWidth: "40ch",
            marginTop: 6,
            background: `linear-gradient(90deg, ${T.gold}, ${T.teal})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}
        >
          No wasted time. No broken repos — just execution.
        </p>

        {/* underline accent */}
        <div
          style={{
            marginTop: 18,
            width: 100,
            height: 2,
            background: `linear-gradient(90deg, ${T.gold}, transparent)`,
          }}
        />
      </motion.div>
    </div>

    {/* GRID */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 28,
      }}
    >
      {STEPS.map(([num, title, desc], i) => (
        <motion.div
          key={num}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          whileHover={{ y: -8, scale: 1.01 }}
          style={{
            position: "relative",
            padding: "32px 28px",
            borderRadius: 18,
            background: "linear-gradient(180deg, #13131c 0%, #0e0e15 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            minHeight: 200,
            overflow: "hidden",
          }}
        >
          {/* corner light */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 70,
              height: 70,
              background: `radial-gradient(circle at top left, ${T.gold}33, transparent 70%)`,
            }}
          />

          {/* top accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 2,
              background: `linear-gradient(90deg, ${T.gold}, transparent)`,
            }}
          />

          {/* inner glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 80% 20%, ${T.gold}18, transparent 60%)`,
            }}
          />

          {/* top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                color: T.textMuted,
              }}
            >
              STEP {num}
            </span>

            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.gold,
                boxShadow: `0 0 8px ${T.gold}`,
              }}
            />
          </div>

          {/* title */}
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: T.textPri,
              marginBottom: 10,
            }}
          >
            {title}
          </h3>

          {/* divider */}
          <div
            style={{
              width: 32,
              height: 2,
              background: T.gold,
              marginBottom: 12,
            }}
          />

          {/* desc */}
          <p style={{ ...S.body, lineHeight: 1.65 }}>{desc}</p>

          {/* bottom subtle line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 1,
              background: `linear-gradient(90deg, ${T.gold}, transparent)`,
              opacity: 0.2,
            }}
          />

          {/* ghost number */}
          <span
            style={{
              position: "absolute",
              bottom: 12,
              right: 16,
              fontSize: "3.2rem",
              opacity: 0.05,
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            {num}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <div className="divider" />

      {/* ════════════ CATEGORY CHIPS ════════════ */}
      <section style={{ padding: "64px 0", background: T.bgBase, overflow: "hidden", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 12 }}>
          <div className="mtrack" style={{ display: "flex", gap: 12, whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", gap: 12 }}>
                {CATEGORIES.map((c, j) => (
                  <div key={j} className="cat-chip" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: T.bgCard, border: `1px solid ${T.borderSub}`, borderRadius: 100, padding: "12px 22px", flexShrink: 0 }}>
                    <span style={{ fontSize: "1rem" }}>{c.icon}</span>
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: T.textPri }}>{c.label}</span>
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.textMuted }}>{c.count}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mtrack2" style={{ display: "flex", gap: 12, whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", gap: 12 }}>
                {[...CATEGORIES].reverse().map((c, j) => (
                  <div key={j} className="cat-chip" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 100, padding: "12px 22px", flexShrink: 0 }}>
                    <span style={{ fontSize: "1rem" }}>{c.icon}</span>
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: T.textSec }}>{c.label}</span>
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, color: T.textMuted }}>{c.count}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ════════════ PROJECT CARDS ════════════ */}
      <section style={{ padding: "140px 0", background: "#0d0d14", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
            <div>
              <RevealText style={S.sectionLabel}>Marketplace</RevealText>
              <RevealText delay={0.08} style={S.h2}>Featured</RevealText>
              <RevealText delay={0.17} style={S.h2Outline}>Projects.</RevealText>
            </div>
            <Link to="/projects" className="ulink" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.goldLt }}>
              View Full Catalog →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {projects.slice(0, 6).map((p, i) => (
              <motion.div key={p._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-5%" }} custom={i}>
                <TiltCard style={{ ...S.cardBase, padding: "36px 32px", cursor: "pointer", willChange: "transform" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <span className="badge-shimmer" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", background: "rgba(201,168,76,0.1)", padding: "5px 12px", borderRadius: 20, border: "1px solid rgba(201,168,76,0.2)" }}>
                      ✓ Verified
                    </span>
                    <motion.div animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                      style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px #22C55E", marginTop: 3 }} />
                  </div>
                  <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "1.08rem", fontWeight: 800, color: T.textPri, marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.28 }}>{p.title}</h3>
                  <p style={{ ...S.body, marginBottom: 32, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.borderSub}`, paddingTop: 20 }}>
                    <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 + 0.3 }}
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.02em",
                        background: `linear-gradient(135deg, ${T.goldLt}, ${T.amber})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      ₹{p.price.toLocaleString()}
                    </motion.span>
                    <motion.div whileHover={{ scale: 1.12, background: `linear-gradient(135deg, ${T.gold}, ${T.amber})`, borderColor: T.gold }}
                      style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid rgba(201,168,76,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: T.goldLt, cursor: "pointer", transition: "background 0.22s, border-color 0.22s" }}>
                      →
                    </motion.div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ════════════ TESTIMONIALS ════════════ */}
  <section
  style={{
    padding: "160px 0",
    background: T.bgBase,
    position: "relative",
    overflow: "hidden",
    zIndex: 2,
  }}
>
  {/* 🔥 GLOW ORBS */}
  <div style={{
    position: "absolute",
    width: 500,
    height: 500,
    background: `${T.gold}15`,
    filter: "blur(120px)",
    top: -100,
    left: -100,
    borderRadius: "50%",
  }} />
  <div style={{
    position: "absolute",
    width: 400,
    height: 400,
    background: `${T.amber}10`,
    filter: "blur(140px)",
    bottom: -120,
    right: -80,
    borderRadius: "50%",
  }} />

  {/* BIG QUOTE */}
  <div style={{
    position: "absolute",
    top: "50%",
    right: -60,
    transform: "translateY(-50%)",
    fontFamily: "'Bebas Neue'",
    fontSize: "38vw",
    color: "rgba(201,168,76,0.02)",
    pointerEvents: "none",
  }}>
    "
  </div>

  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative" }}>
    
    {/* HEADER */}
    <div style={{ marginBottom: 70 }}>
      <RevealText style={S.sectionLabel}>Social Proof</RevealText>
      <RevealText delay={0.08} style={S.h2}>Trusted By</RevealText>
      <RevealText delay={0.17} style={S.h2Outline}>Real Builders.</RevealText>

      {/* 🔥 SLOGANS STRIP */}
      <div style={{
        marginTop: 18,
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
      }}>
        {[
          "🚀 Ship faster",
          "⚡ Production-ready code",
          "💼 Built by real founders",
          "🧠 Save 100+ dev hours",
        ].map((s, i) => (
          <div key={i}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: T.textSec,
              letterSpacing: "0.05em",
            }}>
            {s}
          </div>
        ))}
      </div>
    </div>

    {/* 🔥 TRUST METRICS */}
    <div style={{
      display: "flex",
      gap: 40,
      marginBottom: 60,
      flexWrap: "wrap",
    }}>
      {[
        { label: "Projects Sold", value: "1,200+" },
        { label: "Avg. Rating", value: "4.9★" },
        { label: "Developers", value: "850+" },
      ].map((m, i) => (
        <div key={i}>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: T.textPri,
          }}>
            {m.value}
          </div>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: T.textSec,
            marginTop: 4,
          }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>

    {/* GRID */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 22,
    }}>
      {TESTIMONIALS.map((t, i) => (
        <motion.div
          key={t.name}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          whileHover={{ y: -8, scale: 1.015 }}
        >
          <div style={{
            position: "relative",
            padding: "40px 30px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
            overflow: "hidden",
            transition: "all 0.35s ease",
          }}>

            {/* HOVER GLOW */}
            <div className="card-glow" style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 20% 20%, ${T.gold}22, transparent 60%)`,
              opacity: 0,
              transition: "0.4s",
            }} />

            {/* STARS */}
            <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
              {[...Array(5)].map((_, j) => (
                <span key={j} style={{ color: T.gold, fontSize: 12 }}>★</span>
              ))}
            </div>

            {/* TEXT */}
            <p style={{
              fontSize: "0.95rem",
              color: T.textSec,
              fontStyle: "italic",
              lineHeight: 1.7,
              marginBottom: 32,
            }}>
              “{t.text}”
            </p>

            {/* USER */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderTop: `1px solid ${T.borderSub}`,
              paddingTop: 22,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.gold}40, ${T.gold}10)`,
                border: `1px solid ${T.gold}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
                color: T.gold,
              }}>
                {t.avatar}
              </div>

              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textPri }}>
                  {t.name}
                </div>
                <div style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: T.textSec,
                  marginTop: 4,
                }}>
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  {/* 🔥 HOVER EFFECT */}
  <style>{`
    .card-glow:hover {
      opacity: 1 !important;
    }
  `}</style>
</section>

      <div className="divider" />

      {/* ════════════ SELLER CTA ════════════ */}
      {!user && (
        <section className="grain" style={{ padding: "160px 0", background: "#0d0d14", position: "relative", overflow: "hidden", zIndex: 2 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 68%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -200, left: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(78,205,196,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: "15vw", color: "rgba(201,168,76,0.025)", lineHeight: 1, pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none" }}>
            BUILD · EARN · DEPLOY ·
          </div>

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div style={{ overflow: "hidden", marginBottom: 8 }}>
                <motion.span variants={{ hidden: { y: "108%" }, visible: { y: "0%", transition: { duration: 0.88, ease: [0.76,0,0.24,1] } } }}
                  style={{ display: "block", ...S.sectionLabel }}>For Developers</motion.span>
              </div>
              {["Monetize", "Your Craft."].map((line, i) => (
                <div key={line} style={{ overflow: "hidden" }}>
                  <motion.h2
                    variants={{ hidden: { y: "108%" }, visible: { y: "0%", transition: { duration: 0.95, ease: [0.76,0,0.24,1], delay: i * 0.13 } } }}
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 9.5vw, 9.5rem)", lineHeight: 0.87, letterSpacing: "0.01em",
                      ...(i === 0
                        ? { background: `linear-gradient(135deg, ${T.textPri}, ${T.textSec})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                        : { color: "transparent", WebkitTextStroke: `1.5px rgba(201,168,76,0.4)` }) }}>
                    {line}
                  </motion.h2>
                </div>
              ))}
              <motion.p variants={fadeUp} custom={2}
                style={{ maxWidth: "44ch", ...S.body, fontSize: "1rem", color: T.textSec, marginTop: 32, marginBottom: 52 }}>
                Your side-project is someone else's foundation. List it once, earn passively, and help the developer community ship faster — without lifting another finger.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <MagneticBtn to="/register-seller" btnStyle={S.btnPrimary}>Start Selling Today →</MagneticBtn>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
  <footer
  style={{
    position: "relative",
    padding: "80px 48px 40px",
    background: T.bgBase,
    borderTop: `1px solid ${T.borderSub}`,
    overflow: "hidden",
    zIndex: 2,
  }}
>
  {/* 🔥 BACKGROUND GLOW */}
  <div
    style={{
      position: "absolute",
      width: 400,
      height: 400,
      background: `${T.gold}10`,
      filter: "blur(120px)",
      top: -120,
      right: -120,
      borderRadius: "50%",
    }}
  />

  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      position: "relative",
    }}
  >
    {/* TOP SECTION */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 40,
        marginBottom: 60,
      }}
    >
      {/* BRAND */}
      <div>
        <div
          style={{
            fontFamily: "'Bebas Neue'",
            fontSize: "2rem",
            letterSpacing: "0.05em",
            color: T.textPri,
          }}
        >
          CodeVault
        </div>

        <p
          style={{
            marginTop: 12,
            color: T.textSec,
            maxWidth: "36ch",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          Premium marketplace for production-ready codebases. Built for developers who ship fast.
        </p>

        {/* 🔥 SLOGANS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 18,
          }}
        >
          {["⚡ Ship faster", "🧠 Save dev time", "🚀 Scale instantly"].map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: T.textSec,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCT LINKS */}
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          Product
        </div>

        {["Marketplace", "Featured", "Pricing"].map((link, i) => (
          <div
            key={i}
            style={{
              fontSize: "0.9rem",
              color: T.textSec,
              marginBottom: 8,
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = T.textSec)}
          >
            {link}
          </div>
        ))}
      </div>

      {/* COMPANY LINKS */}
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: T.textMuted,
            marginBottom: 12,
          }}
        >
          Company
        </div>

        {["About", "Contact", "Privacy"].map((link, i) => (
          <div
            key={i}
            style={{
              fontSize: "0.9rem",
              color: T.textSec,
              marginBottom: 8,
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = T.textSec)}
          >
            {link}
          </div>
        ))}
      </div>
    </div>

    {/* DIVIDER */}
    <div
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${T.borderSub}, transparent)`,
        marginBottom: 20,
      }}
    />

    {/* BOTTOM */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: T.textMuted,
          fontWeight: 600,
        }}
      >
        © {new Date().getFullYear()} CodeVault
      </span>

      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 600,
          background: `linear-gradient(90deg, ${T.gold}, ${T.amber})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Built for Engineers • Trusted by Builders
      </span>
    </div>
  </div>
</footer>
    </div>
  );
}
