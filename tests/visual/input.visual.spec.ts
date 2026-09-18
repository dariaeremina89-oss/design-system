import { expect, test, type Page } from '@playwright/test';

const disableMotion = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });
};

const openStory = async (page: Page, storyId: string) => {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  const root = page.locator('#storybook-root');
  await expect(root).toBeVisible();
  await disableMotion(page);
  return root;
};

test('Input default state keeps its intended geometry', async ({ page }) => {
  const root = await openStory(page, 'components-inputs-input--default');
  const field = root.getByTestId('input-field');
  const box = await field.boundingBox();
  const styles = await field.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { boxSizing: computed.boxSizing, borderWidth: computed.borderWidth };
  });

  expect(box?.height).toBe(56);
  expect(styles.boxSizing).toBe('border-box');
  expect(styles.borderWidth).toBe('1px');
});

test('Input error state keeps error content and border', async ({ page }) => {
  const root = await openStory(page, 'components-inputs-input--error');
  await expect(root.getByTestId('input-error')).toContainText('Error text');
  const borderColor = await root.getByTestId('input-field').evaluate((element) => getComputedStyle(element).borderColor);
  expect(borderColor).not.toBe('');
});

test('Input focused state keeps its border stable', async ({ page }) => {
  const root = await openStory(page, 'components-inputs-input--default');
  const field = root.getByTestId('input-field');
  const input = root.getByTestId('input-control');
  const before = await field.boundingBox();

  await input.focus();
  const after = await field.boundingBox();
  const styles = await field.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { borderWidth: computed.borderWidth, borderColor: computed.borderColor };
  });

  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  expect(styles.borderWidth).toBe('2px');
  expect(styles.borderColor).not.toBe('');
});

test('Input long content stays inside the component', async ({ page }) => {
  const root = await openStory(page, 'components-inputs-input--long-unbroken-text');
  const overflow = await root.evaluate((element) => element.scrollWidth <= element.clientWidth);
  expect(overflow).toBe(true);
});

test('Input skeleton reflects all nested content', async ({ page }) => {
  const root = await openStory(page, 'components-inputs-input--skeleton-with-all-content');
  await expect(root.getByTestId('input-skeleton-label-text')).toHaveCount(1);
  await expect(root.getByTestId('input-skeleton-text')).toHaveCount(1);
  await expect(root.getByTestId('input-skeleton-description')).toHaveCount(1);
  await expect(root.getByTestId('input-skeleton-helper-shape')).toHaveCount(1);
  await expect(root.getByTestId('input-skeleton-counter-shape')).toHaveCount(1);
  await expect(root.locator('.fdoc-skeleton--icon')).toHaveCount(4);
});
