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

test('ButtonIcon follows the fixed size and circular atom contract', async ({ page }) => {
  const root = await openStory(page, 'components-buttonicon--default');
  const button = root.getByRole('button');
  const metrics = await button.evaluate((element) => {
    const computed = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      boxSizing: computed.boxSizing,
      borderRadius: computed.borderRadius,
    };
  });

  expect(metrics.width).toBe(40);
  expect(metrics.height).toBe(40);
  expect(metrics.boxSizing).toBe('border-box');
  expect(metrics.borderRadius).toBe('9999px');
});

test('ButtonIcon focus does not change its outer dimensions', async ({ page }) => {
  const root = await openStory(page, 'components-buttonicon--default');
  const button = root.getByRole('button');
  const before = await button.boundingBox();

  await button.focus();
  const after = await button.boundingBox();
  const focusStyles = await button.evaluate((element) => getComputedStyle(element).boxShadow);

  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  expect(focusStyles).not.toBe('none');
});

test('ButtonIcon disabled state is native and non-interactive', async ({ page }) => {
  const root = await openStory(page, 'components-buttonicon--states');
  const disabled = root.locator('button[data-button-icon-state="disabled"]');
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS('cursor', 'default');
});

test('ButtonIcon skeleton uses the shared animated skeleton atom', async ({ page }) => {
  const root = await openStory(page, 'components-buttonicon--states');
  const skeleton = root.locator('.fdoc-button-icon__skeleton');
  await expect(skeleton).toHaveCount(1);
  await expect(skeleton).toHaveClass(/fdoc-skeleton/);
  await expect(skeleton).toHaveCSS('border-radius', '9999px');
});
