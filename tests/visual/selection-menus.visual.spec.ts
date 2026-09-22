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


test('Select pointer opening has no forced row focus; selection and clear use the correct icons',async({page})=>{
 for(const width of [1280,320]){
  await page.setViewportSize({width,height:800});await page.goto(story('components-selection-select--with-description'));
  const input=page.getByRole('combobox'), clear=page.getByRole('button',{name:'Очистить выбор'});
  await expect(clear).toHaveCSS('width','24px');await expect(clear).toHaveCSS('height','24px');await expect(clear).toHaveCSS('padding','0px');
  await expect(clear.locator('[data-icon="filled/cross_circle_filled"]')).toHaveCSS('width','24px');
  await input.click();await expect(page.locator('[role=option][data-state=focused]')).toHaveCount(0);await expect(input).not.toHaveAttribute('aria-activedescendant');
  const selected=page.getByRole('option',{selected:true});await expect(selected.locator('[data-icon="filled/check_circle_filled"]')).toHaveCSS('width','24px');
  await input.press('ArrowDown');await expect(page.locator('[role=option][data-state=focused]')).toHaveCount(1);await input.press('Escape');
  await clear.click();await expect(input).toHaveValue('');await expect(input).toBeFocused();await expect(page.getByRole('listbox')).toHaveCount(0);
 }
});

test('Menu scroll viewport stays inside its bounds and row padding matches the design',async({page})=>{
 for(const width of [1280,320]){
  await page.setViewportSize({width,height:800});await page.goto(story('components-selection-menu--one-item'));
  const menu=page.locator('.fdoc-menu'), list=page.getByRole('menu'), row=page.getByRole('menuitem');await expect(row).toBeVisible();
  const m=(await menu.boundingBox())!, l=(await list.boundingBox())!, r=(await row.boundingBox())!;
  expect(r.y-m.y).toBe(8);expect(m.y+m.height-r.y-r.height).toBe(8);expect(l.x).toBe(m.x);expect(l.width).toBe(m.width);expect(r.height).toBe(48);
  await expect(row.locator('.fdoc-item-row__container')).toHaveCSS('padding','12px');await expect(row.locator('.fdoc-item-row__text')).toHaveCSS('padding','2px 4px');
  await page.goto(story('components-selection-menu--search-and-scroll'));await expect(page.getByRole('searchbox')).toBeVisible();
  const bounds=(await page.locator('.fdoc-menu').boundingBox())!, scroll=(await page.getByRole('menu').boundingBox())!;
  expect(scroll.x).toBeGreaterThanOrEqual(bounds.x);expect(scroll.x+scroll.width).toBeLessThanOrEqual(bounds.x+bounds.width);
  expect(await page.getByRole('menu').evaluate(el=>el.getBoundingClientRect().width-el.clientWidth)).toBe(16);
  expect((await page.locator('.fdoc-menu__footer').boundingBox())!.height).toBe(56);
 }
});

test('Select Creatable creates without filtering and Dropdown pointer opening does not focus a row',async({page})=>{
 await page.goto(story('components-selection-select--creatable'));const input=page.getByRole('combobox');await input.fill('Новая категория');await expect(page.getByRole('option')).toHaveCount(4);await expect(input).toHaveAttribute('aria-autocomplete','none');
 await input.press('Enter');await expect(input).toHaveValue('Новая категория');await input.click();await expect(page.getByRole('option')).toHaveCount(4);
 await page.goto(story('components-selection-dropdown--default'));const trigger=page.getByRole('button',{name:'Действия',exact:true});await trigger.click();await expect(page.getByRole('menu')).toBeFocused();await expect(page.getByRole('menuitem',{name:'Редактировать'})).not.toBeFocused();
 await page.keyboard.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'Редактировать'})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});

test('ItemRow selected glyph and checkbox retain 24px geometry and disabled colors',async({page})=>{
 await page.goto(story('components-selection-itemrow--selected-marks'));const marks=page.locator('.fdoc-item-row__check');await expect(marks).toHaveCount(3);
 for(const mark of await marks.all()) {await expect(mark.locator('[data-icon="filled/check_circle_filled"]')).toHaveCSS('width','24px');await expect(mark).toHaveCSS('height','24px');}
 const colors=await marks.evaluateAll(els=>els.map(el=>({actual:getComputedStyle(el).color,token:getComputedStyle(el).getPropertyValue(el.closest('[data-state=disabled]')?'--icon-primary-secondary-disabled':'--icon-primary-secondary').trim()})));
 expect(colors[0].actual).toBe(colors[1].actual);expect(colors[2].actual).not.toBe(colors[0].actual);
 await page.goto(story('components-selection-itemrow--selection'));await expect(page.locator('.fdoc-item-row__checkbox')).toHaveCSS('height','24px');expect((await page.locator('.fdoc-item-row').boundingBox())!.height).toBe(48);
});
