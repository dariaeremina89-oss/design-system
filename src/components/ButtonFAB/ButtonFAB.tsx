import { useEffect, useState, type ButtonHTMLAttributes, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import type { ButtonIconState } from '../ButtonIcon/ButtonIcon';
import '../ButtonIcon/ButtonIcon.css';
import './ButtonFAB.css';

export type ButtonFABColor = 'primary' | 'secondary' | 'base' | 'inverse';
export type ButtonFABState = ButtonIconState;
export type ButtonFABPosition = 'floating' | 'inline';

export interface ButtonFABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children' | 'dangerouslySetInnerHTML'> {
  /** Однозначное доступное имя действия. */
  'aria-label': string;
  /** Одна иконка из библиотеки дизайн-системы. */
  icon: IconName;
  color?: ButtonFABColor;
  /** Принудительное состояние для демонстрации; default реагирует на действия пользователя. */
  state?: ButtonFABState;
  /** Floating — справа внизу окна; Inline — в потоке layout. */
  position?: ButtonFABPosition;
  'data-testid'?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function ButtonFAB({
  icon, color = 'primary', state = 'default', position = 'floating',
  disabled, type = 'button', className, style, ref,
  'data-testid': testId, ...props
}: ButtonFABProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const placementClass = `fdoc-button-fab fdoc-button-fab--${position}`;
  const content = state === 'skeleton' ? (
    <Skeleton
      shape="circle"
      className={[placementClass, 'fdoc-button-fab--skeleton', className].filter(Boolean).join(' ')}
      style={style}
      data-testid={testId ?? 'button-fab-skeleton'}
      data-button-fab-state="skeleton"
      data-button-fab-position={position}
    />
  ) : (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || state === 'disabled'}
      className={[
        'fdoc-button-icon', `fdoc-button-icon--${color}`,
        state !== 'default' && `fdoc-button-icon--${state}`, placementClass, className,
      ].filter(Boolean).join(' ')}
      style={style}
      data-testid={testId ?? 'button-fab'}
      data-button-icon-state={state}
      data-button-fab-state={state}
      data-button-fab-position={position}
    >
      <Icon name={icon} size={40} />
    </button>
  );

  // A body portal keeps fixed positioning outside transformed/scrolling containers.
  // Defer the portal until mount to keep the initial server/client render identical.
  if (position === 'floating') return mounted ? createPortal(content, document.body) : null;
  return content;
}
