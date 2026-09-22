import { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ItemRow, type ItemRowProps } from '../ItemRow/ItemRow';
import { Divider } from '../Divider/Divider';
import { Button, type ButtonProps } from '../Button/Button';
import './Menu.css';

export interface MenuItem extends Omit<ItemRowProps, 'id' | 'role' | 'onClick' | 'onKeyDown' | 'ref' | 'tabIndex'> {
  id: string;
  /** Строка для поиска, если title содержит разметку. */
  textValue?: string;
  onAction?: () => void;
}
export interface MenuProps {
  items: MenuItem[];
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  role?: 'menu' | 'listbox';
  selectedId?: string;
  activeId?: string;
  onActiveChange?: (id: string) => void;
  onAction?: (item: MenuItem) => void;
  searchable?: boolean;
  searchLabel?: string;
  footer?: ReactNode;
  maxHeight?: CSSProperties['maxHeight'];
  className?: string;
  autoFocus?: boolean | 'last';
  /** Select сохраняет фокус на combobox и управляет активной строкой. */
  focusItems?: boolean;
  emptyText?: string;
  skeleton?: boolean;
  onTab?: (event: React.KeyboardEvent) => void;
}
export const isMenuItemEnabled = (item: MenuItem) => !item.disabled && item.state !== 'disabled' && item.state !== 'skeleton' && (!item.variant || item.variant === 'item' || item.variant === 'link');
export const menuOptionId = (menuId: string, itemId: string) => `${menuId}-option-${encodeURIComponent(itemId)}`;

