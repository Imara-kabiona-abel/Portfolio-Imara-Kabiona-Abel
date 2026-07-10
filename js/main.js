(function () {
  "use strict";

  var PAGES = ["home", "about", "experience", "education", "projects", "contact"];
  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  var pages = document.querySelectorAll(".page");
  var navToggle = document.getElementById("navToggle");
  var navLinksEl = document.getElementById("navLinks");

  /* ---------------- Routing ---------------- */
  function showPage(id) {
    if (PAGES.indexOf(id) === -1) id = "home";
    pages.forEach(function (p) {
      p.classList.toggle("active", p.id === id);
    });
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace("#", "");
      a.classList.toggle("active", target === id);
      if (target === id) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    document.getElementById("main").scrollTo({ top: 0 });
    window.scrollTo({ top: 0, behavior: "auto" });
    closeMobileNav();
    maybeAnimateStats(id);
  }

  function routeFromHash() {
    var id = (location.hash || "#home").replace("#", "");
    showPage(id);
  }

  window.addEventListener("hashchange", routeFromHash);
  document.addEventListener("DOMContentLoaded", routeFromHash);

  /* ---------------- Mobile nav ---------------- */
  function closeMobileNav() {
    navLinksEl.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    var open = navLinksEl.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

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

  /* ---------------- Animated stat counters ---------------- */
  var statsAnimated = false;
  function maybeAnimateStats(pageId) {
    if (pageId !== "home" || statsAnimated) return;
    statsAnimated = true;
    var counters = document.querySelectorAll("[data-count]");
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    maybeAnimateStats = function (pageId) {
      if (pageId !== "home") return;
      document.querySelectorAll("[data-count]").forEach(function (el) {
        el.textContent = el.getAttribute("data-count");
      });
    };
  }

  /* Init on first load (in case DOMContentLoaded already fired) */
  if (document.readyState !== "loading") {
    routeFromHash();
  }
})();
