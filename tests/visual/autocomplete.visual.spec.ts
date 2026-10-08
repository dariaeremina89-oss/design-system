import { expect, test } from '@playwright/test';

test('autocomplete follows Input and Menu geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-autocomplete--open&viewMode=story');
  const field = page.locator('.fdoc-autocomplete .fdoc-input__field').first();
  await expect(field).toHaveCSS('min-height', '56px');
  await expect(field).toHaveCSS('border-radius', '8px');

  // Open deterministically through the component's keyboard interaction. This avoids
  // a focus/click race in headless Chromium while keeping the test scoped to Menu geometry.
  await page.getByRole('combobox').press('ArrowDown');
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
  await expect(error).toHaveCSS('font-size', '14px');
  await expect(error).toHaveCSS('line-height', '20px');
  const support = page.getByRole('link', { name: 'support@fdoc.ru' });
  await expect(support).toHaveAttribute('href', 'mailto:support@fdoc.ru');
  await expect(support).toHaveCSS('font-size', '14px');
  await expect(support).toHaveCSS('line-height', '20px');
  await expect(support).toHaveCSS('color', await error.evaluate(element => getComputedStyle(element).color));
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


test('async autocomplete shows external query validation inside Menu', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncautocomplete--external-validation&viewMode=story');
  const input = page.getByRole('combobox');

  await input.fill('Иван%');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  const menu = page.getByRole('listbox');
  await expect(menu).toBeVisible();
  await expect(menu).toContainText('Вы ввели недопустимые символы');

  await input.fill('Иван');
  await expect(menu).not.toContainText('Вы ввели недопустимые символы');
  const option = page.getByRole('option', { name: /Иванов Иван Иванович/ });
  await expect(option).toBeVisible();
  await expect(option.locator('.fdoc-item-row__title')).toHaveCSS('font-size', '14px');
  await expect(option.locator('.fdoc-item-row__title')).toHaveCSS('line-height', '20px');
  await expect(option.locator('.fdoc-item-row__description')).toHaveCSS('font-size', '12px');
  await expect(option.locator('.fdoc-item-row__description')).toHaveCSS('line-height', '16px');
});


test('async autocomplete shows remaining characters before search starts', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncautocomplete--minimum-characters&viewMode=story');
  const input = page.getByRole('combobox');

  await input.focus();
  const menu = page.getByRole('listbox');
  await expect(menu).toContainText('Введите еще 3 символа, чтобы начать поиск');
  const idle = page.locator('.fdoc-autocomplete__message--idle .fdoc-item-row__title');
  await expect(idle).toHaveCSS('font-size', '14px');
  await expect(idle).toHaveCSS('line-height', '20px');
  await expect(idle).toHaveCSS('font-weight', '400');
  await expect(idle).toHaveCSS('color', 'rgb(112, 116, 124)');

  await input.fill('И');
  await expect(menu).toContainText('Введите еще 2 символа, чтобы начать поиск');

  await input.fill('Ив');
  await expect(menu).toContainText('Введите еще 1 символ, чтобы начать поиск');
});
