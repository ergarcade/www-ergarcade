---
description: Conventions for static/ (copied verbatim to site root)
paths:
  - "static/**"
---

# static/ — copied verbatim to site root

Nothing in here is Hugo-processed. `style.css`, `js/`, `images/`, `CNAME`
all keep their existing absolute paths (`/style.css`, `/js/...`) unchanged.

- `static/js/charts/*.js` — one module per article, builds ECharts option
  objects and calls `graphLoader` from `static/js/chart-load.js`. Prefer
  separate single-axis charts (small multiples) over one chart with
  multiple y-axes when a page shows several metrics — a dual/multi-axis
  chart is the easiest way to mislead a reader about scale.
- `static/js/utils/datetime.js` — pure-JS pace/duration formatting
  (`secs2mmss`, `ds2mmss`, `mmss2secs`). No date library dependency — do
  not reintroduce one; these functions are simple enough to keep
  dependency-free.
- `static/js/theme-toggle.js` — shared light/dark toggle. Sets
  `data-theme` on `<html>`, persists to `localStorage`, dispatches a
  `themechange` `CustomEvent` that `chart-load.js` listens for to
  re-render charts in the new theme.
- `static/js/chart-load.js` — `graphLoader()` checks `document.readyState`
  before wiring up rendering, instead of relying solely on a
  `DOMContentLoaded` listener — that used to be duplicated (and once
  broke) in every chart file; it's now handled once, here.
