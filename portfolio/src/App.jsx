import { useEffect, useRef, useState } from "react";
import fotoThiago from "./IMG_4436.jpg";

const ISLANDS = [
  { id: "sobre", label: "SOBRE", x: 0.12, y: 0.20, w: 0.18, h: 0.18, size: 92, color: "#8b5cf6", floatSpeed: 0.0007, floatOffset: 0 },
  { id: "projetos", label: "PROJETOS", x: 0.45, y: 0.62, w: 0.22, h: 0.22, size: 108, color: "#06ffa5", floatSpeed: 0.001, floatOffset: 2.5 },
  { id: "skills", label: "SKILLS", x: 0.78, y: 0.15, w: 0.16, h: 0.16, size: 76, color: "#f472b6", floatSpeed: 0.0008, floatOffset: 5 },
  { id: "contato", label: "CONTATO", x: 0.80, y: 0.60, w: 0.14, h: 0.14, size: 66, color: "#fbbf24", floatSpeed: 0.0011, floatOffset: 1.2 },
];

const SKILLS = [
  { name: "JavaScript", color: "#facc15", icon: "JS" },
  { name: "React", color: "#22d3ee", icon: "⚛" },
  { name: "Node.js", color: "#06ffa5", icon: "⬢" },
  { name: "TypeScript", color: "#3b82f6", icon: "TS" },
  { name: "Python", color: "#60a5fa", icon: "Py" },
  { name: "Git", color: "#f05032", icon: "⎇" },
  { name: "Tailwind", color: "#06b6d4", icon: "≋" },
  { name: "SQL", color: "#8b5cf6", icon: "◫" },
];

const PROJECTS = [
  {
    id: "01",
    title: "Landing Page - MeowCafé",
    desc: "Landing page responsiva feita com HTML5 e CSS3 puro, sem frameworks. Layout moderno com foco em conversão, animações suaves e 100% responsiva.",
    stack: ["HTML5", "CSS3"],
    color: "#8b5cf6",
    github: "https://github.com/thiagoanchietapaiva-cloud/html-css-landing-page",
    demo: "https://meow-t5cd.onrender.com"
  },
  {
    id: "02",
    title: "Landing Page - ANIMEWEAR",
    desc: "Landing page fictícia de uma loja de camisas de anime. Inspirada na mesma estrutura do projeto Meow Café, mas com identidade totalmente nova voltada para o público geek. Foco em conversão com botões com micro-interações, grade de produtos responsiva e hero com modelo vestindo a peça.",
    stack: ["HTML5", "CSS3"],
    color: "#06ffa5",
    github: "https://github.com/thiagoanchietapaiva-cloud/LojaGeek.git",
    demo: "https://lojageek.onrender.com"
  },
  {
    id: "03", title: "Linktree Responsivo", desc: "Página de links pessoal inspirada no Linktree, desenvolvida com HTML semântico e CSS puro. Design minimalista com avatar, redes sociais (Instagram, GitHub e WhatsApp) e botões de call-to-action.", stack: ["HTML5", "CSS3"], color: "#f472b6",
    github: "https://github.com/thiagoanchietapaiva-cloud/html-css-linktree.git",
    demo: "https://html-css-linktree-0d7k.onrender.com"
  },
];

