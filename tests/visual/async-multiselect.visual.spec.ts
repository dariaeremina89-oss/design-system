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
  const error = page.locator('.fdoc-async-multiselect__message--error .fdoc-item-row__title');
  await expect(error).toContainText('Не удалось получить список');
  await expect(error).toHaveCSS('font-size', '14px');
  await expect(error).toHaveCSS('line-height', '20px');
  const support = page.getByRole('link', { name: 'support@fdoc.ru' });
  await expect(support).toHaveAttribute('href', 'mailto:support@fdoc.ru');
  await expect(support).toHaveCSS('font-size', '14px');
  await expect(support).toHaveCSS('line-height', '20px');
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
  const option = page.getByRole('option', { name: /Сидоров Иван Иванович/ });
  await expect(option).toBeVisible();
  await expect(option.locator('.fdoc-item-row__title')).toHaveCSS('font-size', '14px');
  await expect(option.locator('.fdoc-item-row__title')).toHaveCSS('line-height', '20px');
  await expect(option.locator('.fdoc-item-row__description')).toHaveCSS('font-size', '12px');
  await expect(option.locator('.fdoc-item-row__description')).toHaveCSS('line-height', '16px');
});


test('async multiselect supports both Figma idle guidance variants', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--minimum-characters&viewMode=story');
  let input = page.getByRole('combobox');
  await input.focus();
  let menu = page.getByRole('listbox');
  await expect(menu).toContainText('Введите минимум 3 символа');
  let idle = page.locator('.fdoc-async-multiselect__message--idle .fdoc-item-row__title');
  await expect(idle).toHaveCSS('font-size', '14px');
  await expect(idle).toHaveCSS('line-height', '20px');
  await expect(idle).toHaveCSS('font-weight', '400');
  await expect(idle).toHaveCSS('color', 'rgb(112, 116, 124)');

  await input.fill('И');
  await expect(menu).toContainText('Введите минимум 3 символа');

  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--search-hint&viewMode=story');
  input = page.getByRole('combobox');
  await input.focus();
  menu = page.getByRole('listbox');
  await expect(menu).toContainText('Введите ФИО, номер телефона или почту, минимум 3 символа');
  idle = page.locator('.fdoc-async-multiselect__message--idle .fdoc-item-row__title');
  await expect(idle).toHaveCSS('font-size', '14px');
  await expect(idle).toHaveCSS('line-height', '20px');
  await expect(idle).toHaveCSS('color', 'rgb(112, 116, 124)');
});


test('async multiselect exposes explicit Figma result and filled states', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--results&viewMode=story');
  await expect(page.getByRole('option', { name: /Иванов Иван Иванович/ })).toBeVisible();
  await expect(page.getByRole('option', { name: /Сидоров Иван Иванович/ })).toBeVisible();
  await expect(page.getByRole('option', { name: /Петров Иван Иванович/ })).toBeVisible();

  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-with-results&viewMode=story');
  await expect(page.getByRole('button', { name: 'Удалить: Иванов Иван Иванович' })).toBeVisible();
  await expect(page.getByRole('option', { name: /Иванов Иван Иванович/ })).toHaveCount(0);
  await expect(page.getByRole('option', { name: /Сидоров Иван Иванович/ })).toBeVisible();
  await expect(page.getByRole('option', { name: /Петров Иван Иванович/ })).toBeVisible();

  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--selected-in-results&viewMode=story');
  await expect(page.getByRole('button', { name: 'Удалить: Иванов Иван Иванович' })).toBeVisible();
  const selected = page.getByRole('option', { name: /Иванов Иван Иванович/ });
  await expect(selected).toBeVisible();
  await expect(selected).toHaveAttribute('aria-selected', 'true');

  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--filled&viewMode=story');
  await expect(page.getByRole('button', { name: 'Удалить: Иванов Иван Иванович' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Удалить: Петров Иван Иванович' })).toBeVisible();
  await expect(page.getByRole('listbox')).toHaveCount(0);
});
