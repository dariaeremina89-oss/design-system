import { Children, Fragment, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import './InfoBlock.css';

export type InfoBlockColor = 'neutral' | 'base' | 'success' | 'accent' | 'warning' | 'error' | 'inverse';

export interface InfoBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  color?: InfoBlockColor;
  title?: ReactNode;
  text?: ReactNode;
  leftIcon?: IconName;
  leftIconView?: ReactNode;
  showLeftIcon?: boolean;
  /** Один или два Action. Лишние элементы не рендерятся. */
  actions?: ReactNode;
  closable?: boolean;
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

function flattenActions(node: ReactNode): ReactNode[] {
  return Children.toArray(node).flatMap(child =>
    isValidElement(child) && child.type === Fragment
      ? flattenActions(child.props.children)
      : [child],
  );
}

export function InfoBlock({
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
  const actionItems = flattenActions(actions).slice(0, 2);

  return (
    <div
      {...props}
      className={joinClassNames('fdoc-info-block', `fdoc-info-block--${color}`, className)}
      data-testid={props['data-testid'] ?? 'info-block'}
    >
      <div className="fdoc-info-block__main">
        {showLeftIcon && (
          <span className="fdoc-info-block__icon" data-testid="info-block-icon" aria-hidden="true">
            {leftIconView ?? <Icon name={leftIcon ?? defaultIcons[color]} size={24} />}
          </span>
        )}
        <div className="fdoc-info-block__body">
          {(title !== undefined && title !== null || text !== undefined && text !== null) && (
            <div className="fdoc-info-block__copy">
              {title !== undefined && title !== null && <div className="fdoc-info-block__title">{title}</div>}
              {text !== undefined && text !== null && <div className="fdoc-info-block__text">{text}</div>}
            </div>
          )}
          {actionItems.length > 0 && <div className="fdoc-info-block__actions">{actionItems}</div>}
        </div>
      </div>
      {closable && (
        <ButtonIcon className="fdoc-info-block__close" aria-label="Закрыть" icon="cross" size="small"
          color={color === 'inverse' ? 'inverse' : 'neutral'} onClick={onClose} data-testid="info-block-close" />
      )}
    </div>
  );
}
