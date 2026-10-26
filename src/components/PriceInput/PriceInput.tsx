import {
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type Ref,
  type ReactNode,
} from 'react';
import { Input, type InputProps } from '../Input/Input';
import './PriceInput.css';

export const PRICE_INPUT_REQUIRED_ERROR = 'Обязательно для заполнения';
export const PRICE_INPUT_RANGE_ERROR = 'Введите сумму от 1 до 9 999 999,99 ₽';
export const PRICE_INPUT_FORMAT_ERROR = 'Введите сумму цифрами, дробную часть отделите запятой';

export const PRICE_INPUT_MIN = 1;
export const PRICE_INPUT_MAX = 9_999_999.99;
export const PRICE_INPUT_MAX_DIGITS = 9;

export function resolveCurrencySymbol(currency: string) {
  const value = currency.trim();
  if (!/^[A-Za-z]{3}$/.test(value)) return value;

  try {
    const currencyPart = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: value.toUpperCase(),
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find(part => part.type === 'currency');

    return currencyPart?.value || value;
  } catch {
    return value;
  }
}

function escapeRegExp(value: string) {
  const specialCharacters = '\\\\^$.*+?()[]{}|/';
  return Array.from(value, character =>
    specialCharacters.includes(character) ? `\\${character}` : character,
  ).join('');
}

function stripAcceptedCurrency(value: string, currency: string, currencySymbol: string) {
  return [currency, currencySymbol]
    .filter(Boolean)
    .reduce(
      (result, token) => result.replace(new RegExp(escapeRegExp(token), 'gi'), ''),
      value,
    );
}

function formatPriceLimit(value: number) {
  const normalized = Number.isInteger(value)
    ? String(value)
    : String(value).replace('.', ',');
  return formatPriceValue(normalized).replace(/\u00a0/g, ' ');
}

export function getPriceRangeError(
  min?: number,
  max?: number,
  currency = '₽',
) {
  const currencySymbol = resolveCurrencySymbol(currency);
  if (min !== undefined && max !== undefined) {
    return `Введите сумму от ${formatPriceLimit(min)} до ${formatPriceLimit(max)} ${currencySymbol}`;
  }
  if (min !== undefined) {
    return `Введите сумму не меньше ${formatPriceLimit(min)} ${currencySymbol}`;
  }
  if (max !== undefined) {
    return `Введите сумму не больше ${formatPriceLimit(max)} ${currencySymbol}`;
  }
  return undefined;
}

export interface PriceInputProps extends Omit<
  InputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onClear'
  | 'type'
  | 'inputMode'
  | 'sum'
  | 'sumIcon'
  | 'inlineSuffix'
  | 'name'
  | 'min'
  | 'max'
> {
  /** Нормализованное значение без разделителей тысяч, с запятой перед дробной частью. */
  value?: string;
  /** Начальное нормализованное значение. */
  defaultValue?: string;
  /** Имя итогового hidden input формы. */
  name?: string;
  /** ISO-код валюты или готовый символ/текст справа от введенного значения. */
  currency?: string;
  /** Минимально допустимая сумма. */
  min?: number;
  /** Максимально допустимая сумма. */
  max?: number;
  /** Текст ошибки недопустимого формата. Можно переопределить для другой локали или сценария. */
  formatErrorText?: ReactNode;
  /** Изменение нормализованного значения. */
  onValueChange?: (value: string) => void;
  /** Вызывается после очистки значения. */
  onClear?: () => void;
  /** Ref на нативный input. */
  ref?: Ref<HTMLInputElement>;
}

function priceCharacters(value: string) {
  return value
    .replace(/\u00a0/g, '')
    .replace(/\s/g, '')
    .replace(/₽/g, '')
    .replace(/[^\d.,]/g, '');
}

export function normalizePriceValue(value: string, maxLength?: number) {
  const source = priceCharacters(value);
  if (!source) return '';

  const separators = Array.from(source.matchAll(/[.,]/g));
  const lastSeparator = separators.at(-1);
  const digitsAfterLastSeparator = lastSeparator
    ? source.slice((lastSeparator.index ?? -1) + 1).replace(/\D/g, '').length
    : 0;
  const decimalIndex = lastSeparator && digitsAfterLastSeparator <= 2
    ? lastSeparator.index ?? -1
    : -1;

  let integer = '';
  let decimal = '';
  let digits = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (!/\d/.test(character)) continue;
    if (maxLength !== undefined && digits >= maxLength) continue;

    if (decimalIndex >= 0 && index > decimalIndex) {
      if (decimal.length < 2) decimal += character;
    } else {
      integer += character;
    }
    digits += 1;
  }

  if (decimalIndex < 0) return integer;
  return `${integer || '0'},${decimal}`;
}

