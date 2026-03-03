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
// VELVET CANVAS — micro fibres that react to the mouse
// =====================================================
(function initVelvet() {
  const canvas = document.getElementById("velvet-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  const FIBRE_SPACING = 14;      // px between fibres (larger)
  const FIBRE_LEN = 10;           // base length (taller fibres)
  const INFLUENCE = 160;          // px radius of mouse influence
  const RETURN_SPEED = 0.08;     // how fast fibres spring back
  let mouse = { x: -9999, y: -9999 };

  let cols, rows, fibres; // { angle, targetAngle }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / FIBRE_SPACING);
    rows = Math.ceil(H / FIBRE_SPACING);
    fibres = new Array(cols * rows);
    for (let i = 0; i < fibres.length; i++) {
      fibres[i] = { angle: -Math.PI / 2, target: -Math.PI / 2 };
    }
  }

  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = c * FIBRE_SPACING;
        const y = r * FIBRE_SPACING;

        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const f = fibres[idx];

        if (dist < INFLUENCE) {
          const strength = 1 - dist / INFLUENCE;
          f.target = Math.atan2(dy, dx) + Math.PI; // bend away
        } else {
          f.target = -Math.PI / 2; // upright
        }

        f.angle += (f.target - f.angle) * RETURN_SPEED;

        const ex = x + Math.cos(f.angle) * FIBRE_LEN;
        const ey = y + Math.sin(f.angle) * FIBRE_LEN;

        // slight brightness variation near mouse
        const brightness = dist < INFLUENCE
          ? 45 + Math.round(35 * (1 - dist / INFLUENCE))
          : 45;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(0,${brightness},12,0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
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
// HERO TITLE GLOW — light follows the cursor over text
// =====================================================
(function initHeroGlow() {
  const title = document.getElementById("heroTitle");
  if (!title) return;

  const glow = document.createElement("span");
  glow.className = "hero-title-glow";
  title.appendChild(glow);

  title.addEventListener("mousemove", (e) => {
    const rect = title.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + "px";
    glow.style.top = (e.clientY - rect.top) + "px";
    glow.style.opacity = "1";
  });

  title.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
})();
