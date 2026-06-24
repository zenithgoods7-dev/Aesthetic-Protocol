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
    ".quote", ".faq__title", ".faq__item", ".final__title",
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

  /* ---- Countdown timer (48h rolling, persists in session) ---- */
  var timerEl = document.getElementById("timer");
  if (timerEl) {
    var DURATION = 48 * 60 * 60 * 1000; // 48h
    var key = "ap_launch_deadline";
    var deadline = parseInt(sessionStorage.getItem(key) || "0", 10);
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + DURATION;
      try { sessionStorage.setItem(key, String(deadline)); } catch (e) {}
    }
    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function tick() {
      var diff = Math.max(0, deadline - Date.now());
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      timerEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Checkout placeholder ---- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#"]'), function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      alert("Connect your payment link here (Razorpay / Gumroad / Instamojo).\nReplace the # in href with your real checkout URL.");
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
