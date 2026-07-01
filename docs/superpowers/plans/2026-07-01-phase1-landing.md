# VALENS Phase 1 Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the VALENS Phase 1 static marketing landing page (`index.html` / `styles.css` / `main.js`) per the approved design spec (`docs/superpowers/specs/2026-07-01-phase1-landing-design.md`), wired to Supabase email capture, ready for GitHub Pages deploy.

**Architecture:** A single static page assembled section-by-section (nav → hero → features → screenshot carousel → email capture → final CTA → footer), styled with CSS custom properties for the brand palette and a self-hosted variable Inter font, driven by a small dependency-free JS layer (nav scroll state, IntersectionObserver reveal, scroll-snap carousel, Supabase form submit). Supabase credentials live in their own `config.js` so they're the only thing an operator edits before shipping.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, `scroll-snap`), vanilla JS (`IntersectionObserver`, `fetch`), Supabase REST (PostgREST) for email capture, GitHub Pages hosting.

**Known content resolution (from screenshot review during planning):** the 7 screenshots in `assets/` were opened and identified so alt text and section mapping are accurate — see Task 6. The brief's nav copy lists "Features / Screens / FAQ" but the Phase 1 section list (brief §5) has no FAQ section; this plan omits the FAQ nav link rather than link to nothing (documented in Task 3).

---

### Task 1: Repo scaffold

**Files:**
- Create: `D:\valens_site\README.md`
- Create: `D:\valens_site\CNAME`
- Create: `D:\valens_site\.gitignore`
- Create: `D:\valens_site\.claude\launch.json`

- [ ] **Step 1: Create `CNAME`**

```
valens.rs
```

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
Thumbs.db
```

- [ ] **Step 3: Create `.claude/launch.json` so the site can be previewed locally**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "valens-site",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["--yes", "http-server", "-p", "8080", "-c-1", "."],
      "port": 8080
    }
  ]
}
```

- [ ] **Step 4: Create `README.md`**

```markdown
# valens-site

Phase 1 marketing landing for VALENS (workout tracker). Static site — no build step.

## Local preview

    npx http-server -p 8080 -c-1 .

Then open http://localhost:8080

## Before shipping

1. Open `config.js` and paste the Supabase **anon/publishable** key (Project Settings → API
   in the Supabase dashboard for project `lkkijojnuqnrjyqrqgnd`). Never use the `service_role` key.
2. Apply the newsletter table migration from the app repo (`D:\valens_app`), not from here:

       supabase db push

   using `supabase/newsletter_signups.sql` in this repo as the reference for what that
   migration should contain.
3. Send a test signup through the live form and confirm a row lands in
   `public.newsletter_signups`.

## Deploy (GitHub Pages)

1. Push this repo to `tomicadev/valens-site` (public).
2. GitHub → repo → Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.
3. DNS at your registrar for `valens.rs`:
   - 4× `A` records at the apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `tomicadev.github.io`
4. Wait for DNS propagation, then confirm `https://valens.rs` loads with a valid certificate
   (GitHub issues one automatically once DNS resolves correctly).
```

- [ ] **Step 5: Verify the scaffold**

Run: `ls /d/valens_site/CNAME /d/valens_site/.gitignore /d/valens_site/README.md /d/valens_site/.claude/launch.json`
Expected: all four paths listed, no "No such file" errors.

- [ ] **Step 6: Commit**

```bash
git add README.md CNAME .gitignore .claude/launch.json
git commit -m "Scaffold repo: README, CNAME, gitignore, preview config"
```

---

### Task 2: CSS foundation — tokens, reset, font, glow, reveal utility

**Files:**
- Create: `D:\valens_site\styles.css`

- [ ] **Step 1: Write the foundation styles**

```css
/* ---------- Reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
img { max-width: 100%; display: block; }
button, input { font: inherit; color: inherit; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; margin: 0; padding: 0; }

/* ---------- Brand tokens ---------- */
:root {
  --bg: #0C080D;
  --surface: #1F1823;
  --elevated: #2D2040;
  --border: #382B3F;
  --purple: #6F4DB3;
  --light-purple: #9B78D4;
  --ink: #E6E6EB;
  --muted: #A1A1B3;
  --premium-red: #E53935;

  --max-width: 1120px;
  --radius: 16px;
}

