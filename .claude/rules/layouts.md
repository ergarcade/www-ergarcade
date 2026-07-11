---
description: Template conventions for layouts/
paths:
  - "layouts/**"
---

# layouts/ — templates

- `_default/baseof.html` + `partials/header.html` + `partials/footer.html`
  are the single source of truth for shared chrome — this replaced 8 pages
  that used to hand-duplicate the same header/nav/footer markup (a repeat
  source of bugs before the Hugo port). Edit them once.
- `index.html` — homepage: capped 3-entry preview per section via
  `partials/home-section.html`, "View all N →" only rendered when a section
  actually has more than 3 entries (`len $sec.Pages > 3`) — don't add the
  link pre-emptively.
- `_default/list.html` — shared full-listing layout for `/tools/`,
  `/visualisations/`, `/articles/` — one template for all three, since the
  only difference between their cards is which optional front-matter fields
  are present (data-driven, not template branching).
- `partials/entry-card.html` — one card, used by both `list.html` (full-size)
  and `home-section.html` (`compact`). Renders `.Params.thumbnail` as an
  `<img>` when set, else falls back to a CSS placeholder; also reads
  `.Params.tag` if present, though no current content file sets one — the
  tag concept was dropped from tools. See CLAUDE.md's "Adding a card
  thumbnail".
- `articles/single.html` — article page: hero, `{{ .Content }}`, plus the
  ECharts CDN `<script>` tags (version/hashes from `hugo.toml` params) and
  the article's own `chartScript` module tag.
- `shortcodes/chart.html` — `{{< chart "Title" "Sub text" "div-id" >}}`,
  renders one `.chart-card` block with the `.chart-box` div a
  `js/charts/*.js` module attaches to.
- `shortcodes/formula.html` — `{{< formula >}}...{{< /formula >}}`, wraps
  inline HTML (`<sub>`/`<sup>`) in a `.formula` block.
