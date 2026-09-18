import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './ButtonIcon.css';

export type ButtonIconSize = 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'giant';
export type ButtonIconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'base'
  | 'inverse'
  | 'inverse-primary'
  | 'inverse-light';
export type ButtonIconState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'skeleton';

export interface ButtonIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Обязательное доступное имя действия кнопки. */
  'aria-label': string;
  /** Иконка из экспортированной библиотеки Figma. */
  icon?: IconName;
  /** Произвольный слот иконки, если нужна не библиотечная иконка. */
  iconView?: ReactNode;
  /** Размер кнопки. Внешний размер не меняется от толщины focus-обводки. */
  size?: ButtonIconSize;
  /** Размер иконки. По умолчанию выбирается из размера кнопки. */
  iconSize?: number;
  /** Цветовая семантика из Button Icon в Figma. */
  color?: ButtonIconColor;
  /** Принудительное состояние для stories и статичных примеров. */
  state?: ButtonIconState;
}

const sizeMap: Record<ButtonIconSize, { button: number; icon: number; padding: number }> = {
  xxsmall: { button: 16, icon: 16, padding: 0 },
  xsmall: { button: 24, icon: 16, padding: 4 },
  small: { button: 32, icon: 16, padding: 8 },
  medium: { button: 40, icon: 24, padding: 8 },
  large: { button: 48, icon: 32, padding: 8 },
  giant: { button: 56, icon: 40, padding: 8 },
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function ButtonIcon({
  icon,
  iconView,
  size = 'medium',
  iconSize,
  color = 'primary',
  state = 'default',
  className,
  style,
  disabled,
  type = 'button',
  ...props
}: ButtonIconProps) {
  const dimensions = sizeMap[size];
  const isDisabled = disabled || state === 'disabled';
  const isSkeleton = state === 'skeleton';
  const buttonStyle = {
    ...style,
    '--fdoc-button-icon-size': `${dimensions.button}px`,
    '--fdoc-button-icon-padding': `${dimensions.padding}px`,
    '--fdoc-button-icon-glyph-size': `${iconSize ?? dimensions.icon}px`,
  } as CSSProperties;
  const classes = joinClassNames(
    'fdoc-button-icon',
    `fdoc-button-icon--${size}`,
    `fdoc-button-icon--${color}`,
    state !== 'default' && `fdoc-button-icon--${state}`,
    className,
  );

  if (isSkeleton) {
    return (
      <Skeleton
        className={joinClassNames('fdoc-button-icon__skeleton', className)}
        shape="circle"
        width={dimensions.button}
        height={dimensions.button}
        data-button-icon-state="skeleton"
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
      data-button-icon-state={state}
      data-button-icon-size={dimensions.button}
    >
      {iconView ?? (icon ? <Icon name={icon} size={iconSize ?? dimensions.icon} /> : null)}
    </button>
  );
}
