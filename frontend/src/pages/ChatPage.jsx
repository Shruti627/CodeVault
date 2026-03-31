import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

// ─── INJECT GLOBAL STYLES ───────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --bg-base:        #09090e;
    --bg-surface:     #0e0e16;
    --bg-elevated:    #13131e;
    --bg-overlay:     #1a1a28;
    --border-subtle:  rgba(255,255,255,0.06);
    --border-mid:     rgba(255,255,255,0.10);
    --border-strong:  rgba(255,255,255,0.16);
    --accent-gold:    #c9a84c;
    --accent-gold-lt: #e4c97e;
    --accent-amber:   #f0a030;
    --accent-teal:    #4ecdc4;
    --text-primary:   #f0ede8;
    --text-secondary: #9994a8;
    --text-muted:     #524f60;
    --user-bubble:    linear-gradient(135deg, #1e1830 0%, #2a2245 100%);
    --user-border:    rgba(201,168,76,0.25);
    --ai-bubble:      rgba(255,255,255,0.04);
    --shadow-sm:      0 2px 8px rgba(0,0,0,0.4);
    --shadow-md:      0 4px 24px rgba(0,0,0,0.5);
    --shadow-lg:      0 8px 48px rgba(0,0,0,0.6);
    --radius-sm:      10px;
    --radius-md:      16px;
    --radius-lg:      20px;
    --radius-xl:      28px;
    --font-display:   'Syne', sans-serif;
    --font-body:      'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; }

  body {
    font-family: var(--font-body);
    background: var(--bg-base);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-overlay); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  /* CHAT PAGE ROOT */
  .chat-root {
    display: flex;
    height: 100vh;
    background: var(--bg-base);
    overflow: hidden;
    padding-top: 0;
    position: relative;
  }

  /* AMBIENT GLOW */
  .chat-root::before {
    content: '';
    position: fixed;
    top: -200px;
    right: -200px;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .chat-root::after {
    content: '';
    position: fixed;
    bottom: -300px;
    left: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(78,205,196,0.035) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ─── SIDEBAR ─────────────────────────────────────────────── */
  .sidebar {
    width: 280px;
    flex-shrink: 0;
    background: var(--bg-surface);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    padding-top: 80px; /* account for navbar */
  }

  .sidebar-header {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .new-chat-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.08) 100%);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--accent-gold-lt);
    padding: 11px 16px;
    border-radius: var(--radius-md);
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .new-chat-btn:hover {
    background: linear-gradient(135deg, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.12) 100%);
    border-color: rgba(201,168,76,0.5);
    box-shadow: 0 0 20px rgba(201,168,76,0.12);
    transform: translateY(-1px);
  }
  .new-chat-btn:active { transform: translateY(0); }

  .sidebar-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .sidebar-empty {
    text-align: center;
    color: var(--text-muted);
    margin-top: 48px;
    font-size: 13px;
    line-height: 1.7;
    font-family: var(--font-body);
    font-style: italic;
  }

  .chat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    position: relative;
  }
  .chat-item:hover {
    background: var(--bg-elevated);
    border-color: var(--border-subtle);
  }
  .chat-item.active {
    background: linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%);
    border-color: rgba(201,168,76,0.2);
  }
  .chat-item.active .chat-item-title {
    color: var(--accent-gold-lt);
  }

  .chat-item-inner {
    display: flex;
    align-items: center;
    gap: 9px;
    flex: 1;
    min-width: 0;
  }
  .chat-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .chat-item.active .chat-item-dot {
    background: var(--accent-gold);
    box-shadow: 0 0 6px rgba(201,168,76,0.5);
  }
  .chat-item-title {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    transition: color 0.15s;
  }
  .chat-item:hover .chat-item-title { color: var(--text-primary); }

  .delete-btn {
    opacity: 0;
    color: #ff6b6b;
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px 5px;
    border-radius: 6px;
    font-size: 13px;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  .chat-item:hover .delete-btn { opacity: 1; }
  .delete-btn:hover {
    background: rgba(255,107,107,0.12);
    color: #ff4757;
  }

  /* ─── MAIN AREA ───────────────────────────────────────────── */
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    padding-top: 80px; /* account for navbar */
    min-width: 0;
  }

  /* MESSAGES SCROLL */
  .messages-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
    display: flex;
    justify-content: center;
  }
  .messages-inner {
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    margin-top: 60px;
  }
  .empty-state-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--accent-gold);
    font-family: var(--font-display);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .empty-state-title {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  .empty-state-title span {
    background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-lt) 50%, var(--accent-amber) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .empty-state-sub {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 32px;
    font-weight: 300;
  }
  .suggestions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    max-width: 560px;
    margin: 0 auto;
  }
  .suggestion-card {
    cursor: pointer;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 16px 18px;
    text-align: left;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .suggestion-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .suggestion-card:hover {
    background: var(--bg-overlay);
    border-color: rgba(201,168,76,0.2);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), 0 0 0 1px rgba(201,168,76,0.1);
  }
  .suggestion-card:hover::before { opacity: 1; }
  .suggestion-card-label {
    font-size: 11px;
    color: var(--accent-gold);
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .suggestion-card-text {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.4;
    font-weight: 400;
  }
  .suggestion-card:hover .suggestion-card-text { color: var(--text-primary); }

  /* MESSAGE BUBBLES */
  .message-row {
    display: flex;
  }
  .message-row.user { justify-content: flex-end; }
  .message-row.assistant { justify-content: flex-start; }

  .message-group {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    max-width: 80%;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .avatar.ai {
    background: var(--bg-elevated);
    border: 1px solid var(--border-mid);
  }
  .avatar.user {
    background: linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 100%);
    border: 1px solid rgba(201,168,76,0.3);
  }

  .bubble {
    padding: 12px 16px;
    border-radius: var(--radius-lg);
    font-size: 14px;
    line-height: 1.65;
    font-weight: 400;
    box-shadow: var(--shadow-sm);
  }
  .bubble.user {
    background: var(--user-bubble);
    border: 1px solid var(--user-border);
    border-bottom-right-radius: 6px;
    color: var(--text-primary);
  }
  .bubble.assistant {
    background: var(--ai-bubble);
    border: 1px solid var(--border-subtle);
    border-bottom-left-radius: 6px;
    color: var(--text-primary);
    backdrop-filter: blur(8px);
  }

  /* TYPING INDICATOR */
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
    padding-left: 42px;
    font-family: var(--font-body);
  }
  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .typing-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent-gold);
    animation: dotPulse 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotPulse {
    0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
    30% { opacity: 1; transform: scale(1); }
  }

  /* INPUT BAR */
  .input-bar {
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    padding: 16px 24px 20px;
  }
  .input-inner {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-mid);
    border-radius: var(--radius-xl);
    padding: 6px 6px 6px 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-inner:focus-within {
    border-color: rgba(201,168,76,0.35);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.06), var(--shadow-md);
  }
  .chat-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    padding: 10px 0;
    caret-color: var(--accent-gold);
  }
  .chat-input::placeholder {
    color: var(--text-muted);
  }
  .send-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 2px 12px rgba(201,168,76,0.25);
  }
  .send-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 20px rgba(201,168,76,0.4);
  }
  .send-btn:active { transform: scale(0.96); }

  /* ─── MARKDOWN CONTENT (inside AI bubble only) ───────────── */
  .md {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Paragraphs */
  .md p {
    margin: 0;
    line-height: 1.7;
    color: var(--text-primary);
  }

  /* Bold */
  .md strong {
    font-weight: 600;
    color: var(--accent-gold-lt);
  }

  /* Italic */
  .md em {
    font-style: italic;
    color: var(--text-secondary);
  }

  /* Numbered & bullet lists */
  .md ol, .md ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .md ol { counter-reset: md-counter; }

  .md ol li {
    counter-increment: md-counter;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    line-height: 1.65;
  }
  .md ol li::before {
    content: counter(md-counter);
    min-width: 22px;
    height: 22px;
    border-radius: 6px;
    background: rgba(201,168,76,0.12);
    border: 1px solid rgba(201,168,76,0.22);
    color: var(--accent-gold);
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .md ul li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    line-height: 1.65;
  }
  .md ul li::before {
    content: '◆';
    color: var(--accent-gold);
    font-size: 7px;
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* Inline code */
  .md code {
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 5px;
    padding: 1px 6px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 12.5px;
    color: var(--accent-gold-lt);
  }

  /* Code blocks */
  .md pre {
    background: rgba(0,0,0,0.35);
    border: 1px solid var(--border-mid);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    overflow-x: auto;
    margin: 0;
  }
  .md pre code {
    background: none;
    border: none;
    padding: 0;
    font-size: 13px;
    color: #d4d0c8;
  }

  /* Headings */
  .md h1, .md h2, .md h3 {
    font-family: var(--font-display);
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
  }
  .md h1 { font-size: 18px; font-weight: 700; }
  .md h2 { font-size: 15px; font-weight: 600; color: var(--accent-gold-lt); }
  .md h3 { font-size: 14px; font-weight: 600; color: var(--text-secondary); }

  /* Horizontal rule */
  .md hr {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 4px 0;
  }

  /* Blockquote */
  .md blockquote {
    border-left: 3px solid rgba(201,168,76,0.4);
    padding: 4px 12px;
    margin: 0;
    color: var(--text-secondary);
    font-style: italic;
  }
`;

// ─── MARKDOWN RENDERER ──────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]); i++;
      }
      elements.push(<pre key={`pre-${i}`}><code>{codeLines.join("\n")}</code></pre>);
      i++; continue;
    }
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) { elements.push(<h1 key={i}>{inlineFormat(h1[1])}</h1>); i++; continue; }
    if (h2) { elements.push(<h2 key={i}>{inlineFormat(h2[1])}</h2>); i++; continue; }
    if (h3) { elements.push(<h3 key={i}>{inlineFormat(h3[1])}</h3>); i++; continue; }
    if (line.match(/^(---|\*\*\*|___)$/)) { elements.push(<hr key={i} />); i++; continue; }
    if (line.startsWith("> ")) {
      elements.push(<blockquote key={i}>{inlineFormat(line.slice(2))}</blockquote>);
      i++; continue;
    }
    if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(<li key={i}><span>{inlineFormat(lines[i].replace(/^\d+\.\s/, ""))}</span></li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }
    if (line.match(/^[*-]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[*-]\s/)) {
        items.push(<li key={i}><span>{inlineFormat(lines[i].replace(/^[*-]\s/, ""))}</span></li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    elements.push(<p key={i}>{inlineFormat(line)}</p>);
    i++;
  }
  return <div className="md">{elements}</div>;
}

function inlineFormat(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith("**"))     parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[0].startsWith("*")) parts.push(<em key={match.index}>{match[3]}</em>);
    else if (match[0].startsWith("`")) parts.push(<code key={match.index}>{match[4]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

// ─── INJECT STYLES ONCE ─────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("chat-page-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "chat-page-styles";
  styleTag.textContent = GLOBAL_STYLES;
  document.head.appendChild(styleTag);
}

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔥 LOAD ALL CHATS
  const loadChats = async () => {
    try {
      const res = await API.get("/chat");
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD SINGLE CHAT
  const loadChat = async (id) => {
    setMessages([]); // clear immediately for instant switch feel
    try {
      const res = await API.get(`/chat/${id}`);
      setMessages(res.data.messages);
      localStorage.setItem("lastChatId", id);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE CHAT
  const deleteChat = async (id) => {
    try {
      await API.delete(`/chat/${id}`);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (chatId === id) {
        localStorage.removeItem("lastChatId");
        setMessages([]);
        navigate("/ai-chat");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 ROUTE + RESTORE
  useEffect(() => {
    loadChats();
    if (chatId) {
      loadChat(chatId);
    } else {
      const last = localStorage.getItem("lastChatId");
      if (last) {
        navigate(`/ai-chat/${last}`);
      } else {
        setMessages([]);
      }
    }
  }, [chatId]);

  // 🔥 TYPING EFFECT
  const typeMessage = async (text) => {
    let current = "";
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: current };
        return updated;
      });
      await new Promise((res) => setTimeout(res, 10));
    }
  };

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await API.post("/chat", { message, chatId });
      const newChatId = res.data.chatId;
      localStorage.setItem("lastChatId", newChatId);
      if (!chatId) navigate(`/ai-chat/${newChatId}`);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await typeMessage(res.data.reply);
      loadChats();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setMessage("");
  };

  // 🔥 ENTER TO SEND
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS = [
    { label: "Inspire", text: "Suggest me AI projects" },
    { label: "Explain", text: "Explain Spring Boot in simple terms" },
    { label: "Explore", text: "Best final year project ideas" },
    { label: "Build",   text: "How to build a MERN app" },
  ];

  return (
    <div className="chat-root">

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button
            className="new-chat-btn"
            onClick={() => {
              localStorage.removeItem("lastChatId");
              navigate("/ai-chat");
            }}
          >
            <span style={{ fontSize: "15px" }}>✦</span>
            New Conversation
          </button>
        </div>

        <div className="sidebar-list">
          {chats.length === 0 ? (
            <div className="sidebar-empty">
              No conversations yet.<br />Start something new.
            </div>
          ) : (
            chats.map((c) => (
              <div
                key={c._id}
                className={`chat-item ${chatId === c._id ? "active" : ""}`}
              >
                <div
                  className="chat-item-inner"
                  onClick={() => { setMessages([]); navigate(`/ai-chat/${c._id}`); }}
                >
                  <div className="chat-item-dot" />
                  <span className="chat-item-title">
                    {c.title?.trim() || "Untitled Conversation"}
                  </span>
                </div>
                <button className="delete-btn" onClick={() => deleteChat(c._id)}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── CHAT AREA ─────────────────────────────────────────── */}
      <main className="chat-main">

        {/* MESSAGES */}
        <div className="messages-scroll">
          <div className="messages-inner">

            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-badge">
                  <span>✦</span> AI Assistant
                </div>
                <h1 className="empty-state-title">
                  What shall we <span>build</span> today?
                </h1>
                <p className="empty-state-sub">
                  Ask a question, explore an idea, or pick a prompt below
                </p>
                <div className="suggestions-grid">
                  {SUGGESTIONS.map((s, i) => (
                    <div
                      key={i}
                      className="suggestion-card"
                      onClick={() => setMessage(s.text)}
                    >
                      <div className="suggestion-card-label">{s.label}</div>
                      <div className="suggestion-card-text">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.role}`}>
                <div className="message-group">
                  {m.role === "assistant" && (
                    <div className="avatar ai">✦</div>
                  )}
                  <div className={`bubble ${m.role}`}>
                    {m.role === "assistant" ? renderMarkdown(m.content) : m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="avatar user">🧑</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <span>Composing a response</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="input-bar">
          <div className="input-inner">
            <input
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
            />
            <button className="send-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
