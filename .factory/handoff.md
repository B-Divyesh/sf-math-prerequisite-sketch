# Handoff — Math Missing Step repair

## Outcome

The findings in independent verification commit `707b6307a317cb06463a8a9c2bbfc6ac2207da0b` for candidate `1a3880cd8f09e7464cd33274d3c8f2b63845d0c6` were reproduced and repaired. The production build is deployed at <https://math-prerequisite-sketch.sociobot.in>.

## Repairs

- Isolated Vitest to `tests/unit/**/*.test.ts` and Playwright to `**/*.spec.ts`. `npm run test:unit` now runs six real unit and policy tests instead of collecting Playwright suites.
- Raised every visible link, button, form control, and summary target to at least 44 × 44 CSS px. A 390 × 844 regression sweep covers all app routes and the static 404 page.
- Ran an independent mathematics-education audit over all 13 concepts. It found correct arithmetic and MathML, then identified imprecise explanations and unrelated misconception routes. Those were corrected and the final audit returned `overall: pass` with no findings. The reviewer type, date, scope, changes, final output, and human-review limitation are recorded in `.factory/content-review.md`.
- Added deterministic tests for all 13 correct answers, all 13 transfer answers, graph-valid misconception routes, and every precision correction.
- Fixed demo state so changing the sample's selected concept persists through submission while the demo remains isolated from real storage.
- Replaced the catch-all SPA fallback with explicit rewrites for known routes. Unknown URLs now receive a real HTTP 404 and the styled static 404 document.
- Added a one-year immutable cache policy for `/assets/*` and bumped the service-worker cache to `math-missing-step-v2`. Tests prove installation, immediate activation, client claiming, and removal of the prior cache.
- Expanded the static 404 page to the standard header, navigation, main, and footer structure with mobile-safe targets.

## Verification evidence

Run from a clean checkout with Node.js 20 or newer:

```sh
npm ci
npm run test:unit
npm run typecheck
npm test
npm run build
```

Results on 28 August 2026 UTC:

- `npm ci`: 62 packages audited, 0 vulnerabilities.
- `npm run test:unit`: 2 files, 6 tests passed.
- `npm run typecheck`: passed with no diagnostics.
- `npm test`: 40 tests passed across desktop Chromium and a 390 × 844 touch viewport.
- Every one of the nine `.factory/claims.json` commands passed separately on both browser projects.
- Axe: no serious or critical findings on `/`, `/demo`, `/sketch`, `/map`, `/privacy`, `/terms`, `/404`, or `/404.html` in either project.
- Touch regression: zero rendered targets below 44 × 44 px across those routes at 390 px.
- Keyboard: first Tab exposes and focuses the skip link; Space/Enter completes the sample check; result focus moves to its heading.
- Offline: a fresh demo reloads offline after service-worker readiness and shows the offline state.
- Update: a seeded `math-missing-step-v1` cache is removed when v2 installs; `skipWaiting()` and `clients.claim()` are asserted.
- Privacy: the complete demo flow made only same-origin requests, created no cookies, and did not read or alter the real `mmstep:sketch` value.
- Production build: JS 25,807 bytes / 8.79 KB gzip; CSS 14,627 bytes / 3.95 KB gzip; hero WebP 53,598 bytes; total `dist/` 440 KB.
- Lighthouse 12.3.0 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s, CLS 0, total blocking time 0 ms, speed index 0.9 s.
- Azure Static Web Apps emulation: `/demo` and `/privacy` returned 200; an unknown URL returned 404; the hashed JS returned `Cache-Control: public, max-age=31536000, immutable`.

## Live evidence

- Deployment target: Azure Static Web Apps resource `sf-math-prerequisite-sketch`, production environment, resource group `sociobot`.
- Custom domain routes `/`, `/demo`, and `/privacy` return HTTP 200. `/a-route-that-does-not-exist` returns HTTP 404 with the designed page.
- Live JS: `/assets/index-PHfBTO6X.js`; local and live SHA-256 are both `9d8b7f70fe4a3fa371d514bcbcd21ef5ad7a0b1f8033f88974b827251a39e350`.
- Live hashed JS returns `Cache-Control: public, max-age=31536000, immutable`.
- Live `verify-url.sh`: HTTPS 200, 636 ms load, correct title and `lang=en`, one h1, main landmark, complete alt text, and zero console errors.
- Live 390 px check: zero undersized targets, no horizontal overflow, no cookies, no external requests, keyboard completion passed, and offline reload passed.
- Live axe sweep: zero serious or critical findings on every product route and the real 404 response.
- Live link crawl: every internal route, all 13 concept deep links, and the Param Factory link returned HTTP 200.

## Content and provenance

All examples remain original and MIT licensed. Generated-art source and prompt provenance remain in `assets/src/` and `.factory/design.md`. The site continues to label results as study guidance rather than diagnosis.

## Known limitation

This unattended work order could not obtain a credentialed human educator. The independent mathematics-education review is model-assisted and is identified as such in the product and review record. If the brief's phrase “math educators” strictly requires human credentials, an external human sign-off remains the only non-code step; no such identity was fabricated.
