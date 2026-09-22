import { test, expect } from '@playwright/test';
const story='/iframe.html?id=components-selection-dropdown--hover-action&viewMode=story';

test('hover crosses the popup gap without stealing focus; click executes the main action',async({page})=>{
  await page.goto(story); const trigger=page.getByRole('button',{name:'Скачать PDF',exact:true});
  const next=page.getByRole('button',{name:'Следующая кнопка'}); await next.focus(); await trigger.hover();
  await expect(page.getByRole('menu')).toBeVisible(); await expect(next).toBeFocused();
  await expect(page.getByRole('menuitem',{name:'Скачать PDF',exact:true})).toHaveCount(0);
  const buttonBox=(await trigger.boundingBox())!, popupBox=(await page.locator('.fdoc-popup').boundingBox())!;
  expect(popupBox.y-buttonBox.y-buttonBox.height).toBe(4);
  await page.getByRole('menuitem',{name:'Скачать DOCX'}).hover();
  // Stay in the menu beyond its leave delay; the canceled close must not fire.
  await page.waitForTimeout(250); await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Действие еще не выполнено');
  await page.mouse.move(1000,700); await expect(page.getByRole('menu')).toHaveCount(0);
  await trigger.click(); await expect(page.getByRole('status')).toHaveText('Скачать PDF — выполнено: 1');
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('keyboard action and menu entry after hover work without an accidental action',async({page})=>{
  await page.goto(story); const trigger=page.getByRole('button',{name:'Скачать PDF',exact:true});
  await trigger.focus(); await trigger.press('Enter'); await trigger.press('Space');
  await expect(page.getByRole('status')).toHaveText('Скачать PDF — выполнено: 2');
  await trigger.hover(); await trigger.press('ArrowDown'); await expect(page.getByRole('menuitem',{name:'Скачать DOCX'})).toBeFocused();
  await page.keyboard.press('End'); await expect(page.getByRole('menuitem',{name:'Скачать архив'})).toBeFocused();
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await trigger.press('ArrowUp'); await expect(page.getByRole('menuitem',{name:'Скачать архив'})).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'Следующая кнопка'})).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('mobile widths keep typography and expose the main action as the first menu item',async({page})=>{
  for(const width of [767,320]) {
    await page.setViewportSize({width,height:800}); await page.goto(story);
    const trigger=page.getByRole('button',{name:'Скачать PDF',exact:true}); await trigger.click();
    await expect(page.getByRole('status')).toHaveText('Действие еще не выполнено');
    await expect(page.getByRole('menuitem').first()).toHaveText('Скачать PDF');
    await expect(page.getByRole('menuitem').first().locator('.fdoc-item-row__title')).toHaveCSS('font-size','14px');
    const popup=(await page.locator('.fdoc-popup').boundingBox())!; expect(popup.x).toBeGreaterThanOrEqual(0); expect(popup.x+popup.width).toBeLessThanOrEqual(width);
    await page.getByRole('menuitem',{name:'Скачать PDF',exact:true}).click();
    await expect(page.getByRole('status')).toHaveText('Скачать PDF — выполнено: 1'); await expect(page.getByRole('menu')).toHaveCount(0);
  }
});

test.describe('touch device',()=>{
  test.use({hasTouch:true});
  test('large touch screen opens the menu and executes the shared action only from its row',async({page})=>{
    await page.goto(story); await page.getByRole('button',{name:'Скачать PDF',exact:true}).tap();
    await expect(page.getByRole('status')).toHaveText('Действие еще не выполнено');
    await page.getByRole('menuitem',{name:'Скачать PDF',exact:true}).tap();
    await expect(page.getByRole('status')).toHaveText('Скачать PDF — выполнено: 1');
    await expect(page.getByRole('menu')).toHaveCount(0);
  });
});

test('disabled hover action cannot reveal its menu',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-dropdown--hover-action-disabled&viewMode=story');
  const trigger=page.getByRole('button',{name:'Скачать PDF',exact:true}); await expect(trigger).toBeDisabled(); await trigger.hover();
  await expect(page.getByRole('menu')).toHaveCount(0); await expect(page.getByRole('status')).toHaveText('Действие еще не выполнено');
});
