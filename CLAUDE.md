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
    `weight` (controls ordering everywhere), optional `thumbnail` (path to a
    card image, e.g. `/images/articles/slug.png`; falls back to the
    `.entry-thumb` placeholder pattern when absent).
- `layouts/` — templates. See `.claude/rules/layouts.md`.
- `static/` — copied verbatim to the site root; nothing in here is
  Hugo-processed. See `.claude/rules/static.md`.

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
  `.entry-thumb` — renders the page's `thumbnail` front-matter image
  (800×450, 16:9, `object-fit: cover`) when set, otherwise falls back to a
  diagonal-stripe CSS placeholder pattern. Tools/visualisations cards have no
  `thumbnail` field yet, so they still show the placeholder. Then
  `.entry-body` with title, optional `.tag`, description, optional
  `.entry-meta`. The partial's `compact` param selects `entry-thumb-compact`
  (shorter thumbnail, one-line clamped description, no meta line) for
  homepage previews vs. full-size cards on the dedicated category pages.
- Favicon is intentionally minimal: a single `<link rel="icon">` pointing at
  `images/ergarcade-64x64.png`. No manifest, browserconfig, or generated icon
  kit — don't re-add one without a concrete need.
- No test framework or linter exists. Verify changes with `hugo server -D`
  and checking pages in a browser — console errors, network 404s, and
  visual/theme-toggle/chart-render behavior — then confirm `hugo --minify`
  builds clean before relying on the GitHub Actions deploy.
