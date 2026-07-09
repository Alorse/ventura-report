---
name: ventura-report
description: >-
  Generate a polished, on-brand HTML report in the Ventura Travel "team-system"
  visual identity (warm cream paper, deep teal, terracotta accents, Cormorant
  Garamond display + Inter body). Produces a self-contained, printable (A4),
  shareable HTML document with a cover block, sections, tables, cards, metrics,
  callouts, badges, numbered steps, and a footer. Use when the user asks to
  "generate a Ventura report", "report in Ventura style", "reporte estilo
  Ventura", "team-system report", "Ventura Travel branded report/document",
  or to format any content as an on-brand Ventura deliverable.
---

# Ventura Travel Report

Generates HTML reports that match the Ventura Travel **team-system** design
(measured from `https://p.venturatravel.org/team-system`). Use it whenever
someone wants a report, brief, summary, or document that looks on-brand.

## When to use
Trigger phrases: "generate a Ventura report", "Ventura-style report", "reporte
estilo Ventura", "team-system report", "make this on-brand for Ventura",
"Ventura Travel branded document".

## Output location

Always generate reports under a `reports/` directory in your working directory
(or another location the user specifies). Write both the authoring file and the
bundled artifact there (create the directory if it does not exist:
`mkdir -p reports`). Use a descriptive, kebab-case filename, e.g.
`reports/q2-2026-summary.bundled.html`.

## Output: always a single self-contained file

The deliverable is **one `.html` file** with **nothing local** — paste-ready for
tools like **hostmyclaudehtml.com**. After filling the template, always run
`build.js` (step 5): it inlines the CSS into a `<style>` tag and converts the
logo to a base64 data URI. No webfont is loaded (the live page loads none
either), so the only remote reference is the hero photo (a cloud Unsplash URL) —
by design. Never ship the folder-with-`assets/` version to a single-file host.

## How to generate a report

1. **Copy the template.** Start from `template.html` in this skill folder.
2. **Fill the nav + cover tokens:** `{{NAV_LABEL}}` (short uppercase tag next to
   the logo, e.g. `Q2 REPORT`), `{{NAV_1}}`/`{{NAV_2}}`/`{{NAV_3}}` (section
   links — keep their `#overview`/`#detail`/`#next` anchors, or rename both the
   link and the matching `<h2 id="…">`), then `{{TITLE}}`, `{{SUBTITLE}}`,
   `{{EYEBROW}}` (short uppercase kicker), `{{DATE}}`, `{{AUTHOR}}`,
   `{{AUDIENCE}}`.
3. **Write the body.** Replace the placeholder sections with the real content.
   Reuse the component blocks already shown in the template — do **not** invent
   new colors or fonts; everything you need is in the CSS as classes:
   - Top nav: `.topbar` › `.nav` (`.brand` logo + `.brand-system` tag on the
     left, `.navlinks` anchors on the right; sticky, hidden in print)
   - Full-bleed hero: `.cover` (full-width teal + photo) › `.cover-inner`
     (constrained to the content measure) — put logo/eyebrow/h1/subtitle/meta
     inside `.cover-inner`
   - Section divider: `<p class="kicker">Label</p><h2>Heading</h2>`
   - Lead paragraph: `<p class="lead">…</p>`
   - Metrics row: `.metric-grid` › `.metric` (add `.accent` for terracotta)
   - Cards: `.card-grid` › `.card` (`<h3>` + `<p>`)
   - Table: `.table-wrap` › `<table>` (use `class="num"` on numeric cells;
     `<tbody>` rows auto-zebra)
   - Badges: `<span class="badge {success|warn|error|teal|terracotta|neutral}">`
   - Callouts: `<div class="callout {success|warn|error|note}">` with a
     `.callout-title`
   - Highlight panel (teal): `<div class="highlight">`
   - Numbered steps: `<ol class="steps"><li><strong>Title</strong>body</li>`
   - Code: `<code>…</code>` inline, `<pre>…</pre>` block
