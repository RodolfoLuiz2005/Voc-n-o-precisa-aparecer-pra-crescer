// ============================================================
// Scroll reveal (fade + translate) para blocos de texto e cards
// ============================================================
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // pequeno atraso escalonado pros cards de passos, sem exagero
          var delay = 0;
          if (entry.target.closest(".steps-list")) {
            var siblings = Array.from(entry.target.parentElement.children);
            var index = siblings.indexOf(entry.target);
            delay = (index % 3) * 90;
          }
          setTimeout(function () {
            entry.target.classList.add("in-view");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();

// ============================================================
// Leve flutuação de sombra em cards ao rolar (sem exagero)
// ============================================================
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var cards = document.querySelectorAll(".step-card, .proof-card");
  var ticking = false;

  function updateShadows() {
    var viewportH = window.innerHeight;
    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var centerDist = Math.abs(rect.top + rect.height / 2 - viewportH / 2);
      var proximity = 1 - Math.min(centerDist / (viewportH / 1.4), 1);
      var shadowStrength = 12 + proximity * 16;
      var shadowOpacity = 0.14 + proximity * 0.12;
      card.style.boxShadow =
        "0 " + shadowStrength.toFixed(0) + "px " + (shadowStrength * 2).toFixed(0) +
        "px -" + (shadowStrength + 6).toFixed(0) + "px rgba(58, 46, 40, " + shadowOpacity.toFixed(2) + ")";
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateShadows);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateShadows();
})();

// ============================================================
// Ano automático no rodapé (se necessário no futuro) — placeholder
// mantido simples: nenhuma dependência externa.
// ============================================================