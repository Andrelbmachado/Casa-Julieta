/* Casa Julieta — Scripts */

// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll-triggered fade-up animations
const faders = document.querySelectorAll(".fade-up");

const observerOpts = {
  threshold: 0.15,
  rootMargin: "0px 0px -40px 0px",
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

faders.forEach((el) => fadeObserver.observe(el));

// Mobile menu toggle
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute(
      "aria-expanded",
      nav.classList.contains("open") ? "true" : "false"
    );
  });

  // Close on link click
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth page transitions for internal links
document.querySelectorAll('a[href$=".html"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    e.preventDefault();
    document.body.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(-10px)";
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});

// Header shrink on scroll
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  });
}
