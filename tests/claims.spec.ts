import { test, expect } from '@playwright/test';
import { concepts } from '../src/data';

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => new Promise<void>((resolve) => {
    if (navigator.serviceWorker.controller) resolve();
    else navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
  }));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trace the step that stopped your work');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Offline — the saved map is ready.')).toBeVisible();
});

test('@claim:demo-isolated demo does not save or read the real sketch', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mmstep:sketch', JSON.stringify({ problem: 'PRIVATE MARKER', stopped: 'PRIVATE LINE', goal: 'slope' })));
  await page.goto('/demo');
  await expect(page.locator('#problem')).not.toHaveValue(/PRIVATE MARKER/);
  await page.locator('#problem').fill('Changed sample');
  await page.getByRole('button', { name: 'Check this prerequisite' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const stored = await page.evaluate(() => ({ value: localStorage.getItem('mmstep:sketch'), keys: Object.keys(localStorage) }));
  expect(stored.value).toContain('PRIVATE MARKER');
  expect(stored.keys.filter((key) => key.startsWith('demo:'))).toHaveLength(0);
});

test('@claim:local-only the real sketch stays in browser storage with same-origin requests', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/sketch');
  await page.locator('#problem').fill('Solve 2x + 4 = 10');
  await page.locator('#stopped').fill('I do not know what to undo first.');
  await page.locator('#goal').selectOption('linear-equations');
  await page.getByRole('button', { name: 'Check this prerequisite' }).click();
  const saved = await page.evaluate(() => localStorage.getItem('mmstep:sketch'));
  expect(saved).toContain('Solve 2x + 4 = 10');
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:path-max-three gives a repair path of no more than three nodes', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#goal').selectOption('integrals');
  await page.getByRole('button', { name: 'Check this prerequisite' }).click();
  await expect(page.locator('#goal')).toHaveValue('integrals');
  await page.locator('[data-answer="1"]').click();
  await page.locator('[data-answer="2"]').click();
  await page.locator('[data-answer="0"]').click();
  await expect(page.getByRole('heading', { name: 'Repair this path, then retry' })).toBeVisible();
  const count = await page.locator('.repair-card').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(3);
  await expect(page.locator('.math-example')).toHaveCount(count);
  await expect(page.locator('.transfer')).toHaveCount(count);
});

test('@claim:print-repair prints the repair cards', async ({ page }) => {
  await page.addInitScript(() => { window.print = () => { document.documentElement.dataset.printed = 'yes'; }; });
  await page.goto('/demo');
  await page.locator('[data-answer="1"]').click();
  await page.getByRole('button', { name: 'Print repair cards' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-printed', 'yes');
  await expect(page.locator('.repair-card')).toHaveCount(1);
});

test('@claim:thirteen-concepts contains thirteen mapped concepts', async ({ page }) => {
  await page.goto('/map');
  await expect(page.locator('.full-map li')).toHaveCount(13);
  await expect(page.locator('.full-map li p')).toHaveCount(13);
  for (const concept of concepts) {
    const prerequisites = concept.prerequisiteIds.map((id) => concepts.find((item) => item.id === id)!.label).join(', ');
    await expect(page.locator(`#${concept.id} p`)).toHaveText(prerequisites ? `Needs: ${prerequisites}.` : 'Starting concept.');
  }
});

test('@claim:free-no-account starts without payment or an account', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free. No account.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});
