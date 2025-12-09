// Simple slideshow and lightbox for H Drywall test site
alert("H Drywall script loaded");
document.addEventListener("DOMContentLoaded", () => {
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
