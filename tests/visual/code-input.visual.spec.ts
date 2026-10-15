import { expect, test } from '@playwright/test';

test('CodeInput follows Figma medium and small geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--default&viewMode=story');
  const medium = page.getByTestId('code-input-cell-1');
  await expect(medium).toHaveCSS('width', '48px');
  await expect(medium).toHaveCSS('height', '56px');
  await expect(medium).toHaveCSS('border-radius', '16px');

  await page.goto('/iframe.html?id=components-inputs-codeinput--small&viewMode=story');
  const small = page.getByTestId('code-input-cell-1');
  await expect(small).toHaveCSS('width', '32px');
  await expect(small).toHaveCSS('height', '48px');
  await expect(small).toHaveCSS('border-radius', '8px');
});

test('CodeInput accepts a pasted full code and supports keyboard navigation', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--interactive&viewMode=story');
  const first = page.getByTestId('code-input-cell-1');

  await first.evaluate(element => {
    const data = new DataTransfer();
    data.setData('text/plain', '12-34 56');
    element.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    }));
  });

  await expect(page.getByTestId('code-input-cell-1')).toHaveValue('1');
  await expect(page.getByTestId('code-input-cell-6')).toHaveValue('6');
  await expect(page.getByTestId('code-input-cell-6')).toBeFocused();

  await page.getByTestId('code-input-cell-6').press('ArrowLeft');
  await expect(page.getByTestId('code-input-cell-5')).toBeFocused();
});

test('CodeInput masks a PIN digit after the configured delay', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--pin-masking&viewMode=story');

  const first = page.getByTestId('code-input-cell-1');
  await first.fill('4');
  await expect(first).toHaveValue('4');
  await expect(page.getByTestId('code-input-cell-2')).toBeFocused();

  await page.waitForTimeout(850);
  await expect(first).toHaveValue('*');
});

test('CodeInput shows an existing masked PIN without changing cell count', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--pin-masked-filled&viewMode=story');

  await expect(page.getByRole('textbox')).toHaveCount(4);
  for (let index = 1; index <= 4; index += 1) {
    await expect(page.getByTestId(`code-input-cell-${index}`)).toHaveValue('*');
  }
});

test('CodeInput Phone matches Figma grouping and supports configurable masks', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--phone-figma-example&viewMode=story');

  await expect(page.getByRole('textbox')).toHaveCount(7);
  await expect(page.getByTestId('code-input-phone-prefix')).toHaveText('+7 9');
  await expect(page.getByTestId('code-input-phone-suffix')).toHaveText('88');

  const group1 = page.getByTestId('code-input-phone-group-1');
  const group2 = page.getByTestId('code-input-phone-group-2');
  const group3 = page.getByTestId('code-input-phone-group-3');
  await expect(group1.getByRole('textbox')).toHaveCount(2);
  await expect(group2.getByRole('textbox')).toHaveCount(3);
  await expect(group3.getByRole('textbox')).toHaveCount(2);
  await expect(group1).toHaveCSS('gap', '4px');
  await expect(page.getByTestId('code-input-phone-parts')).toHaveCSS('gap', '12px');

  await page.goto('/iframe.html?id=components-inputs-codeinput--phone-custom-grouping&viewMode=story');
  await expect(page.getByRole('textbox')).toHaveCount(10);
  await expect(page.getByTestId('code-input-phone-prefix')).toHaveText('+44');
  await expect(page.getByTestId('code-input-phone-suffix')).toHaveCount(0);
});

test('CodeInput keeps typography fixed on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-inputs-codeinput--filled&viewMode=story');
  await expect(page.getByTestId('code-input-cell-1')).toHaveCSS('font-size', '20px');

  await page.goto('/iframe.html?id=components-inputs-codeinput--small&viewMode=story');
  await expect(page.getByTestId('code-input-cell-1')).toHaveCSS('font-size', '16px');
});
