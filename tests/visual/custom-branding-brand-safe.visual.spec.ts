import { test, expect } from '@playwright/test';

const pageUrl='/iframe.html?id=general-custom-branding-brand-safe--docs&viewMode=docs';

test('Brand-safe keeps exact Primary 500 and minimally corrects F.Doc in Dark',async({page})=>{
  await page.goto(pageUrl);
  await expect(page.getByRole('heading',{name:'Custom Branding · Brand-safe',exact:true})).toBeVisible();
  await expect(page.getByRole('radio',{name:'Dark',exact:true})).toBeChecked();

  const source=await page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--primary-500').trim().toLowerCase());
  const darkDefault=await page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--background-primary-default').trim().toLowerCase());
  expect(source).toBe('#ffdc00');
  expect(darkDefault).not.toBe(source);
  await expect(page.getByTestId('brand-safe-adjustment')).toContainText('Затемнен минимально');
});

test('Brand-safe leaves a suitable Dark brand HEX exactly unchanged',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Primary HEX'});
  await input.fill('#008567');

  await expect(page.getByTestId('brand-safe-adjustment')).toContainText('Без изменения');
  await expect(page.getByTestId('brand-safe-dark-default')).toContainText('#008567');

  const values=await page.locator('html').evaluate(el=>({
    source:getComputedStyle(el).getPropertyValue('--primary-500').trim().toLowerCase(),
    semantic:getComputedStyle(el).getPropertyValue('--background-primary-default').trim().toLowerCase(),
  }));
  expect(values.source).toBe('#008567');
  expect(values.semantic).toBe('#008567');
});

test('Brand-safe Light always uses the exact entered HEX as Primary Default',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Primary HEX'});
  await input.fill('#2f26ff');
  await page.getByRole('radio',{name:'Light',exact:true}).click();

  await expect.poll(async()=>page.locator('html').evaluate(el=>({
    source:getComputedStyle(el).getPropertyValue('--primary-500').trim().toLowerCase(),
    semantic:getComputedStyle(el).getPropertyValue('--background-primary-default').trim().toLowerCase(),
  }))).toEqual({source:'#2f26ff',semantic:'#2f26ff'});
});

test('Brand-safe color output uses full-width compact strips instead of the 11-column palette grid',async({page})=>{
  await page.goto(pageUrl);

  const source=page.getByTestId('brand-safe-source-strip');
  const states=page.getByTestId('brand-safe-states-strip');
  await expect(source).toBeVisible();
  await expect(states).toBeVisible();

  const sourceColumns=await source.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  const stateColumns=await states.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  expect(sourceColumns).toBe(1);
  expect(stateColumns).toBe(3);

  const stateWidths=await states.locator('.fdoc-branding__swatch').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().width));
  expect(stateWidths).toHaveLength(3);
  expect(Math.max(...stateWidths)-Math.min(...stateWidths)).toBeLessThan(2);
});

test('Brand-safe live Primary button reads the experimental Dark semantic color',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Primary HEX'});
  await input.fill('#8b1245');
  const button=page.getByTestId('brand-safe-primary-button');

  await expect.poll(async()=>{
    const expected=await page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--background-primary-default').trim());
    const normalized=await page.evaluate(color=>{
      const probe=document.createElement('span');
      probe.style.backgroundColor=color;
      document.body.appendChild(probe);
      const value=getComputedStyle(probe).backgroundColor;
      probe.remove();
      return value;
    },expected);
    const actual=await button.evaluate(el=>getComputedStyle(el).backgroundColor);
    return actual===normalized;
  }).toBe(true);
});
