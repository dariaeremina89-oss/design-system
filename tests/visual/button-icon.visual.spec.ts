import { expect, test, type Page } from '@playwright/test';
import { expectColors, schemes } from './icon-button-contract';

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
  const root = await openStory(page, 'components-buttons-buttonicon--default');
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
  const root = await openStory(page, 'components-buttons-buttonicon--default');
  const button = root.getByRole('button');
  const before = await button.boundingBox();

  await button.focus();
  const after = await button.boundingBox();
  const focusStyles = await button.evaluate((element) => getComputedStyle(element).outlineWidth);

  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  expect(focusStyles).toBe('4px');
});

test('ButtonIcon disabled state is native and non-interactive', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-buttonicon--states');
  const disabled = root.locator('button[data-button-icon-state="disabled"]');
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS('cursor', 'default');
});

test('ButtonIcon skeleton uses the shared animated skeleton atom', async ({ page }) => {
  const root = await openStory(page, 'components-buttons-buttonicon--states');
  const skeleton = root.locator('.fdoc-button-icon__skeleton');
  await expect(skeleton).toHaveCount(1);
  await expect(skeleton).toHaveClass(/fdoc-skeleton/);
  await expect(skeleton).toHaveCSS('border-radius', '9999px');
});

test('ButtonIcon matches every color and forced state including Skeleton', async ({ page }) => {
  await openStory(page, 'components-buttons-buttonicon--state-matrix');
  for (const color of Object.keys(schemes) as (keyof typeof schemes)[]) {
    for (const state of ['default', 'hover', 'focused', 'pressed', 'disabled']) {
      const button = page.getByTestId(`button-icon-${color}-${state}`);
      await expectColors(button, color, state);
      await expect(button).toHaveCSS('width', '40px');
      await expect(button.locator('[data-icon]')).toHaveCSS('width', '24px');
      if (state !== 'default') {
        await button.hover({ force: true });
        await expectColors(button, color, state);
        await page.mouse.move(0, 0);
      }
    }
    const skeleton = page.getByTestId(`button-icon-${color}-skeleton`);
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    await expect(skeleton).toHaveCSS('width', '40px');
    const iconOnly = color === 'tertiary' || color === 'neutral';
    await expect(skeleton.locator('.fdoc-skeleton--icon')).toHaveCount(iconOnly ? 1 : 0);
    if (iconOnly) await expect(skeleton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
});

test('ButtonIcon responds to hover, press and keyboard focus for all colors', async ({ page }) => {
  await openStory(page, 'components-buttons-buttonicon--all-colors');
  for (const color of Object.keys(schemes) as (keyof typeof schemes)[]) {
    const button = page.getByRole('button', { name: color, exact: true });
    await expectColors(button, color, 'default');
    await button.hover();
    await expectColors(button, color, 'hover');
    await page.mouse.down();
    await expectColors(button, color, 'pressed');
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await button.focus();
    await expectColors(button, color, 'focused');
    await button.hover();
    await expectColors(button, color, 'hover');
    await expect(button).toHaveCSS('outline-width', '4px');
    await page.keyboard.down('Space');
    await expectColors(button, color, 'pressed');
    await expect(button).toHaveCSS('outline-width', '4px');
    await page.keyboard.up('Space');
    await page.mouse.move(0, 0);
  }
});

test('ButtonIcon focus stays outside all six sizes without moving the icon', async ({ page }) => {
  await openStory(page, 'components-buttons-buttonicon--all-sizes');
  for (const size of ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'giant']) {
    const button = page.getByRole('button', { name: size, exact: true });
    const before = await button.boundingBox();
    const iconBefore = await button.locator('[data-icon]').boundingBox();
    await button.focus();
    await expect(button).toHaveCSS('outline-width', '4px');
    await expect(button).toHaveCSS('outline-offset', '0px');
    await expect(button).toHaveCSS('box-shadow', 'none');
    expect(await button.boundingBox()).toEqual(before);
    expect(await button.locator('[data-icon]').boundingBox()).toEqual(iconBefore);
  }
});

test('ButtonIcon activates with Enter and Space and skips disabled in Tab order', async ({ page }) => {
  await openStory(page, 'components-buttons-buttonicon--states');
  const button = page.getByRole('button', { name: 'default', exact: true });
  await button.evaluate(el => {
    el.setAttribute('data-test-clicks', '0');
    el.addEventListener('click', () => el.setAttribute('data-test-clicks', String(Number(el.getAttribute('data-test-clicks')) + 1)));
  });
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(button).toHaveAttribute('data-test-clicks', '2');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'disabled', exact: true })).not.toBeFocused();
  }
});
