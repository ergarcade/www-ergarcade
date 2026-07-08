# ergarcade (www-ergarcade)

Static site for ergarcade.com — plain HTML/CSS/JS, no build tooling, no
`package.json`, no bundler, no linter. Served as-is by GitHub Pages. Don't introduce
build tooling; keep changes as directly-servable files.

## Layout

- `index.html` — landing page, links out to separate `ergarcade/*` GitHub Pages
  projects plus the local articles below.
- `articles/*.html` — standalone data-analysis pages, each with interactive ECharts
  charts. Every article duplicates the same header/toggle/footer markup as
  `index.html` (no templating system) — when changing shared markup, apply the change
  to all of them.
- `js/charts/*.js` — one module per article, builds ECharts option objects and calls
  `graphLoader` from `js/chart-load.js`.
- `js/utils/datetime.js` — pure-JS pace/duration formatting (`secs2mmss`, `ds2mmss`,
  `mmss2secs`). No date library dependency — do not reintroduce one; these functions
  are simple enough to keep dependency-free.
- `js/theme-toggle.js` — shared light/dark toggle. Sets `data-theme` on `<html>`,
  persists to `localStorage`, dispatches a `themechange` `CustomEvent` that
  `chart-load.js` listens for to re-render charts in the new theme.

## Conventions

- ECharts is loaded from jsDelivr (`cdn.jsdelivr.net/npm/echarts@<version>`) with a
  pinned exact version and an SRI `integrity` + `crossorigin="anonymous"` attribute on
  every `<script>` tag — never `@latest`, since SRI requires an immutable file. When
  bumping the version, regenerate both hashes via jsDelivr's data API
  (`https://data.jsdelivr.com/v1/packages/npm/echarts@<version>?structure=flat`, the
  `hash` field is base64 SHA-256) and re-verify all chart articles render.
- Theming uses three CSS layers in `style.css`: a `:root` default, an
  `@media (prefers-color-scheme: dark)` override, and `:root[data-theme="light"]` /
  `:root[data-theme="dark"]` overrides with strictly higher specificity so an explicit
  user choice always wins over the OS preference regardless of source order.
- Favicon is intentionally minimal: a single `<link rel="icon">` pointing at
  `images/ergarcade-64x64.png`. No manifest, browserconfig, or generated icon kit —
  don't re-add one without a concrete need.
- No test framework or linter exists. Verify changes by serving the repo with a static
  file server (e.g. `python3 -m http.server`) and checking pages in a browser —
  console errors, network 404s, and visual/theme-toggle behavior.
