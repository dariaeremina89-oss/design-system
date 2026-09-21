import { expect, test } from '@playwright/test';
import { expectColors } from './icon-button-contract';

test('ButtonFAB matches all color states, geometry and shadow', async ({ page }) => {
  await page.goto('/iframe.html?id=components-actions-buttonfab--states&viewMode=story');
  for (const color of ['primary', 'secondary', 'base', 'inverse'] as const) {
    for (const state of ['default', 'hover', 'focused', 'pressed', 'disabled']) {
      const button = page.getByTestId(`button-fab-${color}-${state}`);
      await expectColors(button, color, state);
      await expect(button).toHaveCSS('width', '64px');
      await expect(button).toHaveCSS('height', '64px');
      await expect(button).toHaveCSS('padding', '12px');
      await expect(button).toHaveCSS('border-radius', '9999px');
      await expect(button.locator('[data-icon]')).toHaveCSS('width', '40px');
      const shadow = await button.evaluate(el => {
        const probe = document.createElement('span');
        probe.style.boxShadow = 'var(--shadow-s)';
        el.appendChild(probe);
        const result = getComputedStyle(probe).boxShadow;
        probe.remove();
        return result;
      });
      await expect(button).toHaveCSS('box-shadow', shadow);
    }
    const skeleton = page.getByTestId(`button-fab-${color}-skeleton`);
    await expect(skeleton).toHaveCSS('width', '64px');
    await expect(skeleton).toHaveCSS('height', '64px');
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  }
});

test('ButtonFAB supports keyboard activation and skips disabled', async ({ page }) => {
  await page.goto('/iframe.html?id=components-actions-buttonfab--keyboard&viewMode=story');
  const button = page.getByRole('button', { name: 'Создать документ' });
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expectColors(button, 'primary', 'focused');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.locator('output')).toHaveText('Действий: 2');
  await page.goto('/iframe.html?id=components-actions-buttonfab--disabled&viewMode=story');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button')).toBeDisabled();
  await expect(page.getByRole('button')).not.toBeFocused();
});

test('Floating stays fixed on scroll and mobile outside a transformed parent', async ({ page }) => {
  await page.goto('/iframe.html?id=components-actions-buttonfab--floating&viewMode=story');
  const button = page.getByRole('button', { name: 'Создать документ' });
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(button).toHaveCSS('position', 'fixed');
    await expect(button).toHaveCSS('z-index', '200');
    const before = await button.boundingBox();
    expect(before?.x).toBe(width - 24 - 64);
    expect(before?.y).toBe(800 - 24 - 64);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(await button.boundingBox()).toEqual(before);
  }
});
