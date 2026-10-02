import { expect, test } from '@playwright/test';

test('InfoBlock follows Figma geometry and tokens', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-infoblock--default&viewMode=story');
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

test('InfoBlock actions wrap below automatically in a narrow container', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--narrow-container&viewMode=story');
  const copyBox = await page.locator('.fdoc-info-block__copy').boundingBox();
  const actionsBox = await page.locator('.fdoc-info-block__actions').boundingBox();
  expect(copyBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(actionsBox!.y).toBeGreaterThanOrEqual(copyBox!.y + copyBox!.height - 1);
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
    await page.goto('/iframe.html?id=components-elements-infoblock--narrow-container&viewMode=story');
    const host = page.locator('body > #storybook-root > div').first();
    await host.evaluate((el, value) => { (el as HTMLElement).style.width = `${value}px`; }, width);
    const block = page.getByTestId('info-block');
    const blockBox = await block.boundingBox();
    expect(blockBox).not.toBeNull();
    for (const locator of [page.getByTestId('info-block-icon'), page.locator('.fdoc-info-block__copy'), page.getByTestId('info-block-close')]) {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(blockBox!.x);
      expect(box!.x + box!.width).toBeLessThanOrEqual(blockBox!.x + blockBox!.width + 0.5);
    }
    expect(await block.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(Math.ceil(blockBox!.width));
  });
}

test('InfoBlock actions stay at the top when there is enough width', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--wide-container&viewMode=story');
  const copyBox = await page.locator('.fdoc-info-block__copy').boundingBox();
  const actionsBox = await page.locator('.fdoc-info-block__actions').boundingBox();
  expect(copyBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(Math.abs(actionsBox!.y - copyBox!.y)).toBeLessThanOrEqual(6);
});

test('InfoBlock copy does not jump when actions wrap from horizontal to vertical', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-elements-infoblock--wide-container&viewMode=story&args=text:;title:Title');
  const host = page.locator('body > #storybook-root > div').first();
  const block = page.getByTestId('info-block');
  const line = block.locator('.fdoc-info-block__title');
  const relativeTop = async () => {
    const blockBox = (await block.boundingBox())!;
    const lineBox = (await line.boundingBox())!;
    return lineBox.y - blockBox.y;
  };
  const wideTop = await relativeTop();
  await host.evaluate(el => { (el as HTMLElement).style.width = '288px'; });
  const actionsBox = (await block.locator('.fdoc-info-block__actions').boundingBox())!;
  const copyBox = (await block.locator('.fdoc-info-block__copy').boundingBox())!;
  expect(actionsBox.y).toBeGreaterThanOrEqual(copyBox.y + copyBox.height - 0.5);
  expect(await relativeTop()).toBeCloseTo(wideTop, 1);
});

for (const [story, visible, absent] of [
  ['title-only', 'title', 'text'],
  ['text-only', 'text', 'title'],
] as const) {
  test(`InfoBlock ${story} keeps its icon beside copy when actions wrap`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/iframe.html?id=components-elements-infoblock--${story}&viewMode=story`);
    const block = page.getByTestId('info-block');
    await expect(block).toBeVisible();
    const main = (await block.locator('.fdoc-info-block__main').boundingBox())!;
    const icon = (await block.getByTestId('info-block-icon').boundingBox())!;
    const copy = (await block.locator('.fdoc-info-block__copy').boundingBox())!;
    const actions = (await block.locator('.fdoc-info-block__actions').boundingBox())!;
    expect(icon.y - main.y).toBe(8);
    expect(actions.y).toBeGreaterThanOrEqual(copy.y + copy.height - 0.5);
  });
  test(`InfoBlock ${story} has one copy row without a hidden slot`, async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto(`/iframe.html?id=components-elements-infoblock--${story}&viewMode=story`);
    const block = page.getByTestId('info-block');
    await expect(block).toBeVisible();
    await expect(block.locator(`.fdoc-info-block__${visible}`)).toBeVisible();
    await expect(block.locator(`.fdoc-info-block__${absent}`)).toHaveCount(0);
    const copy = block.locator('.fdoc-info-block__copy');
    expect((await copy.boundingBox())!.height).toBe(40);
    const main = block.locator('.fdoc-info-block__main');
    const actions = block.locator('.fdoc-info-block__actions');
    expect((await main.boundingBox())!.height).toBe((await actions.boundingBox())!.height);
    const mainBox = (await main.boundingBox())!;
    const copyBox = (await copy.boundingBox())!;
    expect(copyBox.y - mainBox.y).toBeCloseTo(0, 1);
    const lineBox = (await block.locator(`.fdoc-info-block__${visible}`).boundingBox())!;
    const iconBox = (await block.getByTestId('info-block-icon').boundingBox())!;
    expect(Math.abs((lineBox.y + lineBox.height / 2) - (iconBox.y + iconBox.height / 2))).toBeLessThanOrEqual(0.5);
    // Without actions, only the visible row and the existing copy/root padding remain.
    await page.goto(`/iframe.html?id=components-elements-infoblock--${story}&viewMode=story&args=actionsCount:none`);
    await expect(block.locator('.fdoc-info-block__actions')).toHaveCount(0);
    expect((await block.boundingBox())!.height).toBe(50);
  });
}
