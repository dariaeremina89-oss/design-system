import { expect, test } from '@playwright/test';

test('Breadcrumbs never shows more than three visible hierarchy elements', async ({ page }) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 600 });
    await page.goto('/iframe.html?id=components-navigation-breadcrumbs--deep&viewMode=story');

    const breadcrumbs = page.locator('.fdoc-breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    await expect(breadcrumbs.getByLabel('Пропущены уровни навигации')).toHaveText('…');
    await expect(breadcrumbs.getByRole('link')).toHaveCount(1);
    await expect(breadcrumbs.getByRole('link')).toHaveText('Договоры на оказание услуг');
    await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Договор с длинным названием без ручного сокращения');

    await expect(breadcrumbs.getByText('Главная')).toHaveCount(0);
    await expect(breadcrumbs.getByText('Компания')).toHaveCount(0);
    await expect(breadcrumbs.getByText('Документы')).toHaveCount(0);

    const ellipsis = breadcrumbs.getByLabel('Пропущены уровни навигации');
    await expect(ellipsis.locator('a,button')).toHaveCount(0);
    await expect(ellipsis).not.toHaveAttribute('tabindex');
  }
});
