// ============================================================
// PROJECT PAGES  (block-based pages, stacked from top to bottom)
// ============================================================
// Each entry here is its own page, opened from a project card.
//
// HOW A CARD FINDS ITS PAGE
//   A project card in CATEGORY_DATA (config.js) opens the page whose key is the
//   project title in lowercase with dashes:
//     "INTEL ENCORE EXHIBIT" -> "intel-encore-exhibit"      "Tech-Hub" -> "tech-hub"
//   Or set it yourself on the project:  { title: "...", page: "my-page-key", ... }
//   Projects with no page here keep opening the quick popup, as before.
//   Keys must not match a category key from config.js.
//
// A PAGE
//   "page-key": {
//     title: "PAGE TITLE",
//     category: "interactive",          // category key from config.js: where BACK returns to
//     heroImage: "assets/....webp",     // cover image at the top ("" = placeholder)
//     blocks: [ ...see below... ]
//   }
//   You can also make a whole category page out of blocks: in CATEGORY_DATA set
//   type: "blocks" and add a blocks: [ ... ] list there.
//
// BLOCKS  (add one line per block; they stack in this order)
//
//   { type: "full",    media: "...", caption: "optional" }
//       Media across the full width.
//   { type: "left",    media: "...", title: "optional", text: "..." }
//       Media on the LEFT half, text centered on the right half.
//   { type: "right",   media: "...", title: "optional", text: "..." }
//       Media on the RIGHT half, text centered on the left half.
//   { type: "gallery", folder: "assets/some-folder" }
//   { type: "gallery", items: ["a.webp", "b.mp4", "https://youtu.be/xxxxxxxxxxx"] }
//       A grid of photos / videos: from a folder (needs the manifest action), or your own list.
//       Optional: title, maxColumns, style ("folder" | "raw"), pixelated, showTitles, pinPrefix.
//   { type: "text",    title: "optional", text: "...", align: "center" }
//       Just words (intro, statement, credits).
//
//   media can be:
//     an image            "assets/x/photo.webp"   (.webp .png .jpg .gif .avif .svg)
//     a video file        "assets/x/clip.mp4"     (.mp4 .webm .m4v; mp4 H.264 plays everywhere)
//     a YouTube / Vimeo   "https://www.youtube.com/watch?v=xxxxxxxxxxx"  or  "https://vimeo.com/123456"
//   Video files play silent + looping by default (like a GIF). For a normal player add controls: true.
//   Long videos: use YouTube / Vimeo. GitHub Pages is not built for large video files.
//
//   Optional on any media block (full / left / right):
//     alt: "description"   frame: false (no border, e.g. transparent PNGs)   pixelated: true
//     controls: true   autoplay: false   loop: false   muted: false   poster: "assets/x/still.webp"
//   Optional on left / right / text:   panel: false (text without the border box)
//
//   text: a blank line starts a new paragraph. In JavaScript write it as one string with \n\n
//   between paragraphs, or as a list of strings: ["first paragraph", "second paragraph"].
// ============================================================

const PROJECT_PAGES = {

  // EXAMPLE: replace the placeholder text and media, then copy this entry for your next project.
  "intel-encore-exhibit": {
    title: "INTEL ENCORE EXHIBIT",
    category: "interactive",
    heroImage: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",
    blocks: [
      { type: "text", title: "OVERVIEW",
        text: "Real-time sensory tracking interface, physical computing, and custom spatial projection mapping." },

      { type: "full", media: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
        caption: "[ optional caption ]" },

      { type: "left", media: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",
        title: "[ SECTION TITLE ]",
        text: "[ Describe this part of the project. ]\n\n[ A blank line starts a new paragraph. ]" },

      { type: "right", media: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
        title: "[ SECTION TITLE ]",
        text: "[ Media on the right, text on the left. ]" },

      { type: "gallery", title: "[ GALLERY ]", maxColumns: 2, style: "folder",
        items: [
          "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
          "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp"
        ] }

      // More things you can drop in:
      // { type: "full", media: "assets/interactive/intel-encore/demo.mp4" },
      // { type: "full", media: "https://www.youtube.com/watch?v=xxxxxxxxxxx" },
      // { type: "gallery", folder: "assets/interactive/intel-encore/photos" },
    ]
  },

  "dark-matter-2024": {
    title: "DARK MATTER STAGE 2024",
    category: "lighting-visuals",
    heroImage: "assets/visuals-lighting/dark-matter-2024/IMG20241025000051_webp.webp",
    blocks: [
      { type: "text", title: "OVERVIEW",
        text: "Main stage multi-projection & screen build, installation, programming and operating for Last Planet & Deep Dark and Dangerous' Dark Matter 2023 event. A collaboration with Prayfirstdiva." },

      { type: "full", media: "assets/visuals-lighting/dark-matter-2024/IMG20241026031846_webp.webp",
        caption: "EVENT PHOTO" },

      { type: "left", media: "assets/visuals-lighting/dark-matter-2024/Vid20241024235930.mp4",
        title: "DETAILS",
        text: "A massive projection-mapped 39x9ft Tulle screen with a 14x8ft rear screen setup which created a parallax visual effect." }
    ]
  }

};
