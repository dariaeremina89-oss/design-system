import {
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEventHandler,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type ReactNode,
  type Ref,
} from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import {
  FieldHelper,
  FieldLabel,
  hasRenderableContent,
  joinClassNames,
} from '../TextField/TextField';
import './CodeInput.css';

export type CodeInputSize = 'medium' | 'small';
export type CodeInputLength = 4 | 5 | 6;
export type CodeInputType = 'code' | 'phone';

export interface CodeInputProps {
  /** Стабильный id группы. Ячейки получают суффиксы -1 ... -6. */
  id?: string;
  /** Имя итогового hidden input для отправки формы. */
  name?: string;
  /** Управляемое значение. Принимаются только цифры. */
  value?: string;
  /** Начальное значение uncontrolled-компонента. */
  defaultValue?: string;
  /** Тип ввода: обычный код или часть номера телефона. */
  type?: CodeInputType;
  /** Количество ячеек для Type=code. Figma поддерживает 4, 5 или 6. */
  length?: CodeInputLength;
  /** Группировка вводимых цифр для Type=phone. Сумма значений задает количество ячеек. */
  phoneGroups?: readonly number[];
  /** Неизменяемая часть номера перед вводимыми цифрами. */
  phonePrefix?: ReactNode;
  /** Неизменяемая часть номера после вводимых цифр. */
  phoneSuffix?: ReactNode;
  /** Размер ячеек: Medium 56 или Small 48. */
  size?: CodeInputSize;
  /** Подпись над кодом. */
  label?: ReactNode;
  /** Подсказка под кодом. */
  caption?: ReactNode;
  /** Validation error. Имеет приоритет над Caption. */
  error?: ReactNode;
  /** Обязательное поле. */
  required?: boolean;
  /** Отключает все ячейки. */
  disabled?: boolean;
  /** Показывает Skeleton вместо интерактивных ячеек. */
  skeleton?: boolean;
  /** Ставит фокус в первую доступную ячейку после монтирования. */
  autoFocus?: boolean;
  /** Вызывается с полным нормализованным значением. */
  onValueChange?: (value: string) => void;
  /** Событие фокуса любой ячейки. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Событие blur любой ячейки. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Событие keydown любой ячейки. */
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  /** Класс корневого контейнера. */
  wrapperClassName?: string;
  /** Класс строки с ячейками. */
  className?: string;
  /** Доступное имя группы, если Label не является строкой. */
  'aria-label'?: string;
  /** Дополнительные связи с внешним описанием. */
  'aria-describedby'?: string;
  /** Стабильный test id корня. */
  'data-testid'?: string;
  /** Ref на первую ячейку. */
  ref?: Ref<HTMLInputElement>;
}

function normalizeCode(value: string | undefined, length: number) {
  return String(value ?? '').replace(/\D/g, '').slice(0, length);
}

function replaceFrom(value: string, start: number, insertion: string, length: number) {
  const chars = value.split('');
  const digits = insertion.replace(/\D/g, '');
  digits.split('').forEach((digit, offset) => {
    const index = start + offset;
    if (index < length) chars[index] = digit;
  });
  return chars.join('').slice(0, length);
}

