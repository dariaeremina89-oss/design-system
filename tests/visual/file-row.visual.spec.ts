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


test('FileRow additional components preserve their own geometry', async ({ page }) => {
  await page.setViewportSize({ width: 456, height: 900 });
  await page.goto('/iframe.html?id=components-elements-filerow--additional-content&viewMode=story');

  const badgeExample = page.getByTestId('file-row-example-badge');
  const chipsExample = page.getByTestId('file-row-example-chips');
  const badge = page.getByTestId('file-row-additional-badge');
  const chips = page.getByTestId('file-row-additional-chips');

  await expect(badge).toBeVisible();
  await expect(chips).toBeVisible();
  await expect(badge).toHaveCSS('height', '20px');
  await expect(chips).toHaveCSS('height', '24px');
  await expect(badge).toHaveAttribute('data-badge-color', 'primary');
  await expect(chips).toHaveAttribute('data-color', 'base');

  for (const example of [badgeExample, chipsExample]) {
    const row = example.getByTestId('file-row');
    const name = row.locator('.fdoc-file-item__name');
    expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }

  await page.setViewportSize({ width: 320, height: 900 });
  await expect(chips).toBeVisible();
  await expect(chips).toHaveCSS('height', '24px');
  expect(await chipsExample.getByTestId('file-row').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('FileRow reorder moves the actual row, not only the drop indicator', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-elements-filerow--reorderable&viewMode=story');

  const names = page.locator('[data-testid^="reorder-row-"] .fdoc-file-item__name');
  await expect(names).toHaveText(['Договор.pdf', 'Заявление.pdf', 'Согласие.pdf']);

  const source = page.getByTestId('file-row-reorder-handle').first();
  const target = page.getByTestId('reorder-row-agreement');
  await source.dragTo(target);

  await expect(names).toHaveText(['Заявление.pdf', 'Согласие.pdf', 'Договор.pdf']);
});
