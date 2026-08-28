# Independent verification 3 — FAIL

**Candidate:** `cd8d21b661871e80e807eb2ec981339dc54b6d8b` (`cd8d21b`)  
**Live URL:** <https://math-prerequisite-sketch.sociobot.in>  
**Verified:** 28 August 2026 (UTC)  
**Environment:** Node 22.23.2, npm 10.9.8, Playwright 1.58.2  
**Decision:** **FAIL — one acceptance-contract release blocker remains.**

The earlier deployment lag is resolved. The live HTML, hashed JavaScript, hashed CSS, service worker, hero image, and static 404 are byte-for-byte identical to the production build from this candidate. The failure is therefore not deployment-only.

## Required first checks

### First-read test — PASS

A cold visit at 1440 × 900 and 390 × 844 answers the three required questions in plain words:

- **What it does:** “Find the math step you’re missing.”
- **For whom:** adults returning to technical study who need one prerequisite rather than a full course.
- **What to click first:** **Try it with sample data**, followed by “Loads a stuck derivative problem and starts the check.”

The action is visible without scrolling at both sizes and opens a working `/demo` in one click. The next screen already contains the derivative sample, diagnostic prompt, and persistent “Demo — sample data, nothing is saved” banner.

Evidence: `qa-artifacts/live-cold-desktop.png`, `qa-artifacts/live-cold-mobile.png`, and `qa-artifacts/live-demo-mobile.png`.

### Claims manifest and exact tests — PASS

`.factory/claims.json` exists. After `npm ci`, every exact command in it passed independently against the production demo entry point on desktop Chromium and the repository's 390 px mobile project:

| Claim | Exact result |
| --- | --- |
| `@claim:offline-reload` | 2 passed |
| `@claim:demo-isolated` | 2 passed |
| `@claim:local-only` | 2 passed |
| `@claim:path-max-three` | 2 passed |
| `@claim:print-repair` | 2 passed |
| `@claim:thirteen-concepts` | 2 passed |
| `@claim:free-no-account` | 2 passed |
| `@claim:open-content` | 2 passed |
| `@claim:content-audited` | 2 passed |

Machine-readable evidence for all 18 desktop/mobile results: `qa-artifacts/claim-tests.report.json`.

The live landing page, working routes, README, design provenance, and privacy copy were cross-checked against the manifest. No material unlisted product claim was found.

## Release-blocking finding

### P1 — The required math-educator review has not occurred

The researched brief requires: “Have math educators review content.” The repository instead records:

- `.factory/content-review.md`: “automated mathematical consistency check; not a credentialed educator review” and “no evidence of a credentialed human reviewer.”
- `README.md`: “This is not a credentialed educator review.”
- `.factory/handoff.md` before this verification: a credentialed educator “must independently review and sign off.”

The automated answer-key and graph checks are useful and pass, but they do not satisfy a separate requirement for educator review. There is no reviewer identity or role, review date, scope, sign-off, or record of educator-requested changes. This is a content-governance acceptance blocker for a tool giving prerequisite guidance to returning learners.

Required resolution: obtain an independent review by a qualified math educator and record the reviewer/role, date, all 13 concepts and diagnostic branches reviewed, findings, corrections, and explicit sign-off. Re-run the content and browser suites after any resulting edits.

## Non-blocking finding

### P2 — A one-node misconception result says it needs “a wider review”

On the live sample, choose **B — x** for “What is the derivative of x²?”. The tool correctly returns one **Derivatives** repair card, but the status says, “This branch needs a wider review. Start with the earliest card shown here.” A self-loop terminated the branch, so neither a wider review nor multiple cards exists. The repair itself remains usable, but the explanation is inaccurate and less clear than the result.

Recommended resolution: use a one-concept message such as “Review this concept, then retry the stopped step,” reserving “wider review” for a path that actually reaches the three-card limit.

Evidence: `qa-artifacts/live-result-mobile.png`.

## Build and automated verification

- `npm ci`: passed; 61 packages installed, 62 audited, 0 vulnerabilities.
- `npm run test:unit`: passed; 2 files and 6 tests.
- `npm run typecheck`: passed with no diagnostics.
- `npm run lint`: passed with no diagnostics.
- `npm test`: passed; all 54 Playwright tests across desktop and mobile.
- `npm run build`: passed and produced `dist/`.
- `/opt/fleet/lib/verify-url.sh https://math-prerequisite-sketch.sociobot.in ...`: passed; HTTP 200, title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and no console errors. Evidence: `qa-artifacts/verify-url/verify.json`.

Production build sizes:

| Asset | Raw | Gzip/transfer |
| --- | ---: | ---: |
| JavaScript | 27,911 B | 9,442 B live transfer / 9.34 KB gzip |
| CSS | 14,871 B | 4,209 B live transfer / 4.01 KB gzip |
| Hero WebP | 53,598 B | 53,684 B live transfer |
| Total initial load | — | 68,834 B |

