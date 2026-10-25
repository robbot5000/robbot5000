// blocks.js — renders "blocks" pages: a stack of blocks from top to bottom.
// Used for project pages (PROJECT_PAGES in pages.js) and for any category with type: "blocks".
//
// Block types:  full | left | right | gallery | text      (full reference at the top of pages.js)

function blockParagraphs(text) {
  const parts = Array.isArray(text) ? text : String(text == null ? "" : text).split(/\n\s*\n/);
  return parts.map(function (s) { return String(s).trim(); }).filter(Boolean);
}

// Playback options that apply to videos
function blockMediaOpts(b) {
  return { controls: b.controls, autoplay: b.autoplay, loop: b.loop, muted: b.muted, poster: b.poster };
}

function blockLoading() {
  return html('<div class="placeholder"><span class="t-small">LOADING...</span></div>');
}

// The media inside its frame. b.media can be:
//   "one file or link"                          -> a single image / video / YouTube or Vimeo link
//   ["a.webp", "b.mp4", { src, caption }, ...]  -> a slideshow with arrows
// or leave media out and give  folder: "assets/..."  -> a slideshow of everything in that folder
function blockMedia(b) {
  const framed = b.frame !== false;
  const wrap = html(framed ? '<div class="double-border bg-black p-2 md:p-3"></div>' : "<div></div>");
  const slot = html('<div class="media-slot overflow-hidden' + (framed ? " bg-neutral-900" : "") + '"></div>');
  const alt = b.alt || b.title || "";
  const cls = "block w-full h-auto" + (b.pixelated ? " pixelated" : "");
  const slideOpts = Object.assign(
    { alt: alt, pixelated: b.pixelated, interval: b.interval, ratio: b.ratio, fit: b.fit },
    blockMediaOpts(b));

  function fill(items) {
    if (items.length > 1) slot.replaceChildren(buildSlideshow(items, slideOpts));
    else mountMedia(slot, items.length ? (items[0].src || items[0]) : "", alt, cls, blockMediaOpts(b));
  }

  if (Array.isArray(b.media)) {
    fill(b.media);
  } else if (!b.media && b.folder) {
    slot.appendChild(blockLoading());
    galleryListFolder(b.folder).then(function (names) {
      const pin = b.pinPrefix || (typeof GALLERY_DEFAULTS !== "undefined" ? GALLERY_DEFAULTS.pinPrefix : "pin_");
      const base = galleryUrlPath(b.folder);
      fill(gallerySort(names, pin).map(function (n) { return { src: base + "/" + encodeURIComponent(n) }; }));
    }).catch(function () { slot.replaceChildren(placeholder()); });
  } else {
    mountMedia(slot, b.media, alt, cls, blockMediaOpts(b));
  }
  wrap.appendChild(slot);
  return wrap;
}

function blockTextHtml(b) {
  const paras = blockParagraphs(b.text).map(function (p) {
    return '<p class="t-body text-neutral-300 whitespace-pre-line">' + esc(p) + "</p>";
  }).join("");
  return (b.title ? '<h2 class="t-h2 mb-4">' + esc(b.title) + "</h2>" : "") +
    '<div class="space-y-4">' + paras + "</div>";
}

// Text inside a framed panel (panel: false = bare text)
function blockTextPanel(b) {
  return b.panel === false
    ? html('<div class="p-2 md:p-4">' + blockTextHtml(b) + "</div>")
    : html('<div class="double-border bg-black p-5 md:p-8">' + blockTextHtml(b) + "</div>");
}

// ---------- Block types ----------
function blockFull(b) {
  const fig = html("<figure></figure>");
  fig.appendChild(blockMedia(b));
  if (b.caption) fig.appendChild(html('<figcaption class="t-small dim mt-2">' + esc(b.caption) + "</figcaption>"));
  return fig;
}

// mediaOnLeft true  = "left":  media on the left half, text centered on the right half
// mediaOnLeft false = "right": media on the right half, text centered on the left half
// (on narrow screens the media always comes first)
function blockSplit(b, mediaOnLeft) {
  const sec = html('<section class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center"></section>');
  const mediaCol = html(mediaOnLeft ? '<div class="order-1 md:order-1"></div>' : '<div class="order-1 md:order-2"></div>');
  const textCol = html(mediaOnLeft ? '<div class="order-2 md:order-2"></div>' : '<div class="order-2 md:order-1"></div>');
  mediaCol.appendChild(blockMedia(b));
  textCol.appendChild(blockTextPanel(b));
  sec.appendChild(mediaCol);
  sec.appendChild(textCol);
  return sec;
}

function blockText(b) {
  const sec = html('<section class="max-w-3xl mx-auto' + (b.align === "center" ? " text-center" : "") + '"></section>');
  sec.appendChild(blockTextPanel(b));
  return sec;
}

function blockGallery(b, pending) {
  const sec = html("<section></section>");
  if (b.title) sec.appendChild(html('<h2 class="t-h2 mb-4">' + esc(b.title) + "</h2>"));
  const holder = html("<div></div>");
  sec.appendChild(holder);
  // The gallery measures its width, so it starts once the page is in the document
  pending.push(function () {
    renderGallery(holder, Object.assign({}, typeof GALLERY_DEFAULTS !== "undefined" ? GALLERY_DEFAULTS : {}, b));
  });
  return sec;
}

const BLOCK_TYPES = {
  full: blockFull,
  left: function (b) { return blockSplit(b, true); },
  right: function (b) { return blockSplit(b, false); },
  text: blockText,
  gallery: blockGallery
};

function blockProblem(msg) {
  return html('<div class="double-border bg-black p-5 text-center"><p class="t-small dim">' + esc(msg) + "</p></div>");
}

// ---------- Page renderer ----------
function renderBlocksPage(container, data) {
  const wrap = html('<div class="space-y-10 md:space-y-16"></div>');
  const pending = [];

  (data.blocks || []).forEach(function (b, i) {
    const type = String((b && b.type) || "").toLowerCase();
    const make = BLOCK_TYPES[type];
    if (!make) {
      wrap.appendChild(blockProblem('BLOCK ' + (i + 1) + ': UNKNOWN TYPE "' + type + '" // USE full, left, right, gallery OR text'));
      return;
    }
    wrap.appendChild(make(b, pending));
  });

  if (!wrap.children.length) {
    wrap.appendChild(blockProblem("NO BLOCKS YET // ADD THEM TO blocks: [ ... ] IN pages.js"));
  }

  container.replaceChildren(wrap);
  pending.forEach(function (fn) { fn(); });
}
