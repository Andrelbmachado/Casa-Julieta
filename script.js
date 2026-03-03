/* Casa Julieta — Scripts */

// ---- Always start at top on reload ----
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
window.addEventListener('beforeunload', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// ---- Intro animation (GSAP) — hi-res title ----
(function () {
  if (typeof gsap === 'undefined') return;

  var hires    = document.getElementById('introHires');
  var brand    = document.querySelector('.brand');
  var navLine  = document.getElementById('navLine');
  var mainNav  = document.querySelector('.main-nav');
  var navLinks = mainNav ? Array.from(mainNav.querySelectorAll('a')) : [];
  var heroCta  = document.querySelector('.hero-cta');

  if (!hires || !brand || !navLine || !mainNav) return;

  document.body.style.overflow = 'hidden';

  function run() {
    /* ---- measure targets ---- */
    var brandRect = brand.getBoundingClientRect();
    var brandCx   = brandRect.left + brandRect.width / 2;
    var brandCy   = brandRect.top  + brandRect.height / 2;

    var hiresRect  = hires.getBoundingClientRect();
    var hiresW     = hiresRect.width;   // native rendered width at scale 1
    var brandW     = brandRect.width;
    var endScale   = brandW / hiresW;   // exact ratio to match brand size

    var navLineRect = navLine.getBoundingClientRect();
    var navCenterX  = navLineRect.left + navLineRect.width / 2;
    var offsets = navLinks.map(function (link) {
      var r = link.getBoundingClientRect();
      return navCenterX - (r.left + r.width / 2);
    });

    /* ---- initial states ---- */
    gsap.set(brand, { visibility: 'hidden' });
    gsap.set(hires, { opacity: 0, scale: 0.3 });
    gsap.set(navLine, { scaleX: 0 });
    navLinks.forEach(function (link, i) {
      gsap.set(link, { x: offsets[i], opacity: 0 });
    });
    if (heroCta) gsap.set(heroCta, { opacity: 0 });

    /* ---- timeline ---- */
    var tl = gsap.timeline({
      onComplete: function () {
        document.body.style.overflow = '';
      }
    });

    /* 0–0.3s: fade in hi-res title at center */
    tl.to(hires, { opacity: 1, duration: 0.3, ease: 'power1.in' }, 0);

    /* 0–2s: title grows from small to full size */
    tl.to(hires, { scale: 1, duration: 2, ease: 'power2.out' }, 0);

    /* 2–3s: title shrinks & flies to brand position */
    tl.to(hires, {
      left: brandCx,
      top: brandCy,
      scale: endScale,
      duration: 1,
      ease: 'power3.inOut',
      onComplete: function () {
        /* swap: show real brand, remove hi-res */
        gsap.set(brand, { visibility: 'visible' });
        hires.remove();
      }
    }, 2);

    /* 2–3s: gold line grows from center */
    tl.to(navLine, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 2);

    /* 2–3s: nav links spread from center */
    tl.to(navLinks, { x: 0, opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.05 }, 2);

    /* 3–3.5s: hero CTA fades in */
    if (heroCta) tl.to(heroCta, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 3);
  }

  /* wait for fonts so measurements are accurate */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      requestAnimationFrame(run);
    });
  } else {
    window.addEventListener('load', run);
  }
})();

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
// MAGNETIC CURSOR — btn-gold buttons
// =====================================================
(function initMagneticBtn() {
  if ('ontouchstart' in window) return;

  // Create circle element
  const circle = document.createElement('div');
  circle.className = 'magnetic-circle';
  circle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#003912" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
  document.body.appendChild(circle);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let active = false;
  let currentBtn = null;
  const EASE = 0.18;
  const MAGNETIC_STRENGTH = 0.35; // how strongly it pulls back (0-1)

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    if (active && currentBtn) {
      const rect = currentBtn.getBoundingClientRect();
      const btnCx = rect.left + rect.width / 2;
      const btnCy = rect.top + rect.height / 2;

      // Magnetic: blend mouse pos toward button center
      const targetX = mx + (btnCx - mx) * MAGNETIC_STRENGTH;
      const targetY = my + (btnCy - my) * MAGNETIC_STRENGTH;

      cx += (targetX - cx) * EASE;
      cy += (targetY - cy) * EASE;
    } else {
      cx += (mx - cx) * 0.3;
      cy += (my - cy) * 0.3;
    }

    circle.style.left = cx + 'px';
    circle.style.top = cy + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('.btn-gold').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      active = true;
      currentBtn = btn;
      circle.classList.add('active');
      document.body.style.cursor = 'none';
    });

    btn.addEventListener('mouseleave', () => {
      active = false;
      currentBtn = null;
      circle.classList.remove('active');
      document.body.style.cursor = '';
    });

    // Click the circle -> navigate
    btn.style.pointerEvents = 'auto';
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
