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

      const audit = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const documentWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth ?? 0,
        );

        const overflow = documentWidth > viewportWidth + 1
          ? Array.from(document.querySelectorAll<HTMLElement>('body *'))
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
              })
          : [];

        const isFixedDimension = (value: string) => Boolean(value)
          && !/(%|vw|vh|vmin|vmax|calc\(|clamp\(|min\(|max\(|auto|fit-content|stretch)/i.test(value);

        const skeletonIssues = Array.from(document.querySelectorAll<HTMLElement>('.fdoc-skeleton'))
          .flatMap((element, index) => {
            const computed = getComputedStyle(element);
            if (computed.display === 'none' || computed.visibility === 'hidden') return [];

            const rect = element.getBoundingClientRect();
            const issues: string[] = [];
            const label = `${element.className || 'fdoc-skeleton'}#${index}`;

            if (rect.width <= 0.5 || rect.height <= 0.5) {
              issues.push(`${label} collapsed to ${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`);
              return issues;
            }

            const clone = element.cloneNode(false) as HTMLElement;
            clone.removeAttribute('id');
            clone.style.position = 'fixed';
            clone.style.left = '-10000px';
            clone.style.top = '-10000px';
            clone.style.visibility = 'hidden';
            clone.style.flex = 'none';
            clone.style.maxWidth = 'none';
            clone.style.maxHeight = 'none';
            clone.style.font = computed.font;
            clone.style.lineHeight = computed.lineHeight;
            document.body.appendChild(clone);
            const natural = clone.getBoundingClientRect();
            clone.remove();

            if (
              isFixedDimension(element.style.width)
              && natural.width <= viewportWidth
              && rect.width + 1 < natural.width
            ) {
              issues.push(`${label} width shrank ${natural.width.toFixed(1)}→${rect.width.toFixed(1)}`);
            }

            if (
              isFixedDimension(element.style.height)
              && rect.height + 1 < natural.height
            ) {
              issues.push(`${label} height shrank ${natural.height.toFixed(1)}→${rect.height.toFixed(1)}`);
            }

            return issues;
          });

        return { viewportWidth, documentWidth, overflow, skeletonIssues };
      });

      if (audit.overflow.length) {
        failures.push(
          `${story.id} (${story.title ?? ''} / ${story.name ?? ''}): viewport ${audit.viewportWidth}px, document ${audit.documentWidth}px; ${audit.overflow.join(' | ')}`,
        );
      }

      if (audit.skeletonIssues.length) {
        failures.push(
          `${story.id} (${story.title ?? ''} / ${story.name ?? ''}) skeleton: ${audit.skeletonIssues.join(' | ')}`,
        );
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
}
