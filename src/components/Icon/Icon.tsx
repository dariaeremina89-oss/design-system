import type { CSSProperties, HTMLAttributes } from 'react';
import iconAssets from './icon-assets.json';
import './Icon.css';

export type IconName = keyof typeof iconAssets;

export const iconNames = Object.keys(iconAssets) as IconName[];

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Имя иконки из экспортированной библиотеки Figma. */
  name: IconName;
  /** Размер иконки в px. */
  size?: number;
  /** Доступное имя для самостоятельной иконки. */
  title?: string;
  /** Цвет монохромной иконки. */
  color?: string;
}

// These SVGs contain intentional multiple fills (for example, the white
// center of the cursor). CSS masks keep only alpha and would flatten them.
const colorAssetPrefixes = ['multicolor/', 'flag_chevron/', 'cursors/'];

function isColorAsset(name: IconName) {
  return colorAssetPrefixes.some((prefix) => name.startsWith(prefix));
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Icon({
  name,
  size = 24,
  title,
  color,
  className,
  style,
  ...props
}: IconProps) {
  const svg = iconAssets[name];
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const iconStyle = {
    ...style,
    '--fdoc-icon-size': `${size}px`,
    ...(color ? { color } : {}),
  } as CSSProperties;
  const accessibleProps = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true as const };

  if (isColorAsset(name)) {
    return (
      <img
        {...props}
        {...accessibleProps}
        className={joinClassNames('fdoc-icon', 'fdoc-icon--color', className)}
        style={iconStyle}
        src={dataUrl}
        alt={title ?? ''}
        data-icon={name}
      />
    );
  }

  const maskStyle = {
    ...iconStyle,
    '--fdoc-icon-mask': `url("${dataUrl}")`,
  } as CSSProperties;

  return (
    <span
      {...props}
      {...accessibleProps}
      className={joinClassNames('fdoc-icon', className)}
      style={maskStyle}
      data-icon={name}
    />
  );
}
