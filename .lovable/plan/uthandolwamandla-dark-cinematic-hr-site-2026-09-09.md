# Uthandolwamandla — dark cinematic HR site

A premium, exploration-led site for Uthandolwamandla Managing and Distribution (Pty) Ltd: near-black canvas, deep violet light from the logo, generous emptiness, very small refined type, slow fades and hover reveals instead of loud section blocks.

## The logo

The uploaded file is a phone screen recording. I'll pull the cleanest frame, crop away the phone interface, and produce a sharp transparent logo plus a small square icon for the browser tab. The "piece by piece" build-up is recreated as a slow on-load reveal of the mark in the opening view, so the animation feel survives without shipping a heavy video.

## Pages

- **Home** — one continuous cinematic scroll: opening mark and single line of purpose, then services surfacing as the visitor moves, founder passage, closing invitation.
- **Confidential conversation** — the one primary call to action, on its own quiet page: form, WhatsApp, direct call.
- **Privacy policy**, **Terms and conditions**, **Not found** (custom, in the same visual language).

## The opening view

A subtle 3D field: the logo mark floating over a slow-drifting depth of soft violet light, reacting gently to pointer movement, with a parallax layer that settles as you scroll. Pure CSS/Canvas-level effects — no heavy 3D library, so it stays fast on phones and quiets down for visitors who prefer reduced motion.

## Services, without blocks

Recruitment, HR functions, IR/ER and CCMA representation, payroll, training, and health & safety appear as a sparse index of small numbered lines. Hovering or tapping one expands its detail in place while the others dim. Everything is readable and present for screen readers and search engines even before interaction. The 99% CCMA success figure is the single emphatic number on the page.

## Founder

Zanele Mabuza, Managing Member & Founder — a slow-fading passage carrying the mission to empower people and build stronger futures, with the Daveyton, Benoni base stated quietly beneath.

## Contact

- Validated form: name, contact detail, and message, with clear inline errors and length limits.
- Anti-spam: an invisible decoy field, a minimum time-on-form check, and a per-visitor submission limit checked on the server.
- Submissions are stored in the project's backend so nothing is lost, and the team is shown the direct routes too: Zanele +27 73 858 3423, Thami +27 83 780 4145, Jessica +27 69 166 8419, admin@uthandolwamandlasa.co.za — with tap-to-WhatsApp and tap-to-call on mobile.

To store submissions I'll switch on Lovable Cloud (the built-in backend). Nothing sensitive is ever placed in the browser code.

## Navigation

No standing menu bar. A single small mark top-left and a minimal trigger top-right that opens a full-screen index with slow staggered entries. A thin progress line hints at position in the scroll.

## Production quality

Responsive from 320px up, contrast-checked light-on-dark text, alt text on every image, compressed assets, per-page titles and descriptions, a social preview image, favicon, sitemap, robots.txt, and an internal-link pass so nothing dead ships.

## Analytics

I'll check whether an analytics connector is available. If not, the site is wired so a Google Analytics measurement ID can be dropped in later and start working with no other change.

## Technical notes

- TanStack Start routes: `/`, `/conversation`, `/privacy`, `/terms`, plus root `notFoundComponent`.
- Design tokens (near-black base, violet primary and glow, radius, type scale) defined in `src/styles.css`; no hardcoded colour utilities in components.
- Reveal-on-scroll via a shared IntersectionObserver hook, honouring `prefers-reduced-motion`.
- Contact form: react-hook-form + zod on the client, re-validated with zod inside a TanStack `createServerFn` that writes to the database under row-level security; honeypot, dwell-time, and rate-limit checks run server-side.
- Logo extracted with ffmpeg/ImageMagick, hosted as a CDN asset; favicon written as a real square file in `public/`.
- Sitemap and robots updated for the four public routes.
