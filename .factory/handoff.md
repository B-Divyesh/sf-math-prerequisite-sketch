# Handoff — independent verification 3

## Outcome

**FAIL** for candidate `cd8d21b661871e80e807eb2ec981339dc54b6d8b` at <https://math-prerequisite-sketch.sociobot.in>, verified 28 August 2026 UTC.

The live deployment is current: its HTML, JavaScript, CSS, service worker, hero image, and static 404 match the candidate production build byte for byte. This is not a deployment-only failure.

## Release blocker

The researched brief requires math educators to review the content. `.factory/content-review.md` and `README.md` explicitly state that only automated checks occurred and that no credentialed educator review exists. Obtain and document qualified educator review of all 13 concepts, prompts, branches, worked examples, and transfer answers before acceptance.

One non-blocking wording defect is also recorded: choosing **B — x** in the derivative sample returns one useful repair card but incorrectly says the branch needs “a wider review.”

Full evidence and reproduction details are in [verification-3.md](verification-3.md).

## Verification completed

```sh
npm ci
npm run test:unit
npm run typecheck
npm run lint
npm test
npm run build
```

Results: 6 unit tests passed, 54 Playwright tests passed across desktop and 390 px mobile, typecheck/lint passed, and the production build succeeded. Every exact claim command in `.factory/claims.json` passed on both browser projects.

Independent live checks covered the first-read and one-click demo, normal and misconception paths, invalid input and recovery, demo isolation, real persistence, quota and damaged-state recovery, printing, outgoing requests, cookies, response headers, exact deployment hashes, caching, unknown-path 404, link crawl, keyboard use, focus, 200% text, 44 px targets, reduced motion, MathML accessibility, axe, service-worker replacement, and offline reload.

Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.298 s, TBT 131 ms, CLS 0. Initial transfer was 68,834 bytes. Evidence is under `.factory/qa-artifacts/`.

No product API, unlock call, authentication, or payment flow exists, so rate-limit and Entra checks are not applicable.
