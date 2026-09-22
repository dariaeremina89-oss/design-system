import { expect,test } from '@playwright/test';

test('Chips keeps Figma geometry and typography on desktop and mobile',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-chips--sizes-and-shapes&viewMode=story');
  for(const width of [1280,320]){
    await page.setViewportSize({width,height:800});
    for(const size of ['small','medium'])for(const shape of ['round','square']){
      const chip=page.getByTestId(`chips-${size}-${shape}`);
      await expect(chip).toHaveCSS('height',size==='small'?'24px':'32px');
      await expect(chip).toHaveCSS('border-radius',shape==='round'?'9999px':'4px');
      await expect(chip).toHaveCSS('padding-left','8px');
      await expect(chip).toHaveCSS('padding-top',size==='small'?'4px':'6px');
      await expect(chip.locator('.fdoc-chips__text')).toHaveCSS('font-size','12px');
      await expect(chip.locator('.fdoc-chips__text')).toHaveCSS('line-height','16px');
      await expect(chip.locator('.fdoc-chips__text')).toHaveCSS('font-weight','400');
      await expect(chip.locator('.fdoc-chips__text')).toHaveCSS('padding-left',size==='small'?'4px':'8px');
      for(const icon of await chip.locator('.fdoc-icon').all()){
        await expect(icon).toHaveCSS('width','16px');await expect(icon).toHaveCSS('height','16px');
      }
    }
  }
});

test('Chips exposes every palette state with matching tokens and fixed focus geometry',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-chips--states&viewMode=story');
  const palette=[
    ['secondary','base-secondary','base-default','base-default','base-default'],
    ['base','base-default','base-default','base-default','base-default'],
    ['primary','primary-default','primary-default','primary-default','primary'],
    ['success','success-secondary','success-default-light','success-secondary','success'],
    ['accent','accent-secondary','accent-default-light','accent-secondary','accent'],
    ['warning','warning-secondary','warning-default-light','warning-secondary','warning'],
    ['error','error-secondary','error-default-light','error-secondary','error'],
    ['inverse','base-inverse','base-inverse','base-inverse','base-inverse'],
  ];
  for(const [color,bg,text,icon,focus] of palette)for(const state of ['default','hover','pressed','focused','disabled']){
    const chip=page.getByTestId(`chips-${color}-${state}`);
    const suffix=state==='hover'?'-hover':state==='pressed'&&color!=='inverse'?'-pressed':state==='disabled'?'-disabled':'';
    const expected=await chip.evaluate((el,{bg,text,icon,focus,suffix,state})=>{
      const probe=document.createElement('span');el.append(probe);
      const token=(name:string)=>{probe.style.color=`var(--${name})`;return getComputedStyle(probe).color;};
      const result={bg:token(`background-${bg}${suffix}`),text:token(`text-${text}${state==='disabled'?'-disabled':''}`),icon:token(`icon-${icon}${state==='disabled'?'-disabled':''}`),focus:token(`border-${focus}-focused`)};
      probe.remove();return result;
    },{bg,text,icon,focus,suffix,state});
    await expect(chip).toHaveCSS('background-color',expected.bg);
    await expect(chip).toHaveCSS('color',expected.text);
    for(const node of await chip.locator('.fdoc-icon').all())await expect(node).toHaveCSS('color',expected.icon);
    await expect(chip).toHaveCSS('height','32px');
    await expect(chip).toHaveCSS('outline-width',state==='focused'?'4px':'0px');
    if(state==='focused')await expect(chip).toHaveCSS('outline-color',expected.focus);
    if(state==='disabled')await expect(chip.getByRole('button')).toBeDisabled();
  }
});

test('Chips keyboard focus is visible and does not resize the component',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-chips--selected&viewMode=story');
  const chip=page.getByTestId('chips');await expect(chip).toBeVisible();
  const before=await chip.boundingBox();await page.keyboard.press('Tab');
  await expect(chip.getByRole('button')).toBeFocused();await expect(chip).toHaveCSS('outline-width','4px');
  const after=await chip.boundingBox();expect(after?.width).toBe(before?.width);expect(after?.height).toBe(before?.height);
  await page.keyboard.press('Space');await expect(chip).toHaveAttribute('data-color','secondary');
});

test('Chips skeleton uses both Figma shapes and sizes; long text truncates',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-chips--skeleton&viewMode=story');
  const skeletons=page.locator('.fdoc-chips--skeleton');await expect(skeletons).toHaveCount(4);
  for(const [i,height,radius] of [[0,24,9999],[1,24,4],[2,32,9999],[3,32,4]]){
    await expect(skeletons.nth(i)).toHaveCSS('height',`${height}px`);await expect(skeletons.nth(i)).toHaveCSS('border-radius',`${radius}px`);
  }
  await expect(page.locator('button')).toHaveCount(0);
  await page.goto('/iframe.html?id=components-selection-chips--long-text&viewMode=story');
  for(const text of await page.locator('.fdoc-chips__text').all()){
    await expect(text).toHaveCSS('text-overflow','ellipsis');expect(await text.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
  }
});

test('ChipsGroup wraps at narrow widths and preserves an 8px gap',async({page})=>{
  await page.goto('/iframe.html?id=components-selection-chipsgroup--wrapping&viewMode=story');
  await page.setViewportSize({width:320,height:800});
  const group=page.getByRole('group');await expect(group).toHaveCSS('gap','8px');
  const rects=await group.locator('.fdoc-chips').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,right:r.right};}));
  expect(new Set(rects.map(r=>r.top)).size).toBeGreaterThan(1);
  const bound=(await group.boundingBox())!;expect(rects.every(r=>r.right<=bound.x+bound.width)).toBe(true);
});
