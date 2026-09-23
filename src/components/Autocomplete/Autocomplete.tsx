import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Input, type InputProps } from '../Input/Input';
import { Icon, type IconName } from '../Icon/Icon';
import { Highlight } from '../Highlight/Highlight';
import { Menu, menuOptionId, type MenuItem } from '../Menu/Menu';
import { Popup, type PopupProps } from '../Menu/Popup';
import './Autocomplete.css';

export interface AutocompleteItem {
  value: string;
  label: string;
  description?: ReactNode;
  helper?: ReactNode;
  leadingIcon?: IconName;
  disabled?: boolean;
}

export type AutocompleteMode = 'auto' | 'input' | 'select';
export type AutocompleteInputChangeReason = 'input' | 'select' | 'clear';

export interface AutocompleteProps
  extends Omit<
    InputProps,
    | 'value'
    | 'defaultValue'
    | 'onClear'
    | 'trailingIcon'
    | 'trailingContent'
    | 'trailingSkeleton'
    | 'fieldRef'
    | 'type'
    | 'readOnly'
  > {
  /** Варианты для выбора. */
  data: AutocompleteItem[];
  /** Выбранное значение item.value. */
  value?: string;
  /** Начальное выбранное значение для uncontrolled-режима. */
  defaultValue?: string;
  /** Вызывается при выборе или сбросе выбранного значения. */
  onValueChange?: (value: string, item?: AutocompleteItem) => void;
  /** Вызывается после выбора элемента. */
  onItemSelect?: (item: AutocompleteItem) => void;
  /** Управляемый текст поискового запроса. */
  inputValue?: string;
  /** Начальный текст поискового запроса. */
  defaultInputValue?: string;
  /** Изменение текста и причина изменения. */
  onInputValueChange?: (value: string, reason: AutocompleteInputChangeReason) => void;
  /** Минимальное количество символов до показа результатов. */
  minCharacters?: number;
  /** Подсвечивать совпадение запроса в вариантах. */
  highlightMatches?: boolean;
  /** Показывать иконку выбранного элемента в Menu. */
  showSelectedIcon?: boolean;
  /** Визуальный режим поля. Auto показывает Select-режим, когда есть полученный список. */
  mode?: AutocompleteMode;
  /** Отключает локальную фильтрацию. Используется AsyncAutocomplete для серверного поиска. */
  filterData?: boolean;
  /** Управляемое состояние Menu. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopupProps['placement'];
  menuMaxHeight?: number;
  noOptionsText?: ReactNode;
  /** Сообщение до достижения minCharacters. Если не передано, Menu закрыт. */
  idleText?: ReactNode;
  /** Скелетон результатов. */
  loading?: boolean;
  loadingText?: string;
  /** Ошибка получения списка. Не равна validation error поля Input. */
  loadError?: ReactNode;
  dropdownHeader?: ReactNode;
  dropdownFooter?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

function includes(text: string, query: string) {
  return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

export function Autocomplete({
  data,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  onItemSelect,
  inputValue: controlledInputValue,
  defaultInputValue,
  onInputValueChange,
  minCharacters = 0,
  highlightMatches = true,
  showSelectedIcon = false,
  mode = 'auto',
  filterData = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'auto',
  menuMaxHeight = 304,
  noOptionsText = 'Результаты не найдены',
  idleText,
  loading = false,
  loadingText = 'Загрузка вариантов',
  loadError,
  dropdownHeader,
  dropdownFooter,
  clearable = false,
  disabled = false,
  skeleton = false,
  id: providedId,
  wrapperClassName = '',
  name,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  ref,
  ...inputProps
}: AutocompleteProps) {
  const uid = useId();
  const id = providedId ?? uid;
  const menuId = `${id}-menu`;
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, [skeleton]);

  const defaultItem = data.find(item => item.value === defaultValue);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalInputValue, setInternalInputValue] = useState(
    defaultInputValue ?? defaultItem?.label ?? '',
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeValue, setActiveValue] = useState<string>();

  const selectedValue = controlledValue ?? internalValue;
  const selectedItem = data.find(item => item.value === selectedValue);
  const query = controlledInputValue ?? internalInputValue;
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);
  const threshold = Math.max(0, minCharacters);
  const eligible = query.length >= threshold;
  const visibleData = !eligible
    ? []
    : filterData && query
      ? data.filter(item => includes(item.label, query))
      : data;
  const enabledData = visibleData.filter(item => !item.disabled);
  const activeId = enabledData.some(item => item.value === activeValue) ? activeValue : undefined;
  const resolvedMode: Exclude<AutocompleteMode, 'auto'> =
    mode === 'auto' ? (data.length > 0 ? 'select' : 'input') : mode;

  const previousControlledValue = useRef(controlledValue);
  useEffect(() => {
    if (
      controlledValue !== undefined &&
      controlledValue !== previousControlledValue.current &&
      controlledInputValue === undefined
    ) {
      setInternalInputValue(data.find(item => item.value === controlledValue)?.label ?? '');
    }
    previousControlledValue.current = controlledValue;
  }, [controlledValue, controlledInputValue, data]);

  function setInputValue(next: string, reason: AutocompleteInputChangeReason) {
    if (controlledInputValue === undefined) setInternalInputValue(next);
    onInputValueChange?.(next, reason);
  }

  function setSelectedValue(next: string, item?: AutocompleteItem) {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next, item);
  }

  function changeOpen(next: boolean) {
    if (disabled || skeleton) next = false;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setActiveValue(undefined);
  }

  function canShowMenu() {
    return eligible || idleText !== undefined || loading || loadError !== undefined;
  }

  function showMenu(keyboard = false, fromEnd = false) {
    if (disabled || skeleton || !canShowMenu()) return;
    if (keyboard && enabledData.length > 0) {
      setActiveValue(fromEnd ? enabledData.at(-1)?.value : enabledData[0]?.value);
    }
    changeOpen(true);
  }

  function choose(item: AutocompleteItem) {
    if (item.disabled) return;
    setSelectedValue(item.value, item);
    setInputValue(item.label, 'select');
    onItemSelect?.(item);
    changeOpen(false);
    inputRef.current?.focus();
  }

  function clear() {
    setSelectedValue('');
    setInputValue('', 'clear');
    changeOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    if (selectedValue) setSelectedValue('');
    setInputValue(next, 'input');
    setActiveValue(undefined);
    if (next.length >= threshold || idleText !== undefined) showMenu();
    else changeOpen(false);
    onChange?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || skeleton || event.nativeEvent.isComposing) return;

    if (event.key === 'Tab') {
      if (open) changeOpen(false);
      return;
    }
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        changeOpen(false);
      }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        showMenu(true, event.key === 'ArrowUp');
        return;
      }
      if (!enabledData.length) return;
      const index = enabledData.findIndex(item => item.value === activeId);
      const nextIndex =
        event.key === 'ArrowDown'
          ? (index + 1) % enabledData.length
          : index <= 0
            ? enabledData.length - 1
            : index - 1;
      setActiveValue(enabledData[nextIndex]?.value);
      return;
    }
    if (open && (event.key === 'Home' || event.key === 'End') && enabledData.length) {
      event.preventDefault();
      setActiveValue(event.key === 'Home' ? enabledData[0]?.value : enabledData.at(-1)?.value);
      return;
    }
    if (event.key === 'Enter' && open && activeId !== undefined) {
      event.preventDefault();
      const item = visibleData.find(option => option.value === activeId);
      if (item) choose(item);
    }
  }

  const menuItems: MenuItem[] = [];
  if (dropdownHeader !== undefined) {
    menuItems.push({ id: '__header', variant: 'header', title: dropdownHeader });
  }
  if (loading) {
    for (let index = 0; index < 5; index += 1) {
      menuItems.push({ id: `__loading-${index}`, state: 'skeleton', title: '' });
    }
  } else if (loadError !== undefined) {
    menuItems.push({
      id: '__load-error',
      variant: 'header',
      className: 'fdoc-autocomplete__message fdoc-autocomplete__message--error',
      title: loadError,
    });
  } else if (!eligible) {
    if (idleText !== undefined) {
      menuItems.push({
        id: '__idle',
        variant: 'header',
        className: 'fdoc-autocomplete__message',
        title: idleText,
      });
    }
  } else if (!visibleData.length) {
    menuItems.push({
      id: '__empty',
      variant: 'header',
      className: 'fdoc-autocomplete__message',
      title: noOptionsText,
    });
  } else {
    menuItems.push(
      ...visibleData.map(item => ({
        id: item.value,
        title: highlightMatches && query ? <Highlight highlight={query}>{item.label}</Highlight> : item.label,
        textValue: item.label,
        description: item.description,
        helper: item.helper,
        leadingIcon: item.leadingIcon,
        disabled: item.disabled,
        selection: showSelectedIcon ? ('check' as const) : undefined,
      })),
    );
  }

  const showPopup = open && menuItems.length > 0;
  const accessibleStatus = loading
    ? loadingText
    : loadError !== undefined
      ? typeof loadError === 'string'
        ? loadError
        : 'Не удалось получить список'
      : eligible && !visibleData.length
        ? typeof noOptionsText === 'string'
          ? noOptionsText
          : 'Результаты не найдены'
        : '';

  return (
    <div
      className="fdoc-autocomplete"
      data-mode={resolvedMode}
      data-open={showPopup || undefined}
      onClick={event => {
        if (disabled || skeleton || (event.target as HTMLElement).closest('button')) return;
        if (anchorRef.current?.contains(event.target as Node)) {
          inputRef.current?.focus();
          if (!open) showMenu();
        }
      }}
    >
      {name && !skeleton && <input type="hidden" name={name} value={selectedValue} disabled={disabled} />}
      <Input
        {...inputProps}
        id={id}
        ref={inputRef}
        fieldRef={anchorRef}
        wrapperClassName={`fdoc-autocomplete__field ${wrapperClassName}`}
        value={query}
        disabled={disabled}
        skeleton={skeleton}
        clearable={clearable}
        onClear={clear}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-haspopup="listbox"
        aria-expanded={showPopup}
        aria-controls={showPopup ? menuId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={showPopup && activeId ? menuOptionId(menuId, activeId) : undefined}
        onChange={handleChange}
        onFocus={event => {
          onFocus?.(event);
          if (canShowMenu()) showMenu();
        }}
        onBlur={onBlur}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        trailingContent={
          resolvedMode === 'select' ? (
            <span className="fdoc-autocomplete__chevron" aria-hidden="true">
              <Icon name={showPopup ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} />
            </span>
          ) : undefined
        }
      />

      <span className="fdoc-autocomplete__status" role="status" aria-live="polite">
        {accessibleStatus}
      </span>

      {showPopup && (
        <Popup
          anchor={anchorRef}
          placement={placement}
          matchWidth
          maxHeight={menuMaxHeight}
          onDismiss={reason => {
            changeOpen(false);
            if (reason === 'escape') inputRef.current?.focus();
          }}
        >
          <Menu
            id={menuId}
            items={menuItems}
            role="listbox"
            aria-label={typeof inputProps.label === 'string' ? inputProps.label : inputProps['aria-label'] ?? 'Варианты выбора'}
            selectedId={selectedValue}
            activeId={activeId}
            onActiveChange={setActiveValue}
            focusItems={false}
            maxHeight={menuMaxHeight}
            footer={dropdownFooter}
            onAction={item => {
              const option = visibleData.find(candidate => candidate.value === item.id);
              if (option) choose(option);
            }}
          />
        </Popup>
      )}
    </div>
  );
}
