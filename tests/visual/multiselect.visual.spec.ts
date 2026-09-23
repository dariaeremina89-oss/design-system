import { expect, test } from '@playwright/test';

test('multiselect follows field geometry and keeps Menu open while selecting', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--default&viewMode=story');
  const field = page.locator('.fdoc-multiselect__field');
  await expect(field).toHaveCSS('height', '56px');
  await expect(field).toHaveCSS('border-radius', '8px');

  await field.click();
  const menu = page.locator('.fdoc-popup .fdoc-menu');
  await expect(menu).toBeVisible();
  await page.getByRole('option', { name: 'Дизайн' }).click();
  await expect(menu).toBeVisible();
  await expect(page.locator('.fdoc-multiselect__chips .fdoc-chips')).toHaveCount(1);
  await expect(page.getByRole('option', { name: 'Дизайн' })).toHaveAttribute('aria-selected', 'true');
});

test('multiselect keeps component typography and width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-selection-multiselect--filled&viewMode=story');
  await expect(page.locator('.fdoc-chips__text').first()).toHaveCSS('font-size', '12px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
