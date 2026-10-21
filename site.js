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

// ---------- Images with placeholder fallback ----------
// Empty path, or a path that fails to load, shows a NO SIGNAL tile instead.
function placeholder() {
  return html(
    '<div class="placeholder" role="img" aria-label="Image placeholder">' +
    '<span class="t-h3">NO SIGNAL</span><span class="t-small">[ ADD IMAGE ]</span></div>'
  );
}

function mountMedia(container, src, alt, cls) {
  container.replaceChildren();
  if (!src || !String(src).trim()) {
    container.appendChild(placeholder());
    return;
  }
  const img = new Image();
  img.alt = alt || "";
  img.className = cls || "w-full h-full object-cover";
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = function () { img.replaceWith(placeholder()); };
  img.src = src;
  container.appendChild(img);
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
    (opts.pixelated ? " pixelated" : ""));
  $("modal-desc").textContent = desc || "";
  $("modal").classList.remove("hidden");
}

function closeModal() {
  $("modal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", injectModal);
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && $("modal")) closeModal();
});
