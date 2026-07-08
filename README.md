# ergarcade
ErgArcade - a collection of tools, utilities and games for use on Concept2 Ergometers.

## Stack

Plain HTML/CSS/JS, no build step. Served directly by GitHub Pages
(`CNAME` → ergarcade.com).

- Homepage shows a capped preview (3 entries) of each category — Tools,
  Visualisations, Articles — with a "View all" link to `tools.html`,
  `visualisations.html`, or `articles.html` once a category outgrows the cap.
- Chart articles under `articles/` use [Apache ECharts](https://echarts.apache.org/),
  loaded from jsDelivr with a pinned version and Subresource Integrity hash — no
  vendored/local copies.
- Light/dark theme: `js/theme-toggle.js` plus CSS custom properties in `style.css`.
  Defaults to the OS preference (`prefers-color-scheme`), overridable per-visitor via
  the toggle button (persisted in `localStorage`).
- No linter or test framework is configured; verify changes by serving the repo with
  a static file server and checking pages in a browser.