export function Menu({ items, id: providedId, role = 'menu', selectedId, activeId: controlledActive, onActiveChange,
  onAction, searchable = false, searchLabel = 'Поиск по меню', footer, maxHeight = 304, className = '',
  autoFocus = false, focusItems = true, emptyText = 'Ничего не найдено', skeleton = false, onTab, ...aria }: MenuProps) {
  const uid = useId(); const id = providedId ?? uid;
  const root = useRef<HTMLDivElement>(null); const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(''); const [internalActive, setInternalActive] = useState<string>();
  const active = controlledActive ?? internalActive;
  const visible = items.filter(item => !query || String(item.textValue ?? item.title ?? '').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const enabled = visible.filter(isMenuItemEnabled);
  const initial = enabled.find(item => item.id === selectedId)?.id ?? enabled[0]?.id;
  const tabStop = enabled.some(item => item.id === active) ? active : initial;
  function activate(id: string, focus = false) {
    if (controlledActive === undefined) setInternalActive(id);
    onActiveChange?.(id);
    const element = document.getElementById(menuOptionId(providedId ?? uid, id));
    if (focus && focusItems) (element?.matches('a') ? element : element?.querySelector('a') ?? element)?.focus();
    element?.scrollIntoView?.({ block: 'nearest' });
  }
  useEffect(() => {
    if (!autoFocus || skeleton) return;
    const frame = requestAnimationFrame(() => {
      if (searchable) search.current?.focus();
      else { const item = autoFocus === 'last' ? enabled.at(-1) : enabled.find(item => item.id === selectedId) ?? enabled[0]; if (item) activate(item.id, true); }
    });
    return () => cancelAnimationFrame(frame);
    // Focus only on mount; changes to data must not steal focus from the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (controlledActive) document.getElementById(menuOptionId(id, controlledActive))?.scrollIntoView?.({ block: 'nearest' }); }, [controlledActive, id]);
  const typeahead = useRef({ text: '', time: 0 });
  function navigate(event: React.KeyboardEvent) {
    if (event.key === 'Tab' && onTab) {
      const stops = Array.from(root.current?.querySelectorAll<HTMLElement>('*') ?? []).filter(element => element.matches('button:not(:disabled),a[href],input:not(:disabled),[tabindex="0"]') && element.tabIndex >= 0 && !element.closest('[inert]'));
      const target = event.target as HTMLElement;
      if (event.shiftKey ? target === stops[0] : target === stops.at(-1)) onTab(event);
      return;
    }
    if (skeleton || !focusItems || (event.target as HTMLElement).closest('.fdoc-menu__footer')) return;
    const inSearch = event.target === search.current;
    if (inSearch && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const currentIndex = enabled.findIndex(item => item.id === active);
    let index: number | undefined;
    if (event.key === 'ArrowDown') index = (currentIndex + 1) % enabled.length;
    if (event.key === 'ArrowUp') index = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = enabled.length - 1;
    if (index !== undefined) { event.preventDefault(); if (enabled[index]) activate(enabled[index].id, true); }
    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now(); typeahead.current.text = (now - typeahead.current.time < 600 ? typeahead.current.text : '') + event.key.toLocaleLowerCase(); typeahead.current.time = now;
      const match = enabled.find(item => String(item.textValue ?? item.title).toLocaleLowerCase().startsWith(typeahead.current.text));
      if (match) { event.preventDefault(); activate(match.id, true); }
    }
  }
  return <div className={`fdoc-menu ${className}`} ref={root} style={{ maxHeight }} onKeyDown={navigate} aria-hidden={skeleton || undefined} inert={skeleton || undefined}>
    {searchable && <div className="fdoc-menu__search"><ItemRow variant="search" state={skeleton ? 'skeleton' : 'default'} searchProps={{ ref: search, 'aria-label': searchLabel, value: query, onChange: e => setQuery(e.target.value), onClear: () => setQuery(''), onSearch: () => { if (enabled[0]) activate(enabled[0].id, true); } }}/></div>}
    <div className="fdoc-menu__list" id={id} role={skeleton ? undefined : role} aria-label={aria['aria-labelledby'] ? undefined : role === 'menu' ? 'Действия' : 'Варианты выбора'} {...aria}>
      {visible.map(item => {
        const { id: itemId, onAction: itemAction, textValue: _text, ...row } = item;
        const enabledItem = isMenuItemEnabled(item);
        const select = () => { if (!enabledItem || skeleton) return; itemAction?.(); onAction?.(item); };
        const itemRole = role === 'listbox' ? 'option' : item.selection === 'checkbox' ? 'menuitemcheckbox' : 'menuitem';
        const chosen = item.selected ?? (selectedId !== undefined ? itemId === selectedId : false);
        // Links retain their native semantics and their own states inside a presentation row.
        if (item.variant === 'link') return <div key={itemId} role="none"><ItemRow {...row} id={menuOptionId(id, itemId)} linkProps={{ role: itemRole, tabIndex: focusItems && enabledItem && itemId === tabStop ? 0 : -1 }} state={skeleton ? 'skeleton' : item.state} onClick={select} onFocus={() => activate(itemId)} /></div>;
        return <ItemRow {...row} key={itemId} id={menuOptionId(id, itemId)} role={item.variant === 'header' ? 'presentation' : itemRole}
          tabIndex={focusItems && enabledItem && itemId === tabStop ? 0 : -1}
          selected={chosen} state={skeleton ? 'skeleton' : item.state ?? (!focusItems && itemId === active ? 'focused' : 'default')}
          aria-selected={role === 'listbox' && item.variant !== 'header' ? chosen : undefined}
          aria-checked={itemRole === 'menuitemcheckbox' ? chosen : undefined}
          onFocus={() => { if (enabledItem) activate(itemId); }} onClick={select}/>;
      })}
      {!visible.length && <div className="fdoc-menu__empty" role="presentation">{emptyText}</div>}
    </div>
    {footer && <div className="fdoc-menu__footer"><Divider/><div className="fdoc-menu__buttons">{skeleton ? Children.map(footer, child => isValidElement<ButtonProps>(child) && child.type === Button ? cloneElement(child, { state: 'skeleton' }) : child) : footer}</div></div>}
  </div>;
}
