import { expect, test } from '@playwright/test';

for (const orientation of ['horizontal', 'vertical']) {
  test(`Divider ${orientation}: follows parent content box and adds arbitrary inset`, async ({ page }) => {
    const story = orientation === 'horizontal' ? 'parent-spacing' : 'vertical-parent-spacing';
    for (const inset of [0, 37.5]) {
      await page.goto(`/iframe.html?id=components-layout-divider--${story}&viewMode=story&args=inset:${inset}`);
      await expect(page.locator('.fdoc-divider')).toBeVisible();
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 800 });
        const parent = page.locator('.divider-example');
        const bounds = (await parent.boundingBox())!;
        const padding = await parent.evaluate(node => {
          const css = getComputedStyle(node);
          return { left: parseFloat(css.paddingLeft), right: parseFloat(css.paddingRight), top: parseFloat(css.paddingTop), bottom: parseFloat(css.paddingBottom) };
        });
        const line = (await page.locator('.fdoc-divider > span').boundingBox())!;
        if (orientation === 'horizontal') {
          expect(line.x).toBeCloseTo(bounds.x + padding.left + inset, 1);
          expect(line.x + line.width).toBeCloseTo(bounds.x + bounds.width - padding.right - inset, 1);
          expect(line.height).toBe(1);
        } else {
          expect(line.y).toBeCloseTo(bounds.y + padding.top + inset, 1);
          expect(line.y + line.height).toBeCloseTo(bounds.y + bounds.height - padding.bottom - inset, 1);
          expect(line.width).toBe(1);
        }
        await expect(page.locator('.fdoc-divider')).toHaveAttribute('aria-hidden', 'true');
      }
    }
  });
}
