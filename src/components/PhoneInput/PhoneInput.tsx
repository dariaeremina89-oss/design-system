import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { Input, type InputProps } from '../Input/Input';
import { Icon, type IconName } from '../Icon/Icon';
import { Menu, type MenuItem } from '../Menu/Menu';
import { Popup, type PopupProps } from '../Menu/Popup';
import './PhoneInput.css';

export type PhoneInputType = 'russian' | 'international';

export const PHONE_INPUT_REQUIRED_ERROR = 'Обязательно для заполнения';
export const PHONE_INPUT_FORMAT_ERROR = 'Неверный формат. Проверьте введенные данные';

export interface PhoneInputProps extends Omit<InputProps,
  'value' | 'defaultValue' | 'onChange' | 'onClear' | 'clearable' | 'clearIcon' |
  'leadingIcon' | 'leadingContent' | 'trailingIcon' | 'trailingContent' | 'trailingSkeleton' |
  'fieldRef' | 'type' | 'inputMode' | 'placeholder' | 'readOnly' | 'counter' | 'maxLength'> {
  /** Нормализованное значение: + и цифры без форматирования. */
  value?: string;
  /** Начальное нормализованное значение в uncontrolled-режиме. */
  defaultValue?: string;
  /** Управляемый тип номера. */
  phoneType?: PhoneInputType;
  /** Начальный тип номера. */
  defaultPhoneType?: PhoneInputType;
  /** Изменение нормализованного значения. */
  onValueChange?: (value: string) => void;
  /** Изменение типа номера вручную или после автоматического определения. */
  onPhoneTypeChange?: (type: PhoneInputType) => void;
  /** Управляемое состояние Menu. */
  open?: boolean;
  /** Начальное состояние Menu. */
  defaultOpen?: boolean;
  /** Изменение состояния Menu. */
  onOpenChange?: (open: boolean) => void;
  /** Позиция Menu. */
  placement?: PopupProps['placement'];
  /** Максимальная высота Menu. */
  menuMaxHeight?: number;
  ref?: Ref<HTMLInputElement>;
}

const russianPlaceholder = '(000) 000-00-00';

type SelectorState = 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Open' | 'Disabled';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeRussianComplete(value: string) {
  const digits = digitsOnly(value);
  if (digits.length === 10 && digits.startsWith('9')) return `+7${digits}`;
  if (digits.length === 11 && digits.startsWith('79')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('89')) return `+7${digits.slice(1)}`;
  return undefined;
}

function detectCompleteType(value: string): PhoneInputType | undefined {
  const digits = digitsOnly(value);
  if (!digits) return undefined;
  if (normalizeRussianComplete(value)) return 'russian';
  if (value.trim().startsWith('+') || digits.length > 11) return 'international';
  return undefined;
}

function normalizeInternational(value: string) {
  const digits = digitsOnly(value);
  return digits ? `+${digits}` : value.trim().startsWith('+') ? '+' : '';
}

function normalizeRussianPartial(value: string) {
  const complete = normalizeRussianComplete(value);
  if (complete) return complete;
  const digits = digitsOnly(value);
  if (!digits || digits === '7') return '';
  if (digits.startsWith('7')) return `+7${digits.slice(1, 11)}`;
  if (digits.startsWith('8') && digits.length === 11) return `+7${digits.slice(1, 11)}`;
  return `+7${digits.slice(0, 10)}`;
}

function normalizeForType(value: string, type: PhoneInputType) {
  return type === 'russian' ? normalizeRussianPartial(value) : normalizeInternational(value);
}

function resolveTypedInput(value: string, currentType: PhoneInputType) {
  const trimmed = value.trim();
  const digits = digitsOnly(value);
  const completeRussian = normalizeRussianComplete(value);

  if (completeRussian) {
    return { type: 'russian' as const, value: completeRussian };
  }

  if (!digits) {
    return {
      type: trimmed.startsWith('+') ? 'international' as const : currentType,
      value: trimmed.startsWith('+') ? '+' : '',
    };
  }

  if (currentType === 'russian') {
    if (trimmed.startsWith('+7')) {
      const national = digits.slice(1);
      if (!national || national.startsWith('9')) {
        return {
          type: 'russian' as const,
          value: national ? `+7${national.slice(0, 10)}` : '',
        };
      }
    } else if (!trimmed.startsWith('+') && digits.length <= 10 && digits.startsWith('9')) {
      return { type: 'russian' as const, value: `+7${digits}` };
    }
  }

  return { type: 'international' as const, value: `+${digits}` };
}

export function formatRussianPhone(value: string) {
  const canonical = normalizeRussianPartial(value);
  const digits = digitsOnly(canonical);
  if (!digits || digits === '7') return '';
  const national = digits.startsWith('7') ? digits.slice(1, 11) : digits.slice(0, 10);
  let result = '+7';
  if (national.length > 0) result += ` (${national.slice(0, 3)}`;
  if (national.length >= 3) result += ')';
  if (national.length > 3) result += ` ${national.slice(3, 6)}`;
  if (national.length > 6) result += `-${national.slice(6, 8)}`;
  if (national.length > 8) result += `-${national.slice(8, 10)}`;
  return result;
}

