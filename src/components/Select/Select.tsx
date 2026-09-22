import { useEffect, useId, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { Icon, type IconName } from '../Icon/Icon';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Menu, menuOptionId, type MenuItem } from '../Menu/Menu';
import { Popup, type PopupProps } from '../Menu/Popup';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  helper?: string;
  leadingIcon?: IconName;
  disabled?: boolean;
}
export interface SelectProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'onClear' | 'type' | 'readOnly' | 'trailingIcon' | 'trailingContent' | 'trailingSkeleton' | 'fieldRef'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  searchable?: boolean;
  creatable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopupProps['placement'];
  emptyText?: string;
  menuMaxHeight?: number;
  ref?: Ref<HTMLInputElement>;
}

export function Select({ options, value: controlled, defaultValue = '', onValueChange, onClear,
  searchable = false, creatable = false, clearable = false, disabled = false, skeleton = false,
  open: controlledOpen, defaultOpen = false, onOpenChange, placement = 'auto', emptyText = 'Ничего не найдено', menuMaxHeight = 304,
  id: providedId, wrapperClassName = '', onKeyDown, onFocus, onBlur, onClick, ref, name, ...props }: SelectProps) {
  const uid = useId(); const id = providedId ?? uid; const menuId = `${id}-menu`;
  const input = useRef<HTMLInputElement>(null); const anchor = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => input.current!, [skeleton]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [query, setQuery] = useState<string | null>(null); const [active, setActive] = useState<string>();
  const value = controlled ?? internalValue;
  const selected = options.find(option => option.value === value);
  const label = selected?.label ?? value;
  const editable = searchable || creatable;
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);
  const filtered = options.filter(option => query === null || option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const enabled = filtered.filter(option => !option.disabled);
  const activeId = enabled.some(option => option.value === active) ? active : undefined;
  const typeahead = useRef({ text: '', time: 0 });
  function changeOpen(next: boolean) {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) { setQuery(null); setActive(undefined); }
  }
  function show(last = false) {
    if (disabled || skeleton) return;
    setActive(last ? enabled.at(-1)?.value : enabled.find(option => option.value === value)?.value ?? enabled[0]?.value);
    changeOpen(true);
  }
  function choose(next: string) {
    if (controlled === undefined) setInternalValue(next);
    onValueChange?.(next); changeOpen(false); input.current?.focus();
  }
  useEffect(() => { if (!open) { setQuery(null); setActive(undefined); } }, [open]);
  const items: MenuItem[] = filtered.map(option => ({ id: option.value, title: option.label, description: option.description,
    helper: option.helper, leadingIcon: option.leadingIcon, disabled: option.disabled, selection: 'check' }));
  function key(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || skeleton || event.nativeEvent.isComposing) return;
    if (event.key === 'Tab') { if (open) changeOpen(false); return; }
    if (event.key === 'Escape') { if (open) { event.preventDefault(); event.stopPropagation(); changeOpen(false); } return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) { show(event.key === 'ArrowUp'); return; }
      const index = enabled.findIndex(option => option.value === activeId);
      const next = event.key === 'ArrowDown' ? (index + 1) % enabled.length : index <= 0 ? enabled.length - 1 : index - 1;
      setActive(enabled[next]?.value); return;
    }
    if (open && (!editable || event.ctrlKey) && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault(); setActive(event.key === 'Home' ? enabled[0]?.value : enabled.at(-1)?.value); return;
    }
    if (event.key === 'Enter' || (!editable && event.key === ' ')) {
      event.preventDefault();
      if (!open) show();
      else if (activeId !== undefined) choose(activeId);
      else if (creatable && query?.trim()) choose(query.trim());
      return;
    }
    if (!editable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); const now = Date.now();
      typeahead.current.text = (now - typeahead.current.time < 600 ? typeahead.current.text : '') + event.key.toLocaleLowerCase(); typeahead.current.time = now;
      const match = options.find(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeahead.current.text));
      if (match) { setActive(match.value); if (!open) changeOpen(true); }
    }
  }
  return <div className="fdoc-select" onClick={event => {
    if (disabled || skeleton || (event.target as HTMLElement).closest('button')) return;
    if (anchor.current?.contains(event.target as Node)) { input.current?.focus(); if (!open) show(); else if (!editable) changeOpen(false); }
  }}>
    {name && !skeleton && <input type="hidden" name={name} value={value} disabled={disabled}/>}
    <Input {...props} id={id} ref={input} fieldRef={anchor} value={open && query !== null ? query : label}
      wrapperClassName={`fdoc-select__field ${wrapperClassName}`} disabled={disabled} skeleton={skeleton}
      type="text" role="combobox" readOnly={!editable} autoComplete="off" clearable={false}
      aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined}
      aria-autocomplete={editable ? 'list' : 'none'} aria-activedescendant={open && activeId !== undefined ? menuOptionId(menuId, activeId) : undefined}
      onFocus={onFocus} onBlur={onBlur} onClick={onClick} onKeyDown={key}
      onChange={event => { setQuery(event.target.value); setActive(creatable ? undefined : options.find(option => !option.disabled && option.label.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()))?.value); if (!open) changeOpen(true); }}
      trailingIcon={skeleton ? 'arrow-drop-down' : undefined}
      trailingContent={<>
        {clearable && value !== '' && !disabled && <ButtonIcon className="fdoc-select__clear" size="xsmall" iconSize={16} color="neutral" icon="filled/cross_circle_filled" aria-label="Очистить выбор"
          onMouseDown={event => event.preventDefault()} onClick={() => { choose(''); onClear?.(); }}/>} 
        <span className="fdoc-select__chevron" aria-hidden="true"><Icon name={open ? 'arrow-drop-up' : 'arrow-drop-down'} size={24}/></span>
      </>}/>
    {open && <Popup anchor={anchor} placement={placement} matchWidth maxHeight={menuMaxHeight}
      onDismiss={reason => { changeOpen(false); if (reason === 'escape') input.current?.focus(); }}>
      <Menu id={menuId} items={items} role="listbox" aria-label={typeof props.label === 'string' ? props.label : props['aria-label'] ?? 'Варианты выбора'}
        selectedId={value} activeId={activeId} onActiveChange={setActive} focusItems={false} maxHeight={menuMaxHeight} emptyText={creatable && query?.trim() ? 'Нажмите Enter, чтобы сохранить значение' : emptyText}
        onAction={item => choose(item.id)}/>
    </Popup>}
  </div>;
}
