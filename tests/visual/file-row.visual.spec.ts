import { expect, test } from '@playwright/test';

const defaultStoryUrl = '/iframe.html?id=components-elements-filerow--default&viewMode=story';
const chipsStoryUrl = '/iframe.html?id=components-elements-filerow--long-file-name-with-chips&viewMode=story';
const skeletonStoryUrl = '/iframe.html?id=components-elements-filerow--skeleton&viewMode=story';

for (const width of [456, 320]) {
  test(`FileRow keeps filename and weight visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 400 });
    await page.goto(defaultStoryUrl);

    const row = page.getByTestId('file-row');
    const name = row.locator('.fdoc-file-item__name');
    const weight = row.locator('.fdoc-file-item__additional-text');

    await expect(row).toBeVisible();
    await expect(name).toBeVisible();
    await expect(name).toHaveText('File name.png');
    await expect(weight).toBeVisible();
    await expect(weight).toHaveText('2,7 МБ');

    expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await weight.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}

test('FileRow keeps long filename, Chips and trailing action inside a 320px row', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto(chipsStoryUrl);

  const row = page.getByTestId('file-row');
  const name = row.locator('.fdoc-file-item__name');
  const chips = row.getByTestId('chips');

  await expect(row).toBeVisible();
  await expect(name).toBeVisible();
  await expect(chips).toBeVisible();
  expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
  expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await chips.evaluate(element => element.getBoundingClientRect().right <= element.closest('.fdoc-file-item')!.getBoundingClientRect().right + 0.5)).toBe(true);
});

for (const [viewport, expectedWidth] of [[1280, 456], [320, 288]] as const) {
  test(`FileRow skeleton keeps the story reference width at ${viewport}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 400 });
    await page.goto(skeletonStoryUrl);

    const skeleton = page.getByTestId('file-row-skeleton');
    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveCSS('height', '48px');
    expect(Math.round((await skeleton.boundingBox())!.width)).toBe(expectedWidth);
  });
}


test('FileRow additional components preserve their own geometry', async ({ page }) => {
  await page.setViewportSize({ width: 456, height: 900 });
  await page.goto('/iframe.html?id=components-elements-filerow--additional-content&viewMode=story');

  const badgeExample = page.getByTestId('file-row-example-badge');
  const chipsExample = page.getByTestId('file-row-example-chips');
  const badge = page.getByTestId('file-row-additional-badge');
  const chips = page.getByTestId('file-row-additional-chips');

  await expect(badge).toBeVisible();
  await expect(chips).toBeVisible();
  await expect(badge).toHaveCSS('height', '20px');
  await expect(chips).toHaveCSS('height', '24px');
  await expect(badge).toHaveAttribute('data-badge-color', 'primary');
  await expect(chips).toHaveAttribute('data-color', 'base');

  for (const example of [badgeExample, chipsExample]) {
    const row = example.getByTestId('file-row');
    const name = row.locator('.fdoc-file-item__name');
    expect(await name.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0);
    expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }

  await page.setViewportSize({ width: 320, height: 900 });
  await expect(chips).toBeVisible();
  await expect(chips).toHaveCSS('height', '24px');
  expect(await chipsExample.getByTestId('file-row').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('FileRow reorder moves the actual row with mouse Pointer Events', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-elements-filerow--reorderable&viewMode=story');

  const names = page.locator('[data-testid^="reorder-row-"] .fdoc-file-item__name');
  await expect(names).toHaveText(['Договор.pdf', 'Заявление.pdf', 'Согласие.pdf']);

  const handle = page.getByTestId('reorder-row-contract').getByTestId('file-row-reorder-handle');
  const handleBox = await handle.boundingBox();
  const targetBox = await page.getByTestId('reorder-row-agreement').boundingBox();
  if (!handleBox || !targetBox) throw new Error('Reorder rows are not measurable');

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2, targetBox.y + targetBox.height - 2, { steps: 4 });

  await expect(page.getByTestId('file-row-drop-indicator')).toBeVisible();

  await page.mouse.up();
  await expect(names).toHaveText(['Заявление.pdf', 'Согласие.pdf', 'Договор.pdf']);
});

test('FileRow disabled examples use the nested Badge and Chips states', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto('/iframe.html?id=components-elements-filerow--additional-content-disabled&viewMode=story');
  const badge = page.getByTestId('file-row-additional-badge-disabled');
  const chips = page.getByTestId('file-row-additional-chips-disabled');
  await expect(badge).toHaveAttribute('data-badge-state', 'disabled');
  await expect(chips).toHaveAttribute('data-state', 'disabled');
  await expect(chips).toHaveAttribute('data-interactive', 'false');
  await expect(badge).toHaveCSS('height', '20px');
  await expect(chips).toHaveCSS('height', '24px');
  for (const row of await page.getByTestId('file-row').all()) {
    await expect(row).toHaveAttribute('aria-disabled', 'true');
    await expect(row.getByRole('button')).toBeDisabled();
    expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
});

test('FileRow can reorder with the keyboard and keeps focus on the moved handle', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-filerow--reorderable&viewMode=story');
  const handle = page.getByTestId('reorder-row-contract').getByTestId('file-row-reorder-handle');
  await handle.focus();
  await handle.press('ArrowDown');
  await expect(page.locator('[data-testid^="reorder-row-"] .fdoc-file-item__name'))
    .toHaveText(['Заявление.pdf', 'Договор.pdf', 'Согласие.pdf']);
  await expect(handle).toBeFocused();
});


