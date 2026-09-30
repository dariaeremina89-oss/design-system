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
  it('keeps SingleFileInput empty-state Figma spacing, validation geometry and inset stroke', () => {
    render(<SingleFileInput />);
    expectRuleValue('.fdoc-single-file-input--empty', 'min-height', '48px');
    expectRuleValue('.fdoc-single-file-input--empty', 'padding', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input--empty', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-single-file-input--empty', 'border', '0px');
    expectRuleValue('.fdoc-single-file-input--empty', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-single-file-input--empty', 'background', 'var(--background-base-secondary)');
    expectRuleValue('.fdoc-single-file-input--empty::before', 'inset', '0');
    expectRuleValue('.fdoc-single-file-input--empty::before', 'border', 'var(--border-small) solid var(--border-base-light)');
    expectRuleValue('.fdoc-single-file-input--empty.fdoc-single-file-input--validation-error', 'align-items', 'flex-start');
    expectRuleValue('.fdoc-single-file-input__content', 'gap', 'var(--space-4)');
    expectRuleValue('.fdoc-single-file-input__validation-message', 'line-height', 'var(--page-caption-line-height)');
    expectRuleValue('.fdoc-single-file-input__pick', 'flex', '0 0 auto');
  });

  it('keeps shared filled-file dimensions, spacing, inset border and semantic Message tokens', () => {
    render(<FileRow />);
    expectRuleValue('.fdoc-file-item', 'width', '100%');
    expectRuleValue('.fdoc-file-item', 'min-height', '48px');
    expectRuleValue('.fdoc-file-item', 'padding', 'var(--space-12) var(--space-8)');
    expectRuleValue('.fdoc-file-item', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-file-item', 'border', '0px');
    expectRuleValue('.fdoc-file-item', 'border-radius', 'var(--radius-middle)');
    expectRuleValue('.fdoc-file-item::before', 'inset', '0');
    expectRuleValue('.fdoc-file-item::before', 'border', 'var(--border-small) solid var(--border-base-light)');
    expectRuleValue('.fdoc-file-item__line', 'gap', 'var(--space-16)');
    expectRuleValue('.fdoc-file-item__right', 'gap', 'var(--space-8)');
    expectRuleValue('.fdoc-file-item__message', 'overflow-wrap', 'anywhere');
    expectRuleValue('.fdoc-file-item__message--warning', 'color', 'var(--text-warning-secondary)');
    expectRuleValue('.fdoc-file-item__message--error', 'color', 'var(--text-error-secondary)');
    expectRuleValue('.fdoc-file-item--message-warning .fdoc-file-item__leading--semantic', 'color', 'var(--icon-warning-secondary)');
    expectRuleValue('.fdoc-file-item--message-error .fdoc-file-item__leading--semantic', 'color', 'var(--icon-error-secondary)');
  });

  it('uses the same shared filled-file layout in SingleFileInput without rendering FileRow', () => {
    const { queryByTestId, getByTestId } = render(
      <SingleFileInput fileProps={{ fileName: 'document.pdf', weight: '2,7 МБ' }} />,
    );
    expect(getByTestId('single-file-input')).toHaveClass('fdoc-file-item');
    expect(getByTestId('single-file-input')).toHaveClass('fdoc-single-file-input--filled');
    expect(queryByTestId('file-row')).not.toBeInTheDocument();
  });

  it('preserves additional content when file name is long for both file components', () => {
    render(<FileRow fileName="Очень длинное название файла которое должно сокращаться.pdf" weight="2,7 МБ" />);
    expectRuleValue('.fdoc-file-item__line > .fdoc-tooltip-anchor', 'flex-grow', '1');
    expectRuleValue('.fdoc-file-item__line > .fdoc-tooltip-anchor', 'flex-shrink', '1');
    expectRuleValue('.fdoc-file-item__line > .fdoc-tooltip-anchor', 'flex-basis', '0px');
    expectRuleValue('.fdoc-file-item__line > .fdoc-tooltip-anchor', 'width', '0px');
    expectRuleValue('.fdoc-file-item__right', 'flex-grow', '0');
    expectRuleValue('.fdoc-file-item__right', 'flex-shrink', '0');
    expectRuleValue('.fdoc-file-item__right', 'min-width', 'max-content');
    expectRuleValue('.fdoc-file-item__additional', 'flex-grow', '0');
    expectRuleValue('.fdoc-file-item__additional', 'flex-shrink', '0');
    expectRuleValue('.fdoc-file-item__additional', 'white-space', 'nowrap');
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
