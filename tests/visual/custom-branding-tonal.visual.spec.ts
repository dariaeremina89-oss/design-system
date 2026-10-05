import { test, expect } from '@playwright/test';

const pageUrl='/iframe.html?id=general-custom-branding-tonal--docs&viewMode=docs';

test('Tonal branding uses fixed Primary Default steps for Light and Dark',async({page})=>{
  await page.goto(pageUrl);
  await expect(page.getByRole('heading',{name:'Custom Branding · Tonal',exact:true})).toBeVisible();

  await expect(page.getByRole('radio',{name:'Dark',exact:true})).toBeChecked();
  await expect(page.getByTestId('tonal-active-default')).toContainText('--primary-200');
  await expect(page.getByTestId('tonal-brand-palette').locator('[data-primary-step="200"]')).toHaveAttribute('data-active','true');

  await page.getByRole('radio',{name:'Light',exact:true}).click();
  await expect(page.getByTestId('tonal-active-default')).toContainText('--primary-600');
  await expect(page.getByTestId('tonal-brand-palette').locator('[data-primary-step="600"]')).toHaveAttribute('data-active','true');
});

test('Tonal palette itself stays identical when switching Light and Dark',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Brand Source HEX'});
  await input.fill('#2f26ff');

  const dark=await page.getByTestId('tonal-brand-palette').locator('[data-primary-step]').evaluateAll(items=>items.map(item=>getComputedStyle(item).backgroundColor));
  await page.getByRole('radio',{name:'Light',exact:true}).click();
  const light=await page.getByTestId('tonal-brand-palette').locator('[data-primary-step]').evaluateAll(items=>items.map(item=>getComputedStyle(item).backgroundColor));

  expect(light).toEqual(dark);
  await expect(page.getByTestId('tonal-active-default')).toContainText('--primary-600');
});

test('Brand Source changes hue without changing semantic step numbers',async({page})=>{
  await page.goto(pageUrl);
  const input=page.getByRole('textbox',{name:'Brand Source HEX'});

  for(const seed of ['#2f26ff','#008567','#8b1245','#f4e5fa','#171329']) {
    await input.fill(seed);
    await expect(page.getByTestId('tonal-active-default')).toContainText('--primary-200');

    const palette=page.getByTestId('tonal-brand-palette');
    await expect(palette.locator('[data-primary-step="200"]')).toHaveAttribute('data-active','true');
    const runtime=await page.locator('html').evaluate(el=>({
      source:getComputedStyle(el).getPropertyValue('--brand-source').trim().toLowerCase(),
      ref:getComputedStyle(el).getPropertyValue('--background-primary-default').trim().toLowerCase(),
      step:getComputedStyle(el).getPropertyValue('--primary-200').trim().toLowerCase(),
    }));
    expect(runtime.source).toBe(seed);
    expect(runtime.ref).toBe(runtime.step);
  }
});

test('Tonal live components read the experimental semantic tokens',async({page})=>{
  await page.goto(pageUrl);
  await expect(page.getByTestId('tonal-active-default')).toContainText('--primary-200');
  const button=page.getByTestId('tonal-primary-button');

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
