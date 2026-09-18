import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/Badge/Badge.css', 'utf8');

describe('Badge visual contract', () => {
  it('keeps the Figma size, typography and shape tokens', () => {
    expect(css).toContain('height: var(--elements-16)');
    expect(css).toContain('height: var(--elements-20)');
    expect(css).toContain('height: var(--elements-24)');
    expect(css).toContain('height: var(--elements-28)');
    expect(css).toContain('border-radius: var(--radius-small)');
    expect(css).toContain('border-radius: var(--radius-full)');
    expect(css).toContain('font-family: var(--page-overline-family)');
    expect(css).toContain('font-family: var(--page-caption-family)');
    expect(css).toContain('font-family: var(--page-body-family)');
    expect(css).toContain('font-family: var(--page-subtitle-family)');
  });

  it('uses the shared Skeleton token and animation', () => {
    expect(css).toContain('background: var(--background-base-skeleton)');
    expect(css).toContain('.fdoc-badge__skeleton::after');
    expect(css).toContain('.fdoc-badge__skeleton-dot');
  });
});
