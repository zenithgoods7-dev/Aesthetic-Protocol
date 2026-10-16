/* ============================================================
   AESTHETIC PROTOCOL — script.js
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Accent palette per section ---- */
  var ACCENTS = {
    hero:    { c: "#43d4d8", soft: "rgba(67,212,216,.14)" },
    "book-1":{ c: "#43d4d8", soft: "rgba(67,212,216,.14)" },
    "book-2":{ c: "#e0202e", soft: "rgba(224,32,46,.14)"  },
    "book-3":{ c: "#d8a93f", soft: "rgba(216,169,63,.16)" },
    bundle:  { c: "#43d4d8", soft: "rgba(67,212,216,.14)" }
  };

  function setAccent(key) {
    var a = ACCENTS[key];
    if (!a) return;
    root.style.setProperty("--accent", a.c);
    root.style.setProperty("--accent-soft", a.soft);
    // rail highlight
    railLabels.forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-rail") === key);
    });
  }

  var railLabels = Array.prototype.slice.call(document.querySelectorAll(".hud__rail-label"));

  /* ---- Sticky nav ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Section accent observer ---- */
  var sections = document.querySelectorAll("[data-section]");
  var accentObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) setAccent(e.target.getAttribute("data-section"));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  sections.forEach(function (s) { accentObs.observe(s); });

  /* ---- Scroll reveal ---- */
  var revealTargets = [
    ".book__body > *", ".bundle__title", ".bundle__sub",
    ".bundle__card", ".inside__title", ".spec", ".audience__col",
    ".contents__title", ".contents__sub", ".toc", ".contents__cta", ".faq__title", ".faq__item", ".final__title",
    ".final__sub", ".final .btn", ".hero__inner > *"
  ];
  var revealEls = [];
  revealTargets.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      el.setAttribute("data-reveal", "");
      revealEls.push(el);
    });
  });

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          // small stagger within a group
          var delay = Math.min(parseInt(e.target.dataset.i || "0", 10) * 60, 240);
          setTimeout(function () { e.target.classList.add("is-in"); }, delay);
          revealObs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.15 });

    // stagger index per parent
    var parents = {};
    revealEls.forEach(function (el) {
      var p = el.parentNode;
      var key = p && p.className ? p.className : "x";
      parents[key] = (parents[key] || 0) + 1;
      el.dataset.i = parents[key];
      revealObs.observe(el);
    });
  }

  /* ---- Covers: minimal fade in/out on scroll + fade each image in on load ---- */
  var covers = document.querySelectorAll(".book .cover");
  Array.prototype.forEach.call(covers, function (cover) {
    var photo = cover.querySelector(".cover__photo");
    if (photo && !reduce) {
      photo.classList.add("js-fade");
      if (photo.complete && photo.naturalWidth > 0) {
        photo.classList.add("is-loaded");
      } else {
        photo.addEventListener("load", function () { photo.classList.add("is-loaded"); });
      }
    }
  });
  var medias = document.querySelectorAll(".book__media");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(medias, function (m) { m.classList.add("is-inview"); });
  } else {
    var coverObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("is-inview", e.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "0px 0px -15% 0px" });
    Array.prototype.forEach.call(medias, function (m) { coverObs.observe(m); });
  }

  /* ---- Cover touch feedback: press-in while held + light sweep on tap ---- */
  if (!reduce) {
    Array.prototype.forEach.call(covers, function (cover) {
      var sweep = document.createElement("span");
      sweep.className = "cover__sweep";
      sweep.setAttribute("aria-hidden", "true");
      cover.appendChild(sweep);
      sweep.addEventListener("animationend", function () { sweep.classList.remove("play"); });
      var sx = 0, sy = 0, moved = false;
      cover.addEventListener("touchstart", function (e) {
        var t = e.touches[0];
        sx = t ? t.clientX : 0;
        sy = t ? t.clientY : 0;
        moved = false;
        cover.classList.add("is-pressed");
      }, { passive: true });
      cover.addEventListener("touchmove", function (e) {
        var t = e.touches[0];
        if (t && (Math.abs(t.clientX - sx) > 10 || Math.abs(t.clientY - sy) > 10)) {
          moved = true;
          cover.classList.remove("is-pressed");
        }
      }, { passive: true });
      cover.addEventListener("touchend", function () {
        cover.classList.remove("is-pressed");
        if (!moved) {
          sweep.classList.remove("play");
          void sweep.offsetWidth; // restart the sweep animation
          sweep.classList.add("play");
        }
      });
      cover.addEventListener("touchcancel", function () { cover.classList.remove("is-pressed"); });
    });
  }

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var navEl = document.getElementById("nav");
  if (burger && navEl) {
    var setMenu = function (open) {
      navEl.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!navEl.classList.contains("is-open"));
    });
    Array.prototype.forEach.call(navEl.querySelectorAll(".nav__links a"), function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("click", function (e) {
      if (navEl.classList.contains("is-open") && !navEl.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setMenu(false);
    }, { passive: true });
  }

  /* ---- Sticky mobile buy bar: visible once the hero is gone, hidden while another bundle CTA or the footer is on screen ---- */
  var buybar = document.getElementById("buybar");
  if (buybar && "IntersectionObserver" in window) {
    var hero = document.getElementById("hero");
    var blockers = [hero, document.getElementById("bundle"), document.getElementById("final"), document.querySelector(".footer")];
    var onScreen = [];
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = onScreen.indexOf(e.target);
        if (e.isIntersecting && i < 0) onScreen.push(e.target);
        if (!e.isIntersecting && i > -1) onScreen.splice(i, 1);
      });
      buybar.classList.toggle("is-visible", onScreen.length === 0);
    });
    blockers.forEach(function (el) { if (el) barObs.observe(el); });
  }

  /* ---- Analytics: record checkout clicks (no-op until GA4 is configured in index.html) ---- */
  var CHECKOUTS = {
    "https://rzp.io/rzp/RToCMe7":  { id: "book-1", name: "The Aesthetic Protocol" },
    "https://rzp.io/rzp/Q9XWOc0a": { id: "book-2", name: "The Sovereign Mind" },
    "https://rzp.io/rzp/n1Hao6k":  { id: "book-3", name: "The Wealth Architecture" },
    "https://rzp.io/rzp/ADl161Vz": { id: "bundle", name: "The Sovereign Operator Bundle" }
  };
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("a[href^='https://rzp.io/']") : null;
    if (!link || typeof window.gtag !== "function") return;
    var item = CHECKOUTS[link.getAttribute("href")] || { id: "unknown", name: link.getAttribute("href") };
    var section = link.parentElement.closest("[id]");
    window.gtag("event", "begin_checkout", {
      currency: "INR",
      items: [{ item_id: item.id, item_name: item.name }],
      link_location: section ? section.id : "page"
    });
  });

  /* ---- Live coordinates flicker (ambient HUD detail) ---- */
  if (!reduce) {
    var coords = document.getElementById("coords");
    if (coords) {
      var base = "26.8467° N · 80.9462° E";
      setInterval(function () {
        var jitter = (Math.random() * 0.0009).toFixed(4);
        coords.textContent = "26.846" + jitter.slice(-1) + "° N · 80.946" + jitter.slice(-2, -1) + "° E";
      }, 2600);
    }
  }
})();
