// gallery.js — masonry galleries of images and videos.
// Used by "gallery" category pages and by "gallery" blocks inside block pages.
//
// A gallery gets its files from ONE of:
//   folder: "assets/some-folder"       (listed via gallery-manifest.json, see tools/build_gallery_manifest.py)
//   items:  ["a.webp", "b.mp4", {src: "...", title: "..."}, "https://youtu.be/..."]   (your own order)
// plus the settings in GALLERY_DEFAULTS (config.js): maxColumns, minColumnWidth,
// pinPrefix, style ("folder" | "raw"), showTitles, pixelated.

const GALLERY_MEDIA_EXT = /\.(png|jpe?g|gif|webp|avif|svg|mp4|webm|mov|m4v|ogv)$/i;
const GALLERY_GAP = 16; // px between tiles and columns
const GALLERY_MANIFEST_URL = "gallery-manifest.json";

function galleryConfig(data) {
  return Object.assign({}, GALLERY_DEFAULTS, data.gallery || {});
}

function galleryUrlPath(folder) {
  return folder.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

// ---------- Sorting: pinned first, then the rest; each group alphabetical ----------
function galleryCompare(a, b) {
  // numeric: img2 sorts before img10, pin_01 before pin_02
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function gallerySort(names, pinPrefix) {
  const p = (pinPrefix || "").toLowerCase();
  const isPinned = (n) => p !== "" && n.toLowerCase().startsWith(p);
  const pinned = names.filter(isPinned).sort(galleryCompare);
  const rest = names.filter((n) => !isPinned(n)).sort(galleryCompare);
  return pinned.concat(rest);
}

// "pin_01_red_sword.png" -> "red sword"
function galleryTitle(name, pinPrefix) {
  let t = name.replace(/\.[^.]+$/, "");
  const p = (pinPrefix || "").toLowerCase();
  if (p && t.toLowerCase().startsWith(p)) t = t.slice(p.length);
  t = t.replace(/^\d{1,3}[_\s]+/, "");
  t = t.replace(/[_\-]+/g, " ").trim();
  return t || name;
}

function galleryBaseName(src) {
  const base = String(src).split(/[?#]/)[0].split("/").pop();
  try { return decodeURIComponent(base); } catch (e) { return base; }
}

// ---------- Listing a folder (from gallery-manifest.json) ----------
async function galleryListFolder(folder) {
  let manifest;
  try {
    // no-cache = always check for a newer manifest (cheap: the browser revalidates)
    const res = await fetch(GALLERY_MANIFEST_URL, { cache: "no-cache" });
    if (res.status === 404) throw { code: "nomanifest" };
    if (!res.ok) throw { code: "http" };
    manifest = await res.json();
  } catch (err) {
    throw err && err.code ? err : { code: "network" };
  }

  const key = folder.replace(/^\/+|\/+$/g, "");
  const names = manifest[key];
  if (!Array.isArray(names)) throw { code: "notfound" };
  return names.filter(function (n) { return GALLERY_MEDIA_EXT.test(n); });
}

function galleryMessage(err, cfg) {
  switch (err && err.code) {
    case "nomanifest":
      return "gallery-manifest.json NOT FOUND // RUN THE 'BUILD GALLERY MANIFEST' ACTION ONCE (GITHUB > ACTIONS)";
    case "notfound":
      return "NO IMAGES FOUND IN " + cfg.folder + " // ADD IMAGES, PUSH, THEN WAIT FOR THE MANIFEST ACTION TO FINISH";
    default:
      return "GALLERY TEMPORARILY UNAVAILABLE // TRY AGAIN IN A BIT";
  }
}

// ---------- Loading one file so we know its real shape before placing it ----------
function galleryLoadMedia(src) {
  return new Promise(function (resolve) {
    if (embedSrc(src)) { // YouTube / Vimeo link
      resolve({ el: buildMedia(src, { alt: "video" }), ratio: 16 / 9, kind: "embed" });
      return;
    }
    if (isVideoSrc(src)) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.setAttribute("muted", "");
      v.loop = true;
      v.playsInline = true;
      v.onloadedmetadata = function () {
        resolve({ el: v, kind: "video", w: v.videoWidth, h: v.videoHeight,
                  ratio: (v.videoWidth || 16) / (v.videoHeight || 9) });
      };
      v.onerror = function () { resolve(null); };
      v.src = src;
      return;
    }
    const img = new Image();
    img.decoding = "async";
    img.onload = function () {
      resolve({ el: img, kind: "image", w: img.naturalWidth, h: img.naturalHeight,
                ratio: (img.naturalWidth || 1) / (img.naturalHeight || 1) });
    };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}

// ---------- One tile ----------
function galleryBuildTile(item, cfg) {
  const m = item.media;

  if (m.kind !== "embed") {
    m.el.className = "block w-full h-auto" +
      (cfg.style === "raw" ? "" : " transition-transform duration-300 hover:scale-105") +
      (cfg.pixelated && m.kind === "image" ? " pixelated" : "");
    if (m.kind === "image") m.el.alt = item.title;
  }

  // Style B ("raw"): just the media. No frame, no title, no popup; transparent PNGs stay transparent.
  if (cfg.style === "raw") {
    const raw = html('<div class="gallery-raw"></div>');
    raw.appendChild(m.el);
    return raw;
  }

  // Style A ("folder", default): folder card with a title tab, click to enlarge
  const label = cfg.showTitles
    ? '<div class="flex justify-end mb-[-1px]"><h3 class="card-label t-h3 truncate max-w-[85%]">' + esc(item.title) + "</h3></div>"
    : "";
  const tag = m.kind === "embed" ? "div" : "button"; // a video player can't live inside a button
  const tile = html(
    "<" + tag + ' class="tech-card"' + (tag === "button" ? ' type="button"' : "") + ">" + label +
      '<div class="double-border bg-black p-2">' +
        '<div class="tile-media overflow-hidden border border-neutral-800 bg-neutral-900"></div>' +
      "</div>" +
    "</" + tag + ">"
  );
  tile.querySelector(".tile-media").appendChild(m.el);
  return tile;
}

// ---------- Gallery renderer ----------
async function renderGallery(container, cfg) {
  container.replaceChildren();
  const status = html('<div class="double-border bg-black p-8 text-center"><p class="t-small dim"></p></div>');
  const statusText = status.querySelector("p");
  statusText.textContent = "LOADING GALLERY...";
  container.appendChild(status);

  // 1. Work out the list of files
  let entries; // [{ src, title }]
  if (Array.isArray(cfg.items) && cfg.items.length) {
    entries = cfg.items.map(function (it) {
      const src = typeof it === "string" ? it : (it && it.src) || "";
      let title = (it && typeof it === "object" && it.title) || "";
      if (!title) title = embedSrc(src) ? "video" : galleryTitle(galleryBaseName(src), cfg.pinPrefix);
      return { src: src, title: title };
    });
  } else if (cfg.folder) {
    let names;
    try {
      names = await galleryListFolder(cfg.folder);
    } catch (err) {
      statusText.textContent = galleryMessage(err, cfg);
      return;
    }
    if (!names.length) {
      statusText.textContent = "NO IMAGES YET // ADD FILES TO " + cfg.folder;
      return;
    }
    names = gallerySort(names, cfg.pinPrefix);
    const base = galleryUrlPath(cfg.folder);
    entries = names.map(function (n) {
      return { src: base + "/" + encodeURIComponent(n), title: galleryTitle(n, cfg.pinPrefix) };
    });
  } else {
    statusText.textContent = "GALLERY HAS NO folder OR items SET";
    return;
  }

  // 2. Load every file first so we know its real shape before placing it
  const loaded = await Promise.all(entries.map(function (e) {
    return galleryLoadMedia(e.src).then(function (media) {
      return media ? { src: e.src, title: e.title, media: media } : null;
    });
  }));

  const tiles = loaded.filter(Boolean).map(function (item) {
    return { el: galleryBuildTile(item, cfg), ratio: item.media.ratio, media: item.media,
             title: item.title, src: item.src };
  });

  if (!tiles.length) {
    statusText.textContent = "NOTHING COULD BE LOADED FOR THIS GALLERY";
    return;
  }

  // Folder style: clicking a tile opens the big view, with arrows (and the arrow keys) to step
  // through every image in the gallery, in the same order as the grid. Raw style has no popup.
  if (cfg.style !== "raw") {
    const lightbox = [];
    tiles.forEach(function (t) {
      if (t.media.kind === "embed") return; // YouTube / Vimeo tiles play right in the grid
      lightbox.push({ title: t.title, src: t.src, desc: t.media.w + " × " + t.media.h + " PX" });
      const at = lightbox.length - 1;
      t.el.addEventListener("click", function () {
        openModal(t.title, t.src, lightbox[at].desc,
          { fit: "contain", tall: true, pixelated: cfg.pixelated, list: lightbox, index: at });
      });
    });
  }

  // 3. Masonry layout.
  // Tiles are placed in order, each into the currently shortest column, so pinned
  // items land at the top and reading order stays roughly row by row.
  const wrap = html('<div class="flex items-start" style="gap:' + GALLERY_GAP + 'px"></div>');
  container.replaceChildren(wrap);
  let currentCols = 0;

  function layout(force) {
    const width = container.clientWidth;
    const cols = Math.max(1, Math.min(
      cfg.maxColumns,
      Math.floor((width + GALLERY_GAP) / (cfg.minColumnWidth + GALLERY_GAP))
    ));
    if (cols === currentCols && !force) return;
    currentCols = cols;

    const colWidth = (width - GALLERY_GAP * (cols - 1)) / cols;
    const overhead = (cfg.style === "raw" ? 0 : (cfg.showTitles ? 46 : 18)) + GALLERY_GAP; // label + frame + gap, in px
    const colEls = [];
    const heights = [];

    wrap.replaceChildren();
    for (let i = 0; i < cols; i++) {
      const c = html('<div class="flex-1 min-w-0 flex flex-col" style="gap:' + GALLERY_GAP + 'px"></div>');
      wrap.appendChild(c);
      colEls.push(c);
      heights.push(0);
    }

    tiles.forEach(function (t) {
      let k = 0;
      for (let i = 1; i < cols; i++) if (heights[i] < heights[k] - 1) k = i;
      colEls[k].appendChild(t.el);
      heights[k] += colWidth / t.ratio + overhead;
    });
  }

  layout(true);
  tiles.forEach(function (t) { if (t.media.kind === "video") autoplayWhenVisible(t.media.el); });

  if (window.ResizeObserver) {
    new ResizeObserver(function () { layout(false); }).observe(container);
  } else {
    window.addEventListener("resize", function () { layout(false); });
  }
}

// A whole category page that is one gallery (config: type: "gallery", gallery: { ... })
function renderGalleryPage(container, data) {
  return renderGallery(container, galleryConfig(data));
}
