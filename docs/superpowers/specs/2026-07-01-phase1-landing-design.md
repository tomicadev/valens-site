# VALENS Phase 1 landing — design spec

**Date:** 2026-07-01 · **Status:** approved · **Source:** `D:\valens_app\docs\web-landing-brief.md`

This spec operationalizes the web-landing-brief for the `D:\valens_site` project. The brief
itself is the primary source of truth for copy, palette, and links (§1–§9 there); this doc
records the implementation decisions needed to turn it into a build.

## 1. Scope

Single-page static marketing site for VALENS (workout app). Primary CTA: Google Play install.
Secondary: email capture via Supabase. No framework, no build step — plain HTML/CSS/JS.
Out of scope: e-books store, merch store (later cycles).

## 2. File structure

```
D:\valens_site\
  index.html
  styles.css
  main.js
  CNAME                          # contains: valens.rs
  README.md
  assets/                        # already populated; only a subset is used (see §3)
  supabase/
    newsletter_signups.sql       # reference migration; applied manually from the app repo
```

## 3. Assets actually used (from the existing `assets/` folder)

- `valens_wordmark_gpt_v2.png` — hero wordmark (on dark bg)
- `valens_wordmark_gpt.png` — wordmark for light placements (footer/nav if needed)
- `valens.svg` — V mark → favicon + nav logo
- `feature-1024x500.png` — OG/social preview image
- `Screenshot_20260629_230556.jpg`, `Screenshot_20260630_170857.jpg`, `Screenshot_20260630_170914.jpg`,
  `Screenshot_20260630_170929.jpg`, `Screenshot_20260630_171018.jpg`, `Screenshot_20260630_171023.jpg`,
  `Screenshot_20260630_182238.jpg` — 7 showcase screenshots
- `google-play-badge.png` — **official** "Get it on Google Play" badge, downloaded directly from
  Google's public badge asset host (`play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png`)
- `fonts/Inter_18pt-{Regular,SemiBold,Bold}.ttf` (+ italic if needed) — self-hosted Inter, no
  Google Fonts network dependency

All other files currently in `assets/` (app icons, achievement badges, other social icons, JSON
seed, other fonts) are **not used** in Phase 1 and stay untouched — cleanup of that folder is out
of scope for this build.

## 4. Sections (index.html, top to bottom)

Matches brief §5 exactly, in order: sticky nav → hero → 6 feature cards → screenshot showcase →
email capture → final CTA band → footer. Copy, links, and card content are taken verbatim from
the brief §5.

**Screenshot showcase:** horizontal scroll-snap carousel (not a static grid) — prev/next buttons,
dot indicators, touch swipe on mobile, lazy-loaded `<img loading="lazy">`.

## 5. Styling

- CSS custom properties on `:root` for the full §3 palette (bg/surface/elevated/border/purple/
  light-purple/ink/muted/premium-red).
- Inter self-hosted via `@font-face` pointing at `assets/fonts/Inter_18pt-*.ttf` (weights 400/600/700),
  no external font request.
- Hero glow: exact radial-gradient recipe from the brief §3, layered behind the hero content on
  the `#0C080D` background.
- Mobile-first breakpoints; layout must remain usable with CSS-only fallback (see §6).

## 6. JS behavior (main.js, zero dependencies)

1. **Nav**: transparent → solid background on scroll (IntersectionObserver or scroll-position check).
2. **Scroll-reveal**: IntersectionObserver adds a visible class to sections as they enter viewport.
3. **Carousel**: scroll-snap-based, JS only drives the prev/next buttons and dot state; native
   touch scrolling handles swipe.
4. **Email form**:
   - Client-side email format validation + honeypot field must be empty.
   - POST to `https://lkkijojnuqnrjyqrqgnd.supabase.co/rest/v1/newsletter_signups` with the anon
     key (public by design, same key shipped in the Flutter app — safe in client JS).
   - Treat HTTP 409 (duplicate email) as a success state ("You're in").
   - Show explicit success/error UI states.
   - **No-JS degradation**: the Play badge CTA must work with JS disabled; the email form's
     `<form>` has a real `action`/`method` is not applicable (Supabase needs fetch), so with JS
     disabled the form is hidden behind `<noscript>` fallback text pointing at the mailto contact
     instead of silently failing.

## 7. Supabase

`supabase/newsletter_signups.sql` in this repo holds the exact migration from brief §6, as a
reference copy only. It is **not applied from this project** — the user applies it manually via
`supabase db push` from `D:\valens_app` (that's where the Supabase project/schema lives). This
build does not touch `D:\valens_app`.

## 8. SEO / favicon

- `<title>VALENS — Workout tracker</title>`, meta description from the tagline.
- OG + Twitter card meta using `feature-1024x500.png`.
- Favicon: `valens.svg` referenced directly as an SVG favicon (`<link rel="icon" type="image/svg+xml">`)
  plus a PNG fallback exported at build time is skipped for Phase 1 — SVG favicon has broad enough
  modern browser support; a 32/180px PNG fallback can be added later if needed without blocking ship.
- `lang="en"`, semantic landmarks (`<nav>`, `<main>`, `<section>`, `<footer>`), alt text on every image.

## 9. Git / deploy

- `git init` in `D:\valens_site` (done), initial commit of scaffold.
- Create GitHub repo `tomicadev/valens-site` (public) via `gh repo create` and push — **requires
  user to be authenticated in `gh` CLI**; this is a one-time setup action confirmed with the user.
- GitHub Pages enablement (Settings → Pages → deploy from `main`/root), DNS records (4× A records
  to GitHub Pages IPs + `www` CNAME), and live HTTPS verification are manual steps on GitHub's/the
  registrar's side — documented in README, not automatable from this session.

## 10. Explicitly out of scope for this build

- Cloudflare Turnstile / anti-spam beyond the honeypot.
- E-books store, merch store.
- Applying the Supabase migration (user does this from the app repo).
- Actually pointing DNS at `valens.rs` / verifying live HTTPS (manual, outside this session).
