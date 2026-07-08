# ergarcade (www-ergarcade)

Static site for ergarcade.com, built with [Hugo](https://gohugo.io) (single Go
binary, no Node/npm/package.json). `hugo server -D` for local dev,
`hugo --minify` for a production build into `public/` (gitignored). GitHub
Actions (`.github/workflows/hugo.yml`) builds and deploys to Pages on every
push to `master`.

## Layout

- `hugo.toml` — site config. `[params]` holds the pinned ECharts CDN version +
  SRI hashes used by every article page — bump them here, not per-file.
- `content/` — one Markdown file per page.
  - `content/_index.md` — homepage front matter (hero title/description).
  - `content/tools/`, `content/visualisations/` — one file per external
    tool/visualisation card (`link`, `description`, and for tools only `tag` /
    `requires`). These have `build: {render: false}` in front matter — they're
    link-out cards, not real pages, so Hugo indexes them for listings but
    doesn't generate a page for them.
  - `content/articles/` — one Markdown file per article, real pages. Front
    matter: `title`, `description` (short blurb, used on listing cards),
    `tagline` (longer intro paragraph shown under the `<h1>` on the article's
    own page — these two are usually different text, don't collapse them into
    one field), `chartScript` (path to the article's `js/charts/*.js` module),
    `weight` (controls ordering everywhere).
- `layouts/` — templates.
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
  - `articles/single.html` — article page: hero, `{{ .Content }}`, plus the
    ECharts CDN `<script>` tags (version/hashes from `hugo.toml` params) and
    the article's own `chartScript` module tag.
  - `shortcodes/chart.html` — `{{< chart "Title" "Sub text" "div-id" >}}`,
    renders one `.chart-card` block with the `.chart-box` div a
    `js/charts/*.js` module attaches to.
  - `shortcodes/formula.html` — `{{< formula >}}...{{< /formula >}}`, wraps
    inline HTML (`<sub>`/`<sup>`) in a `.formula` block.
- `static/` — copied verbatim to the site root; nothing in here is
  Hugo-processed. `style.css`, `js/`, `images/`, `CNAME` all keep their
  existing absolute paths (`/style.css`, `/js/...`) unchanged.
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

## Conventions

- URLs are Hugo's default "pretty" form (`/tools/`, `/articles/slug/`) — this
  is a change from the pre-Hugo site's flat `.html` URLs, made deliberately
  during the port.
- ECharts is loaded from jsDelivr (`cdn.jsdelivr.net/npm/echarts@<version>`)
  with a pinned exact version and an SRI `integrity` + `crossorigin="anonymous"`
  attribute — never `@latest`, since SRI requires an immutable file. The
  version and both hashes (main bundle + dark theme) live once in
  `hugo.toml`'s `[params]`. When bumping the version, regenerate both hashes
  via jsDelivr's data API
  (`https://data.jsdelivr.com/v1/packages/npm/echarts@<version>?structure=flat`,
  the `hash` field is base64 SHA-256), update `hugo.toml`, and re-verify all
  four article pages render.
- Theming uses three CSS layers in `static/style.css`: a `:root` default, an
  `@media (prefers-color-scheme: dark)` override, and `:root[data-theme="light"]`
  / `:root[data-theme="dark"]` overrides with strictly higher specificity so an
  explicit user choice always wins over the OS preference regardless of source
  order. Colour tokens are `--paper`/`--ink`/`--muted`/`--border`/`--card`/`--accent`.
- Card grids (`.grid` of `.entry-card`, rendered by `partials/entry-card.html`)
  are the shared pattern for every tool/visualisation/article listing: an
  `.entry-thumb` placeholder image (a diagonal-stripe CSS pattern — there are
  no real screenshots yet; swap in real thumbnails when available instead of
  removing the placeholder), then `.entry-body` with title, optional `.tag`,
  description, optional `.entry-meta`. The partial's `compact` param selects
  `entry-thumb-compact` (shorter thumbnail, one-line clamped description, no
  meta line) for homepage previews vs. full-size cards on the dedicated
  category pages.
- Favicon is intentionally minimal: a single `<link rel="icon">` pointing at
  `images/ergarcade-64x64.png`. No manifest, browserconfig, or generated icon
  kit — don't re-add one without a concrete need.
- No test framework or linter exists. Verify changes with `hugo server -D`
  and checking pages in a browser — console errors, network 404s, and
  visual/theme-toggle/chart-render behavior — then confirm `hugo --minify`
  builds clean before relying on the GitHub Actions deploy.
