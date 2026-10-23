import { expect, test } from '@playwright/test';

test('Calendar matches Figma header and day geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-calendar--default&viewMode=story');

  const calendar = page.getByTestId('calendar');
  const period = page.getByTestId('calendar-period');
  const previous = page.getByTestId('calendar-previous');
  const next = page.getByTestId('calendar-next');

  await expect(calendar).toHaveCSS('width', '288px');
  const periodText = period.locator('.fdoc-calendar__period-text');
  expect(await periodText.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await period.evaluate(element => element.getBoundingClientRect().width)).not.toBe(132);
  await expect(period.locator('[data-icon="arrow-drop-down"]')).toHaveCSS('width', '24px');
  await expect(period.locator('[data-icon="arrow-drop-down"]')).toHaveCSS('height', '24px');

  const calendarBox = await calendar.boundingBox();
  const periodBox = await period.boundingBox();
  const previousBox = await previous.boundingBox();
  const nextBox = await next.boundingBox();
  expect(calendarBox).not.toBeNull();
  expect(periodBox).not.toBeNull();
  expect(previousBox).not.toBeNull();
  expect(nextBox).not.toBeNull();
  expect(Math.abs(periodBox!.x - calendarBox!.x - 20)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(previousBox!.x - calendarBox!.x - 196)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(nextBox!.x - calendarBox!.x - 236)).toBeLessThanOrEqual(0.5);

  await expect(previous).toHaveCSS('width', '32px');
  await expect(previous).toHaveCSS('height', '32px');
  await expect(previous).toHaveCSS('padding-left', '4px');
  await expect(previous).toHaveCSS('padding-right', '4px');
  await expect(previous.locator('[data-icon="arrow-chevron-left"]')).toHaveCSS('width', '24px');
  await expect(previous.locator('[data-icon="arrow-chevron-left"]')).toHaveCSS('height', '24px');
  await expect(next.locator('[data-icon="arrow-chevron-right"]')).toHaveCSS('width', '24px');
  await expect(next.locator('[data-icon="arrow-chevron-right"]')).toHaveCSS('height', '24px');

  const day = page.locator('[data-testid^="calendar-day-"]').first();
  await expect(day).toHaveCSS('width', '32px');
  await expect(day).toHaveCSS('height', '32px');

  const selectedValue = calendar.locator('.fdoc-calendar__day--selected .fdoc-calendar__day-value');
  await expect(selectedValue).toHaveCSS('width', '28px');
  await expect(selectedValue).toHaveCSS('height', '28px');
});

test('Calendar Year contains 24 years in a 4-column grid', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-calendar--year&viewMode=story');

  const calendar = page.getByTestId('calendar');
  await expect(calendar).toHaveAttribute('data-calendar-type', 'year');
  await expect(calendar).toHaveAttribute('data-calendar-view', 'year');

  const yearButtons = calendar.locator('.fdoc-calendar__choice');
  await expect(yearButtons).toHaveCount(24);
  await expect(yearButtons.first()).toHaveCSS('width', '59px');
  await expect(yearButtons.first()).toHaveCSS('height', '32px');
  await expect(yearButtons.first().locator('.fdoc-calendar__choice-value')).toHaveCSS('height', '28px');
  const columns = await calendar.locator('.fdoc-calendar__choices').evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length,
  );
  expect(columns).toBe(4);
});

