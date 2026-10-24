// ============================================================
// THEME CONTROL PANEL  (edit this block to restyle the whole site)
// ============================================================
const THEME = {

  // 1. PALETTE ------------------------------------------------
  // black = background, white = main elements.
  // color1/2/3 = the three accent colors.
  colors: {
    black:  "#000000",
    white:  "#FFFFFF",
    color1: "#00FFFF",   // cyan
    color2: "#FF00FF",   // pink
    color3: "#FFFF00"    // yellow
  },

  // 2. ROLES --------------------------------------------------
  // Which accent does which job. Swap by changing the value to
  // "color1", "color2" or "color3". (You can also point a role
  // at "white" or "black".)
  roles: {
    selected: "color1",  // active tab / selected element, modal dot
    cursor:   "color2",  // color of the built-in arrow cursor (only used if cursor.mode is "arrow", or as the fallback)
    hover:    "color3"   // hovered tab / card / button, scrollbar hover
  },

  // 3. TYPOGRAPHY ---------------------------------------------
  // Every level has its own family so you can change one without
  // touching the others. "size" accepts any CSS value, clamp() is
  // used on h1 so it scales between phone and desktop.
  fonts: {
    h1: {   // hero titles (DESIGN, INDUSTRIAL DESIGN ...)
      family: "Consolas, 'Courier New', monospace",
      size: "clamp(2.5rem, 9vw, 6rem)",
      weight: 900,
      tracking: "-0.05em",
      transform: "uppercase",
      leading: 1
    },
    h2: {   // modal titles, section headings
      family: "Consolas, 'Courier New', monospace",
      size: "1.125rem",
      weight: 700,
      tracking: "0.05em",
      transform: "uppercase",
      leading: 1.2
    },
    h3: {   // nav tabs, card labels, buttons
      family: "Consolas, 'Courier New', monospace",
      size: "0.8125rem",
      weight: 700,
      tracking: "0.08em",
      transform: "uppercase",
      leading: 1.2
    },
    body: { // paragraphs / descriptions
      family: "Consolas, 'Courier New', monospace",
      size: "0.875rem",
      weight: 400,
      tracking: "0",
      transform: "none",
      leading: 1.6
    },
    small: { // footer / meta text
      family: "Consolas, 'Courier New', monospace",
      size: "0.625rem",
      weight: 400,
      tracking: "0.15em",
      transform: "uppercase",
      leading: 1.4
    }
  },

  // 4. MOUSE CURSOR -------------------------------------------
  // mode:     "custom" = your cursor files below
  //           "arrow"  = built-in arrow in the roles.cursor color
  //           "system" = the plain browser/OS cursor
  // fallback: what to show if mode is "custom" but the files can't be loaded
  //           ("arrow" or "system"). It switches automatically.
  // folder:   where the cursor files live (names below are relative to it,
  //           and are case-sensitive on GitHub Pages)
  // states:   which file is used where. Each can be one file, or a list where
  //           the first one the browser can use wins.
  //             normal = everywhere
  //             hover  = links, buttons, cards, tabs, dropdowns
  //             text   = text fields
  //           Use .cur files (or .png). Browsers can't use animated .ani cursors, so
  //           those are skipped in favor of the next file in the list.
  //           Other files in your pack you can swap in: Link Select, Alt Select,
  //           Precision Select, Help Select, Handwriting, Move, Unavailable ...
  cursor: {
    mode: "custom",
    fallback: "arrow",
    folder: "assets/mouse-cursor/synthwave-night/",
    states: {
      normal: "Synthwave-Normal-Select.cur",
      hover:  "Synthwave-Precision-Select.cur",
      text:   "Synthwave-Text-Select.cur"
    }
  }
};

// ============================================================
// WEBSITE MEDIA CONFIGURATION
// ============================================================
const SITE_MEDIA = {
  // MAIN HERO TAB IMAGES
  heroDesign: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
  heroArtExperiments: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
  heroBio: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
  heroContact: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",

  // LANDING PAGE CARDS
  cardIndustrialDesign: "assets/industrial-design/lucite-dreams/All-3.356_webp.webp",
  cardLightingVisuals: "assets/visuals-lighting/sojourn-2024/sojournstagetest_webp.webp",
  cardGraphicsRenders: "assets/graphics-renders/posters/NINE-0-NINE_March-Poster_PRE_webp.webp",
  cardInteractive: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",

  // ART / EXPERIMENTS CARDS  (empty "" = a NO SIGNAL placeholder is shown; add a path when ready)
  cardElectronicsBuilds: "",
  cardTouchdesigner: "",
  cardPixelArt: "",
  cardRandom: ""
};