4. **Footer:** set `{{FOOTER_TEXT}}` (e.g. a confidentiality / source line).
5. **Bundle into one file (default, required for single-file hosts):**
   ```bash
   mkdir -p reports
   node "$SKILL_DIR/build.js" \
     reports/report.html \
     reports/report.bundled.html
   ```
   (`$SKILL_DIR` is this skill's own folder — the directory containing this
   `SKILL.md` and `build.js`.) This yields one portable `.html` with inline CSS + base64 logo and no local
   references — the only remote asset is the hero photo. (Editing during
   authoring is easier against the folder version with `assets/`, but the
   shipped artifact is always the bundled file.)
6. **Print to PDF:** the CSS includes A4 `@page` rules, keep-together blocks,
   and `print-color-adjust: exact`, so "Print → Save as PDF" stays on-brand.
   Add `class="page-break"` to force a page break; `class="no-print"` to hide.

## Design tokens (measured from the live site)

Palette (CSS variables in `assets/ventura-report.css`):

| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#0b2330` | primary text |
| `--muted` | `#5c7480` | secondary text |
| `--line` | `#dcd2bd` | warm sand borders/rules |
| `--paper` | `#fbf8f2` | page background (cream) |
| `--cream` | `#f4efe6` | alt surface |
| `--sand` | `#ece5d6` | deeper cream |
| `--teal` | `#0e3a4e` | brand primary (cover, highlight, pre) |
| `--teal-mid` | `#2a6e8f` | links / accent |
| `--teal-light` | `#bbd2d9` | light accent |
| `--sage` | `#8fa89a` | secondary accent |
| `--terracotta` | `#c97b5a` | warm accent / CTAs / numerals |

Semantic colors (`--success #4f7a63`, `--warn #b07b2e`, `--error #b1503a`,
`--info` = teal-mid) are derived on-brand for badges/callouts.

Typography (matches the live page, which loads **no** webfont):
- **Display:** stack `"Cormorant Garamond", "Instrument Serif", Georgia, serif`
  — used for `h1`, `h2`, big metric numerals. Because no webfont is loaded, it
  resolves to **Georgia** on most machines, exactly like the reference. Do NOT
  re-add a Google Fonts `<link>` — that's what made earlier titles look wrong.
- **Body / `h3`:** `Inter, system-ui, …` → resolves to the system sans.
- **Mono:** SFMono/Consolas stack for `code` / `pre`.

Layout: content measure `--content: min(1080px, calc(100% - 48px))` (shared by
nav, hero inner, and body — wider than a column, narrower than full-bleed).
Hero is full-width; the photo is a remote Unsplash URL over a teal gradient.

Other: radius `8px`, pill `999px`, card shadow `0 10px 34px rgba(24,52,47,.06)`.

## Files
- `SKILL.md` — this guide
- `template.html` — report skeleton with `{{TOKENS}}`
- `assets/ventura-report.css` — design-token stylesheet + components + print
- `assets/ventura-logo.png` — Ventura Travel logo (1198×375, dark; rendered
  white on the teal cover via CSS filter). Canonical source: the team-system
  page hero logo.
- `build.js` — zero-dep helper to inline CSS + logo into one shareable file

## Notes & caveats
- The source page has no data tables; the table/badge/callout styles here are
  designed to be consistent with the measured tokens, not copied 1:1.
- The logo is the dark brand lockup; on light backgrounds use it as-is, on the
  teal cover the CSS `filter: brightness(0) invert(1)` makes it white.
- No webfont is loaded by design — the live reference loads none, so its titles
  render in Georgia. Matching that is what makes the report look on-brand. If a
  title ever looks like a condensed display serif, a stray Google Fonts `<link>`
  crept back in — remove it.
- The bundled file is single-file and paste-ready; only the hero photo is
  remote. To go 100% offline, swap that Unsplash URL for a base64 data URI (or
  drop it — the teal base remains).
