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
    tool/visualisation card (`link`, `description`, and for tools only
    `requires`; optional `thumbnail` on either, see below). These have
    `build: {render: false}` in front matter — they're link-out cards, not
    real pages, so Hugo indexes them for listings but doesn't generate a page
    for them. See "Adding a new tool card" below for the full mechanical
    process (also captured as the `add-tool-card` skill).
  - `content/articles/` — one Markdown file per article, real pages. Front
    matter: `title`, `description` (short blurb, used on listing cards),
    `tagline` (longer intro paragraph shown under the `<h1>` on the article's
    own page — these two are usually different text, don't collapse them into
    one field), `chartScript` (path to the article's `js/charts/*.js` module),
    optional `thumbnail` (path to a card image, e.g. `/images/articles/slug.png`;
    falls back to the `.entry-thumb` placeholder pattern when absent).
  - All three content types set `date` (full timestamp, not just day — needed
    to order same-day additions correctly) — see "Card ordering, filtering,
    and sorting" below. `weight` is no longer read by any template; existing
    files may still carry a stale `weight` field, harmless leftover, don't
    bother stripping it out on sight.
- `layouts/` — templates. See `.claude/rules/layouts.md`.
- `static/` — copied verbatim to the site root; nothing in here is
  Hugo-processed. See `.claude/rules/static.md`.

## Conventions

- URLs are Hugo's default "pretty" form (`/tools/`, `/articles/slug/`) — this
  is a change from the pre-Hugo site's flat `.html` URLs, made deliberately
  during the port. Old `.html` URLs that may still be linked externally get
  an `aliases` front-matter entry (e.g. `aliases: ["/articles/slug.html"]`)
  so Hugo generates a static redirect page — GitHub Pages on a custom domain
  has no server-side redirect config, so this meta-refresh + canonical page
  is the mechanism, not a true 301.
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
  diagonal-stripe CSS placeholder pattern. Then `.entry-body` with title,
  optional `.tag` (still rendered by the partial if a page sets one, but no
  current content file does — the tag concept was dropped from tools),
  description, optional `.entry-meta`. The partial's `compact` param selects
  `entry-thumb-compact` (shorter thumbnail, one-line clamped description, no
  meta line) for homepage previews vs. full-size cards on the dedicated
  category pages. Every card also carries `data-date-unix` for the sort
  control (see below).
- Favicon is intentionally minimal: a single `<link rel="icon">` pointing at
  `images/ergarcade-64x64.png`. No manifest, browserconfig, or generated icon
  kit — don't re-add one without a concrete need.
- No test framework or linter exists. Verify changes with `hugo server -D`
  and checking pages in a browser — console errors, network 404s, and
  visual/theme-toggle/chart-render behavior — then confirm `hugo --minify`
  builds clean before relying on the GitHub Actions deploy.

## Card ordering, filtering, and sorting

Every listing (`/tools/`, `/visualisations/`, `/articles/`, and the homepage's
capped 3-entry previews) orders cards **newest first** by `date`
(`.Pages.ByDate.Reverse` in `layouts/_default/list.html` and
`layouts/partials/home-section.html`) — uniformly across all three sections,
including articles, which used to be hand-curated by `weight`. There is no
per-section override; if a card needs to be pinned out of date order again in
the future, that's a template change, not a front-matter flag to add lightly.

The full-listing pages (not the homepage previews) also get a filter input
and a sort-by select, wired by `static/js/card-list.js` (vanilla JS, no
library — plenty at this scale):

- **Filter** (`#card-filter`): case-insensitive substring match against each
  `.entry-card`'s full rendered text (title, description, "Requires:" line —
  all included for free via `.textContent`, no per-field indexing). Non-matches
  get `hidden`; an empty-state message (`#card-filter-empty`) shows when
  nothing matches.
- **Sort** (`#card-sort`): `Date (newest first)` (default — matches the
  server-rendered order, so no re-sort runs on a plain page load) or
  `Name (A–Z)`, reordering `.entry-card` DOM nodes in place by reading each
  card's `data-date-unix` or its `.entry-title` text.
- Both are reflected in the URL (`?q=...`, `?sort=name`; absent/`date` means
  the default) via `history.replaceState` — not `pushState`, so typing in the
  filter doesn't spam browser back-history — so a filtered/sorted view is
  shareable. On load, the script reads these params and applies them
  immediately, before any user interaction.

## Adding a card thumbnail

Any tool/visualisation/article card can show a real screenshot instead of
the diagonal-stripe placeholder: drop an **800×450 (16:9)** image under
`static/images/<section>/<slug>.png` (`<section>` is `tools`, `visualisations`,
or `articles`) and set `thumbnail: "/images/<section>/<slug>.png"` in that
page's front matter. `object-fit: cover` handles minor aspect mismatches, but
match 800×450 exactly where you can — that's what every existing thumbnail
uses. No other wiring needed; `partials/entry-card.html` already renders it
when the field is present.

## Adding a new tool card

Publishing one of the ergarcade PM5 apps (e.g. `pm5-base`, `virtual-monitor`)
as a card here is a mechanical, cross-repo checklist — use the `add-tool-card`
skill (`.claude/skills/add-tool-card/SKILL.md`) rather than re-deriving it.
Short version:

1. In the tool's own repo: confirm it works locally and its tests pass.
2. Add a `deploy-pages.yml` GitHub Actions workflow to the tool's repo (copy
   an existing one, e.g. `pm5-base`'s or `virtual-monitor`'s, and adjust the
   build step's file list for that repo's layout). The repo must be public
   for Pages-via-Actions to work on the free plan. Enable Pages with
   `gh api -X POST repos/ergarcade/<repo>/pages -f build_type=workflow`.
3. Screenshot the running app with Playwright (headless Chromium, viewport
   800×450, dark `colorScheme`) using its Mock transport so no hardware is
   needed — run it for a few simulated minutes first so the numbers look
   real, not a 0:00 startup state. Save to `static/images/tools/<slug>.png`
   (see "Adding a card thumbnail" above for the dimension convention).
4. Add `content/tools/<slug>.md`:
   ```yaml
   ---
   title: "<slug>"
   description: "One line, matches the tool's own README tagline."
   link: "https://ergarcade.github.io/<slug>"
   requires: "Desktop, Chrome, Bluetooth"
   thumbnail: "/images/tools/<slug>.png"
   date: "<now, full ISO timestamp>"
   build:
     render: false
   ---
   ```
5. Verify with `hugo server -D` (check both the `/tools/` listing and the
   homepage preview, light and dark) and `hugo --minify`.