/* ---------- Self-hosted Inter (variable font) ---------- */
@font-face {
  font-family: 'Inter';
  src: url('assets/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 { font-weight: 700; line-height: 1.15; margin: 0; }
p { margin: 0; color: var(--muted); }

.container {
  width: 100%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: 20px;
}

.eyebrow {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--light-purple);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.chip--premium {
  background: rgba(229, 57, 53, 0.15);
  color: var(--premium-red);
  border: 1px solid rgba(229, 57, 53, 0.4);
}

section { padding-block: 72px; }

/* ---------- Scroll-reveal ---------- */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* ---------- Play badge ---------- */
.play-badge { height: 56px; width: auto; }

/* ---------- Visually-hidden (honeypot) ---------- */
.visually-hidden {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 720px) {
  section { padding-block: 96px; }
}
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `grep -c '^--- ' /d/valens_site/styles.css 2>/dev/null; grep -c 'bg: #0C080D' /d/valens_site/styles.css`
Expected: second command prints `1`.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Add CSS foundation: brand tokens, self-hosted Inter, reveal utility"
```

---

### Task 3: HTML shell — head, nav, footer skeleton

**Files:**
- Create: `D:\valens_site\index.html`

**Decision carried from spec review:** nav links are **Features** and **Screens** only (anchors to
those two sections) plus the Play CTA button — the brief's "FAQ" nav item is dropped because
Phase 1 has no FAQ section to link to (see plan header note).

- [ ] **Step 1: Write the HTML shell with full `<head>`, nav, main placeholder, footer**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VALENS — Workout tracker</title>
  <meta name="description" content="Track every workout, smash PRs, and train alongside your friends.">

  <link rel="icon" type="image/svg+xml" href="assets/valens.svg">

  <meta property="og:title" content="VALENS — Workout tracker">
  <meta property="og:description" content="Track every workout, smash PRs, and train alongside your friends.">
  <meta property="og:image" content="https://valens.rs/assets/feature-1024x500.png">
  <meta property="og:url" content="https://valens.rs/">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="VALENS — Workout tracker">
  <meta name="twitter:description" content="Track every workout, smash PRs, and train alongside your friends.">
  <meta name="twitter:image" content="https://valens.rs/assets/feature-1024x500.png">

  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="visually-hidden" href="#main">Skip to content</a>

  <header class="nav" data-nav>
    <div class="container nav__inner">
      <a class="nav__brand" href="#top">
        <img src="assets/valens.svg" alt="" width="24" height="24">
        <span>VALENS</span>
      </a>
      <nav class="nav__links" aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#screens">Screens</a>
      </nav>
      <a class="nav__cta" href="https://play.google.com/store/apps/details?id=rs.valens.app">
        <img class="play-badge play-badge--small" src="assets/google-play-badge.png" alt="Get it on Google Play">
      </a>
    </div>
  </header>

  <main id="main">
    <!-- HERO_SECTION -->
    <!-- FEATURES_SECTION -->
    <!-- SHOWCASE_SECTION -->
    <!-- CAPTURE_SECTION -->
    <!-- CTA_BAND_SECTION -->
  </main>

  <!-- FOOTER_SECTION -->

  <script src="config.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure**

Run: `grep -o '<!-- [A-Z_]*_SECTION -->' /d/valens_site/index.html`
Expected: five placeholder comment lines printed (HERO, FEATURES, SHOWCASE, CAPTURE, CTA_BAND) plus FOOTER separately handled — confirms all insertion points exist for later tasks.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add HTML shell: head/SEO, nav, section placeholders"
```

---

### Task 4: Hero section

**Files:**
- Modify: `D:\valens_site\index.html` (replace `<!-- HERO_SECTION -->`)
- Modify: `D:\valens_site\styles.css` (append)

- [ ] **Step 1: Replace the `<!-- HERO_SECTION -->` placeholder**

```html
    <section class="hero" id="top">
      <div class="container hero__inner">
        <div class="hero__copy" data-reveal>
          <img class="hero__wordmark" src="assets/valens_wordmark_gpt_v2.png" alt="VALENS" width="280">
          <p class="eyebrow">Track · Train · Progress</p>
          <h1 class="hero__title">Train smarter. Track everything.</h1>
          <p class="hero__subtitle">Track every workout, smash PRs, and train alongside your friends.</p>
          <a href="https://play.google.com/store/apps/details?id=rs.valens.app">
            <img class="play-badge" src="assets/google-play-badge.png" alt="Get it on Google Play">
          </a>
          <p class="hero__meta">Free · In-app purchases · PEGI 3</p>
        </div>
        <div class="hero__art" data-reveal>
          <img class="hero__phone" src="assets/Screenshot_20260630_170857.jpg"
               alt="VALENS Logs screen showing PULL and PUSH workout sessions with exercises and set counts"
               loading="eager" width="320">
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append hero styles to `styles.css`**

```css
/* ---------- Hero ---------- */
.hero {
  background:
    radial-gradient(60% 50% at 50% 35%, rgba(111,77,179,0.42), rgba(111,77,179,0.10) 55%, transparent),
    var(--bg);
  padding-top: 140px;
}
.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
}
.hero__wordmark { margin-inline: auto 0; margin-bottom: 8px; }
.hero__title { font-size: clamp(2rem, 6vw, 3.25rem); margin-block: 12px; }
.hero__subtitle { font-size: 1.125rem; max-width: 480px; margin-inline: auto; margin-bottom: 28px; }
.hero .play-badge { margin-inline: auto; }
.hero__meta { margin-top: 10px; font-size: 0.8rem; }
.hero__phone {
  border-radius: 24px;
  box-shadow: 0 40px 80px -30px rgba(111,77,179,0.5);
  width: min(320px, 80vw);
}

@media (min-width: 960px) {
  .hero__inner { flex-direction: row; text-align: left; gap: 64px; }
  .hero__copy { flex: 1; }
  .hero__wordmark { margin-inline: 0; }
  .hero__subtitle { margin-inline: 0; }
  .hero .play-badge { margin-inline: 0; }
  .hero__art { flex: 1; display: flex; justify-content: center; }
}
```

- [ ] **Step 3: Verify**

Run: `grep -c 'hero__phone' /d/valens_site/index.html /d/valens_site/styles.css`
Expected: both files report at least `1`.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Build hero section"
```

---

### Task 5: Features section (6 cards)

**Files:**
- Modify: `D:\valens_site\index.html` (replace `<!-- FEATURES_SECTION -->`)
- Modify: `D:\valens_site\styles.css` (append)

- [ ] **Step 1: Replace the `<!-- FEATURES_SECTION -->` placeholder**

```html
    <section id="features">
      <div class="container">
        <p class="eyebrow" data-reveal>Features</p>
        <h2 data-reveal>Everything you need to train smarter</h2>
        <div class="features__grid">
          <article class="feature-card" data-reveal>
            <img class="feature-card__icon" src="assets/logs_icon.svg" alt="" width="28" height="28">
            <h3>Track everything</h3>
            <p>Log sets, reps, weight, drop sets and cardio. Watch your PRs climb.</p>
          </article>
          <article class="feature-card" data-reveal>
            <img class="feature-card__icon" src="assets/search.svg" alt="" width="28" height="28">
            <h3>700+ exercises</h3>
            <p>A full library with target muscles, equipment and how-to instructions.</p>
          </article>
          <article class="feature-card" data-reveal>
            <img class="feature-card__icon" src="assets/routines_icon.svg" alt="" width="28" height="28">
            <h3>Routines and programs <span class="chip chip--premium">Premium</span></h3>
            <p>Build your own or follow a structured program — including Mr. VALENS.</p>
          </article>
          <article class="feature-card" data-reveal>
            <img class="feature-card__icon" src="assets/friends_icon.svg" alt="" width="28" height="28">
            <h3>Train with friends</h3>
            <p>Follow friends' logs, like their sessions, climb the leaderboards.</p>
          </article>
          <article class="feature-card" data-reveal>
            <svg class="feature-card__icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
            <h3>Smart Coach</h3>
            <p>Your Coach spots lagging muscle groups and suggests what to train next.</p>
          </article>
          <article class="feature-card" data-reveal>
            <img class="feature-card__icon" src="assets/badge.svg" alt="" width="28" height="28">
            <h3>Achievements and recaps</h3>
            <p>Earn badges, keep streaks, get a weekly recap of your progress.</p>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append features styles**

```css
/* ---------- Features ---------- */
#features h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); margin-top: 8px; margin-bottom: 40px; }
.features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}
.feature-card__icon { filter: invert(58%) sepia(28%) saturate(1074%) hue-rotate(216deg); margin-bottom: 16px; }
.feature-card h3 { font-size: 1.05rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.feature-card p { font-size: 0.9rem; }

@media (min-width: 640px) {
  .features__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .features__grid { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Verify**

Run: `grep -c 'feature-card' /d/valens_site/index.html`
Expected: `6` (or more, counting the wrapping div/class occurrences — at minimum 6 `<article class="feature-card"`).
Run: `grep -c '<article class="feature-card"' /d/valens_site/index.html`
Expected: exactly `6`.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Build features section (6 cards)"
```

---

### Task 6: Screenshot showcase carousel (markup + CSS)

**Files:**
- Modify: `D:\valens_site\index.html` (replace `<!-- SHOWCASE_SECTION -->`)
- Modify: `D:\valens_site\styles.css` (append)

Screenshot → content mapping (confirmed by viewing each image during planning):

| File | Content |
|---|---|
| `Screenshot_20260630_170857.jpg` | Logs screen, PULL/PUSH sessions |
| `Screenshot_20260630_170914.jpg` | New Workout entry (sets/reps/weight) |
| `Screenshot_20260630_171023.jpg` | Chest exercise library list |
| `Screenshot_20260630_171018.jpg` | Exercise detail (Barbell Incline Bench Press) |
| `Screenshot_20260630_182238.jpg` | Routines/Discover (Mr. VALENS premium program) |
| `Screenshot_20260630_170929.jpg` | Profile: streak, muscle map, PRs, achievements |
| `Screenshot_20260629_230556.jpg` | Global leaderboard |

- [ ] **Step 1: Replace the `<!-- SHOWCASE_SECTION -->` placeholder**

```html
    <section id="screens">
      <div class="container">
        <p class="eyebrow" data-reveal>Screens</p>
        <h2 data-reveal>See VALENS in action</h2>
        <div class="showcase">
          <button class="showcase__btn showcase__btn--prev" type="button" data-showcase-prev aria-label="Previous screenshot">‹</button>
          <div class="showcase__viewport">
            <div class="showcase__track" data-showcase-track>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_170857.jpg" alt="VALENS Logs screen showing PULL and PUSH workout sessions with exercises and set counts"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_170914.jpg" alt="New Workout screen logging sets, reps and weight for an incline dumbbell press"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_171023.jpg" alt="Chest exercise library list with search"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_171018.jpg" alt="Exercise detail screen for Barbell Incline Bench Press showing target muscles"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_182238.jpg" alt="Routines Discover screen featuring the Mr. VALENS premium program"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260630_170929.jpg" alt="Profile screen with weekly streak, muscle map, PRs and achievements"></div>
              <div class="showcase__slide"><img loading="lazy" src="assets/Screenshot_20260629_230556.jpg" alt="Global leaderboard screen ranking friends by workout distance"></div>
            </div>
          </div>
          <button class="showcase__btn showcase__btn--next" type="button" data-showcase-next aria-label="Next screenshot">›</button>
        </div>
        <div class="showcase__dots" data-showcase-dots></div>
      </div>
    </section>
```

- [ ] **Step 2: Append showcase styles**

```css
/* ---------- Showcase ---------- */
.showcase { position: relative; display: flex; align-items: center; gap: 12px; }
.showcase__viewport { overflow: hidden; flex: 1; }
.showcase__track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  scrollbar-width: none;
}
.showcase__track::-webkit-scrollbar { display: none; }
.showcase__slide {
  flex: 0 0 auto;
  width: min(240px, 70vw);
  scroll-snap-align: start;
}
.showcase__slide img {
  border-radius: 20px;
  border: 1px solid var(--border);
}
.showcase__btn {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  font-size: 1.25rem;
  cursor: pointer;
}
.showcase__btn:hover { background: var(--elevated); }
.showcase__dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
.showcase__dot {
  width: 8px; height: 8px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  cursor: pointer;
  padding: 0;
}
.showcase__dot.is-active { background: var(--light-purple); }

@media (max-width: 640px) {
  .showcase__btn { display: none; }
}
```

- [ ] **Step 3: Verify**

Run: `grep -c 'showcase__slide' /d/valens_site/index.html`
Expected: `7`.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Build screenshot showcase carousel markup and styles"
```

---

### Task 7: Email capture section + config.js

**Files:**
- Modify: `D:\valens_site\index.html` (replace `<!-- CAPTURE_SECTION -->`)
- Modify: `D:\valens_site\styles.css` (append)
- Create: `D:\valens_site\config.js`

- [ ] **Step 1: Create `config.js`**

```js
window.VALENS_CONFIG = {
  SUPABASE_URL: 'https://lkkijojnuqnrjyqrqgnd.supabase.co',
  // TODO: paste the project's anon/publishable key before shipping
  // (Supabase dashboard → Project Settings → API → Project API keys → anon/public).
  // Do NOT paste the service_role key here.
  SUPABASE_ANON_KEY: '',
};
```

- [ ] **Step 2: Replace the `<!-- CAPTURE_SECTION -->` placeholder**

```html
    <section id="capture">
      <div class="container capture">
        <div data-reveal>
          <p class="eyebrow">Get launch updates</p>
          <h2>Be first to know when VALENS ships new features</h2>
          <p class="capture__sub">No spam — just launch news and the occasional program drop.</p>
        </div>
        <form class="capture__form" data-capture-form data-reveal novalidate>
          <label class="visually-hidden" for="capture-email">Email address</label>
          <input id="capture-email" type="email" name="email" placeholder="you@example.com" required data-capture-email>
          <div class="visually-hidden" aria-hidden="true">
            <label for="capture-website">Website</label>
            <input id="capture-website" type="text" name="website" tabindex="-1" autocomplete="off" data-capture-honeypot>
          </div>
          <button type="submit" data-capture-submit>Subscribe</button>
          <noscript><p class="capture__status">Enable JavaScript to subscribe, or email us at valens.gym.app@gmail.com.</p></noscript>
          <p class="capture__status" data-capture-status role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
```

- [ ] **Step 3: Append capture styles**

```css
/* ---------- Email capture ---------- */
.capture {
  display: grid;
  gap: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 24px;
}
.capture h2 { font-size: clamp(1.25rem, 3.5vw, 1.75rem); margin-top: 8px; }
.capture__sub { margin-top: 8px; }
.capture__form { display: flex; flex-direction: column; gap: 12px; }
.capture__form input[type="email"] {
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--ink);
}
.capture__form button {
  background: var(--purple);
  color: var(--ink);
  border: none;
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 600;
  cursor: pointer;
}
.capture__form button:hover { background: var(--light-purple); }
.capture__form button:disabled { opacity: 0.6; cursor: not-allowed; }
.capture__status { font-size: 0.85rem; min-height: 1.2em; }
.capture__status[data-kind="success"] { color: #7CD992; }
.capture__status[data-kind="error"] { color: var(--premium-red); }

@media (min-width: 960px) {
  .capture { grid-template-columns: 1fr 1fr; align-items: center; padding: 56px; }
}
```

- [ ] **Step 4: Verify**

Run: `grep -c 'VALENS_CONFIG' /d/valens_site/config.js /d/valens_site/index.html`
Expected: `config.js` reports at least `1`; `index.html` references `config.js` via the `<script src="config.js">` tag added in Task 3.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css config.js
git commit -m "Build email capture section and Supabase config placeholder"
```

---

### Task 8: Final CTA band + Footer

**Files:**
- Modify: `D:\valens_site\index.html` (replace `<!-- CTA_BAND_SECTION -->` and `<!-- FOOTER_SECTION -->`)
- Modify: `D:\valens_site\styles.css` (append)

- [ ] **Step 1: Replace the `<!-- CTA_BAND_SECTION -->` placeholder**

```html
    <section class="cta-band" data-reveal>
      <div class="container cta-band__inner">
        <h2>Start training with VALENS</h2>
        <a href="https://play.google.com/store/apps/details?id=rs.valens.app">
          <img class="play-badge" src="assets/google-play-badge.png" alt="Get it on Google Play">
        </a>
      </div>
    </section>
```

- [ ] **Step 2: Replace the `<!-- FOOTER_SECTION -->` placeholder**

```html
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <img src="assets/valens.svg" alt="" width="20" height="20">
        <span>© 2026 VALENS</span>
        <span class="chip">Early Access</span>
      </div>
      <ul class="footer__links">
        <li><a href="https://tomicadev.github.io/valens-legal/privacy-policy.html">Privacy</a></li>
        <li><a href="https://tomicadev.github.io/valens-legal/account-deletion.html">Account deletion</a></li>
        <li><a href="mailto:valens.gym.app@gmail.com">Contact</a></li>
      </ul>
    </div>
  </footer>
```

- [ ] **Step 3: Append CTA band + footer styles**

```css
/* ---------- Final CTA band ---------- */
.cta-band {
  background:
    radial-gradient(60% 80% at 50% 50%, rgba(111,77,179,0.35), transparent 70%),
    var(--surface);
  text-align: center;
}
.cta-band__inner { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.cta-band h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); }

/* ---------- Footer ---------- */
.footer { border-top: 1px solid var(--border); padding-block: 32px; }
.footer__inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}
.footer__brand { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 0.85rem; }
.footer__links { display: flex; gap: 20px; font-size: 0.85rem; color: var(--muted); }
.footer__links a:hover { color: var(--ink); }

