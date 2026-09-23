import { expect, test } from '@playwright/test';

test('autocomplete follows Input and Menu geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-autocomplete--open&viewMode=story');
  const field = page.locator('.fdoc-autocomplete .fdoc-input__field').first();
  await expect(field).toHaveCSS('min-height', '56px');
  await expect(field).toHaveCSS('border-radius', '8px');

  await page.getByRole('combobox').click();
  const openMenu = page.locator('.fdoc-popup .fdoc-menu').first();
  await expect(openMenu).toBeVisible();
  await expect(openMenu).toHaveCSS('border-radius', '8px');
  const menuBox = await openMenu.boundingBox();
  expect(menuBox?.height).toBeLessThanOrEqual(304);
});

test('autocomplete highlights a local match and keeps focus on combobox', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-autocomplete--default&viewMode=story');
  const input = page.getByRole('combobox');
  await input.fill('Бро');
  await expect(page.getByRole('option', { name: 'Брокколи' })).toBeVisible();
  await expect(page.locator('.fdoc-highlight')).toHaveText('Бро');
  await input.press('ArrowDown');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-activedescendant', /option-/);
});

test('async loading and load error use Menu states', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncautocomplete--loading&viewMode=story');
  await page.getByRole('combobox').click();
  await expect(page.locator('.fdoc-popup .fdoc-item-row[data-state="skeleton"]')).toHaveCount(5);

  await page.goto('/iframe.html?id=components-selection-asyncautocomplete--load-error&viewMode=story');
  await page.getByRole('combobox').click();
  const error = page.locator('.fdoc-autocomplete__message--error .fdoc-item-row__title');
  await expect(error).toContainText('Не удалось получить список');
});

test('autocomplete does not shrink component typography on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-selection-autocomplete--default&viewMode=story');
  const input = page.getByRole('combobox');
  await expect(input).toHaveCSS('font-size', '16px');
  await input.fill('Я');
  const option = page.getByRole('option', { name: 'Яблоки' });
  await expect(option).toBeVisible();
  await expect(option.locator('.fdoc-item-row__title')).toHaveCSS('font-size', '14px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
