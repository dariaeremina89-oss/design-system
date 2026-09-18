import type { CSSProperties, HTMLAttributes } from 'react';
import './Skeleton.css';

export type SkeletonShape = 'text' | 'rounded' | 'circle' | 'icon';
export type SkeletonTextSize =
  | 'h0-heading'
  | 'h1-heading'
  | 'h2-heading'
  | 'h3-heading'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'overline';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Стабильный идентификатор элемента для UI-тестов. */
  'data-testid'?: string;
  /** Ширина блока. */
  width?: CSSProperties['width'];
  /** Высота блока. */
  height?: CSSProperties['height'];
  /** Форма блока. */
  shape?: SkeletonShape;
  /** Текстовый стиль для скелетона с учетом line-height и высоты полоски. */
  textSize?: SkeletonTextSize;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Skeleton({
  width,
  height,
  shape = 'rounded',
  textSize,
  className,
  style,
  'data-testid': testId,
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
      className={joinClassNames(
        'fdoc-skeleton',
        `fdoc-skeleton--${shape}`,
        textSize && `fdoc-skeleton--text-${textSize}`,
        className,
      )}
      data-text-size={textSize}
      data-testid={testId ?? 'skeleton'}
      style={skeletonStyle}
      aria-hidden={props['aria-hidden'] ?? true}
    />
  );
}