@media (min-width: 720px) {
  .footer__inner { flex-direction: row; justify-content: space-between; text-align: left; }
}
```

- [ ] **Step 4: Verify**

Run: `grep -c 'cta-band\|footer__links' /d/valens_site/index.html`
Expected: `2` or more (both markers present).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "Build final CTA band and footer"
```

---

### Task 9: main.js — nav state, scroll-reveal, carousel, email form

**Files:**
- Create: `D:\valens_site\main.js`

- [ ] **Step 1: Write `main.js`**

```js
(function () {
  'use strict';

  // --- Nav solid-on-scroll ---
  var nav = document.querySelector('[data-nav]');
  var NAV_SOLID_OFFSET = 24;
  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('is-solid', window.scrollY > NAV_SOLID_OFFSET);
  }
  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  // --- Scroll-reveal ---
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Showcase carousel ---
  var track = document.querySelector('[data-showcase-track]');
  var prevBtn = document.querySelector('[data-showcase-prev]');
  var nextBtn = document.querySelector('[data-showcase-next]');
  var dotsWrap = document.querySelector('[data-showcase-dots]');
  var slides = track ? Array.prototype.slice.call(track.children) : [];

  if (track && slides.length && dotsWrap) {
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase__dot';
      dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
      dot.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    dots[0].classList.add('is-active');

    if ('IntersectionObserver' in window) {
      var dotObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var index = slides.indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            dots.forEach(function (d) { d.classList.remove('is-active'); });
            dots[index].classList.add('is-active');
          }
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach(function (slide) { dotObserver.observe(slide); });
    }

    function scrollByOne(dir) {
      var slideWidth = slides[0].getBoundingClientRect().width + 16;
      track.scrollBy({ left: dir * slideWidth, behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOne(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOne(1); });
  }

  // --- Email capture form ---
  var form = document.querySelector('[data-capture-form]');
  if (form) {
    var emailInput = form.querySelector('[data-capture-email]');
    var honeypot = form.querySelector('[data-capture-honeypot]');
    var status = document.querySelector('[data-capture-status]');
    var submitBtn = form.querySelector('[data-capture-submit]');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.dataset.kind = kind;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (honeypot && honeypot.value) {
        return;
      }
      var email = emailInput.value.trim();
      if (!EMAIL_RE.test(email)) {
        setStatus('Enter a valid email address.', 'error');
        return;
      }

      var config = window.VALENS_CONFIG || {};
      if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        setStatus('Signups are not configured yet.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending…', 'pending');

      fetch(config.SUPABASE_URL + '/rest/v1/newsletter_signups', {
        method: 'POST',
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + config.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email: email, source: 'landing' }),
      })
        .then(function (response) {
          if (response.ok || response.status === 409) {
            setStatus("You're in — we'll email you at launch.", 'success');
            form.reset();
          } else {
            setStatus('Something went wrong. Try again in a moment.', 'error');
          }
        })
        .catch(function () {
          setStatus('Network error. Try again in a moment.', 'error');
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
```

