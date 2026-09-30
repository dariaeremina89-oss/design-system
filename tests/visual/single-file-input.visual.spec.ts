import { expect, test } from '@playwright/test';

const storyUrl = '/iframe.html?id=components-inputs-singlefileinput--default&viewMode=story';

test('SingleFileInput switches to the mobile action when its container becomes narrow', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto(storyUrl);

  const root = page.getByTestId('single-file-input');
  const desktopAction = root.locator('.fdoc-single-file-input__pick-desktop');
  const mobileAction = root.locator('.fdoc-single-file-input__pick-mobile');

  await expect(root).toBeVisible();
  await expect(desktopAction).toBeVisible();
  await expect(mobileAction).toBeHidden();

  await page.setViewportSize({ width: 375, height: 600 });

  await expect(desktopAction).toBeHidden();
  await expect(mobileAction).toBeVisible();
  await expect(mobileAction.getByRole('button', { name: 'Загрузить' })).toHaveAttribute('data-button-icon-size', '32');

  expect(await root.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
