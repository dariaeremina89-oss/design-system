import { expect, test } from '@playwright/test';

const defaultStoryUrl = '/iframe.html?id=components-elements-filerow--default&viewMode=story';
const chipsStoryUrl = '/iframe.html?id=components-elements-filerow--long-file-name-with-chips&viewMode=story';
const skeletonStoryUrl = '/iframe.html?id=components-elements-filerow--skeleton&viewMode=story';

for (const width of [456, 320]) {
  test(`FileRow keeps filename and weight visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 400 });
    await page.goto(defaultStoryUrl);

    const row = page.getByTestId('file-row');
    const name = row.locator('.fdoc-file-item__name');
    const weight = row.locator('.fdoc-file-item__additional-text');

    await expect(row).toBeVisible();
    await expect(name).toBeVisible();
    await expect(name).toHaveText('File name.png');
    await expect(weight).toBeVisible();
    await expect(weight).toHaveText('2,7 МБ');

    expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await weight.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}

test('FileRow keeps long filename, Chips and trailing action inside a 320px row', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto(chipsStoryUrl);

  const row = page.getByTestId('file-row');
  const name = row.locator('.fdoc-file-item__name');
  const chips = row.getByTestId('chips');

  await expect(row).toBeVisible();
  await expect(name).toBeVisible();
  await expect(chips).toBeVisible();
  expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
  expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await chips.evaluate(element => element.getBoundingClientRect().right <= element.closest('.fdoc-file-item')!.getBoundingClientRect().right + 0.5)).toBe(true);
});

for (const [viewport, expectedWidth] of [[1280, 456], [320, 288]] as const) {
  test(`FileRow skeleton keeps the story reference width at ${viewport}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 400 });
    await page.goto(skeletonStoryUrl);

    const skeleton = page.getByTestId('file-row-skeleton');
    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveCSS('height', '48px');
    expect(Math.round((await skeleton.boundingBox())!.width)).toBe(expectedWidth);
  });
}
