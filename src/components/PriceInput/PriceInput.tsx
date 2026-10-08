import {
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type Ref,
} from 'react';
import { Input, type InputProps } from '../Input/Input';
import './PriceInput.css';

export const PRICE_INPUT_REQUIRED_ERROR = 'Обязательно для заполнения';
export const PRICE_INPUT_RANGE_ERROR = 'Введите сумму от 1 до 9 999 999,99 ₽';
export const PRICE_INPUT_FORMAT_ERROR = 'Введите сумму цифрами, отделив копейки запятой';

export const PRICE_INPUT_MIN = 1;
export const PRICE_INPUT_MAX = 9_999_999.99;

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
  | 'name'
> {
  /** Нормализованное значение без разделителей тысяч, с запятой перед копейками. */
  value?: string;
  /** Начальное нормализованное значение. */
  defaultValue?: string;
  /** Имя итогового hidden input формы. */
  name?: string;
  /** Символ валюты справа от введенного значения. */
  currency?: string;
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
  min = PRICE_INPUT_MIN,
  max = PRICE_INPUT_MAX,
) {
  const number = priceValueToNumber(value);
  return number !== undefined && number >= min && number <= max;
}

export function PriceInput({
  value: controlledValue,
  defaultValue = '',
  name,
  currency = '₽',
  onValueChange,
  onClear,
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
  const isControlled = controlledValue !== undefined;
  const normalizedValue = normalizePriceValue(
    isControlled ? controlledValue : internalValue,
    maxLength,
  );
  const displayValue = formatPriceValue(normalizedValue);
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
    commit(event.currentTarget.value);
  }

  function handleClear() {
    commit('');
    onClear?.();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    onPaste?.(event);
    if (event.defaultPrevented) return;

    const text = event.clipboardData.getData('text');
    if (!/\d/.test(text)) return;

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
        autoComplete={props.autoComplete ?? 'off'}
        clearable={clearable}
        counter={resolvedCounter}
        maxLength={undefined}
        sum={normalizedValue ? currency : undefined}
        onChange={handleChange}
        onClear={handleClear}
        onPaste={handlePaste}
      />
    </div>
  );
}
