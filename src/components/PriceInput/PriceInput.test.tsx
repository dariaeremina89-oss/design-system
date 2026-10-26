import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  PRICE_INPUT_FORMAT_ERROR,
  PRICE_INPUT_MAX,
  PRICE_INPUT_MAX_DIGITS,
  PRICE_INPUT_RANGE_ERROR,
  PriceInput,
  formatPriceValue,
  getPriceFormatError,
  getPriceRangeError,
  isValidPriceValue,
  normalizePriceValue,
  priceValueToNumber,
  resolveCurrencySymbol,
} from './PriceInput';

describe('PriceInput helpers', () => {
  it('normalizes common copied price formats', () => {
    expect(normalizePriceValue('123 456,78 ₽')).toBe('123456,78');
    expect(normalizePriceValue('123456.78')).toBe('123456,78');
    expect(normalizePriceValue('1.234,56')).toBe('1234,56');
    expect(normalizePriceValue('1,234.56')).toBe('1234,56');
    expect(normalizePriceValue(',5')).toBe('0,5');
  });

  it('resolves ISO currency codes and keeps custom symbols', () => {
    expect(resolveCurrencySymbol('RUB')).toBe('₽');
    expect(resolveCurrencySymbol('USD')).toBe('$');
    expect(resolveCurrencySymbol('EUR')).toBe('€');
    expect(resolveCurrencySymbol('руб.')).toBe('руб.');
  });

  it('uses the resolved currency symbol in range errors', () => {
    expect(getPriceRangeError(1, 1000, 'USD')).toBe('Введите сумму от 1 до 1 000 $');
  });

  it('builds the format error from the configured separator', () => {
    expect(PRICE_INPUT_FORMAT_ERROR).toBe('Можно ввести только цифры и ","');
    expect(getPriceFormatError(',')).toBe('Можно ввести только цифры и ","');
    expect(getPriceFormatError('.')).toBe('Можно ввести только цифры и "."');
  });

  it('allows format error copy to be overridden for another locale or scenario', () => {
    render(<PriceInput defaultValue="12" currency="USD" formatErrorText="Use the expected amount format" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '12a' } });
    expect(screen.getByText('Use the expected amount format')).toBeInTheDocument();
  });

  it('formats thousands with non-breaking spaces', () => {
    expect(formatPriceValue('123456,78')).toBe('123\u00a0456,78');
  });

  it('validates the Figma price range', () => {
    expect(isValidPriceValue('1', 1, PRICE_INPUT_MAX)).toBe(true);
    expect(isValidPriceValue('0,99', 1, PRICE_INPUT_MAX)).toBe(false);
    expect(isValidPriceValue(String(PRICE_INPUT_MAX).replace('.', ','), 1, PRICE_INPUT_MAX)).toBe(true);
    expect(priceValueToNumber('123,45')).toBe(123.45);
    expect(PRICE_INPUT_RANGE_ERROR).toContain('9 999 999,99');
  });
});

