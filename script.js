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

// ---- Header hide on scroll ----
(function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let lastY = 0;
  const THRESHOLD = 60;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > THRESHOLD) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }
    lastY = y;
  }, { passive: true });
})();

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
// CANVAS REMOVED
// =====================================================

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
