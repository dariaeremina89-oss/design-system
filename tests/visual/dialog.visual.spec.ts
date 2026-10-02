import { expect, test } from '@playwright/test';
const story = (name: string) => `/iframe.html?id=components-overlays-dialog--${name}&viewMode=story`;
for (const width of [1280, 320]) {
  test(`Dialog contains focus and fits ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:640}); await page.goto(story('default'));
    const trigger = page.getByRole('button',{name:'Открыть диалог'}); await trigger.click();
    const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox(); expect(box!.width).toBe(width===1280?480:288);
    const headerHeight = (await page.getByTestId('dialog-header').boundingBox())!.height;
    const titleHeight = (await dialog.getByRole('heading').boundingBox())!.height;
    expect(headerHeight).toBe(Math.max(40, titleHeight) + 32);
    if (width === 1280) expect(headerHeight).toBe(72);
    expect(await dialog.getByRole('heading').evaluate(n=>getComputedStyle(n).marginTop)).toBe('0px');
    await expect(dialog.getByRole('heading')).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('button',{name:'Отмена',exact:true})).toBeFocused();
    for(let i=0;i<7;i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(()=>!!document.activeElement?.closest('dialog'))).toBe(true); }
    await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  });
}
test('Select portal is interactive within the modal and Escape closes it first', async ({page}) => {
  await page.goto(story('form')); await page.getByRole('button',{name:'Открыть диалог'}).click();
  const dialog=page.getByRole('dialog'); await dialog.getByRole('combobox').click();
  await expect(dialog.getByRole('listbox')).toBeVisible(); await dialog.getByRole('option',{name:'Готов',exact:true}).click();
  await expect(dialog.getByRole('combobox')).toHaveValue('Готов');
  await dialog.getByRole('combobox').click(); await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0); await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0);
});
test('scrolling content preserves header/footer and backdrop closing is configurable', async ({page}) => {
  await page.goto(story('scroll')); await page.getByRole('button',{name:'Открыть диалог'}).click();
  const content=page.getByTestId('dialog-content'); expect(await content.evaluate(n=>n.scrollHeight>n.clientHeight)).toBe(true);
  await content.evaluate(n=>n.scrollTop=n.scrollHeight); await expect(page.getByTestId('dialog-close')).toBeVisible(); await expect(page.getByTestId('dialog-footer')).toBeVisible();
  await page.mouse.click(2,2); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto(story('explicit-close')); await page.getByRole('button',{name:'Открыть диалог'}).click();
  await page.mouse.click(2,2); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByTestId('dialog-close').click(); await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('initially open nested dialogs preserve top layer and close independently', async ({page}) => {
  await page.goto(story('nested')); await page.getByRole('button',{name:'Открыть вложенные диалоги'}).click();
  await expect(page.getByRole('heading',{name:'Подтверждение',exact:true})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog',{name:'Подтверждение',exact:true})).toHaveCount(0);
  await expect(page.getByRole('dialog',{name:'Редактирование',exact:true})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Открыть вложенные диалоги'})).toBeFocused();
});
