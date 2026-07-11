(function () {
  "use strict";

  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  var navToggle = document.getElementById("navToggle");
  var navLinksEl = document.getElementById("navLinks");
  var sections = document.querySelectorAll("main > section[id]");

  /* ---------------- Mobile nav ---------------- */
  function closeMobileNav() {
    navLinksEl.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    var open = navLinksEl.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });

  /* ---------------- Scroll-spy: highlight the nav link for the visible section ---------------- */
  function setActiveLink(id) {
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace("#", "");
      var active = target === id;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- Language toggle ---------------- */
  var langInputs = document.querySelectorAll("input[name='lang']");
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

  /* ---------------- Animated stat counters (trigger when scrolled into view) ---------------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduceMotion || isNaN(target)) {
      el.textContent = el.getAttribute("data-count");
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

  var statsEl = document.querySelector(".stats");
  if (statsEl) {
    if ("IntersectionObserver" in window) {
      var statsObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              statsEl.querySelectorAll("[data-count]").forEach(animateCounter);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      statsObserver.observe(statsEl);
    } else {
      statsEl.querySelectorAll("[data-count]").forEach(animateCounter);
    }
  }

  /* ---------------- Gentle reveal-on-scroll for cards/sections ---------------- */
  var revealTargets = document.querySelectorAll(".card, .qlink, .stop, .cert, .diploma");
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
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
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  }
})();
