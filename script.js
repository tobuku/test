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

// GSAP animations (stylish)
// ------------------------------
// This site is hosted on GitHub Pages, so we load GSAP via CDN in the HTML.
// If those CDN scripts fail to load, everything below is safely skipped.
if (window.gsap) {
  try {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    console.log("HDrywall GSAP init: animations armed");

    // Reduced motion support
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helpers
    const prefersHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

    const setInitial = (selector) => {
      const els = gsap.utils.toArray(selector);
      if (!els.length) return;
      gsap.set(els, { willChange: "transform,opacity,filter" });
    };

    // Make animations more obvious, but still professional:
    // - larger travel distance
    // - slight scale
    // - slight blur that resolves
    // - snappy easing
    gsap.defaults({ ease: "power3.out", duration: 0.95 });

    // Letter-splitting bounce helpers
    function klsSplitLetters(el) {
      if (!el) return;
      if (el.classList && el.classList.contains("kls-split")) return;

      const text = (el.textContent || "").trim();
      if (!text) return;

      // Ensure heading itself is visible even if other animations set opacity
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";

      el.innerHTML = "";
      const frag = document.createDocumentFragment();
      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "kls-char";
        span.textContent = ch === " " ? "\u00A0" : ch;
        frag.appendChild(span);
      }
      el.appendChild(frag);
      el.classList.add("kls-split");
    }

    function klsBounceChars(el, opts) {
      klsSplitLetters(el);

      const chars = gsap.utils.toArray(".kls-char", el);
      if (!chars.length) return;

      gsap.fromTo(
        chars,
        { y: opts.yFrom, scale: opts.scaleFrom, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: opts.duration,
          ease: "bounce.out",
          stagger: opts.stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reset"
          }
        }
      );
    }


    if (!reduceMotion) {
      // Header drop-in
      const header = document.querySelector(".site-header");
      if (header) {
        setInitial(header);
        gsap.fromTo(
          header,
          { y: -28, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
        );
      }

      // HERO: bold entrance with stagger, slight scale, and optional image parallax
      const hero = document.querySelector(".hero");
      if (hero) {
        const heroH1 = hero.querySelector("h1");
        const heroP = hero.querySelector("p");
        const heroBtns = hero.querySelectorAll(".btn");
        const heroImgs = hero.querySelectorAll("img");

        setInitial([heroP, heroBtns, heroImgs].flat());

        const tl = gsap.timeline({ delay: 0.12 });
        if (heroH1) {
          // Hero headline: 5x stronger than section headers
          klsBounceChars(heroH1, { yFrom: -1200, scaleFrom: 0.85, duration: 2.1, stagger: 0.022 });
        }
if (heroP) {
          tl.fromTo(
            heroP,
            { y: 26, opacity: 0, filter: "blur(8px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85 },
            "-=0.55"
          );
        }

        if (heroBtns && heroBtns.length) {
          tl.fromTo(
            heroBtns,
            { y: 18, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" },
            "-=0.35"
          );
        }

        if (heroImgs && heroImgs.length) {
          tl.fromTo(
            heroImgs,
            { y: 30, opacity: 0, scale: 0.96, filter: "blur(10px)" },
            { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.08 },
            "-=0.35"
          );

          // Gentle parallax on scroll (only if ScrollTrigger exists)
          if (window.ScrollTrigger) {
            heroImgs.forEach((img) => {
              gsap.to(img, {
                y: -16,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.6
                }
              });
            });
          }
        }
      }

      // Scroll reveals: more obvious and stylish
      const revealOnScroll = (selector, options = {}) => {
        if (!window.ScrollTrigger) return;
        const elements = gsap.utils.toArray(selector);
        if (!elements.length) return;

        const {
          stagger = 0.08,
          start = "top 78%",
          y = 36,
          scale = 0.985,
          rotate = 0,
          duration = 0.9
        } = options;

        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return;

          gsap.fromTo(
            el,
            { y, opacity: 0, scale, rotate, filter: "blur(10px)" },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              filter: "blur(0px)",
              duration,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        // Optional stagger for groups that share a container
        if (elements.length > 1 && stagger > 0) {
          const parent = elements[0].parentElement;
          if (parent) {
            ScrollTrigger.create({
              trigger: parent,
              start,
              onEnter: () => {
                gsap.fromTo(
                  elements,
                  { y: y * 0.8, opacity: 0, scale, filter: "blur(10px)" },
                  { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: duration * 0.9, stagger, overwrite: "auto" }
                );
              },
              once: true
            });
          }
        }
      };

      // Home sections, cards, and common blocks
      revealOnScroll("section");
      revealOnScroll(".services-grid .service-card", { stagger: 0.10, y: 44, rotate: 0.6, duration: 0.95 });
      revealOnScroll(".projects-grid .project-card", { stagger: 0.10, y: 44, rotate: -0.6, duration: 0.95 });
      revealOnScroll(".gallery-grid .gallery-item", { stagger: 0.06, y: 34, scale: 0.98, duration: 0.85 });
      revealOnScroll(".reviews-grid .review-card", { stagger: 0.10, y: 40, duration: 0.95 });
      revealOnScroll(".contact-layout > *", { stagger: 0.10, y: 34, duration: 0.9 });

      // Detail pages
      revealOnScroll(".breadcrumbs", { y: 24, duration: 0.75 });
      revealOnScroll(".service-detail, .service-detail > *", { stagger: 0.06, y: 34, duration: 0.9 });


      
            // Hero images: clip reveal (no gap artifacts)
      // Instead of translating the image (which can show container background),
      // we reveal it using clip-path so it is always visually flush.
      if (window.ScrollTrigger) {
        const heroImgs = gsap.utils.toArray(".hero-photo img, .hero-photo-large img");
        heroImgs.forEach((img, i) => {
          gsap.set(img, {
            willChange: "clip-path,transform,opacity,filter",
            clipPath: "inset(0 0 100% 0 round 18px)",
            opacity: 1,
            filter: "blur(10px)"
          });

          gsap.to(img, {
            clipPath: "inset(0 0 0% 0 round 18px)",
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
            delay: 0.15 + i * 0.08
          });

          // Optional micro-settle: very small rotation/scale to feel premium
          gsap.fromTo(
            img,
            { scale: 1.03, rotate: -1.2 },
            { scale: 1.0, rotate: 0, duration: 1.15, ease: "power3.out", delay: 0.15 + i * 0.08 }
          );
        });
      }

      // Roll images IN and lock in place (no roll-out)
// Hero images animate on load. Other images roll in on scroll and then stay locked at y:0/rotate:0.
if (window.ScrollTrigger) {
  const rollImages = gsap.utils
    .toArray(".service-photo img, .project-card img, .review-card img")
    .filter((img) => !img.classList.contains("hero-logo"));

  rollImages.forEach((img) => {
    gsap.set(img, { transformOrigin: "50% 50%", willChange: "transform,opacity" });

    gsap.fromTo(
      img,
      { y: 80, rotate: -45, opacity: 0, scale: 0.99 },
      {
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "bottom 10%",
          scrub: 0.9
        }
      }
    );
  });
}



// Gallery hover inertia (free alternative to InertiaPlugin)
// Tracks pointer velocity over the gallery and "kicks" images on hover, then springs back.
// Force gallery images to full color (prevents haze)
gsap.set("#gallery .gallery-item img", { opacity: 1, filter: "none" });

(function galleryHoverInertia() {
  const gallery = document.querySelector("#gallery");
  if (!gallery) return;

  let oldX = 0, oldY = 0, deltaX = 0, deltaY = 0;

  const update = (e) => {
    deltaX = e.clientX - oldX;
    deltaY = e.clientY - oldY;
    oldX = e.clientX;
    oldY = e.clientY;
  };

  gallery.addEventListener("pointermove", update, { passive: true });

  const imgs = gsap.utils.toArray("#gallery .gallery-item img");
  imgs.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      const kickX = gsap.utils.clamp(-260, 260, deltaX * 9.5);
const kickY = gsap.utils.clamp(-260, 260, deltaY * 9.5);
const tilt = (Math.random() - 0.5) * 30;
gsap.killTweensOf(img);

      gsap.to(img, {
        x: kickX,
        y: kickY,
        rotate: tilt,
        scale: 1.03,
        duration: 0.22,
        ease: "power4.out",
        overwrite: true
      });

      // Extra overshoot for a more "thrown" feel
      gsap.to(img, {
        x: kickX * 1.18,
        y: kickY * 1.18,
        rotate: tilt * 1.15,
        scale: 1.035,
        duration: 0.14,
        ease: "power1.inOut",
        delay: 0.08,
        overwrite: false
      });
gsap.to(img, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 1.05,
        ease: "elastic.out(1.2, 0.28)",
        delay: 0.02
      });
    });

    img.addEventListener("mouseleave", () => {
      gsap.to(img, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out"
      });
    });
  });
})();


