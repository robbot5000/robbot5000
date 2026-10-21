#!/usr/bin/env python3
"""Build gallery-manifest.json: {"folder/path": ["image1.png", ...]} for every
folder under assets/ that contains images. The gallery pages read this file to
know what is in each folder (GitHub Pages cannot list a folder by itself).

Runs automatically via .github/workflows/gallery-manifest.yml.
To run it by hand from the repo root:  python tools/build_gallery_manifest.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = "assets"
EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg")

manifest = {}
for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, ASSETS)):
    dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
    images = sorted(
        f for f in filenames
        if not f.startswith(".") and f.lower().endswith(EXTENSIONS)
    )
    if images:
        rel = os.path.relpath(dirpath, ROOT).replace(os.sep, "/")
        manifest[rel] = images

out = os.path.join(ROOT, "gallery-manifest.json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2, sort_keys=True, ensure_ascii=False)
    fh.write("\n")

print("Wrote %s: %d folders, %d images" % (
    out, len(manifest), sum(len(v) for v in manifest.values())))
