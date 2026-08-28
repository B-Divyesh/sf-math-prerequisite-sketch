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
