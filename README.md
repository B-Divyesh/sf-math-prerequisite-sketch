# Math Missing Step

Find the prerequisite behind one blocked math step.

Math Missing Step is for adults returning to mathematics for technical study. Paste the problem and the exact line where work stopped. The tool follows one transparent diagnostic branch through thirteen concepts, from number sense to integrals. It returns up to three repair cards with an example and transfer problem.

Try the isolated sample at `/demo`. Demo work is held in memory and does not touch the real workspace. The real workspace stores only the last sketch in browser local storage. The installed site works offline after the first visit. No account is required, and the tool is free.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/` or go directly to `http://localhost:5173/demo`.

## Test and build

```sh
npm run test:unit
npm test
npm run typecheck
npm run build
```

`npm run test:unit` checks the answer key, misconception routes, service-worker update policy, cache policy, and real-404 configuration. `npm test` builds and serves the production app, then runs Chromium checks on desktop and a 390 px mobile viewport. Browser tests cover every claim in `.factory/claims.json`, keyboard use, 44 px touch targets, and serious or critical axe findings.

`npm run build` writes the static deploy to `dist/`, with `dist/index.html` at its root. Deploy that folder to Azure Static Web Apps. The included `staticwebapp.config.json` supplies fallback routing, security headers, and the 404 response.

## Content and privacy

The explanations and examples are original and MIT licensed. Automated answer-key and prerequisite-route checks cover all 13 concepts. This is not a credentialed educator review. Diagnostics remain study guidance, not a learning diagnosis. See [.factory/content-review.md](.factory/content-review.md).

See [the privacy page](https://math-prerequisite-sketch.sociobot.in/privacy), [the terms](https://math-prerequisite-sketch.sociobot.in/terms), and [.factory/demo.md](.factory/demo.md).

## License

MIT. See [LICENSE](LICENSE).
