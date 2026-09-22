import { cloneElement, useId, useEffect, useRef, useState, type ReactElement, type HTMLAttributes } from 'react';
import { Menu, isMenuItemEnabled, type MenuItem, type MenuProps } from './Menu';
import { Popup, type PopupProps } from './Popup';

export interface DropdownProps extends Omit<MenuProps, 'autoFocus' | 'focusItems' | 'role'> {
  children: ReactElement<HTMLAttributes<HTMLElement> & { disabled?: boolean; state?: string; isLoading?: boolean }>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopupProps['placement'];
  matchWidth?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  /** Hover: наведение открывает меню; на узком экране и при касании используется клик. */
  trigger?: 'click' | 'hover';
  /** Основное действие кнопки. При касании/в адаптиве появляется первым пунктом меню. */
  primaryAction?: MenuItem;
}
const hoverQuery = '(min-width: 768px) and (hover: hover) and (pointer: fine)';
export function Dropdown({ children, open: controlled, defaultOpen = false, onOpenChange, placement = 'auto', matchWidth = false,
  closeOnSelect = true, disabled = false, trigger = 'click', primaryAction, onAction, id: providedId, items, ...menu }: DropdownProps) {
  const uid = useId(); const id = providedId ?? uid; const anchor = useRef<HTMLSpanElement>(null);
  const [internal, setInternal] = useState(defaultOpen);
  const [entryFocus, setEntryFocus] = useState<MenuProps['autoFocus']>('container');
  const [canHover, setCanHover] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(hoverQuery).matches));
  const [touchMenu, setTouchMenu] = useState(false);
  const pointerType = useRef('mouse'); const hoverOpened = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inactive = disabled || children.props.disabled || children.props.isLoading || children.props.state === 'disabled' || children.props.state === 'skeleton';
  const open = !inactive && (controlled ?? internal);
  const wasOpen = useRef(open);
  const includePrimary = trigger === 'hover' && (!canHover || touchMenu);
  const menuItems = trigger === 'hover' && primaryAction
    ? [...(includePrimary ? [primaryAction] : []), ...items.filter(item => item.id !== primaryAction.id)] : items;
  function cancelClose() { clearTimeout(closeTimer.current); }
  useEffect(() => {
    const media = window.matchMedia?.(hoverQuery); if (!media) return;
    const update = () => setCanHover(media.matches);
    media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (wasOpen.current && !open && entryFocus !== false && document.activeElement === document.body) anchor.current?.querySelector<HTMLElement>('button,a,[tabindex]')?.focus();
    wasOpen.current = open;
  }, [open, entryFocus]);
  function change(next: boolean, restore = false) {
    cancelClose();
    if (!next) hoverOpened.current = false;
    if (controlled === undefined) setInternal(next);
    if (next !== Boolean(open)) onOpenChange?.(next);
    if (restore) anchor.current?.querySelector<HTMLElement>('button,a,[tabindex]')?.focus();
  }
  function leaveHover() {
    cancelClose();
    if (!hoverOpened.current) return;
    closeTimer.current = setTimeout(() => {
      const popup = document.getElementById(id)?.closest('.fdoc-popup');
      if (!popup?.contains(document.activeElement)) change(false);
    }, 180);
  }
  return <><span ref={anchor} className="fdoc-dropdown-anchor" onPointerEnter={event => {
    cancelClose();
    if (trigger !== 'hover' || !canHover || event.pointerType !== 'mouse' || inactive) return;
    pointerType.current = 'mouse'; setTouchMenu(false);
    if (!open) { hoverOpened.current = true; setEntryFocus(false); change(true); }
  }} onPointerLeave={leaveHover} onKeyDown={event => {
    if (event.defaultPrevented || inactive) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); hoverOpened.current = false; setTouchMenu(false);
      setEntryFocus(event.key === 'ArrowUp' ? 'last' : true); change(true);
    }
  }}>{cloneElement(children, { disabled: inactive, 'aria-disabled': inactive || undefined, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? id : undefined,
    onPointerDown: event => { children.props.onPointerDown?.(event); pointerType.current = event.pointerType; if (trigger === 'hover') setTouchMenu(event.pointerType !== 'mouse'); },
    onClick: event => {
      if (inactive) return;
      const directAction = trigger === 'hover' && canHover && (event.detail === 0 || pointerType.current === 'mouse');
      // In touch mode the button only opens the menu; the primary action lives in its first row.
      if (trigger === 'click' || directAction) children.props.onClick?.(event);
      if (event.defaultPrevented) return;
      if (directAction && primaryAction) {
        if (isMenuItemEnabled(primaryAction)) { primaryAction.onAction?.(); onAction?.(primaryAction); change(false); }
      } else {
        hoverOpened.current = false;
        setEntryFocus(event.detail === 0 ? true : 'container'); change(!open);
      }
    } })}</span>
    {open && <Popup anchor={anchor} placement={placement} matchWidth={matchWidth} gap={4} maxHeight={typeof menu.maxHeight === 'number' ? menu.maxHeight : undefined}
      onPointerEnter={cancelClose} onPointerLeave={leaveHover} onFocusCapture={() => { hoverOpened.current = false; cancelClose(); }}
      onDismiss={reason => change(false, reason === 'escape')}>
      <Menu {...menu} items={menuItems} id={id} role="menu" onTab={event => { change(false, true); if (event.shiftKey) event.preventDefault(); }} autoFocus={entryFocus} onAction={item => { onAction?.(item); if (closeOnSelect) change(false, true); }}/>
    </Popup>}
  </>;
}
