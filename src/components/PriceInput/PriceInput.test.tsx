import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  PRICE_INPUT_MAX,
  PRICE_INPUT_RANGE_ERROR,
  PriceInput,
  formatPriceValue,
  isValidPriceValue,
  normalizePriceValue,
  priceValueToNumber,
} from './PriceInput';

describe('PriceInput helpers', () => {
  it('normalizes common copied price formats', () => {
    expect(normalizePriceValue('123 456,78 ₽')).toBe('123456,78');
    expect(normalizePriceValue('123456.78')).toBe('123456,78');
    expect(normalizePriceValue('1.234,56')).toBe('1234,56');
    expect(normalizePriceValue('1,234.56')).toBe('1234,56');
    expect(normalizePriceValue(',5')).toBe('0,5');
  });

  it('formats thousands with non-breaking spaces', () => {
    expect(formatPriceValue('123456,78')).toBe('123\u00a0456,78');
  });

  it('validates the Figma price range', () => {
    expect(isValidPriceValue('1')).toBe(true);
    expect(isValidPriceValue('0,99')).toBe(false);
    expect(isValidPriceValue(String(PRICE_INPUT_MAX).replace('.', ','))).toBe(true);
    expect(priceValueToNumber('123,45')).toBe(123.45);
    expect(PRICE_INPUT_RANGE_ERROR).toContain('9 999 999,99');
  });
});

describe('PriceInput', () => {
  it('renders formatted value and currency through Input anatomy', () => {
    render(<PriceInput defaultValue="123456,78" />);
    expect(screen.getByRole('textbox')).toHaveValue('123\u00a0456,78');
    expect(screen.getByTestId('input-sum')).toHaveTextContent('₽');
  });

  it('reports normalized value while typing', () => {
    const change = vi.fn();
    render(<PriceInput onValueChange={change} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1 234,5' } });
    expect(change).toHaveBeenLastCalledWith('1234,5');
  });

  it('normalizes a pasted full value', () => {
    const change = vi.fn();
    render(<PriceInput onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(0, 0);

    fireEvent.paste(input, {
      clipboardData: { getData: () => '9 876,54 ₽' },
    });

    expect(change).toHaveBeenLastCalledWith('9876,54');
  });

  it('inserts pasted digits at the caret instead of replacing the full value', () => {
    const change = vi.fn();
    render(<PriceInput defaultValue="1234,56" onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(1, 1);

    fireEvent.paste(input, {
      clipboardData: { getData: () => '99' },
    });

    expect(change).toHaveBeenLastCalledWith('199234,56');
  });

  it('replaces only the selected range on paste', () => {
    const change = vi.fn();
    render(<PriceInput defaultValue="1234,56" onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(2, 4);

    fireEvent.paste(input, {
      clipboardData: { getData: () => '99' },
    });

    expect(change).toHaveBeenLastCalledWith('1994,56');
  });

  it('counts only entered digits', () => {
    render(<PriceInput defaultValue="1234,5" counter maxLength={100} />);
    expect(screen.getByTestId('input-counter')).toHaveTextContent('5 / 100');
  });

  it('clears the normalized value through the shared Input clear action', () => {
    const change = vi.fn();
    const clear = vi.fn();
    render(<PriceInput defaultValue="123" onValueChange={change} onClear={clear} />);
    fireEvent.click(screen.getByTestId('input-clear'));
    expect(change).toHaveBeenLastCalledWith('');
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it('keeps controlled value immutable until the parent updates it', () => {
    const change = vi.fn();
    render(<PriceInput value="123" onValueChange={change} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } });
    expect(change).toHaveBeenLastCalledWith('1234');
    expect(screen.getByRole('textbox')).toHaveValue('123');
  });
});
