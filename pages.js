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
  /*
  "example-project-name": {
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

      { type: "right", media: ["assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp", "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp"],
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
      // For photos:
      // { type: "full",  media: "assets/x/photo.webp" },                           // one photo
      // { type: "full",  media: ["assets/x/a.webp", "assets/x/b.webp", "assets/x/c.mp4"] },   // slideshow
      // { type: "left",  media: ["a.webp", "b.webp"], title: "...", text: "..." },
      // { type: "right", folder: "assets/x/photos", text: "..." },  
      //   text: ["Intro", "- bullet one", "- bullet two"]  -> a line, then a bulleted list
    ]
  },
  */

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
        text: "[ Describe this part of the project. ]=\n\n[ A blank line starts a new paragraph. ]" },

      { type: "right", media: ["assets/interactive/intel-encore/INTELAIEXHIBIT_W-V1_webp.webp", "assets/interactive/intel-encore/INTELAIEXHIBIT_W-13_webp.webp"],
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
      // For photos:
      // { type: "full",  media: "assets/x/photo.webp" },                           // one photo
      // { type: "full",  media: ["assets/x/a.webp", "assets/x/b.webp", "assets/x/c.mp4"] },   // slideshow
      // { type: "left",  media: ["a.webp", "b.webp"], title: "...", text: "..." },
      // { type: "right", folder: "assets/x/photos", text: "..." },
      // { type: "button", hyperlink: "examplewebsite.com", label: "VISIT SITE", align: "left" }
      // Opens the link in a new tab. label and align (left | center | right) are optional.
      // { type: "button", buttons: [ { label: "...", hyperlink: "..." }, { label: "...", hyperlink: "..." } ] }
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
  },

    "harmony": {
    title: "Harmony Thesis Project",
    category: "industrial-design",
    heroImage: "assets/industrial-design/harmony/photos/event-photos/harmony-thesis-photo-6.webp",
    blocks: [
      { type: "full", media: "assets/industrial-design/harmony/renders/Title_webp.webp",
        caption: "" },

      { type: "full", media: "assets/industrial-design/harmony/graphics/Poster_Robert Rigo_webp.webp",
        caption: "" },

      { type: "full", media: "assets/industrial-design/harmony/graphics/Process1_Robert Rigo_webp.webp",
        caption: "" },

      { type: "full", media: "assets/industrial-design/harmony/graphics/Process2_Robert Rigo_webp.webp",
        caption: "" },
  
      { type: "full", media: "assets/industrial-design/harmony/graphics/Process3_Robert Rigo_webp.webp",
        caption: "" },

      { type: "gallery", folder: "assets/industrial-design/harmony/photos/event-photos/event-selection",
        caption: "Thesis Event" },

      { type: "gallery", folder: "assets/industrial-design/harmony/photos/final-build",
        caption: "Final Model" },

      { type: "text", title: "Final Design",
        text: ["Harmony is a contemporary approach to music therapy for youth with Autism.",
          "",
          "The device acts as a sampler which requires audio/ vocal input to begin to form music.",
          "",
          "The two-sided body and on-board functions easily lends itself to a social, two user experience which boosts sociability and communication, while providing a fun, engaging learning experience of music production through the use of sample pads, sequencer, FX modules and tactile speaker panel."
        ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final-Design_1_webp.webp",
        caption: "" },

      { type: "text", title: "",
        text: [
          "Harmony's functionality is divided into two individual surfaces and a shared console.",
          "",
          "The two individual surfaces consist of...",
          "• 6 Recordable & Playable Sample Buttons + Sample Clearer (Trash)",
          "• 2 Inductive Effect Active Circle Pads",
          "• Wooden Speaker Panel",
          "• Volume Dial",
          "• Headphone Jack",
          "",
          "These functions are equally divided on either the warm-toned side and the cool-toned side. While the sides are identical in functionality, the LEDs differ providing different feelings depending on the primary user’s preference."
        ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final+Render+V3.133_webp.webp",
        caption: "" },

      { type: "text", title: "Sample Buttons",
        text: [
          "The sample buttons have two simple functions.",
          "",
          "1. When unlit, pressing the button records until pressed again. (or up to 3 sec)",
          "",
          "2. When lit up, pressing the button plays the recorded audio clip once.",
          "",
          "The microphone is shared in the middle and is able to reach either side via the gooseneck mount.\n\nBefore recording, either user must ask for the microphone to bring it to their side to use, which encourages communication and sharing.",
          "",
          "For the cool-toned side, recorded audio features colours such as blue, purple and green.\n\nThe warm-toned side features colours such as orange, yellow and red.",
          "",
          "When holding down the trash button, whichever sample button is pressed down with it gets deleted, as indicated via red light."
        ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/sample-buttons-interface-trash_webp.webp",
        caption: "" },

      { type: "text", title: "Vibration Speaker",
        text: "The wooden ‘speaker panel’ located under the device diffuses the vibration from a vibration speaker located in the middle back to individually customize sound levels per side and provide a tactile stimulatory experience for those who are unable or not comfortable to fully participate yet." },

      { type: "full", media: "assets/industrial-design/harmony/renders/vibration-speaker_webp.webp",
        caption: "" },

      { type: "text", title: "Modular Effect Modules",
        text: [
          "Sitting neatly underneath both handles of the main body are 4 different modular inductive effect modules.",
          "",
          "These modules can be used once the users have gotten more comfortable with the device and are ready to try and learn something new.",
          "",
          "They can be used on either side of the device by simply placing them in the white cups of the main body.",
          "",
          "One placed inside, the internal light of the module will turn on and now whichever sample is played will be modified by that module!",
          "",
          "The 4 different effects to choose from are Volume/ Tone, Arpeggiator, Flanger, and Delay and two can be used at the same time on either side.",
          "",
          "They can be used to effect the samples live or while recording." 
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Modules_frontlineup.122_webp.webp",
        caption: "" },

      { type: "text", title: "",
        text: [
          "The groove design on the effect modules simulate the effect it has on the sound as a form of sensory stimulation and indication.",
          "",
          "The grooves remain transparent and are lit up when activated and adjusted.",
          "",
          "Their other main function is for ergonomic use of using the groove for easy grip to pick up the modules."
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Modules_frontlineup.122_webp.webp",
        caption: "" },

      { type: "text", title: "USB Charging & Saving",
        text: [
          "On one side of the console lies the USB port of the device.",
          "",
          "The port doubles as a charging port for the internal battery and data transfer to output the loop to a USB stick via the silicone USB button.",
          "",
          "Allows the user to save the memory of the interaction they had that day, and maybe even jam out to it later!"
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final-Render-V3.143_webp.webp",
        caption: "" },

      { type: "text", title: "Tap Tempo Pad",
        text: [
          "Above the charging/ data transfer port is the silicone tap tempo adjuster.",
          "",
          "Either user is able to speed up or slow down the tempo depending on the BPM of their tapping."
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final-Render-V3.144_webp.webp",
        caption: "" },

      { type: "text", title: "Volume & Headphones",
        text: [
          "Volume dials are located on either end of the device, giving individual control on volume preference.",
          "",
          "The volume control adjusts either the speaker panel or headphones if plugged in."
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final-Render-V3.145_webp.webp",
        caption: "" },

      { type: "text", title: "Sequencer Buttons",
        text: [
          "The sequencer is essentially the arrangement of the sample sounds.",
          "",
          "It's a 2-bar loop that can be added to by...",
          "",
          "1. Pressing the record button on the console",
          "2. Playing the selected samples however you’d like",
          "3. Pressing the stop or record button again to end",
          "",
          "The sequence can then be played and stopped via the play/ stop button.",
          "",
          "When recorded, the sequencer will light up according to the sounds placed in it.",
          "They can then be temporarily muted/ unmuted by pressing the corresponding number, or deleted via trash clear button."
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final+Render+V3.137_webp.webp",
        caption: "" },

      { type: "text", title: "Visualizer",
        text: [
          "The visualizer is an LED visual display of what’s being played on either sequencer.",
          "",
          "If both sounds play at the same time, it shows a balance of the sounds' volume/ frequency from both sides.",
          "",
          "A final, simple representation of the two users coming together in harmony."
          ]},

      { type: "full", media: "assets/industrial-design/harmony/renders/Final+Render+V3_webp.webp",
        caption: "" },

      { type: "button", hyperlink: "https://humber.primo.exlibrisgroup.com/nde/fulldisplay?context=L&vid=01OCLS_HUMB:REPOSITORY_NDE&lang=en&docid=alma991001564298907314", label: "PUBLISHED HARMONY FINAL REPORT", align: "center" }

    ]
  }

};
