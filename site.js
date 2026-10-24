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

// ---------- Detail modal (injected so pages don't duplicate the markup) ----------
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
          '<div id="modal-media" class="w-full h-64 md:h-80 bg-neutral-900 border border-neutral-800 overflow-hidden"></div>' +
          '<p id="modal-desc" class="t-body text-neutral-300"></p>' +
          '<div class="t-small dim flex justify-between items-center border-t border-neutral-800 pt-2">' +
            '<span>STATUS: ONLINE</span><span>FORMAT: IMAGE/WEBP</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  $("modal-close").addEventListener("click", closeModal);
  $("modal").addEventListener("click", function (e) {
    if (e.target.id === "modal") closeModal();
  });
}

// opts (optional): { fit: "contain", tall: true, pixelated: true }
function openModal(title, imgSrc, desc, opts) {
  opts = opts || {};
  $("modal-title").textContent = title;
  $("modal-media").className = "w-full bg-neutral-900 border border-neutral-800 overflow-hidden " +
    (opts.tall ? "h-[60vh]" : "h-64 md:h-80");
  mountMedia($("modal-media"), imgSrc, title,
    "w-full h-full " + (opts.fit === "contain" ? "object-contain" : "object-cover") +
    (opts.pixelated ? " pixelated" : ""),
    { controls: true, fill: true });
  $("modal-desc").textContent = desc || "";
  $("modal").classList.remove("hidden");
}

function closeModal() {
  $("modal").classList.add("hidden");
  $("modal-media").replaceChildren(); // stops any video that was playing
}

document.addEventListener("DOMContentLoaded", injectModal);
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && $("modal")) closeModal();
});