export function CodeInput({
  id: providedId,
  name,
  value: controlledValue,
  defaultValue = '',
  type = 'code',
  length = 6,
  phoneGroups = [2, 3, 2],
  phonePrefix,
  phoneSuffix,
  size = 'medium',
  label = 'Код',
  caption,
  error,
  required = false,
  disabled = false,
  skeleton = false,
  autoFocus = false,
  onValueChange,
  onFocus,
  onBlur,
  onKeyDown,
  wrapperClassName = '',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': externalDescribedBy,
  'data-testid': testId = 'code-input',
  ref,
}: CodeInputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const normalizedPhoneGroups = phoneGroups.filter(
    groupLength => Number.isInteger(groupLength) && groupLength > 0,
  );
  const resolvedPhoneGroups = normalizedPhoneGroups.length > 0 ? normalizedPhoneGroups : [1];
  const cellCount = type === 'phone'
    ? resolvedPhoneGroups.reduce((sum, groupLength) => sum + groupLength, 0)
    : length;
  let phoneOffset = 0;
  const phoneGroupIndexes = resolvedPhoneGroups.map(groupLength => {
    const indexes = Array.from({ length: groupLength }, (_, index) => phoneOffset + index);
    phoneOffset += groupLength;
    return indexes;
  });
  const [internalValue, setInternalValue] = useState(() => normalizeCode(defaultValue, cellCount));
  const isControlled = controlledValue !== undefined;
  const value = normalizeCode(isControlled ? controlledValue : internalValue, cellCount);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const skipFocusGuard = useRef(false);

  const hasError = hasRenderableContent(error);
  const hasCaption = hasRenderableContent(caption);
  const errorId = hasError ? `${id}-error` : undefined;
  const captionId = !hasError && hasCaption ? `${id}-caption` : undefined;
  const helperId = [externalDescribedBy, errorId, captionId].filter(Boolean).join(' ') || undefined;
  const firstInputId = `${id}-1`;

  useImperativeHandle(ref, () => inputRefs.current[0]!, [skeleton]);

  function commit(next: string) {
    const normalized = normalizeCode(next, cellCount);
    if (!isControlled) setInternalValue(normalized);
    onValueChange?.(normalized);
  }

  function focusCell(index: number, allowFutureCell = false) {
    const next = Math.max(0, Math.min(cellCount - 1, index));
    if (allowFutureCell) skipFocusGuard.current = true;
    inputRefs.current[next]?.focus();
  }

  function handleChange(index: number, raw: string) {
    const effectiveIndex = Math.min(index, value.length);
    if (raw === '') {
      if (effectiveIndex < value.length) {
        commit(value.slice(0, effectiveIndex) + value.slice(effectiveIndex + 1));
      }
      return;
    }

    const digits = raw.replace(/\D/g, '');
    if (!digits) return;

    if (digits.length >= cellCount) {
      commit(digits.slice(0, cellCount));
      focusCell(cellCount - 1, true);
      return;
    }

    const next = replaceFrom(value, effectiveIndex, digits, cellCount);
    commit(next);
    const target = Math.min(effectiveIndex + digits.length, cellCount - 1);
    if (effectiveIndex + digits.length < cellCount) focusCell(target, true);
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!digits) return;
    event.preventDefault();

    if (digits.length >= cellCount) {
      commit(digits.slice(0, cellCount));
      focusCell(cellCount - 1, true);
      return;
    }

    const effectiveIndex = Math.min(index, value.length);
    commit(replaceFrom(value, effectiveIndex, digits, cellCount));
    focusCell(Math.min(effectiveIndex + digits.length, cellCount - 1), true);
  }

  function handleKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusCell(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusCell(index + 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusCell(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusCell(cellCount - 1);
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (index < value.length) {
        commit(value.slice(0, index) + value.slice(index + 1));
        focusCell(index);
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        focusCell(index - 1);
      }
      return;
    }
    if (event.key === 'Delete' && index < value.length) {
      event.preventDefault();
      commit(value.slice(0, index) + value.slice(index + 1));
    }
  }

  const groupLabel = ariaLabel ?? (
    typeof label === 'string'
      ? label
      : type === 'phone'
        ? 'Часть номера телефона'
        : 'Код'
  );

  function renderCell(index: number) {
    if (skeleton) {
      return (
        <span
          className="fdoc-code-input__cell fdoc-code-input__cell--skeleton"
          key={index}
          data-testid={`code-input-cell-${index + 1}`}
        >
          {value.length > 0 && (
            <Skeleton
              width={16}
              shape="text"
              textSize={size === 'medium' ? 'h3-heading' : 'subtitle'}
            />
          )}
        </span>
      );
    }

    return (
      <input
        key={index}
        id={`${id}-${index + 1}`}
        ref={node => { inputRefs.current[index] = node; }}
        className="fdoc-code-input__cell"
        value={value[index] ?? ''}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete={type === 'code' && index === 0 ? 'one-time-code' : 'off'}
        autoFocus={autoFocus && index === 0}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={helperId}
        aria-label={`Символ ${index + 1} из ${cellCount}`}
        data-testid={`code-input-cell-${index + 1}`}
        onChange={event => handleChange(index, event.currentTarget.value)}
        onPaste={event => handlePaste(index, event)}
        onKeyDown={event => handleKey(index, event)}
        onFocus={event => {
          if (skipFocusGuard.current) {
            skipFocusGuard.current = false;
            event.currentTarget.select();
            onFocus?.(event);
            return;
          }
          if (index > value.length) {
            requestAnimationFrame(() => focusCell(value.length));
            return;
          }
          event.currentTarget.select();
          onFocus?.(event);
        }}
        onBlur={onBlur}
      />
    );
  }

  return (
    <div
      className={joinClassNames('fdoc-code-input fdoc-field', `fdoc-code-input--${size}`, wrapperClassName)}
      data-error={hasError || undefined}
      data-disabled={disabled || undefined}
      data-testid={testId}
    >
      <FieldLabel
        prefix="input"
        label={label}
        inputId={firstInputId}
        required={required}
        disabled={disabled}
        isError={hasError}
        skeleton={skeleton}
      />

      <div
        className={joinClassNames(
          'fdoc-code-input__row',
          type === 'phone' && 'fdoc-code-input__row--phone',
          className,
        )}
        role="group"
        aria-label={groupLabel}
        aria-describedby={helperId}
        data-testid="code-input-row"
      >
        {type === 'phone' ? (
          <>
            {hasRenderableContent(phonePrefix) && (
              <span className="fdoc-code-input__phone-affix" data-testid="code-input-phone-prefix">
                {phonePrefix}
              </span>
            )}
            <span className="fdoc-code-input__phone-parts" data-testid="code-input-phone-parts">
              {phoneGroupIndexes.map((indexes, groupIndex) => (
                <span
                  className="fdoc-code-input__phone-group"
                  data-testid={`code-input-phone-group-${groupIndex + 1}`}
                  key={groupIndex}
                >
                  {indexes.map(renderCell)}
                </span>
              ))}
            </span>
            {hasRenderableContent(phoneSuffix) && (
              <span className="fdoc-code-input__phone-affix" data-testid="code-input-phone-suffix">
                {phoneSuffix}
              </span>
            )}
          </>
        ) : (
          Array.from({ length: cellCount }, (_, index) => renderCell(index))
        )}
      </div>

      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}

      <FieldHelper
        prefix="input"
        error={error}
        caption={caption}
        hasCounter={false}
        errorId={errorId}
        captionId={captionId}
        isError={hasError}
        disabled={disabled}
        skeleton={skeleton}
      />
    </div>
  );
}
