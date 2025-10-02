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
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.querySelector(".hero-control.prev");
  const nextBtn = document.querySelector(".hero-control.next");
  let slideIndex = 0;
  let sliderTimer;
  const goTo = (i) => {
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    slideIndex = i;
  };
  const next = () => goTo((slideIndex + 1) % Math.max(slides.length, 1));
  const prev = () =>
    goTo((slideIndex - 1 + slides.length) % Math.max(slides.length, 1));
  if (hero && slides.length) {
    goTo(0);
    sliderTimer = setInterval(next, 4000);
    function resetTimer() {
      clearInterval(sliderTimer);
      sliderTimer = setInterval(next, 4000);
    }
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(
          Math.max((0 - rect.top) / Math.max(1, rect.height), 0),
          1
        );
        const active = document.querySelector(".hero-slide.is-active");
        if (active)
          active.style.transform = `translateY(${progress * 40}px) scale(1.02)`;
      },
      { passive: true }
    );
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        prev();
      });
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        next();
      });
    }
  }
  // Témoignages - slider 3 par écran
  const testiTrack = document.querySelector(".testi-track");
  const testiPrev = null;
  const testiNext = null;
  const testiCards = document.querySelectorAll(".testi-card");
  if (testiTrack && testiCards.length) {
    let tIndex = 0;
    const perView = () =>
      window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const maxIndex = () =>
      Math.max(0, Math.ceil(testiCards.length / perView()) - 1);
    const sync = () => {
      const pct = -(tIndex * 100);
      testiTrack.style.transform = `translateX(${pct}%)`;
    };
    const go = (i) => {
      tIndex = Math.max(0, Math.min(maxIndex(), i));
      sync();
    };
    const nextT = () => go(tIndex + 1);
    const prevT = () => go(tIndex - 1);
    let testiTimer = setInterval(nextT, 4000);
    const viewport = document.querySelector(".testi-viewport");
    if (viewport) {
      viewport.addEventListener("mouseenter", () => {
        clearInterval(testiTimer);
      });
      viewport.addEventListener("mouseleave", () => {
        testiTimer = setInterval(nextT, 4000);
      });
    }
    window.addEventListener("resize", () => go(tIndex));
    sync();
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

  // Réalisations - filtres
  const filterBtns = document.querySelectorAll(".filter-btn");
  const works = document.querySelectorAll(".work");
  if (filterBtns.length && works.length) {
    const applyFilter = (cat) => {
      works.forEach((w) => {
        const ok = cat === "all" || w.getAttribute("data-category") === cat;
        w.style.display = ok ? "" : "none";
      });
    };
    filterBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyFilter(btn.getAttribute("data-filter"));
      })
    );
    applyFilter("all");
  }

  // Contact form (demo-only)
  // Formulaire supprimé au profit de la carte (aucune action ici)
})();

/// HERO - Swiper
const heroSwiper = new Swiper(".hero-swiper", {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  effect: "fade", // ou "slide"
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