test('FileRow menu glyphs stay 24px in built-in and custom slots, including disabled', async ({ page }) => {
  for (const name of ['menu', 'additional-content', 'trailing-actions']) {
    for (const disabled of [false, true]) {
      await page.goto(`/iframe.html?id=components-elements-filerow--${name}&viewMode=story&args=disabled:${disabled}`);
      const glyph = page.getByTestId('file-row').locator('[data-icon="more-vertical"]');
      await expect(glyph).toHaveCSS('width', '24px');
      await expect(glyph).toHaveCSS('height', '24px');
      const button = glyph.locator('..');
      await expect(button).toHaveCSS('width', '24px');
      await expect(button).toHaveCSS('padding', '0px');
    }
  }
});


test('FileRow keeps its slot but hides the source row during pointer reorder', async ({ page }) => {
  await page.goto('/iframe.html?id=components-elements-filerow--reorderable&viewMode=story');

  const row = page.getByTestId('file-row').first();
  const handle = row.getByTestId('file-row-reorder-handle');
  const before = await row.boundingBox();
  const handleBox = await handle.boundingBox();
  if (!before || !handleBox) throw new Error('Reorder row is not measurable');

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();

  await expect(row).toHaveAttribute('data-file-row-dragging', 'true');
  await expect(row).toHaveCSS('opacity', '0');
  await expect(page.locator('.fdoc-file-row__pointer-preview')).toHaveCount(1);

  const during = await row.boundingBox();
  expect(during?.width).toBe(before.width);
  expect(during?.height).toBe(before.height);

  await page.mouse.up();

  await expect(row).not.toHaveAttribute('data-file-row-dragging');
  await expect(row).toHaveCSS('opacity', '1');
  await expect(page.locator('.fdoc-file-row__pointer-preview')).toHaveCount(0);
});

test('MultipleFileInput closes reorder tooltip when pointer reorder starts', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--templates-reorderable&viewMode=story');

  const handle = page.getByRole('button', { name: 'Изменить порядок файла Договор.docx' });
  await handle.hover();
  await expect(page.getByRole('tooltip')).toHaveText('Изменить порядок шаблона');

  const box = await handle.boundingBox();
  if (!box) throw new Error('Reorder handle is not measurable');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.mouse.up();
});

test('Disabled reorder handle still explains why reorder is unavailable', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--single-template-reorder&viewMode=story');

  const handle = page.getByRole('button', { name: 'Изменить порядок файла Договор.docx' });
  await expect(handle).toBeDisabled();
  await handle.hover();
  await expect(page.getByRole('tooltip')).toHaveText('Порядок можно изменить, когда шаблонов несколько');
});


