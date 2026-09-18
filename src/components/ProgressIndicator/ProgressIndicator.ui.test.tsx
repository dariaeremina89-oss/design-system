import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/ProgressIndicator/ProgressIndicator.css', 'utf8');

describe('ProgressIndicator visual contract', () => {
  it('keeps the Figma Linear geometry and tokens', () => {
    expect(css).toContain('height: var(--space-4)');
    expect(css).toContain('background: var(--fdoc-progress-track)');
    expect(css).toContain('background: var(--fdoc-progress-indicator)');
    expect(css).toContain('border-radius: var(--radius-middle)');
  });

  it('keeps Circular stroke and color scheme tokens', () => {
    expect(css).toContain('stroke-width: 2');
    expect(css).toContain('--fdoc-progress-indicator: var(--background-base-default)');
    expect(css).toContain('--fdoc-progress-track: var(--background-base-inverse-light)');
    expect(css).toContain('--fdoc-progress-indicator: var(--background-base-inverse)');
  });

  it('centralizes the two Figma motion loops and reduced-motion fallback', () => {
    expect(css).toContain('@keyframes fdoc-progress-linear-indeterminate');
    expect(css).toContain('@keyframes fdoc-progress-circular-indeterminate');
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
