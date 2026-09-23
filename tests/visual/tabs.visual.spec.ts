import { expect, test } from '@playwright/test';

test('Tabs enables overflow arrows only when items do not fit the container', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-navigation-tabs--adaptive-overflow&viewMode=story');

  const slider = page.getByRole('slider', { name: 'Ширина контейнера Tabs' });
  const left = page.getByRole('button', { name: 'Прокрутить вкладки влево' });
  const right = page.getByRole('button', { name: 'Прокрутить вкладки вправо' });
  const bar = page.locator('.fdoc-tabs__bar');

  await expect(slider).toHaveValue('900');
  await expect(left).toHaveCount(0);
  await expect(right).toHaveCount(0);
  await expect(bar).not.toHaveAttribute('data-scrollable', 'true');

  await slider.fill('360');

  await expect(left).toBeVisible();
  await expect(right).toBeVisible();
  await expect(left).toBeDisabled();
  await expect(right).toBeEnabled();
  await expect(bar).toHaveAttribute('data-scrollable', 'true');

  const leftBox = await left.boundingBox();
  const rightBox = await right.boundingBox();
  expect(leftBox?.width).toBe(32);
  expect(leftBox?.height).toBe(48);
  expect(rightBox?.width).toBe(32);
  expect(rightBox?.height).toBe(48);

  await right.click();
  await expect(left).toBeEnabled();

  await slider.fill('900');

  await expect(left).toHaveCount(0);
  await expect(right).toHaveCount(0);
  await expect(bar).not.toHaveAttribute('data-scrollable', 'true');
});
