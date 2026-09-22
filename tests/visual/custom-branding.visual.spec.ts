import { test, expect } from '@playwright/test';
const branding='/iframe.html?id=general-custom-branding--docs&viewMode=docs';
const buttonStory='/iframe.html?id=components-buttons-button--default&viewMode=story';
const hex=(rgb:string)=>'#'+rgb.match(/[\d.]+/g)!.slice(0,3).map(value=>Number(value).toString(16).padStart(2,'0')).join('');
const contrast=(first:string,second:string)=>{
  const lum=(color:string)=>{const [r,g,b]=color.match(/[\d.]+/g)!.slice(0,3).map(value=>{const c=Number(value)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
  const a=lum(first),b=lum(second);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
};

test('F.Doc has its own Dark theme without a client HEX; switching preserves primitives',async({page})=>{
  await page.goto(branding);await expect(page.getByRole('heading',{name:'Custom Branding',exact:true})).toBeVisible();
  const before=await page.evaluate(()=>{const css=getComputedStyle(document.documentElement);return ['--yellow-500','--green-500','--red-500','--neutral-900'].map(token=>css.getPropertyValue(token).trim());});
  await page.getByRole('radio',{name:'Dark',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode','dark');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(24, 25, 28)');
  await expect(page.getByTestId('brand-button-default')).toHaveCSS('background-color','rgb(255, 220, 0)');
  const after=await page.evaluate(()=>{const css=getComputedStyle(document.documentElement);return ['--yellow-500','--green-500','--red-500','--neutral-900'].map(token=>css.getPropertyValue(token).trim());});
  expect(after).toEqual(before);
  await page.getByRole('radio',{name:'Light',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-color-mode','light');
});

test('HEX entry is stable, invalid input keeps the last theme, and the same seed persists across stories',async({page})=>{
  await page.goto(branding);const input=page.getByRole('textbox',{name:'Primary 500 HEX'});
  await input.fill('');await input.pressSequentially('#2f26ff');await expect(input).toHaveValue('#2f26ff');
  await expect(page.getByTestId('brand-button-default')).toHaveCSS('background-color','rgb(47, 38, 255)');
  await input.fill('#zzzzzz');await expect(input).toHaveAttribute('aria-invalid','true');
  await expect(page.getByTestId('brand-button-default')).toHaveCSS('background-color','rgb(47, 38, 255)');
  await page.getByRole('radio',{name:'Dark',exact:true}).click();
  await page.goto(buttonStory);await expect(page.locator('#storybook-root .fdoc-button').first()).toHaveCSS('background-color','rgb(47, 38, 255)');
  await expect(page.locator('html')).toHaveAttribute('data-color-mode','dark');
  await page.goto(branding);await expect(page.getByRole('textbox',{name:'Primary 500 HEX'})).toHaveValue('#2f26ff');
  await page.getByRole('button',{name:'Сбросить к F.Doc'}).click();await expect(page.locator('html')).toHaveAttribute('data-color-mode','light');
  await expect(page.getByTestId('brand-button-default')).toHaveCSS('background-color','rgb(255, 220, 0)');
  await page.reload();await expect(page.getByTestId('brand-button-default')).toHaveCSS('color','rgb(71, 62, 0)');
});

test('active buttons, icons and inverse Primary have sufficient actual contrast in both themes',async({page})=>{
  await page.goto(branding);
  for(const mode of ['Light','Dark']) {
    await page.getByRole('radio',{name:mode,exact:true}).click();
    for(const color of ['#2f26ff','#ffdc00','#ffffff','#000000','#777777']) {
      await page.getByRole('textbox',{name:'Primary 500 HEX'}).fill(color);
      // Wait for the component's existing background transition before measuring contrast.
      await expect.poll(async()=>hex(await page.getByTestId('brand-button-default').evaluate(el=>getComputedStyle(el).backgroundColor))).toBe(color);
      for(const state of ['default','hover','pressed','focused']) {
        const button=page.getByTestId(`brand-button-${state}`);
        const colors=await button.evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor,icon:getComputedStyle(el.querySelector('.fdoc-icon')!).color}));
        expect(contrast(colors.text,colors.bg)).toBeGreaterThanOrEqual(4.5);expect(contrast(colors.icon,colors.bg)).toBeGreaterThanOrEqual(3);
        if(state==='default') expect(hex(colors.bg)).toBe(color);
      }
      const inverse=await page.getByTestId('brand-inverse-primary').evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
      expect(contrast(inverse.text,inverse.bg)).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test('Dark status chips and portal menus use their own surface mappings and do not depend on brand',async({page})=>{
  await page.goto(branding);await page.getByRole('radio',{name:'Dark',exact:true}).click();
  const status=page.getByTestId('brand-status-success');
  const before=await status.evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
  await page.getByRole('textbox',{name:'Primary 500 HEX'}).fill('#8b1245');
  expect(await status.evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}))).toEqual(before);
  for(const color of ['success','error','warning','accent']) {
    const colors=await page.getByTestId(`brand-status-${color}`).evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
    expect(contrast(colors.text,colors.bg)).toBeGreaterThanOrEqual(4.5);
  }
  await page.getByRole('combobox').click();await expect(page.locator('.fdoc-popup .fdoc-menu')).toHaveCSS('background-color','rgb(24, 25, 28)');
  await expect(page.getByRole('option',{name:'Подписан'})).toBeVisible();
});

test('mobile customization preserves component typography and contains wide comparison tables',async({page})=>{
  await page.setViewportSize({width:375,height:850});await page.goto(branding);
  await page.getByRole('radio',{name:'Dark',exact:true}).click();
  await page.getByRole('textbox',{name:'Primary 500 HEX'}).fill('#008567');
  await expect(page.getByTestId('brand-button-default').locator('.fdoc-button__text')).toHaveCSS('font-size','14px');
  expect(await page.locator('.fdoc-branding').evaluate(el=>el.getBoundingClientRect().right<=innerWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
