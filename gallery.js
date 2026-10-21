// gallery.js — renders "gallery" type category pages.
// Reads the folder's file list from gallery-manifest.json (built by a GitHub
// Action, see tools/build_gallery_manifest.py), sorts it,
// and lays the images out in a masonry grid that respects each image's own
// aspect ratio (landscape, portrait and square all work).
//
// Settings live in config.js: GALLERY_DEFAULTS and the page's own
// `gallery: { ... }` block in CATEGORY_DATA.

const GALLERY_IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const GALLERY_GAP = 16; // px between tiles and columns

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

// ---------- Listing the folder (from gallery-manifest.json) ----------
const GALLERY_MANIFEST_URL = "gallery-manifest.json";

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
  return names.filter(function (n) { return GALLERY_IMAGE_EXT.test(n); });
}

function galleryLoadImage(url) {
  return new Promise(function (resolve) {
    const img = new Image();
    img.decoding = "async";
    img.onload = function () { resolve(img); };
    img.onerror = function () { resolve(null); };
    img.src = url;
  });
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

// ---------- One tile ----------
function galleryBuildTile(item, cfg) {
  // Style B ("raw"): just the image. No frame, no title, no popup, transparent PNGs stay transparent.
  if (cfg.style === "raw") {
    const raw = html('<div class="gallery-raw"></div>');
    item.img.alt = item.title;
    item.img.className = "block w-full h-auto" + (cfg.pixelated ? " pixelated" : "");
    raw.appendChild(item.img);
    return raw;
  }

  // Style A ("folder", default): folder card with a title tab, click to enlarge
  const label = cfg.showTitles
    ? '<div class="flex justify-end mb-[-1px]"><h3 class="card-label t-h3 truncate max-w-[85%]">' + esc(item.title) + "</h3></div>"
    : "";
  const tile = html(
    '<button type="button" class="tech-card">' + label +
      '<div class="double-border bg-black p-2">' +
        '<div class="tile-media overflow-hidden border border-neutral-800 bg-neutral-900"></div>' +
      "</div>" +
    "</button>"
  );

  const img = item.img;
  img.alt = item.title;
  img.className = "block w-full h-auto transition-transform duration-300 hover:scale-105" +
    (cfg.pixelated ? " pixelated" : "");
  tile.querySelector(".tile-media").appendChild(img);

  tile.addEventListener("click", function () {
    openModal(item.title, img.src, img.naturalWidth + " × " + img.naturalHeight + " PX",
      { fit: "contain", tall: true, pixelated: cfg.pixelated });
  });
  return tile;
}

// ---------- Page renderer ----------
async function renderGalleryPage(container, data) {
  const cfg = galleryConfig(data);

  container.replaceChildren();
  const status = html('<div class="double-border bg-black p-8 text-center"><p class="t-small dim"></p></div>');
  const statusText = status.querySelector("p");
  statusText.textContent = "LOADING GALLERY...";
  container.appendChild(status);

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

  // Load every image first so we know its real shape before placing it
  const base = galleryUrlPath(cfg.folder);
  const loaded = await Promise.all(names.map(function (n) {
    return galleryLoadImage(base + "/" + encodeURIComponent(n)).then(function (img) {
      return img ? { name: n, img: img } : null;
    });
  }));

  const tiles = loaded.filter(Boolean).map(function (it) {
    const item = {
      title: galleryTitle(it.name, cfg.pinPrefix),
      img: it.img
    };
    return {
      el: galleryBuildTile(item, cfg),
      ratio: (it.img.naturalWidth || 1) / (it.img.naturalHeight || 1)
    };
  });

  if (!tiles.length) {
    statusText.textContent = "NO IMAGES COULD BE LOADED FROM " + cfg.folder;
    return;
  }

  // ---------- Masonry layout ----------
  // Tiles are placed in sorted order, each into the currently shortest column,
  // so pinned items land at the top and reading order stays roughly row by row.
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
  if (window.ResizeObserver) {
    new ResizeObserver(function () { layout(false); }).observe(container);
  } else {
    window.addEventListener("resize", function () { layout(false); });
  }
}
