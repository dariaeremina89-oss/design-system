import { expect, test } from '@playwright/test';

test('Calendar follows the 288px Figma geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-calendar--default&viewMode=story');

  await expect(page.getByTestId('calendar')).toHaveCSS('width', '288px');
  const day = page.locator('[data-testid^="calendar-day-"]').first();
  await expect(day).toHaveCSS('width', '32px');
  await expect(day).toHaveCSS('height', '32px');
  await expect(page.getByTestId('calendar-actions')).toHaveCSS('min-height', '56px');
});

test('RangeCalendar shows two months on desktop and one on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-datetime-rangecalendar--default&viewMode=story');

  await expect(page.getByTestId('range-calendar')).toHaveCSS('width', '576px');
  await expect(page.getByTestId('range-calendar-month-2')).toBeVisible();

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.getByTestId('range-calendar')).toHaveCSS('width', '288px');
  await expect(page.getByTestId('range-calendar-month-2')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('DatePicker uses the date mask and opens Calendar', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-datepicker--default&viewMode=story');

  const input = page.getByRole('textbox');
  await expect(input).toHaveAttribute('placeholder', '__.__.____');
  await input.fill('23102026');
  await expect(input).toHaveValue('23.10.2026');

  await page.getByTestId('date-picker-button').click();
  await expect(page.getByTestId('date-picker-popup')).toBeVisible();
  await expect(page.getByTestId('calendar')).toHaveCSS('width', '288px');
});

test('RangePicker opens two months on desktop and one on mobile without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto('/iframe.html?id=components-datetime-rangepicker--open&viewMode=story');
  await expect(page.getByTestId('range-calendar-month-2')).toBeVisible();

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/iframe.html?id=components-datetime-rangepicker--open&viewMode=story');
  await expect(page.getByTestId('range-calendar-month-2')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