export function isValidPhoneValue(value: string, type: PhoneInputType) {
  const digits = digitsOnly(value);
  if (!digits) return false;
  if (type === 'russian') return normalizeRussianComplete(value) !== undefined;
  return true;
}

function selectorIcon(type: PhoneInputType, state: Exclude<SelectorState, 'Focused'>) {
  const country = type === 'russian' ? 'Rus' : 'Earth';
  return `flag_chevron/Country=${country}, State=${state}` as IconName;
}

function russianNationalDigitPositions(value: string) {
  const prefixIndex = value.startsWith('+7') ? 1 : -1;
  const positions: number[] = [];
  Array.from(value).forEach((character, index) => {
    if (/\d/.test(character) && index !== prefixIndex) positions.push(index);
  });
  return positions;
}

function menuTitle(type: PhoneInputType) {
  if (type === 'russian') {
    return (
      <span className="fdoc-phone-input__menu-title">
        <span className="fdoc-phone-input__menu-flag" aria-hidden="true">
          <Icon name="flag_chevron/Country=Rus, State=Default" size={24} />
        </span>
        <span>Россия +7</span>
      </span>
    );
  }
  return (
    <span className="fdoc-phone-input__menu-title">
      <Icon className="fdoc-phone-input__menu-earth" name="planet-earth" size={24} />
      <span>Иностранный номер</span>
    </span>
  );
}

