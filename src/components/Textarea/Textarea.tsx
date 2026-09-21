import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import { FieldHelper, FieldLabel, joinClassNames, useTextField } from '../TextField/TextField';
import type { InputProps, InputSize } from '../Input/Input';
import './Textarea.css';

export type TextareaSize = InputSize;
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>,
  Pick<InputProps, 'label' | 'caption' | 'error' | 'counter' | 'skeleton' | 'wrapperClassName'> {
  /** Medium: 112 px. Small: минимум 48 px. */
  size?: TextareaSize;
  /** Разрешает нативное ручное изменение высоты по вертикали. */
  resize?: boolean;
  /** Идентификатор нативного textarea. Корень получает суффикс -root. */
  'data-testid'?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  id, size = 'medium', label, caption, error, counter, skeleton = false,
  resize = false, disabled = false, required = false, value, defaultValue,
  maxLength, className, wrapperClassName, onChange, rows, style,
  'data-testid': testId, ...props
}, ref) {
  const field = useTextField<HTMLTextAreaElement>({ id, label, caption, error, counter,
    value, defaultValue, maxLength, 'aria-describedby': props['aria-describedby'] });
  const chrome = { prefix: 'textarea' as const, isError: field.hasError, disabled, skeleton };
  const rootClass = joinClassNames('fdoc-field fdoc-textarea', `fdoc-textarea--${size}`, wrapperClassName);
  const controlClass = joinClassNames('fdoc-field__field fdoc-field__control fdoc-textarea__control',
    field.hasError && !skeleton && 'fdoc-field__field--error',
    disabled && !skeleton && 'fdoc-field__field--disabled', className);
  const controlStyle = { ...style, resize: resize && !disabled ? 'vertical' as const : 'none' as const };

  return (
    <div className={rootClass} aria-hidden={skeleton || undefined}
      data-testid={skeleton ? testId ?? 'textarea-skeleton' : testId ? `${testId}-root` : 'textarea'}>
      <FieldLabel {...chrome} label={label} inputId={field.inputId} required={required} />
      {skeleton ? (
        <div className={joinClassNames(controlClass, 'fdoc-textarea__skeleton')} data-testid="textarea-skeleton-field">
          {field.hasValue && <Skeleton width="80px" shape="text" textSize="subtitle" data-testid="textarea-skeleton-text" />}
        </div>
      ) : (
        <textarea {...props} ref={ref} id={field.inputId} className={controlClass}
          data-testid={testId ?? 'textarea-control'} disabled={disabled} required={required}
          value={field.isControlled ? value : field.internalValue} maxLength={maxLength}
          rows={rows ?? (size === 'small' ? 1 : 3)} style={controlStyle}
          aria-required={required || undefined} aria-invalid={field.hasError || props['aria-invalid']}
          aria-describedby={field.helperId}
          onChange={event => { field.updateValue(event); onChange?.(event); }} />
      )}
      <FieldHelper {...chrome} error={error} caption={caption} hasCounter={field.hasCounter}
        resolvedCounter={field.resolvedCounter} errorId={field.errorId}
        captionId={field.captionId} counterId={field.counterId} />
    </div>
  );
});

Textarea.displayName = 'Textarea';
