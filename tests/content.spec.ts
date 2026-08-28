import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { concepts } from '../src/data';

test('@claim:open-content prerequisite content is complete and MIT licensed', () => {
  const ids = new Set(concepts.map((concept) => concept.id));
  expect(ids.size).toBe(13);
  for (const concept of concepts) {
    expect(concept.question.length).toBeGreaterThan(0);
    expect(concept.answers.filter((answer) => answer.correct)).toHaveLength(1);
    expect(concept.repair.length).toBeGreaterThan(0);
    expect(concept.example).toContain('<math>');
    expect(concept.transfer.length).toBeGreaterThan(0);
    expect(concept.transferAnswer.length).toBeGreaterThan(0);
    for (const id of concept.prerequisiteIds) expect(ids.has(id)).toBe(true);
    for (const answer of concept.answers) if (answer.next) expect(ids.has(answer.next)).toBe(true);
  }
  expect(readFileSync('LICENSE', 'utf8')).toContain('MIT License');
  expect(readFileSync('assets/src/hero-signal.png.json', 'utf8')).toContain('factory-image');
  expect(readFileSync('.factory/design.md', 'utf8')).toContain('ship under the repository MIT license');
});

test('@claim:content-audited checks every answer, branch, and recorded correction', () => {
  const review = readFileSync('.factory/content-review.md', 'utf8');
  expect(review).toContain('Automated mathematics content check');
  expect(review).toContain('not a credentialed educator review');
  expect(review).toContain('**Scope:** all 13 concepts');
  expect(review).toContain('automated answer-key and graph checks');

  const answerKey: Record<string, string> = {
    'number-sense': '0.7', fractions: '1/2', 'signed-numbers': '3', 'order-operations': '13', expressions: '5x − 4',
    'linear-equations': 'x = 3', slope: '3', 'function-notation': '9', factoring: '(x + 2)(x + 3)', exponents: 'x⁵',
    limits: '6', derivatives: '2x', integrals: 'x² + C'
  };
  const transfers: Record<string, string> = {
    'number-sense': '0.35 is greater because 0.350 > 0.305.', fractions: '5/8. Rewrite 3/4 as 6/8, then subtract 1/8.',
    'signed-numbers': '14. Change the subtraction to 5 + 9.', 'order-operations': '10. Divide first, then add.', expressions: '4y + 2.',
    'linear-equations': 'x = 5.', slope: '2. The rise is 6 and the run is 3.', 'function-notation': '22.',
    factoring: '(x + 3)(x + 4).', exponents: 'a⁴, when a is not zero.',
    limits: '4. Factor the numerator, cancel x − 2 for nearby inputs, then evaluate x + 2.', derivatives: '3x² + 4.', integrals: 'x³ + C.'
  };
  expect(Object.keys(answerKey)).toHaveLength(13);

  const byId = new Map(concepts.map((concept) => [concept.id, concept]));
  const ancestors = (id: string, found = new Set<string>()): Set<string> => {
    for (const prerequisite of byId.get(id)?.prerequisiteIds ?? []) {
      if (!found.has(prerequisite)) {
        found.add(prerequisite);
        ancestors(prerequisite, found);
      }
    }
    return found;
  };
  for (const concept of concepts) {
    expect(concept.answers.filter((answer) => answer.correct).map((answer) => answer.label)).toEqual([answerKey[concept.id]]);
    expect(concept.transferAnswer).toBe(transfers[concept.id]);
    const allowed = ancestors(concept.id);
    allowed.add(concept.id);
    for (const answer of concept.answers.filter((answer) => !answer.correct)) expect(allowed.has(answer.next!)).toBe(true);
  }
  expect(byId.get('order-operations')?.repair).toContain('from left to right');
  expect(byId.get('factoring')?.repair).toContain('when such factors exist');
  expect(byId.get('exponents')?.repair).toContain('base is not zero');
  expect(byId.get('limits')?.answers[1].next).toBe('factoring');
  expect(byId.get('derivatives')?.repair).toContain('Differentiate sums term by term');
  expect(byId.get('integrals')?.question).toContain('family of functions');
});
