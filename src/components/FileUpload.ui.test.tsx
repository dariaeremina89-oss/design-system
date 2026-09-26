import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dropzone } from './Dropzone/Dropzone';
import { FileRow } from './FileRow/FileRow';
import { MultipleFileInput } from './MultipleFileInput/MultipleFileInput';
import { SingleFileInput } from './SingleFileInput/SingleFileInput';

function findRule(selector: string): CSSStyleRule {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules)) {
      if ('selectorText' in rule && rule.selectorText === selector) return rule as CSSStyleRule;
    }
  }
  throw new Error(`CSS rule not found: ${selector}`);
}

function expectRuleValue(selector: string, property: string, value: string) {
  expect(findRule(selector).style.getPropertyValue(property).trim()).toBe(value);
}

describe('File upload visual contract', () => {
  it('keeps SingleFileInput Figma spacing and foundation tokens', () => {
    render(<SingleFileInput />);
    expectRuleValue('.fdoc-single-file-input', 'min-height', '48px');
    expectRuleValue('.fdoc-single-file-input', 'padding', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-single-file-input', 'background', 'var(--background-base-secondary)');
  });

  it('keeps FileRow dimensions, spacing and typography on Figma tokens', () => {
    render(<FileRow />);
    expectRuleValue('.fdoc-file-row', 'min-height', '48px');
    expectRuleValue('.fdoc-file-row', 'padding', 'var(--space-12) var(--space-8)');
    expectRuleValue('.fdoc-file-row', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-file-row', 'border', 'var(--border-small) solid var(--border-base-light)');
    expectRuleValue('.fdoc-file-row', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-file-row__line', 'gap', 'var(--space-16)');
  });

  it('keeps Dropzone border, radius and state tokens from Figma', () => {
    render(<Dropzone />);
    expectRuleValue('.fdoc-dropzone', 'padding', 'var(--space-8) var(--space-16)');
    expectRuleValue('.fdoc-dropzone', 'border', 'var(--border-middle) dashed var(--border-primary-default)');
    expectRuleValue('.fdoc-dropzone', 'border-radius', 'var(--radius-small)');
    expectRuleValue('.fdoc-dropzone--hover, .fdoc-dropzone--drag-over', 'background', 'var(--background-primary-secondary-hover)');
    expectRuleValue('.fdoc-dropzone--pressed', 'background', 'var(--transparent-background-primary-pressed)');
    expectRuleValue('.fdoc-dropzone-skeleton', 'height', '108px');
    expectRuleValue('.fdoc-dropzone-skeleton--center', 'height', '152px');
  });

  it('keeps MultipleFileInput and Group FileRow gaps from Figma', () => {
    render(<MultipleFileInput files={[]} />);
    expectRuleValue('.fdoc-multiple-file-input', 'gap', 'var(--space-16)');
    expectRuleValue('.fdoc-multiple-file-input', 'width', '100%');
    expectRuleValue('.fdoc-multiple-file-input', 'max-width', '100%');
    expectRuleValue('.fdoc-multiple-file-input__control', 'align-items', 'stretch');
    expectRuleValue('.fdoc-multiple-file-input__control', 'gap', 'var(--space-24)');
    expectRuleValue('.fdoc-multiple-file-input__list', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-multiple-file-input__group', 'gap', 'var(--space-16)');
  });
});
