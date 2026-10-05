import { Children, Fragment, isValidElement, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import './InfoBlock.css';

export type InfoBlockColor = 'neutral' | 'base' | 'success' | 'accent' | 'warning' | 'error' | 'inverse';

export interface InfoBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  'data-testid'?: string;
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
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
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
  const hasTitle = title !== undefined && title !== null && title !== '' && typeof title !== 'boolean';
  const hasText = text !== undefined && text !== null && text !== '' && typeof text !== 'boolean';
  const hasCopy = hasTitle || hasText;
  const rootRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsLayout, setActionsLayout] = useState<'none' | 'horizontal' | 'vertical'>(
    actionItems.length > 0 ? 'horizontal' : 'none',
  );

  useLayoutEffect(() => {
    if (actionItems.length === 0) {
      setActionsLayout('none');
      return;
    }

    const root = rootRef.current;
    const actionRoot = actionsRef.current;
    if (!root || !actionRoot) return;

    const measure = () => {
      const actionChildren = Array.from(actionRoot.children) as HTMLElement[];
      const actionWidth = actionChildren.reduce(
        (sum, child) => sum + Math.max(child.getBoundingClientRect().width, child.scrollWidth),
        0,
      ) + Math.max(0, actionChildren.length - 1) * 8 + 8;

      // Figma Medium / Horizontal:
      // Text outer width 206, icon 24 + gap 8, root padding 16/4,
      // gaps 8 around the action group, close 32.
      const copyMinWidth = hasCopy ? 206 : 0;
      const mainMinWidth = copyMinWidth + (showLeftIcon ? 24 + (hasCopy ? 8 : 0) : 0);
      const rootPadding = 16 + 4;
      const actionGap = 8;
      const closeWidth = closable ? 32 : 0;
      const closeGap = closable ? 8 : 0;
      const requiredHorizontalWidth = rootPadding + mainMinWidth + actionGap + actionWidth + closeGap + closeWidth;
      const nextLayout = root.getBoundingClientRect().width + 0.5 >= requiredHorizontalWidth ? 'horizontal' : 'vertical';

      setActionsLayout(current => current === nextLayout ? current : nextLayout);
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    for (const child of Array.from(actionRoot.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [actions, actionItems.length, closable, hasCopy, showLeftIcon]);

  return (
    <div
      {...props}
      ref={rootRef}
      className={joinClassNames('fdoc-info-block', `fdoc-info-block--${color}`, className)}
      data-actions-layout={actionsLayout}
      data-closable={closable ? 'true' : 'false'}
      data-left-icon={showLeftIcon ? 'true' : 'false'}
      data-testid={props['data-testid'] ?? 'info-block'}
    >
      <div className="fdoc-info-block__main">
        {showLeftIcon && (
          <span className="fdoc-info-block__icon" data-testid="info-block-icon" aria-hidden="true">
            {leftIconView ?? <Icon name={leftIcon ?? defaultIcons[color]} size={24} />}
          </span>
        )}
        {hasCopy && (
          <div className="fdoc-info-block__copy">
            {hasTitle && <div className="fdoc-info-block__title">{title}</div>}
            {hasText && <div className="fdoc-info-block__text">{text}</div>}
          </div>
        )}
      </div>
      {actionItems.length > 0 && <div ref={actionsRef} className="fdoc-info-block__actions">{actionItems}</div>}
      {closable && (
        <ButtonIcon className="fdoc-info-block__close" aria-label="Закрыть" icon="cross" size="small"
          color={color === 'inverse' ? 'inverse' : 'neutral'} onClick={onClose} data-testid="info-block-close" />
      )}
    </div>
  );
}