export function PhoneInput({
  value: controlledValue,
  defaultValue = '',
  phoneType: controlledType,
  defaultPhoneType = 'russian',
  onValueChange,
  onPhoneTypeChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'auto',
  menuMaxHeight = 304,
  disabled = false,
  skeleton = false,
  id: providedId,
  label = 'Номер телефона',
  name,
  wrapperClassName = '',
  onFocus,
  onBlur,
  onKeyDown,
  onPaste,
  ref,
  ...props
}: PhoneInputProps) {
  const uid = useId();
  const id = providedId ?? uid;
  const menuId = `${id}-phone-type-menu`;
  const input = useRef<HTMLInputElement>(null);
  const selector = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => input.current!, [skeleton]);

  const initialType = detectCompleteType(controlledValue ?? defaultValue) ?? defaultPhoneType;
  const [internalValue, setInternalValue] = useState(() => normalizeForType(defaultValue, initialType));
  const [internalType, setInternalType] = useState<PhoneInputType>(initialType);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [selectorHover, setSelectorHover] = useState(false);
  const [selectorFocus, setSelectorFocus] = useState(false);
  const [selectorPressed, setSelectorPressed] = useState(false);

  const inferredControlledType = controlledType === undefined && controlledValue !== undefined
    ? detectCompleteType(controlledValue)
    : undefined;
  const phoneType = controlledType ?? inferredControlledType ?? internalType;
  const sourceValue = controlledValue ?? internalValue;
  const normalizedValue = normalizeForType(sourceValue, phoneType);
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);
  const displayValue = phoneType === 'russian'
    ? formatRussianPhone(normalizedValue)
    : normalizeInternational(normalizedValue);
  const empty = normalizedValue === '';
  const prefixOnly = phoneType === 'international' && normalizedValue === '+';

  useEffect(() => {
    if (controlledValue === undefined || controlledType !== undefined) return;
    const nextType = detectCompleteType(controlledValue);
    if (nextType) setInternalType(nextType);
  }, [controlledType, controlledValue]);

  function changeOpen(next: boolean) {
    if (disabled || skeleton) next = false;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setSelectorPressed(false);
  }

  function commit(nextValue: string, nextType = phoneType) {
    const normalized = normalizeForType(nextValue, nextType);
    if (controlledValue === undefined) setInternalValue(normalized);
    if (controlledType === undefined) setInternalType(nextType);
    if (normalized !== normalizedValue) onValueChange?.(normalized);
    if (nextType !== phoneType) onPhoneTypeChange?.(nextType);
  }

  function handleChange(text: string) {
    const resolved = resolveTypedInput(text, phoneType);
    commit(resolved.value, resolved.type);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleChange(event.currentTarget.value);
  }

  function handleRussianDeletion(event: KeyboardEvent<HTMLInputElement>) {
    if (phoneType !== 'russian' || (event.key !== 'Backspace' && event.key !== 'Delete')) return false;
    if (!displayValue) return false;

    const start = event.currentTarget.selectionStart ?? displayValue.length;
    const end = event.currentTarget.selectionEnd ?? start;
    const positions = russianNationalDigitPositions(displayValue);
    if (!positions.length) return false;

    let indexes: number[] = [];
    if (start !== end) {
      indexes = positions
        .map((position, index) => ({ position, index }))
        .filter(({ position }) => position >= start && position < end)
        .map(({ index }) => index);
    } else if (event.key === 'Backspace') {
      for (let index = positions.length - 1; index >= 0; index -= 1) {
        if (positions[index] < start) {
          indexes = [index];
          break;
        }
      }
    } else {
      const index = positions.findIndex(position => position >= start);
      if (index >= 0) indexes = [index];
    }

    if (!indexes.length) return false;

    event.preventDefault();
    const national = digitsOnly(normalizedValue).replace(/^7/, '').split('');
    const firstRemovedIndex = Math.min(...indexes);
    [...indexes].sort((a, b) => b - a).forEach(index => national.splice(index, 1));
    const nextValue = national.length ? `+7${national.join('')}` : '';
    commit(nextValue, 'russian');

    requestAnimationFrame(() => {
      const element = input.current;
      if (!element) return;
      const nextDisplay = formatRussianPhone(nextValue);
      const nextPositions = russianNationalDigitPositions(nextDisplay);
      const nextCaret = nextPositions[firstRemovedIndex] ?? nextDisplay.length;
      element.setSelectionRange(nextCaret, nextCaret);
    });

    return true;
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    onPaste?.(event);
    if (event.defaultPrevented) return;
    const text = event.clipboardData.getData('text');
    const digits = digitsOnly(text);
    if (!digits) return;
    event.preventDefault();
    const russian = normalizeRussianComplete(text);
    if (russian) commit(russian, 'russian');
    else commit(`+${digits}`, 'international');
  }

  function chooseType(nextType: PhoneInputType) {
    let nextValue = normalizedValue;
    if (nextType === 'russian') {
      nextValue = normalizeRussianComplete(normalizedValue) ?? normalizedValue;
    } else {
      nextValue = normalizeInternational(normalizedValue);
    }
    commit(nextValue, nextType);
    changeOpen(false);
    requestAnimationFrame(() => selector.current?.focus());
  }

  const visualState: SelectorState = disabled
    ? 'Disabled'
    : open
      ? 'Open'
      : selectorPressed
        ? 'Pressed'
        : selectorFocus
          ? 'Focused'
          : selectorHover
            ? 'Hover'
            : 'Default';
  const assetState: Exclude<SelectorState, 'Focused'> = visualState === 'Focused' ? 'Default' : visualState;

  const items: MenuItem[] = [
    { id: 'russian', textValue: 'Россия +7', title: menuTitle('russian') },
    { id: 'international', textValue: 'Иностранный номер', title: menuTitle('international') },
  ];

  return (
    <div
      className={`fdoc-phone-input ${wrapperClassName}`}
      data-phone-type={phoneType}
      data-open={open || undefined}
      data-empty={empty || undefined}
      data-prefix-only={prefixOnly || undefined}
    >
      {name && !skeleton && <input type="hidden" name={name} value={normalizedValue} disabled={disabled} />}
      <Input
        {...props}
        id={id}
        ref={input}
        fieldRef={anchor}
        label={label}
        name={undefined}
        value={displayValue}
        data-prefix-only={prefixOnly || undefined}
        disabled={disabled}
        skeleton={skeleton}
        wrapperClassName={`fdoc-phone-input__field${empty ? ` fdoc-phone-input__field--empty-${phoneType}` : ''}`}
        type="tel"
        inputMode="tel"
        autoComplete={props.autoComplete ?? 'tel'}
        placeholder={empty && phoneType === 'russian' ? russianPlaceholder : undefined}
        leadingContent={(
          <button
            ref={selector}
            className="fdoc-phone-input__selector"
            type="button"
            disabled={disabled || skeleton}
            aria-label={phoneType === 'russian' ? 'Тип номера: Россия +7' : 'Тип номера: Иностранный номер'}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            data-state={visualState.toLowerCase()}
            onPointerEnter={() => setSelectorHover(true)}
            onPointerLeave={() => { setSelectorHover(false); setSelectorPressed(false); }}
            onPointerDown={() => setSelectorPressed(true)}
            onPointerUp={() => setSelectorPressed(false)}
            onFocus={() => setSelectorFocus(true)}
            onBlur={() => setSelectorFocus(false)}
            onClick={() => changeOpen(!open)}
          >
            <Icon name={selectorIcon(phoneType, assetState)} size={24} />
          </button>
        )}
        onChange={handleInputChange}
        onPaste={handlePaste}
        onFocus={event => {
          if (open) changeOpen(false);
          onFocus?.(event);
        }}
        onBlur={event => { onBlur?.(event); }}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          handleRussianDeletion(event);
        }}
      />

      {open && (
        <Popup
          anchor={anchor}
          placement={placement}
          matchWidth
          maxHeight={menuMaxHeight}
          onDismiss={reason => {
            changeOpen(false);
            if (reason === 'escape') requestAnimationFrame(() => selector.current?.focus());
          }}
        >
          <Menu
            id={menuId}
            className="fdoc-phone-input__menu"
            items={items}
            role="listbox"
            aria-label="Тип номера"
            selectedId={phoneType}
            autoFocus
            maxHeight={menuMaxHeight}
            onAction={item => chooseType(item.id as PhoneInputType)}
          />
        </Popup>
      )}
    </div>
  );
}