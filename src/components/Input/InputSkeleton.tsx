import { Children, isValidElement, type ReactNode } from 'react';
import type { IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import { FieldClearButton, FieldHelper, FieldLabel } from '../TextField/TextField';
import type { InputSize } from './Input';

export interface InputSkeletonProps {
  size?: InputSize;
  label?: ReactNode;
  required?: boolean;
  description?: ReactNode;
  error?: ReactNode;
  caption?: ReactNode;
  counter?: ReactNode | boolean;
  leadingIcon?: IconName;
  leadingContent?: ReactNode;
  trailingIcon?: IconName;
  trailingContent?: ReactNode;
  sum?: ReactNode;
  sumIcon?: IconName;
  clearable?: boolean;
  value?: unknown;
  defaultValue?: unknown;
  placeholder?: string;
  maxLength?: number;
  showText?: boolean;
  testId?: string;
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

function textLength(node: ReactNode): number {
  let length = 0;

  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      length += String(child).length;
      return;
    }

    if (isValidElement(child)) {
      const props = child.props as { children?: ReactNode };
      length += textLength(props.children);
    }
  });

  return length;
}

export function InputSkeleton({
  size = 'medium',
  label,
  required = false,
  description,
  error,
  caption,
  counter,
  leadingIcon,
  leadingContent,
  trailingIcon,
  trailingContent,
  sum,
  sumIcon,
  clearable = false,
  value,
  defaultValue,
  showText = false,
  testId,
  wrapperClassName,
}: InputSkeletonProps) {
  const hasDescription = hasRenderableContent(description);
  const hasCounter = counter !== undefined
    && counter !== null
    && counter !== false
    && counter !== '';
  const hasSum = hasRenderableContent(sum);
  const hasLeading = leadingIcon !== undefined || hasRenderableContent(leadingContent);
  const providedValue = value !== undefined && value !== null ? value : defaultValue;
  const hasValue = textLength(providedValue as ReactNode) > 0;

  return (
    <div
      className={joinClassNames('fdoc-input fdoc-field', `fdoc-input--${size}`, wrapperClassName)}
      aria-hidden="true"
      data-testid={testId ?? 'input-skeleton'}
    >
      <FieldLabel
        prefix="input"
        label={label}
        inputId=""
        required={required}
        skeleton
      />

      <div
        className={joinClassNames(
          'fdoc-input__field fdoc-field__field',
          hasLeading && 'fdoc-input__field--has-leading',
          'fdoc-input__field--skeleton',
        )}
        data-testid="input-skeleton-field"
      >
        {hasLeading && (
          <span className="fdoc-input__slot fdoc-input__slot--leading fdoc-field__icon" data-testid="input-skeleton-leading-icon">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="icon" data-testid="input-skeleton-leading-icon-shape" />
          </span>
        )}

        <span className="fdoc-input__content" data-testid="input-skeleton-content">
          {(showText || hasValue || hasDescription) && (
            <Skeleton
              className="fdoc-input__skeleton--input-text"
              data-testid="input-skeleton-text"
              width="80px"
              textSize="subtitle"
              shape="text"
            />
          )}
          {hasDescription && (
            <Skeleton
              className="fdoc-input__skeleton--description"
              data-testid="input-skeleton-description"
              width="88px"
              textSize="caption"
              shape="text"
            />
          )}
        </span>

        {hasSum && (
          <span className="fdoc-input__sum" data-testid="input-skeleton-sum">
            <Skeleton
              className="fdoc-input__skeleton--sum"
              data-testid="input-skeleton-sum-text"
              width="40px"
              textSize="body"
              shape="text"
            />
            {sumIcon !== undefined && (
              <span className="fdoc-input__sum-icon" data-testid="input-skeleton-sum-icon">
                <Skeleton width="var(--elements-16)" height="var(--elements-16)" shape="icon" data-testid="input-skeleton-sum-icon-shape" />
              </span>
            )}
          </span>
        )}

        {clearable && hasValue && (
          <FieldClearButton
            className="fdoc-input__clear"
            state="skeleton"
            aria-label="Очистить поле"
            data-testid="input-skeleton-clear"
          />
        )}

        {trailingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--trailing fdoc-field__icon" data-testid="input-skeleton-trailing-icon">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="icon" data-testid="input-skeleton-trailing-icon-shape" />
          </span>
        )}

        {trailingContent}
      </div>

      <FieldHelper
        prefix="input"
        error={error}
        caption={caption}
        hasCounter={hasCounter}
        resolvedCounter={counter === true ? '' : counter}
        skeleton
      />
    </div>
  );
}
