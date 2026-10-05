import { expect, test } from '@playwright/test';

test('InfoBlock horizontal geometry matches Figma', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--wide-container&viewMode=story');
  const block = page.getByTestId('info-block');

  await expect(block).toHaveAttribute('data-actions-layout', 'horizontal');
  await expect(block).toHaveCSS('box-sizing', 'border-box');
  await expect(block).toHaveCSS('border-radius', '8px');
  await expect(block).toHaveCSS('border-top-width', '0px');
  expect(await block.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe('none');
  await expect(block).toHaveCSS('padding-left', '16px');
  await expect(block).toHaveCSS('padding-right', '4px');
  await expect(block).toHaveCSS('padding-top', '4px');
  await expect(block).toHaveCSS('padding-bottom', '4px');
  expect((await block.boundingBox())!.height).toBe(70);

  const iconSlot = page.getByTestId('info-block-icon');
  const copy = page.locator('.fdoc-info-block__copy');
  const actions = page.locator('.fdoc-info-block__actions');
  const close = page.getByTestId('info-block-close');
  await expect(iconSlot).toHaveCSS('width', '24px');
  await expect(iconSlot).toHaveCSS('height', '32px');
  await expect(copy).toHaveCSS('padding-top', '10px');
  await expect(copy).toHaveCSS('padding-right', '12px');
  await expect(copy).toHaveCSS('padding-bottom', '10px');
  await expect(actions).toHaveCSS('height', '40px');
  await expect(actions).toHaveCSS('padding-top', '0px');
  await expect(actions).toHaveCSS('padding-right', '8px');
  await expect(actions).toHaveCSS('padding-bottom', '0px');
  await expect(close).toHaveCSS('width', '32px');
  await expect(page.locator('.fdoc-info-block__title')).toHaveCSS('font-size', '14px');
  await expect(page.locator('.fdoc-info-block__title')).toHaveCSS('line-height', '20px');
});

test('InfoBlock vertical geometry matches Figma at 288px', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--narrow-container&viewMode=story');
  const block = page.getByTestId('info-block');

  await expect(block).toHaveAttribute('data-actions-layout', 'vertical');
  expect((await block.boundingBox())!.height).toBe(118);

  const blockBox = (await block.boundingBox())!;
  const copyBox = (await page.locator('.fdoc-info-block__copy').boundingBox())!;
  const actions = page.locator('.fdoc-info-block__actions');
  const actionsBox = (await actions.boundingBox())!;
  const firstButtonBox = (await actions.locator('.fdoc-button').first().boundingBox())!;

  expect(copyBox.height).toBe(62);
  expect(actionsBox.height).toBe(40);
  expect(actionsBox.y - (copyBox.y + copyBox.height)).toBe(8);
  expect(firstButtonBox.x - blockBox.x).toBe(48);
  expect(blockBox.y + blockBox.height - (firstButtonBox.y + firstButtonBox.height)).toBe(12);
});

test('InfoBlock single-line horizontal anatomy has no extra bottom space', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--title-only&viewMode=story');
  const block = page.getByTestId('info-block');

  await expect(block).toHaveAttribute('data-actions-layout', 'horizontal');
  expect((await block.boundingBox())!.height).toBe(48);

  const titleBox = (await block.locator('.fdoc-info-block__title').boundingBox())!;
  const iconBox = (await block.getByTestId('info-block-icon').locator('.fdoc-icon').boundingBox())!;
  const buttonBox = (await block.locator('.fdoc-info-block__actions .fdoc-button').first().boundingBox())!;
  const closeBox = (await block.getByTestId('info-block-close').boundingBox())!;
  const blockBox = (await block.boundingBox())!;
  const titleCenter = titleBox.y + titleBox.height / 2;

  expect(Math.abs(titleCenter - (iconBox.y + iconBox.height / 2))).toBeLessThanOrEqual(0.5);
  expect(Math.abs(titleCenter - (buttonBox.y + buttonBox.height / 2))).toBeLessThanOrEqual(0.5);
  expect(titleCenter - (closeBox.y + closeBox.height / 2)).toBe(4);
  expect(blockBox.y + blockBox.height - (buttonBox.y + buttonBox.height)).toBe(8);
});

