import { expect, test } from '@playwright/test';

test('PhoneInput matches Input geometry and keeps component typography', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-phoneinput--default&viewMode=story');
  const field = page.locator('.fdoc-phone-input .fdoc-input__field');
  const input = page.getByLabel('Номер телефона');
  const selector = page.getByRole('button', { name: 'Тип номера: Россия +7' });

  await expect(field).toHaveCSS('height', '56px');
  await expect(field).toHaveCSS('border-radius', '8px');
  await expect(input).toHaveCSS('font-size', '16px');
  await expect(selector).toHaveCSS('width', '24px');
  await expect(selector).toHaveCSS('height', '24px');
  await expect(selector.locator('[data-icon="flag_chevron/Country=Rus, State=Default"]')).toBeVisible();
});

test('PhoneInput inherits field click focus from Input', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-phoneinput--default&viewMode=story');
  const field = page.locator('.fdoc-phone-input .fdoc-input__field');
  const input = page.getByLabel('Номер телефона');

  await field.click({ position: { x: 200, y: 10 } });
  await expect(input).toBeFocused();
  await expect(field).toHaveCSS('border-width', '2px');
});

test('PhoneInput keeps field focus separate from selector focus', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-phoneinput--default&viewMode=story');
  const input = page.getByLabel('Номер телефона');
  const field = page.locator('.fdoc-phone-input .fdoc-input__field');
  const selector = page.getByRole('button', { name: 'Тип номера: Россия +7' });

  await input.focus();
  await expect(field).toHaveCSS('border-width', '2px');
  await expect(selector.locator('[data-icon="flag_chevron/Country=Rus, State=Default"]')).toBeVisible();

  await selector.focus();
  await expect(field).toHaveCSS('border-width', '1px');
  await expect(selector.locator('[data-icon="flag_chevron/Country=Rus, State=Default"]')).toBeVisible();
  await expect(selector).toHaveAttribute('data-state', 'focused');
  await expect(selector).toHaveCSS('width', '24px');
  await expect(selector).toHaveCSS('height', '24px');
});

test('PhoneInput opens a two-item country Menu without replacing Input field focus styles', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-phoneinput--default&viewMode=story');
  const selector = page.getByRole('button', { name: 'Тип номера: Россия +7' });
  const field = page.locator('.fdoc-phone-input .fdoc-input__field');

  await selector.click();
  const menu = page.getByRole('listbox', { name: 'Тип номера' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('option')).toHaveCount(2);
  await expect(menu.getByRole('option', { name: 'Россия +7' })).toBeVisible();
  await expect(menu.getByRole('option', { name: 'Иностранный номер' })).toBeVisible();
  await expect(field).toHaveCSS('border-width', '1px');
  await expect(selector.locator('[data-icon="flag_chevron/Country=Rus, State=Open"]')).toBeVisible();

  const fieldWidth = await field.evaluate(element => element.getBoundingClientRect().width);
  const menuWidth = await page.locator('.fdoc-popup').evaluate(element => element.getBoundingClientRect().width);
  expect(Math.abs(fieldWidth - menuWidth)).toBeLessThan(1);
});

test('PhoneInput switches selector assets between Russian, International and Disabled', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-phoneinput--international&viewMode=story');
  await expect(page.locator('[data-icon="flag_chevron/Country=Earth, State=Default"]')).toBeVisible();

  await page.goto('/iframe.html?id=components-inputs-phoneinput--disabled&viewMode=story');
  const disabled = page.locator('.fdoc-phone-input').first();
  await expect(disabled.locator('[data-icon="flag_chevron/Country=Rus, State=Disabled"]')).toBeVisible();
});

test('PhoneInput keeps 16px input typography and width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-inputs-phoneinput--default&viewMode=story');
  await expect(page.getByLabel('Номер телефона')).toHaveCSS('font-size', '16px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
