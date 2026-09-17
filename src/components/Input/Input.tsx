import {
  forwardRef,
  useState,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './Input.css';

export type InputSize = 'medium' | 'small';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Размер поля: 56 или 48 px по высоте. */
  size?: InputSize;
  /** Подпись над полем. Передача false скрывает подпись. */
  label?: ReactNode;
  /** Дополнительное описание внутри поля под основным текстом. */
  description?: ReactNode;
  /** Текст ошибки. При передаче поле получает error-состояние. */
  error?: ReactNode;
  /** Признак обязательного поля. Отображает звездочку рядом с Label. */
  required?: boolean;
  /** Подсказка под полем. */
  caption?: ReactNode;
  /** Счетчик справа в строке подсказки. */
  counter?: ReactNode;
  /** Левая иконка или другой визуальный слот. */
  leadingIcon?: ReactNode;
  /** Правая иконка или другой визуальный слот. */
  trailingIcon?: ReactNode;
  /** Значение иконки/суффикса справа от поля. */
  sum?: ReactNode;
  /** Иконка рядом со значением sum. */
  sumIcon?: ReactNode;
  /** Показывает caret в правом слоте. */
  caret?: boolean;
  /** Показывает кнопку очистки при непустом значении. */
  clearable?: boolean;
  /** Обработчик очистки значения. */
  onClear?: () => void;
  /** Иконка кнопки очистки. */
  clearIcon?: ReactNode;
  /** Показывает скелетон вместо поля. */
  skeleton?: boolean;
  /** Класс внешнего контейнера компонента. */
  wrapperClassName?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id: providedId,
    className,
    wrapperClassName,
    size = 'medium',
    label,
    description,
    error,
    required = false,
    caption,
    counter,
    leadingIcon,
    trailingIcon,
    sum,
    sumIcon,
    caret = false,
    clearable = false,
    onClear,
    clearIcon = '×',
    skeleton = false,
    disabled = false,
    value,
    defaultValue,
    placeholder,
    maxLength,
    ...inputProps
  },
  ref,
) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ''));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const descriptionId = description !== undefined ? `${inputId}-description` : undefined;
  const errorId = error !== undefined ? `${inputId}-error` : undefined;
  const captionId = !error && caption !== undefined ? `${inputId}-caption` : undefined;
  const counterId = counter !== undefined ? `${inputId}-counter` : undefined;
  const helperId = [descriptionId, errorId, captionId, counterId].filter(Boolean).join(' ') || undefined;
  const hasValue = String(currentValue ?? '').length > 0;
  const showClear = clearable && hasValue && !disabled && !skeleton;
  const isError = Boolean(error);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.currentTarget.value);
    }
    inputProps.onChange?.(event);
  };
  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  };

  if (skeleton) {
    return (
      <div
        className={joinClassNames('fdoc-input', `fdoc-input--${size}`, wrapperClassName)}
        aria-hidden="true"
      >
        {label !== false && label !== undefined && (
          <div className="fdoc-input__label">
            <span className="fdoc-input__skeleton fdoc-input__skeleton--label" />
          </div>
        )}
        <div className="fdoc-input__field fdoc-input__field--skeleton">
          <span className="fdoc-input__skeleton fdoc-input__skeleton--text" />
        </div>
        {(caption !== undefined || counter !== undefined) && (
          <div className="fdoc-input__helper">
            <span className="fdoc-input__skeleton fdoc-input__skeleton--caption" />
          </div>
        )}
      </div>
    );
  }

  const resolvedPlaceholder = hasValue ? undefined : placeholder;

  return (
    <div className={joinClassNames('fdoc-input', `fdoc-input--${size}`, wrapperClassName)}>
      {label !== false && label !== undefined && (
        <label
          className={joinClassNames(
            'fdoc-input__label',
            isError && 'fdoc-input__label--error',
            disabled && 'fdoc-input__label--disabled',
            isError && disabled && 'fdoc-input__label--error-disabled',
          )}
          htmlFor={inputId}
        >
          {label}
          {required && <span className="fdoc-input__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div
        className={joinClassNames(
          'fdoc-input__field',
          isError && 'fdoc-input__field--error',
          disabled && 'fdoc-input__field--disabled',
        )}
      >
        {leadingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        <span className="fdoc-input__content">
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            className={joinClassNames('fdoc-input__control', className)}
            disabled={disabled}
            value={isControlled ? value : internalValue}
            placeholder={resolvedPlaceholder}
            maxLength={maxLength}
            required={required}
            aria-required={required || undefined}
            aria-invalid={isError || undefined}
            aria-describedby={helperId}
            onChange={handleChange}
          />
          {description !== undefined && (
            <span
              id={descriptionId}
              className={joinClassNames('fdoc-input__description', disabled && 'fdoc-input__description--disabled')}
            >
              {description}
            </span>
          )}
        </span>

        {sum !== undefined && (
          <span className={joinClassNames('fdoc-input__sum', disabled && 'fdoc-input__sum--disabled')}>
            {sum}
            {sumIcon !== undefined && <span className="fdoc-input__sum-icon" aria-hidden="true">{sumIcon}</span>}
          </span>
        )}

        {showClear && (
          <button
            type="button"
            className="fdoc-input__clear"
            aria-label="Очистить поле"
            onClick={handleClear}
          >
            {clearIcon}
          </button>
        )}

        {trailingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        )}

        {caret && <span className="fdoc-input__caret" aria-hidden="true">|</span>}
      </div>

      {(caption !== undefined || counter !== undefined || error !== undefined) && (
        <div className="fdoc-input__helper">
          <span
            id={errorId ?? captionId}
            className={joinClassNames(
              'fdoc-input__caption',
              isError && 'fdoc-input__caption--error',
              disabled && 'fdoc-input__caption--disabled',
              isError && disabled && 'fdoc-input__caption--error-disabled',
            )}
          >
            {error ?? caption}
          </span>
          {counter !== undefined && <span id={counterId} className="fdoc-input__counter">{counter}</span>}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
