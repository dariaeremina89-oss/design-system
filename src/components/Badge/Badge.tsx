import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import './Badge.css';

export type BadgeSize = 'smallest' | 'small' | 'medium' | 'large' | 'giant';
export type BadgeColor = 'primary' | 'secondary' | 'inverse';
export type BadgeState = 'default' | 'disabled' | 'skeleton';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Стабильный идентификатор элемента для UI-тестов. */
  'data-testid'?: string;
  /** Размер Badge из Figma. Smallest имеет внешний размер 16 и точку 8. */
  size?: BadgeSize;
  /** Цветовая схема из Figma. */
  color?: BadgeColor;
  /** Визуальное состояние. */
  state?: BadgeState;
  /** Короткое значение Badge. Для сложного текста используйте children. */
  text?: string;
  /** Ширина Skeleton, если она должна соответствовать конкретному контенту. */
  skeletonWidth?: CSSProperties['width'];
  children?: ReactNode;
}

const textSkeletonWidths: Record<Exclude<BadgeSize, 'smallest'>, number> = {
  small: 28,
  medium: 31,
  large: 43,
  giant: 47,
};

const sizeHeights: Record<BadgeSize, number> = {
  smallest: 16,
  small: 16,
  medium: 20,
  large: 24,
  giant: 28,
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Badge({
  children,
  text,
  size = 'medium',
  color = 'primary',
  state = 'default',
  skeletonWidth,
  className,
  style,
  'data-testid': testId,
  ...props
}: BadgeProps) {
  // Storybook can pass an empty children control. Keep the public text control live.
  const content = children === undefined || children === null || children === '' ? text : children;
  const isSmallest = size === 'smallest';
  const isSkeleton = state === 'skeleton';
  const defaultSmallestLabel = isSmallest
    && props['aria-label'] === undefined
    && props['aria-hidden'] === undefined
    ? 'Есть новые уведомления'
    : undefined;

  if (isSkeleton) {
    if (isSmallest) {
      return (
        <span
          {...props}
          className={joinClassNames('fdoc-badge', 'fdoc-badge--smallest', 'fdoc-badge--skeleton', className)}
          data-badge-color={color}
          data-badge-size={size}
          data-badge-state={state}
          data-testid={testId ?? 'badge-skeleton'}
          style={style}
          aria-hidden={props['aria-hidden'] ?? true}
        >
          <Skeleton
            className="fdoc-badge__skeleton-dot"
            shape="circle"
            width={8}
            height={8}
            data-testid={`${testId ?? 'badge-skeleton'}-dot`}
          />
        </span>
      );
    }

    return (
      <Skeleton
        {...props}
        className={joinClassNames('fdoc-badge__skeleton', `fdoc-badge__skeleton--${size}`, className)}
        shape="rounded"
        width={skeletonWidth ?? textSkeletonWidths[size]}
        height={sizeHeights[size]}
        data-badge-color={color}
        data-badge-size={size}
        data-badge-state={state}
        data-testid={testId ?? 'badge-skeleton'}
        style={style}
      />
    );
  }

  return (
    <span
      {...props}
      aria-label={defaultSmallestLabel ?? props['aria-label']}
      className={joinClassNames(
        'fdoc-badge',
        `fdoc-badge--${size}`,
        `fdoc-badge--${color}`,
        state === 'disabled' && 'fdoc-badge--disabled',
        className,
      )}
      data-badge-color={color}
      data-badge-size={size}
      data-badge-state={state}
      data-testid={testId ?? 'badge'}
      style={style}
    >
      {isSmallest ? <span className="fdoc-badge__dot" aria-hidden="true" /> : content}
    </span>
  );
}
