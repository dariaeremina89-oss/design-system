import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { ProgressIndicator, type ProgressIndicatorColor } from '../ProgressIndicator/ProgressIndicator';
import { Skeleton } from '../Skeleton/Skeleton';
import './Button.css';

export type ButtonSize = 'small' | 'medium' | 'large' | 'giant';
export type ButtonColor =
  | 'primary'
  | 'base'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'inverse-primary';
export type ButtonState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'skeleton';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Стабильный идентификатор корневого элемента для UI-тестов. */
  'data-testid'?: string;
  /** Надпись кнопки. Для сложного содержимого используйте children. */
  text?: string;
  /** Размер кнопки из набора Figma. */
  size?: ButtonSize;
  /** Цветовая семантика кнопки из Figma. */
  color?: ButtonColor;
  /** Принудительное состояние для stories и статичных примеров. */
  state?: ButtonState;
  /** Иконка из экспортированной библиотеки Figma в левом слоте. */
  iconLeft?: IconName;
  /** Произвольный контент левого слота иконки. */
  iconLeftView?: ReactNode;
  /** Иконка из экспортированной библиотеки Figma в правом слоте. */
  iconRight?: IconName;
  /** Произвольный контент правого слота иконки. */
  iconRightView?: ReactNode;
  /** Вложенный Badge в левом слоте. Токены принадлежат Badge. */
  badgeLeft?: ReactNode;
  /** Вложенный Badge в правом слоте. Токены принадлежат Badge. */
  badgeRight?: ReactNode;
  /** Показывает Circular Progress Indicator слева и блокирует повторную отправку. */
  isLoading?: boolean;
  /** Растянуть кнопку на ширину родителя. */
  fullWidth?: boolean;
  /** Ширина скелетона. По умолчанию соответствует Figma-примеру Button. */
  skeletonWidth?: CSSProperties['width'];
}

const sizeMap: Record<
  ButtonSize,
  { button: number; icon: number; badge: number; paddingY: number; paddingX: number; gap: number }
> = {
  small: { button: 32, icon: 16, badge: 16, paddingY: 8, paddingX: 12, gap: 2 },
  medium: { button: 40, icon: 20, badge: 20, paddingY: 8, paddingX: 16, gap: 2 },
  large: { button: 48, icon: 24, badge: 24, paddingY: 8, paddingX: 16, gap: 4 },
  giant: { button: 56, icon: 28, badge: 28, paddingY: 12, paddingX: 20, gap: 4 },
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function renderIcon(icon: IconName | undefined, iconView: ReactNode, size: number) {
  return iconView ?? (icon ? <Icon name={icon} size={size} /> : null);
}

function getLoadingColor(color: ButtonColor): ProgressIndicatorColor {
  if (color === 'primary') return 'primary';
  if (color === 'inverse' || color === 'inverse-primary') return 'tertiary';
  return 'secondary';
}

export function Button({
  children,
  text,
  size = 'medium',
  color = 'primary',
  state = 'default',
  iconLeft,
  iconLeftView,
  iconRight,
  iconRightView,
  badgeLeft,
  badgeRight,
  isLoading = false,
  fullWidth = false,
  skeletonWidth,
  className,
  style,
  disabled,
  'aria-busy': ariaBusy,
  type = 'button',
  'data-testid': testId,
  ...props
}: ButtonProps) {
  const dimensions = sizeMap[size];
  const isDisabled = Boolean(disabled || state === 'disabled' || isLoading);
  const content = children ?? text;
  const hasText = content !== undefined && content !== null;
  const isSkeleton = state === 'skeleton';
  const buttonStyle = {
    ...style,
    '--fdoc-button-height': `${dimensions.button}px`,
    '--fdoc-button-icon-size': `${dimensions.icon}px`,
    '--fdoc-button-badge-size': `${dimensions.badge}px`,
    '--fdoc-button-padding-y': `${dimensions.paddingY}px`,
    '--fdoc-button-padding-x': `${dimensions.paddingX}px`,
    '--fdoc-button-gap': `${dimensions.gap}px`,
    ...(skeletonWidth !== undefined ? { '--fdoc-button-skeleton-width': skeletonWidth } : {}),
  } as CSSProperties;
  const classes = joinClassNames(
    'fdoc-button',
    `fdoc-button--${size}`,
    `fdoc-button--${color}`,
    state !== 'default' && `fdoc-button--${state}`,
    fullWidth && 'fdoc-button--full-width',
    className,
  );

  if (isSkeleton) {
    return (
      <Skeleton
        className={joinClassNames('fdoc-button__skeleton', `fdoc-button__skeleton--${size}`, className)}
        shape="rounded"
        width={skeletonWidth ?? 'var(--fdoc-button-skeleton-width)'}
        height={dimensions.button}
        data-button-state="skeleton"
        data-button-size={dimensions.button}
        data-testid={testId ?? 'button-skeleton'}
        style={buttonStyle}
      />
    );
  }

  return (
    <button
      {...props}
      type={type}
      className={classes}
      style={buttonStyle}
      disabled={isDisabled}
      aria-busy={isLoading || ariaBusy}
      data-testid={testId ?? 'button'}
      data-button-state={state}
      data-button-size={dimensions.button}
      data-button-loading={isLoading}
    >
      {badgeLeft !== undefined && (
        <span className="fdoc-button__badge fdoc-button__badge--left" data-testid="button-badge-left">
          {badgeLeft}
        </span>
      )}
      {(isLoading || renderIcon(iconLeft, iconLeftView, dimensions.icon) !== null) && (
        <span className="fdoc-button__icon fdoc-button__icon--left" data-testid={isLoading ? 'button-loading' : 'button-icon-left'}>
          {isLoading ? (
            <ProgressIndicator
              type="circular"
              mode="indeterminate"
              color={getLoadingColor(color)}
              aria-label="Загрузка"
            />
          ) : (
            renderIcon(iconLeft, iconLeftView, dimensions.icon)
          )}
        </span>
      )}
      {hasText && (
        <span className="fdoc-button__text" data-testid="button-text">
          {content}
        </span>
      )}
      {renderIcon(iconRight, iconRightView, dimensions.icon) !== null && (
        <span className="fdoc-button__icon fdoc-button__icon--right" data-testid="button-icon-right">
          {renderIcon(iconRight, iconRightView, dimensions.icon)}
        </span>
      )}
      {badgeRight !== undefined && (
        <span className="fdoc-button__badge fdoc-button__badge--right" data-testid="button-badge-right">
          {badgeRight}
        </span>
      )}
    </button>
  );
}
