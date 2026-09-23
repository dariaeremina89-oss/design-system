import { expect, test } from '@playwright/test';

test('multiselect text display keeps field geometry and Menu open while selecting', async ({ page }) => {
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
  await expect(page.locator('.fdoc-multiselect__value')).toHaveText('Дизайн');
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await expect(option).toHaveAttribute('data-state', 'default');
  await expect(input).toBeFocused();
  await expect(input).not.toHaveAttribute('aria-activedescendant');
});

test('multiselect chips wrap and grow the field instead of clipping values', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--chips-wrap&viewMode=story');
  const field = page.locator('.fdoc-multiselect__field');
  const chips = page.locator('.fdoc-multiselect__chips .fdoc-chips');
  await expect(chips).toHaveCount(5);

  const height = await field.evaluate(element => element.getBoundingClientRect().height);
  expect(height).toBeGreaterThan(56);

  const rows = await chips.evaluateAll(elements => new Set(elements.map(element => Math.round(element.getBoundingClientRect().top))).size);
  expect(rows).toBeGreaterThan(1);
});

test('multiselect comma display truncates text in one line', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--long-values&viewMode=story');
  const value = page.locator('.fdoc-multiselect__value');
  await expect(value).toHaveCSS('white-space', 'nowrap');
  await expect(value).toHaveCSS('text-overflow', 'ellipsis');
  expect(await value.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
});

test('multiselect creatable turns entered text into Chips without adding a Menu option', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-multiselect--creatable&viewMode=story');
  const input = page.getByRole('combobox');
  await input.click();
  await input.fill('Свое значение');
  await input.press('Enter');

  await expect(page.getByRole('button', { name: 'Удалить: Свое значение' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Свое значение' })).toHaveCount(0);
  await expect(input).toHaveValue('');
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
  await page.goto('/iframe.html?id=components-selection-multiselect--chips-wrap&viewMode=story');
  await expect(page.locator('.fdoc-chips__text').first()).toHaveCSS('font-size', '12px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
