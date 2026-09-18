import { expect, test } from '@playwright/test';

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
