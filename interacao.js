(function () {
  const slider = document.querySelector(".slider");
  if (!slider) return;

  const track = slider.querySelector(".track");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsWrap = document.querySelector(".dots");

  let index = 0;
  let timer = null;

  const autoplay = slider.dataset.autoplay === "true";
  const interval = Number(slider.dataset.interval || 6000);

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
    restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    timer = setInterval(next, interval);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restartAutoplay() {
    if (!autoplay) return;
    startAutoplay();
  }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  // Pause on hover/focus
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", startAutoplay);

  // Optional: swipe (mobile)
  let startX = null;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    startX = null;

    if (Math.abs(diff) > 40) {
      diff > 0 ? prev() : next();
    }
  });

  update();
  startAutoplay();
})();
