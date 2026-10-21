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
    selected: "color1",  // active tab / selected element, modal dot, footer diamond
    cursor:   "color2",  // mouse cursor
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
  cardInteractive: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp"
};

// CATEGORY PAGE DATA & PROJECTS
const CATEGORY_DATA = {
  "industrial-design": {
    title: "INDUSTRIAL DESIGN",
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
    heroImage: "assets/visuals-lighting/sojourn-2024/sojournstagetest_webp.webp",
    projects: [
      {
        title: "SOJOURN 2024 STAGE",
        image: "assets/visuals-lighting/sojourn-2024/Sojourn-2024_Stage-v1_webp.webp",
        description: "Custom projection-mapped stage design for Sojourn Fest 2024. A collaboration with Prayfirstdiva."
      }
    ]
  },
  "graphics-renders": {
    title: "GRAPHICS / RENDERS",
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
    heroImage: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp",
    projects: [
      {
        title: "INTEL ENCORE EXHIBIT",
        image: "assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp",
        description: "Real-time sensory tracking interface, physical computing, and custom spatial projection mapping."
      }
    ]
  }
};
