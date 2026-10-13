import { expect, test } from '@playwright/test';

test('Breadcrumbs keeps the fixed three-level depth in a narrow container on a wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 500 });
  await page.goto('/iframe.html?id=components-navigation-breadcrumbs--narrow-container&viewMode=story');

  const nav = page.getByRole('navigation', { name: 'Навигационная цепочка' });
  await expect(nav).toBeVisible();
  await expect(page.getByLabel('Пропущены уровни навигации')).toBeVisible();
  await expect(nav.getByRole('link')).toHaveCount(1);
  await expect(nav.locator('[aria-current="page"]')).toBeVisible();
  expect(await nav.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('ButtonToggle replaces itself with Select when long values no longer fit', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 500 });
  await page.goto('/iframe.html?id=components-actions-buttontoggle--long-values&viewMode=story');

  await expect(page.getByRole('radiogroup', { name: 'Тип организации' })).toBeVisible();

  await page.setViewportSize({ width: 320, height: 500 });
  await expect(page.getByRole('combobox', { name: 'Тип организации' })).toBeVisible();
  await expect(page.getByRole('radiogroup', { name: 'Тип организации' })).toHaveCount(0);
  expect(await page.locator('.fdoc-button-toggle-host').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);

  await page.setViewportSize({ width: 1000, height: 500 });
  await expect(page.getByRole('radiogroup', { name: 'Тип организации' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Тип организации' })).toHaveCount(0);
});

test('ButtonToggle also falls back in a narrow container on a wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 500 });
  await page.goto('/iframe.html?id=components-actions-buttontoggle--narrow-container&viewMode=story');

  await expect(page.getByRole('combobox', { name: 'Тип организации' })).toBeVisible();
  expect(await page.locator('.fdoc-button-toggle-host').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});
