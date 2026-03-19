import { useState, useEffect, useRef } from "react";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const REPLY_TEMPLATE_ID = import.meta.env.VITE_REPLY_TEMPLATE_ID;
const NOTIFY_TEMPLATE_ID = import.meta.env.VITE_NOTIFY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const RESUME_URL = import.meta.env.VITE_RESUME_URL || "/Kartik_s_resume-2.pdf";

const SECTIONS = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
];
const TERMINAL_LINES = [
  { text: "$ sudo init portfolio.sh", delay: 0 },
  { text: "> Loading Kartik Raghuwanshi...", delay: 400 },
  { text: "> Brute force rejected. Optimal found ✓", delay: 800 },
  { text: "> Backend systems online ✓", delay: 1200 },
  { text: "> Ready.", delay: 2000 },
];

const HERO_ROLES = [
  "Full Stack Dev",
  "DSA Knight 🏅",
  "Backend Engineer",
  "CP Enthusiast",
];

const NODES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  speed: Math.random() * 0.3 + 0.1,
  dx: (Math.random() - 0.5) * 0.15,
  dy: (Math.random() - 0.5) * 0.15,
}));

function SystemBackground() {
  const canvasRef = useRef(null);
  const nodesRef = useRef(NODES.map((n) => ({ ...n })));
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth,
      h = window.innerHeight;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      nodes.forEach((n) => {
        n.x += n.dx;
        n.y += n.dy;
        if (n.x < 0 || n.x > 100) n.dx *= -1;
        if (n.y < 0 || n.y > 100) n.dy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * (w / 100);
          const dy = (nodes[i].y - nodes[j].y) * (h / 100);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo((nodes[i].x * w) / 100, (nodes[i].y * h) / 100);
            ctx.lineTo((nodes[j].x * w) / 100, (nodes[j].y * h) / 100);
            ctx.strokeStyle = `rgba(0,255,160,${0.08 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        const px = (n.x * w) / 100,
          py = (n.y * h) / 100;
        ctx.beginPath();
        ctx.arc(px, py, n.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,160,0.18)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0,255,160,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}

function TerminalBoot({ onDone }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    TERMINAL_LINES.forEach((l) => {
      setTimeout(() => {
        setLines((prev) => [...prev, l.text]);
        if (l.text === "> Ready.") {
          setTimeout(() => setDone(true), 600);
          setTimeout(() => onDone(), 1200);
        }
      }, l.delay);
    });
  }, [onDone]);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050e0a",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s",
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "all",
        padding: "1rem",
      }}
    >
      <div
        style={{
          fontFamily: "'Fira Code', monospace",
          color: "#00ff9f",
          fontSize: "clamp(11px,3vw,17px)",
          lineHeight: 2.2,
          padding: "1.5rem 2rem",
          width: "100%",
          maxWidth: 480,
          background: "rgba(0,255,160,0.03)",
          border: "1px solid rgba(0,255,160,0.15)",
          borderRadius: 4,
          boxShadow: "0 0 60px rgba(0,255,160,0.1)",
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{ animation: "fadeIn 0.3s ease", wordBreak: "break-word" }}
          >
            {l}
          </div>
        ))}
        <span style={{ animation: "blink 1s infinite" }}>█</span>
      </div>
    </div>
  );
}

function NavBar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useWindowWidth() < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on section click
  const handleNavClick = (s) => {
    setActive(s);
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background:
            scrolled || menuOpen ? "rgba(5,14,10,0.96)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,255,160,0.1)" : "none",
          transition: "all 0.3s",
          padding: "0 clamp(1rem,5vw,2rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "'Fira Code', monospace",
            color: "#00ff9f",
            fontSize: "clamp(12px,3vw,15px)",
            letterSpacing: 2,
          }}
        >
          &gt; kartik.sh
        </span>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "clamp(1rem,3vw,1.8rem)" }}>
            {SECTIONS.slice(1).map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => handleNavClick(s)}
                style={{
                  fontFamily: "'Fira Code', monospace",
                  color: active === s ? "#00ff9f" : "rgba(255,255,255,0.45)",
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  borderBottom:
                    active === s
                      ? "1px solid #00ff9f"
                      : "1px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {s}
              </a>
            ))}
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#00ff9f",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translate(5px,5px)"
                      : menuOpen && i === 1
                        ? "scaleX(0)"
                        : menuOpen && i === 2
                          ? "rotate(-45deg) translate(5px,-5px)"
                          : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            width: "100%",
            zIndex: 49,
            background: "rgba(5,14,10,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,255,160,0.1)",
            overflow: "hidden",
            maxHeight: menuOpen ? 400 : 0,
            transition: "max-height 0.35s ease",
          }}
        >
          {SECTIONS.slice(1).map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => handleNavClick(s)}
              style={{
                display: "block",
                fontFamily: "'Fira Code', monospace",
                color: active === s ? "#00ff9f" : "rgba(255,255,255,0.6)",
                fontSize: 13,
                letterSpacing: 2,
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "1rem clamp(1rem,5vw,2rem)",
                borderBottom: "1px solid rgba(0,255,160,0.06)",
                transition: "color 0.2s",
              }}
            >
              {active === s ? "> " : "  "}
              {s}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// Custom hook for window width
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return width;
}

function Badge({ children, color = "#00ff9f" }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'Fira Code', monospace",
        fontSize: "clamp(10px,2vw,11px)",
        color,
        border: `1px solid ${color}`,
        padding: "2px 10px",
        borderRadius: 2,
        margin: "3px",
        background: `${color}12`,
        letterSpacing: 1,
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ label, title }) {
  return (
    <div style={{ marginBottom: "clamp(1.5rem,5vw,3rem)" }}>
      <div
        style={{
          fontFamily: "'Fira Code', monospace",
          color: "#00ff9f",
          fontSize: "clamp(10px,2vw,12px)",
          letterSpacing: 3,
          marginBottom: 8,
        }}
      >
        // {label}
      </div>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.8rem,6vw,3.5rem)",
          color: "#fff",
          margin: 0,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {title}
      </h2>
      <div
        style={{ width: 60, height: 2, background: "#00ff9f", marginTop: 16 }}
      />
    </div>
  );
}

function ResumeDownloadCard({ compact = false }) {
  return (
    <div
      style={{
        background: "rgba(0,255,160,0.04)",
        border: "1px solid rgba(0,255,160,0.2)",
        borderRadius: 4,
        padding: compact ? "1rem" : "1.2rem",
      }}
    >
      <div
        style={{
          fontFamily: "'Fira Code', monospace",
          color: "#00ff9f",
          fontSize: "clamp(10px,2vw,11px)",
          letterSpacing: 1.6,
          marginBottom: 10,
        }}
      >
        // RECRUITER QUICK ACTION
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#fff",
          fontWeight: 700,
          fontSize: "clamp(1rem,3.2vw,1.2rem)",
          marginBottom: 8,
        }}
      >
        Download Resume
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.62)",
          fontSize: "clamp(12px,2.3vw,14px)",
          lineHeight: 1.6,
          margin: "0 0 14px",
        }}
      >
        Grab a one-page summary of experience, projects, and skills for quick
        profile review.
      </p>
      <a
        href={RESUME_URL}
        download
        style={{
          display: "inline-block",
          fontFamily: "'Fira Code', monospace",
          background: "#00ff9f",
          color: "#050e0a",
          padding: "10px 16px",
          fontSize: "clamp(10px,2.2vw,12px)",
          fontWeight: 700,
          letterSpacing: 1,
          textDecoration: "none",
          borderRadius: 2,
        }}
      >
        ./download-resume
      </a>
    </div>
  );
}

function HeroSection() {
  const [typed, setTyped] = useState("");
  const width = useWindowWidth();
  const isMobile = width < 768;
  const roleRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const role = HERO_ROLES[roleRef.current];
      if (!deletingRef.current) {
        if (charRef.current <= role.length) {
          setTyped(role.slice(0, charRef.current));
          charRef.current++;
        } else {
          setTimeout(() => {
            deletingRef.current = true;
          }, 1400);
        }
      } else {
        if (charRef.current > 0) {
          charRef.current--;
          setTyped(role.slice(0, charRef.current));
        } else {
          deletingRef.current = false;
          roleRef.current = (roleRef.current + 1) % HERO_ROLES.length;
        }
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(1.2rem,6vw,10rem)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "minmax(0,700px) minmax(260px,1fr)",
          gap: isMobile ? 0 : "clamp(1.5rem,5vw,5rem)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            width: "100%",
            paddingTop: 80,
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              color: "#00ff9f",
              fontSize: "clamp(11px,2.5vw,13px)",
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            &gt; Hello, World. I'm
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.4rem,9vw,6rem)",
              color: "#fff",
              margin: "0 0 0.5rem",
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Kartik
            <br />
            <span style={{ color: "#00ff9f" }}>Raghuwanshi</span>
          </h1>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: "clamp(0.85rem,3vw,1.4rem)",
              color: "rgba(255,255,255,0.6)",
              marginBottom: 24,
              minHeight: 36,
            }}
          >
            <span style={{ color: "#00ff9f" }}>&gt;</span> {typed}
            <span style={{ animation: "blink 1s infinite", color: "#00ff9f" }}>
              |
            </span>
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px,2.5vw,16px)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: 520,
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            B.Tech CS @ IIIT Sri City · Knight @Leetcode · Pupil @Codeforces ·
            <br /> 2* @Codechef · Crafting scalable backends and clean
            frontends.
          </p>
          <div
            style={{
              display: "flex",
              gap: "clamp(10px,3vw,16px)",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#projects"
              style={{
                fontFamily: "'Fira Code', monospace",
                background: "#00ff9f",
                color: "#050e0a",
                padding: "clamp(10px,2.5vw,12px) clamp(16px,4vw,28px)",
                fontSize: "clamp(11px,2.5vw,13px)",
                fontWeight: 700,
                letterSpacing: 1.5,
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              ./view-projects
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: "'Fira Code', monospace",
                background: "transparent",
                color: "#00ff9f",
                padding: "clamp(10px,2.5vw,12px) clamp(16px,4vw,28px)",
                fontSize: "clamp(11px,2.5vw,13px)",
                fontWeight: 700,
                letterSpacing: 1.5,
                border: "1px solid #00ff9f",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              ./contact-me
            </a>
          </div>
          <div
            style={{
              display: "flex",
              gap: "clamp(16px,5vw,24px)",
              marginTop: "clamp(28px,5vw,48px)",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "700+", sub: "Problems Accepted" },
              { label: "1875", sub: "Peak Rating" },
              { label: "2+", sub: "Production Apps" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.3rem,5vw,2.2rem)",
                    color: "#00ff9f",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "clamp(9px,2vw,10px)",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: 1,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
          {isMobile && (
            <div style={{ marginTop: 20, maxWidth: 460 }}>
              <ResumeDownloadCard compact />
            </div>
          )}
        </div>
        {!isMobile && (
          <aside
            style={{
              width: "100%",
              maxWidth: 400,
              justifySelf: "end",
            }}
          >
            <ResumeDownloadCard />
          </aside>
        )}
      </div>
    </section>
  );
}

function AboutSection() {
  const width = useWindowWidth();
  const isMobile = width < 768;

  return (
    <section
      id="about"
      style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
      }}
    >
      <SectionTitle label="001" title="About Me" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "clamp(2rem,5vw,4rem)",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px,2.5vw,16px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 2,
              marginBottom: 24,
            }}
          >
            I'm a{" "}
            <span style={{ color: "#00ff9f" }}>third-year CS student</span> at
            IIIT Sri City with a passion for building robust backend systems and
            solving complex algorithmic problems.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px,2.5vw,16px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 2,
              marginBottom: 32,
            }}
          >
            My interest spans across system design, competitive programming, and
            crafting full-stack applications that are both performant and
            intuitive.
          </p>
          <div
            style={{
              background: "rgba(0,255,160,0.04)",
              border: "1px solid rgba(0,255,160,0.15)",
              padding: "1.5rem",
              borderRadius: 4,
              fontFamily: "'Fira Code', monospace",
              fontSize: "clamp(11px,2vw,12px)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 2,
              overflowX: "auto",
            }}
          >
            <span style={{ color: "#00ff9f" }}>const</span> kartik = {"{"}
            <br />
            &nbsp;&nbsp;college:{" "}
            <span style={{ color: "#e8a87c" }}>"IIIT Sri City"</span>,<br />
            &nbsp;&nbsp;year: <span style={{ color: "#79b8ff" }}>3</span>,<br />
            &nbsp;&nbsp;cgpa: <span style={{ color: "#79b8ff" }}>7.79</span>,
            <br />
            &nbsp;&nbsp;email:{" "}
            <span style={{ color: "#e8a87c" }}>
              "raghu1ckartik.rk@gmail.com"
            </span>
            <br />
            {"}"};
          </div>
        </div>
        <div style={{ marginTop: isMobile ? "2rem" : 0 }}>
          {[
            {
              label: "LeetCode",
              value: "Knight · 1875 Rating",
              color: "#f89820",
              href: "https://leetcode.com/u/codeBlind007/",
              logo: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                  <path
                    d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
                    fill="#f89820"
                  />
                </svg>
              ),
            },
            {
              label: "CodeChef",
              value: "2★ · Max 1407 · Top 2826",
              color: "#b17a56",
              href: "https://codechef.com/users/codeblind007",
              logo: (
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path
                    d="M11.257.004C7.37.072 3.693 2.98 2.7 6.653c-.463 1.685-.198 3.437-.268 5.155-.08 1.795-.551 3.636-1.7 5.054C.104 17.67-.498 19.542.474 20.797c.674.863 1.905 1.074 2.95.762 1.045-.313 1.899-1.05 2.716-1.773a20.453 20.453 0 0 0 2.039-2.144c.361.26.753.477 1.166.645-1.009 1.075-2.031 2.249-2.36 3.72-.232 1.032.029 2.277 1.004 2.753.693.336 1.512.127 2.168-.23.656-.356 1.202-.886 1.738-1.406.537.52 1.082 1.049 1.737 1.406.656.357 1.475.567 2.169.23.974-.476 1.236-1.72 1.003-2.753-.329-1.47-1.35-2.644-2.359-3.72.413-.167.806-.384 1.166-.644a20.47 20.47 0 0 0 2.04 2.143c.816.724 1.67 1.46 2.715 1.773 1.045.312 2.276.1 2.95-.762.972-1.255.37-3.127-.258-4.43-1.148-1.418-1.619-3.26-1.7-5.054-.069-1.718.196-3.47-.267-5.155C20.258 2.866 16.39-.073 12.401.004h-1.144zm.77 1.127c.217.006.434.019.65.038 2.674.239 5.24 1.984 6.35 4.448.632 1.396.65 2.952.642 4.464-.008 2.012.417 4.069 1.558 5.739.516.843 1.349 1.616 1.313 2.668-.026.733-.634 1.37-1.34 1.582-.706.213-1.457-.004-2.097-.356-1.28-.7-2.22-1.836-3.104-2.955.74-.811 1.304-1.797 1.59-2.866.22-.82.24-1.706-.035-2.515-.328-.966-1.073-1.736-1.974-2.182-.897-.444-1.926-.576-2.916-.512-.988.064-1.984.348-2.815.906-.824.553-1.459 1.384-1.741 2.33-.255.852-.199 1.77.055 2.617.302 1.011.88 1.934 1.624 2.694-.819 1.072-1.736 2.164-2.977 2.818-.642.34-1.376.543-2.07.334-.694-.208-1.293-.824-1.336-1.546-.055-1.04.751-1.812 1.258-2.653 1.14-1.67 1.567-3.727 1.558-5.739-.007-1.512.01-3.068.642-4.464 1.068-2.358 3.483-4.081 6.032-4.427.306-.042.612-.067.918-.073l.015-.09zm-.018 8.005c.617-.01 1.24.102 1.808.38.698.34 1.268.946 1.531 1.678.317.885.22 1.895-.178 2.737-.434.918-1.21 1.659-2.12 2.098-.468.225-.988.35-1.502.363a4.12 4.12 0 0 1-1.498-.306c-.929-.386-1.73-1.1-2.196-2.001-.44-.854-.563-1.876-.278-2.793.258-.832.83-1.554 1.571-2.01.567-.352 1.232-.536 1.862-.146zm-.043 1.02a2.982 2.982 0 0 0-1.415.444c-.57.355-1.014.913-1.213 1.558-.22.709-.125 1.506.236 2.148.373.665.997 1.187 1.717 1.453.384.143.796.199 1.2.173.459-.03.91-.168 1.312-.397.766-.44 1.34-1.171 1.576-2.017.208-.742.118-1.565-.27-2.225-.3-.506-.774-.91-1.322-1.12a2.974 2.974 0 0 0-1.821-.017zm-4.28 8.682c.34.107.687.185 1.038.234-.176.39-.394.772-.66 1.118a5.46 5.46 0 0 1-.67-.645c.097-.24.188-.48.292-.707zm8.644 0c.104.228.196.468.293.708a5.46 5.46 0 0 1-.672.644 5.544 5.544 0 0 1-.659-1.118c.352-.05.698-.127 1.038-.234zm-4.323.545c.268 0 .537.01.803.034-.154.35-.328.695-.534 1.018a6.28 6.28 0 0 1-.537-1.018c.09-.008.179-.018.268-.034zm-2.423.39c.285.493.613.963.99 1.389-.466.469-.964.94-1.546 1.224-.34.165-.75.267-1.1.113-.35-.155-.508-.551-.488-.918.054-1.013.826-1.9 1.594-2.548a5.1 5.1 0 0 0 .55.74zm4.845 0c.183-.243.375-.484.55-.74.768.648 1.54 1.535 1.594 2.548.02.367-.138.763-.488.918-.35.154-.76.052-1.1-.113-.582-.284-1.08-.755-1.546-1.224.377-.426.705-.896.99-1.389z"
                    fill="#b17a56"
                  />
                </svg>
              ),
            },
            {
              label: "Codeforces",
              value: "Pupil · Max Rating 1244",
              color: "#1a8cff",
              href: "https://codeforces.com/profile/codeblind007",
              logo: (
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path
                    d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9A1.5 1.5 0 0 1 1.5 7.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5A1.5 1.5 0 0 1 22.5 21h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"
                    fill="#1a8cff"
                  />
                </svg>
              ),
            },
          ].map((cp) => (
            <a
              key={cp.label}
              href={cp.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,255,160,0.1)",
                padding: "1.2rem 1.5rem",
                marginBottom: 12,
                borderRadius: 4,
                textDecoration: "none",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${cp.color}10`;
                e.currentTarget.style.borderColor = `${cp.color}55`;
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(0,255,160,0.1)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: `${cp.color}18`,
                  border: `1px solid ${cp.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {cp.logo}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "clamp(13px,3vw,15px)",
                  }}
                >
                  {cp.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "clamp(10px,2vw,11px)",
                    color: cp.color,
                    marginTop: 3,
                  }}
                >
                  {cp.value}
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 16,
                  color: `${cp.color}66`,
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </a>
          ))}
          <div
            style={{
              background: "rgba(0,255,160,0.04)",
              border: "1px solid rgba(0,255,160,0.15)",
              padding: "1.2rem 1.5rem",
              borderRadius: 4,
              marginTop: 12,
            }}
          >
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "clamp(10px,2vw,11px)",
                color: "#00ff9f",
                marginBottom: 8,
                letterSpacing: 2,
              }}
            >
              // EDUCATION
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#fff",
                fontWeight: 700,
                fontSize: "clamp(13px,2.5vw,14px)",
              }}
            >
              B.Tech Computer Science
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.45)",
                fontSize: "clamp(11px,2vw,12px)",
                marginTop: 4,
              }}
            >
              IIIT Sri City · Aug 2023 – Jul 2027 · CGPA 7.79
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section
      id="experience"
      style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
      }}
    >
      <SectionTitle label="002" title="Experience" />
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: "linear-gradient(180deg, #00ff9f, transparent)",
          }}
        />
        {[
          {
            role: "SDE Intern",
            company: "DNote",
            period: "July 2025 – Aug 2025",
            color: "#00ff9f",
            points: [
              "Engineered 4–5 AI-powered features end-to-end across React.js, Node.js, Express, PostgreSQL & Supabase.",
              "Optimized UI/UX, reducing user interaction friction by 30% and improving engagement.",
              "Deployed Supabase Edge Functions + Groq AI APIs, cutting response latency by 20%.",
            ],
            tags: ["React.js", "Node.js", "PostgreSQL", "Supabase", "Groq AI"],
          },
          {
            role: "Tech Club Committee Member",
            company: "Gradient Coding Club – IIIT Sricity",
            period: "Aug 2025 – Present",
            color: "#79b8ff",
            points: [
              "Organized coding contests and mentored juniors in Data Structures & Algorithms.",
              "Led structured DSA sessions covering problem-solving strategies and key concepts.",
              "Contributed to decision-making on club initiatives to maximize student engagement.",
            ],
            tags: ["DSA", "Mentoring", "CP", "Contests"],
          },
        ].map((exp, i) => (
          <div
            key={i}
            style={{
              paddingLeft: "clamp(1.5rem,5vw,2.5rem)",
              paddingBottom: "clamp(2rem,5vw,3rem)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -5,
                top: 6,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: exp.color,
                boxShadow: `0 0 12px ${exp.color}`,
              }}
            />
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "clamp(10px,2vw,11px)",
                color: exp.color,
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              {exp.period}
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.1rem,4vw,1.6rem)",
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {exp.role}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.4)",
                fontSize: "clamp(12px,2.5vw,13px)",
                marginBottom: 16,
              }}
            >
              @ {exp.company}
            </div>
            <ul
              style={{
                margin: "0 0 16px",
                paddingLeft: "clamp(16px,4vw,20px)",
              }}
            >
              {exp.points.map((p, j) => (
                <li
                  key={j}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "clamp(13px,2.5vw,14px)",
                    lineHeight: 1.8,
                    marginBottom: 6,
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
            <div>
              {exp.tags.map((t) => (
                <Badge key={t} color={exp.color}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  title,
  subtitle,
  description,
  tags,
  link,
  accent = "#00ff9f",
  emoji,
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,255,160,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? accent : "rgba(0,255,160,0.1)"}`,
        borderRadius: 4,
        padding: "clamp(1.2rem,4vw,2rem)",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 20px 60px rgba(0,255,160,0.1)` : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "clamp(24px,5vw,32px)", marginBottom: 12 }}>
        {emoji}
      </div>
      <div
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: "clamp(9px,2vw,10px)",
          color: accent,
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        {subtitle}
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.1rem,4vw,1.4rem)",
          color: "#fff",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px,2.5vw,14px)",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.8,
          marginBottom: 20,
        }}
      >
        {description}
      </p>
      <div style={{ marginBottom: 20 }}>
        {tags.map((t) => (
          <Badge key={t} color={accent}>
            {t}
          </Badge>
        ))}
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: "'Fira Code', monospace",
            color: accent,
            fontSize: "clamp(10px,2vw,11px)",
            letterSpacing: 2,
            textDecoration: "none",
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 2,
          }}
        >
          ./view-project →
        </a>
      )}
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
      }}
    >
      <SectionTitle label="003" title="Projects" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: "clamp(1rem,3vw,1.5rem)",
        }}
      >
        <ProjectCard
          emoji="✈️"
          title="TripSync"
          subtitle="FULL-STACK · REAL-TIME"
          description="Collaborative platform for trip planning, expense tracking & itinerary management. Features real-time group chat via Socket.io boosting coordination by 40%, background job processing with Redis + BullMQ, and scalable APIs backed by Node.js, Express & MongoDB."
          tags={[
            "Next.js",
            "TypeScript",
            "Socket.io",
            "MongoDB",
            "Redis",
            "BullMQ",
            "Tailwind CSS",
            "shadcn/ui",
          ]}
          link="https://app.tripsync.codeblind007.dev"
          accent="#00ff9f"
        />
        <ProjectCard
          emoji="💰"
          title="FinanceVisualizer"
          subtitle="FULL-STACK · DATA VIZ"
          description="Finance dashboard handling 500+ transactions with full CRUD, form validation, and a responsive UI with 35% better usability. Recharts powers monthly trends, category pie charts & budget vs actual views — plus real-time budget alerts that cut overspending by 25%."
          tags={["Next.js", "TypeScript", "MongoDB", "Recharts", "Node.js"]}
          link="https://personal-finance-visualizer-jet.vercel.app/"
          accent="#79b8ff"
        />
      </div>
    </section>
  );
}

function SkillsSection() {
  const categories = [
    {
      label: "// Languages",
      icon: "⌨️",
      color: "#00ff9f",
      items: ["C", "C++", "Java", "JavaScript", "TypeScript"],
    },
    {
      label: "// Frameworks",
      icon: "🧩",
      color: "#79b8ff",
      items: [
        "React.js",
        "Next.js",
        "Node.js",
        "Express",
        "Redux",
        "Socket.IO",
        "Tailwind CSS",
      ],
    },
    {
      label: "// Databases",
      icon: "🗄️",
      color: "#e8a87c",
      items: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Supabase"],
    },
    {
      label: "// DevTools",
      icon: "🔧",
      color: "#f78fb3",
      items: ["Git", "GitHub", "Linux", "Postman", "Vercel"],
    },
    {
      label: "// DSA & CP",
      icon: "⚔️",
      color: "#f89820",
      items: [
        "Data Structures",
        "Algorithms",
        "Dynamic Programming",
        "Graph Theory",
        "Problem Solving",
      ],
    },
  ];
  return (
    <section
      id="skills"
      style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
      }}
    >
      <SectionTitle label="004" title="Tech Stack" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
          gap: "clamp(0.8rem,2vw,1.2rem)",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.label}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(0,255,160,0.1)",
              borderRadius: 4,
              padding: "clamp(1rem,3vw,1.5rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: "clamp(15px,3vw,18px)" }}>
                {cat.icon}
              </span>
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "clamp(10px,2vw,11px)",
                  color: cat.color,
                  letterSpacing: 2,
                }}
              >
                {cat.label}
              </span>
            </div>
            <div>
              {cat.items.map((item) => (
                <Badge key={item} color={cat.color}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      if (typeof window.emailjs !== "undefined") {
        await window.emailjs.send(
          SERVICE_ID,
          NOTIFY_TEMPLATE_ID,
          {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          },
          PUBLIC_KEY,
        );
        await window.emailjs.send(
          SERVICE_ID,
          REPLY_TEMPLATE_ID,
          {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          },
          PUBLIC_KEY,
        );
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        window.location.href = `mailto:kartik.r23@iiits.in?subject=Portfolio Contact from ${form.name}&body=${form.message}`;
        setStatus("success");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(0,255,160,0.2)",
    color: "#fff",
    padding: "12px 16px",
    fontSize: "clamp(13px,2.5vw,14px)",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    borderRadius: 3,
    boxSizing: "border-box",
    marginBottom: 16,
    transition: "border 0.2s",
  };

  return (
    <section
      id="contact"
      style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
      }}
    >
      <SectionTitle label="005" title="Get In Touch" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "clamp(2rem,5vw,4rem)",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px,2.5vw,16px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.9,
              marginBottom: 32,
            }}
          >
            I'm always open to internship opportunities, collaborations, or just
            a good conversation about tech, DSA, or system design. Drop a
            message!
          </p>
          {[
            {
              label: "Email",
              value: "raghu1ckartik.rk@gmail.com",
              href: "mailto:raghu1ckartik.rk@gmail.com",
            },
            {
              label: "LinkedIn",
              value: "linkedin.com/in/kartik-raghuwanshi",
              href: "https://linkedin.com/in/kartik-raghuwanshi-5a2b83267",
            },
            {
              label: "GitHub",
              value: "github.com/Kartik-Raghuwanshi",
              href: "https://github.com/codeBlind007",
            },
            {
              label: "Phone",
              value: "+91 8269229339",
              href: "tel:+918269229339",
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 12,
                padding: "12px 16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,255,160,0.08)",
                borderRadius: 3,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "clamp(9px,2vw,10px)",
                  color: "#00ff9f",
                  letterSpacing: 1,
                  minWidth: 55,
                  flexShrink: 0,
                }}
              >
                {c.label}
              </span>
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(12px,2.5vw,13px)",
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                {c.value}
              </a>
            </div>
          ))}
        </div>
        <div style={{ marginTop: isMobile ? "2rem" : 0 }}>
          <div
            style={{
              background: "rgba(0,255,160,0.03)",
              border: "1px solid rgba(0,255,160,0.15)",
              padding: "clamp(1.2rem,4vw,2rem)",
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "clamp(10px,2vw,11px)",
                color: "#00ff9f",
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              $ send_message --to="kartik"
            </div>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={inputStyle}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              type="email"
              style={inputStyle}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              style={{ ...inputStyle, resize: "vertical", marginBottom: 20 }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                fontFamily: "'Fira Code', monospace",
                background: loading ? "rgba(0,255,160,0.4)" : "#00ff9f",
                color: "#050e0a",
                padding: "12px 32px",
                fontSize: "clamp(11px,2.5vw,13px)",
                fontWeight: 700,
                letterSpacing: 1.5,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                width: "100%",
                transition: "all 0.2s",
                borderRadius: 2,
              }}
            >
              {loading ? "Sending..." : "./send-message →"}
            </button>
            {status === "success" && (
              <div
                style={{
                  fontFamily: "'Fira Code', monospace",
                  color: "#00ff9f",
                  fontSize: 12,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                ✓ Message sent successfully!
              </div>
            )}
            {status === "error" && (
              <div
                style={{
                  fontFamily: "'Fira Code', monospace",
                  color: "#ff6b6b",
                  fontSize: 12,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                ✗ Failed to send. Try emailing directly.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "2rem clamp(1.2rem,6vw,10rem)",
        borderTop: "1px solid rgba(0,255,160,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: "'Fira Code', monospace",
          color: "rgba(255,255,255,0.25)",
          fontSize: "clamp(10px,2vw,11px)",
          letterSpacing: 1,
        }}
      >
        © 2025 Kartik Raghuwanshi · Built with React
      </span>
      <span
        style={{
          fontFamily: "'Fira Code', monospace",
          color: "#00ff9f",
          fontSize: "clamp(10px,2vw,11px)",
          letterSpacing: 1,
        }}
      >
        &gt; exit 0
      </span>
    </footer>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Space+Grotesk:wght@400;700;800;900&family=DM+Sans:wght@400;500&display=swap";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    document.head.appendChild(script);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: #050e0a; color: #fff; overflow-x: hidden; }
      #root { width: 100%; min-height: 100vh; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #050e0a; }
      ::-webkit-scrollbar-thumb { background: #00ff9f44; border-radius: 2px; }
      input:focus, textarea:focus { border-color: rgba(0,255,160,0.5) !important; }
      @media (max-width: 480px) {
        h1 { letter-spacing: -1px !important; }
      }
    `;
    document.head.appendChild(style);

    const metaViewport = document.querySelector("meta[name=viewport]");
    if (!metaViewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0";
      document.head.appendChild(meta);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.3 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#050e0a", minHeight: "100vh" }}>
      <TerminalBoot onDone={() => setBooted(true)} />
      <SystemBackground />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          opacity: booted ? 1 : 0,
          transition: "opacity 0.8s 0.2s",
        }}
      >
        <NavBar active={active} setActive={setActive} />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
