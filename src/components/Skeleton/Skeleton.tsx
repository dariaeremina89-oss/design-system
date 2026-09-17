import type { CSSProperties, HTMLAttributes } from 'react';
import './Skeleton.css';

export type SkeletonShape = 'text' | 'rounded' | 'circle';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Ширина блока. */
  width?: CSSProperties['width'];
  /** Высота блока. */
  height?: CSSProperties['height'];
  /** Форма блока. */
  shape?: SkeletonShape;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Skeleton({
  width,
  height,
  shape = 'rounded',
  className,
  style,
  ...props
}: SkeletonProps) {
  const skeletonStyle = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return (
    <span
      {...props}
      className={joinClassNames('fdoc-skeleton', `fdoc-skeleton--${shape}`, className)}
      style={skeletonStyle}
      aria-hidden={props['aria-hidden'] ?? true}
    />
  );
}
