/* Casa Julieta — Scripts */

// ---- Year ----
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Scroll fade-up ----
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        fadeObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
);
document.querySelectorAll(".fade-up").forEach((el) => fadeObserver.observe(el));

// ---- Mobile menu ----
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// ---- Page transitions ----
document.querySelectorAll('a[href$=".html"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    e.preventDefault();
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";
    setTimeout(() => (window.location.href = href), 260);
  });
});

// =====================================================
// CUBE GRID — squares that jump when hovered
// =====================================================
(function initCubeGrid() {
  const canvas = document.getElementById("velvet-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  const SIZE = 28;             // cube face size
  const GAP = 4;               // gap between cubes
  const STEP = SIZE + GAP;
  const INFLUENCE = 200;       // px radius of mouse influence
  const MAX_JUMP = 22;         // max jump height in px
  const SPRING = 0.1;          // how fast cubes return
  let mouse = { x: -9999, y: -9999 };

  let cols, rows, cubes; // { y: current jump offset, target }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / STEP) + 1;
    rows = Math.ceil(H / STEP) + 1;
    cubes = new Array(cols * rows);
    for (let i = 0; i < cubes.length; i++) {
      cubes[i] = { jump: 0, target: 0 };
    }
  }

  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Colors
  const FACE_COLOR   = "rgba(0,48,16,0.6)";
  const TOP_COLOR    = "rgba(0,70,24,0.7)";
  const SHADOW_COLOR = "rgba(0,0,0,0.35)";

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const bx = c * STEP;
        const by = r * STEP;

        const dx = mouse.x - (bx + SIZE / 2);
        const dy = mouse.y - (by + SIZE / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        const cube = cubes[idx];

        if (dist < INFLUENCE) {
          const strength = 1 - dist / INFLUENCE;
          cube.target = MAX_JUMP * strength * strength; // quadratic falloff
        } else {
          cube.target = 0;
        }

        cube.jump += (cube.target - cube.jump) * SPRING;

        const jump = cube.jump;
        const y = by - jump;

        // Shadow (stays at base, grows with jump)
        if (jump > 0.5) {
          const shadowAlpha = Math.min(jump / MAX_JUMP * 0.45, 0.45);
          const shadowSpread = jump * 0.3;
          ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
          ctx.beginPath();
          ctx.ellipse(
            bx + SIZE / 2,
            by + SIZE + 2,
            SIZE / 2 + shadowSpread,
            3 + shadowSpread * 0.5,
            0, 0, Math.PI * 2
          );
          ctx.fill();
        }

        // Brightness boost near mouse
        const bright = dist < INFLUENCE
          ? Math.round(20 * (1 - dist / INFLUENCE))
          : 0;

        // Front face
        ctx.fillStyle = `rgba(0,${48 + bright},${16 + bright},0.6)`;
        ctx.fillRect(bx, y, SIZE, SIZE);

        // Top face (lighter)
        if (jump > 0.5) {
          const topH = Math.min(jump * 0.4, 8);
          ctx.fillStyle = `rgba(0,${70 + bright},${24 + bright},0.7)`;
          ctx.beginPath();
          ctx.moveTo(bx, y);
          ctx.lineTo(bx + 4, y - topH);
          ctx.lineTo(bx + SIZE + 4, y - topH);
          ctx.lineTo(bx + SIZE, y);
          ctx.closePath();
          ctx.fill();

          // Right face (darker)
          ctx.fillStyle = `rgba(0,${30 + bright},${10 + bright},0.5)`;
          ctx.beginPath();
          ctx.moveTo(bx + SIZE, y);
          ctx.lineTo(bx + SIZE + 4, y - topH);
          ctx.lineTo(bx + SIZE + 4, y + SIZE - topH);
          ctx.lineTo(bx + SIZE, y + SIZE);
          ctx.closePath();
          ctx.fill();
        }

        // Subtle border
        ctx.strokeStyle = `rgba(0,${60 + bright},20,0.25)`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, y, SIZE, SIZE);
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// =====================================================
// BUTTON GLOW — instant light following the cursor
// =====================================================
document.querySelectorAll(".btn").forEach((btn) => {
  // Inject glow element if not present
  if (!btn.querySelector(".glow")) {
    const g = document.createElement("span");
    g.className = "glow";
    btn.appendChild(g);
  }

  const glow = btn.querySelector(".glow");

  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    glow.style.left = e.clientX - rect.left + "px";
    glow.style.top = e.clientY - rect.top + "px";
    glow.style.opacity = "1";
  });

  btn.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
});

// =====================================================
// HERO TITLE SPOTLIGHT — "lantern" follows the cursor
// =====================================================
(function initSpotlight() {
  const title = document.getElementById("heroTitle");
  if (!title) return;

  // Set data-text for the ::after pseudo element
  title.setAttribute("data-text", title.textContent);

  title.addEventListener("mousemove", (e) => {
    const rect = title.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    title.style.setProperty("--spotlight-x", x + "px");
    title.style.setProperty("--spotlight-y", y + "px");
    title.style.setProperty("--spotlight-opacity", "1");
  });

  title.addEventListener("mouseleave", () => {
    title.style.setProperty("--spotlight-opacity", "0");
  });
})();