describe('PriceInput', () => {
  it('renders formatted value with currency immediately after the value', () => {
    render(<PriceInput defaultValue="123456,78" />);
    expect(screen.getByRole('textbox')).toHaveValue('123\u00a0456,78');
    expect(screen.getByTestId('input-inline-suffix')).toHaveTextContent('₽');
    expect(screen.queryByTestId('input-sum')).toBe(null);
  });

  it('renders an ISO currency code as its symbol', () => {
    render(<PriceInput defaultValue="1234,56" currency="USD" />);
    expect(screen.getByTestId('input-inline-suffix')).toHaveTextContent(String.fromCharCode(36));
  });

  it('accepts the interpreted currency symbol on paste', () => {
    const change = vi.fn();
    render(<PriceInput currency="USD" onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(0, 0);

    fireEvent.paste(input, {
      clipboardData: { getData: () => `1 234,56 ${String.fromCharCode(36)}` },
    });

    expect(change).toHaveBeenLastCalledWith('1234,56');
    expect(screen.queryByText(PRICE_INPUT_FORMAT_ERROR)).toBe(null);
  });

  it('accepts the ISO currency code itself on paste', () => {
    const change = vi.fn();
    render(<PriceInput currency="USD" onValueChange={change} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    input.setSelectionRange(0, 0);

    fireEvent.paste(input, {
      clipboardData: { getData: () => '1 234,56 USD' },
    });

    expect(change).toHaveBeenLastCalledWith('1234,56');
    expect(screen.queryByText(PRICE_INPUT_FORMAT_ERROR)).toBe(null);
  });

  it('reports normalized value while typing', () => {
    const change = vi.fn();
    render(<PriceInput onValueChange={change} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234,5' } });
    expect(change).toHaveBeenLastCalledWith('1234,5');
  });

  it('keeps the same focused input after the first character', () => {
    render(<PriceInput />);
    const input = screen.getByRole('textbox');
    input.focus();

    fireEvent.change(input, { target: { value: '1' } });

    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveFocus();
    expect(input).toHaveValue('1');
    expect(screen.getByTestId('input-inline-suffix')).toHaveTextContent('₽');
  });

  it('shows range error below the minimum and above the maximum', () => {
    const { rerender } = render(<PriceInput value="0,99" min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.getByText(PRICE_INPUT_RANGE_ERROR)).toBeInTheDocument();

    rerender(<PriceInput value="10000000" min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.getByText(PRICE_INPUT_RANGE_ERROR)).toBeInTheDocument();
  });

  it('removes range error when the value returns to the allowed range', () => {
    const { rerender } = render(<PriceInput value="10000000" min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.getByText(PRICE_INPUT_RANGE_ERROR)).toBeInTheDocument();

    rerender(<PriceInput value="9999999,99" min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.queryByText(PRICE_INPUT_RANGE_ERROR)).toBe(null);
  });

  it('does not treat an empty or incomplete decimal value as a range error', () => {
    const { rerender } = render(<PriceInput value="" min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.queryByText(PRICE_INPUT_RANGE_ERROR)).toBe(null);

    rerender(<PriceInput value="1," min={1} max={PRICE_INPUT_MAX} />);
    expect(screen.queryByText(PRICE_INPUT_RANGE_ERROR)).toBe(null);
  });

  it('keeps external validation above the built-in range validation', () => {
    render(<PriceInput value="0" min={1} max={PRICE_INPUT_MAX} error="Внешняя ошибка" />);
    expect(screen.getByText('Внешняя ошибка')).toBeInTheDocument();
    expect(screen.queryByText(PRICE_INPUT_RANGE_ERROR)).toBe(null);
  });

  it('shows format error and keeps the previous value for unsupported typed characters', () => {
    render(<PriceInput defaultValue="12" />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '12a' } });
    expect(input).toHaveValue('12');
    expect(screen.getByTestId('input-error').textContent).toBe(PRICE_INPUT_FORMAT_ERROR);

    fireEvent.change(input, { target: { value: '12,3' } });
    expect(input).toHaveValue('12,3');
    expect(screen.queryByText(PRICE_INPUT_FORMAT_ERROR)).toBe(null);
  });

  it('normalizes a typed decimal dot to a comma for alternate mobile locales', () => {
    render(<PriceInput defaultValue="12" />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '12.5' } });
    expect(input).toHaveValue('12,5');
    expect(screen.queryByText(PRICE_INPUT_FORMAT_ERROR)).toBe(null);
  });

  it('keeps decimal keyboard hint and a pattern compatible with formatted values', () => {
    render(<PriceInput />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('pattern', '[0-9\\s,]*');
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

  it('keeps maxLength independent from the numeric max', () => {
    render(<PriceInput defaultValue="12345" max={1000} maxLength={9} counter />);

    expect(screen.getByRole('textbox')).toHaveValue('12\u00a0345');
    expect(screen.getByTestId('input-counter')).toHaveTextContent('5 / 9');
    expect(screen.getByTestId('input-error')).toHaveTextContent('Введите сумму не больше 1 000 ₽');
  });

  it('counts only entered digits against maxLength when it is provided', () => {
    render(<PriceInput defaultValue="1234,5" counter maxLength={PRICE_INPUT_MAX_DIGITS} />);
    expect(screen.getByTestId('input-counter')).toHaveTextContent('5 / 9');
  });

  it('limits digits by maxLength even without a numeric max', () => {
    render(<PriceInput defaultValue="1234567890" counter maxLength={9} />);
    expect(screen.getByRole('textbox')).toHaveValue('123\u00a0456\u00a0789');
    expect(screen.getByTestId('input-counter')).toHaveTextContent('9 / 9');
    expect(screen.queryByTestId('input-error')).toBe(null);
  });

  it('shows only the digit count when counter is automatic and maxLength is absent', () => {
    render(<PriceInput defaultValue="1234,5" counter />);
    expect(screen.getByTestId('input-counter')).toHaveTextContent('5');
  });

  it('keeps a custom counter independent from maxLength and range', () => {
    render(<PriceInput defaultValue="123" counter="Свое значение" maxLength={9} max={1000} />);
    expect(screen.getByTestId('input-counter')).toHaveTextContent('Свое значение');
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
