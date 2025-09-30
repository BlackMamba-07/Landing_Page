(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    siteNav
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => siteNav.classList.remove("is-open"))
      );
  }

  // Sticky header state
  const header = document.querySelector(".site-header");
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) header.classList.add("is-stuck");
        else header.classList.remove("is-stuck");
      });
    },
    { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
  );
  headerObserver.observe(document.body);

  // Active menu highlight
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.6 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // Scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Parallax hero
  const hero = document.querySelector("[data-parallax]");
  const heroBg = document.querySelector(".hero-bg");
  if (hero && heroBg) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(
          Math.max((0 - rect.top) / Math.max(1, rect.height), 0),
          1
        );
        heroBg.style.transform = `translateY(${progress * 40}px) scale(1.02)`;
      },
      { passive: true }
    );
  }

  // KPI counters
  const nums = document.querySelectorAll(".kpi .num");
  const animateNum = (el) => {
    const target = parseInt(el.getAttribute("data-count") || "0", 10);
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".num").forEach(animateNum);
          kpiObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".kpis").forEach((k) => kpiObserver.observe(k));

  // Contact form (demo-only)
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Merci, votre message a été envoyé !";
      }
      form.reset();
    });
  }
})();
