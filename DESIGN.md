# DEB / Portfolio V3 — Design Notes

## Brief
Debargha Sarkar ("Deb"), B.Tech CSE student in Kolkata, builds across software, hardware and systems: anti-cheat exam hardware, an 8-servo quadruped, a phone homelab, a clinical ECG suite, and a 13K+ maker channel. Audience: recruiters, collaborators, and peers who arrive from the lab or the work. The site's job is to make the work legible and make the person memorable.

No photographs were supplied. The identity has to come from typography, diagrams, the real STL model, the live canvases, and designed archive plates.

## Concept Card
```
Idea:        The portfolio is a working field archive: a builder's dossier with a live
             switchboard, printed on paper and annotated in red ink.
Metaphor:    A technical field manual / junction board. Covers, folios, registration marks,
             index tabs, stamped labels, and a switchboard of six departments.
Signature:   The Junction: a numbered index where hovering or focusing a department routes
             a signal to a live poster plate (colour, type and copy change together).
             Plus the rotating registration plate on the cover.
Emotion:     Precise, tactile, a little rebellious. "This person makes real things and has taste."
Motion verb: Register and snap. Elements settle into alignment like a press proof; rules draw;
             plates change state; nothing floats aimlessly.
Screenshot:  The cover: DEB. in condensed black with the red period and the registration
             plate, or the Junction with a blood-red MUSIC plate lit against the night.
```

## Art Direction
- Palette (roles): ground `#F1EDE3` paper; ink `#14120F`; muted `#5E594F`; line `rgba(20,18,15,.16)`; accent `#C93A1E` vermilion; night `#12100D`; ochre `#D9A621` (wins only).
- Department accents, used one at a time: projects ochre `#E0B326`, honors red `#C93A1E`, anime orange `#F2601A`, music crimson `#D41C46`, cinema magenta `#D6006E`, games green `#2F8A58`.
- Type: Archivo variable (wdth 62–125, wght 100–900) for display and text; IBM Plex Mono for data, labels, folios. Display is condensed (68–82 width), weight 900, tracking −0.03em. Body 16–18px, 1.55–1.65 leading. Labels 10–12px, tracking ≤ .14em — fewer of them than the old build.
- Grid: 12 columns, max 1560px, page gutter `clamp(20px, 5vw, 76px)`. Section rhythm varies: full-bleed cover, 7/5 junction, full-width work index, 5/7 about, full-width contact.
- Shape: zero radius. 1px hairlines, 2px rules for emphasis, crop marks and registration targets. The only soft edge is the circular plate.
- Motion: cubic-bezier(.2,.8,.2,1), 240–700ms. Reveals are 16px settles. Primary hovers move the inner label and reveal a figure; contact rows flood with red. No parallax drift.
- Idle state: the registration plate rotates slowly; the cover's live Kolkata clock ticks; the ECG/canvas demos keep their own clocks.

## Page Plan
- Cover: composed poster. Huge DEB., rotating plate, one clear deck, two CTAs, three true stats, live local time.
- Junction: six-row switchboard with a live poster preview. Replaces the six equal coloured cards.
- Selected builds: four proof rows (OSAMU, Quadruped, Phone Homelab, ECG Suite) with mini diagrams.
- Field notes: the manifesto and a four-phase timeline on a red rule.
- The operator: biography plus a printed ID card and a "currently" strip.
- Field lab: 13,000+ follower statement and three documented themes.
- Open channel: large contact rows that flood red, location and live time.
- Footer: FIN. with a proper colophon.
- Inner pages keep their department identities but inherit the new nav, covers, type scale and generated archive plates.
- A 404 page carries the same system.

## V3 Addendum — what was added in the follow-up pass
- Real photography pulled from the internet (all CC0, see `images/CREDITS.md`): a Kolkata
  night shot as the operator ID-card "photo" (with a red-ink "not me — my city" note), and an
  ESP32-WROOM-32 macro as FIG. P01-A on the Projects dossier (blended into the paper with
  `mix-blend-mode: multiply` so the white background melts away).
- A real CC0 paper/wall texture (`images/paper-grain.jpg`) layered under the SVG noise on
  `#noise`, so the page ground feels like stock, not a flat fill.
- Red-ink margin notes in Caveat (Google Fonts, OFL) — `.ink-note` — used sparingly on the
  home page (junction hint, field-notes aside, ID photo). Handwriting = human.
- All emoji removed from copy, buttons and JS strings; replaced with typographic marks
  (★ for wins, ✕ for missing-plate hints, ♥ text heart). Missing-plate hints reworded to
  "PLATE MISSING — … / drop file at …".
- Footer colophon now states typefaces, photo credits and "no frameworks, no trackers".

## Rules Kept
- Native cursor stays; the red trail is additive only.
- One h1 per page, real links and buttons, skip link first, visible focus, reduced-motion paths.
- No fake screenshots, no invented credentials, no placeholder photography. Abstract plates are clearly designed cover art.
- No loader theatre. The first frame is the poster.
