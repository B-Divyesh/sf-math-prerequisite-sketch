# Automated mathematics content check

## Review record

- **Checked:** 28 August 2026 (UTC)
- **Checker:** repository regression suite and deterministic answer-key/graph assertions
- **Check kind:** automated mathematical consistency check; not a credentialed educator review
- **Scope:** all 13 concepts, prompts, correct answers, distractors, feedback notes, repair explanations, MathML equations, transfer problems and answers, answer-specific routes, prerequisite edges, and the derivative demo sketch
- **Result:** Passing automated checks after correction

The unattended repair environment has no evidence of a credentialed human reviewer. This record does not invent one or claim educator approval. It records automated answer-key and graph checks only. A school should obtain credentialed human review before adopting the map for instruction.

## Findings and resulting changes

The first two audit passes found correct arithmetic and MathML results, but identified pedagogical problems in routing and precision. The repair made these changes:

- Misconceptions now route only to the current concept or a prerequisite whose repair text addresses the stated error.
- Order-of-operations guidance now states equal precedence and left-to-right evaluation.
- Factoring guidance is limited to the stated monic quadratic case and says factors must exist.
- Exponent division now states the nonzero-base condition.
- The limit check now uses a removable discontinuity, so factoring is a real prerequisite.
- Derivative guidance distinguishes a derivative function from its value and states the sum, constant-multiple, and positive-integer power rules used by the transfer problem.
- The antiderivative prompt now asks for a family, and its transfer asks for the general antiderivative.
- Function notation now lists algebraic expressions as its direct prerequisite.

## Automated result

The regression suite checks every correct answer, every transfer answer, every misconception route, and the recorded precision corrections. The expected 13 concepts are:

```json
["number-sense","fractions","signed-numbers","order-operations","expressions","linear-equations","slope","function-notation","factoring","exponents","limits","derivatives","integrals"]
```

Regression evidence is in `tests/unit/content.test.ts` and the `@claim:content-audited` browser-suite check. Each checks all 13 correct answers, all 13 transfer answers, every route's relationship to the prerequisite graph, and each precision correction.
