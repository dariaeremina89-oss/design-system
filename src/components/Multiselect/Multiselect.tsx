import {
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Chips } from '../Chips/Chips';
import type { IconName } from '../Icon/Icon';
import { Input, type InputProps } from '../Input/Input';
import { Menu, menuOptionId, type MenuItem } from '../Menu/Menu';
import { Popup, type PopupProps } from '../Menu/Popup';
import { FieldClearButton, FieldHelper, FieldIcon, FieldLabel, hasRenderableContent, joinClassNames } from '../TextField/TextField';
import './Multiselect.css';

export type MultiselectDisplay = 'comma' | 'count' | 'firstAndCount' | 'chips';

export interface MultiselectOption {
  value: string;
  label: string;
  description?: ReactNode;
  helper?: ReactNode;
  leadingIcon?: IconName;
  disabled?: boolean;
}

export interface MultiselectProps
  extends Omit<
    InputProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onClear'
    | 'type'
    | 'readOnly'
    | 'trailingIcon'
    | 'trailingContent'
    | 'trailingSkeleton'
    | 'fieldRef'
    | 'description'
    | 'sum'
    | 'sumIcon'
  > {
  /** Доступные варианты выбора. */
  options: MultiselectOption[];
  /** Управляемый список выбранных option.value. В creatable свои значения хранятся строкой как value. */
  value?: string[];
  /** Начальный список выбранных значений. */
  defaultValue?: string[];
  /** Вызывается после выбора, удаления Chips, создания значения или полной очистки. */
  onValueChange?: (value: string[]) => void;
  /** Вызывается после полной очистки. */
  onClear?: () => void;
  /** Представление выбранных значений. Creatable всегда использует chips. */
  display?: MultiselectDisplay;
  /** Разрешает ввод своего значения. По Enter значение превращается в Chips и не добавляется в Menu. */
  creatable?: boolean;
  /** Добавляет первой строкой Menu действие «Выбрать все». */
  selectAll?: boolean;
  /** Текст строки выбора всех доступных вариантов. */
  selectAllLabel?: ReactNode;
  /** Позиция Checkbox внутри строк Menu. Слева по умолчанию; справа оставляет левый слот под leadingIcon. */
  selectionPosition?: 'left' | 'right';
  /** Управляемое состояние Menu. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopupProps['placement'];
  menuMaxHeight?: number;
  emptyText?: string;
  ref?: Ref<HTMLInputElement>;
}

const SELECT_ALL_ID = '__select-all';

export function Multiselect({
  options,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  onClear,
  display = 'comma',
  creatable = false,
  selectAll = false,
  selectAllLabel = 'Выбрать все',
  selectionPosition = 'left',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'auto',
  menuMaxHeight = 304,
  emptyText = 'Ничего не найдено',
  size = 'medium',
  label,
  placeholder,
  error,
  required = false,
  caption,
  counter,
  leadingIcon,
  clearable = true,
  disabled = false,
  skeleton = false,
  id: providedId,
  name,
  className = '',
  wrapperClassName = '',
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...inputProps
}: MultiselectProps) {
  const uid = useId();
  const id = providedId ?? uid;
  const menuId = `${id}-menu`;
  const errorId = hasRenderableContent(error) ? `${id}-error` : undefined;
  const captionId = !errorId && hasRenderableContent(caption) ? `${id}-caption` : undefined;
  const hasCounter = counter !== undefined && counter !== null && counter !== false && counter !== '';
  const counterId = hasCounter ? `${id}-counter` : undefined;
  const helperId = [inputProps['aria-describedby'], errorId, captionId, counterId].filter(Boolean).join(' ') || undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeValue, setActiveValue] = useState<string>();
  const [query, setQuery] = useState('');
  const suppressOpenOnFocusRef = useRef(false);

  const optionValues = new Set(options.map(option => option.value));
  const rawValues = controlledValue ?? internalValue;
  const values = [...new Set(rawValues)].filter(value => creatable || optionValues.has(value));
  const selectedOptions = values.map(value => options.find(option => option.value === value) ?? ({ value, label: value } as MultiselectOption));
  const enabledOptions = options.filter(option => !option.disabled);
  const enabledOptionValues = enabledOptions.map(option => option.value);
  const allSelected = enabledOptionValues.length > 0 && enabledOptionValues.every(value => values.includes(value));
  const someSelected = enabledOptionValues.some(value => values.includes(value)) && !allSelected;
  const keyboardIds = [
    ...(selectAll && enabledOptionValues.length ? [SELECT_ALL_ID] : []),
    ...enabledOptionValues,
  ];
  const activeId = keyboardIds.includes(activeValue ?? '') ? activeValue : undefined;
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);
  const resolvedDisplay: MultiselectDisplay = creatable ? 'chips' : display;

  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, [skeleton]);

  function changeOpen(next: boolean) {
    if (disabled || skeleton) next = false;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setActiveValue(undefined);
      if (creatable) setQuery('');
    }
  }

  function commit(next: string[]) {
    const unique = [...new Set(next)].filter(value => creatable || optionValues.has(value));
    if (controlledValue === undefined) setInternalValue(unique);
    onValueChange?.(unique);
  }

  function toggle(value: string) {
    const option = options.find(candidate => candidate.value === value);
    if (!option || option.disabled || disabled) return;
    commit(values.includes(value) ? values.filter(item => item !== value) : [...values, value]);
  }

  function toggleAll() {
    if (!enabledOptionValues.length || disabled) return;
    if (allSelected) commit(values.filter(value => !enabledOptionValues.includes(value)));
    else commit([...values, ...enabledOptionValues]);
  }

  function clear() {
    commit([]);
    setQuery('');
    onClear?.();
    changeOpen(false);
    suppressOpenOnFocusRef.current = true;
    inputRef.current?.focus();
  }

  function createValue() {
    const text = query.trim();
    if (!creatable || !text) return false;
    const existingOption = options.find(option =>
      option.value.toLocaleLowerCase() === text.toLocaleLowerCase()
      || option.label.toLocaleLowerCase() === text.toLocaleLowerCase(),
    );
    if (existingOption) {
      if (!existingOption.disabled && !values.includes(existingOption.value)) commit([...values, existingOption.value]);
      setQuery('');
      setActiveValue(undefined);
      return true;
    }
    const existingValue = values.find(value => value.toLocaleLowerCase() === text.toLocaleLowerCase());
    if (!existingValue) commit([...values, text]);
    setQuery('');
    setActiveValue(undefined);
    return true;
  }

  function openWithKeyboard(fromEnd = false) {
    if (disabled || skeleton || !keyboardIds.length) return;
    setActiveValue(fromEnd ? keyboardIds.at(-1) : keyboardIds[0]);
    changeOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
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
        openWithKeyboard(event.key === 'ArrowUp');
        return;
      }
      if (!keyboardIds.length) return;
      const index = keyboardIds.findIndex(value => value === activeId);
      const nextIndex = event.key === 'ArrowDown'
        ? (index + 1) % keyboardIds.length
        : index <= 0
          ? keyboardIds.length - 1
          : index - 1;
      setActiveValue(keyboardIds[nextIndex]);
      return;
    }
    if (!creatable && open && (event.key === 'Home' || event.key === 'End') && keyboardIds.length) {
      event.preventDefault();
      setActiveValue(event.key === 'Home' ? keyboardIds[0] : keyboardIds.at(-1));
      return;
    }
    if (open && (event.key === 'Enter' || (!creatable && event.key === ' ')) && activeId !== undefined) {
      event.preventDefault();
      if (activeId === SELECT_ALL_ID) toggleAll();
      else toggle(activeId);
      return;
    }
    if (event.key === 'Enter' && creatable && query.trim()) {
      event.preventDefault();
      createValue();
      if (!open) changeOpen(true);
      return;
    }
    if (event.key === 'Backspace' && values.length > 0 && (!creatable || query === '')) {
      if (!creatable && open) return;
      event.preventDefault();
      commit(values.slice(0, -1));
    }
  }

  function handleCreatableChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveValue(undefined);
    if (!open) changeOpen(true);
  }

  const menuItems: MenuItem[] = [
    ...(selectAll && enabledOptionValues.length ? [{
      id: SELECT_ALL_ID,
      title: selectAllLabel,
      textValue: typeof selectAllLabel === 'string' ? selectAllLabel : 'Выбрать все',
      selection: 'checkbox' as const,
      selectionPosition,
      selected: allSelected,
      selectionIndeterminate: someSelected,
    }] : []),
    ...options.map(option => ({
      id: option.value,
      title: option.label,
      textValue: option.label,
      description: option.description,
      helper: option.helper,
      leadingIcon: option.leadingIcon,
      disabled: option.disabled,
      selection: 'checkbox' as const,
      selectionPosition,
      selected: values.includes(option.value),
    })),
  ];

  const resolvedCounter = counter === true ? String(values.length) : counter;
  const isError = hasRenderableContent(error);
  const accessibleValue = selectedOptions.map(option => option.label).join(', ');
  const displayText = resolvedDisplay === 'count'
    ? `Выбрано ${values.length}`
    : resolvedDisplay === 'firstAndCount'
      ? selectedOptions.length > 1
        ? `${selectedOptions[0]?.label ?? ''} +${selectedOptions.length - 1}`
        : selectedOptions[0]?.label ?? ''
      : accessibleValue;

  if (skeleton) {
    return (
      <Input
        skeleton
        size={size}
        label={label}
        required={required}
        error={error}
        caption={caption}
        counter={counter}
        leadingIcon={leadingIcon}
        clearable={clearable}
        value={values.length ? 'selected' : ''}
        wrapperClassName={`fdoc-multiselect ${wrapperClassName}`}
        data-testid="multiselect"
      />
    );
  }

  return (
    <div
      className={joinClassNames('fdoc-multiselect fdoc-field', wrapperClassName)}
      data-open={open || undefined}
      data-display={resolvedDisplay}
      data-creatable={creatable || undefined}
      data-testid="multiselect"
    >
      <FieldLabel prefix="input" label={label} inputId={id} required={required} disabled={disabled} isError={isError} />

      <div
        ref={anchorRef}
        className={joinClassNames(
          'fdoc-multiselect__field fdoc-field__field',
          `fdoc-multiselect__field--${size}`,
          resolvedDisplay === 'chips' && 'fdoc-multiselect__field--chips',
          leadingIcon !== undefined && 'fdoc-multiselect__field--has-leading',
          isError && 'fdoc-field__field--error',
          disabled && 'fdoc-field__field--disabled',
        )}
        data-testid="multiselect-field"
        onClick={event => {
          if (disabled || (event.target as HTMLElement).closest('button')) return;
          const target = event.target as HTMLElement;
          inputRef.current?.focus();
          if (target.closest('.fdoc-multiselect__chevron')) changeOpen(!open);
          else if (creatable) {
            if (!open) changeOpen(true);
          } else changeOpen(!open);
        }}
      >
        {leadingIcon !== undefined && (
          <FieldIcon className="fdoc-multiselect__leading" icon={leadingIcon} />
        )}

        <div className="fdoc-multiselect__content" data-display={resolvedDisplay}>
          {resolvedDisplay === 'chips' ? (
            <div className="fdoc-multiselect__chips" role={selectedOptions.length ? 'group' : undefined} aria-label={selectedOptions.length ? 'Выбранные значения' : undefined}>
              {selectedOptions.map(option => (
                <Chips
                  key={option.value}
                  text={option.label}
                  color="secondary"
                  size="medium"
                  disabled={disabled}
                  onRemove={disabled ? undefined : () => {
                    commit(values.filter(value => value !== option.value));
                    suppressOpenOnFocusRef.current = true;
                    inputRef.current?.focus();
                  }}
                  removeLabel={`Удалить: ${option.label}`}
                />
              ))}
              <input
                {...inputProps}
                id={id}
                ref={inputRef}
                className={joinClassNames(
                  'fdoc-multiselect__control fdoc-field__control',
                  creatable && 'fdoc-multiselect__control--creatable',
                  className,
                )}
                value={creatable ? query : accessibleValue}
                readOnly={!creatable}
                disabled={disabled}
                required={required && values.length === 0}
                role="combobox"
                autoComplete="off"
                placeholder={creatable && selectedOptions.length === 0 ? placeholder : undefined}
                aria-required={required || undefined}
                aria-invalid={isError || undefined}
                aria-describedby={helperId}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                aria-autocomplete={creatable ? 'list' : 'none'}
                aria-activedescendant={open && activeId ? menuOptionId(menuId, activeId) : undefined}
                onChange={creatable ? handleCreatableChange : undefined}
                onFocus={(event: FocusEvent<HTMLInputElement>) => {
                  onFocus?.(event);
                  if (suppressOpenOnFocusRef.current) {
                    suppressOpenOnFocusRef.current = false;
                    return;
                  }
                  if (creatable && !open) changeOpen(true);
                }}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
              />
              {!creatable && selectedOptions.length === 0 && hasRenderableContent(placeholder) && (
                <span className="fdoc-multiselect__placeholder">{placeholder}</span>
              )}
            </div>
          ) : (
            <>
              <input
                {...inputProps}
                id={id}
                ref={inputRef}
                className={joinClassNames('fdoc-multiselect__control fdoc-field__control', className)}
                value={accessibleValue}
                readOnly
                disabled={disabled}
                required={required}
                role="combobox"
                autoComplete="off"
                aria-required={required || undefined}
                aria-invalid={isError || undefined}
                aria-describedby={helperId}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                aria-autocomplete="none"
                aria-activedescendant={open && activeId ? menuOptionId(menuId, activeId) : undefined}
                onFocus={(event: FocusEvent<HTMLInputElement>) => onFocus?.(event)}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
              />
              {selectedOptions.length > 0
                ? <span className="fdoc-multiselect__value" aria-hidden="true">{displayText}</span>
                : hasRenderableContent(placeholder) && <span className="fdoc-multiselect__placeholder">{placeholder}</span>}
            </>
          )}
        </div>

        {clearable && values.length > 0 && !disabled && (
          <FieldClearButton
            className="fdoc-multiselect__clear"
            aria-label="Очистить выбор"
            onMouseDown={event => event.preventDefault()}
            onClick={clear}
          />
        )}
        <FieldIcon className="fdoc-multiselect__chevron" icon={open ? 'arrow-drop-up' : 'arrow-drop-down'} />
      </div>

      {name && values.map(value => <input key={value} type="hidden" name={name} value={value} disabled={disabled} />)}

      <FieldHelper
        prefix="input"
        error={error}
        caption={caption}
        hasCounter={hasCounter}
        resolvedCounter={resolvedCounter}
        errorId={errorId}
        captionId={captionId}
        counterId={counterId}
        isError={isError}
        disabled={disabled}
      />

      {open && (
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
            aria-label={typeof label === 'string' ? label : inputProps['aria-label'] ?? 'Варианты выбора'}
            activeId={activeId}
            onActiveChange={setActiveValue}
            focusItems={false}
            maxHeight={menuMaxHeight}
            emptyText={emptyText}
            onAction={item => {
              if (item.id === SELECT_ALL_ID) toggleAll();
              else toggle(item.id);
              if (creatable) setQuery('');
              setActiveValue(undefined);
              inputRef.current?.focus();
            }}
          />
        </Popup>
      )}
    </div>
  );
}
