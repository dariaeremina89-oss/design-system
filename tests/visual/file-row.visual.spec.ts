import { expect, test } from '@playwright/test';

const storyUrl = '/iframe.html?id=components-elements-filerow--default&viewMode=story';

for (const width of [456, 320]) {
  test(`FileRow keeps filename and weight visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 400 });
    await page.goto(storyUrl);

    const row = page.getByTestId('file-row');
    const name = row.locator('.fdoc-file-item__name');
    const weight = row.locator('.fdoc-file-item__additional');

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
