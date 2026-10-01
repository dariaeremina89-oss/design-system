import { expect, test, type Page } from '@playwright/test';

const openStory = async (page: Page, storyId: string) => {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  const root = page.locator('#storybook-root');
  await expect(root).toBeVisible();
  return root;
};

test('Linear determinate keeps Figma geometry and ARIA value', async ({ page }) => {
  const root = await openStory(page, 'components-indicators-linearprogress--linear-modes');
  const linear = root.locator('[data-progress-type="linear"]').first();

  await expect(linear).toHaveCSS('height', '4px');
  await expect(linear).toHaveCSS('border-radius', '8px');
  await expect(linear).toHaveAttribute('aria-valuenow', '60');
});

test('Circular indeterminate uses the shared animation and is accessible', async ({ page }) => {
  const root = await openStory(page, 'components-progress-indicators-progressindicator--circular-modes');
  const circular = root.locator('[data-progress-type="circular"]').nth(1);

  await expect(circular).toHaveAttribute('role', 'progressbar');
  await expect(circular).not.toHaveAttribute('aria-valuenow');
  await expect(circular.locator('.fdoc-progress__indicator')).toHaveCSS('stroke-width', '2px');
});

test('Circular defaults to 24px and uses MUI-style rotate and dash motion', async ({ page }) => {
  const root = await openStory(page, 'components-progress-indicators-progressindicator--circular-props');
  const circular = root.getByRole('progressbar');
  const svg = circular.locator('.fdoc-progress__circular-svg');
  const track = circular.locator('.fdoc-progress__track');
  const arc = circular.locator('.fdoc-progress__indicator');

  await expect(circular).toHaveCSS('width', '24px');
  await expect(circular).toHaveCSS('height', '24px');
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(svg).toHaveCSS('animation-name', 'fdoc-progress-circular-rotate');
  await expect(svg).toHaveCSS('animation-duration', '1.4s');
  await expect(svg).toHaveCSS('animation-timing-function', 'linear');
  await expect(arc).toHaveCSS('animation-name', 'fdoc-progress-circular-dash');
  await expect(arc).toHaveCSS('animation-duration', '1.4s');
  await expect(arc).toHaveCSS('animation-timing-function', 'ease-in-out');

  const dashMotion = await circular.evaluate((element) => {
    const styles = getComputedStyle(element as HTMLElement);
    return {
      initial: styles.getPropertyValue('--fdoc-progress-dash-initial').trim(),
      long: styles.getPropertyValue('--fdoc-progress-dash-long').trim(),
      gap: styles.getPropertyValue('--fdoc-progress-dash-gap').trim(),
    };
  });

  expect(parseFloat(dashMotion.long)).toBeGreaterThan(parseFloat(dashMotion.initial));
  expect(parseFloat(dashMotion.gap)).toBeGreaterThan(parseFloat(dashMotion.long));
});

test('Circular Secondary and Tertiary resolve the Figma colors', async ({ page }) => {
  const root = await openStory(page, 'components-progress-indicators-progressindicator--circular-colors');
  const secondary = root.locator('[data-progress-variant="secondary"]');
  const tertiary = root.locator('[data-progress-variant="tertiary"]');
  await expect(secondary.locator('.fdoc-progress__track')).toHaveCSS('stroke', 'rgb(248, 248, 249)');
  await expect(secondary.locator('.fdoc-progress__indicator')).toHaveCSS('stroke', 'rgb(37, 39, 44)');
  await expect(tertiary.locator('.fdoc-progress__track')).toHaveCSS('stroke', 'rgb(71, 75, 83)');
  await expect(tertiary.locator('.fdoc-progress__indicator')).toHaveCSS('stroke', 'rgb(255, 255, 255)');
});
