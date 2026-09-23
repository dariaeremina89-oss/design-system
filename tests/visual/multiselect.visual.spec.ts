import { expect, test } from '@playwright/test';

test('multiselect follows field geometry and keeps Menu open while selecting', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--default&viewMode=story');
  const field = page.locator('.fdoc-multiselect__field');
  const input = page.getByRole('combobox');
  await expect(field).toHaveCSS('height', '56px');
  await expect(field).toHaveCSS('border-radius', '8px');

  await field.click();
  const menu = page.locator('.fdoc-popup .fdoc-menu');
  await expect(menu).toBeVisible();
  const option = page.getByRole('option', { name: 'Дизайн' });
  await option.click();
  await expect(menu).toBeVisible();
  await expect(page.locator('.fdoc-multiselect__chips .fdoc-chips')).toHaveCount(1);
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await expect(option).toHaveAttribute('data-state', 'default');
  await expect(input).toBeFocused();
  await expect(input).not.toHaveAttribute('aria-activedescendant');
});

test('multiselect defaults Checkbox left and can move it right for leading icons', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--default&viewMode=story');
  await page.locator('.fdoc-multiselect__field').click();
  const defaultOption = page.getByRole('option', { name: 'Дизайн' });
  await expect(defaultOption.locator('.fdoc-item-row__main > .fdoc-item-row__slot .fdoc-item-row__checkbox')).toBeVisible();

  await page.goto('/iframe.html?id=components-selection-multiselect--with-leading-icons&viewMode=story');
  await page.locator('.fdoc-multiselect__field').click();
  const iconOption = page.getByRole('option', { name: 'Документы' });
  await expect(iconOption.locator('[data-icon="doc-list"]')).toBeVisible();
  await expect(iconOption.locator('.fdoc-item-row__checkbox')).toBeVisible();
});

test('multiselect keeps component typography and width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-selection-multiselect--filled&viewMode=story');
  await expect(page.locator('.fdoc-chips__text').first()).toHaveCSS('font-size', '12px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
