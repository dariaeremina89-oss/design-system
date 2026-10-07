import { expect, test } from '@playwright/test';

test('async multiselect searches and keeps Menu open while selecting', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-across-requests&viewMode=story');
  const input = page.getByRole('combobox');
  await input.fill('Фр');
  await expect(page.getByRole('option', { name: 'Фронтенд' })).toBeVisible();
  await page.getByRole('option', { name: 'Фронтенд' }).click();

  await expect(page.getByRole('button', { name: 'Удалить: Дизайн' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Удалить: Фронтенд' })).toBeVisible();
  await expect(page.getByRole('listbox')).toBeVisible();
});

test('async multiselect exposes loading and load error as Menu states', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--loading&viewMode=story');
  await page.getByRole('combobox').click();
  await expect(page.locator('.fdoc-popup .fdoc-item-row[data-state="skeleton"]')).toHaveCount(5);

  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--load-error&viewMode=story');
  await page.getByRole('combobox').click();
  await expect(page.locator('.fdoc-async-multiselect__message--error')).toContainText('Не удалось получить список');
});

test('async multiselect keeps typography and width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-across-requests&viewMode=story');
  await expect(page.getByRole('combobox')).toHaveCSS('font-size', '16px');
  await expect(page.locator('.fdoc-chips__text').first()).toHaveCSS('font-size', '12px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