// ============================================================
// NAVIGATION
// ============================================================
// Top tabs, in order. Each has a label, a hero image key (from SITE_MEDIA)
// and a view type:
//   "categories" = grid of folder cards. Each card links to category.html?type=KEY
//                  (KEY must exist in CATEGORY_DATA below)
//   "bio"        = portrait + profile list (see BIO)
//   "contact"    = excerpt + email form (see CONTACT)
const NAV = {
  design: {
    label: "DESIGN",
    hero: "heroDesign",
    view: "categories",
    categories: [
      { key: "interactive",       label: "INTERACTIVE",       image: "cardInteractive" },
      { key: "lighting-visuals",  label: "LIGHTING / VISUALS", image: "cardLightingVisuals" },
      { key: "industrial-design", label: "INDUSTRIAL DESIGN", image: "cardIndustrialDesign", grayscale: true },
      { key: "graphics-renders",  label: "GRAPHICS / RENDERS", image: "cardGraphicsRenders" }
    ]
  },
  art: {
    label: "ART / EXPERIMENTS",
    hero: "heroArtExperiments",
    view: "categories",
    categories: [
      { key: "electronics-builds", label: "ELECTRONICS / BUILDS", image: "cardElectronicsBuilds" },
      { key: "touchdesigner",      label: "TOUCHDESIGNER",        image: "cardTouchdesigner" },
      { key: "pixel-art",          label: "PIXEL ART",            image: "cardPixelArt" },
      { key: "random",             label: "RANDOM",               image: "cardRandom" }
    ]
  },
  bio: {
    label: "BIO",
    hero: "heroBio",
    view: "bio"
  },
  contact: {
    label: "CONTACT",
    hero: "heroContact",
    view: "contact"
  }
};

// ============================================================
// BIO PAGE
// ============================================================
// photo: path to your portrait ("" = placeholder). fields: add, remove or
// reorder rows freely. Ideas: PRONOUNS, LANGUAGES, CLIENTS, EXHIBITED AT,
// AWARDS, FAVORITE TOOLS, CURRENTLY READING, FUN FACT.
// links: rows with an empty href are hidden.
const BIO = {
  photo: "assets/branding/robbot5000-photos/DSC01336_edit-01_webp.webp",
  fields: [
    { label: "NAME",         value: "Robert Rigo" },
    { label: "HANDLE",       value: "@ROBBOT.5000" },
    { label: "OCCUPATION",   value: "[ job title ]" },
    { label: "LOCATION",     value: "Toronto, ON" },
    { label: "EDUCATION",    value: "[ program ], Humber" },
    { label: "INTERESTS",    value: "[ interests ]" },
    { label: "SOFTWARE",     value: "TouchDesigner, [ more ]" },
    { label: "HARDWARE",     value: "[ gear you build with ]" },
    { label: "FOCUS",        value: "[ areas of work ]" },
    { label: "CURRENTLY",    value: "[ what you're working on ]" },
    { label: "AVAILABILITY", value: "Open to collaborations + commissions" }
  ],
  links: [
    { label: "GITHUB",    href: "" },
    { label: "INSTAGRAM", href: "" },
    { label: "LINKEDIN",  href: "" }
  ]
};

// ============================================================
// CONTACT PAGE
// ============================================================
// email:    your address (used for the direct link and the fallback below)
// endpoint: a form-service URL (Formspree, Web3Forms, etc.). While this is ""
//           the Send button opens the visitor's email app, pre-filled.
// extraFields: anything the service needs sent along, e.g. { access_key: "..." }
const CONTACT = {
  excerpt: "Contact me for collaborations / commission work!",
  email: "info@robbot.tech",
  endpoint: "https://api.web3forms.com/submit",
  extraFields: { access_key: "c35fcbd5-6251-4fa3-9d8d-76615b7d9f9b" },
  topics: ["COLLABORATION", "COMMISSION", "OTHER"]
};

// ============================================================
// GALLERY SETTINGS
// ============================================================
// Gallery pages read gallery-manifest.json, a list of every image folder under
// assets/. A GitHub Action (.github/workflows/gallery-manifest.yml) rebuilds it
// automatically whenever you push changes inside assets/. Nothing to fill in here.

