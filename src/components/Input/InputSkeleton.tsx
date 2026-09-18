import { Children, isValidElement, type ReactNode } from 'react';
import type { IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import type { InputSize } from './Input';

export interface InputSkeletonProps {
  size?: InputSize;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  caption?: ReactNode;
  counter?: ReactNode | boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  sum?: ReactNode;
  sumIcon?: IconName;
  caret?: boolean;
  clearable?: boolean;
  value?: unknown;
  defaultValue?: unknown;
  placeholder?: string;
  maxLength?: number;
  wrapperClassName?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
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

function skeletonWidth(node: ReactNode, fallback: number, min: number, max: number) {
  const length = textLength(node);
  const estimated = length > 0 ? length * 7 + 4 : fallback;
  return `${Math.min(max, Math.max(min, estimated))}px`;
}

function valueText(value: unknown, defaultValue: unknown, placeholder?: string): ReactNode {
  if (value !== undefined && value !== null) return String(value);
  if (defaultValue !== undefined && defaultValue !== null) return String(defaultValue);
  return placeholder;
}

export function InputSkeleton({
  size = 'medium',
  label,
  description,
  error,
  caption,
  counter,
  leadingIcon,
  trailingIcon,
  sum,
  sumIcon,
  caret = false,
  clearable = false,
  value,
  defaultValue,
  placeholder,
  maxLength,
  wrapperClassName,
}: InputSkeletonProps) {
  const hasLabel = label !== undefined && label !== false;
  const hasHelperText = error !== undefined || caption !== undefined;
  const hasCounter = counter !== undefined && counter !== false;
  const hasValue = textLength(valueText(value, defaultValue)) > 0;
  const helperText = error ?? caption;
  const inputText = valueText(value, defaultValue, placeholder);
  const counterText = counter === true
    ? `0 / ${maxLength ?? 0}`
    : counter;

  return (
    <div
      className={joinClassNames('fdoc-input', `fdoc-input--${size}`, wrapperClassName)}
      aria-hidden="true"
    >
      {hasLabel && (
        <div className="fdoc-input__label">
          <span className="fdoc-input__label-text">
            <Skeleton
              className="fdoc-input__skeleton--label"
              width={skeletonWidth(label, 64, 32, 280)}
              height="var(--font-size-12)"
              shape="text"
            />
          </span>
        </div>
      )}

      <div
        className={joinClassNames(
          'fdoc-input__field',
          leadingIcon !== undefined && 'fdoc-input__field--has-leading',
          'fdoc-input__field--skeleton',
        )}
      >
        {leadingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--leading">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="circle" />
          </span>
        )}

        <span className="fdoc-input__content">
          <Skeleton
            className="fdoc-input__skeleton--input-text"
            width={skeletonWidth(inputText, 64, 32, 280)}
            height="var(--font-size-16)"
            shape="text"
          />
          {description !== undefined && (
            <Skeleton
              className="fdoc-input__skeleton--description"
              width={skeletonWidth(description, 96, 48, 280)}
              height="var(--font-size-12)"
              shape="text"
            />
          )}
        </span>

        {sum !== undefined && (
          <span className="fdoc-input__sum">
            <Skeleton
              className="fdoc-input__skeleton--sum"
              width={skeletonWidth(sum, 32, 24, 96)}
              height="var(--font-size-14)"
              shape="text"
            />
            {sumIcon !== undefined && (
              <span className="fdoc-input__sum-icon">
                <Skeleton width="var(--elements-16)" height="var(--elements-16)" shape="circle" />
              </span>
            )}
          </span>
        )}

        {clearable && hasValue && (
          <span className="fdoc-input__clear">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="circle" />
          </span>
        )}

        {trailingIcon !== undefined && (
          <span className="fdoc-input__slot fdoc-input__slot--trailing">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="circle" />
          </span>
        )}

        {caret && (
          <span className="fdoc-input__caret">
            <Skeleton width="var(--elements-24)" height="var(--elements-24)" shape="circle" />
          </span>
        )}
      </div>

      {(hasHelperText || hasCounter) && (
        <div className="fdoc-input__helper">
          {hasHelperText && (
            <span className="fdoc-input__caption">
              <Skeleton
                className="fdoc-input__skeleton--helper"
                width={skeletonWidth(helperText, 96, 48, 360)}
                height="var(--font-size-12)"
                shape="text"
              />
            </span>
          )}
          {hasCounter && (
            <span className="fdoc-input__counter">
              <Skeleton
                className="fdoc-input__skeleton--counter"
                width={skeletonWidth(counterText, 48, 32, 96)}
                height="var(--font-size-12)"
                shape="text"
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
