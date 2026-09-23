import type { HTMLAttributes, ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import './InfoBlock.css';

export type InfoBlockSize = 'small' | 'medium';
export type InfoBlockDirection = 'horizontal' | 'vertical';
export type InfoBlockColor = 'neutral' | 'base' | 'success' | 'accent' | 'warning' | 'error' | 'inverse';

export interface InfoBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  /** Визуальный размер компонента. */
  size?: InfoBlockSize;
  /** Расположение Actions относительно текста. */
  direction?: InfoBlockDirection;
  /** Цветовая семантика InfoBlock. */
  color?: InfoBlockColor;
  /** Заголовок. */
  title?: ReactNode;
  /** Основной текст. */
  text?: ReactNode;
  /** Иконка слева из библиотеки F.Doc. */
  leftIcon?: IconName;
  /** Произвольное содержимое слота иконки слева. */
  leftIconView?: ReactNode;
  /** Показывать левую иконку. */
  showLeftIcon?: boolean;
  /** Actions, не более двух. */
  actions?: ReactNode;
  /** Показывать кнопку закрытия. */
  closable?: boolean;
  /** Обработчик закрытия. */
  onClose?: () => void;
}

const defaultIcons: Record<InfoBlockColor, IconName> = {
  neutral: 'info_circle',
  base: 'info_circle',
  success: 'filled/check_circle_filled',
  accent: 'info_circle',
  warning: 'exclamation_triangle',
  error: 'filled/exclamation_circle_filled',
  inverse: 'info_circle',
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function InfoBlock({
  size = 'medium',
  direction = 'horizontal',
  color = 'neutral',
  title,
  text,
  leftIcon,
  leftIconView,
  showLeftIcon = true,
  actions,
  closable = true,
  onClose,
  className,
  ...props
}: InfoBlockProps) {
  return (
    <div
      {...props}
      className={joinClassNames(
        'fdoc-info-block',
        `fdoc-info-block--${size}`,
        `fdoc-info-block--${direction}`,
        `fdoc-info-block--${color}`,
        className,
      )}
      data-testid={props['data-testid'] ?? 'info-block'}
    >
      <div className="fdoc-info-block__main">
        {showLeftIcon && (
          <span className="fdoc-info-block__icon" data-testid="info-block-icon">
            {leftIconView ?? <Icon name={leftIcon ?? defaultIcons[color]} size={24} />}
          </span>
        )}
        <div className="fdoc-info-block__body">
          <div className="fdoc-info-block__copy">
            {title !== undefined && title !== null && (
              <div className="fdoc-info-block__title">{title}</div>
            )}
            {text !== undefined && text !== null && (
              <div className="fdoc-info-block__text">{text}</div>
            )}
          </div>
          {actions && <div className="fdoc-info-block__actions">{actions}</div>}
        </div>
      </div>
      {closable && (
        <ButtonIcon
          className="fdoc-info-block__close"
          aria-label="Закрыть"
          icon="cross"
          size="small"
          color={color === 'inverse' ? 'inverse' : 'neutral'}
          onClick={onClose}
          data-testid="info-block-close"
        />
      )}
    </div>
  );
}
