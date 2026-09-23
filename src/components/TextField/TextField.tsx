import { useId, useState, type ChangeEvent, type ReactNode } from 'react';
import { ButtonIcon, type ButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './TextField.css';

export function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function hasRenderableContent(value: ReactNode | undefined) {
  return value !== undefined && value !== null && value !== false && value !== true && value !== '';
}

export function FieldIcon({ icon, className, 'data-testid': testId }: {
  icon: IconName;
  className?: string;
  'data-testid'?: string;
}) {
  return (
    <span className={joinClassNames('fdoc-field__icon', className)} aria-hidden="true" data-testid={testId}>
      <Icon name={icon} size={24} />
    </span>
  );
}

export interface FieldClearButtonProps
  extends Omit<ButtonIconProps, 'size' | 'iconSize' | 'color' | 'aria-label'> {
  'aria-label'?: string;
}

export function FieldClearButton({
  icon = 'filled/cross_circle_filled',
  className,
  'aria-label': ariaLabel = 'Очистить поле',
  ...props
}: FieldClearButtonProps) {
  return (
    <ButtonIcon
      {...props}
      className={joinClassNames('fdoc-field__clear', className)}
      icon={icon}
      iconSize={24}
      size="xsmall"
      color="neutral"
      aria-label={ariaLabel}
    />
  );
}

type FieldOptions = {
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  caption?: ReactNode;
  counter?: ReactNode | boolean;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  maxLength?: number;
  'aria-describedby'?: string;
};

/** Shared value, helper priority, character count and accessible associations. */
export function useTextField<T extends HTMLInputElement | HTMLTextAreaElement>(options: FieldOptions) {
  const generatedId = useId();
  const inputId = options.id ?? generatedId;
  const [internalValue, setInternalValue] = useState(() => String(options.defaultValue ?? ''));
  const isControlled = options.value !== undefined;
  const currentValue = isControlled ? options.value : internalValue;
  const hasLabel = hasRenderableContent(options.label);
  const hasDescription = hasRenderableContent(options.description);
  const hasError = hasRenderableContent(options.error);
  const hasCaption = hasRenderableContent(options.caption);
  const hasCounter = options.counter !== undefined && options.counter !== null && options.counter !== false && options.counter !== '';
  const descriptionId = hasDescription ? `${inputId}-description` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const captionId = !hasError && hasCaption ? `${inputId}-caption` : undefined;
  const counterId = hasCounter ? `${inputId}-counter` : undefined;
  const hasValue = String(currentValue ?? '').length > 0;
  const resolvedCounter = options.counter === true
    ? `${String(currentValue ?? '').length}${options.maxLength !== undefined ? ` / ${options.maxLength}` : ''}`
    : options.counter;
  const helperId = [options['aria-describedby'], descriptionId, errorId, captionId, counterId].filter(Boolean).join(' ') || undefined;
  const updateValue = (event: ChangeEvent<T>) => {
    if (!isControlled) setInternalValue(event.currentTarget.value);
  };
  const clearValue = () => { if (!isControlled) setInternalValue(''); };
  return { inputId, internalValue, isControlled, currentValue, hasLabel, hasDescription, hasError, hasCaption, hasCounter, descriptionId, errorId, captionId, counterId, hasValue, resolvedCounter, helperId, updateValue, clearValue };
}

type FieldChromeProps = {
  prefix: 'input' | 'textarea';
  disabled?: boolean;
  isError?: boolean;
  skeleton?: boolean;
};

export function FieldLabel({ prefix, label, inputId, required, disabled, isError, skeleton }: FieldChromeProps & {
  label?: ReactNode; inputId: string; required?: boolean;
}) {
  if (!hasRenderableContent(label)) return null;
  const Tag = skeleton ? 'div' : 'label';
  return (
    <Tag htmlFor={skeleton ? undefined : inputId}
      className={joinClassNames(`fdoc-${prefix}__label`, 'fdoc-field__label', isError && !skeleton && 'fdoc-field__label--error', disabled && !skeleton && 'fdoc-field__label--disabled', isError && disabled && !skeleton && 'fdoc-field__label--error-disabled')}
      data-testid={`${prefix}${skeleton ? '-skeleton' : ''}-label`}>
      <span className={`fdoc-${prefix}__label-text fdoc-field__label-text`}>
        {skeleton ? <Skeleton width="64px" shape="text" textSize="caption" data-testid={`${prefix}-skeleton-label-text`} /> : label}
        {required && (skeleton
          ? <Skeleton width="var(--font-size-12)" shape="text" textSize="caption" />
          : <span className={`fdoc-${prefix}__required fdoc-field__required`} aria-hidden="true">*</span>)}
      </span>
    </Tag>
  );
}

export function FieldHelper({ prefix, error, caption, hasCounter, resolvedCounter, errorId, captionId, counterId, isError, disabled, skeleton }: FieldChromeProps & {
  error?: ReactNode; caption?: ReactNode; hasCounter: boolean; resolvedCounter?: ReactNode;
  errorId?: string; captionId?: string; counterId?: string;
}) {
  const hasError = hasRenderableContent(error);
  const hasCaption = hasRenderableContent(caption);
  if (!hasError && !hasCaption && !hasCounter) return null;
  const idPrefix = `${prefix}${skeleton ? '-skeleton' : ''}`;
  return (
    <div className={`fdoc-${prefix}__helper fdoc-field__helper`} data-testid={`${idPrefix}-helper`}>
      {(hasError || hasCaption) && <span id={skeleton ? undefined : errorId ?? captionId}
        className={joinClassNames(`fdoc-${prefix}__caption`, 'fdoc-field__caption', isError && !skeleton && 'fdoc-field__caption--error', disabled && !skeleton && 'fdoc-field__caption--disabled', isError && disabled && !skeleton && 'fdoc-field__caption--error-disabled')}
        data-testid={`${idPrefix}-${skeleton ? 'helper-text' : hasError ? 'error' : 'caption'}`}>
        {skeleton ? <Skeleton width="64px" shape="text" textSize="caption" data-testid={`${idPrefix}-helper-shape`} /> : hasError ? error : caption}
      </span>}
      {hasCounter && <span id={skeleton ? undefined : counterId}
        className={joinClassNames(`fdoc-${prefix}__counter`, 'fdoc-field__counter', disabled && !skeleton && 'fdoc-field__counter--disabled')}
        data-testid={`${idPrefix}-counter`}>
        {skeleton ? <Skeleton width="40px" shape="text" textSize="caption" data-testid={`${idPrefix}-counter-shape`} /> : resolvedCounter}
      </span>}
    </div>
  );
}