test('InfoBlock switches both ways without moving the text row', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--wide-container&viewMode=story&args=text:;title:Title');
  const host = page.locator('body > #storybook-root > div').first();
  const block = page.getByTestId('info-block');
  const title = block.locator('.fdoc-info-block__title');

  const relativeTitleTop = async () => {
    const blockBox = (await block.boundingBox())!;
    const titleBox = (await title.boundingBox())!;
    return titleBox.y - blockBox.y;
  };

  await expect(block).toHaveAttribute('data-actions-layout', 'horizontal');
  const horizontalTop = await relativeTitleTop();
  expect((await block.boundingBox())!.height).toBe(48);

  await host.evaluate(el => { (el as HTMLElement).style.width = '288px'; });
  await expect(block).toHaveAttribute('data-actions-layout', 'vertical');
  expect(await relativeTitleTop()).toBeCloseTo(horizontalTop, 1);
  expect((await block.boundingBox())!.height).toBe(96);
  const verticalButton = (await block.locator('.fdoc-info-block__actions .fdoc-button').first().boundingBox())!;
  const verticalBlock = (await block.boundingBox())!;
  expect(verticalBlock.y + verticalBlock.height - (verticalButton.y + verticalButton.height)).toBe(12);

  await host.evaluate(el => { (el as HTMLElement).style.width = '640px'; });
  await expect(block).toHaveAttribute('data-actions-layout', 'horizontal');
  expect(await relativeTitleTop()).toBeCloseTo(horizontalTop, 1);
  expect((await block.boundingBox())!.height).toBe(48);
});

test('InfoBlock aligns vertical actions with text when the left icon is hidden', async ({ page }) => {
  await page.setViewportSize({ width: 288, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--without-icon&viewMode=story');
  const block = page.getByTestId('info-block');
  await expect(block).toHaveAttribute('data-actions-layout', 'vertical');
  const blockBox = (await block.boundingBox())!;
  const buttonBox = (await block.locator('.fdoc-info-block__actions .fdoc-button').first().boundingBox())!;
  expect(buttonBox.x - blockBox.x).toBe(16);
});

test('InfoBlock without actions keeps the Figma text geometry', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--title-only&viewMode=story&args=actionsCount:none');
  const block = page.getByTestId('info-block');
  await expect(block).toHaveAttribute('data-actions-layout', 'none');
  await expect(block.locator('.fdoc-info-block__actions')).toHaveCount(0);
  expect((await block.boundingBox())!.height).toBe(48);
});

test('InfoBlock long content stays inside the component', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--long-content&viewMode=story');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

for (const width of [320, 288, 256, 240]) {
  test(`InfoBlock keeps anatomy inside at ${width}px container`, async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto('/iframe.html?id=components-elements-infoblock--narrow-container&viewMode=story');
    const host = page.locator('body > #storybook-root > div').first();
    await host.evaluate((el, value) => { (el as HTMLElement).style.width = `${value}px`; }, width);
    const block = page.getByTestId('info-block');
    await expect(block).toHaveAttribute('data-actions-layout', 'vertical');
    const blockBox = (await block.boundingBox())!;
    for (const locator of [
      page.getByTestId('info-block-icon'),
      page.locator('.fdoc-info-block__copy'),
      page.getByTestId('info-block-close'),
      page.locator('.fdoc-info-block__actions'),
    ]) {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(blockBox.x - 0.5);
      expect(box!.x + box!.width).toBeLessThanOrEqual(blockBox.x + blockBox.width + 0.5);
    }
    expect(await block.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(Math.ceil(blockBox.width));
  });
}

test('InfoBlock action colors match Figma for Base and Inverse', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-infoblock--colors&viewMode=story');

  const base = page.locator('.fdoc-info-block--base');
  const baseButtons = base.locator('.fdoc-info-block__actions .fdoc-button');
  await expect(baseButtons.nth(0)).toHaveClass(/fdoc-button--secondary/);
  await expect(baseButtons.nth(1)).toHaveClass(/fdoc-button--tertiary/);

  const inverse = page.locator('.fdoc-info-block--inverse');
  const inverseButtons = inverse.locator('.fdoc-info-block__actions .fdoc-button');
  await expect(inverseButtons.nth(0)).toHaveClass(/fdoc-button--secondary/);
  await expect(inverseButtons.nth(1)).toHaveClass(/fdoc-button--inverse/);

  const inverseText = await inverseButtons.nth(1).evaluate(el => getComputedStyle(el).color);
  const expectedInverseText = await inverse.evaluate(el => getComputedStyle(el).color);
  expect(inverseText).toBe(expectedInverseText);
});

test('InfoBlock semantic colors remain readable in dark theme', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-infoblock--colors&viewMode=story');
  await page.evaluate(() => document.documentElement.setAttribute('data-color-mode', 'dark'));
  for (const block of await page.locator('.fdoc-info-block').all()) {
    await expect(block).toBeVisible();
    const background = await block.evaluate(el => getComputedStyle(el).backgroundColor);
    const text = await block.evaluate(el => getComputedStyle(el).color);
    expect(background).not.toBe(text);
  }
});
