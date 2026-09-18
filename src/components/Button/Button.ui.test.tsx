import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/Button/Button.css', 'utf8');

describe('Button visual contract', () => {
  it('locks the Figma geometry and typography tokens in CSS', () => {
    expect(css).toContain('box-sizing: border-box');
    expect(css).toContain('height: var(--fdoc-button-height)');
    expect(css).toContain('border-radius: var(--radius-middle)');
    expect(css).toContain('font-family: var(--page-caption-family)');
    expect(css).toContain('font-weight: var(--page-caption-weight-strong)');
    expect(css).toContain('font-size: var(--font-size-12)');
    expect(css).toContain('line-height: var(--line-height-16)');
    expect(css).not.toContain('font-size: var(--page-caption-size)');
    expect(css).not.toContain('line-height: var(--page-caption-line-height)');
  });

  it('reserves the focus border without changing the button box', () => {
    expect(css).toContain('border: var(--border-large) solid transparent');
    expect(css).toContain('padding: calc(var(--fdoc-button-padding-y) - var(--border-large))');
    expect(css).toContain('border-color: var(--fdoc-button-focus-border)');
    expect(css).not.toContain('box-shadow');
  });

  it('keeps hover and pressed scoped to background only', () => {
    expect(css).toContain('background: var(--fdoc-button-background-hover)');
    expect(css).toContain('background: var(--fdoc-button-background-pressed)');
    expect(css).not.toMatch(/fdoc-button--hover[^}]*color:/s);
    expect(css).not.toMatch(/fdoc-button--pressed[^}]*color:/s);
  });

  it('uses shared Skeleton animation and the Button radius override', () => {
    expect(css).toContain('background: var(--background-base-skeleton)');
    expect(css).toContain('border-radius: var(--radius-middle)');
    expect(css).toContain('.fdoc-button__skeleton::after');
  });

  it('keeps the loading slot inside the normal icon geometry', () => {
    expect(css).toContain('.fdoc-button__loading .fdoc-progress');
    expect(css).toContain('width: 100%');
    expect(css).toContain('height: 100%');
  });
});
