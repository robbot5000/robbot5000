// site.js — helpers shared by every page (index.html, category.html).
// Load at the end of <body>, before the page's own script.

function $(id) { return document.getElementById(id); }

// Escape text before putting it in an HTML string
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// Turn an HTML string into a single DOM element
function html(str) {
  const t = document.createElement("template");
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }

// ---------- Media types ----------
// A "media" link can be an image, a video file, or a YouTube / Vimeo link.
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)([?#].*)?$/i;

function isVideoSrc(src) { return VIDEO_EXT.test(String(src || "")); }

// YouTube / Vimeo links -> embeddable player URL (or null if it isn't one)
function embedSrc(src) {
  const s = String(src || "").trim();
  let m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  if (m) return "https://www.youtube-nocookie.com/embed/" + m[1];
  m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (m) return "https://player.vimeo.com/video/" + m[1];
  return null;
}

// Empty path, or a file that fails to load, shows a NO SIGNAL tile instead.
function placeholder() {
  return html(
    '<div class="placeholder" role="img" aria-label="Image placeholder">' +
    '<span class="t-h3">NO SIGNAL</span><span class="t-small">[ ADD IMAGE ]</span></div>'
  );
}

// Play looping videos only while they're on screen (saves CPU/battery)
function autoplayWhenVisible(video) {
  function play() { const p = video.play && video.play(); if (p && p.catch) p.catch(function () {}); }
  if (!("IntersectionObserver" in window)) { play(); return; }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) play(); else video.pause(); });
  }, { threshold: 0.25 }).observe(video);
}

