# Handoff — Math Missing Step

## Built

- A Vite and TypeScript static app for tracing one blocked math prerequisite.
- A curated map of 13 concepts from number sense through introductory integrals.
- One multiple-choice diagnostic prompt per concept, with answer-specific branches.
- Repair paths capped at three cards, with an explanation, MathML example, transfer problem, answer reveal, and print layout.
- A real local workspace that stores the last sketch under `mmstep:sketch`.
- An isolated `/demo` seeded with a stuck derivative problem. Demo state stays in memory and never reads or writes the real key.
- Offline app-shell caching, an offline status message, keyboard focus management, mobile layout, empty-form errors, and a styled 404.
- `/privacy`, `/terms`, `/map`, `/sketch`, and `/demo` routes with History API behavior.
- Original signal-trace hero art, responsive WebP/JPEG output, social preview, icons, metadata, sitemap, robots file, and Azure Static Web Apps headers.

## Run and deploy

```sh
npm install
npm test
npm run build
```

Deploy `dist/`. Its root contains `index.html`. The exact build command is `npm run build`.

## Verification

- `npm test`: 30 passed across desktop Chromium and a 390 × 844 Chromium viewport.
- Claim tests: all eight entries in `.factory/claims.json` passed, including offline reload, demo isolation, local storage, three-node maximum, print, and content licensing.
- Axe integration: no serious or critical violations on `/`, `/demo`, `/map`, `/privacy`, `/terms`, or `/404`.
- `/opt/fleet/lib/verify-url.sh`: 200 response, one h1, English language, main landmark, complete image alt text, zero console errors. Measured load: 542 ms on the local production preview.
- Lighthouse 12.3.0 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.5 s, CLS 0, total blocking time 0 ms, speed index 0.9 s.
- Production payload: 8.52 KB gzipped JavaScript, 3.94 KB gzipped CSS, 53 KB WebP hero. `dist/` totals 440 KB.
- Visual review: desktop landing and 390 px demo show no horizontal overflow. The generated hero has no text, brand, anatomy, or seam defects.

## Content and asset provenance

All diagnostic wording, worked examples, and transfer problems were authored for this repository and are MIT licensed. The hero source is `assets/src/hero-signal.png`; its exact generation prompt and model metadata are in `assets/src/hero-signal.png.json`. `.factory/design.md` records the palette, typography, spacing, motion, print treatment, review, and prompt sheet.

## Known gap and next step

The mathematical content passed internal completeness checks, but it has not received independent review from a math educator. Before classroom use, ask an algebra/calculus educator to review the answer-specific branches and then record their name, date, and changes here. The product labels its output as study guidance until that review occurs.
