import { expect, test } from '@playwright/test';

test('PriceInput formats amount and preserves shared Input geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--filled&viewMode=story');
  const input = page.getByRole('textbox');
  await expect(input).toHaveValue('123\u00a0456,78');
  const currency = page.getByTestId('input-inline-suffix');
  await expect(currency).toContainText('₽');
  await expect(page.getByTestId('input-sum')).toHaveCount(0);

  const inputBox = await input.boundingBox();
  const currencyBox = await currency.boundingBox();
  expect(inputBox).not.toBeNull();
  expect(currencyBox).not.toBeNull();
  const gap = currencyBox!.x - (inputBox!.x + inputBox!.width);
  expect(gap).toBeGreaterThanOrEqual(3);
  expect(gap).toBeLessThanOrEqual(5);

  const valueWidth = await input.evaluate(element => {
    const target = element as HTMLInputElement;
    const styles = getComputedStyle(target);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    return context.measureText(target.value).width;
  });
  expect(Math.abs(inputBox!.width - valueWidth)).toBeLessThanOrEqual(2);

  await expect(page.getByTestId('input-field')).toHaveCSS('min-height', '56px');
});

test('PriceInput keeps focus after the first character', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');

  await input.click();
  await input.press('1');

  await expect(input).toBeFocused();
  await expect(input).toHaveValue('1');
  await expect(page.getByTestId('input-inline-suffix')).toContainText('₽');
});

test('PriceInput resolves ISO currency code to a symbol', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--currency-code&viewMode=story');

  await expect(page.getByRole('textbox')).toHaveValue('1\u00a0234,56');
  await expect(page.getByTestId('input-inline-suffix')).toHaveText('
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


test('PriceInput maxLength works without a numeric max', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--length-limit-only&viewMode=story');
  const input = page.getByRole('textbox');
  const counter = page.getByTestId('input-counter');

  await expect(input).toHaveValue('1\u00a0234');
  await expect(counter).toHaveText('4 / 6');

  await input.fill('1234567');
  await expect(input).toHaveValue('123\u00a0456');
  await expect(counter).toHaveText('6 / 6');
  await expect(page.getByTestId('input-error')).toHaveCount(0);
});

test('PriceInput counter uses the nine-digit amount limit', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');
  const counter = page.getByTestId('input-counter');

  await expect(counter).toHaveText('0 / 9');

  await input.fill('9999999.99');
  await expect(input).toHaveValue('9\u00a0999\u00a0999,99');
  await expect(counter).toHaveText('9 / 9');

  await input.fill('1234567890');
  await expect(input).toHaveValue('123\u00a0456\u00a0789');
  await expect(counter).toHaveText('9 / 9');
});

test('PriceInput validates the allowed amount range and clears the error again', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--error-limit&viewMode=story');
  const input = page.getByRole('textbox');
  const error = page.getByTestId('input-error');

  await expect(input).toHaveValue('10\u00a0000\u00a0000');
  await expect(error).toContainText('Введите сумму от 1 до 9 999 999,99 ₽');

  await input.fill('9999999.99');
  await expect(input).toHaveValue('9\u00a0999\u00a0999,99');
  await expect(error).toHaveCount(0);

  await input.fill('0.99');
  await expect(input).toHaveValue('0,99');
  await expect(page.getByTestId('input-error')).toContainText('Введите сумму от 1 до 9 999 999,99 ₽');

  await input.fill('1');
  await expect(input).toHaveValue('1');
  await expect(page.getByTestId('input-error')).toHaveCount(0);
});

test('PriceInput normalizes decimal dot and rejects unsupported manual input', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');

  await input.fill('12.5');
  await expect(input).toHaveValue('12,5');
  await expect(input).toHaveAttribute('inputmode', 'decimal');
  await expect(input).toHaveAttribute('pattern', '[0-9\\s,]*');

  await input.fill('12a');
  await expect(input).toHaveValue('12,5');
  await expect(page.getByTestId('input-error')).toContainText('Введите сумму цифрами, отделив копейки запятой');
});
);
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


test('PriceInput maxLength works without a numeric max', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--length-limit-only&viewMode=story');
  const input = page.getByRole('textbox');
  const counter = page.getByTestId('input-counter');

  await expect(input).toHaveValue('1\u00a0234');
  await expect(counter).toHaveText('4 / 6');

  await input.fill('1234567');
  await expect(input).toHaveValue('123\u00a0456');
  await expect(counter).toHaveText('6 / 6');
  await expect(page.getByTestId('input-error')).toHaveCount(0);
});

test('PriceInput counter uses the nine-digit amount limit', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');
  const counter = page.getByTestId('input-counter');

  await expect(counter).toHaveText('0 / 9');

  await input.fill('9999999.99');
  await expect(input).toHaveValue('9\u00a0999\u00a0999,99');
  await expect(counter).toHaveText('9 / 9');

  await input.fill('1234567890');
  await expect(input).toHaveValue('123\u00a0456\u00a0789');
  await expect(counter).toHaveText('9 / 9');
});

test('PriceInput validates the allowed amount range and clears the error again', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--error-limit&viewMode=story');
  const input = page.getByRole('textbox');
  const error = page.getByTestId('input-error');

  await expect(input).toHaveValue('10\u00a0000\u00a0000');
  await expect(error).toContainText('Введите сумму от 1 до 9 999 999,99 ₽');

  await input.fill('9999999.99');
  await expect(input).toHaveValue('9\u00a0999\u00a0999,99');
  await expect(error).toHaveCount(0);

  await input.fill('0.99');
  await expect(input).toHaveValue('0,99');
  await expect(page.getByTestId('input-error')).toContainText('Введите сумму от 1 до 9 999 999,99 ₽');

  await input.fill('1');
  await expect(input).toHaveValue('1');
  await expect(page.getByTestId('input-error')).toHaveCount(0);
});

test('PriceInput normalizes decimal dot and rejects unsupported manual input', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-priceinput--interactive&viewMode=story');
  const input = page.getByRole('textbox');

  await input.fill('12.5');
  await expect(input).toHaveValue('12,5');
  await expect(input).toHaveAttribute('inputmode', 'decimal');
  await expect(input).toHaveAttribute('pattern', '[0-9\\s,]*');

  await input.fill('12a');
  await expect(input).toHaveValue('12,5');
  await expect(page.getByTestId('input-error')).toContainText('Введите сумму цифрами, отделив копейки запятой');
});
