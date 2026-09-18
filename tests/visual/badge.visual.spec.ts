import { expect, test, type Page } from '@playwright/test';

const openStory = async (page: Page, storyId: string) => {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
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
  return root;
};

test('Badge follows the Figma height matrix and Smallest dot anatomy', async ({ page }) => {
  const root = await openStory(page, 'components-badges-badge--all-sizes');
  const badges = root.locator('[data-testid^="badge-"]');

  await expect(badges).toHaveCount(5);
  for (const [index, height] of [16, 16, 20, 24, 28].entries()) {
    await expect(badges.nth(index)).toHaveCSS('height', `${height}px`);
  }
  await expect(root.getByTestId('badge-smallest').locator('.fdoc-badge__dot')).toHaveCSS('width', '8px');
});

test('Badge skeleton keeps the shared background and Figma radius', async ({ page }) => {
  const root = await openStory(page, 'components-badges-badge--skeleton-all-sizes');
  const skeletons = root.locator('.fdoc-badge__skeleton');

  await expect(skeletons).toHaveCount(4);
  await expect(skeletons.first()).toHaveCSS('border-radius', '4px');
  await expect(skeletons.first()).toHaveCSS('background-color', 'rgba(85, 89, 99, 0.16)');
});
