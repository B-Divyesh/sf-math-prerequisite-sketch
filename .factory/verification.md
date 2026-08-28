# Independent verification — FAIL

**Candidate:** `1a3880cd8f09e7464cd33274d3c8f2b63845d0c6` (`1a3880c`)  
**Live URL:** https://math-prerequisite-sketch.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Decision:** **FAIL — release blockers remain.** This is not a deployment-only failure: the live hashed JavaScript has SHA-256 `0029014ae1055ee240d6eaafbbbaa739d918a7219f57be8257dadcc0c9a1f948`, exactly matching `dist/assets/index-Bzpps2AS.js` built from the candidate.

## First-read result

Cold desktop visit, with a fresh browser context, clearly answered the required questions on the first screen:

- **What:** “Find the math step you’re missing.”
- **For whom:** adults returning to technical study who need one prerequisite rather than a full course.
- **First action:** **Try it with sample data**, with the adjacent explanation that it loads a stuck derivative problem and starts the check.

The one-click demo exists and works. The cold page made only same-origin requests (`/`, hashed JS/CSS, and the self-hosted hero image) and produced no console or page errors.

## Release-blocking findings

### P1 — The advertised unit-test command fails

`npm run test:unit` exits 1. It runs `vitest run` over `tests/*.spec.ts`, but those files call Playwright's `test()`, which Vitest rejects: `Playwright Test did not expect test() to be called here.` Three suites fail (`a11y.spec.ts`, `claims.spec.ts`, and `content.spec.ts`) and Vitest reports `Test Files 3 failed` / `Tests no tests`.

This violates the quality gate that every available unit/integration test command pass.

### P1 — Interactive controls do not meet the required 44 × 44 px touch target

Fresh 390 × 844 px Playwright inspection found visible targets below 44 px in one dimension:

- `/demo`: **Reset demo** and **Start for real** are 123 × 32 px.
- Header links: **Demo** is 38 × 44 px and **Map** is 30 × 44 px.
- Footer links: **Privacy** is 47 × 20 px, **Terms** is 39 × 20 px, and **Built by Param Factory** is 148 × 20 px.

This violates the explicit accessibility and design acceptance requirement that touch targets are at least 44 × 44 CSS px. It is not caught by the current axe-only assertions.

### P1 — Required math-educator review has not occurred

The researched brief requires: “Have math educators review content.” The candidate's own handoff and README instead state that independent math-educator review has not happened and is still requested. No review evidence (reviewer, date, scope, or changes) exists in the repository. Labelling the output as guidance is good, but it does not satisfy this separate brief constraint.

## Non-blocking findings

### P2 — Hashed static assets are not cached immutably

The live response for `/assets/index-Bzpps2AS.js` is `Cache-Control: public, must-revalidate, max-age=30`, as is the document. A content-hashed production JS asset should have long-lived immutable caching; the factory performance contract explicitly requires it. The candidate's `staticwebapp.config.json` has no asset cache policy.

### P2 — Unknown URLs return HTTP 200

`GET /a-route-that-does-not-exist` on the live host returned the SPA shell with HTTP 200. The client renders its styled `/404` state after JavaScript executes, but this is not a real HTTP 404 for crawlers or non-JavaScript clients. The repository includes `public/404.html` and a `responseOverrides` entry, but `navigationFallback` currently masks it for unknown routes.

## Passed evidence

### Clean install, tests, type check, and production build

- `npm ci`: passed; 62 packages audited, 0 vulnerabilities.
- Every command listed in `.factory/claims.json` was run individually from the clean install against the product's production demo entry point. All passed on both Chromium and the 390 px mobile project (two passing tests per claim):
  - `@claim:offline-reload`
  - `@claim:demo-isolated`
  - `@claim:local-only`
  - `@claim:path-max-three`
  - `@claim:print-repair`
  - `@claim:thirteen-concepts`
  - `@claim:free-no-account`
  - `@claim:open-content`
- `npm test`: passed. Playwright's final `test-results/.last-run.json` reports `status: "passed"` and no failed tests (30 tests).
- `npm run build`: passed (`tsc --noEmit && vite build`) and created `dist/`.
- No separate lint command is configured. The available `test:unit` command is the P1 failure above.
- Build sizes: JS 25,075 bytes / 8,524 bytes gzip; CSS 14,401 bytes / 3,961 bytes gzip; WebP hero 53,598 bytes. These are within the stated static-web budgets.

### Product flow and recovery

Local production preview and live demo both completed the representative derivative sample through a three-card repair path. The result contained three worked MathML examples and three transfer problems.

- Empty real sketch: submits the announced error “The sketch is incomplete…” and moves focus to `#problem`.
- Partially completed sketch: shows the same recovery message and moves focus to `#stopped`.
- Real normal case saved only the supplied last sketch under `mmstep:sketch`.
- Demo normal case left `mmstep:sketch` null and created no `demo:` local-storage keys.
- Printing is covered by the passing observable `@claim:print-repair` test.

### Privacy, offline, deployment, and headers

- A fresh live demo run made only same-origin GET requests; it set no cookies, generated no console/page errors, and made no remote calls after three diagnostic answers.
- Live offline reload after service-worker readiness passed: `/demo` reloaded with the demo banner and “Offline — the saved map is ready.”
- The service worker uses `skipWaiting()` and `clients.claim()`; offline reload was exercised. A browser-route attempt to substitute a revised worker did not intercept the browser's worker-script update request, so no synthetic update result is claimed.
- Response security headers include CSP restricted to `'self'`, `X-Content-Type-Options: nosniff`, HSTS, strict referrer policy, and restrictive permissions policy. The cache finding above remains.
- No product server-side endpoint, sign-in flow, payment flow, or product-unlock API exists; rate-limit and Entra checks are not applicable.

### Accessibility and usability checks

- `@axe-core/playwright` on `/`, `/demo`, `/map`, `/privacy`, `/terms`, and `/404`: no serious or critical violations.
- All those routes had exactly one `<h1>`, one `<main>`, and correct route title in the local production build.
- Keyboard smoke test: first Tab focuses the visible skip link with a 3 px outline; Enter on a diagnostic answer reaches “Repair this path, then retry.”
- Reduced motion: the hero pseudo-element animation resolves to `0.00001s`; document scrolling resolves to `auto`.
- 390 px demo has no horizontal overflow (`scrollWidth = innerWidth = 390`), but the small controls listed in P1 still fail target-size acceptance.
- `/opt/fleet/lib/verify-url.sh https://math-prerequisite-sketch.sociobot.in /tmp/math-verify-evidence` passed: HTTPS 200, title present, `lang=en`, one h1, main landmark, image alt text, and zero console errors; measured navigation was 849 ms.

### Links and content

All discovered internal links, all 13 map concept deep links, and the Param Factory external link returned HTTP 200; the privacy contact is an explicit `mailto:` link. The licensing/content claim passed and confirms 13 concepts, MIT license, sourced art provenance, and MathML examples.

## Required next steps

1. Correct or remove the broken `test:unit` script, then run it successfully from a clean install.
2. Make every visible link and button at least 44 × 44 px, including demo-banner, header, and footer controls; add an automated target-size check.
3. Obtain and record the required math-educator review (reviewer, date, scope, and resulting changes).
4. Configure immutable long-lived caching for fingerprinted assets.
5. Return an actual HTTP 404 for unknown paths while retaining working deep links.
