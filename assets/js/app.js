(function () {
  "use strict";

  var data = window.SONDOR_MENU;
  if (!data) return;

  var IMG_BASE = "https://images.unsplash.com/";
  var OPEN_HOUR = 8;
  var CLOSE_HOUR = 22;

  var ICONS = {
    coffee: '<path d="M5 9h11v4.5a5.5 5.5 0 0 1 -11 0z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5c-.8 1 .8 1.8 0 3M12 3.5c-.8 1 .8 1.8 0 3"/><path d="M4 21h14"/>',
    tea: '<path d="M4 10h12v3a6 6 0 0 1 -12 0z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H15"/><path d="M10 10V6.5l2 -1.5"/><path d="M3 21h15"/>',
    breakfast: '<circle cx="12" cy="12.5" r="7.5"/><circle cx="12" cy="12.5" r="3"/><path d="M12 2.5v1.5"/>',
    main: '<path d="M3 13h18"/><path d="M4.5 13a7.5 7.5 0 0 1 15 0"/><path d="M12 5.5v-1.5"/><path d="M5 17h14"/>',
    dessert: '<path d="M5 12h14l-1.5 8h-11z"/><path d="M6.5 12a5.5 5.5 0 0 1 11 0"/><path d="M12 6.5V4"/><circle cx="12" cy="3.5" r=".8"/>'
  };

  var $ = function (id) { return document.getElementById(id); };
  var tabsEl = $("tabs");
  var gridEl = $("grid");
  var panelEl = $("panel");
  var titleEl = $("panel-title");
  var noteEl = $("panel-note");

  var PLUS = '<span class="plus" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 4.5v11M4.5 10h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
  var fmt = function (n) { return n.toLocaleString("en-US") + "₮"; };

  function imgUrl(id, w, h) {
    return IMG_BASE + id + "?auto=format&fit=crop&w=" + w + "&h=" + h + "&q=68";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function badgeClass(label) {
    return /Онцлох|Шефийн/.test(label) ? "badge badge--warm" : "badge";
  }

  var byCat = {};
  data.items.forEach(function (it) { (byCat[it.cat] = byCat[it.cat] || []).push(it); });
  var byId = {};
  data.items.forEach(function (it) { byId[it.id] = it; });

  function iconSvg(id) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[id] + "</svg>";
  }
  var catById = {};
  data.categories.forEach(function (c) { catById[c.id] = c; });
  var factCount = document.getElementById("fact-count");
  if (factCount) factCount.textContent = data.items.length;

  /* Tabs */
  tabsEl.innerHTML = data.categories.map(function (c) {
    var n = (byCat[c.id] || []).length;
    return '<button class="tab" type="button" role="tab" id="tab-' + c.id + '" data-cat="' + c.id + '" aria-controls="panel" aria-selected="false" tabindex="-1">' +
      '<span class="tab__thumb"><img src="' + imgUrl(c.thumb, 96, 96) + '" width="48" height="48" alt="" decoding="async"></span>' +
      "<span>" + escapeHtml(c.name) + '</span><span class="tab__count" aria-label="' + n + ' бүтээгдэхүүн">' + n + "</span></button>";
  }).join("");

  /* Signature picks */
  var picksEl = $("picks");
  if (picksEl) {
    var picks = data.items.filter(function (it) { return it.badge === "Онцлох" || it.badge === "Шефийн санал"; });
    picksEl.innerHTML = picks.map(function (it) {
      return '<button class="pick" type="button" data-id="' + it.id + '" aria-haspopup="dialog" aria-label="' + escapeHtml(it.name) + ", " + fmt(it.price) + ', дэлгэрэнгүй">' +
        '<span class="pick__media"><img src="' + imgUrl(it.img, 520, 600) + '" width="260" height="300" alt="' + escapeHtml(it.alt) + '" loading="lazy" decoding="async">' +
          '<span class="pick__cat">' + escapeHtml(catById[it.cat].name) + "</span></span>" +
        '<span class="pick__body"><span class="pick__name">' + escapeHtml(it.name) + "</span>" +
          '<span class="pick__desc">' + escapeHtml(it.short) + "</span>" +
          '<span class="pick__foot"><span class="pick__price">' + fmt(it.price) + "</span>" + PLUS + "</span></span>" +
      "</button>";
    }).join("");
    picksEl.addEventListener("click", function (e) {
      var b = e.target.closest(".pick");
      if (b) openItem(b.dataset.id, b);
    });
  }

  var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll(".tab"));
  var current = null;

  function renderCards(items) {
    return items.map(function (it) {
      var badge = it.badge ? '<span class="' + badgeClass(it.badge) + '">' + escapeHtml(it.badge) + "</span>" : "";
      return '<li class="card">' +
        '<button class="card__btn" type="button" data-id="' + it.id + '" aria-haspopup="dialog" aria-label="' + escapeHtml(it.name) + ", " + fmt(it.price) + ', дэлгэрэнгүй">' +
          '<span class="card__media">' +
            '<img src="' + imgUrl(it.img, 480, 360) + '" srcset="' + imgUrl(it.img, 240, 240) + " 240w, " + imgUrl(it.img, 480, 360) + " 480w, " + imgUrl(it.img, 720, 540) + ' 720w" ' +
            'sizes="(min-width: 960px) 340px, (min-width: 640px) 46vw, 112px" width="480" height="360" alt="' + escapeHtml(it.alt) + '" loading="lazy" decoding="async">' +
          "</span>" +
          '<span class="card__body">' +
            '<span class="card__top"><span class="card__name">' + escapeHtml(it.name) + "</span></span>" +
            '<span class="card__desc">' + escapeHtml(it.short) + "</span>" +
            '<span class="card__foot"><span class="card__price">' + fmt(it.price) + "</span>" +
              PLUS +
            "</span>" +
          "</span>" +
        "</button>" + badge +
      "</li>";
    }).join("");
  }

  function markLoaded(root) {
    Array.prototype.forEach.call(root.querySelectorAll("img"), function (img) {
      var done = function () { img.classList.add("is-loaded"); };
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", function () { img.closest(".card__media").classList.add("is-broken"); }, { once: true });
      }
    });
  }

  function selectCategory(id, opts) {
    opts = opts || {};
    var cat = data.categories.filter(function (c) { return c.id === id; })[0] || data.categories[0];
    if (current === cat.id && !opts.force) return;
    current = cat.id;

    tabs.forEach(function (t) {
      var on = t.dataset.cat === cat.id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on) {
        panelEl.setAttribute("aria-labelledby", t.id);
        var track = tabsEl;
        var left = t.offsetLeft - (track.clientWidth - t.offsetWidth) / 2;
        track.scrollTo({ left: Math.max(0, left), behavior: opts.instant ? "auto" : "smooth" });
      }
    });

    titleEl.textContent = cat.name;
    noteEl.textContent = cat.note;
    gridEl.classList.remove("is-entering");
    gridEl.innerHTML = renderCards(byCat[cat.id] || []);
    void gridEl.offsetWidth;
    gridEl.classList.add("is-entering");
    markLoaded(gridEl);

    if (opts.updateHash !== false && history.replaceState) {
      history.replaceState(null, "", "#" + cat.id);
    }
    if (opts.scroll) {
      var menuTop = $("menu").getBoundingClientRect().top + window.scrollY;
      var panelTop = panelEl.getBoundingClientRect().top + window.scrollY;
      var offset = $("top").offsetHeight + tabsEl.parentNode.parentNode.offsetHeight + 8;
      if (window.scrollY > panelTop - offset || window.scrollY < menuTop - 400) {
        window.scrollTo({ top: panelTop - offset, behavior: "smooth" });
      }
    }
  }

  tabsEl.addEventListener("click", function (e) {
    var t = e.target.closest(".tab");
    if (t) selectCategory(t.dataset.cat, { scroll: true });
  });

  tabsEl.addEventListener("keydown", function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === "Home") next = tabs[0];
    else if (e.key === "End") next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      next.focus();
      selectCategory(next.dataset.cat);
    }
  });

  var initial = (location.hash || "").slice(1);
  var initialIsCat = data.categories.some(function (c) { return c.id === initial; });
  selectCategory(initialIsCat ? initial : data.categories[0].id, { instant: true, updateHash: initialIsCat });
  if (initialIsCat) {
    requestAnimationFrame(function () { $("menu").scrollIntoView(); });
  }

  /* Detail sheet */
  var sheet = $("sheet");
  var lastTrigger = null;
  var supportsDialog = typeof sheet.showModal === "function";

  function openItem(id, trigger) {
    var it = byId[id];
    if (!it) return;
    lastTrigger = trigger || null;
    var cat = catById[it.cat];
    $("sheet-cat").textContent = cat.name;
    var img = $("sheet-img");
    img.removeAttribute("src");
    img.srcset = imgUrl(it.img, 640, 480) + " 640w, " + imgUrl(it.img, 1120, 840) + " 1120w";
    img.sizes = "(min-width: 640px) 560px, 100vw";
    img.src = imgUrl(it.img, 1120, 840);
    img.alt = it.alt;

    var b = $("sheet-badge");
    if (it.badge) { b.hidden = false; b.className = badgeClass(it.badge); b.textContent = it.badge; }
    else b.hidden = true;

    $("sheet-title").textContent = it.name;
    $("sheet-price").textContent = fmt(it.price);
    $("sheet-desc").textContent = it.long;
    $("sheet-size").textContent = it.size;
    $("sheet-kcal").textContent = it.kcal + " ккал";
    $("sheet-time").textContent = it.time;
    var al = $("sheet-allergens");
    if (it.allergens && it.allergens.length) {
      al.innerHTML = "<strong>Харшил үүсгэж болзошгүй:</strong> " + escapeHtml(it.allergens.join(", "));
      al.hidden = false;
    } else {
      al.hidden = true;
    }

    if (supportsDialog) sheet.showModal(); else sheet.setAttribute("open", "");
    document.body.classList.add("is-locked");
    sheet.querySelector(".sheet__inner").scrollTop = 0;
    $("sheet-close").focus();
  }

  function closeSheet() {
    if (!sheet.open) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finish = function () {
      sheet.classList.remove("is-closing");
      if (supportsDialog) sheet.close(); else sheet.removeAttribute("open");
    };
    if (reduce) finish();
    else {
      sheet.classList.add("is-closing");
      setTimeout(finish, 200);
    }
  }

  sheet.addEventListener("close", function () {
    document.body.classList.remove("is-locked");
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
  });
  sheet.addEventListener("cancel", function (e) { e.preventDefault(); closeSheet(); });
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
  $("sheet-close").addEventListener("click", closeSheet);

  gridEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".card__btn");
    if (btn) openItem(btn.dataset.id, btn);
  });

  /* Swipe down to close on touch screens */
  (function () {
    var inner = sheet.querySelector(".sheet__inner");
    var startY = null, dy = 0;
    inner.addEventListener("touchstart", function (e) {
      startY = inner.scrollTop <= 0 ? e.touches[0].clientY : null;
      dy = 0;
    }, { passive: true });
    inner.addEventListener("touchmove", function (e) {
      if (startY === null) return;
      dy = e.touches[0].clientY - startY;
      if (dy > 0) sheet.style.transform = "translateY(" + dy + "px)";
    }, { passive: true });
    inner.addEventListener("touchend", function () {
      if (startY === null) return;
      sheet.style.transform = "";
      if (dy > 110) closeSheet();
      startY = null;
    });
  })();

  /* Open status, Ulaanbaatar time */
  function updateStatus() {
    var el = $("status");
    var hour;
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ulaanbaatar", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var h = +parts.filter(function (p) { return p.type === "hour"; })[0].value;
      var m = +parts.filter(function (p) { return p.type === "minute"; })[0].value;
      hour = (h % 24) + m / 60;
    } catch (err) {
      var d = new Date();
      hour = d.getHours() + d.getMinutes() / 60;
    }
    var open = hour >= OPEN_HOUR && hour < CLOSE_HOUR;
    el.classList.toggle("is-open", open);
    el.querySelector(".status__text").innerHTML = open
      ? 'Нээлттэй<span class="status__more"> · 22:00 хүртэл</span>'
      : 'Хаалттай<span class="status__more"> · 08:00 цагт нээгдэнэ</span>';
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* Topbar shadow */
  var topbar = $("top");
  var onScroll = function () { topbar.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* QR code, generated from the current address so it always points to this site */
  var menuUrl = location.origin + location.pathname.replace(/index\.html$/, "");
  $("qr-url").textContent = menuUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  var qrModel = null;

  function buildQr() {
    if (qrModel || typeof window.qrcode !== "function") return;
    qrModel = window.qrcode(0, "M");
    qrModel.addData(menuUrl);
    qrModel.make();
    var n = qrModel.getModuleCount();
    var path = "";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qrModel.isDark(r, c)) path += "M" + c + " " + r + "h1v1h-1z";
      }
    }
    $("qr-code").innerHTML = '<svg viewBox="0 0 ' + n + " " + n + '" shape-rendering="crispEdges" aria-hidden="true"><path fill="#2B1D14" d="' + path + '"/></svg>';
  }

  function loadQrLib() {
    if (window.qrcode) { buildQr(); return; }
    var s = document.createElement("script");
    s.src = "assets/js/qrcode.min.js?v=4";
    s.onload = buildQr;
    document.head.appendChild(s);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadQrLib(); io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe($("qr"));
  } else {
    loadQrLib();
  }

  $("copy-link").addEventListener("click", function () {
    var btn = this;
    var done = function () {
      var label = btn.textContent;
      btn.textContent = "Хуулагдлаа";
      setTimeout(function () { btn.textContent = label; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(menuUrl).then(done, function () { window.prompt("Холбоосыг хуулна уу", menuUrl); });
    } else {
      window.prompt("Холбоосыг хуулна уу", menuUrl);
    }
  });

  $("download-qr").addEventListener("click", function () {
    if (!qrModel) { loadQrLib(); return; }
    var n = qrModel.getModuleCount();
    var scale = 16, margin = 4;
    var size = (n + margin * 2) * scale;
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#2B1D14";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qrModel.isDark(r, c)) ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
      }
    }
    var a = document.createElement("a");
    a.download = "sondor-cafe-menu-qr.png";
    a.href = canvas.toDataURL("image/png");
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
})();