test('RangeCalendar matches desktop Figma structure and mobile scroll', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-datetime-rangecalendar--default&viewMode=story');

  const range = page.getByTestId('range-calendar');
  const firstMonth = page.getByTestId('range-calendar-month-1');
  const secondMonth = page.getByTestId('range-calendar-month-2');

  await expect(range).toHaveCSS('width', '576px');
  await expect(firstMonth).toBeVisible();
  await expect(secondMonth).toBeVisible();
  await expect(firstMonth.locator('[data-testid="calendar-previous"]')).toBeVisible();
  await expect(firstMonth.locator('[data-testid="calendar-next"]')).toHaveCount(0);
  await expect(secondMonth.locator('[data-testid="calendar-previous"]')).toHaveCount(0);
  await expect(secondMonth.locator('[data-testid="calendar-next"]')).toBeVisible();
  await expect(firstMonth.locator('[data-testid="calendar-previous"] [data-icon="arrow-chevron-left"]')).toHaveCSS('width', '24px');
  await expect(secondMonth.locator('[data-testid="calendar-next"] [data-icon="arrow-chevron-right"]')).toHaveCSS('width', '24px');
  await expect(firstMonth.locator('.fdoc-calendar__range-period')).toHaveCSS('width', '180px');
  await expect(secondMonth.locator('.fdoc-calendar__range-period')).toHaveCSS('width', '180px');
  await expect(secondMonth.locator('.fdoc-calendar__header--range-right')).toHaveCSS('column-gap', '8px');
  const dividerWidth = await range.locator('.fdoc-range-calendar__month--primary').evaluate(element =>
    getComputedStyle(element, '::after').width,
  );
  expect(dividerWidth).toBe('1px');

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(range).toHaveCSS('width', '288px');
  await expect(range.locator('.fdoc-range-calendar__desktop')).toBeHidden();
  await expect(page.getByTestId('range-calendar-mobile')).toBeVisible();

  const scroll = range.locator('.fdoc-range-calendar__mobile-scroll');
  await expect(scroll).toHaveCSS('overflow-y', 'auto');
  await expect(scroll).toHaveCSS('max-height', '304px');
  await expect(range.getByTestId('range-calendar-scrollbar')).toBeVisible();
  await expect(range.getByTestId('range-calendar-scrollbar').locator('.fdoc-scrollbar__thumb')).toHaveCSS('width', '8px');
  expect(await page.getByTestId('range-calendar-mobile-month').count()).toBeGreaterThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('DatePicker uses 24px calendar icon and Calendar without buttons by default', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-datepicker--default&viewMode=story');

  const input = page.getByRole('textbox');
  const button = page.getByTestId('date-picker-button');
  const buttonBeforeOpen = await button.boundingBox();
  await expect(input).toHaveAttribute('placeholder', '__.__.____');
  await expect(button).toHaveCSS('width', '32px');
  await expect(button).toHaveCSS('height', '32px');
  await expect(button.locator('[data-icon="calendar"]')).toHaveCSS('width', '24px');
  await expect(button.locator('[data-icon="calendar"]')).toHaveCSS('height', '24px');
  await expect(button).toHaveCSS('padding-left', '4px');
  await expect(button).toHaveCSS('padding-right', '4px');
  await expect(page.getByTestId('input-field')).toHaveCSS('padding-right', '8px');

  await input.fill('23102026');
  await expect(input).toHaveValue('23.10.2026');

  await button.click();
  const popup = page.getByTestId('date-picker-popup');
  const field = page.getByTestId('input-field');
  await expect(popup).toBeVisible();
  const focusedBorder = await field.evaluate(element => getComputedStyle(element).borderColor);
  await field.hover();
  expect(await field.evaluate(element => getComputedStyle(element).borderColor)).toBe(focusedBorder);
  await expect(field).toHaveCSS('border-width', '2px');

  const buttonAfterOpen = await button.boundingBox();
  expect(buttonBeforeOpen).not.toBeNull();
  expect(buttonAfterOpen).not.toBeNull();
  expect(Math.abs(buttonAfterOpen!.x - buttonBeforeOpen!.x)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(buttonAfterOpen!.y - buttonBeforeOpen!.y)).toBeLessThanOrEqual(0.5);
  await expect(page.getByTestId('calendar-actions')).toHaveCount(0);

  const fieldBox = await field.boundingBox();
  const popupBox = await popup.boundingBox();
  expect(fieldBox).not.toBeNull();
  expect(popupBox).not.toBeNull();
  expect(Math.abs(popupBox!.y - (fieldBox!.y + fieldBox!.height))).toBeLessThanOrEqual(1);

  const helper = page.locator('.fdoc-field__helper');
  const helperBox = await helper.boundingBox();
  expect(helperBox).not.toBeNull();
  expect(popupBox!.y).toBeLessThan(helperBox!.y + helperBox!.height);

  const visibleCalendar = page.getByTestId('date-picker-popup').getByTestId('calendar');
  const day = visibleCalendar.locator('[data-testid^="calendar-day-"]:not(:disabled)').filter({ hasText: /^24$/ }).first();
  await day.click();
  await expect(page.getByTestId('date-picker-popup')).toHaveCount(0);
});

test('DatePicker supports calendar-only and manual-input-only modes', async ({ page }) => {
  await page.goto('/iframe.html?id=components-datetime-datepicker--calendar-only&viewMode=story');
  await expect(page.getByRole('textbox')).toHaveAttribute('readonly', '');
  await expect(page.getByTestId('date-picker-button')).toBeVisible();

  await page.goto('/iframe.html?id=components-datetime-datepicker--manual-input-only&viewMode=story');
  await expect(page.getByRole('textbox')).not.toHaveAttribute('readonly');
  await expect(page.getByTestId('date-picker-button')).toHaveCount(0);
});

test('RangePicker opens desktop and mobile RangeCalendar without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto('/iframe.html?id=components-datetime-rangepicker--open&viewMode=story');
  await expect(page.getByTestId('range-calendar-month-2')).toBeVisible();

  const rangeButton = page.getByTestId('range-picker-button');
  await expect(rangeButton).toHaveCSS('width', '32px');
  await expect(rangeButton.locator('[data-icon="calendar"]')).toHaveCSS('width', '24px');

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/iframe.html?id=components-datetime-rangepicker--open&viewMode=story');

  const range = page.getByTestId('range-calendar');
  await expect(range.locator('.fdoc-range-calendar__desktop')).toBeHidden();
  await expect(page.getByTestId('range-calendar-mobile')).toBeVisible();
  await expect(range.locator('.fdoc-range-calendar__mobile-scroll')).toHaveCSS('overflow-y', 'auto');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
