import { expect, test } from '@playwright/test';

test('InfoBlock follows Figma geometry and tokens', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-infoblock--two-actions&viewMode=story');
  const block = page.getByTestId('info-block');
  await expect(block).toHaveCSS('box-sizing', 'border-box');
  await expect(block).toHaveCSS('border-radius', '8px');
  await expect(block).toHaveCSS('border-top-width', '1px');
  await expect(block).toHaveCSS('padding-left', '16px');
  await expect(block).toHaveCSS('padding-right', '4px');
  await expect(block).toHaveCSS('padding-top', '4px');
  await expect(page.getByTestId('info-block-icon')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('info-block-close')).toHaveCSS('width', '32px');
  await expect(page.locator('.fdoc-info-block__title')).toHaveCSS('font-size', '14px');
  await expect(page.locator('.fdoc-info-block__title')).toHaveCSS('line-height', '20px');
});

test('Medium horizontal InfoBlock adapts to its own narrow container', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--narrow-container&viewMode=story');
  const body = page.locator('.fdoc-info-block__body');
  await expect(body).toHaveCSS('flex-direction', 'column');
  const actions = page.locator('.fdoc-info-block__actions');
  const bodyBox = await body.boundingBox();
  const actionsBox = await actions.boundingBox();
  expect(actionsBox?.width).toBe(bodyBox?.width);
});

test('InfoBlock long content stays inside the component', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--long-content&viewMode=story');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('InfoBlock semantic colors remain readable in dark theme', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-infoblock--colors&viewMode=story');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  for (const block of await page.locator('.fdoc-info-block').all()) {
    await expect(block).toBeVisible();
    const background = await block.evaluate(el => getComputedStyle(el).backgroundColor);
    const text = await block.evaluate(el => getComputedStyle(el).color);
    expect(background).not.toBe(text);
  }
});


for (const width of [320, 288, 256, 240]) {
  test(`InfoBlock keeps anatomy inside at ${width}px container`, async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto('/iframe.html?id=components-elements-infoblock--adaptive-container&viewMode=story');
    await page.locator('[data-testid="adaptive-host"]').evaluate((el, value) => {
      (el as HTMLElement).style.width = `${value}px`;
    }, width);

    const block = page.getByTestId('info-block');
    const blockBox = await block.boundingBox();
    expect(blockBox).not.toBeNull();

    for (const locator of [
      page.getByTestId('info-block-icon'),
      page.locator('.fdoc-info-block__copy'),
      page.getByTestId('info-block-close'),
    ]) {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(blockBox!.x);
      expect(box!.x + box!.width).toBeLessThanOrEqual(blockBox!.x + blockBox!.width + 0.5);
    }

    const copyBox = await page.locator('.fdoc-info-block__copy').boundingBox();
    expect(copyBox!.width).toBeGreaterThanOrEqual(120);
    expect(await block.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(Math.ceil(blockBox!.width));
  });
}
