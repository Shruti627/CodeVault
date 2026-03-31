import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

export default function UploadProject() {

  const techOptions = [
    "React", "Node.js", "MongoDB", "Express", "Next.js", "TypeScript",
    "Java", "Spring Boot", "Python", "Django", "Flask", "PostgreSQL",
    "AWS", "Docker", "Kubernetes", "Tailwind CSS", "Redux", "GraphQL",
    "Firebase", "Machine Learning", "Deep Learning", "FastAPI", "Socket.io"
  ].sort();

  const [form, setForm] = useState({
    title: "", description: "", techStack: [], price: "", githubRepo: "", demoLink: "",
  });
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTechSelect = (e) => {
    const selected = e.target.value;
    if (selected && !form.techStack.includes(selected))
      setForm({ ...form, techStack: [...form.techStack, selected] });
  };

  const removeTech = (techToRemove) =>
    setForm({ ...form, techStack: form.techStack.filter((t) => t !== techToRemove) });

  const validate = () => {
    if (!form.title || !form.description || form.techStack.length === 0 || !form.price)
      return "Critical fields missing: Title, Description, Tech Stack, and Price.";
    if (isNaN(form.price)) return "Price must be a numerical value.";
    if (!file) return "Source code ZIP file is required.";
    return "";
  };

  const submit = async () => {
    const error = validate();
    if (error) { toast.error(error); return; }

    const formData = new FormData();
    formData.append("title",       form.title);
    formData.append("description", form.description);
    formData.append("price",       form.price);
    formData.append("githubRepo",  form.githubRepo);
    formData.append("demoLink",    form.demoLink);
    formData.append("sourceCodeZip", file);
    form.techStack.forEach((tech) => formData.append("techStack[]", tech));

    try {
      setLoading(true);
      await API.post("/projects", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Build submitted. Admin review initialized.");
      setForm({ title: "", description: "", techStack: [], price: "", githubRepo: "", demoLink: "" });
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS_ROW1 = [
    { label: "Project Title",   name: "title",     type: "text", placeholder: "e.g. Neo-Commerce Platform" },
    { label: "Valuation (₹)",  name: "price",     type: "text", placeholder: "9999" },
  ];
  const FIELDS_ROW2 = [
    { label: "Repository Link", name: "githubRepo", type: "text", placeholder: "github.com/..." },
    { label: "Demo Link",       name: "demoLink",   type: "text", placeholder: "https://demo.example.com" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="up-root">

        {/* Ambient glows */}
        <div className="up-glow-tl" />
        <div className="up-glow-br" />

        <motion.div
          className="up-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* grain overlay */}
          <div className="up-grain" />

          {/* ── HEADER ── */}
          <div className="up-header">
            <div>
              <span className="up-section-label">Project Deployment</span>
              <h2 className="up-title">
                Upload <span className="up-title-outline">Masterpiece</span>
              </h2>
            </div>
            {/* right side decoration */}
            <div className="up-header-deco">
              <span className="up-header-deco-icon">◈</span>
              <span className="up-header-deco-text">Seller Upload Portal</span>
            </div>
          </div>

          {/* ── FORM GRID ── */}
          <div className="up-grid">

            {/* Row 1: title + price */}
            {FIELDS_ROW1.map((f) => (
              <div className="up-field" key={f.name}>
                <label className="up-label">{f.label}</label>
                <input
                  className="up-input"
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Tech Stack — full width */}
            <div className="up-field up-col-span-2">
              <label className="up-label">Core Technologies</label>
              <select className="up-select" onChange={handleTechSelect} value="">
                <option value="">Select Technologies...</option>
                {techOptions.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>

              {/* Selected chips */}
              <div className="up-chips">
                <AnimatePresence>
                  {form.techStack.map((tech) => (
                    <motion.span
                      key={tech}
                      className="up-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {tech}
                      <button className="up-chip-remove" onClick={() => removeTech(tech)}>×</button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                {form.techStack.length === 0 && (
                  <span className="up-chips-empty">No technologies selected yet</span>
                )}
              </div>
            </div>

            {/* Description — full width */}
            <div className="up-field up-col-span-2">
              <label className="up-label">Technical Overview</label>
              <textarea
                className="up-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the architecture, key features, and tech decisions..."
              />
            </div>

            {/* File upload */}
            <div className="up-field">
              <label className="up-label">Source Code (ZIP)</label>
              <div className="up-file-wrap">
                <label className="up-file-label">
                  <input
                    type="file"
                    accept=".zip"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <span className="up-file-btn">Choose File</span>
                  <span className="up-file-name">
                    {file ? file.name : "No file chosen"}
                  </span>
                </label>
                {file && (
                  <motion.div
                    className="up-file-confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ {(file.size / 1024 / 1024).toFixed(2)} MB ready
                  </motion.div>
                )}
              </div>
            </div>

            {/* GitHub / Demo row */}
            {FIELDS_ROW2.map((f) => (
              <div className="up-field" key={f.name} style={f.name === "demoLink" ? { gridColumn: "2 / 3" } : {}}>
                <label className="up-label">{f.label}</label>
                <input
                  className="up-input"
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

          </div>

          {/* ── SUBMIT ── */}
          <motion.button
            className="up-btn"
            onClick={submit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Transmitting Build..." : "Initialize Upload →"}
          </motion.button>

          {/* Footer meta */}
          <div className="up-meta">
            <span>Storage: CodeVault Cloud</span>
            <span>Security: Verified Code Protocol</span>
          </div>

        </motion.div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

  .up-root {
    min-height: 100vh;
    background: #09090e;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 100px 24px 48px;
    position: relative; overflow: hidden;
  }

  /* ambient glows */
  .up-glow-tl {
    position: fixed; top: -200px; left: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .up-glow-br {
    position: fixed; bottom: -300px; right: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.03) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* card */
  .up-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 860px;
    background: linear-gradient(135deg, #13131e 0%, #1a1a28 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 52px 48px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(201,168,76,0.08);
    overflow: hidden;
  }

  /* grain */
  .up-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 20;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  /* header */
  .up-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    margin-bottom: 44px; padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .up-section-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 10px;
  }

  .up-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    line-height: 0.9; letter-spacing: 0.01em;
    color: #f0ede8; margin: 0;
  }
  .up-title-outline {
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,237,232,0.28);
  }

  .up-header-deco {
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  }
  .up-header-deco-icon {
    font-size: 1.5rem; color: rgba(201,168,76,0.35);
  }
  .up-header-deco-text {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase; color: #524f60;
  }

  /* grid */
  .up-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px 40px;
  }
  @media (max-width: 640px) { .up-grid { grid-template-columns: 1fr; } }

  .up-col-span-2 { grid-column: 1 / -1; }

  /* field */
  .up-field {}
  .up-label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #524f60; margin-bottom: 10px; transition: color 0.2s;
  }
  .up-field:focus-within .up-label { color: #c9a84c; }

  .up-input {
    width: 100%;
    background: transparent;
    border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 12px 4px;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    outline: none; transition: border-color 0.2s;
    caret-color: #c9a84c;
  }
  .up-input::placeholder { color: #524f60; }
  .up-input:focus { border-color: rgba(201,168,76,0.5); }

  .up-textarea {
    width: 100%; height: 90px; resize: none;
    background: transparent;
    border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 12px 4px;
    color: #f0ede8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    outline: none; transition: border-color 0.2s;
    caret-color: #c9a84c;
  }
  .up-textarea::placeholder { color: #524f60; }
  .up-textarea:focus { border-color: rgba(201,168,76,0.5); }

  /* select */
  .up-select {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 12px 4px;
    color: #9994a8;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 14px; outline: none; cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .up-select:focus { border-color: rgba(201,168,76,0.5); color: #f0ede8; outline: none; }
  .up-select option { background: #13131e; color: #f0ede8; }

  /* chips */
  .up-chips {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; min-height: 32px;
    align-items: center;
  }
  .up-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.25);
    color: #e4c97e;
    padding: 5px 12px; border-radius: 100px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
  }
  .up-chip-remove {
    background: none; border: none; cursor: pointer;
    color: #c9a84c; font-size: 15px; line-height: 1;
    padding: 0; transition: color 0.15s;
  }
  .up-chip-remove:hover { color: #f0ede8; }
  .up-chips-empty {
    font-size: 11px; color: #524f60; font-weight: 300; font-style: italic;
  }

  /* file */
  .up-file-wrap { display: flex; flex-direction: column; gap: 8px; }
  .up-file-label {
    display: flex; align-items: center; gap: 12px; cursor: pointer;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .up-file-btn {
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.25);
    color: #e4c97e;
    padding: 7px 16px; border-radius: 8px;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    transition: background 0.2s, border-color 0.2s;
    white-space: nowrap; flex-shrink: 0;
  }
  .up-file-label:hover .up-file-btn {
    background: rgba(201,168,76,0.18);
    border-color: rgba(201,168,76,0.45);
  }
  .up-file-name {
    font-size: 12px; color: #524f60; font-weight: 300;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .up-file-confirm {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #4ecdc4;
  }

  /* submit button */
  .up-btn {
    width: 100%; padding: 17px;
    background: linear-gradient(135deg, #c9a84c 0%, #f0a030 100%);
    border: none; border-radius: 12px;
    color: #09090e;
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 800;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; margin-top: 44px;
    box-shadow: 0 4px 24px rgba(201,168,76,0.3);
    transition: box-shadow 0.2s, filter 0.2s;
  }
  .up-btn:hover  { box-shadow: 0 6px 32px rgba(201,168,76,0.45); filter: brightness(1.05); }
  .up-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }

  /* meta footer */
  .up-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 24px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.08);
  }

  ::selection { background: #c9a84c; color: #09090e; }
`;
