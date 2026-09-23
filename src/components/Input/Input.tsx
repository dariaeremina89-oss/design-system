import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import type { IconName } from '../Icon/Icon';
import { InputSkeleton } from './InputSkeleton';
import { FieldClearButton, FieldHelper, FieldIcon, FieldLabel, useTextField, joinClassNames } from '../TextField/TextField';
import './Input.css';

export type InputSize = 'medium' | 'small';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Стабильный идентификатор нативного input для UI-тестов. */
  'data-testid'?: string;
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
  /** Дополнительное действие справа внутри поля. */
  trailingContent?: ReactNode;
  /** Ссылка на рамку поля для позиционирования раскрывающегося списка. */
  fieldRef?: Ref<HTMLDivElement>;
  /** Замена дополнительного действия при загрузке. */
  trailingSkeleton?: ReactNode;
  /** Значение иконки/суффикса справа от поля. */
  sum?: ReactNode;
  /** Имя иконки из библиотеки рядом со значением sum. */
  sumIcon?: IconName;
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
    trailingContent,
    fieldRef,
    trailingSkeleton,
    sum,
    sumIcon,
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
  const { 'data-testid': inputTestId, ...inputPropsWithoutTestId } = inputProps;
  const { inputId, internalValue, isControlled, hasDescription, hasError, hasCounter,
    descriptionId, errorId, captionId, counterId, hasValue, resolvedCounter, helperId,
    updateValue, clearValue } = useTextField<HTMLInputElement>({ id: providedId,
      value, defaultValue, label, description, error, caption, counter, maxLength,
      'aria-describedby': inputProps['aria-describedby'] });
  const showClear = clearable && hasValue && !disabled && !skeleton;
  const isError = hasError;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue(event);
    inputProps.onChange?.(event);
  };

  const handleClear = () => {
    clearValue();
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
        trailingContent={trailingSkeleton}
        sum={sum}
        sumIcon={sumIcon}
        clearable={clearable}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        testId={inputTestId}
        wrapperClassName={wrapperClassName}
      />
    );
  }

  const resolvedPlaceholder = hasValue ? undefined : placeholder;

  return (
    <div
      className={joinClassNames('fdoc-input fdoc-field', `fdoc-input--${size}`, wrapperClassName)}
      data-testid={inputTestId ? `${inputTestId}-root` : 'input'}
    >
      <FieldLabel prefix="input" label={label} inputId={inputId} required={required} disabled={disabled} isError={isError} />

      <div
        className={joinClassNames(
          'fdoc-input__field fdoc-field__field',
          leadingIcon !== undefined && 'fdoc-input__field--has-leading',
          isError && 'fdoc-input__field--error fdoc-field__field--error',
          disabled && 'fdoc-input__field--disabled fdoc-field__field--disabled',
        )}
        ref={fieldRef}
        data-testid="input-field"
      >
        {leadingIcon !== undefined && (
          <FieldIcon icon={leadingIcon} className="fdoc-input__slot fdoc-input__slot--leading" data-testid="input-leading-icon" />
        )}

        <span className="fdoc-input__content" data-testid="input-content">
          <input
            {...inputPropsWithoutTestId}
            ref={ref}
            id={inputId}
            className={joinClassNames('fdoc-input__control fdoc-field__control', className)}
            data-testid={inputTestId ?? 'input-control'}
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
              data-testid="input-description"
            >
              {description}
            </span>
          )}
        </span>

        {sum !== undefined && (
          <span className={joinClassNames('fdoc-input__sum', disabled && 'fdoc-input__sum--disabled')} data-testid="input-sum">
            {sum}
            {sumIcon !== undefined && (
              <span className="fdoc-input__sum-icon" aria-hidden="true" data-testid="input-sum-icon">
                <span className="fdoc-icon" style={{ width: 16, height: 16 }} />
              </span>
            )}
          </span>
        )}

        {showClear && (
          <FieldClearButton
            className="fdoc-input__clear"
            icon={clearIcon}
            data-testid="input-clear"
            onClick={handleClear}
          />
        )}

        {trailingIcon !== undefined && (
          <FieldIcon icon={trailingIcon} className="fdoc-input__slot fdoc-input__slot--trailing" data-testid="input-trailing-icon" />
        )}

        {trailingContent}
      </div>

      <FieldHelper prefix="input" error={error} caption={caption} hasCounter={hasCounter}
        resolvedCounter={resolvedCounter} errorId={errorId} captionId={captionId}
        counterId={counterId} isError={isError} disabled={disabled} />
    </div>
  );
});

Input.displayName = 'Input';
