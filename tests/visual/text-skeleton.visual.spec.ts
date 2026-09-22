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
  test(`${kind} group skeleton separates Subtitle and Caption`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-selection-${kind}group--skeleton&viewMode=story`);
    const title = page.locator('.fdoc-selection-group__label .fdoc-skeleton');
    const label = page.locator('.fdoc-control__label .fdoc-skeleton').first();
    const description = page.locator('.fdoc-control__description .fdoc-skeleton').first();
    await expect(title).toBeVisible();
    for (const width of [1280, 320]) {
      await page.setViewportSize({width,height:800});
      expect(await metrics(title)).toEqual({line:'24px',bar:'11px',top:'7px'});
      expect(await metrics(label)).toEqual({line:'24px',bar:'11px',top:'7px'});
      expect(await metrics(description)).toEqual({line:'16px',bar:'8px',top:'4px'});
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
  await page.goto('/iframe.html?id=components-navigation-pagination--skeleton&viewMode=story');
  const counter = page.locator('.fdoc-pagination__counter .fdoc-skeleton');
  await expect(counter).toBeVisible();
  expect(await metrics(counter)).toEqual({line:'20px',bar:'10px',top:'5px'});
});
