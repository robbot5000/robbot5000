// theme.js — reads THEME from config.js and pushes it into CSS variables.
// Load AFTER config.js, in <head>, so the colors are set before first paint.
// You shouldn't need to edit this file; edit THEME in config.js instead.

(function () {
  if (typeof THEME === "undefined") return;

  const root = document.documentElement;
  const set = (name, value) => root.style.setProperty(name, value);
  const STATES = ["normal", "hover", "text"];

  // ---------- Built-in arrow cursor (inline SVG) ----------
  function arrowUrl(fill, stroke) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<path d="M3 3 L3 22 L8.5 17 L12.5 25 L16 23.3 L12 15.5 L19 15.5 Z" ' +
      'fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 3 3';
  }

  // Cursor values for the two non-custom looks
  function builtInCursors(kind) {
    const c = THEME.colors, r = THEME.roles;
    const color = c[r.cursor] || c.color2;
    if (kind === "system") return { normal: "auto", hover: "pointer", text: "text" };
    return {
      normal: arrowUrl(color, c.black) + ", auto",
      hover: arrowUrl(color, c.white) + ", pointer",
      text: "text"
    };
  }

  function setCursorVars(v) {
    set("--cursor-default", v.normal);
    set("--cursor-pointer", v.hover);
    set("--cursor-text", v.text);
  }

  // ---------- Custom cursor files ----------
  function pathsFor(cfg, state) {
    const v = (cfg.states || {})[state];
    const list = Array.isArray(v) ? v : (v ? [v] : []);
    const folder = (cfg.folder || "").replace(/\/*$/, "/");
    return list.filter(Boolean).map(function (f) { return folder + f; });
  }

  function probe(path) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = encodeURI(path);
    });
  }

  function applyCursor() {
    const cfg = THEME.cursor || { mode: "arrow" };

    if (cfg.mode === "system") { setCursorVars(builtInCursors("system")); return; }
    if (cfg.mode !== "custom") { setCursorVars(builtInCursors("arrow")); return; }

    const fallback = builtInCursors(cfg.fallback === "system" ? "system" : "arrow");
    const paths = {};
    STATES.forEach(function (s) { paths[s] = pathsFor(cfg, s); });

    // Each state becomes: file1, file2, ..., fallback. The browser uses the first it can load.
    function build(byState) {
      const out = {};
      STATES.forEach(function (s) {
        const urls = byState[s].map(function (p) { return 'url("' + encodeURI(p) + '")'; });
        out[s] = urls.concat(fallback[s]).join(", ");
      });
      return out;
    }

    setCursorVars(build(paths)); // apply right away, then verify below

    const unique = [];
    STATES.forEach(function (s) {
      paths[s].forEach(function (p) { if (unique.indexOf(p) === -1) unique.push(p); });
    });

    Promise.all(unique.map(probe)).then(function (results) {
      const ok = {};
      unique.forEach(function (p, i) {
        ok[p] = results[i];
        if (results[i]) return;
        if (/\.ani$/i.test(p)) {
          console.info("[cursor] " + p + " is an animated .ani cursor, which browsers can't use. Skipping to the next file in its list.");
        } else {
          console.warn("[cursor] could not load " + p + " (check the folder and exact file name, they are case-sensitive).");
        }
      });

      const working = {};
      STATES.forEach(function (s) { working[s] = paths[s].filter(function (p) { return ok[p]; }); });

      // Nothing usable for the normal cursor: switch everything to the fallback look
      if (working.normal.length === 0) {
        console.warn("[cursor] no custom cursor could be loaded. Using the '" + (cfg.fallback === "system" ? "system" : "arrow") + "' fallback.");
        setCursorVars(fallback);
        return;
      }
      // No usable hover file: reuse the custom normal cursor rather than mixing looks
      if (working.hover.length === 0) working.hover = working.normal;

      setCursorVars(build(working));
    });
  }

  // ---------- Colors, roles, typography ----------
  function applyTheme() {
    const c = THEME.colors;
    const r = THEME.roles;

    set("--black", c.black);
    set("--white", c.white);
    set("--color1", c.color1);
    set("--color2", c.color2);
    set("--color3", c.color3);

    set("--selected", c[r.selected] || c.color1);
    set("--cursor-color", c[r.cursor] || c.color2);
    set("--hover", c[r.hover] || c.color3);

    ["h1", "h2", "h3", "body", "small"].forEach(function (level) {
      const f = THEME.fonts[level];
      if (!f) return;
      set("--" + level + "-family", f.family);
      set("--" + level + "-size", f.size);
      set("--" + level + "-weight", f.weight);
      set("--" + level + "-tracking", f.tracking);
      set("--" + level + "-transform", f.transform);
      set("--" + level + "-leading", f.leading);
    });

    applyCursor();
  }

  applyTheme();

  // Console helpers for live experiments:
  //   setRole("hover", "color1")       setCursorMode("system")   setCursorMode("custom")
  window.setRole = function (role, colorKey) {
    THEME.roles[role] = colorKey;
    applyTheme();
  };
  window.setCursorMode = function (mode) {
    THEME.cursor = THEME.cursor || {};
    THEME.cursor.mode = mode;
    applyCursor();
  };
})();