- [ ] **Step 2: Append nav solid-state CSS (was referenced in JS but not yet styled)**

Append to `D:\valens_site\styles.css`:

```css
/* ---------- Nav ---------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: transparent;
  transition: background-color 0.25s ease, border-color 0.25s ease;
  border-bottom: 1px solid transparent;
}
.nav.is-solid {
  background: rgba(12, 8, 13, 0.9);
  backdrop-filter: blur(8px);
  border-bottom-color: var(--border);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 16px;
}
.nav__brand { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.nav__links { display: none; gap: 24px; font-size: 0.9rem; color: var(--muted); }
.nav__links a:hover { color: var(--ink); }
.nav__cta .play-badge--small { height: 40px; }

@media (min-width: 720px) {
  .nav__links { display: flex; }
}
```

- [ ] **Step 3: Verify no JS syntax errors**

Run: `node --check /d/valens_site/main.js`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add main.js styles.css
git commit -m "Add main.js: nav state, scroll-reveal, carousel, email form submit"
```

---

### Task 10: Supabase reference migration

**Files:**
- Create: `D:\valens_site\supabase\newsletter_signups.sql`

- [ ] **Step 1: Write the reference migration**

```sql
-- Reference only. Apply this from the app repo (D:\valens_app) via `supabase db push`,
-- since that's where the Supabase project schema (lkkijojnuqnrjyqrqgnd) lives.
-- This file is not executed by anything in this static-site repo.

