import { expect, test } from '@playwright/test';

type StorybookEntry = {
  id: string;
  type: string;
  title?: string;
  name?: string;
};

type StorybookIndex = {
  entries: Record<string, StorybookEntry>;
};

const SHARD_COUNT = 8;

for (let shard = 0; shard < SHARD_COUNT; shard += 1) {
  test(`Storybook stories stay inside a 320px viewport [${shard + 1}/${SHARD_COUNT}]`, async ({ page, request }) => {
    test.setTimeout(120_000);
    page.setDefaultNavigationTimeout(15_000);
    await page.setViewportSize({ width: 320, height: 900 });

    const indexResponse = await request.get('/index.json');
    expect(indexResponse.ok()).toBe(true);

    const index = (await indexResponse.json()) as StorybookIndex;
    const stories = Object.values(index.entries)
      .filter(entry => entry.type === 'story')
      .sort((a, b) => a.id.localeCompare(b.id))
      .filter((_, index) => index % SHARD_COUNT === shard);

    const failures: string[] = [];

    for (const story of stories) {
      try {
        await page.goto(`/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, {
          waitUntil: 'domcontentloaded',
        });
      } catch (error) {
        failures.push(`${story.id}: navigation failed (${error instanceof Error ? error.message : String(error)})`);
        continue;
      }

      const overflow = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const documentWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth ?? 0,
        );

        if (documentWidth <= viewportWidth + 1) {
          return null;
        }

        const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .filter(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return (
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              rect.width > 0 &&
              (rect.right > viewportWidth + 1 || rect.left < -1)
            );
          })
          .slice(0, 5)
          .map(element => {
            const rect = element.getBoundingClientRect();
            const name = element.className
              ? `${element.tagName.toLowerCase()}.${String(element.className).trim().replace(/\s+/g, '.')}`
              : element.tagName.toLowerCase();
            return `${name} [left=${Math.round(rect.left)}, right=${Math.round(rect.right)}, width=${Math.round(rect.width)}]`;
          });

        return { viewportWidth, documentWidth, offenders };
      });

      if (overflow) {
        failures.push(
          `${story.id} (${story.title ?? ''} / ${story.name ?? ''}): viewport ${overflow.viewportWidth}px, document ${overflow.documentWidth}px${
            overflow.offenders.length ? `; ${overflow.offenders.join(' | ')}` : ''
          }`,
        );
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
}
