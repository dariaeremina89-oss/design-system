import { expect, test, type Locator } from '@playwright/test';

async function metrics(node: Locator) {
  return node.evaluate(el => ({
    line: getComputedStyle(el).height,
    bar: getComputedStyle(el, '::before').height,
    top: getComputedStyle(el, '::before').top,
  }));
}

for (const name of ['link', 'buttonlink']) {
  test(`${name} skeleton uses each size's text and icon slots`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-actions-${name}--skeleton-sizes&viewMode=story`);
    const rows = page.locator('.fdoc-link-skeleton');
    await expect(rows).toHaveCount(4);
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      for (const [index, line, bar, top, icon] of [[0,16,8,4,16],[1,20,10,5,20],[2,24,11,7,24],[3,24,11,7,28]]) {
        expect(await metrics(rows.nth(index).locator('.fdoc-skeleton--text'))).toEqual({line:`${line}px`,bar:`${bar}px`,top:`${top}px`});
        await expect(rows.nth(index).locator('.fdoc-skeleton--icon')).toHaveCSS('width', `${icon}px`);
      }
    }
    await expect(rows.locator('a,button')).toHaveCount(0);
  });

  test(`${name} paragraph skeleton follows the named adaptive style`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-actions-${name}--skeleton-in-paragraph&viewMode=story`);
    const skeleton = page.getByTestId('adaptive-paragraph').locator('.fdoc-skeleton--text');
    await expect(skeleton).toBeVisible();
    for (const [width,line,bar,top] of [[1280,24,11,7],[320,20,10,5]]) {
      await page.setViewportSize({width,height:800});
      await expect.poll(() => metrics(skeleton)).toEqual({line:`${line}px`,bar:`${bar}px`,top:`${top}px`});
      const paragraph = page.getByTestId('adaptive-paragraph');
      const height = (await paragraph.boundingBox())!.height;
      expect(height % line).toBe(0);
      await expect(paragraph.locator('.fdoc-link-skeleton')).toHaveCSS('vertical-align','top');
      const iconSkeletons = page.getByTestId('paragraph-icon-link').locator('.fdoc-link__skeleton-icon');
      await expect(iconSkeletons).toHaveCount(2);
      for (const icon of await iconSkeletons.all()) {
        await expect(icon).toHaveCSS('width',width > 767 ? '16px' : '14px');
        await expect(icon).toHaveCSS('height',width > 767 ? '16px' : '14px');
      }
    }
  });
}

