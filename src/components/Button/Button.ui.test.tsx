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
    expect(css).toContain('font-size: var(--page-caption-size)');
    expect(css).toContain('line-height: var(--page-caption-line-height)');
    expect(css).toContain('.fdoc-button__text {');
    expect(css).toContain('.fdoc-button--medium .fdoc-button__text');
    expect(css).toContain('.fdoc-button--large .fdoc-button__text');
    expect(css).toContain('font-family: var(--page-body-family)');
    expect(css).toContain('font-weight: var(--page-body-weight-strong)');
    expect(css).toContain('font-family: var(--page-subtitle-family)');
    expect(css).toContain('font-weight: var(--page-subtitle-weight-strong)');
    expect(css).toContain('padding-top: var(--space-2)');
    expect(css).toContain('padding-top: var(--space-4)');
  });

  it('uses the external Figma focus stroke without changing the button box', () => {
    expect(css).toContain('border: 0');
    expect(css).toContain('outline: var(--border-large) solid var(--fdoc-button-focus-border)');
    expect(css).not.toContain('padding: calc(var(--fdoc-button-padding-y)');
    expect(css).not.toContain('box-shadow');
  });

  it('lets Badge slots hug their content and uses size-specific slot padding', () => {
    expect(css).toContain('flex: 0 0 auto');
    expect(css).toContain('height: auto');
    expect(css).toContain('.fdoc-button--large .fdoc-button__badge--left');
    expect(css).toContain('padding-left: var(--space-8)');
    expect(css).toContain('padding-right: var(--space-8)');
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
