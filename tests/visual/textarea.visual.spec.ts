import { expect, test } from '@playwright/test';

for (const [story, height] of [['default', 112], ['small', 48]] as const) {
  test(`Textarea ${story}: geometry, typography, hover and stable focus`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-inputs-textarea--${story}&viewMode=story`);
    const input = page.getByRole('textbox'); await expect(input).toBeVisible();
    const before = await input.boundingBox(); expect(before?.height).toBe(height);
    await expect(input).toHaveCSS('font-size', '16px'); await expect(input).toHaveCSS('line-height', '24px');
    await expect(input).toHaveCSS('border-radius', '8px');
    const origin = await input.evaluate(el => { const c = getComputedStyle(el); return [parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth), parseFloat(c.paddingTop) + parseFloat(c.borderTopWidth)]; });
    await input.hover(); await expect(input).toHaveCSS('border-color', 'rgb(85, 89, 99)');
    await input.focus(); await expect(input).toHaveCSS('border-width', '2px');
    expect(await input.boundingBox()).toEqual(before);
    expect(await input.evaluate(el => { const c = getComputedStyle(el); return [parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth), parseFloat(c.paddingTop) + parseFloat(c.borderTopWidth)]; })).toEqual(origin);
  });
}

test('Textarea Error + Disabled uses the Figma disabled error palette', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--error-disabled&viewMode=story');
  const input = page.getByRole('textbox'); await expect(input).toBeDisabled();
  await expect(input).toHaveCSS('border-color', 'rgb(241, 143, 177)');
  await expect(page.getByTestId('textarea-label')).toHaveCSS('color', 'rgb(241, 143, 177)');
  await expect(page.getByTestId('textarea-error')).toHaveCSS('color', 'rgb(241, 143, 177)');
  await expect(input).toHaveCSS('color', 'rgb(112, 116, 124)');
  await expect(page.getByTestId('textarea-counter')).toHaveCSS('color', 'rgb(207, 209, 211)');
});

test('Textarea focused error retains error border', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--error&viewMode=story');
  const input = page.getByRole('textbox'); await input.focus();
  await expect(input).toHaveCSS('border-width', '2px');
  await expect(input).toHaveCSS('border-color', 'rgb(224, 0, 77)');
});

test('Textarea wraps long text on a narrow screen without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/iframe.html?id=components-inputs-textarea--long-text&viewMode=story');
  const input = page.getByRole('textbox'); await expect(input).toBeVisible();
  expect(await input.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(input).toHaveCSS('font-size', '16px');
});

test('Textarea scrolls overflowing text without growing', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--overflow&viewMode=story');
  const input = page.getByRole('textbox'); await expect(input).toBeVisible();
  expect(await input.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  const before = await input.boundingBox();
  await input.fill('Новая строка\n'.repeat(50));
  expect(await input.boundingBox()).toEqual(before);
  await input.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await input.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
});

test('Textarea native resize changes only height and is disabled when disabled', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--resize&viewMode=story');
  const input = page.getByRole('textbox'); await expect(input).toBeVisible();
  await expect(input).toHaveCSS('resize', 'vertical');
  const box = (await input.boundingBox())!;
  await page.mouse.move(box.x + box.width - 3, box.y + box.height - 3);
  await page.mouse.down(); await page.mouse.move(box.x + box.width + 30, box.y + box.height + 70, { steps: 8 }); await page.mouse.up();
  const after = (await input.boundingBox())!;
  expect(after.height).toBeGreaterThan(box.height); expect(after.width).toBe(box.width);
  await page.goto('/iframe.html?id=components-inputs-textarea--disabled&viewMode=story');
  await expect(page.getByRole('textbox')).toHaveCSS('resize', 'none');
});

test('Textarea Enter inserts newline and Tab exits the field', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--default&viewMode=story');
  const input = page.getByRole('textbox'); await input.fill('Строка');
  await input.press('End'); await input.press('Enter'); await input.pressSequentially('Далее');
  await expect(input).toHaveValue('Строка\nДалее');
  await page.evaluate(() => { const button = document.createElement('button'); button.textContent = 'Далее'; document.querySelector('#storybook-root')!.append(button); });
  await input.press('Tab'); await expect(page.getByRole('button', { name: 'Далее', exact: true })).toBeFocused();
});

test('Textarea Docs include behavior, coverage and selectors', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--docs&viewMode=docs');
  await expect(page.getByRole('heading', { name: 'Автотесты', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Селекторы для тестирования/ })).toBeVisible();
});

test('Textarea state matrix renders skeletons and provides a review screenshot', async ({ page }, testInfo) => {
  await page.goto('/iframe.html?id=components-inputs-textarea--states&viewMode=story');
  await expect(page.getByTestId('textarea-skeleton')).toHaveCount(4);
  await expect(page.getByTestId('textarea-skeleton-text')).toHaveCount(2);
  await page.addStyleTag({ content: '* { animation: none !important; caret-color: transparent !important; }' });
  await page.screenshot({ path: testInfo.outputPath('textarea-states.png'), fullPage: true });
});
