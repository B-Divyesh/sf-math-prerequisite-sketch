# Independent verification 2 — FAIL

**Candidate:** `b56706ed1c25972d49a33ade68f2aec5653220fa` (`b56706e`)  
**Live URL:** <https://math-prerequisite-sketch.sociobot.in>  
**Verified:** 28 August 2026, 20:43 UTC  
**Environment:** Node 22.23.2, npm 10.9.8, Playwright 1.58.2  
**Decision:** **FAIL — two release blockers remain.**

The deployment is current. Fresh production artifacts built from the candidate match the live `index.html`, hashed JavaScript, hashed CSS, service worker, and hero image byte for byte.

## Mandatory gates

### First-read test — PASS

A cold visit at 1440 × 900 and 390 × 844 answers all three questions in the first screen:

- **What it does:** “Find the math step you’re missing.”
- **For whom:** “For adults returning to technical study who need one prerequisite, not another full course.”
- **What to click first:** **Try it with sample data**, followed by “Loads a stuck derivative problem and starts the check.”

The action opens `/demo` in one click. The sample problem, stopped line, diagnostic prompt, and persistent “Demo — sample data, nothing is saved” banner are immediately present.

### Claim tests — PASS

After `npm ci`, every exact command in `.factory/claims.json` passed independently against the locally built production demo entry point. Each ran on desktop Chromium and the repository's 390 × 844 mobile project:

| Claim | Result |
| --- | --- |
| `@claim:offline-reload` | 2 passed |
| `@claim:demo-isolated` | 2 passed |
| `@claim:local-only` | 2 passed |
| `@claim:path-max-three` | 2 passed |
| `@claim:print-repair` | 2 passed |
| `@claim:thirteen-concepts` | 2 passed |
| `@claim:free-no-account` | 2 passed |
| `@claim:open-content` | 2 passed |
| `@claim:content-reviewed` | 2 passed |

The passing commands do not override the core-product and expert-review blockers below.

## Release-blocking findings

### P1 — A correct diagnostic answer is falsely labelled as a missing prerequisite

The live one-click sample asks “What is the derivative of x²?” Selecting the correct answer, **A — 2x**, produces this result:

- feedback: “Yes. The power rule lowers the exponent by one.”
- result heading: “Repair this path, then retry”
- repair card: **Derivatives**
- card state: **Start here**

There is no “no gap found” or equivalent success outcome. The same false positive applies to every starting concept: `handleAnswer` adds the current concept to `visited` before checking correctness, then turns the visited concepts into repair cards when the answer is correct (`src/main.ts:163–173`). A later correctly answered prerequisite is also included in the repair path.

This fails the real job-to-be-done. The tool cannot distinguish demonstrated understanding from a missing prerequisite and can tell a user to repair the concept they just answered correctly. The current `@claim:print-repair` test even fixes this behavior in place by selecting the correct first answer and expecting a repair card (`tests/claims.spec.ts:58–64`).

### P1 — The required math-educator review did not occur

The researched brief explicitly requires math educators to review the instructional content. The candidate records its reviewer as a “factory-hosted independent reasoning model” and says twice that it is “not a human credentialed review” and that the environment “had no human reviewer” (`.factory/content-review.md:5–11`). The builder handoff repeats this as a known limitation.

The model-assisted audit and deterministic answer checks are useful and the arithmetic inspected during this verification is correct, but they do not satisfy the contracted educator-review requirement. The `@claim:content-reviewed` test proves that the repository contains those statements; it does not provide educator sign-off.

## Other findings

### P2 — Invalid persisted state can blank the workspace

With syntactically valid saved data whose concept ID is no longer in the map, for example:

```json
{"problem":"p","stopped":"s","goal":"removed-concept"}
```

opening `/sketch` renders an empty body and raises `Cannot read properties of undefined (reading 'label')`. `loadSketch` catches malformed JSON but does not validate its fields or goal (`src/main.ts:158–160`). A renamed concept or damaged local state therefore has no in-product recovery path.

The persistence write is also unhandled: submitting a 6 MiB pasted problem raised `QuotaExceededError`, left the diagnostic unchanged, and showed no error. No input limit warns the user before this boundary.

### P2 — The 200% text-size layout has horizontal overflow

At 390 × 844 with the root text size doubled, the demo's document width is 400 px. The two-column prerequisite map reaches x = 400.1 px, so the right edge is outside the 390 px viewport. Text remains available by horizontal scrolling, but this misses the baseline expectation of 200% text resizing without layout loss.

### P2 — Route metadata is incomplete

Direct `/privacy` and `/terms` visits correctly update the document title and canonical URL, but retain the landing page's Open Graph title, URL, and description. The real static 404 has no canonical, Open Graph/Twitter metadata, or footer version/build ID. This falls short of the attached site-structure contract for per-route metadata and a consistent footer.

### P2 — Two claim tests are narrower than their declared sandboxes

- `@claim:thirteen-concepts` counts 13 list items and paragraphs but does not assert that the rendered direct prerequisites are correct.
- `@claim:content-reviewed` checks a report string and four selected corrections, not all 13 answer keys and all corrected routes described by its sandbox. Those broader checks exist under `npm run test:unit`, but the exact claim command does not execute them.

No unlisted high-impact runtime claim was found. Privacy, local storage, offline use, pricing/account status, printing, card count, map size, licensing, and audit wording all have entries in `.factory/claims.json`.