// Defaults for every gallery page. Override any of these inside a page's own
// `gallery: { ... }` block.
const GALLERY_DEFAULTS = {
  maxColumns: 3,         // never more than this many columns (fewer on small screens)
  minColumnWidth: 260,   // px; columns drop away on narrow screens to keep tiles this wide
  pinPrefix: "pin_",     // files starting with this go to the top (alphabetical), then the rest
  style: "folder",       // "folder" = folder cards w/ titles, click to enlarge | "raw" = bare images, no click
  showTitles: true,      // (folder style) label tab above each tile, made from the file name
  pixelated: false       // true = crisp pixel-art scaling
};

// ============================================================
// CATEGORY PAGE DATA
// ============================================================
// Every category has a page type:
//   type: "project"  -> grid of project cards, each opening a detail popup (projects: [...])
//   type: "gallery"  -> auto-built from a GitHub folder (gallery: { folder: "..." })
// "parent" is the top tab the page belongs to (design, art) so BACK returns there.
const CATEGORY_DATA = {
  "industrial-design": {
    title: "INDUSTRIAL DESIGN",
    parent: "design",
    type: "project",   // "project" or "gallery"
    heroImage: "assets/industrial-design/lucite-dreams/All-3.356_webp.webp",
    projects: [
      {
        title: "harmony",
        image: "assets/industrial-design/harmony/renders/Title_squarespace_webp.webp",
        description: "Humber thesis project. Music therapy device for youth with Autism"
      },
      {
        title: "Tech-Hub",
        image: "assets/industrial-design/tech-hub-copernicus/renders/DSCF0053_webp.webp",
        description: "Humber 3rd year project. E-learning device secure storage & charging modular units."
      },
      {
        title: "LUCITE DREAMS",
        image: "assets/industrial-design/lucite-dreams/untitled.302_webp.webp",
        description: "Acrylic sheet furniture. Collaboration with design Dan Puntillo"
      },
      {
        title: "LENSBOTS SERIES 1",
        image: "assets/industrial-design/lensbots-series-1/Ad2_Circular.5_webp.webp",
        description: "Lil' robot guys."
      }
    ]
  },
  "lighting-visuals": {
    title: "LIGHTING / VISUALS",
    parent: "design",
    type: "project",   // "project" or "gallery"
    heroImage: "assets/visuals-lighting/sojourn-2024/sojournstagetest_webp.webp",
    projects: [
      {
        title: "DOCD BASS COAST 2024",
        image: "assets/visuals-lighting/docd-bass-coast-2024/IMG20240428030229_webp.webp",
        description: "Multi-projection interactive floor tracker. A collaboration with Prayfirstdiva."
      },
      {
        title: "DOCD NO NEON 2023",
        image: "assets/visuals-lighting/docd-no-neon-2023/20231028_022619_webp.webp",
        description: "Multi-projection hacker-screen-terminal main stage build, installation and programming for DOCD x No Neon. A collaboration with Prayfirstdiva."
      },
      {
        title: "DOCD NYE",
        image: "assets/visuals-lighting/docd-nye/DOCD_NYE_3_webp.webp",
        description: "First stage build, installation, programming and operating for techno room of DOCD NYE. Solo project."
      },
      {
        title: "HNTRNET 2023",
        image: "assets/visuals-lighting/hntrnet-2023/HNTRNET_V003_webp.webp",
        description: "Holomesh screen stage build, installation, programming and operating for HNTRNET show at Coda. A collaboration with Prayfirstdiva."
      },
      {
        title: "HNTRNET IRL",
        image: "assets/visuals-lighting/hntrnet-irl/LED-Mesh-vs-Rear-Screen-Effect-Example_webp.webp",
        description: "Blow-through LED panel stage build, programming and operating for HNTRNET IRL show at DPRTMNT. A collaboration with Prayfirstdiva."
      },
      {
        title: "SIRKUIT 2024",
        image: "assets/visuals-lighting/sirkuit-2024/IMG20240316014456_01_webp.webp",
        description: "Custom LED bar + projection build, installation, programming and operating for main stage of Sirkuit. Solo project."
      },
      {
        title: "TECHROMANCY 01",
        image: "assets/visuals-lighting/techromancy-01/590283596_10164850211267269_5981170181316067098_n_webp.webp",
        description: "Real-time Unreal Engine visuals on 5 separate projection screens for Techromancy 01. Solo project."
      },
      {
        title: "TECHROMANCY 02",
        image: "assets/visuals-lighting/techromancy-02/IMG20251206022742_webp.webp",
        description: "Main stage real-time visuals & interactive projection-mapped cyber-DOS terminal for Techromancy 02. Solo project."
      },
      {
        title: "DARK MATTER 2024",
        image: "assets/visuals-lighting/dark-matter-2024/IMG20241025000051_webp.webp",
        description: "Main stage multi-projection & screen build, installation, programming and operating for Last Planet & Deep Dark and Dangerous' Dark Matter 2023 event. A collaboration with Prayfirstdiva."
      },
      {
        title: "SOJOURN 2024 STAGE",
        image: "assets/visuals-lighting/sojourn-2024/IMG20240727003921_webp.webp",
        description: "Custom projection-mapped stage design build, installation, programming and operating for Sound Depot stage of Sojourn. A collaboration with Prayfirstdiva."
      },
      {
        title: "THE INDUSTRY CINECYCLE",
        image: "assets/visuals-lighting/techromancy-02/IMG20251206022742_webp.webp",
        description: "Custom LED Bar installation, programming and operating for The Industry Cinecycle event. Solo project."
      },
      {
        title: "THE INDUSTRY KAJAMA",
        image: "assets/visuals-lighting/the-industry-kajama/20230522_004501_webp.webp",
        description: "Custom LED Bar build, installation, programming and operating for The Industry Kajama boat party event. Solo project."
      },
      {
        title: "COMFORT ZONE TRIBUNAL",
        image: "assets/visuals-lighting/comfort-zone-tribunal/20230804_215613_webp.webp",
        description: "Custom LED Bar installation and programming for Tribunal's Comfort Zone event. Solo project."
      },
    ]
  },
  "graphics-renders": {
    title: "GRAPHICS / RENDERS",
    parent: "design",
    type: "project",   // "project" or "gallery"
    heroImage: "assets/graphics-renders/posters/NINE-0-NINE_March-Poster_PRE_webp.webp",
    projects: [
      {
        title: "NINE-0-NINE Poster",
        image: "assets/graphics-renders/posters/NINE-0-NINE_March-Poster_PRE_webp.webp",
        description: "Poster for a local techno show at Bar Cathedral. Was my first time VJing and creating an event poster"
      }
    ]
  },
  "interactive": {
    title: "INTERACTIVE",
    parent: "design",
    type: "project",   // "project" or "gallery"
    heroImage: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",
    projects: [
      {
        title: "INTEL ENCORE EXHIBIT",
        image: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
        description: "Real-time sensory tracking interface, physical computing, and custom spatial projection mapping."
      },
      {
        title: "TECHROMANCY 03",
        image: "assets/interactive/techromancy-03/IMG20260530235132_webp.webp",
        description: "Interactive projection-mapped cyber-DOS teriminal LARP for Techromancy 03. Solo project."
      },
      {
        title: "LTS SCANNING PORTAL",
        image: "assets/interactive/lts-scanning-portal/IMG20260130231500_webp.webp",
        description: "Interactive projection-mapped custom painting. A collaboration with Prayfirstdiva."
      }
    ]
  },
  "electronics-builds": {
    title: "ELECTRONICS / BUILDS",
    parent: "art",
    type: "project",   // "project" or "gallery"
    heroImage: "",   // add path
    projects: [
      { title: "ADD PROJECT", image: "", description: "Placeholder. Edit in config.js." }
    ]
  },
  "touchdesigner": {
    title: "TOUCHDESIGNER",
    parent: "art",
    type: "project",   // "project" or "gallery"
    heroImage: "",   // add path
    projects: [
      { title: "ADD PROJECT", image: "", description: "Placeholder. Edit in config.js." }
    ]
  },
  "pixel-art": {
    title: "PIXEL ART",
    parent: "art",
    type: "gallery",
    heroImage: "",   // add path
    gallery: {
      folder: "assets/pixel-art",  // every image in this GitHub folder shows up
      pixelated: true,             // crisp, un-blurred scaling for pixel art
      style: "raw"                 // "raw" = bare images, "folder" = folder cards with titles
    }
  },
  "random": {
    title: "RANDOM",
    parent: "art",
    type: "project",   // "project" or "gallery"
    heroImage: "",   // add path
    projects: [
      { title: "ADD PROJECT", image: "", description: "Placeholder. Edit in config.js." }
    ]
  }
};