for (const kind of ['checkbox', 'radio', 'switch']) {
  test(`${kind} group skeleton follows Figma typography and control geometry`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-selection-${kind}group--skeleton&viewMode=story`);
    const title = page.locator('.fdoc-selection-group__label .fdoc-skeleton');
    const label = page.locator('.fdoc-control__label .fdoc-skeleton').first();
    const description = page.locator('.fdoc-control__description .fdoc-skeleton').first();
    await expect(title).toBeVisible();
    for (const width of [1280, 320]) {
      await page.setViewportSize({width,height:800});
      expect(await metrics(title)).toEqual({line:'24px',bar:'11px',top:'7px'});
      expect(await metrics(label)).toEqual({line:'20px',bar:'10px',top:'5px'});
      expect(await metrics(description)).toEqual({line:'16px',bar:'8px',top:'4px'});
      await expect(title).toHaveCSS('width', '64px');
      await expect(label).toHaveCSS('width', '64px');
      await expect(description).toHaveCSS('width', '80px');
      const control = page.locator('.fdoc-control > .fdoc-skeleton').first();
      await expect(control).toHaveCSS('width', kind === 'switch' ? '36px' : '24px');
      await expect(control).toHaveCSS('height', kind === 'switch' ? '20px' : '24px');
    }
    await expect(page.locator('input')).toHaveCount(0);
  });
}

test('tabs skeleton preserves icon, Body label and badge', async ({ page }) => {
  await page.goto('/iframe.html?id=components-navigation-tabs--skeleton-with-elements&viewMode=story');
  const tab = page.locator('.fdoc-tab').first();
  await expect(tab).toBeVisible();
  await expect(tab.locator('.fdoc-tab__icon .fdoc-skeleton')).toHaveCSS('width', '24px');
  expect(await metrics(tab.locator('.fdoc-tab__label .fdoc-skeleton'))).toEqual({line:'20px',bar:'10px',top:'5px'});
  await expect(tab.locator('.fdoc-tab__badge .fdoc-skeleton')).toHaveCSS('height', '16px');
  await expect(page.locator('.fdoc-tab').nth(1).locator('.fdoc-tab__label')).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(0);
});

test('navigation skeletons use Caption for breadcrumbs and Body for counter', async ({ page }) => {
  await page.goto('/iframe.html?id=components-navigation-breadcrumbs--skeleton&viewMode=story');
  const crumb = page.locator('.fdoc-skeleton--text').first();
  await expect(crumb).toBeVisible();
  expect(await metrics(crumb)).toEqual({line:'16px',bar:'8px',top:'4px'});
  await expect(page.locator('.fdoc-breadcrumbs__separator-skeleton')).toHaveCount(2);
  await expect(page.locator('.fdoc-breadcrumbs__separator-skeleton').first()).toHaveCSS('width', '16px');
  await expect(page.locator('.fdoc-breadcrumbs__separator-skeleton').first()).toHaveCSS('height', '16px');
  await expect(page.locator('.fdoc-breadcrumbs .fdoc-icon')).toHaveCount(0);
  await page.goto('/iframe.html?id=components-navigation-pagination--skeleton&viewMode=story');
  const counter = page.locator('.fdoc-pagination__counter .fdoc-skeleton');
  await expect(counter).toBeVisible();
  expect(await metrics(counter)).toEqual({line:'20px',bar:'10px',top:'5px'});
});


test('Skeleton text styles match Figma line, bar and offset geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-skeleton--text-styles&viewMode=story');

  const sizes = [
    ['h0-heading', 48, 28, 11],
    ['h1-heading', 40, 22, 10],
    ['h2-heading', 32, 17, 8],
    ['h3-heading', 28, 14, 8],
    ['subtitle', 24, 11, 7],
    ['body', 20, 10, 5],
    ['caption', 16, 8, 4],
    ['overline', 14, 7, 4],
  ] as const;

  for (const [size, line, bar, top] of sizes) {
    const typography = page.getByTestId(`typography-${size}`);
    const skeleton = page.getByTestId(`skeleton-${size}`);

    await expect(typography).toBeVisible();
    await expect(skeleton).toBeVisible();

    await expect(typography).toHaveCSS('line-height', `${line}px`);
    expect(await metrics(skeleton)).toEqual({
      line: `${line}px`,
      bar: `${bar}px`,
      top: `${top}px`,
    });
  }
});

test('Input skeleton follows Figma empty and description content rules', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-input--skeleton&viewMode=story');
  await expect(page.getByTestId('input-skeleton-text')).toHaveCount(0);
  await expect(page.getByTestId('input-skeleton-field')).toHaveCSS('min-height', '56px');
  await expect(page.getByTestId('input-skeleton-label')).toHaveCSS('padding-left', '12px');
  await expect(page.getByTestId('input-skeleton-helper')).toHaveCSS('padding-left', '12px');

  await page.goto('/iframe.html?id=components-inputs-input--skeleton-with-all-content&viewMode=story');
  const inputText = page.getByTestId('input-skeleton-text');
  const description = page.getByTestId('input-skeleton-description');
  expect(await metrics(inputText)).toEqual({line:'24px',bar:'11px',top:'7px'});
  expect(await metrics(description)).toEqual({line:'16px',bar:'8px',top:'4px'});
  await expect(inputText).toHaveCSS('width', '80px');
  await expect(description).toHaveCSS('width', '88px');
});

test('CodeInput skeleton follows Figma empty and filled geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-codeinput--skeleton&viewMode=story');

  const examples = page.locator('.fdoc-code-input');
  await expect(examples).toHaveCount(6);

  const emptyMedium = examples.nth(0);
  await expect(emptyMedium.locator('.fdoc-code-input__cell')).toHaveCount(6);
  await expect(emptyMedium.locator('.fdoc-code-input__cell .fdoc-skeleton')).toHaveCount(0);
  await expect(emptyMedium.locator('> .fdoc-field__label')).toHaveCSS('padding-left', '4px');
  await expect(emptyMedium.locator('.fdoc-code-input__cell').first()).toHaveCSS('width', '48px');
  await expect(emptyMedium.locator('.fdoc-code-input__cell').first()).toHaveCSS('height', '56px');

  const filledMedium = examples.nth(1);
  const mediumSkeletons = filledMedium.locator('.fdoc-code-input__cell .fdoc-skeleton');
  await expect(mediumSkeletons).toHaveCount(6);
  await expect(mediumSkeletons.first()).toHaveCSS('width', '16px');
  expect(await metrics(mediumSkeletons.first())).toEqual({line:'28px',bar:'14px',top:'8px'});

  const emptySmall = examples.nth(2);
  await expect(emptySmall.locator('.fdoc-code-input__cell')).toHaveCount(6);
  await expect(emptySmall.locator('.fdoc-code-input__cell .fdoc-skeleton')).toHaveCount(0);
  await expect(emptySmall.locator('.fdoc-code-input__cell').first()).toHaveCSS('width', '32px');
  await expect(emptySmall.locator('.fdoc-code-input__cell').first()).toHaveCSS('height', '48px');

  const filledSmall = examples.nth(3);
  const smallSkeletons = filledSmall.locator('.fdoc-code-input__cell .fdoc-skeleton');
  await expect(smallSkeletons).toHaveCount(6);
  await expect(filledSmall.locator('.fdoc-code-input__cell').first()).toHaveCSS('width', '32px');
  await expect(filledSmall.locator('.fdoc-code-input__cell').first()).toHaveCSS('height', '48px');
  await expect(smallSkeletons.first()).toHaveCSS('width', '16px');
  expect(await metrics(smallSkeletons.first())).toEqual({line:'24px',bar:'11px',top:'7px'});

  const emptyPhone = examples.nth(4);
  await expect(emptyPhone.locator('.fdoc-code-input__cell')).toHaveCount(7);
  await expect(emptyPhone.locator('.fdoc-code-input__cell .fdoc-skeleton')).toHaveCount(0);
  const emptyPrefix = emptyPhone.getByTestId('code-input-phone-prefix');
  const emptySuffix = emptyPhone.getByTestId('code-input-phone-suffix');
  await expect(emptyPrefix.locator('.fdoc-code-input__phone-affix-skeleton')).toBeVisible();
  await expect(emptySuffix.locator('.fdoc-code-input__phone-affix-skeleton')).toBeVisible();
  await expect(emptyPrefix.locator('.fdoc-code-input__phone-affix-measure')).toHaveCSS('visibility', 'hidden');
  await expect(emptySuffix.locator('.fdoc-code-input__phone-affix-measure')).toHaveCSS('visibility', 'hidden');
  expect(await metrics(emptyPrefix.locator('.fdoc-code-input__phone-affix-skeleton'))).toEqual({line:'24px',bar:'11px',top:'7px'});
  expect(await metrics(emptySuffix.locator('.fdoc-code-input__phone-affix-skeleton'))).toEqual({line:'24px',bar:'11px',top:'7px'});
  await expect(emptyPhone.locator('.fdoc-code-input__cell').first()).toHaveCSS('width', '32px');
  await expect(emptyPhone.locator('.fdoc-code-input__cell').first()).toHaveCSS('height', '48px');

  const filledPhone = examples.nth(5);
  const phoneSkeletons = filledPhone.locator('.fdoc-code-input__cell .fdoc-skeleton');
  await expect(filledPhone.locator('.fdoc-code-input__cell')).toHaveCount(7);
  await expect(phoneSkeletons).toHaveCount(7);
  const filledPrefix = filledPhone.getByTestId('code-input-phone-prefix');
  const filledSuffix = filledPhone.getByTestId('code-input-phone-suffix');
  await expect(filledPrefix.locator('.fdoc-code-input__phone-affix-skeleton')).toBeVisible();
  await expect(filledSuffix.locator('.fdoc-code-input__phone-affix-skeleton')).toBeVisible();
  await expect(filledPrefix.locator('.fdoc-code-input__phone-affix-measure')).toHaveCSS('visibility', 'hidden');
  await expect(filledSuffix.locator('.fdoc-code-input__phone-affix-measure')).toHaveCSS('visibility', 'hidden');
  await expect(phoneSkeletons.first()).toHaveCSS('width', '16px');
  expect(await metrics(phoneSkeletons.first())).toEqual({line:'24px',bar:'11px',top:'7px'});
});

test('Skeleton docs show real component skeleton states without interactive controls', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-skeleton--component-skeleton-states&viewMode=story');

  const examples = page.locator('[data-testid^="component-skeleton-"]');
  await expect(examples).toHaveCount(35);

  for (const example of await examples.all()) {
    await expect(example.locator('.fdoc-skeleton').first()).toBeVisible();
  }

  await expect(examples.locator('button,input,textarea,select')).toHaveCount(0);

  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 1200 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
