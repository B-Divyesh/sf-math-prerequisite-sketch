import { test, expect } from '@playwright/test';

test('a correct first diagnostic answer reports no prerequisite gap', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /^A\s*2x$/ }).click();

  await expect(page.getByRole('heading', { name: 'No prerequisite gap found' })).toBeVisible();
  await expect(page.locator('.repair-card')).toHaveCount(0);
  await expect(page.getByText('Repair this path, then retry')).toHaveCount(0);
});

test('a misconception produces a repair card, but a later correct answer is excluded', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#goal').selectOption('integrals');
  await page.getByRole('button', { name: 'Check this prerequisite' }).click();
  await page.getByRole('button', { name: /^B\s*2$/ }).click();
  await page.getByRole('button', { name: /^A\s*2x$/ }).click();

  await expect(page.getByRole('heading', { name: 'Repair this path, then retry' })).toBeVisible();
  await expect(page.locator('.repair-card')).toHaveCount(1);
  await expect(page.locator('.repair-card')).toContainText('Integrals');
  await expect(page.locator('.repair-card')).not.toContainText('Derivatives');
});

test('an unavailable saved concept recovers to a visible blank starter sketch', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mmstep:sketch', JSON.stringify({ problem: 'p', stopped: 's', goal: 'removed-concept' })));
  await page.goto('/sketch');

  await expect(page.getByText('A saved sketch could not be used, so a blank starter sketch is ready.')).toBeVisible();
  await expect(page.locator('#problem')).toHaveValue('');
  await expect(page.locator('#goal')).toHaveValue('linear-equations');
});

test('a storage quota failure leaves the form visible and announces recovery', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function setItemThatFails() { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  });
  await page.goto('/sketch');
  await page.locator('#problem').fill('Solve 2x + 4 = 10');
  await page.locator('#stopped').fill('I do not know what to undo first.');
  await page.getByRole('button', { name: 'Check this prerequisite' }).click();

  await expect(page.getByRole('alert')).toHaveText('Your sketch could not be saved in this browser. Copy it, free browser storage, then try again.');
  await expect(page.locator('#problem')).toHaveValue('Solve 2x + 4 = 10');
  await expect(page.getByRole('heading', { name: 'What is the derivative of x²?' })).toHaveCount(0);
});

test('390px doubled text reflows the prerequisite map without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect.poll(() => page.locator('.mini-map').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(1);
});

test('SPA routes update canonical and social metadata', async ({ page }) => {
  await page.goto('/privacy');
  const expectedUrl = 'https://math-prerequisite-sketch.sociobot.in/privacy';
  await expect(page).toHaveTitle('Privacy — Math Missing Step');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedUrl);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Math Missing Step');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Privacy — Math Missing Step');
});

test('the static 404 includes route metadata and the footer build marker', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Math Missing Step');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://math-prerequisite-sketch.sociobot.in/404');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Math Missing Step');
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'This path has no node in the Math Missing Step map.');
  await expect(page.locator('footer')).toContainText('v1.0 · build 2026.08');
});
