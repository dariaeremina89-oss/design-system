import { expect, test } from '@playwright/test';

test('Typography platform previews keep their own sizes at both viewport widths', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-typography--styles&viewMode=story');
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    const desktop = page.getByRole('region', { name: 'Desktop', exact: true }).locator('.fdoc-atoms__type-sample').first();
    const mobile = page.getByRole('region', { name: 'Mobile', exact: true }).locator('.fdoc-atoms__type-sample').first();
    await expect(desktop).toHaveCSS('font-size', '40px');
    await expect(desktop).toHaveCSS('line-height', '48px');
    await expect(mobile).toHaveCSS('font-size', '32px');
    await expect(mobile).toHaveCSS('line-height', '40px');
  }
});

test('Skeleton typography and icon shapes match the atom contract', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-skeleton--states&viewMode=story');
  const root = page.locator('#storybook-root');
  await expect(root).toBeVisible();
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await expect(root.locator('.fdoc-skeleton--text-caption')).toHaveCount(1);
  await expect(root.locator('.fdoc-skeleton--text-subtitle')).toHaveCount(1);
  await expect(root.locator('.fdoc-skeleton--icon')).toHaveCount(1);
});

test('Cursor icon family preserves its layered fills', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-icons--cursors&viewMode=story');
  const root = page.locator('#storybook-root');
  await expect(root).toBeVisible();
  await expect(root.locator('[data-icon="cursors/cursor"]')).toHaveClass(/fdoc-icon--color/);
  await expect(root.locator('img[data-icon="cursors/cursor"]')).toHaveCount(1);
});
