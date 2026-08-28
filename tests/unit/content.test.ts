import { describe, expect, test } from 'vitest';
import { concepts } from '../../src/data';

const expectedCorrectAnswers: Record<string, string> = {
  'number-sense': '0.7',
  fractions: '1/2',
  'signed-numbers': '3',
  'order-operations': '13',
  expressions: '5x − 4',
  'linear-equations': 'x = 3',
  slope: '3',
  'function-notation': '9',
  factoring: '(x + 2)(x + 3)',
  exponents: 'x⁵',
  limits: '6',
  derivatives: '2x',
  integrals: 'x² + C'
};

const expectedTransferAnswers: Record<string, string> = {
  'number-sense': '0.35 is greater because 0.350 > 0.305.',
  fractions: '5/8. Rewrite 3/4 as 6/8, then subtract 1/8.',
  'signed-numbers': '14. Change the subtraction to 5 + 9.',
  'order-operations': '10. Divide first, then add.',
  expressions: '4y + 2.',
  'linear-equations': 'x = 5.',
  slope: '2. The rise is 6 and the run is 3.',
  'function-notation': '22.',
  factoring: '(x + 3)(x + 4).',
  exponents: 'a⁴, when a is not zero.',
  limits: '4. Factor the numerator, cancel x − 2 for nearby inputs, then evaluate x + 2.',
  derivatives: '3x² + 4.',
  integrals: 'x³ + C.'
};

describe('reviewed mathematics content', () => {
  test('has the independently checked answer key and transfer results', () => {
    expect(Object.keys(expectedCorrectAnswers)).toHaveLength(13);
    for (const concept of concepts) {
      expect(concept.answers.filter((answer) => answer.correct).map((answer) => answer.label)).toEqual([
        expectedCorrectAnswers[concept.id]
      ]);
      expect(concept.transferAnswer).toBe(expectedTransferAnswers[concept.id]);
      expect(concept.example.startsWith('<math>')).toBe(true);
      expect(concept.example.endsWith('</math>')).toBe(true);
    }
  });

  test('routes each misconception to itself or a declared prerequisite', () => {
    const byId = new Map(concepts.map((concept) => [concept.id, concept]));
    const ancestors = (id: string, seen = new Set<string>()): Set<string> => {
      for (const parent of byId.get(id)?.prerequisiteIds ?? []) {
        if (!seen.has(parent)) {
          seen.add(parent);
          ancestors(parent, seen);
        }
      }
      return seen;
    };

    for (const concept of concepts) {
      const allowed = ancestors(concept.id);
      allowed.add(concept.id);
      for (const answer of concept.answers.filter((candidate) => !candidate.correct)) {
        expect(answer.next, `${concept.id}: ${answer.label}`).toBeDefined();
        expect(allowed.has(answer.next!), `${concept.id}: ${answer.label} -> ${answer.next}`).toBe(true);
      }
    }
  });

  test('keeps the reviewed precision corrections', () => {
    const byId = new Map(concepts.map((concept) => [concept.id, concept]));
    expect(byId.get('order-operations')?.repair).toContain('from left to right');
    expect(byId.get('factoring')?.repair).toContain('when such factors exist');
    expect(byId.get('exponents')?.repair).toContain('base is not zero');
    expect(byId.get('exponents')?.repair).toContain('x¹ = x');
    expect(byId.get('derivatives')?.repair).toContain('derivative function');
    expect(byId.get('integrals')?.question).toContain('family of functions');
  });
});
