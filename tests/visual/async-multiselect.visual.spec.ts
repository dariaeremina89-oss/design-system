import { expect, test } from '@playwright/test';

test('async multiselect clears search after selecting a result', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-across-requests&viewMode=story');
  const input = page.getByRole('combobox');
  await input.fill('Фр');
  await expect(page.getByRole('option', { name: 'Фронтенд' })).toBeVisible();
  await page.getByRole('option', { name: 'Фронтенд' }).click();

  await expect(page.getByRole('button', { name: 'Удалить: Дизайн' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Удалить: Фронтенд' })).toBeVisible();
  await expect(input).toHaveValue('');
  await expect(page.getByRole('listbox')).toBeHidden();
});

test('async multiselect keeps field height stable between chip remove and text input focus', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-across-requests&viewMode=story');

  const field = page.getByTestId('async-multiselect-field');
  const input = page.getByRole('combobox');
  const remove = page.getByRole('button', { name: 'Удалить: Дизайн' });

  await input.focus();
  const inputFocusedHeight = await field.evaluate(element => element.getBoundingClientRect().height);

  await remove.focus();
  const removeFocusedHeight = await field.evaluate(element => element.getBoundingClientRect().height);

  expect(removeFocusedHeight).toBe(inputFocusedHeight);

  await remove.click();
  const afterRemovalHeight = await field.evaluate(element => element.getBoundingClientRect().height);
  expect(afterRemovalHeight).toBe(inputFocusedHeight);
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


test('async multiselect keeps chips while showing external query validation in Menu', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--external-validation&viewMode=story');
  const input = page.getByRole('combobox');

  await expect(page.getByRole('button', { name: 'Удалить: Иванов Иван Иванович' })).toBeVisible();

  await input.fill('Сид%');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  const menu = page.getByRole('listbox');
  await expect(menu).toBeVisible();
  await expect(menu).toContainText('Вы ввели недопустимые символы');
  await expect(page.getByRole('button', { name: 'Удалить: Иванов Иван Иванович' })).toBeVisible();

  await input.fill('Сид');
  await expect(menu).not.toContainText('Вы ввели недопустимые символы');
  await expect(page.getByRole('option', { name: /Сидоров Иван Иванович/ })).toBeVisible();
});