// Bounce section headers (letter-by-letter). Re-triggers on scroll up/down.
      // Keep y: -240 for headers, as requested.
      gsap.utils.toArray("main h2, section h2").forEach((h2) => {
        // Avoid doubling on the hero headline if the site structure changes
        if (h2.closest(".hero")) return;
        klsBounceChars(h2, { yFrom: -240, scaleFrom: 0.92, duration: 1.6, stagger: 0.018 });
      });

      // Button micro interactions: more noticeable, still tasteful
      const buttons = document.querySelectorAll(".btn");
      buttons.forEach((btn) => {
        gsap.set(btn, { transformOrigin: "50% 50%", willChange: "transform" });

        if (prefersHover) {
          btn.addEventListener("mouseenter", () => gsap.to(btn, { y: -3, scale: 1.02, duration: 0.18, ease: "power2.out" }));
          btn.addEventListener("mouseleave", () => gsap.to(btn, { y: 0, scale: 1.0, duration: 0.22, ease: "power2.out" }));
        }

        btn.addEventListener("mousedown", () => gsap.to(btn, { scale: 0.98, duration: 0.08 }));
        btn.addEventListener("mouseup", () => gsap.to(btn, { scale: 1.02, duration: 0.12 }));
        btn.addEventListener("blur", () => gsap.to(btn, { scale: 1.0, duration: 0.12 }));
      });
    } else {
      console.log("HDrywall GSAP: reduced motion enabled, skipping animations");
    }
  } catch (err) {
    // If anything goes wrong with GSAP, fail silently.
    // The site should remain fully functional.
    console.warn("HDrywall GSAP error:", err);
  }
}