## Build and automated checks

- `npm ci`: passed; 61 packages installed, 62 audited, 0 vulnerabilities.
- `npm run test:unit`: passed; 2 files, 6 tests.
- `npm run typecheck`: passed with no diagnostics.
- `npm test`: passed; 40 Playwright tests in 1.2 minutes across desktop and mobile.
- `npm run build`: passed; `dist/` produced.
- No lint script is configured.
- `/opt/fleet/lib/verify-url.sh`: passed after creating its required evidence directory; HTTPS, title, language, one h1, main landmark, image alt text, and console checks passed.

Production build sizes:

| Asset | Raw | Gzip/transfer |
| --- | ---: | ---: |
| JavaScript | 25,807 B | 8.79 KB gzip |
| CSS | 14,627 B | 3.95 KB gzip |
| Hero WebP | 53,598 B | 53.7 KB transfer |
| Lighthouse initial transfer | — | 68.2 KB |

These are within the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## End-to-end and edge-case evidence

- The live demo supplies a derivative problem and remains isolated from a seeded real-workspace marker.
- Empty and whitespace-only submission announces “The sketch is incomplete…” and focuses `#problem`.
- A present problem with a blank stopped line announces the same recovery and focuses `#stopped`.
- The three-answer integrals branch returns exactly three repair cards, three MathML examples, and three transfer tasks; result focus moves to its heading.
- “Run another check” restores the selected integrals prompt. “Reset demo” restores the derivative sample. “Start for real” discards the sample and restores the separately stored real sketch.
- A representative real sketch persists across reload with problem, stopped line, and selected concept unchanged.
- A stored HTML payload remains text in the textarea; it creates no element and executes no script.
- Keyboard traversal reaches every visible demo control in logical order. Enter and Space operate answers and form controls; arrow keys change the native concept select.
- SPA navigation and browser Back move focus to the new page h1.
- Print media hides the form, keeps repair cards visible, and hides unopened transfer answers.
- All discovered links, all 13 concept deep links, and the Param Factory link returned 200. An unknown path returned the designed static page with HTTP 404.

## Live privacy, offline, and deployment evidence

- The full live demo and a real save/reload made only same-origin GET requests.
- No cookies, analytics requests, advertisements, remote database calls, console errors, or page errors appeared during normal flows.
- The real workspace stored only `mmstep:sketch`. Demo reset did not read or alter it and created no `demo:` keys.
- Offline `/demo` reload passed after service-worker control and displayed both the demo and offline banners.
- A clean registration with a seeded `math-missing-step-v1` cache installed v2, claimed the page, and removed v1.
- There are no product server endpoints, unlock calls, authentication, or payments. Rate-limit and Entra checks are not applicable.
- Root and route responses include the restrictive self-only CSP, `nosniff`, HSTS, strict referrer policy, and restrictive permissions policy.
- Live hashed JS and CSS return `Cache-Control: public, max-age=31536000, immutable`; documents and `sw.js` use 30-second revalidation.

Deployment matching hashes:

| Artifact | SHA-256 | Result |
| --- | --- | --- |
| `dist/index.html` | `42642c10e10f82db651c41f7c48d7f4105953ac3726c7cb23ef7d6c4f08498e6` | live match |
| `dist/assets/index-PHfBTO6X.js` | `9d8b7f70fe4a3fa371d514bcbcd21ef5ad7a0b1f8033f88974b827251a39e350` | live match |
| `dist/assets/index-DpHrJX83.css` | `e89deb09d9043ad0b06431ea1aa63f58b9f651a8253b2fc1d4577569d1cf4029` | live match |
| `dist/sw.js` | `84872231d04106858427047afcaf291ed854eef702c2f52122248c03aeae3739` | live match |
| `dist/assets/hero-signal.webp` | `c1d9a1a58f3c98585c4bf2e14c6eaccbaecfaf9f3eb23336bbb8cffb344df032` | live match |

Twenty concurrent fresh root requests all returned 200 in 0.115–0.497 seconds.

## Accessibility and performance

- Fresh live axe scans found no serious or critical violations on `/`, `/demo`, `/sketch`, `/map`, `/privacy`, `/terms`, or the real 404, at desktop and 390 px mobile sizes.
- Every checked app route has `lang="en"`, one h1, one main landmark, complete image alt text, no normal-width horizontal overflow, and no visible target below 44 × 44 px.
- The first Tab exposes the skip link at y = 8 px with a 3 px amber focus outline. No keyboard trap was found.
- With reduced motion requested, the hero animation duration is `0.00001s` and smooth scrolling becomes `auto`.
- The repair MathML appears in the accessibility tree (for example, “x 3 · x 2 = x 5”).
- Fresh Lighthouse 12.3.0 against the live URL: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.844 s, LCP 0.866 s, TBT 4 ms, CLS 0, speed index 0.961 s.

## Required before acceptance

1. Add a truthful outcome for a correct diagnostic answer and exclude demonstrated concepts from the missing/repair path; test both correct and misconception branches end to end.
2. Obtain and record review from a real math educator, including identity or role, date, scope, findings, and resulting changes.
3. Validate persisted state and catch storage write failures with a recoverable, announced error.
4. Reflow the prerequisite map at 200% text size and complete per-route social metadata.
5. Make each claim command exercise the complete sandbox stated in `.factory/claims.json`.