These remain well inside the 200 KB JavaScript, 50 KB CSS, 120 KB font, and 300 KB hero budgets. No font file or third-party script is loaded.

## End-to-end and recovery evidence

Independent live-browser flows, separate from repository tests, verified:

- Landing → one-click sample → seeded derivative form and active diagnostic.
- Correct **A — 2x** → “No prerequisite gap found” and zero repair cards.
- Wrong **B — x** → one Derivatives repair card with worked MathML and a transfer problem.
- Integrals misconception branch → two genuinely missed repair cards; the later correctly answered concept is excluded.
- **Reset demo** restores the sample; **Start for real** discards it and restores a separately seeded real sketch.
- Empty submission announces the incomplete-sketch error and focuses the problem field.
- A filled problem with a missing stopped line focuses that field.
- A valid real sketch saves under `mmstep:sketch` and survives reload.
- An unavailable stored concept recovers to a blank form with a visible status message.
- A simulated `QuotaExceededError` preserves entered text and announces a recovery action.
- An HTML event-handler payload remains inert textarea text after save and reload.
- A two-card repair path generated a 36 KB print PDF; the observable print claim also passed.

Evidence: `qa-artifacts/repair-cards.pdf` and the mobile demo/result captures.

## Privacy, network, deployment, and headers

A fresh full live flow recorded 13 browser requests. Every origin was `https://math-prerequisite-sketch.sociobot.in`; no analytics, ads, remote database, CDN font, API, or identity request occurred. The context had no cookies. Demo work neither read nor changed a seeded `mmstep:sketch`, and created no demo-storage key. Normal and error flows produced no console or page errors.

The root response was HTTP 200 and included:

- `Content-Security-Policy` restricted to self, with `frame-ancestors 'none'` in the response header.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- HSTS.

Documents and `sw.js` use 30-second revalidation. Fingerprinted JavaScript, CSS, and the hero image use `public, max-age=31536000, immutable`. An unknown path returns the candidate's designed `404.html` with a real HTTP 404.

Deployment hashes:

| Artifact | SHA-256 | Live result |
| --- | --- | --- |
| `dist/index.html` | `87799b39b16eb37a8b8dcc954a376087c87a14b3b020264138a8a0c99e360100` | exact match |
| `dist/assets/index-DPNpdPHt.js` | `ece1663f2c36493376518bfec97066bfa6eef215c7aabf0742cce142073bdfd2` | exact match |
| `dist/assets/index-DOQgff8m.css` | `2b5b74d153dbcacd1de6de0a6042338d05b94c2a4e84409282c2980e88766437` | exact match |
| `dist/sw.js` | `84872231d04106858427047afcaf291ed854eef702c2f52122248c03aeae3739` | exact match |
| `dist/assets/hero-signal.webp` | `c1d9a1a58f3c98585c4bf2e14c6eaccbaecfaf9f3eb23336bbb8cffb344df032` | exact match |
| `dist/404.html` | `a52164ce574dbb1a39fe8dcb447d9635c3c099eb59b137d8f16864464d4de86c` | exact match, including unknown-path body |

The app has no server-side product endpoint, product-unlock call, payment, or sign-in. API allowance/429 and Microsoft Entra checks are therefore not applicable.

## Accessibility, mobile, offline, and performance

- Independent live axe scans on `/`, `/demo`, `/sketch`, `/map`, `/privacy`, `/terms`, `/404`, and `/404.html`, at desktop and 390 px mobile, found zero serious or critical violations.
- Every checked route had `lang=en`, one h1, one main landmark, no missing image alt text, no horizontal overflow, and no visible control below 44 × 44 CSS px.
- Keyboard-only traversal reached banner actions, navigation, fields, native select, submit, and answer buttons. Enter completed the sample. The skip link was first, visible at y=8, and had a 3 px amber outline with 3 px offset. Skip, SPA navigation, and browser Back moved focus into the new main content.
- At 200% root text size on 390 px, `scrollWidth` remained 390 px and the map stacked to one column.
- With reduced motion requested, smooth scrolling became `auto` and the scan animation duration became `0.00001s` for one iteration.
- Native MathML appeared in the accessibility tree, for example “d d x x 2 = 2 x.”
- A clean live service-worker install removed a seeded v1 cache, created only `math-missing-step-v2`, and reloaded `/demo` offline with both demo and offline banners.
- All discovered internal links, all 13 concept deep links, the external Param Factory link, robots, sitemap, social image, icons, privacy, and terms returned successfully. The explicit `mailto:` link was exempt.

Fresh Lighthouse 12.3.0 mobile results:

| Category/metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.998 s |
| LCP | 1.298 s |
| Total blocking time | 131 ms |
| CLS | 0 |
| Speed Index | 1.042 s |

Evidence: `qa-artifacts/lighthouse-mobile.report.json`.

## Final decision

**FAIL.** Candidate and live deployment are technically aligned and all automated/runtime gates pass, but the original acceptance contract's required math-educator review is explicitly absent. The deployment is not the blocker.
