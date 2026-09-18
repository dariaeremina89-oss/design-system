import { expect, test, type Page } from '@playwright/test';

const openStory = async (page: Page, storyId: string) => {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  const root = page.locator('#storybook-root');
  await expect(root).toBeVisible();
  return root;
};

test('Linear determinate keeps Figma geometry and ARIA value', async ({ page }) => {
  const root = await openStory(page, 'components-progress-indicators-progressindicator--linear-modes');
  const linear = root.locator('[data-progress-type="linear"]').first();

  await expect(linear).toHaveCSS('height', '4px');
  await expect(linear).toHaveCSS('border-radius', '8px');
  await expect(linear).toHaveAttribute('aria-valuenow', '60');
});

test('Circular indeterminate uses the shared animation and is accessible', async ({ page }) => {
  const root = await openStory(page, 'components-progress-indicators-progressindicator--circular-modes');
  const circular = root.locator('[data-progress-type="circular"]').nth(1);

  await expect(circular).toHaveAttribute('role', 'progressbar');
  await expect(circular).not.toHaveAttribute('aria-valuenow');
  await expect(circular.locator('.fdoc-progress__indicator')).toHaveCSS('stroke-width', '2px');
});
