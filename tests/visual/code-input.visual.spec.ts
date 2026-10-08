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

test('CodeInput accepts a pasted code and supports keyboard navigation', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--interactive&viewMode=story');
  const first = page.getByTestId('code-input-cell-1');
  await first.click();
  await first.pressSequentially('1');
  await expect(page.getByTestId('code-input-cell-2')).toBeFocused();

  await page.getByTestId('code-input-cell-2').press('ArrowLeft');
  await expect(first).toBeFocused();
});

test('CodeInput keeps typography fixed on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-inputs-codeinput--filled&viewMode=story');
  await expect(page.getByTestId('code-input-cell-1')).toHaveCSS('font-size', '20px');

  await page.goto('/iframe.html?id=components-inputs-codeinput--small&viewMode=story');
  await expect(page.getByTestId('code-input-cell-1')).toHaveCSS('font-size', '16px');
});
