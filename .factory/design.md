# Math Missing Step — visual thesis

## Direction

**Signal-trace demoscene.** Returning to mathematics can feel like staring at a program that stopped without an error message. The interface treats each prerequisite as a visible signal node in a hand-built dependency circuit. Amber scan lines show the route already understood; hot coral marks the single concept to repair; cyan marks the next usable step. The pixel language gives the map a memorable, inspectable character without turning the mathematics into a game.

The site is deliberately single-mode and dark. A deep CRT-like field keeps the graph legible, makes printed repair cards feel like tangible readouts, and distinguishes this utility from classroom worksheet products.

## Tokens

- `--ink-0: #090b12` — page background
- `--ink-1: #111622` — raised control surface
- `--ink-2: #1a2233` — selected and grouped surface
- `--paper: #f7f2df` — primary text, 17.2:1 on `--ink-0`
- `--muted: #b9c0cc` — supporting text, 10.4:1 on `--ink-0`
- `--amber: #ffc857` — route and primary action, 12.4:1 on `--ink-0`
- `--amber-ink: #211600` — action label on amber
- `--cyan: #63e6ff` — understood/available signal
- `--coral: #ff6b6b` — missing concept and error
- `--green: #91f2b7` — correct answer
- `--line: #354159` — graph rails and dividers

Spacing uses an 8 px base: 4, 8, 16, 24, 32, 48, 64, 96. Controls are at least 44 px high. Text measures top out at 68 characters.

## Typography

- Display and interface: `"Courier Prime", "Courier New", monospace`, self-hosted WOFF2 regular and bold when available. Its square rhythm carries the terminal language but remains readable.
- Body: `Inter`, system fallbacks, self-hosted WOFF2 regular and semibold when available. It keeps explanations calm beside the more expressive display face.
- Numerals use tabular figures. Math uses native MathML and the browser math font; no rendering script or CDN.

## Shape and layout

Cards have clipped top-right corners, 1 px signal borders, and restrained 2 px hard shadows. Buttons are rectangular readout keys, never pills. The dependency graph is a horizontal rail on large screens and a vertical trace at 390 px. Nodes show both a label and state, so color is never the only signal.

The landing composition is asymmetric: direct copy occupies the left channel while the original pixel observatory fills the right. The working product uses the entire measure; decoration recedes once diagnosis starts.

## Interaction grammar

- Selecting a node lights its incoming dependency rail.
- Each answer advances the trace one node backward or completes the repair path.
- State changes use a 180 ms stepped reveal: one short translate followed by opacity.
- The only repeating motion is a very slow scan-line pass over the hero art. It pauses when the page is not active.
- With `prefers-reduced-motion: reduce`, scan motion and transforms stop; state changes are instant opacity swaps.
- Focus is a 3 px amber outline with a 3 px offset.

## Original asset plan and provenance

One generated hero illustration depicts a tiny pixel signal station tracing a broken algebra-to-calculus circuit through a dark mathematical landscape. It is explanatory atmosphere: the lit chain echoes the real dependency map. The social preview is composed from the same art and product palette. All UI icons and the wordmark are hand-authored with CSS or SVG.

Prompt sheet:

- Subject: a small debugging station tracing one broken link in a floating mathematical dependency circuit
- World: dark retro-computing observatory, abstract coordinate grids and graph rails, no classroom or people
- Materials: crisp pixel art, limited-color sprites, phosphor screen texture, subtle dithering
- Light: amber route lights, cyan verified nodes, one coral break
- Framing: wide 3:2 editorial scene with clear quiet space and a readable focal path
- Palette words: near-black ink, warm ivory, amber, electric cyan, repair coral
- Negative list: no text, no equations that could be wrong, no logos, no watermark, no gradients, no glossy 3D, no human figures

Asset prompt:

> Use case: stylized-concept. Asset type: responsive landing-page hero. A dark retro-computing observatory viewed in crisp, handcrafted pixel art. A small signal console traces a chain of floating square nodes through an abstract coordinate-grid landscape. Most rails are dim; three nodes form a clear short path: cyan verified node, amber route node, coral broken node. Wide 3:2 editorial composition, focal path on the right half, subtle phosphor texture and controlled dithering, near-black ink, warm ivory, amber, electric cyan, repair coral. No text, no legible equations, no people, no logos, no watermark, no glossy 3D, no smooth gradient.

Generation: Azure AI Foundry factory image model via `/opt/fleet/lib/gen-image.sh`, 28 August 2026. Generated assets are original to this product and ship under the repository MIT license.

## Print treatment

Print removes navigation and dark chrome. Repair cards become black-on-white, one continuous path with solid borders. Prompts, worked examples, and transfer checks remain visible; answer reveals stay hidden unless the user opened them.

## Content review

The dated automated mathematics content check, its scope, corrections, result, and limitation (not a credentialed educator review) are recorded in `.factory/content-review.md`. The check changed instructional content only; it did not change this visual thesis.