create table if not exists public.newsletter_signups (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  source     text default 'landing',
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

-- anon may INSERT only; no select/update/delete policy => the list is not publicly readable.
create policy newsletter_insert on public.newsletter_signups
  for insert to anon, authenticated with check (true);
```

- [ ] **Step 2: Verify**

Run: `grep -c 'create table if not exists public.newsletter_signups' /d/valens_site/supabase/newsletter_signups.sql`
Expected: `1`.

- [ ] **Step 3: Commit**

```bash
git add supabase/newsletter_signups.sql
git commit -m "Add reference Supabase migration for newsletter_signups"
```

---

### Task 11: Browser verification pass

**Files:** none (verification only).

- [ ] **Step 1: Start the local static server**

Use `preview_start` with configuration name `valens-site` (from Task 1's `.claude/launch.json`).
Expected: server starts on port 8080 without errors.

- [ ] **Step 2: Check console for errors**

Use `preview_console_logs` with `level: "error"`.
Expected: empty — no JS errors on page load (a `favicon.ico` 404 is fine since the SVG favicon is
declared explicitly; only report unexpected JS exceptions).

- [ ] **Step 3: Take a desktop screenshot and review all sections render**

Use `preview_screenshot` at the default desktop viewport.
Expected: hero, features grid, showcase, capture form, CTA band, and footer are all visible when
scrolled through; no obviously broken image icons (broken image = wrong asset path — fix before continuing).

- [ ] **Step 4: Resize to mobile and re-check layout**

Use `preview_resize` with `preset: "mobile"`, then `preview_screenshot` again.
Expected: hero stacks vertically, nav text links are hidden (only brand + Play badge visible),
feature cards are single-column, showcase carousel arrows are hidden per the `max-width: 640px` rule.

- [ ] **Step 5: Exercise the carousel**

Use `preview_click` on the element matching `[data-showcase-next]` twice, then `preview_eval` to
read `document.querySelector('[data-showcase-dots] .is-active')` and confirm the active dot index
advanced from 0.
Expected: active dot moves; no console errors appear after clicking (`preview_console_logs`).

- [ ] **Step 6: Exercise the email form's client-side validation**

Use `preview_fill` to put `not-an-email` into `#capture-email`, then `preview_click` the submit
button. Use `preview_snapshot` or `preview_eval` to read the `[data-capture-status]` text.
Expected: status text reads "Enter a valid email address." and no network request was attempted
(check via `preview_network` — no request to `supabase.co` should appear for this submission).

- [ ] **Step 7: Exercise the honeypot**

Use `preview_eval` to set the honeypot input's value directly (`document.querySelector('[data-capture-honeypot]').value = 'x'`),
then submit the form with a valid email filled in.
Expected: no request appears in `preview_network` for that submission (silently dropped, per spec).

- [ ] **Step 8: Confirm the real submit path fires a network request (key not yet configured)**

Clear the honeypot value, fill a valid email, submit.
Expected: since `config.js` still has an empty `SUPABASE_ANON_KEY` (real key not available in this
session — see README), the status should read "Signups are not configured yet." and
`preview_network` should show **no** outbound request — this confirms the code correctly guards
against submitting with a missing key rather than sending a broken request. Note this in the final
summary to the user: they must paste the real anon key before this path can be fully tested end-to-end.

- [ ] **Step 9: Stop the preview server**

Use `preview_stop` on the server started in Step 1.

---

### Task 12: Git — push to GitHub, note manual Pages/DNS steps

**Files:** none (repo/remote operations only).

- [ ] **Step 1: Confirm `gh` auth status**

Run: `gh auth status`
Expected: shows an authenticated account. If not authenticated, stop and ask the user to run
`gh auth login` themselves before continuing (do not attempt to authenticate on their behalf).

- [ ] **Step 2: Create the GitHub repo and push**

```bash
gh repo create tomicadev/valens-site --public --source=. --remote=origin --push
```

Expected: repo created at `https://github.com/tomicadev/valens-site`, `main` branch pushed,
`git remote -v` now shows `origin`.

- [ ] **Step 3: Verify the push**

Run: `git log --oneline -5` and `git status`
Expected: `git status` shows `working tree clean` and `Your branch is up to date with 'origin/main'`.

- [ ] **Step 4: Report manual follow-up steps to the user (not automatable from this session)**

Summarize for the user, pointing at the README's "Deploy" section:
1. Enable GitHub Pages (Settings → Pages → `main` / root).
2. Add the 4 DNS `A` records + `www` CNAME at their domain registrar for `valens.rs`.
3. Paste the real Supabase anon key into `config.js`, commit, and push.
4. Apply the `supabase/newsletter_signups.sql` migration from `D:\valens_app` via `supabase db push`.
5. Once DNS propagates, confirm `https://valens.rs` loads over HTTPS.

---

## Plan self-review notes

- **Spec coverage:** every section in spec §4 (Sections) is covered — Tasks 4–8. Assets (§3) all
  referenced. JS behavior (§6) fully in Task 9. Supabase (§7) in Task 10. SEO/favicon (§8) in
  Task 3. Git/deploy (§9) in Task 12. Screenshot mapping (§6 note) resolved in Task 6 header table.
- **Known gap, by necessity:** the real Supabase anon key is not available in this session (it's a
  project credential, not something derivable from the brief). `config.js` ships with an empty
  string and a `TODO` comment, and Task 11 Step 8 verifies the code path degrades safely (no
  request sent) rather than silently sending malformed auth. This is called out explicitly to the
  user in Task 12 Step 4 and in the README — it is not a silently-skipped requirement.
