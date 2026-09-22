import { useRef, useState, type Ref, useImperativeHandle } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { Button } from '../Button/Button';
import './Search.css';

export interface SearchProps extends Omit<InputProps, 'size' | 'trailingIcon' | 'trailingContent' | 'trailingSkeleton' | 'onSearch'> {
  onSearch?: (query: string) => void;
  buttonText?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Явный поиск по Enter или кнопке; ввод и очистка сами по себе поиск не запускают. */
export function Search({ value, defaultValue = '', onChange, onClear, onSearch, onKeyDown, buttonText = 'Найти',
  leadingIcon = 'magnifying-glass', placeholder = 'Поиск', clearable = true, disabled, skeleton,
  wrapperClassName = '', ref, ...props }: SearchProps) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, [skeleton]);
  const [internal, setInternal] = useState(String(defaultValue));
  const current = value === undefined ? internal : String(value);
  const search = () => { if (!disabled && !skeleton) onSearch?.(current); };
  return <Input {...props} ref={input} type="search" size="small" value={current} disabled={disabled} skeleton={skeleton}
    wrapperClassName={`fdoc-search ${wrapperClassName}`} leadingIcon={leadingIcon} placeholder={placeholder} clearable={clearable}
    onChange={event => { if (value === undefined) setInternal(event.target.value); onChange?.(event); }}
    onClear={() => { if (value === undefined) setInternal(''); onClear?.(); input.current?.focus(); }}
    onKeyDown={event => { onKeyDown?.(event); if (!event.defaultPrevented && !event.nativeEvent.isComposing && event.key === 'Enter') { event.preventDefault(); search(); } }}
    trailingContent={<Button className="fdoc-search__submit" size="small" disabled={disabled} onClick={search}>{buttonText}</Button>}
    trailingSkeleton={<Button className="fdoc-search__submit" size="small" state="skeleton" skeletonWidth={76}>{buttonText}</Button>}
  />;
}
