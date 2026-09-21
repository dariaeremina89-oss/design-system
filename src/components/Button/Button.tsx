import { cloneElement, isValidElement, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { Badge, type BadgeColor, type BadgeProps, type BadgeState } from '../Badge/Badge';
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
  /** Явно показывает или скрывает левый слот иконки. */
  showIconLeft?: boolean;
  /** Произвольный контент левого слота иконки. */
  iconLeftView?: ReactNode;
  /** Иконка из экспортированной библиотеки Figma в правом слоте. */
  iconRight?: IconName;
  /** Явно показывает или скрывает правый слот иконки. */
  showIconRight?: boolean;
  /** Произвольный контент правого слота иконки. */
  iconRightView?: ReactNode;
  /** Вложенный Badge в левом слоте. Button синхронизирует его цвет и состояние. */
  badgeLeft?: ReactNode;
  /** Явно показывает или скрывает левый слот Badge. */
  showBadgeLeft?: boolean;
  /** Вложенный Badge в правом слоте. Button синхронизирует его цвет и состояние. */
  badgeRight?: ReactNode;
  /** Явно показывает или скрывает правый слот Badge. */
  showBadgeRight?: boolean;
  /** Показывает Circular Progress Indicator слева и блокирует повторную отправку. */
  isLoading?: boolean;
  /** Растянуть кнопку на ширину родителя. */
  fullWidth?: boolean;
  /** Ширина скелетона. По умолчанию соответствует Figma-примеру Button. */
  skeletonWidth?: CSSProperties['width'];
}

const sizeMap: Record<
  ButtonSize,
  { button: number; icon: number; paddingY: number; paddingX: number; gap: number }
> = {
  small: { button: 32, icon: 16, paddingY: 8, paddingX: 12, gap: 2 },
  medium: { button: 40, icon: 20, paddingY: 8, paddingX: 16, gap: 2 },
  large: { button: 48, icon: 24, paddingY: 8, paddingX: 16, gap: 4 },
  giant: { button: 56, icon: 28, paddingY: 12, paddingX: 20, gap: 4 },
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

function getButtonBadgeColor(color: ButtonColor): BadgeColor {
  return color === 'inverse' || color === 'inverse-primary' ? 'primary' : 'inverse';
}

function renderButtonBadge(badge: ReactNode, color: BadgeColor, state: BadgeState) {
  if (!isValidElement<BadgeProps>(badge) || badge.type !== Badge) return badge;
  return cloneElement(badge, { color, state });
}

export function Button({
  children,
  text,
  size = 'medium',
  color = 'primary',
  state = 'default',
  iconLeft,
  showIconLeft,
  iconLeftView,
  iconRight,
  showIconRight,
  iconRightView,
  badgeLeft,
  showBadgeLeft,
  badgeRight,
  showBadgeRight,
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
  const buttonBadgeColor = getButtonBadgeColor(color);
  const buttonBadgeState: BadgeState = isDisabled ? 'disabled' : 'default';
  const leftIcon = renderIcon(iconLeft, iconLeftView, dimensions.icon);
  const rightIcon = renderIcon(iconRight, iconRightView, dimensions.icon);
  const hasLeftIcon = showIconLeft ?? leftIcon !== null;
  const hasRightIcon = showIconRight ?? rightIcon !== null;
  const hasLeftBadge = showBadgeLeft ?? badgeLeft !== undefined;
  const hasRightBadge = showBadgeRight ?? badgeRight !== undefined;
  // Storybook can pass an empty children control. Keep the public text control live.
  const content = children === undefined || children === null || children === '' ? text : children;
  const hasText = content !== undefined && content !== null;
  const isSkeleton = state === 'skeleton';
  const buttonStyle = {
    ...style,
    '--fdoc-button-height': `${dimensions.button}px`,
    '--fdoc-button-icon-size': `${dimensions.icon}px`,
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
      {(isLoading || hasLeftIcon) && (
        <span className="fdoc-button__icon fdoc-button__icon--left" data-testid={isLoading ? 'button-loading' : 'button-icon-left'}>
          {isLoading ? (
            <ProgressIndicator
              type="circular"
              mode="indeterminate"
              size={dimensions.icon}
              color={getLoadingColor(color)}
              aria-label="Загрузка"
            />
          ) : (
            leftIcon
          )}
        </span>
      )}
      {hasLeftBadge && (
        <span className="fdoc-button__badge fdoc-button__badge--left" data-testid="button-badge-left">
          {renderButtonBadge(badgeLeft, buttonBadgeColor, buttonBadgeState)}
        </span>
      )}
      {hasText && (
        <span className="fdoc-button__text" data-testid="button-text">
          {content}
        </span>
      )}
      {hasRightBadge && (
        <span className="fdoc-button__badge fdoc-button__badge--right" data-testid="button-badge-right">
          {renderButtonBadge(badgeRight, buttonBadgeColor, buttonBadgeState)}
        </span>
      )}
      {hasRightIcon && (
        <span className="fdoc-button__icon fdoc-button__icon--right" data-testid="button-icon-right">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
