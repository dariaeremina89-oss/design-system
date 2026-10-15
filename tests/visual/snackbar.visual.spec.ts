import { test, expect } from '@playwright/test';

test('Snackbar matches the base geometry and semantic colors', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-snackbar--types&viewMode=story');
  const snacks = page.getByTestId('snackbar');
  await expect(snacks).toHaveCount(3);
  const metrics = await snacks.evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node), box = node.getBoundingClientRect();
    const icon = node.querySelector('.fdoc-icon')!;
    return { width: box.width, height: box.height, background: css.backgroundColor, color: css.color,
      iconWidth: icon.getBoundingClientRect().width, iconColor: getComputedStyle(icon).color };
  }));
  expect(metrics[0].width).toBe(288); expect(metrics[0].height).toBe(48);
  expect(new Set(metrics.map(x => x.background)).size).toBe(1);
  expect(new Set(metrics.map(x => x.iconColor)).size).toBe(3);
  expect(metrics.every(x => x.iconWidth === 24)).toBe(true);
});
test('Snackbar wraps long content without covering close or overflowing mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/iframe.html?id=components-elements-snackbar--unbroken-text&viewMode=story');
  await expect(page.getByTestId('snackbar-close')).toBeVisible();
  const metrics = await page.getByTestId('snackbar').evaluate(node => {
    const text = node.querySelector('.fdoc-snackbar__text')!.getBoundingClientRect();
    const close = node.querySelector('.fdoc-snackbar__close')!.getBoundingClientRect();
    return { overlap: text.right > close.left, overflow: document.documentElement.scrollWidth > innerWidth,
      size: getComputedStyle(node.querySelector('.fdoc-snackbar__text')!).fontSize };
  });
  expect(metrics).toEqual({ overlap: false, overflow: false, size: '14px' });
});
test('Snackbar stack places newest at bottom and actions remove only their own item', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=components-elements-snackbar--stack&viewMode=story');
  const add = page.getByRole('button', { name: 'Добавить уведомление' });
  await add.click(); await add.click();
  await expect(page.getByTestId('snackbar')).toHaveCount(2);
  await page.getByTestId('snackbar-stack').hover();
  const boxes = await page.getByTestId('snackbar').evaluateAll(nodes => nodes.map(x => { const r = x.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; }));
  expect(boxes[1].top - boxes[0].bottom).toBeCloseTo(8, 0);
  await page.getByRole('button', { name: 'Отменить' }).first().click();
  await expect(page.getByTestId('snackbar')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('Шаблон 2 удален');
});
