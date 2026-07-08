# ergarcade
ErgArcade - a collection of tools, utilities and games for use on Concept2 Ergometers.

## Stack

Built with [Hugo](https://gohugo.io) (single Go binary, no Node/npm). Deployed
to GitHub Pages via GitHub Actions on every push to `master`
(`static/CNAME` → ergarcade.com).

- `hugo server -D` — local dev server with live reload.
- `hugo --minify` — production build into `public/` (gitignored).
- Homepage shows a capped preview (3 entries) of each category — Tools,
  Visualisations, Articles — with a "View all" link to `/tools/`,
  `/visualisations/`, or `/articles/` once a category outgrows the cap.
- Chart articles under `content/articles/` use [Apache ECharts](https://echarts.apache.org/),
  loaded from jsDelivr with a pinned version and Subresource Integrity hash (configured
  once in `hugo.toml`) — no vendored/local copies.
- Light/dark theme: `static/js/theme-toggle.js` plus CSS custom properties in
  `static/style.css`. Defaults to the OS preference (`prefers-color-scheme`),
  overridable per-visitor via the toggle button (persisted in `localStorage`).
- No linter or test framework is configured; verify changes with `hugo server -D`
  and checking pages in a browser, then confirm `hugo --minify` builds clean.

See `CLAUDE.md` for the full content/template layout.
