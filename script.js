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
// PARALLAX — full-page: sky fixed, building descends right
// =====================================================
(function initParallax() {
  const wrapper = document.getElementById("parallaxWrapper");
  const sky     = document.getElementById("parallaxSky");
  const bld     = document.getElementById("parallaxBuilding");
  if (!wrapper || !sky || !bld) return;

  const SKY_SPEED = 0.06;       // very subtle sky drift
  const BLD_SPEED = 1.1;        // strong building rise

  // measure building image real height after load
  const bldImg = bld.querySelector("img");

  function onScroll() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperH    = wrapper.offsetHeight;
    const scrolled    = Math.max(-wrapperRect.top, 0);

    // hide fixed layers once we exit the parallax zone
    const inZone = wrapperRect.top < window.innerHeight && wrapperRect.bottom > 0;
    sky.classList.toggle("hidden", !inZone);
    bld.classList.toggle("hidden", !inZone);
    document.querySelector(".parallax-overlay").classList.toggle("hidden", !inZone);

    if (!inZone) return;

    // sky — small upward drift
    sky.style.transform = `translateY(-${scrolled * SKY_SPEED}px)`;

    // building — starts at top:100vh (CSS), moves UP strongly
    // so it rises into view as user scrolls
    bld.style.transform = `translateY(-${scrolled * BLD_SPEED}px)`;
  }
  }

  // Observe panels for fade-in
  const panelObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          panelObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  document.querySelectorAll(".px-panel").forEach((p) => panelObs.observe(p));

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// =====================================================
// VELVET CANVAS — micro fibres that react to the mouse
// =====================================================
(function initVelvet() {
  const canvas = document.getElementById("velvet-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  const FIBRE_SPACING = 10;      // px between fibres
  const FIBRE_LEN = 5;           // base length (short — velvet)
  const INFLUENCE = 120;          // px radius of mouse influence
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
          ? 30 + Math.round(18 * (1 - dist / INFLUENCE))
          : 30;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(0,${brightness},10,0.25)`;
        ctx.lineWidth = 1;
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
