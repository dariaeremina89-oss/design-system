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
  it('keeps SingleFileInput Figma spacing, validation geometry and inset stroke', () => {
    render(<SingleFileInput />);
    expectRuleValue('.fdoc-single-file-input', 'min-height', '48px');
    expectRuleValue('.fdoc-single-file-input', 'padding', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input', 'border', '0px');
    expectRuleValue('.fdoc-single-file-input', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-single-file-input', 'background', 'var(--background-base-secondary)');
    expectRuleValue('.fdoc-single-file-input::before', 'inset', '0');
    expectRuleValue('.fdoc-single-file-input::before', 'border', 'var(--border-small) solid var(--border-base-light)');
    expectRuleValue('.fdoc-single-file-input--validation-error', 'align-items', 'flex-start');
    expectRuleValue('.fdoc-single-file-input__content', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-single-file-input__validation-message', 'line-height', 'var(--page-caption-line-height)');
    expectRuleValue('.fdoc-single-file-input__pick', 'flex', '0 0 auto');
  });

  it('keeps FileRow dimensions, spacing, inset border and semantic Message tokens from Figma', () => {
    render(<FileRow />);
    expectRuleValue('.fdoc-file-row', 'width', '100%');
    expectRuleValue('.fdoc-file-row', 'min-height', '48px');
    expectRuleValue('.fdoc-file-row', 'padding', 'var(--space-12) var(--space-8)');
    expectRuleValue('.fdoc-file-row', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-file-row', 'border', '0px');
    expectRuleValue('.fdoc-file-row', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-file-row::before', 'inset', '0');
    expectRuleValue('.fdoc-file-row::before', 'border', 'var(--border-small) solid var(--border-base-light)');
    expectRuleValue('.fdoc-file-row__line', 'gap', 'var(--space-16)');
    expectRuleValue('.fdoc-file-row__right', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-file-row__message', 'overflow-wrap', 'anywhere');
    expectRuleValue('.fdoc-file-row__message--warning', 'color', 'var(--text-warning-secondary)');
    expectRuleValue('.fdoc-file-row__message--error', 'color', 'var(--text-error-secondary)');
    expectRuleValue('.fdoc-file-row--message-warning .fdoc-file-row__leading--semantic', 'color', 'var(--icon-warning-secondary)');
    expectRuleValue('.fdoc-file-row--message-error .fdoc-file-row__leading--semantic', 'color', 'var(--icon-error-secondary)');
  });

  it('preserves FileRow additional content when file name is long', () => {
    render(<FileRow fileName="Очень длинное название файла которое должно сокращаться.pdf" weight="2,7 МБ" />);
    expectRuleValue('.fdoc-file-row__line > .fdoc-tooltip-anchor', 'flex', '1 1 0');
    expectRuleValue('.fdoc-file-row__line > .fdoc-tooltip-anchor', 'width', '0px');
    expectRuleValue('.fdoc-file-row__right', 'flex', '0 0 auto');
    expectRuleValue('.fdoc-file-row__right', 'min-width', 'max-content');
    expectRuleValue('.fdoc-file-row__additional', 'flex', '0 0 auto');
    expectRuleValue('.fdoc-file-row__additional', 'white-space', 'nowrap');
  });

  it('keeps the FileRow reorder insertion indicator from Figma', () => {
    render(<FileRow />);
    expectRuleValue('.fdoc-file-row-drop-indicator', 'width', '100%');
    expectRuleValue('.fdoc-file-row-drop-indicator', 'height', '2px');
    expectRuleValue('.fdoc-file-row-drop-indicator', 'border-radius', 'var(--radius-smallest)');
    expectRuleValue('.fdoc-file-row-drop-indicator', 'background', 'var(--border-accent-default)');
  });

  it('keeps Dropzone inset border, radius and state tokens from Figma', () => {
    render(<Dropzone />);
    expectRuleValue('.fdoc-dropzone', 'padding', 'var(--space-12) var(--space-16)');
    expectRuleValue('.fdoc-dropzone', 'border', '0px');
    expectRuleValue('.fdoc-dropzone', 'border-radius', 'var(--radius-small)');
    expectRuleValue('.fdoc-dropzone::before', 'inset', '0');
    expectRuleValue('.fdoc-dropzone::before', 'border', 'var(--border-middle) dashed var(--fdoc-dropzone-border-color)');
    expectRuleValue('.fdoc-dropzone--hover, .fdoc-dropzone--drag-over', 'background', 'var(--background-primary-secondary-hover)');
    expectRuleValue('.fdoc-dropzone--pressed', 'background', 'var(--transparent-background-primary-pressed)');
    expectRuleValue('.fdoc-dropzone--error', '--fdoc-dropzone-border-color', 'var(--border-error-default)');
    expectRuleValue('.fdoc-dropzone--error .fdoc-dropzone__icon', 'color', 'var(--icon-error-secondary)');
    expectRuleValue('.fdoc-dropzone--error strong', 'color', 'var(--text-error-secondary)');
    expectRuleValue('.fdoc-dropzone--disabled', '--fdoc-dropzone-border-color', 'var(--border-base-default-disabled)');
    expectRuleValue('.fdoc-dropzone--disabled .fdoc-dropzone__icon', 'color', 'var(--icon-base-default-light-disabled)');
    expectRuleValue('.fdoc-dropzone--center.fdoc-dropzone--disabled', 'min-height', '116px');
    expectRuleValue('.fdoc-dropzone-skeleton', 'height', '132px');
    expectRuleValue('.fdoc-dropzone-skeleton--center', 'height', '152px');
    expectRuleValue('.fdoc-dropzone-skeleton > .fdoc-skeleton', 'border-radius', 'var(--radius-small)');
  });

  it('keeps MultipleFileInput and Group FileRow gaps from Figma', () => {
    render(<MultipleFileInput files={[]} />);
    expectRuleValue('.fdoc-multiple-file-input', 'gap', 'var(--space-16)');
    expectRuleValue('.fdoc-multiple-file-input', 'width', '100%');
    expectRuleValue('.fdoc-multiple-file-input', 'max-width', '100%');
    expectRuleValue('.fdoc-multiple-file-input__control', 'align-items', 'stretch');
    expectRuleValue('.fdoc-multiple-file-input__control', 'gap', 'var(--space-24)');
    expectRuleValue('.fdoc-multiple-file-input__list', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-multiple-file-input__files', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-multiple-file-input__group', 'gap', 'var(--space-16)');
  });
});
