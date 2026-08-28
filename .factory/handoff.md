# Handoff — repair 2

## Outcome

Repaired the runtime and release-quality findings recorded in `.factory/verification-2.md` for candidate `b56706ed1c25972d49a33ade68f2aec5653220fa`.

The required exact failure was reproduced from the verifier report before changing code: on `/demo`, selecting **A — 2x** returned “Repair this path, then retry” and a **Derivatives** repair card. The repaired flow now returns **“No prerequisite gap found”** with zero repair cards. A wrong answer still returns the missed concept, and a later correct prerequisite is excluded from the repair path.

## Changes

- Correct answers now produce a truthful no-gap outcome. Only incorrectly answered concepts enter `visited` and repair cards.
- Saved sketches are schema-checked, including the concept ID. Damaged or retired IDs open a blank starter sketch with a visible status message instead of a blank page.
- Browser-storage write failures, including `QuotaExceededError`, leave the entered form intact and announce the recovery action.
- The 390 px prerequisite map switches to one column, including at 200% root text size, so it has no horizontal overflow.
- SPA route changes now update title, description, canonical, Open Graph, and Twitter metadata. The static 404 now includes the same metadata and footer build marker.
- The map and README now accurately say that content has automated answer-key and route checks. They do **not** claim credentialed educator review. `.factory/content-review.md` records that limitation plainly.
- Claim coverage now checks every rendered direct prerequisite and every answer key, transfer answer, misconception route, and precision correction promised by its sandbox.
- Added `npm run lint` (TypeScript static check) and focused browser regressions in `tests/repair-regressions.spec.ts`.

## Verification

Fresh install and checks run locally on 28 August 2026:

```sh
npm ci                         # 61 packages; 0 vulnerabilities
npm run typecheck              # pass
npm run lint                   # pass
npm run test:unit              # 2 files, 6 tests pass
npm test                       # 54 Playwright tests pass: desktop + 390 px mobile
npm run build                  # pass; writes dist/
```

The complete browser run covers serious/critical axe findings on `/`, `/demo`, `/sketch`, `/map`, `/privacy`, `/terms`, SPA 404, and static 404; keyboard operation; 44 px controls; offline reload; service-worker cache replacement; local-only requests; demo isolation; and the new no-gap, corrupt-state, quota, text-zoom, and route-metadata regressions.

Every exact claim command in `.factory/claims.json` passed in the complete suite on both projects, including renamed `@claim:content-audited`.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174 .factory/evidence-repair` passed against the built production preview: HTTP 200, title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and no console/page errors. Its local evidence directory is ignored.

Production asset sizes from `npm run build`:

- JS: 27.91 KB raw / 9.34 KB gzip
- CSS: 14.87 KB raw / 4.01 KB gzip

## Known gap

The brief requires a credentialed math-educator review. There is no real credentialed-review evidence available in this repository or repair environment, so none was invented. Product copy and claims now explicitly describe only automated checks. A credentialed educator must independently review and sign off on the 13-concept instructional content before any claim of educator review is made.

## Deploy

The product remains a Vite + TypeScript static site, built to `dist/` for Azure Static Web Apps. Pushing this repair commit to `main` is the configured static deployment trigger.