export function formatPriceValue(value: string) {
  const normalized = normalizePriceValue(value);
  if (!normalized) return '';

  const [integer, decimal] = normalized.split(',');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return decimal !== undefined ? `${grouped},${decimal}` : grouped;
}

export function priceValueToNumber(value: string) {
  const normalized = normalizePriceValue(value);
  if (!normalized || normalized.endsWith(',')) return undefined;
  const number = Number(normalized.replace(',', '.'));
  return Number.isFinite(number) ? number : undefined;
}

export function isValidPriceValue(
  value: string,
  min?: number,
  max?: number,
) {
  const number = priceValueToNumber(value);
  if (number === undefined) return false;
  if (min !== undefined && number < min) return false;
  if (max !== undefined && number > max) return false;
  return true;
}

export function PriceInput({
  value: controlledValue,
  defaultValue = '',
  name,
  currency = '₽',
  min,
  max,
  formatErrorText = PRICE_INPUT_FORMAT_ERROR,
  onValueChange,
  onClear,
  error: externalError,
  clearable = true,
  counter,
  maxLength,
  label = 'Сумма',
  wrapperClassName = '',
  onPaste,
  ref,
  ...props
}: PriceInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(() => normalizePriceValue(defaultValue, maxLength));
  const [formatError, setFormatError] = useState(false);
  const isControlled = controlledValue !== undefined;
  const normalizedValue = normalizePriceValue(
    isControlled ? controlledValue : internalValue,
    maxLength,
  );
  const displayValue = formatPriceValue(normalizedValue);
  const currencySymbol = resolveCurrencySymbol(currency);
  const hasCompleteValue = normalizedValue !== '' && !normalizedValue.endsWith(',');
  const hasRangeValidation = min !== undefined || max !== undefined;
  const hasRangeError = hasRangeValidation
    && hasCompleteValue
    && !isValidPriceValue(normalizedValue, min, max);
  const rangeError = getPriceRangeError(min, max, currencySymbol);
  const resolvedError = formatError
    ? formatErrorText
    : externalError ?? (hasRangeError ? rangeError : undefined);
  const digitCount = normalizedValue.replace(/\D/g, '').length;
  const resolvedCounter = counter === true
    ? maxLength !== undefined
      ? `${digitCount} / ${maxLength}`
      : String(digitCount)
    : counter;

  useImperativeHandle(ref, () => inputRef.current!, [props.skeleton]);

  function commit(next: string) {
    const normalized = normalizePriceValue(next, maxLength);
    if (!isControlled) setInternalValue(normalized);
    if (normalized !== normalizedValue) onValueChange?.(normalized);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const typedValue = event.currentTarget.value.replace(/\u00a0/g, '');
    const normalizedDecimalSeparator = typedValue.replace(/\./g, ',');
    const validFormat = /^\d*(?:,\d{0,2})?$/.test(normalizedDecimalSeparator);

    if (!validFormat) {
      setFormatError(true);
      return;
    }

    setFormatError(false);
    commit(normalizedDecimalSeparator);
  }

  function handleClear() {
    setFormatError(false);
    commit('');
    onClear?.();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    onPaste?.(event);
    if (event.defaultPrevented) return;

    const text = event.clipboardData.getData('text');
    if (!/\d/.test(text)) {
      event.preventDefault();
      setFormatError(true);
      return;
    }

    const textWithoutCurrency = stripAcceptedCurrency(text, currency, currencySymbol);
    const hasUnsupportedCharacters = /[^\d.,\s]/.test(textWithoutCurrency);
    setFormatError(hasUnsupportedCharacters);
    event.preventDefault();
    const start = event.currentTarget.selectionStart ?? displayValue.length;
    const end = event.currentTarget.selectionEnd ?? start;
    const nextDisplayValue =
      displayValue.slice(0, start) + text + displayValue.slice(end);
    commit(nextDisplayValue);
  }

  return (
    <div
      className="fdoc-price-input"
      data-testid="price-input"
      data-empty={!normalizedValue || undefined}
    >
      {name && !props.skeleton && (
        <input type="hidden" name={name} value={normalizedValue} disabled={props.disabled} />
      )}
      <Input
        {...props}
        ref={inputRef}
        label={label}
        wrapperClassName={`fdoc-price-input__field ${wrapperClassName}`}
        value={displayValue}
        name={undefined}
        type="text"
        inputMode="decimal"
        pattern="[0-9\s,]*"
        autoComplete={props.autoComplete ?? 'off'}
        clearable={clearable}
        counter={resolvedCounter}
        maxLength={undefined}
        inlineSuffix={currencySymbol}
        error={resolvedError}
        onChange={handleChange}
        onClear={handleClear}
        onPaste={handlePaste}
      />
    </div>
  );
}
