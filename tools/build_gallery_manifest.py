#!/usr/bin/env python3
"""Build gallery-manifest.json: {"folder/path": ["image1.png", "clip.mp4", ...]} for every
folder under assets/ that contains images or videos. The gallery pages read this file to
know what is in each folder (GitHub Pages cannot list a folder by itself).

Runs automatically via .github/workflows/gallery-manifest.yml.
To run it by hand, from inside your repo folder:
    python tools/build_gallery_manifest.py
or point it at the repo explicitly:
    python path/to/build_gallery_manifest.py path/to/your-repo
"""
import json
import os
import sys

ASSETS = "assets"
EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg",
              ".mp4", ".webm", ".mov", ".m4v", ".ogv")


def find_root():
    """The repo root is the folder that contains assets/."""
    if len(sys.argv) > 1:
        return os.path.abspath(sys.argv[1])
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # parent of tools/
    for candidate in (here, os.getcwd()):
        if os.path.isdir(os.path.join(candidate, ASSETS)):
            return candidate
    return None


root = find_root()
if root is None or not os.path.isdir(os.path.join(root, ASSETS)):
    print("ERROR: could not find an 'assets' folder.")
    print("  Looked in: %s" % os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    print("        and: %s" % os.getcwd())
    print("Put the tools folder inside your repo folder (next to assets/), or run:")
    print("  python tools/build_gallery_manifest.py path/to/your-repo")
    sys.exit(1)

manifest = {}
for dirpath, dirnames, filenames in os.walk(os.path.join(root, ASSETS)):
    dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
    images = sorted(
        f for f in filenames
        if not f.startswith(".") and f.lower().endswith(EXTENSIONS)
    )
    if images:
        rel = os.path.relpath(dirpath, root).replace(os.sep, "/")
        manifest[rel] = images

out = os.path.join(root, "gallery-manifest.json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2, sort_keys=True, ensure_ascii=False)
    fh.write("\n")

print("Wrote %s: %d folders, %d images" % (
    out, len(manifest), sum(len(v) for v in manifest.values())))
for folder in sorted(manifest):
    print("  %s  (%d)" % (folder, len(manifest[folder])))
if not manifest:
    print("WARNING: assets/ exists but no images were found in it.")
