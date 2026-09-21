import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

function findRule(selector: string): CSSStyleRule {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;

    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if ('selectorText' in rule && rule.selectorText === selector) {
        return rule as CSSStyleRule;
      }
    }
  }

  throw new Error(`CSS rule not found: ${selector}`);
}

function expectRuleValue(selector: string, property: string, value: string) {
  expect(findRule(selector).style.getPropertyValue(property).trim()).toBe(value);
}

describe('Input visual contract', () => {
  it('keeps typography, colors, spacing, radius and border references on tokens', () => {
    render(<Input label="Label" placeholder="Placeholder" caption="Caption" />);

    expectRuleValue('.fdoc-field__label', 'font-size', 'var(--font-size-12)');
    expectRuleValue('.fdoc-field__label', 'line-height', 'var(--line-height-16)');
    expectRuleValue('.fdoc-field__label', 'color', 'var(--text-base-secondary)');
    expectRuleValue('.fdoc-field__label', 'padding', '0 var(--space-12)');

    expectRuleValue('.fdoc-input__field', 'padding', 'var(--space-12)');
    expectRuleValue('.fdoc-field__field', 'border', 'var(--border-small) solid var(--border-base-secondary)');
    expectRuleValue('.fdoc-field__field', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-field__field', 'background', 'var(--background-base-default)');

    expectRuleValue('.fdoc-input__content', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-field__control', 'font-size', 'var(--font-size-16)');
    expectRuleValue('.fdoc-field__control', 'line-height', 'var(--line-height-24)');
    expectRuleValue('.fdoc-field__control', 'color', 'var(--text-base-default)');
    expectRuleValue('.fdoc-field__helper', 'gap', 'var(--space-16)');
    expectRuleValue('.fdoc-field__helper', 'padding', '0 var(--space-12)');
    expectRuleValue('.fdoc-input__sum-icon', 'width', 'var(--elements-24)');
    expectRuleValue('.fdoc-input__sum-icon', 'height', 'var(--elements-24)');
    expectRuleValue('.fdoc-input__sum-icon', 'padding', 'var(--space-4)');
  });

  it('keeps Small dimensions and padding on the size token', () => {
    render(<Input size="small" label="Label" />);

    expectRuleValue('.fdoc-input--small .fdoc-input__field', 'min-height', 'var(--size-input-small)');
    expectRuleValue('.fdoc-input--small .fdoc-input__field', 'padding-top', 'var(--space-8)');
    expectRuleValue('.fdoc-input--small .fdoc-input__field', 'padding-bottom', 'var(--space-8)');
  });

  it('keeps Focused and Error border states on the correct tokens', () => {
    expectRuleValue('.fdoc-field__field:focus-within', 'border-width', 'var(--border-middle)');
    expectRuleValue('.fdoc-field__field:focus-within', 'border-color', 'var(--border-primary-default)');
    expectRuleValue('.fdoc-field__field.fdoc-field__field--error', 'border-color', 'var(--border-error-default)');
    expectRuleValue('.fdoc-field__field.fdoc-field__field--error:focus-within', 'border-color', 'var(--border-error-default)');
    expectRuleValue('.fdoc-field__field.fdoc-field__field--error.fdoc-field__field--disabled', 'border-color', 'var(--border-error-disabled)');
    expectRuleValue('.fdoc-field__field.fdoc-field__field--disabled', 'background', 'var(--background-base-default-disabled)');
  });

  it('keeps foundation typography and effect tokens available', () => {
    const root = getComputedStyle(document.documentElement);

    expect(root.getPropertyValue('--font-family-sans').trim()).toBe('Inter, Arial, sans-serif');
    expect(root.getPropertyValue('--font-size-16').trim()).toBe('16px');
    expect(root.getPropertyValue('--line-height-24').trim()).toBe('24px');
    expect(root.getPropertyValue('--space-12').trim()).toBe('12px');
    expect(root.getPropertyValue('--radius-middle').trim()).toBe('8px');
    expect(root.getPropertyValue('--border-small').trim()).toBe('1px');
    expect(root.getPropertyValue('--border-middle').trim()).toBe('2px');
    expect(root.getPropertyValue('--shadow-xs').trim()).toBe('var(--drop-shadow-shadow-xs)');
  });
});
