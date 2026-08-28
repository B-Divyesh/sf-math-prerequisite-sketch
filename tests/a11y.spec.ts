import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/demo', '/sketch', '/map', '/privacy', '/terms', '/404', '/404.html']) {
  test(`accessibility baseline on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
    expect(serious, serious.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  });
}

test('390px interactive controls meet the 44px touch-target minimum', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/sketch', '/map', '/privacy', '/terms', '/404', '/404.html']) {
    await page.goto(route);
    const failures = await page.locator('a[href], button, input:not([type="hidden"]), select, textarea, summary').evaluateAll((elements) =>
      elements.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const rendered = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        if (!rendered || (rect.width >= 44 && rect.height >= 44)) return [];
        return [{
          target: element.textContent?.trim().replace(/\s+/g, ' ') || element.getAttribute('aria-label') || element.tagName,
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2))
        }];
      })
    );
    expect(failures, `${route}: ${JSON.stringify(failures)}`).toEqual([]);
  }
});

test('keyboard path reaches and completes the sample check', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.getByRole('button', { name: /^A/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'No prerequisite gap found' })).toBeVisible();
});

test('service worker update replaces the previous app-shell cache', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await Promise.all((await navigator.serviceWorker.getRegistrations()).map((registration) => registration.unregister()));
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
    await caches.open('math-missing-step-v1');
  });
  await page.close();

  const updatedPage = await context.newPage();
  await updatedPage.goto('/demo');
  await updatedPage.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => updatedPage.evaluate(() => caches.keys())).toContain('math-missing-step-v2');
  await expect.poll(() => updatedPage.evaluate(() => caches.keys())).not.toContain('math-missing-step-v1');
});