test('MultipleFileInput reorders template rows with touch pointer events at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--templates-reorderable&viewMode=story');

  const rows = page.locator('.fdoc-multiple-file-input__item');
  const names = rows.locator('.fdoc-file-item__name');
  await expect(names).toHaveText([
    'Договор.docx',
    'Заявление.docx',
    'Согласие.docx',
    'Паспорт.pdf',
    'Приложение.pdf',
  ]);

  const handle = rows.nth(0).getByTestId('file-row-reorder-handle');
  const sourceRow = rows.nth(0).getByTestId('file-row');
  const sourceBox = await sourceRow.boundingBox();
  const targetBox = await rows.nth(2).boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Reorder rows are not measurable');

  const pointerX = sourceBox.x + 16;
  const startY = sourceBox.y + sourceBox.height / 2;
  const targetY = targetBox.y + targetBox.height - 2;

  await handle.dispatchEvent('pointerdown', {
    pointerId: 11,
    pointerType: 'touch',
    isPrimary: true,
    clientX: pointerX,
    clientY: startY,
    bubbles: true,
  });

  await expect(sourceRow).toHaveAttribute('data-file-row-dragging', 'true');
  await expect(sourceRow).toHaveCSS('opacity', '0');
  await expect(page.locator('.fdoc-file-row__pointer-preview')).toHaveCount(1);

  await handle.dispatchEvent('pointermove', {
    pointerId: 11,
    pointerType: 'touch',
    isPrimary: true,
    clientX: pointerX,
    clientY: targetY,
    bubbles: true,
  });

  await expect(page.getByTestId('file-row-drop-indicator')).toBeVisible();

  await handle.dispatchEvent('pointerup', {
    pointerId: 11,
    pointerType: 'touch',
    isPrimary: true,
    clientX: pointerX,
    clientY: targetY,
    bubbles: true,
  });

  await expect(page.locator('.fdoc-file-row__pointer-preview')).toHaveCount(0);
  await expect(names).toHaveText([
    'Заявление.docx',
    'Согласие.docx',
    'Договор.docx',
    'Паспорт.pdf',
    'Приложение.pdf',
  ]);
});


test('MultipleFileInput reorders immediately to the shown edge position with mouse Pointer Events', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--templates-reorderable&viewMode=story');

  const rows = page.locator('.fdoc-multiple-file-input__item');
  const names = rows.locator('.fdoc-file-item__name');

  const pointerReorder = async (sourceIndex: number, targetY: number) => {
    const handle = rows.nth(sourceIndex).getByTestId('file-row-reorder-handle');
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Reorder handle is not measurable');

    const x = handleBox.x + handleBox.width / 2;
    const y = handleBox.y + handleBox.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, targetY, { steps: 5 });

    await expect(page.getByTestId('file-row-drop-indicator')).toBeVisible();

    await page.mouse.up();
    await expect(page.getByTestId('file-row-drop-indicator')).toHaveCount(0);
  };

  const thirdTemplateBox = await rows.nth(2).boundingBox();
  if (!thirdTemplateBox) throw new Error('Third template row is not measurable');

  await pointerReorder(0, thirdTemplateBox.y + thirdTemplateBox.height + 2);
  await expect(names).toHaveText([
    'Заявление.docx',
    'Согласие.docx',
    'Договор.docx',
    'Паспорт.pdf',
    'Приложение.pdf',
  ]);

  const firstTemplateBox = await rows.nth(0).boundingBox();
  if (!firstTemplateBox) throw new Error('First template row is not measurable');

  await pointerReorder(2, firstTemplateBox.y - 2);
  await expect(names).toHaveText([
    'Договор.docx',
    'Заявление.docx',
    'Согласие.docx',
    'Паспорт.pdf',
    'Приложение.pdf',
  ]);
});


test('MultipleFileInput total size excludes templates and recalculates uploaded files', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--templates-reorderable&viewMode=story');

  await expect(page.locator('.fdoc-multiple-file-input__total')).toHaveText('Общий объем: 4,0 МБ');

  await page.getByRole('button', { name: 'Удалить файл Договор.docx' }).click();
  await expect(page.locator('.fdoc-multiple-file-input__total')).toHaveText('Общий объем: 4,0 МБ');

  await page.getByRole('button', { name: 'Удалить файл Паспорт.pdf' }).click();
  await expect(page.locator('.fdoc-multiple-file-input__total')).toHaveText('Общий объем: 1,3 МБ');
});

test('MultipleFileInput Reorderable story matches the Figma 8,1 MB example', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--reorderable&viewMode=story');

  await expect(page.locator('.fdoc-multiple-file-input__total')).toHaveText('Общий объем: 8,1 МБ');
  await expect(page.locator('.fdoc-file-item__additional-text')).toHaveText([
    '2,7 МБ',
    '2,7 МБ',
    '2,7 МБ',
  ]);
});


test('SingleTemplateReorder tooltip respects the 288px design-system maximum', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 600 });
  await page.goto('/iframe.html?id=components-inputs-multiplefileinput--single-template-reorder&viewMode=story');

  const handle = page.getByRole('button', { name: 'Изменить порядок файла Договор.docx' });
  await handle.hover();

  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toHaveText('Порядок можно изменить, когда шаблонов несколько');
  const box = await tooltip.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(288);
});
