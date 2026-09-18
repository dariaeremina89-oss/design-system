import {
  forwardRef,
  useState,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { InputSkeleton } from './InputSkeleton';
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
  /** Счетчик символов справа в строке подсказки. Передайте true для автоматического подсчета или ReactNode для своего значения. */
  counter?: ReactNode | boolean;
  /** Имя иконки из библиотеки слева. */
  leadingIcon?: IconName;
  /** Имя иконки из библиотеки справа. */
  trailingIcon?: IconName;
  /** Значение иконки/суффикса справа от поля. */
  sum?: ReactNode;
  /** Имя иконки из библиотеки рядом со значением sum. */
  sumIcon?: IconName;
  /** Показывает caret из библиотеки в правом слоте. */
  caret?: boolean;
  /** Показывает кнопку очистки при непустом значении. */
  clearable?: boolean;
  /** Обработчик очистки значения. */
  onClear?: () => void;
  /** Имя иконки кнопки очистки. */
  clearIcon?: IconName;
  /** Показывает скелетон вместо поля. */
  skeleton?: boolean;
  /** Класс внешнего контейнера компонента. */
  wrapperClassName?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function hasRenderableContent(value: ReactNode | undefined) {
  return value !== undefined
    && value !== null
    && value !== false
    && value !== true
    && value !== '';
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
    clearIcon = 'filled/cross_circle_filled',
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
  const hasLabel = hasRenderableContent(label);
  const hasDescription = hasRenderableContent(description);
  const hasError = hasRenderableContent(error);
  const hasCaption = hasRenderableContent(caption);
  const hasCounter = counter !== undefined
    && counter !== null
    && counter !== false
    && counter !== '';
  const descriptionId = hasDescription ? `${inputId}-description` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const captionId = !hasError && hasCaption ? `${inputId}-caption` : undefined;
  const hasValue = String(currentValue ?? '').length > 0;
  const resolvedCounter = counter === true
    ? `${String(currentValue ?? '').length}${maxLength !== undefined ? ` / ${maxLength}` : ''}`
    : counter;
  const counterId = hasCounter ? `${inputId}-counter` : undefined;
  const helperId = [descriptionId, errorId, captionId, counterId].filter(Boolean).join(' ') || undefined;
  const showClear = clearable && hasValue && !disabled && !skeleton;
  const isError = hasError;

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
      <InputSkeleton
        size={size}
        label={label}
        required={required}
        description={description}
        error={error}
        caption={caption}
        counter={counter}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        sum={sum}
        sumIcon={sumIcon}
        caret={caret}
        clearable={clearable}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        wrapperClassName={wrapperClassName}
      />
    );
  }

  const resolvedPlaceholder = hasValue ? undefined : placeholder;

  return (
    <div className={joinClassNames('fdoc-input', `fdoc-input--${size}`, wrapperClassName)}>
      {hasLabel && (
        <label
          className={joinClassNames(
            'fdoc-input__label',
            isError && 'fdoc-input__label--error',
            disabled && 'fdoc-input__label--disabled',
            isError && disabled && 'fdoc-input__label--error-disabled',
          )}
          htmlFor={inputId}
        >
          <span className="fdoc-input__label-text">
            {label}
            {required && <span className="fdoc-input__required" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div
        className={joinClassNames(
          'fdoc-input__field',
          leadingIcon !== undefined && 'fdoc-input__field--has-leading',
          isError && 'fdoc-input__field--error',
          disabled && 'fdoc-input__field--disabled',
        )}
      >
        {leadingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--leading" aria-hidden="true">
            <Icon name={leadingIcon} size={24} />
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
          {hasDescription && (
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
            {sumIcon !== undefined && (
              <span className="fdoc-input__sum-icon" aria-hidden="true">
                <Icon name={sumIcon} size={16} />
              </span>
            )}
          </span>
        )}

        {showClear && (
          <button
            type="button"
            className="fdoc-input__clear"
            aria-label="Очистить поле"
            onClick={handleClear}
          >
            <Icon name={clearIcon} size={24} />
          </button>
        )}

        {trailingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--trailing" aria-hidden="true">
            <Icon name={trailingIcon} size={24} />
          </span>
        )}

        {caret && (
          <span className="fdoc-input__caret" aria-hidden="true">
            <Icon name="caret" size={24} />
          </span>
        )}
      </div>

      {(hasCaption || hasCounter || hasError) && (
        <div className="fdoc-input__helper">
          {(hasError || hasCaption) && (
            <span
              id={errorId ?? captionId}
              className={joinClassNames(
                'fdoc-input__caption',
              isError && 'fdoc-input__caption--error',
              disabled && 'fdoc-input__caption--disabled',
                isError && disabled && 'fdoc-input__caption--error-disabled',
              )}
            >
              {hasError ? error : caption}
            </span>
          )}
          {hasCounter && (
            <span
              id={counterId}
              className={joinClassNames(
                'fdoc-input__counter',
                disabled && 'fdoc-input__counter--disabled',
              )}
            >
              {resolvedCounter}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
