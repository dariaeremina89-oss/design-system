import { expect, test, type Locator } from '@playwright/test';

const samples = [
  ['components-buttons-button--all-sizes-with-elements', '.fdoc-button__text, .fdoc-badge'],
  ['components-actions-buttontoggle--default', '.fdoc-button__text'],
  ['components-actions-link--sizes', '.fdoc-link'],
  ['components-actions-buttonlink--sizes', '.fdoc-link'],
  ['components-selection-checkbox--default', '.fdoc-control__label, .fdoc-control__description'],
  ['components-selection-radio--default', '.fdoc-control__label, .fdoc-control__description'],
  ['components-selection-switch--default', '.fdoc-control__label, .fdoc-control__description'],
  ...['checkboxgroup', 'radiogroup', 'switchgroup'].map(name => [`components-selection-${name}--error`, '.fdoc-selection-group__label, .fdoc-selection-group__description, .fdoc-selection-group__error, .fdoc-control__label, .fdoc-control__description']),
  ['components-navigation-accordion--expanded', '.fdoc-accordion__title, .fdoc-accordion__description, .fdoc-accordion__content'],
  ['components-navigation-accordion--large', '.fdoc-accordion__title, .fdoc-accordion__description'],
  ['components-navigation-breadcrumbs--default', '.fdoc-breadcrumbs'],
  ['components-navigation-pagination--default', '.fdoc-pagination__counter, .fdoc-button__text, .fdoc-pagination__ellipsis'],
  ['components-navigation-tabs--default', '.fdoc-tab__label'],
  ['components-inputs-input--default', '.fdoc-input input, .fdoc-field__label'],
  ['components-inputs-textarea--default', 'textarea'],
  ['components-badge--all-sizes', '.fdoc-badge'],
  ['components-overlays-tooltip--at-edge', '.fdoc-tooltip'],
];

async function typography(elements: Locator) {
  return elements.evaluateAll(nodes => [...new Map(nodes.map(node => {
    const css = getComputedStyle(node);
    const value = { size: css.fontSize, line: css.lineHeight, family: css.fontFamily, weight: css.fontWeight };
    return [JSON.stringify(value), value];
  })).values()]);
}

for (const [story, selector] of samples) {
  test(`${story}: component typography stays constant`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    if (story.includes('tooltip')) await page.getByRole('button').focus();
    const elements = page.locator(selector);
    await expect(elements.first()).toBeVisible();
    const desktop = await typography(elements);
    for (const width of [768, 767, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => typography(elements)).toEqual(desktop);
    }
  });
}

test('only responsive page text selects the existing Mobile style', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-typography--application&viewMode=story');
  const styles = [
    ['h0-heading', 40, 48, 32, 40], ['h1-heading', 32, 40, 24, 32],
    ['h2-heading', 24, 32, 20, 28], ['h3-heading', 20, 28, 16, 24],
    ['subtitle', 16, 24, 14, 20], ['body', 14, 20, 12, 16],
    ['caption', 12, 16, 10, 14], ['overline', 10, 14, 9, 12], ['code', 14, 20, 12, 16],
  ] as const;
  for (const width of [1280, 768, 767, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, size, line, mobileSize, mobileLine] of styles) {
      const fixed = page.getByTestId(`fixed-${name}`), responsive = page.getByTestId(`responsive-${name}`);
      await expect(fixed).toHaveCSS('font-size', `${size}px`);
      await expect(fixed).toHaveCSS('line-height', `${line}px`);
      await expect(responsive).toHaveCSS('font-size', `${width < 768 ? mobileSize : size}px`);
      await expect(responsive).toHaveCSS('line-height', `${width < 768 ? mobileLine : line}px`);
      expect(await typography(responsive.getByRole('link'))).toEqual(await typography(responsive));
    }
    const container = page.getByTestId('responsive-container');
    await expect(container.locator('.fdoc-button__text')).toHaveCSS('font-size', '16px');
    await expect(container.getByRole('link')).toHaveCSS('font-size', '16px');
  }
});

for (const component of ['link', 'buttonlink']) {
  test(`${component}: inherited paragraph typography and icon scale`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-actions-${component}--in-paragraph&viewMode=story`);
    for (const width of [1280, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const size = width > 767 ? '16px' : '14px';
      const link = page.getByTestId('paragraph-link');
      await expect(link).toHaveCSS('font-size', size);
      await expect(link).toHaveCSS('font-style', 'italic');
      expect(await typography(link)).toEqual(await typography(page.getByTestId('adaptive-paragraph')));
      await expect(link).toHaveCSS('display', 'inline');
      await expect(page.getByTestId('paragraph-icon-link').locator('.fdoc-icon')).toHaveCSS('width', size);
      await expect(page.getByTestId('fixed-link')).toHaveCSS('font-size', '16px');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}
