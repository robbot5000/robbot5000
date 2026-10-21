// theme.js — reads THEME from config.js and pushes it into CSS variables.
// Load AFTER config.js, in <head>, so the colors are set before first paint.
// You shouldn't need to edit this file; edit THEME in config.js instead.

(function () {
  if (typeof THEME === "undefined") return;

  const root = document.documentElement;
  const set = (name, value) => root.style.setProperty(name, value);

  // Arrow cursor as an inline SVG. 'fill' = cursor color, 'stroke' = outline.
  function cursorCss(fill, stroke) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<path d="M3 3 L3 22 L8.5 17 L12.5 25 L16 23.3 L12 15.5 L19 15.5 Z" ' +
      'fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 3 3, auto';
  }

  function applyTheme() {
    const c = THEME.colors;
    const r = THEME.roles;

    // Raw palette
    set("--black", c.black);
    set("--white", c.white);
    set("--color1", c.color1);
    set("--color2", c.color2);
    set("--color3", c.color3);

    // Roles (what the CSS actually uses)
    set("--selected", c[r.selected] || c.color1);
    set("--cursor-color", c[r.cursor] || c.color2);
    set("--hover", c[r.hover] || c.color3);

    // Typography
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

    // Cursors: normal = black outline, clickable = white outline
    const cursorColor = c[r.cursor] || c.color2;
    set("--cursor-default", cursorCss(cursorColor, c.black));
    set("--cursor-pointer", cursorCss(cursorColor, c.white));
  }

  applyTheme();

  // Console helper for live experiments, e.g.  setRole("cursor", "color3")
  window.setRole = function (role, colorKey) {
    THEME.roles[role] = colorKey;
    applyTheme();
  };
})();
