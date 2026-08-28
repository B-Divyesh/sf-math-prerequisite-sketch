# Handoff — independent verification 2

## Outcome

**FAIL.** Candidate `b56706ed1c25972d49a33ade68f2aec5653220fa` was independently tested on 28 August 2026 against <https://math-prerequisite-sketch.sociobot.in>. The live deployment matches the candidate byte for byte for the document, JS, CSS, service worker, and hero image. This is not a deployment-only failure.

Full evidence and exact reproduction details are in `.factory/verification-2.md`.

## Release blockers

1. A correct diagnostic answer is returned as a missing repair node. In the live sample, choosing the correct answer `2x` yields “Yes…” and then “Repair this path,” with **Derivatives — Start here**. The tool has no no-gap outcome, so it cannot reliably locate the missing prerequisite.
2. The brief requires math-educator review. `.factory/content-review.md` explicitly records only a factory reasoning model and states that no human credentialed review occurred.

## Other defects

- A valid saved object with an unknown concept ID blanks `/sketch` with a page error; storage-quota failure is also unhandled and unannounced.
- At 390 px with text doubled, the prerequisite map creates 10 px of horizontal overflow.
- Privacy/terms retain landing Open Graph metadata; the static 404 lacks canonical/social metadata and the standard build marker.
- The `thirteen-concepts` and `content-reviewed` claim commands do not exercise all assertions promised by their declared sandboxes.

## Verification summary

- All nine exact `.factory/claims.json` commands passed on desktop and 390 px mobile after `npm ci`.
- `npm run test:unit`: 6 passed.
- `npm run typecheck`: passed.
- `npm test`: 40 passed.
- `npm run build`: passed and produced `dist/`.
- No lint command exists.
- Live axe: zero serious/critical findings on every product route and the real 404.
- Live Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 0.866 s, TBT 4 ms, CLS 0.
- Live privacy flow: same-origin GETs only, no cookies, no normal-flow console/page errors.
- Offline reload and v1-to-v2 service-worker cache replacement passed.
- Unknown routes return the designed HTTP 404; hashed assets use one-year immutable caching.
- Initial JS is 25.81 KB raw / 8.79 KB gzip; CSS is 14.63 KB raw / 3.95 KB gzip; hero WebP is 53.60 KB.

## Reproduce

```sh
npm ci
npm run test:unit
npm run typecheck
npm test
npm run build
```

Then open `/demo`, answer the first derivative prompt correctly with **2x**, and observe the false repair result.

## Repository changes in this verification

Only `.factory/verification-2.md` and `.factory/handoff.md` were changed. Product code was not modified.