// Build the right element for a media link.
// o: { alt, cls, controls, autoplay, loop, muted, poster, fill }
//   videos default to silent looping autoplay; set controls:true for a normal player
function buildMedia(src, o) {
  o = o || {};

  const embed = embedSrc(src);
  if (embed) {
    const frame = document.createElement("iframe");
    frame.src = embed;
    frame.title = o.alt || "Video";
    frame.loading = "lazy";
    frame.allowFullscreen = true;
    frame.setAttribute("allow", "accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.className = "block w-full border-0 " + (o.fill ? "h-full" : "aspect-video");
    return frame;
  }

  if (isVideoSrc(src)) {
    const controls = o.controls === true;
    const v = document.createElement("video");
    v.className = o.cls || "w-full h-full object-cover";
    v.playsInline = true;
    v.preload = "metadata";
    v.controls = controls;
    v.muted = o.muted !== undefined ? !!o.muted : !controls;
    if (v.muted) v.setAttribute("muted", "");
    v.loop = o.loop !== undefined ? !!o.loop : !controls;
    if (o.poster) v.poster = o.poster;
    v.setAttribute("aria-label", o.alt || "");
    v.onerror = function () { v.replaceWith(placeholder()); };
    v.src = src;
    const auto = o.autoplay !== undefined ? !!o.autoplay : !controls;
    if (auto) autoplayWhenVisible(v);
    return v;
  }

  const img = new Image();
  img.alt = o.alt || "";
  img.className = o.cls || "w-full h-full object-cover";
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = function () { img.replaceWith(placeholder()); };
  img.src = src;
  return img;
}

function mountMedia(container, src, alt, cls, opts) {
  container.replaceChildren();
  if (!src || !String(src).trim()) {
    container.appendChild(placeholder());
    return;
  }
  container.appendChild(buildMedia(src, Object.assign({ alt: alt, cls: cls }, opts)));
}

// ---------- Slideshow (several images / videos with arrows) ----------
// items: ["a.webp", "b.mp4", { src: "c.webp", caption: "optional" }]
// o: { alt, pixelated, fit: "contain" | "cover", ratio: "16/9", interval (seconds, 0 = off),
//      fill (fill the parent, used by heroes), stageCls, controls, autoplay, loop, muted, poster }
// Block slideshows keep one fixed shape (that of the first slide, or o.ratio) so the page
// doesn't jump; other slides sit inside it (fit: "cover" crops them to fill instead).
function buildSlideshow(items, o) {
  o = o || {};
  const list = items.map(function (it) {
    return typeof it === "string" ? { src: it, caption: "" }
      : { src: (it && it.src) || "", caption: (it && (it.caption || it.title)) || "" };
  });
  const fill = !!o.fill;
  const many = list.length > 1;
  let index = 0;
  let ratioSet = !!o.ratio;

  const view = html('<div class="slide-view ' + (fill ? "absolute inset-0" : "relative w-full overflow-hidden") +
    '" tabindex="0" role="group" aria-roledescription="carousel" aria-label="' + esc(o.alt || "Image gallery") + '"></div>');
  if (!fill) view.style.aspectRatio = o.ratio ? String(o.ratio) : "16 / 9";

  const stage = html('<div class="absolute inset-0' + (o.stageCls ? " " + o.stageCls : "") + '"></div>');
  view.appendChild(stage);

  const counter = html('<div class="slide-counter t-small"></div>');
  const prev = html('<button type="button" class="slide-arrow slide-prev" aria-label="Previous">&lt;</button>');
  const next = html('<button type="button" class="slide-arrow slide-next" aria-label="Next">&gt;</button>');
  if (many) { view.appendChild(counter); view.appendChild(prev); view.appendChild(next); }

  const caption = fill ? null : html('<p class="slide-caption t-small dim mt-2 hidden"></p>');

  function show(n) {
    index = (n + list.length) % list.length;
    const it = list[index];
    let el;
    if (!it.src) {
      el = placeholder();
    } else {
      el = buildMedia(it.src, {
        alt: o.alt, fill: true,
        cls: "w-full h-full " + (fill || o.fit === "cover" ? "object-cover" : "object-contain") + (o.pixelated ? " pixelated" : ""),
        controls: o.controls, autoplay: o.autoplay, loop: o.loop, muted: o.muted, poster: o.poster
      });
    }
    el.classList.add("slide-in");
    stage.replaceChildren(el);
    counter.textContent = pad2(index + 1) + " / " + pad2(list.length);
    if (caption) {
      caption.textContent = it.caption;
      caption.classList.toggle("hidden", !it.caption);
    }

    // The first slide that loads decides the shape of the block
    if (!ratioSet && !fill) {
      const setFrom = function (w, h) {
        if (w && h && !ratioSet) { ratioSet = true; view.style.aspectRatio = w + " / " + h; }
      };
      if (el.tagName === "IMG") {
        if (el.complete && el.naturalWidth) setFrom(el.naturalWidth, el.naturalHeight);
        else el.addEventListener("load", function () { setFrom(el.naturalWidth, el.naturalHeight); });
      } else if (el.tagName === "VIDEO") {
        el.addEventListener("loadedmetadata", function () { setFrom(el.videoWidth, el.videoHeight); });
      } else if (el.tagName === "IFRAME") {
        ratioSet = true; // 16:9
      }
    }

    // Warm up the next image so the arrow feels instant
    const nx = list[(index + 1) % list.length];
    if (many && nx && nx.src && !isVideoSrc(nx.src) && !embedSrc(nx.src)) { const pre = new Image(); pre.src = nx.src; }
  }

  prev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
  next.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });

  if (many) {
    view.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { show(index + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { show(index - 1); e.preventDefault(); }
    });
    let x0 = null;
    view.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    view.addEventListener("touchend", function (e) {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    if (o.interval > 0) {
      let paused = false;
      view.addEventListener("mouseenter", function () { paused = true; });
      view.addEventListener("mouseleave", function () { paused = false; });
      const timer = setInterval(function () {
        if (!view.isConnected) { clearInterval(timer); return; }
        if (!paused && !document.hidden) show(index + 1);
      }, o.interval * 1000);
    }
  }

  show(0);
  if (fill) return view;

  const wrap = html("<div></div>");
  wrap.appendChild(view);
  wrap.appendChild(caption);
  return wrap;
}

// Hero cover: one image, or an array of them for a slideshow with arrows.
// interval = seconds between automatic slides (0 / empty = manual only).
function mountHero(container, src, alt, interval) {
  container.replaceChildren();
  const dim = "filter brightness-75 contrast-125";
  if (Array.isArray(src) && src.length > 1) {
    container.appendChild(buildSlideshow(src, { fill: true, alt: alt, interval: interval, stageCls: dim }));
    return;
  }
  let one = Array.isArray(src) ? src[0] : src;
  if (one && typeof one === "object") one = one.src;
  mountMedia(container, one, alt, "w-full h-full object-cover " + dim);
}

// ---------- Detail modal (injected so pages don't duplicate the markup) ----------
let modalState = { list: null, index: 0, opts: {} };

function injectModal() {
  document.body.insertAdjacentHTML("beforeend",
    '<div id="modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<div class="double-border bg-black w-full max-w-3xl p-3 relative shadow-2xl">' +
        '<div class="rule-b flex justify-between items-center pb-2 mb-3">' +
          '<div class="flex items-center gap-2">' +
            '<span class="dot-selected w-2 h-2 rounded-full inline-block"></span>' +
            '<h2 id="modal-title" class="t-h2">TITLE</h2>' +
          '</div>' +
          '<button type="button" id="modal-close" class="tab t-h3">[X] CLOSE</button>' +
        '</div>' +
        '<div class="space-y-4">' +
          '<div class="relative">' +
            '<div id="modal-media" class="w-full h-64 md:h-80 bg-neutral-900 border border-neutral-800 overflow-hidden"></div>' +
            '<button type="button" id="modal-prev" class="slide-arrow slide-prev" style="display:none" aria-label="Previous">&lt;</button>' +
            '<button type="button" id="modal-next" class="slide-arrow slide-next" style="display:none" aria-label="Next">&gt;</button>' +
          '</div>' +
          '<p id="modal-desc" class="t-body text-neutral-300"></p>' +
          '<div class="t-small dim flex justify-between items-center border-t border-neutral-800 pt-2">' +
            '<span>STATUS: ONLINE</span><span id="modal-meta">FORMAT: IMAGE/WEBP</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  $("modal-close").addEventListener("click", closeModal);
  $("modal").addEventListener("click", function (e) {
    if (e.target.id === "modal") closeModal();
  });
  $("modal-prev").addEventListener("click", function () { stepModal(-1); });
  $("modal-next").addEventListener("click", function () { stepModal(1); });

  let x0 = null;
  const media = $("modal-media");
  media.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  media.addEventListener("touchend", function (e) {
    if (x0 == null || !modalState.list) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) stepModal(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function modalMediaClass() {
  const o = modalState.opts;
  return "w-full h-full " + (o.fit === "contain" ? "object-contain" : "object-cover") + (o.pixelated ? " pixelated" : "");
}

function showModalItem(n) {
  const list = modalState.list;
  modalState.index = (n + list.length) % list.length;
  const it = list[modalState.index];
  $("modal-title").textContent = it.title || "";
  mountMedia($("modal-media"), it.src, it.title, modalMediaClass(), { controls: true, fill: true });
  $("modal-desc").textContent = it.desc || "";
  $("modal-meta").textContent = pad2(modalState.index + 1) + " / " + pad2(list.length);
}

function stepModal(d) {
  if (modalState.list) showModalItem(modalState.index + d);
}

// opts (optional): { fit: "contain", tall: true, pixelated: true,
//                    list: [{ title, src, desc }, ...], index: 0 }   <- list adds prev/next arrows
function openModal(title, imgSrc, desc, opts) {
  opts = opts || {};
  const list = Array.isArray(opts.list) && opts.list.length > 1 ? opts.list : null;
  modalState = { list: list, index: opts.index || 0, opts: opts };

  $("modal-media").className = "w-full bg-neutral-900 border border-neutral-800 overflow-hidden " +
    (opts.tall ? "h-[60vh]" : "h-64 md:h-80");
  $("modal-prev").style.display = list ? "" : "none";
  $("modal-next").style.display = list ? "" : "none";

  if (list) {
    showModalItem(modalState.index);
  } else {
    $("modal-title").textContent = title;
    mountMedia($("modal-media"), imgSrc, title, modalMediaClass(), { controls: true, fill: true });
    $("modal-desc").textContent = desc || "";
    $("modal-meta").textContent = "FORMAT: IMAGE/WEBP";
  }
  $("modal").classList.remove("hidden");
}

function closeModal() {
  $("modal").classList.add("hidden");
  $("modal-media").replaceChildren(); // stops any video that was playing
  modalState = { list: null, index: 0, opts: {} };
}

document.addEventListener("DOMContentLoaded", injectModal);
window.addEventListener("keydown", function (e) {
  const modal = $("modal");
  if (!modal || modal.classList.contains("hidden")) return;
  if (e.key === "Escape") closeModal();
  else if (e.key === "ArrowRight") stepModal(1);
  else if (e.key === "ArrowLeft") stepModal(-1);
});
