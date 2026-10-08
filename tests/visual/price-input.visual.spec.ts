import { expect, test } from '@playwright/test';

test('PriceInput formats amount and preserves shared Input geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--filled&viewMode=story');
  const input = page.getByRole('textbox');
  await expect(input).toHaveValue('123\u00a0456,78');
  await expect(page.getByTestId('input-sum')).toContainText('₽');
  await expect(page.getByTestId('input-field')).toHaveCSS('min-height', '56px');
});

test('PriceInput uses the shared small Input size', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--small&viewMode=story');
  await expect(page.getByTestId('input-field')).toHaveCSS('min-height', '48px');
  await expect(page.getByRole('textbox')).toHaveCSS('font-size', '16px');
});

test('PriceInput stays inside a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-inputs-priceinput--filled&viewMode=story');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});


test('PriceInput inserts pasted content at the caret', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');

  await input.fill('1234,56');
  await expect(input).toHaveValue('1\u00a0234,56');

  await input.evaluate(element => {
    const target = element as HTMLInputElement;
    target.setSelectionRange(1, 1);
    const data = new DataTransfer();
    data.setData('text/plain', '99');
    target.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    }));
  });

  await expect(input).toHaveValue('199\u00a0234,56');
});

test('PriceInput accepts common copied price formats', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');

  await input.evaluate(element => {
    const target = element as HTMLInputElement;
    target.setSelectionRange(0, target.value.length);
    const data = new DataTransfer();
    data.setData('text/plain', '1,234.56 ₽');
    target.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    }));
  });

  await expect(input).toHaveValue('1\u00a0234,56');
});
