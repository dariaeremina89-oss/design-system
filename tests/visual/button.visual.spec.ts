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

test('Button follows the fixed Figma height matrix', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-button--all-sizes');
  const buttons = root.locator('button');
  await expect(buttons).toHaveCount(4);

  for (const [index, height] of [32, 40, 48, 56].entries()) {
    await expect(buttons.nth(index)).toHaveCSS('height', `${height}px`);
    await expect(buttons.nth(index)).toHaveCSS('box-sizing', 'border-box');
  }
});

test('Button focus border does not change outer dimensions', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-button--default');
  const button = root.getByRole('button');
  const before = await button.boundingBox();

  await button.focus();
  const after = await button.boundingBox();
  await expect(button).toHaveCSS('border-width', '4px');

  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
});

test('Button has stable one-line content and fixed radius', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-button--long-text');
  const button = root.getByRole('button');
  const text = root.getByTestId('button-text');

  await expect(button).toHaveCSS('border-radius', '8px');
  await expect(text).toHaveCSS('white-space', 'nowrap');
  await expect(text).toHaveCSS('text-overflow', 'ellipsis');
  await expect(text).toHaveCSS('overflow', 'hidden');
});

test('Button disabled state is native and non-interactive', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-button--states');
  const disabled = root.locator('button[data-button-state="disabled"]');

  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS('cursor', 'default');
});

test('Button skeleton uses the shared animated atom and Figma radius', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-button--skeleton-with-slots');
  const skeleton = root.locator('.fdoc-button__skeleton');

  await expect(skeleton).toHaveCount(4);
  await expect(skeleton.first()).toHaveClass(/fdoc-skeleton/);
  await expect(skeleton.first()).toHaveCSS('border-radius', '8px');
  await expect(skeleton.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.16)');
});

