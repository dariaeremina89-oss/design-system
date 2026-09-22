import { cloneElement, useId, useRef, useState, type ReactElement, type HTMLAttributes } from 'react';
import { Menu, type MenuProps } from './Menu';
import { Popup, type PopupProps } from './Popup';

export interface DropdownProps extends Omit<MenuProps, 'autoFocus' | 'focusItems' | 'role'> {
  children: ReactElement<HTMLAttributes<HTMLElement> & { disabled?: boolean; state?: string }>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopupProps['placement'];
  matchWidth?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
}
export function Dropdown({ children, open: controlled, defaultOpen = false, onOpenChange, placement = 'auto', matchWidth = false,
  closeOnSelect = true, disabled = false, onAction, id: providedId, ...menu }: DropdownProps) {
  const uid = useId(); const id = providedId ?? uid; const anchor = useRef<HTMLSpanElement>(null);
  const [internal, setInternal] = useState(defaultOpen); const [last, setLast] = useState(false);
  const inactive = disabled || children.props.disabled || children.props.state === 'disabled';
  const open = !inactive && (controlled ?? internal);
  function change(next: boolean, restore = false) {
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
    if (restore) anchor.current?.querySelector<HTMLElement>('button,a,[tabindex]')?.focus();
  }
  return <><span ref={anchor} className="fdoc-dropdown-anchor" onKeyDown={event => {
    if (event.defaultPrevented || inactive) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setLast(event.key === 'ArrowUp'); change(true); }
  }}>{cloneElement(children, { 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? id : undefined,
    onClick: event => { children.props.onClick?.(event); if (!event.defaultPrevented && !inactive) { setLast(false); change(!open); } } })}</span>
    {open && <Popup anchor={anchor} placement={placement} matchWidth={matchWidth} gap={4} onDismiss={reason => change(false, reason === 'escape')}>
      <Menu {...menu} id={id} role="menu" onTab={() => change(false, true)} autoFocus={last ? 'last' : true} onAction={item => { onAction?.(item); if (closeOnSelect) change(false, true); }}/>
    </Popup>}
  </>;
}
