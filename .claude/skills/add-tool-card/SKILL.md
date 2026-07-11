---
name: add-tool-card
description: Publish one of the ergarcade PM5 apps (its own sibling repo, e.g. pm5-base, virtual-monitor, recorder) as a Tool card on www-ergarcade -- deploy it to GitHub Pages via Actions, screenshot it running against the Mock transport, and add its content/tools/<slug>.md card. Use when asked to add/publish a tool to www-ergarcade, add a tool card, or make an app available on ergarcade.com.
---

# Adding a new tool card to www-ergarcade

This is a **cross-repo, mechanical process**: most of it happens in the
tool's own repo (a sibling directory, e.g. `../virtual-monitor`), and the
last step happens here in `www-ergarcade`. First worked through end-to-end
for `virtual-monitor` — see that repo's git history and this repo's
`content/tools/virtual-monitor.md` for a worked example.

Read `CLAUDE.md`'s "Adding a new tool card" section first for the front
matter schema and card conventions. This file is the detailed how-to.

## 0. Figure out the category

Tools vs Visualisations are different `content/` sections with different
front matter conventions (see `CLAUDE.md`). A PM5-connected utility or app is
a **Tool**. A generative/visual thing driven by pace data with no real
"utility" purpose is a **Visualisation**. If it's genuinely unclear which,
ask the user rather than guessing — don't invent a third category.

## 1. Verify the app works, in its own repo

```
cd ../<tool-repo>
git status --short          # clean tree, expected branch
node --test                 # or whatever its test command is
```

Also do a quick local-serve smoke test (e.g. `python3 -m http.server` +
`curl` every asset path the HTML references) — confirms nothing 404s before
you build a whole deploy pipeline around it.

## 2. Add a GitHub Pages deploy workflow, in its own repo

Check whether `.github/workflows/deploy-pages.yml` (or similar) already
exists — if the tool already deploys, skip to step 3. Otherwise, copy the
pattern from an existing sibling repo (`pm5-base` or `virtual-monitor`) and
adapt only the build step's file list to that repo's own layout:

- `pm5-base` deploys `example/` (a subfolder) + `lib/`, and has to rewrite
  `../lib/` path references since flattening the subfolder into the site
  root changes relative paths.
- `virtual-monitor` deploys straight from the repo root (`index.html`,
  `app.js`, etc.) plus the `pm5-base` submodule's `lib/` — no path rewriting
  needed since `index.html` already references `pm5-base/lib/...` directly.
- If the tool vendors `pm5-base` as a submodule, the checkout steps need
  `with: { submodules: true }`, and the build step's `cp -r` of `lib/` must
  be recursive so `lib/mock-data/` (including the sample CSV) comes along —
  it's a normal tracked file, not LFS, so a plain recursive copy is enough.

This requires a commit in the tool's own repo. **Follow that repo's own git
approval rules** (this workspace's standing rule: show the commit message,
get explicit confirmation, before committing — same for any `gh api` calls
that change repo settings). Specifically, before this can actually deploy:

```
# The tool's repo must be PUBLIC for Pages-via-Actions to work on the free
# plan (private Pages needs GitHub Enterprise). Confirm with the user before
# flipping visibility -- it's a one-way-feeling, externally-visible change.
gh repo edit ergarcade/<repo> --visibility public --accept-visibility-change-consequences

# Enable Pages with GitHub Actions as the source (confirm with the user first
# -- it's a repo-settings change). Check it isn't already enabled first:
gh api repos/ergarcade/<repo>/pages            # 404 if not yet enabled
gh api -X POST repos/ergarcade/<repo>/pages -f build_type=workflow
```

Ask the user whether they want to push/merge the workflow branch themselves
(the pattern used so far) or want you to push it directly — Pages only
starts deploying once something lands on the default branch.

## 3. Screenshot it running, via Playwright + Mock

No hardware needed — every one of these apps has a Mock transport for
exactly this. Use headless Chromium via the `playwright` npm package (not
the `chromium-cli` skill tool, which isn't set up for this and would need
its own session) in a **scratch** location, not as a project dependency:

```
cd <scratchpad>
npm init -y --silent
npm install --no-save playwright
npx playwright install chromium     # ~100MB+ download, one-time per machine;
                                     # cached at ~/Library/Caches/ms-playwright
```

See `screenshot-mock.mjs` alongside this file for a working template
(used verbatim for `virtual-monitor`). It:

- launches headless Chromium with `viewport: 800x450` (matches
  `.entry-thumb`'s 800×450/16:9 convention) and `colorScheme: 'dark'`,
- selects Mock from the transport dropdown (don't rely on it being the
  default — `navigator.bluetooth`/`navigator.hid` often exist in a headless
  Chromium context and would otherwise win the "first supported transport"
  default),
- winds the mock speed up (e.g. 16x) and waits for a real, populated
  moment (a few simulated minutes in) rather than screenshotting the 0:00
  startup state — "try to get something interesting",
- screenshots and closes.

**Adapt the DOM selectors and the "wait until populated" condition per app**
— `virtual-monitor` waits on `#slot-time` text; an app with a different
layout (e.g. `pm5-base`'s example, which builds cards per event type) needs
a different selector. Check `console`/`pageerror` events came back empty
before trusting the screenshot.

Before trusting the shot as "interesting", check the tool's sample CSV
(`pm5-base/lib/mock-data/*.csv` or equivalent) for what data it actually
contains — the shipped sample has **no heart rate data at all**, so a blank
heart-rate reading in the screenshot is correct, not a bug.

Save the output to `static/images/tools/<slug>.png` here in www-ergarcade,
exactly 800×450.

## 4. Add the card

`content/tools/<slug>.md` — see the template in `CLAUDE.md`. Set `date` to
now (full ISO timestamp, e.g. `2026-07-11T19:36:16+10:00`) — cards sort
newest-first by `date` everywhere (listing pages and homepage previews);
`weight` is no longer read for ordering, don't add it to new cards.

## 5. Verify

```
hugo server -D
```
Check `/tools/`, the homepage preview, and both light/dark themes. Then
confirm production build is clean:
```
hugo --minify
rm -rf public resources .hugo_build.lock
```

A quick Playwright screenshot of the rendered `/tools/` page (same
headless-Chromium setup as step 3, no Mock/app-specific logic needed) is a
fast way to visually sanity-check the card without a manual browser check.

## 6. Hand off

Tell the user it's ready for local review (`hugo server -D`). Once they
approve: create a branch in www-ergarcade, stage the changed/new files, show
the commit message, get confirmation, commit. The user handles push/merge
to `master` themselves (matches this workspace's established pattern) unless
they say otherwise.
