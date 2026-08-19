# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **plain static marketing website** for Prime Windows & Doors (`primewd.com`). There is **no build step, no package manager, and no backend**. Every `.html` page is self-contained (inline CSS/JS) and third-party libraries (Three.js, canvas-confetti, Leaflet) plus imagery (Cloudinary) load from CDNs at runtime, so **outbound internet is required** for full visual fidelity.

### Running in development
- Serve the repo root over HTTP (relative paths and the Leaflet `data/*.js`/`.geojson` fetches require HTTP, not `file://`):
  - `python3 -m http.server 8000` from `/workspace`, then open `http://localhost:8000/index.html`.
- Main entry point: `index.html`. Other key pages: `guide.html`, `florida-zones.html` (interactive Leaflet map), `thank-you.html`, and `brands/*.html`.

### Lint / test / build
- There is **no lint suite, no test suite, and no build** (see `netlify.toml`: `publish = "."`, `command = ""`). Do not look for `package.json`, lockfiles, or CI workflows — none exist.

### Non-obvious gotchas
- The homepage contact form uses **Netlify Forms** (`data-netlify="true"`, `action="/thank-you.html"`). Submission capture only works on Netlify (or via `netlify dev`); on a plain `python3 -m http.server` the POST to `/thank-you.html` will not be captured (form fields still fill/validate client-side).
- `data/` filenames are hyphenated (e.g. `florida-counties.geojson`, `florida-wind-zones-cat2.js`); the `_st1mi/` shapefiles are source geodata and are not served to the browser.
