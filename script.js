console.log("HDrywall GSAP init: script.js loaded");
// Simple slideshow and lightbox for H Drywall test site

document.addEventListener("DOMContentLoaded", () => {
  // Current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth in-page anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const prevBtn = document.querySelector(".slide-control.prev");
  const nextBtn = document.querySelector(".slide-control.next");

  let currentIndex = 0;
  let autoTimer = null;
  const AUTO_DELAY = 5000; // 5 seconds

  function showSlide(index) {
    if (!slides.length) return;

    // Wrap index
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    if (dots.length === slides.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    currentIndex = index;
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (slides.length) {
    showSlide(0);
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAuto();
      showSlide(currentIndex - 1);
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAuto();
      showSlide(currentIndex + 1);
      startAuto();
    });
  }

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAuto();
        showSlide(i);
        startAuto();
      });
    });
  }

  // Lightbox for gallery
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

  function openLightbox(src) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    if (lightboxImage) lightboxImage.src = "";
  }

  if (galleryItems.length) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const full = item.getAttribute("data-full");
        if (full) openLightbox(full);
      });
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target.classList.contains("lightbox-backdrop")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
});


  // ------------------------------
  // GSAP animations (optional)
  // ------------------------------
  // This site is hosted on GitHub Pages, so we load GSAP via CDN in the HTML.
  // If those CDN scripts fail to load, everything below is safely skipped.
  if (window.gsap) {
    try {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Respect reduced motion preferences
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        // Reduced motion requested: skip animations, keep everything usable.
      } else {

      // Base defaults for a consistent, professional feel
      gsap.defaults({ ease: "power2.out", duration: 0.8 });

      // Header + nav
      const header = document.querySelector(".site-header");
      if (header) {
        gsap.from(header, { y: -16, opacity: 0, duration: 0.7 });
      }

      // Hero timeline (works on home + service pages)
      const hero = document.querySelector(".hero");
      if (hero) {
        const heroTl = gsap.timeline({ delay: 0.1 });
        const heroH1 = hero.querySelector("h1");
        const heroP = hero.querySelector("p");
        const heroBtns = hero.querySelectorAll(".btn");
        const heroImgs = hero.querySelectorAll("img");

        if (heroH1) heroTl.from(heroH1, { y: 18, opacity: 0 }, 0);
        if (heroP) heroTl.from(heroP, { y: 18, opacity: 0 }, 0.08);
        if (heroBtns && heroBtns.length) heroTl.from(heroBtns, { y: 10, opacity: 0, stagger: 0.08 }, 0.16);

        if (heroImgs && heroImgs.length) {
          heroTl.from(heroImgs, { scale: 0.98, opacity: 0, stagger: 0.06, duration: 0.9 }, 0.1);
        }
      }

      // Scroll reveal helper
      function revealOnScroll(selector, opts = {}) {
        const elements = gsap.utils.toArray(selector);
        if (!elements.length || !window.ScrollTrigger) return;

        elements.forEach((el) => {
          // Skip hidden elements
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return;

          gsap.from(el, {
            opacity: 0,
            y: 22,
            duration: 0.7,
            ...opts,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }

      // Home sections + reusable blocks
      revealOnScroll(".section .container > h2");
      revealOnScroll(".section .section-intro, .section p.section-intro");
      revealOnScroll(".services-grid .service-card", { stagger: 0.06 });
      revealOnScroll(".projects-grid .project-card", { stagger: 0.06 });
      revealOnScroll(".gallery-grid .gallery-item", { stagger: 0.04 });
      revealOnScroll(".reviews-grid .review-card", { stagger: 0.06 });
      revealOnScroll(".contact-layout > *", { stagger: 0.05 });

      // Detail pages
      revealOnScroll(".breadcrumbs");
      revealOnScroll(".service-detail, .service-detail > *", { stagger: 0.04 });

      // Subtle button hover micro-interaction (GSAP-powered, but lightweight)
      const buttons = document.querySelectorAll(".btn");
      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => gsap.to(btn, { y: -2, duration: 0.18, ease: "power2.out" }));
        btn.addEventListener("mouseleave", () => gsap.to(btn, { y: 0, duration: 0.22, ease: "power2.out" }));
      });
      }
    } catch (err) {
      // If anything goes wrong with GSAP, fail silently.
      // The site should remain fully functional.
    }
  }
