import { Children, isValidElement, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import type { IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
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
  trailingIcon?: IconName;
  sum?: ReactNode;
  sumIcon?: IconName;
  clearable?: boolean;
  value?: unknown;
  defaultValue?: unknown;
  placeholder?: string;
  maxLength?: number;
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
  trailingIcon,
  sum,
  sumIcon,
  clearable = false,
  value,
  defaultValue,
  testId,
  wrapperClassName,
}: InputSkeletonProps) {
  const hasLabel = hasRenderableContent(label);
  const hasDescription = hasRenderableContent(description);
  const hasError = hasRenderableContent(error);
  const hasCaption = hasRenderableContent(caption);
  const hasHelperText = hasError || hasCaption;
  const hasCounter = counter !== undefined
    && counter !== null
    && counter !== false
    && counter !== '';
  const hasSum = hasRenderableContent(sum);
  const providedValue = value !== undefined && value !== null ? value : defaultValue;
  const hasValue = textLength(providedValue as ReactNode) > 0;
  const helperText = hasError ? error : caption;

  return (
    <div
      className={joinClassNames('fdoc-input fdoc-field', `fdoc-input--${size}`, wrapperClassName)}
      aria-hidden="true"
      data-testid={testId ?? 'input-skeleton'}
    >
      {hasLabel && (
        <div className="fdoc-input__label fdoc-field__label" data-testid="input-skeleton-label">
          <span className="fdoc-input__label-text fdoc-field__label-text">
            <Skeleton
              className="fdoc-input__skeleton--label"
              data-testid="input-skeleton-label-text"
              width="64px"
              textSize="caption"
              shape="text"
            />
            {required && (
              <Skeleton
                className="fdoc-input__skeleton--required"
                data-testid="input-skeleton-required"
                width="var(--font-size-12)"
                textSize="caption"
                shape="text"
              />
            )}
          </span>
        </div>
      )}

      <div
        className={joinClassNames(
          'fdoc-input__field fdoc-field__field',
          leadingIcon !== undefined && 'fdoc-input__field--has-leading',
          'fdoc-input__field--skeleton',
        )}
        data-testid="input-skeleton-field"
      >
        {leadingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--leading" data-testid="input-skeleton-leading-icon">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="icon" data-testid="input-skeleton-leading-icon-shape" />
          </span>
        )}

        <span className="fdoc-input__content" data-testid="input-skeleton-content">
          <Skeleton
            className="fdoc-input__skeleton--input-text"
            data-testid="input-skeleton-text"
            width="80px"
            textSize="subtitle"
            shape="text"
          />
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
          <ButtonIcon
            className="fdoc-input__clear"
            size="xsmall"
            color="neutral"
            state="skeleton"
            aria-label="Очистка поля"
            data-testid="input-skeleton-clear"
          />
        )}

        {trailingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--trailing" data-testid="input-skeleton-trailing-icon">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="icon" data-testid="input-skeleton-trailing-icon-shape" />
          </span>
        )}

      </div>

      {(hasHelperText || hasCounter) && (
        <div className="fdoc-input__helper fdoc-field__helper" data-testid="input-skeleton-helper">
          {hasHelperText && (
            <span className="fdoc-input__caption fdoc-field__caption" data-testid="input-skeleton-helper-text">
              <Skeleton
                className="fdoc-input__skeleton--helper"
                data-testid="input-skeleton-helper-shape"
                width="64px"
                textSize="caption"
                shape="text"
              />
            </span>
          )}
          {hasCounter && (
            <span className="fdoc-input__counter fdoc-field__counter" data-testid="input-skeleton-counter">
              <Skeleton
                className="fdoc-input__skeleton--counter"
                data-testid="input-skeleton-counter-shape"
                width="40px"
                textSize="caption"
                shape="text"
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