export default function App() {
  const gameRef = useRef(null);
  const player = useRef({ x: 0.52, y: 0.5, vx: 0, vy: 0 });
  const starsRef = useRef([]);
  const keys = useRef({});
  const [near, setNear] = useState(null);
  const [bio, setBio] = useState("Sou Thiago Anchieta, dev Fullstack focado em criar interfaces que as pessoas realmente gostam de usar. Transformo ideias em produtos funcionais com Java, JavaScript, HTML, CSS, React, TypeScript e Tailwind. Apaixonado por resolver problemas, deixar tudo fluido e entregar deploy que funciona de verdade. Atualmente construindo projetos reais e cursando Análise e Desenvolvimento de Sistemas.");
  const [editingBio, setEditingBio] = useState(false);
  const lastScrolledRef = useRef(null);
  const [formData, setFormData] = useState({ nome: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [touchDir, setTouchDir] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const canvas = gameRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const box = canvas.parentElement;
    const resize = () => {
      const r = box.getBoundingClientRect();
      canvas.width = r.width * window.devicePixelRatio;
      canvas.height = r.height * window.devicePixelRatio;
      canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }; resize(); window.addEventListener("resize", resize);

    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 120 }, () => ({
        x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.8 + 0.2, twinkle: Math.random() * 0.002 + 0.0005,
        color: Math.random() > 0.85 ? ["#8b5cf6", "#06ffa5", "#fbbf24"][Math.floor(Math.random() * 3)] : "#ffffff"
      }));
    }

    const kd = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key.toLowerCase() === "e" && near) document.getElementById(near.id)?.scrollIntoView({ behavior: "smooth" });
    };
    const ku = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);

    const drawAstronaut = (x, y, dir) => {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(2, 14, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (Math.abs(player.current.vx) > 0.2 || Math.abs(player.current.vy) > 0.2) {
        ctx.fillStyle = Math.random() > 0.5 ? "#06ffa5" : "#8b5cf6";
        ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-14, 10); ctx.lineTo(-8, 12); ctx.fill();
      }
      ctx.fillStyle = "#e5e7eb"; ctx.fillRect(-8, -6, 16, 14);
      ctx.fillStyle = "#0a0a0f"; ctx.fillRect(-6, -2, 12, 3);
      ctx.fillStyle = "#8b5cf6"; ctx.fillRect(-8, -8, 16, 6);
      ctx.fillStyle = "#e5e7eb"; ctx.fillRect(dir >= 0 ? 8 : -14, -2, 6, 8); ctx.fillRect(dir >= 0 ? -14 : 8, -2, 6, 8);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#06ffa5"; ctx.beginPath(); ctx.arc(2, -10, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    let raf; const loop = () => {
      const W = box.clientWidth, H = box.clientHeight;
      ctx.fillStyle = "#080810"; ctx.fillRect(0, 0, W, H);
      const time = Date.now();
      starsRef.current.forEach(s => {
        const twinkle = Math.sin(time * s.twinkle) * 0.3 + 0.7;
        ctx.globalAlpha = s.opacity * twinkle; ctx.fillStyle = s.color; ctx.beginPath();
        if (s.r > 1) { ctx.shadowColor = s.color; ctx.shadowBlur = 6; }
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      const grad = ctx.createRadialGradient(W * 0.2, H * 0.2, 0, W * 0.2, H * 0.2, W * 0.6);
      grad.addColorStop(0, "rgba(139,92,246,0.08)"); grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

      let mx = touchDir.x, my = touchDir.y;
      if (keys.current["w"] || keys.current["arrowup"]) my = -1;
      if (keys.current["s"] || keys.current["arrowdown"]) my = 1;
      if (keys.current["a"] || keys.current["arrowleft"]) mx = -1;
      if (keys.current["d"] || keys.current["arrowright"]) mx = 1;
      if (mx && my) { mx *= 0.707; my *= 0.707; }

      player.current.vx += (mx * 1.2 - player.current.vx) * 0.10;
      player.current.vy += (my * 1.2 - player.current.vy) * 0.10;
      player.current.x += player.current.vx * 0.016; player.current.y += player.current.vy * 0.016;
      player.current.x = Math.max(0.05, Math.min(0.95, player.current.x));
      player.current.y = Math.max(0.08, Math.min(0.92, player.current.y));

      let nearIsland = null;
      ISLANDS.forEach(is => {
        const floatX = Math.sin(time * is.floatSpeed + is.floatOffset) * 7;
        const floatY = Math.cos(time * is.floatSpeed * 0.85 + is.floatOffset) * 10;
        const size = is.size;
        const ix = is.x * W + floatX; const iy = is.y * H + floatY; const iw = size, ih = size;
        const dist = Math.hypot(player.current.x - (is.x + is.w / 2), player.current.y - (is.y + is.h / 2));
        if (dist < 0.18) nearIsland = is;
        ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.roundRect(ix + 2, iy + ih + 6, iw, 6, 3); ctx.fill();
        ctx.fillStyle = "#15151f"; ctx.strokeStyle = is.color; ctx.lineWidth = nearIsland?.id === is.id ? 2.5 : 1.5;
        if (nearIsland?.id === is.id) { ctx.shadowColor = is.color; ctx.shadowBlur = 18; }
        ctx.beginPath(); ctx.roundRect(ix, iy, iw, ih, 8); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        const innerGrad = ctx.createLinearGradient(ix, iy, ix, iy + ih);
        innerGrad.addColorStop(0, "rgba(255,255,255,0.12)"); innerGrad.addColorStop(1, "rgba(0,0,0,0.1)");
        ctx.fillStyle = innerGrad; ctx.beginPath(); ctx.roundRect(ix, iy, iw, ih, 8); ctx.fill();
        ctx.fillStyle = is.color; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.roundRect(ix + 10, iy + 10, iw - 20, 3, 2); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff"; ctx.font = `900 ${nearIsland?.id === is.id ? 15 : 13}px JetBrains Mono`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(is.label, ix + iw / 2, iy + ih / 2 + 2);
      });
      setNear(prev => (prev?.id !== nearIsland?.id ? nearIsland : prev));
      drawAstronaut(player.current.x * W, player.current.y * H, player.current.vx >= 0 ? 1 : -1);
      raf = requestAnimationFrame(loop);
    }; loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [near, touchDir, isMobile]);

  useEffect(() => {
    if (near && lastScrolledRef.current !== near.id) {
      document.getElementById(near.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      lastScrolledRef.current = near.id;
    }
    if (!near) {
      const t = setTimeout(() => { lastScrolledRef.current = null; }, 800);
      return () => clearTimeout(t);
    }
  }, [near, touchDir, isMobile]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0a0a0f;color:#fff;font-family:'JetBrains Mono',monospace}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.08);border-radius:20px}
        .nome-hover{ display:inline-block; cursor:pointer; transition: all 0.2s ease; }
        .nome-hover:hover{ animation: shakeNome 0.35s ease-in-out infinite; filter: drop-shadow(0 0 12px rgba(139,92,246,0.6)); }
        .nome-hover:hover span{ background: linear-gradient(90deg,#8b5cf6,#06ffa5,#f472b6,#8b5cf6) !important; background-size: 200% 100% !important; animation: gradientMove 0.6s linear infinite; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
        @keyframes shakeNome{
          0%{ transform: translate(0,0) skew(0deg); }
          20%{ transform: translate(-1.5px,1px) skew(-0.5deg); }
          40%{ transform: translate(1.5px,-1px) skew(0.5deg); }
          60%{ transform: translate(-1px,0px) skew(-0.3deg); }
          80%{ transform: translate(1px,1px) skew(0.3deg); }
          100%{ transform: translate(0,0) skew(0deg); }
        }
        @keyframes gradientMove{
          0%{ background-position: 0% 50%; }
          100%{ background-position: 200% 50%; }
        }
        .btn-ver-projetos{
          display:flex; align-items:center; gap:6px;
          font-size:14px; letter-spacing:0.02em;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .btn-ver-projetos:hover{
          transform: scale(1.07) translateY(-2px);
          background: #f5f5f5 !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.8), 0 10px 30px rgba(255,255,255,0.25), 0 0 40px rgba(139,92,246,0.3);
          font-size:15.5px;
          letter-spacing:0.04em;
        }
        .btn-ver-projetos:hover svg{
          transform: translate(4px, -4px) scale(1.15);
        }
        .btn-ver-projetos svg{ transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .btn-sobre-mim{
          font-size:14px;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .btn-sobre-mim:hover{
          transform: scale(1.07) translateY(-2px);
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(139,92,246,0.5) !important;
          box-shadow: 0 0 0 1px rgba(139,92,246,0.3), 0 10px 30px rgba(139,92,246,0.2);
          color: #fff !important;
          font-size:15.5px;
          letter-spacing:0.04em;
        }
        .project-icon-btn:hover{
          transform: scale(1.15) translateY(-2px);
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.3) !important;
          box-shadow: 0 0 15px rgba(255,255,255,0.2);
        }
        .project-card{
          transition: transform 0.25s ease, border-color 0.25s ease;
          will-change: transform;
        }
        .project-card:hover{
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.12) !important;
        }
        .skill-orb-card{
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          will-change: transform;
          position: relative;
          cursor: pointer;
        }
        .skill-orb-card:hover{
          transform: translateY(-6px) scale(1.04);
          border-color: var(--skill-color) !important;
          background: rgba(255,255,255,0.07) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 0 1px var(--skill-color), 0 0 20px var(--skill-color-soft);
          z-index: 2;
        }
        .btn-jogar:hover{
          transform: scale(1.08) translateY(-2px);
          background: #06ffa5 !important;
          box-shadow: 0 0 20px rgba(6,255,165,0.4);
        }
        #jogo{
          scroll-margin-top: 90px;
        }
        mobile-menu-btn{display:none}
        .joystick{display:none}
        .header-nav-desktop{display:flex; gap:30px; font-size:20px; align-items:center}
        @media (max-width: 900px){
          .header-nav-desktop{display:none !important}
          .mobile-menu-btn{display:grid !important}
          .joystick{display:flex !important}
          .game-wrapper{display:none !important}
          section[style*="1.15fr"]{grid-template-columns:1fr !important; padding:24px 16px !important}
          section[style*="320px"]{grid-template-columns:1fr !important}
          div[style*="repeat(3,1fr)"]{grid-template-columns:1fr !important}
          div[style*="1.2fr 0.8fr"]{grid-template-columns:1fr !important}
          div[style*="1fr 1fr"][style*="gap: 10"]{grid-template-columns:1fr !important}
          header{padding:12px 16px !important}
          #skills > div.glass{grid-template-columns:repeat(2, minmax(0,1fr)) !important; width:100% !important; box-sizing:border-box !important}
        }
        @media (max-width: 480px){
          #skills > div.glass{gap:10px !important; padding:12px !important}
          .skill-orb-card{padding:10px !important; min-width:0 !important}
          .skill-orb-card div:last-child{font-size:18px !important}
        }
      `}</style>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "12px 16px" : "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", zIndex: 50 }}>

        {/* LADO ESQUERDO - os links */}
        <nav className="header-nav-desktop" style={{ display: isMobile ? "none" : "flex", gap: 30, fontSize: 20, alignItems: "center" }}>
          <a href="#sobre" style={{ color: "#fff", textDecoration: "none" }}> SOBRE</a>
          <a href="#projetos" style={{ color: "#fff", textDecoration: "none" }}> PROJETOS</a>
          <a href="#skills" style={{ color: "#fff", textDecoration: "none" }}> SKILLS</a>
          <a href="#contato" style={{ color: "#fff", textDecoration: "none" }}> CONTATO</a>
        </nav>

        {/* LADO DIREITO - só o JOGAR sozinho */}
        <div style={{ display: isMobile ? "none" : "flex", alignItems: "center" }}>
          <button onClick={() => document.getElementById("jogo")?.scrollIntoView({ behavior: "smooth", block: "center" })} style={{ padding: "8px 16px", borderRadius: 20, background: "#fff", color: "#000", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }} className="btn-jogar">JOGAR</button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: isMobile ? "grid" : "none", placeItems: "center" }}>{mobileMenu ? "✕" : "☰"}</button>
      </header>
      {mobileMenu && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "rgba(10,10,15,0.98)", zIndex: 49, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <a href="#sobre" onClick={() => setMobileMenu(false)} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700 }}>SOBRE</a>
          <a href="#projetos" onClick={() => setMobileMenu(false)} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700 }}>PROJETOS</a>
          <a href="#skills" onClick={() => setMobileMenu(false)} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700 }}>SKILLS</a>
          <a href="#contato" onClick={() => setMobileMenu(false)} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700 }}>CONTATO</a>
          <a href="#jogo" onClick={() => setMobileMenu(false)} style={{ padding: "12px", background: "#fff", borderRadius: 10, color: "#000", textDecoration: "none", fontWeight: 800, textAlign: "center" }}>JOGAR</a>
        </div>
      )}

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "24px 16px" : "48px 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? 20 : 24, alignItems: "start" }}>
        <div>
          <h1 className="nome-hover" style={{ fontSize: "clamp(48px,6vw,84px)", lineHeight: 0.9, fontWeight: 800 }}>THIAGO<br /><span style={{ background: "linear-gradient(90deg,#8b5cf6,#06ffa5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ANCHIETA</span></h1>
          <p style={{ opacity: 0.7, marginTop: 30, lineHeight: 1.6, fontSize: 14, maxWidth: 420 }}>Portfolio que você navega jogando. Controle o astronauta dev, pouse nas ilhas e explore meu trabalho. Venha me conhecer um pouco mais.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 30, flexWrap: "wrap" }}><span style={{ fontSize: 11, padding: "6px 10px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>Interativo </span><span style={{ fontSize: 11, padding: "6px 10px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>Navegue pelo meu portifólio </span></div>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <button className="btn-ver-projetos" onClick={() => document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "15px 25px", borderRadius: 14, background: "#fff", color: "#000", fontWeight: 700, border: "none" }}>
              Ver projetos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, display: "inline", verticalAlign: "middle" }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </button>
            <button className="btn-sobre-mim" onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "22px 34px", borderRadius: 15, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>Sobre mim</button>
          </div>
        </div>
        <div id="jogo" className="game-wrapper" style={{ padding: "1px", borderRadius: 22, background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(6,255,165,0.35), rgba(244,114,182,0.4), rgba(251,191,36,0.35))", boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 30px rgba(139,92,246,0.18), 0 0 60px rgba(6,255,165,0.1)" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", background: "radial-gradient(120% 120% at 20% 10%, rgba(139,92,246,0.12), transparent 50%), radial-gradient(100% 100% at 80% 90%, rgba(6,255,165,0.08), transparent 40%), rgba(12,12,18,0.96)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 10, opacity: 0.6 }}><div style={{ display: "flex", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} /></div><span>Mapa_portfolio.exe</span><span style={{ padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.06)" }}>VOANDO</span></div>
            <div style={{ padding: "10px 12px", display: "flex", gap: 8, fontSize: 9 }}><span style={{ padding: "6px 10px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>🎮 WASD / SETAS PARA MOVER</span><span style={{ padding: "6px 10px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>COLIDA PARA NAVEGAR</span></div>
            <div style={{ position: "relative", height: 360 }}><canvas ref={gameRef} style={{ width: "100%", height: "100%", display: "block" }} />{near && <div style={{ position: "absolute", left: `${(near.x + near.w / 2) * 100}%`, top: `${near.y * 100 - 4}%`, transform: "translate(-50%,-100%)", background: "#fff", color: "#000", padding: "5px 10px", borderRadius: 16, fontSize: 10, fontWeight: 700 }}>Entrando em {near.label}...</div>}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              {ISLANDS.map(is => (<span key={is.id} style={{ fontSize: 8, letterSpacing: "0.1em", padding: "4px 10px", borderRadius: 20, background: near?.id === is.id ? `${is.color}22` : "rgba(255,255,255,0.04)", border: `1px solid ${near?.id === is.id ? is.color + "66" : "rgba(255,255,255,0.08)"}`, color: near?.id === is.id ? is.color : "rgba(255,255,255,0.45)", boxShadow: near?.id === is.id ? `0 0 10px ${is.color}44` : "none" }}>{is.label}</span>))}
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#8b5cf6", display: "grid", placeItems: "center" }}>✦</div><h2 style={{ fontSize: 24, fontWeight: 800 }}>SOBRE_MIM</h2><div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(139,92,246,0.3),transparent)", marginLeft: 12 }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", gap: 16 }}>
          <div className="glass" style={{ padding: 18, borderRadius: 20 }}>
            <div style={{ background: "linear-gradient(180deg,#1a1033,#0f1f1a)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              <img src={fotoThiago} alt="Thiago Anchieta" style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", margin: "0 auto", display: "block", border: "2px solid rgba(139,92,246,0.4)", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }} />
              <div style={{ fontWeight: 700, marginTop: 10 }}>Thiago Anchieta</div><div style={{ fontSize: 11, opacity: 0.6 }}>• Fullstack •</div>
              <div style={{ marginTop: 10, fontSize: 10, padding: "6px 10px", borderRadius: 20, background: "rgba(6,255,165,0.15)", border: "1px solid rgba(6,255,165,0.3)", color: "#06ffa5", display: "inline-block" }}>• disponível para freela</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
              <div className="glass" style={{ textAlign: "center", padding: "10px 0" }}><b>3</b><div style={{ fontSize: 9, opacity: 0.5 }}>Projetos</div></div>
              <div className="glass" style={{ textAlign: "center", padding: "10px 0" }}><b>340+</b><div style={{ fontSize: 9, opacity: 0.5 }}>Commits</div></div>
              <div className="glass" style={{ textAlign: "center", padding: "10px 0" }}><b>∞</b><div style={{ fontSize: 9, opacity: 0.5 }}>Cafés</div></div>
            </div>
          </div>
          <div className="glass" style={{ padding: 20 }}>
            <div style={{ fontSize: 15, letterSpacing: "0.15em", opacity: 0.4, marginBottom: 12 }}>• BIO • </div>
            {editingBio ? <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: "100%", height: 140, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, color: "#fff", fontFamily: "JetBrains Mono" }} /> : <p style={{ lineHeight: 1.7, fontSize: 15, opacity: 0.85 }}>{bio}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 40, flexWrap: "wrap" }}>{["#Java", "#JavaScript", "#HTML", "#CSS", "#React", "#TypeScript", "#Tailwind", "#ADS"].map(t => <span key={t} style={{ fontSize: 12, padding: "8px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>{t}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="projetos" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#06ffa5", display: "grid", placeItems: "center", color: "#000" }}>&lt;/&gt;</div><h2 style={{ fontSize: 24, fontWeight: 800 }}>PROJETOS</h2><div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(6,255,165,0.3),transparent)", marginLeft: 12 }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
          {PROJECTS.map(p => (
            <div key={p.id} className="glass project-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color, color: "#000", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>{p.id}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <a href={p.github} target="_blank" rel="noopener noreferrer" title="Ver no GitHub" className="project-icon-btn" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "grid", placeItems: "center", color: "#fff", textDecoration: "none", transition: "all 0.2s ease" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03C6.12 21.36 5.36 19.2 5.36 19.2c-.47-1.2-1.15-1.52-1.15-1.52-.94-.64.07-.63.07-.63 1.04.07 1.58 1.07 1.58 1.07.92 1.58 2.42 1.12 3.01.86.09-.67.36-1.12.66-1.38-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.28 1.23a11.4 11.4 0 0 1 5.96 0c2.28-1.55 3.28-1.23 3.28-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.47 5.91.37.32.7.94.7 1.9v2.81c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" /></svg>
                  </a>
                  <a href={p.demo} target="_blank" rel="noopener noreferrer" title="Ver demo" className="project-icon-btn" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "grid", placeItems: "center", color: "#fff", textDecoration: "none", transition: "all 0.2s ease" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                </div>
              </div>
              <div style={{ fontWeight: 700, marginTop: 12 }}>{p.title}</div><div style={{ fontSize: 11, opacity: 0.6, marginTop: 8, lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>{p.stack.map(s => <span key={s} style={{ fontSize: 9, padding: "4px 8px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: `1px solid ${p.color}30`, color: p.color }}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#f472b6", display: "grid", placeItems: "center", color: "#000" }}></div><h2 style={{ fontSize: 24, fontWeight: 800 }}>SKILLS</h2><div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(244,114,182,0.3),transparent)", marginLeft: 12 }} /></div>
        <div className="glass" style={{ padding: 16, display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
          {SKILLS.map(s => (
            <div key={s.name} className="glass skill-orb-card" style={{ padding: 14, '--skill-color': s.color, '--skill-color-soft': `${s.color}55` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: "grid", placeItems: "center", color: s.color, fontWeight: 700, fontSize: 20 }}>{s.icon}</div></div>
              <div style={{ marginTop: 15, fontWeight: 700, fontSize: 25 }}>{s.name}</div>

            </div>
          ))}
        </div>
      </section>

      <section id="contato" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#fbbf24", display: "grid", placeItems: "center", color: "#000" }}>✉</div><h2 style={{ fontSize: 24, fontWeight: 800 }}>CONTATO</h2><div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(251,191,36,0.3),transparent)", marginLeft: 12 }} /><span style={{ fontSize: 10, opacity: 0.4 }}>EASTER EGG: digite "dev"</span></div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: 16 }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.4, marginBottom: 12 }}>FORMULÁRIO • FUNCIONANDO</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              <input
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <input
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <textarea
              placeholder="Fala, Thiago! Curti seu portfólio game..."
              value={formData.msg}
              onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
              style={{ width: "100%", height: 110, marginTop: 10, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            <button
              onClick={() => {
                if (!formData.nome || !formData.msg) { alert("Preencha nome e mensagem!"); return; }
                const texto = `Olá Thiago! Sou ${formData.nome} (${formData.email}).

${formData.msg}`;
                const url = `https://wa.me/5585994062045?text=${encodeURIComponent(texto)}`;
                window.open(url, "_blank");
                setSent(true);
                setTimeout(() => setSent(false), 4000);
              }}
              style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 12, background: sent ? "#06ffa5" : "#fff", color: "#000", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.3s ease" }}>
              {sent ? " Abrindo WhatsApp..." : "Enviar no WhatsApp "}
            </button>

          </div>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Links diretos</div>
            <div style={{ display: "grid", gap: 10 }}>
              <a href="https://github.com/thiagoanchietapaiva-cloud?tab=repositories" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 12, display: "flex", justifyContent: "space-between", transition: "all 0.2s ease" }} className="project-icon-btn">github.com/thiagoanchieta <span>↗</span></a>
              <a href="https://wa.me/5585994062045" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366", textDecoration: "none", fontSize: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, transition: "all 0.2s ease" }} className="project-icon-btn">WhatsApp: +55 (85) 99406-2045 <span>↗</span></a>
              <a href="mailto:thiagoanchietapaiva@gmail.com" style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 15, display: "flex", justifyContent: "space-between", transition: "all 0.2s ease" }} className="project-icon-btn">thiagoanchietapaiva@gmail.com <span>↗</span></a>
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(186, 36, 251, 0.54)", border: "1px solid rgba(251, 36, 201, 0.15)", fontSize: 10, opacity: 0.7, lineHeight: 1.4 }}>
              Respondo em até 24h. Bora tirar sua ideia do papel?
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
