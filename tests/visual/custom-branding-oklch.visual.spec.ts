import { test, expect } from '@playwright/test';

const pageUrl='/iframe.html?id=general-custom-branding-oklch--docs&viewMode=docs';

test('OKLCH branding page compares the current and experimental Dark Primary ramps',async({page})=>{
  await page.goto(pageUrl);
  await expect(page.getByRole('heading',{name:'Custom Branding · OKLCH',exact:true})).toBeVisible();

  await expect(page.getByRole('radio',{name:'Dark',exact:true})).toBeChecked();
  await expect(page.getByTestId('oklch-dark-500')).toContainText('#D4B700');
  await expect(page.getByTestId('oklch-brand-palette').locator('[data-primary-step="500"]')).toHaveAttribute('data-active','true');
  await expect(page.getByTestId('current-brand-palette').locator('[data-active="true"]')).not.toHaveAttribute('data-primary-step','500');

  const button=page.getByTestId('oklch-primary-button');
  const semantic=await page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--background-primary-default').trim());
  await expect(button).toHaveCSS('background-color','rgb(212, 183, 0)');
  expect(semantic.toLowerCase()).toBe('#d4b700');
});

test('OKLCH Dark keeps saturated brand hues recognizable instead of RGB-pastelizing them',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Brand HEX'});

  for(const [seed,expected] of [
    ['#2f26ff','#5777ff'],
    ['#008567','#2d9b7c'],
    ['#8b1245','#cf577d'],
  ] as const) {
    await input.fill(seed);
    await expect(page.getByTestId('oklch-dark-500')).toContainText(expected.toUpperCase());
    const runtime=await page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--primary-500').trim().toLowerCase());
    expect(runtime).toBe(expected);
  }
});

test('OKLCH Light remains identical to the current branding strategy',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Brand HEX'});
  await input.fill('#2f26ff');
  await page.getByRole('radio',{name:'Light',exact:true}).click();

  await expect(page.getByTestId('current-brand-palette').locator('[data-primary-step="500"]')).toHaveAttribute('data-active','true');
  await expect(page.getByTestId('oklch-brand-palette').locator('[data-primary-step="500"]')).toHaveAttribute('data-active','true');

  const current=await page.getByTestId('current-brand-palette').locator('[data-primary-step]').evaluateAll(items=>items.map(item=>getComputedStyle(item).backgroundColor));
  const oklch=await page.getByTestId('oklch-brand-palette').locator('[data-primary-step]').evaluateAll(items=>items.map(item=>getComputedStyle(item).backgroundColor));
  expect(oklch).toEqual(current);
  await expect(page.getByTestId('oklch-primary-button')).toHaveCSS('background-color','rgb(47, 38, 255)');
});
