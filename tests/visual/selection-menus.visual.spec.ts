import { test, expect } from '@playwright/test';
const story = (id:string) => `/iframe.html?id=${id}&viewMode=story`;

test('Select keeps geometry and Subtitle on desktop/mobile; menu overlays caption without a gap', async ({page})=>{
 for(const width of [1280,767,375,320]){
  await page.setViewportSize({width,height:800});await page.goto(story('components-selection-select--default'));
  const input=page.getByRole('combobox');await expect(input).toBeVisible();const field=page.locator('.fdoc-input__field');const before=await field.boundingBox();const caption=await page.locator('.fdoc-field__helper').boundingBox();
  await expect(input).toHaveCSS('font-size','16px');await expect(input).toHaveCSS('line-height','24px');expect(before!.height).toBe(56);
  await input.focus();await expect(page.getByRole('listbox')).toHaveCount(0);expect((await field.boundingBox())!.height).toBe(before!.height);
  await input.press('ArrowDown');await expect(page.getByRole('listbox')).toBeVisible();const popup=await page.locator('.fdoc-popup').boundingBox();const after=await field.boundingBox();
  expect(popup!.width).toBeCloseTo(after!.width,1);expect(popup!.y).toBeCloseTo(after!.y+after!.height,1);expect(await page.locator('.fdoc-field__helper').boundingBox()).toEqual(caption);
  await input.press('ArrowDown');await input.press('ArrowDown');await input.press('Enter');await expect(input).toHaveValue('Подписан');await expect(input).toBeFocused();await expect(page.getByRole('listbox')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 }
});

test('Select flips upward and stays within a mobile viewport', async ({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto(story('components-selection-select--at-edge'));await page.getByRole('combobox').click();
 await expect(page.locator('.fdoc-popup')).toHaveAttribute('data-placement','top');const popup=await page.locator('.fdoc-popup').boundingBox(), field=await page.locator('.fdoc-input__field').boundingBox();
 expect(popup!.y).toBeGreaterThanOrEqual(8);expect(popup!.x).toBeGreaterThanOrEqual(0);expect(popup!.x+popup!.width).toBeLessThanOrEqual(320);expect(popup!.y+popup!.height).toBeCloseTo(field!.y,1);
});

test('Dropdown supports focus, disabled skipping, Escape and Tab to the following control', async ({page})=>{
 await page.goto(story('components-selection-dropdown--default'));const trigger=page.getByRole('button',{name:'Действия',exact:true});await trigger.focus();await trigger.press('ArrowDown');
 const edit=page.getByRole('menuitem',{name:'Редактировать'});await expect(edit).toBeFocused();await edit.press('End');await expect(page.getByRole('menuitem',{name:'Скачать PDF'})).toBeFocused();
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await trigger.press('Enter');await expect(edit).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Следующая кнопка'})).toBeFocused();await expect(page.getByRole('menu')).toHaveCount(0);
});

test('Search and footer stay fixed while Menu scrolls; search keeps menu open', async ({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(story('components-selection-menu--search-and-scroll'));
 const search=page.getByRole('searchbox'), footer=page.locator('.fdoc-menu__footer');await expect(search).toBeVisible();const searchBox=await search.boundingBox(), footerBox=await footer.boundingBox();
 await expect(search).toHaveCSS('font-size','16px');expect((await page.locator('.fdoc-search .fdoc-input__field').boundingBox())!.height).toBe(48);
 await page.getByRole('menuitem',{name:'Документ 1 Описание документа',exact:true}).focus();await page.keyboard.press('End');await expect(page.getByRole('menuitem',{name:'Документ 30 Описание документа'})).toBeFocused();
 expect(await search.boundingBox()).toEqual(searchBox);expect(await footer.boundingBox()).toEqual(footerBox);expect(await page.locator('.fdoc-menu__list').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
 await search.fill('Документ 29');await expect(page.getByRole('menuitem')).toHaveCount(1);await expect(page.getByRole('menu')).toBeVisible();
});

test('ItemRow states preserve size and focus outline; skeletons follow text styles',async({page})=>{
 for(const width of [1280,320]){
  await page.setViewportSize({width,height:850});await page.goto(story('components-selection-itemrow--states'));const rows=page.locator('.fdoc-item-row');await expect(rows).toHaveCount(6);
  const heights=await rows.evaluateAll(els=>els.map(el=>el.getBoundingClientRect().height));expect(new Set(heights).size).toBe(1);
  await expect(rows.nth(3)).toHaveCSS('outline-width','4px');await expect(rows.nth(0).locator('.fdoc-item-row__title')).toHaveCSS('font-size','14px');await expect(rows.nth(0).locator('.fdoc-item-row__description')).toHaveCSS('font-size','12px');
  await page.goto(story('components-selection-itemrow--skeleton'));const skeletons=page.locator('.fdoc-item-row');await expect(skeletons.nth(0).locator('[data-text-size="subtitle"]')).toHaveCount(1);
  await expect(skeletons.nth(1).locator('[data-text-size="body"]')).toHaveCount(2);await expect(skeletons.nth(1).locator('[data-text-size="caption"]')).toHaveCount(1);
 }
});

test('Search explicit submit and clear retain size and focus at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(story('components-inputs-search--default'));const search=page.getByRole('searchbox');await search.fill('Договор');await search.press('Enter');await expect(page.getByRole('status')).toHaveText('Поиск: Договор');
 expect((await page.locator('.fdoc-input__field').boundingBox())!.height).toBe(48);await page.getByRole('button',{name:'Очистить поле'}).click();await expect(search).toHaveValue('');await expect(search).toBeFocused();await expect(page.getByRole('status')).toHaveText('Поиск: Договор');
});
