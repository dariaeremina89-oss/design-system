import { test, expect } from '@playwright/test';

test('Highlight inherits each text style and its explicit responsive behavior', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-highlight--inline-typography&viewMode=story');
  const styles = async () => {
    const sizes: string[] = [];
    for (const name of ['heading', 'body', 'caption', 'fixed']) {
      const parent = page.getByTestId(`highlight-${name}`);
      const original = await parent.evaluate(el => ({ size: getComputedStyle(el).fontSize, height: getComputedStyle(el).lineHeight }));
      await expect(parent.locator('mark')).toHaveCSS('font-size', original.size);
      await expect(parent.locator('mark')).toHaveCSS('line-height', original.height);
      sizes.push(original.size);
    }
    return sizes;
  };
  const desktop = await styles();
  await page.setViewportSize({ width: 375, height: 850 });
  const mobile = await styles();
  expect(mobile[0]).not.toBe(desktop[0]);
  expect(mobile[3]).toBe(desktop[3]);
  expect(new Set(mobile).size).toBeGreaterThan(1);
});
