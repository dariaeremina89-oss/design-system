import { expect, test, type Locator } from '@playwright/test';

async function setRangeValue(slider: Locator, value: number) {
  await slider.evaluate((node, nextValue) => {
    const input = node as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, String(nextValue));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

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

  await setRangeValue(slider, 360);
  await expect(slider).toHaveValue('360');

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

  await setRangeValue(slider, 900);
  await expect(slider).toHaveValue('900');

  await expect(left).toHaveCount(0);
  await expect(right).toHaveCount(0);
  await expect(bar).not.toHaveAttribute('data-scrollable', 'true');
});
