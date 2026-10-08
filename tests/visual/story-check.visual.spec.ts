import { expect, test } from '@playwright/test';

test('story view explains what the scenario checks', async ({ page }) => {
  await page.goto('/iframe.html?id=components-inputs-input--default&viewMode=story');

  const check = page.getByTestId('story-check');
  await expect(check).toBeVisible();
  await expect(check).toContainText('Что проверяем');
  await expect(check).toContainText('Базовое состояние компонента');
});

test('story view prefers the story-specific description', async ({ page }) => {
  await page.goto('/iframe.html?id=components-selection-asyncmultiselect--search-hint&viewMode=story');

  const check = page.getByTestId('story-check');
  await expect(check).toBeVisible();
  await expect(check).toContainText('Что проверяем');
  await expect(check).toContainText('подсказывает, что именно можно вводить');
});
