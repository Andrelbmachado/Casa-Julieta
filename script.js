/* Casa Julieta — Scripts */

// ---- Always start at top on reload ----
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
// CANVAS REMOVED
// =====================================================

// =====================================================
// MAGNETIC CURSOR FOLLOWER — expands on "Saiba mais" hover
// =====================================================
(function initCursorFollower() {
  // Only on non-touch devices
  if ('ontouchstart' in window) return;

  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(follower);

  let mx = -100, my = -100; // mouse position
  let fx = -100, fy = -100; // follower position
  const EASE = 0.15;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    follower.classList.add('visible');
  });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      follower.classList.remove('visible');
    }
  });

  // Animate position with easing
  function tick() {
    fx += (mx - fx) * EASE;
    fy += (my - fy) * EASE;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  // Expand on .btn-gold buttons ("Saiba mais")
  document.querySelectorAll('.btn-gold').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      follower.classList.add('expanded');
    });
    btn.addEventListener('mouseleave', () => {
      follower.classList.remove('expanded');
    });
  });
})();

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
