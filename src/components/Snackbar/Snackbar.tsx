import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName, type IconProps } from '../Icon/Icon';
import './Snackbar.css';

export interface SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  'data-testid'?: string;
  type?: 'default' | 'success' | 'error';
  size?: 'small' | 'medium';
  direction?: 'horizontal' | 'vertical';
  text: ReactNode;
  /** Готовая Button size="small" color="inverse-primary". Обработчик управляет закрытием снаружи. */
  children?: ReactNode;
  /** Наличие обработчика включает кнопку закрытия. */
  onClose?: () => void;
  closeLabel?: string;
  /** Замена иконки только для default; размер и цвет определены компонентом. */
  icon?: Pick<IconProps, 'name'>;
}
const icons: Record<NonNullable<SnackbarProps['type']>, IconName> = {
  default: 'filled/exclamation_circle_filled',
  success: 'filled/check_circle_filled',
  error: 'filled/cross_circle_filled',
};

/** Визуальное уведомление. Видимость, таймер и позиция управляются снаружи. */
export function Snackbar({ type = 'default', size = 'small', direction = 'horizontal', text,
  children, onClose, closeLabel = 'Закрыть уведомление', icon, className = '', ...props }: SnackbarProps) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    const previous = document.activeElement;
    return () => {
      if (element?.contains(document.activeElement) && previous instanceof HTMLElement && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);
  if (text == null || typeof text === 'boolean' || (typeof text === 'string' && !text.trim())) return null;
  return <div {...props} ref={root} className={`fdoc-snackbar ${className}`}
    data-testid={props['data-testid'] ?? 'snackbar'} data-type={type} data-size={size}
    data-direction={direction} data-close={Boolean(onClose)} data-action={Boolean(children)}>
    <div className="fdoc-snackbar__message" role={type === 'error' ? 'alert' : 'status'} aria-atomic="true">
      <span className="fdoc-snackbar__icon" aria-hidden="true"><Icon name={type === 'default' ? icon?.name ?? icons.default : icons[type]} size={24} /></span>
      <div className="fdoc-snackbar__text">{text}</div>
    </div>
    {children && <div className="fdoc-snackbar__action">{children}</div>}
    {onClose && <ButtonIcon className="fdoc-snackbar__close" icon="cross" size="small" color="inverse"
      aria-label={closeLabel} onClick={onClose} data-testid="snackbar-close" />}
  </div>;
}
