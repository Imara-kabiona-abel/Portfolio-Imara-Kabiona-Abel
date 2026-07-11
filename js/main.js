(function () {
  "use strict";

  /* ---------------- Mobile nav ---------------- */
  (function initMobileNav() {
    var navToggle = document.getElementById("navToggle");
    var navLinksEl = document.getElementById("navLinks");
    if (!navToggle || !navLinksEl) return;

    function closeMobileNav() {
      navLinksEl.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
    navToggle.addEventListener("click", function () {
      var open = navLinksEl.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinksEl.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", closeMobileNav);
    });
  })();

  /* ---------------- Scroll-spy: highlight the nav link for the visible section ---------------- */
  (function initScrollSpy() {
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    var sections = document.querySelectorAll("main > section[id]");
    if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

    function setActiveLink(id) {
      navLinks.forEach(function (a) {
        var target = a.getAttribute("href").replace("#", "");
        var active = target === id;
        a.classList.toggle("active", active);
        if (active) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    }

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  })();

  /* ---------------- Language toggle ---------------- */
  (function initLangToggle() {
    var langInputs = document.querySelectorAll("input[name='lang']");
    if (!langInputs.length) return;

    function applyLang(lang) {
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-fr]").forEach(function (el) {
        var text = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-fr");
        if (text != null) el.textContent = text;
      });
    }
    langInputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) applyLang(input.value);
      });
    });
  })();

  /* ---------------- Animated stat counters ---------------- */
  (function initStatCounters() {
    var statsEl = document.querySelector(".stats");
    if (!statsEl) return;

    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      if (reduceMotion) {
        el.textContent = target;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    function runAll() {
      statsEl.querySelectorAll("[data-count]").forEach(animateCounter);
    }

    if ("IntersectionObserver" in window) {
      var statsObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runAll();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      statsObserver.observe(statsEl);
      /* Filet de sécurité : si l'observer ne se déclenche jamais (ex. bloc déjà
         visible au chargement sur certains navigateurs), on anime après 1.2s. */
      setTimeout(function () {
        var stillZero = statsEl.querySelector('[data-count]');
        if (stillZero && stillZero.textContent === "0") runAll();
      }, 1200);
    } else {
      runAll();
    }
  })();

  /* ---------------- Gentle reveal-on-scroll for cards/sections ---------------- */
  (function initReveal() {
    var revealTargets = document.querySelectorAll(".card, .qlink, .stop, .cert, .diploma");
    if (!revealTargets.length) return;

    revealTargets.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  })();

})();
