import { expect, test } from '@playwright/test';

const story = (name: string) => '/iframe.html?id=components-overlays-bottomsheet--' + name + '&viewMode=story';

for (const width of [360, 320]) {
  test('BottomSheet matches mobile geometry at ' + width + 'px', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 640 });
    await page.goto(story('default'));
    const trigger = page.getByRole('button', { name: 'Открыть Bottom Sheet' });
    await trigger.click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    const box = await sheet.boundingBox();
    expect(Math.round(box!.width)).toBe(width);
    expect(Math.round(box!.x)).toBe(0);
    expect(Math.round(box!.y + box!.height)).toBe(640);
    await expect(sheet).toHaveCSS('border-top-left-radius', '16px');
    await expect(sheet).toHaveCSS('border-top-right-radius', '16px');

    const handle = page.getByTestId('bottom-sheet-handle');
    const handleBox = await handle.boundingBox();
    expect(Math.round(handleBox!.x)).toBe(16);
    expect(Math.round(handleBox!.width)).toBe(width - 32);
    expect(Math.round(handleBox!.height)).toBe(28);
    const content = page.getByTestId('bottom-sheet-content');
    const contentBox = await content.boundingBox();
    expect(Math.round(contentBox!.x)).toBe(16);
    expect(Math.round(contentBox!.width)).toBe(width - 32);
    const footer = page.getByTestId('bottom-sheet-footer');
    const footerBox = await footer.boundingBox();
    expect(Math.round(footerBox!.x)).toBe(16);
    expect(Math.round(footerBox!.width)).toBe(width - 32);
    const bar = handle.locator('.fdoc-bottom-sheet__handle-bar');
    expect(Math.round((await bar.boundingBox())!.width)).toBe(32);
    expect(Math.round((await bar.boundingBox())!.height)).toBe(4);

    await page.keyboard.press('Escape');
    await expect(sheet).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test('Content scrolls while Handle and Buttons stay fixed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(story('scroll'));
  await page.getByRole('button', { name: 'Открыть Bottom Sheet' }).click();

  const sheet = page.getByRole('dialog');
  const content = page.getByTestId('bottom-sheet-content');
  const handle = page.getByTestId('bottom-sheet-handle');
  const footer = page.getByTestId('bottom-sheet-footer');
  const scrollbar = page.getByTestId('bottom-sheet-scrollbar');

  expect(await content.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  await expect(scrollbar).toHaveAttribute('data-visible', 'true');
  const handleY = (await handle.boundingBox())!.y;
  const footerY = (await footer.boundingBox())!.y;

  await content.evaluate(node => { node.scrollTop = node.scrollHeight; });
  expect((await handle.boundingBox())!.y).toBe(handleY);
  expect((await footer.boundingBox())!.y).toBe(footerY);
  expect((await sheet.boundingBox())!.y).toBeGreaterThanOrEqual(44);
});

test('Scrim closes, no-Scrim leaves background interactive, swipe closes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto(story('default'));
  await page.getByRole('button', { name: 'Открыть Bottom Sheet' }).click();
  await page.getByTestId('bottom-sheet-scrim').click({ position: { x: 4, y: 4 } });
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.goto(story('without-scrim'));
  await page.getByRole('button', { name: 'Открыть Bottom Sheet' }).click();
  await page.getByRole('button', { name: 'Фоновое действие 0' }).click();
  await expect(page.getByRole('button', { name: 'Фоновое действие 1' })).toBeVisible();

  const handle = page.getByTestId('bottom-sheet-handle');
  const box = await handle.boundingBox();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  await page.evaluate(({ x, y }) => {
    const target = document.querySelector('[data-testid="bottom-sheet-handle"]');
    if (!target) throw new Error('Bottom Sheet handle not found');
    const touch = (clientY: number) => new Touch({
      identifier: 1,
      target,
      clientX: x,
      clientY,
      radiusX: 1,
      radiusY: 1,
      force: 1,
    });
    target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch(y)] }));
    target.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [touch(y + 120)] }));
    target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [] }));
  }, { x, y });
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
