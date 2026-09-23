import {
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Chips } from '../Chips/Chips';
import { Icon, type IconName } from '../Icon/Icon';
import { Input, type InputProps } from '../Input/Input';
import { Menu, menuOptionId, type MenuItem } from '../Menu/Menu';
import { Popup, type PopupProps } from '../Menu/Popup';
import { FieldHelper, FieldLabel, hasRenderableContent, joinClassNames } from '../TextField/TextField';
import './Multiselect.css';

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
  /** Управляемый список выбранных option.value. */
  value?: string[];
  /** Начальный список выбранных значений. */
  defaultValue?: string[];
  /** Вызывается после выбора, удаления Chips или полной очистки. */
  onValueChange?: (value: string[]) => void;
  /** Вызывается после полной очистки. */
  onClear?: () => void;
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

export function Multiselect({
  options,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  onClear,
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
  const values = (controlledValue ?? internalValue).filter(value => options.some(option => option.value === value));
  const selectedOptions = values.flatMap(value => {
    const option = options.find(candidate => candidate.value === value);
    return option ? [option] : [];
  });
  const enabledOptions = options.filter(option => !option.disabled);
  const activeId = enabledOptions.some(option => option.value === activeValue) ? activeValue : undefined;
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);

  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, [skeleton]);

  function changeOpen(next: boolean) {
    if (disabled || skeleton) next = false;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setActiveValue(undefined);
  }

  function commit(next: string[]) {
    const unique = [...new Set(next)].filter(value => options.some(option => option.value === value));
    if (controlledValue === undefined) setInternalValue(unique);
    onValueChange?.(unique);
  }

  function toggle(value: string) {
    const option = options.find(candidate => candidate.value === value);
    if (!option || option.disabled || disabled) return;
    commit(values.includes(value) ? values.filter(item => item !== value) : [...values, value]);
  }

  function clear() {
    commit([]);
    onClear?.();
    changeOpen(false);
    inputRef.current?.focus();
  }

  function openWithKeyboard(fromEnd = false) {
    if (disabled || skeleton) return;
    const next = fromEnd ? enabledOptions.at(-1)?.value : enabledOptions[0]?.value;
    setActiveValue(next);
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
      if (!enabledOptions.length) return;
      const index = enabledOptions.findIndex(option => option.value === activeId);
      const nextIndex = event.key === 'ArrowDown'
        ? (index + 1) % enabledOptions.length
        : index <= 0
          ? enabledOptions.length - 1
          : index - 1;
      setActiveValue(enabledOptions[nextIndex]?.value);
      return;
    }
    if (open && (event.key === 'Home' || event.key === 'End') && enabledOptions.length) {
      event.preventDefault();
      setActiveValue(event.key === 'Home' ? enabledOptions[0]?.value : enabledOptions.at(-1)?.value);
      return;
    }
    if (open && (event.key === 'Enter' || event.key === ' ') && activeId !== undefined) {
      event.preventDefault();
      toggle(activeId);
      return;
    }
    if (!open && event.key === 'Backspace' && values.length > 0) {
      event.preventDefault();
      commit(values.slice(0, -1));
    }
  }

  const menuItems: MenuItem[] = options.map(option => ({
    id: option.value,
    title: option.label,
    textValue: option.label,
    description: option.description,
    helper: option.helper,
    leadingIcon: option.leadingIcon,
    disabled: option.disabled,
    selection: 'checkbox',
    selectionPosition,
    selected: values.includes(option.value),
  }));

  const resolvedCounter = counter === true ? String(values.length) : counter;
  const isError = hasRenderableContent(error);
  const accessibleValue = selectedOptions.map(option => option.label).join(', ');

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
    <div className={joinClassNames('fdoc-multiselect fdoc-field', wrapperClassName)} data-open={open || undefined} data-testid="multiselect">
      <FieldLabel prefix="input" label={label} inputId={id} required={required} disabled={disabled} isError={isError} />

      <div
        ref={anchorRef}
        className={joinClassNames(
          'fdoc-multiselect__field fdoc-field__field',
          `fdoc-multiselect__field--${size}`,
          leadingIcon !== undefined && 'fdoc-multiselect__field--has-leading',
          isError && 'fdoc-field__field--error',
          disabled && 'fdoc-field__field--disabled',
        )}
        data-testid="multiselect-field"
        onClick={event => {
          if (disabled || (event.target as HTMLElement).closest('button')) return;
          inputRef.current?.focus();
          changeOpen(!open);
        }}
      >
        {leadingIcon !== undefined && (
          <span className="fdoc-multiselect__leading" aria-hidden="true"><Icon name={leadingIcon} size={24} /></span>
        )}

        <div className="fdoc-multiselect__content">
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
            aria-activedescendant={open && activeId ? menuOptionId(menuId, activeId) : undefined}
            onFocus={(event: FocusEvent<HTMLInputElement>) => onFocus?.(event)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
          />

          {selectedOptions.length > 0 ? (
            <div className="fdoc-multiselect__chips" role="group" aria-label="Выбранные значения">
              {selectedOptions.map(option => (
                <Chips
                  key={option.value}
                  text={option.label}
                  color="secondary"
                  size="medium"
                  disabled={disabled}
                  onRemove={disabled ? undefined : () => {
                    commit(values.filter(value => value !== option.value));
                    inputRef.current?.focus();
                  }}
                  removeLabel={`Удалить: ${option.label}`}
                />
              ))}
            </div>
          ) : (
            hasRenderableContent(placeholder) && <span className="fdoc-multiselect__placeholder">{placeholder}</span>
          )}
        </div>

        {clearable && values.length > 0 && !disabled && (
          <ButtonIcon
            className="fdoc-multiselect__clear"
            size="xsmall"
            iconSize={24}
            color="neutral"
            icon="filled/cross_circle_filled"
            aria-label="Очистить выбор"
            onMouseDown={event => event.preventDefault()}
            onClick={clear}
          />
        )}
        <span className="fdoc-multiselect__chevron" aria-hidden="true">
          <Icon name={open ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} />
        </span>
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
              toggle(item.id);
              setActiveValue(undefined);
              inputRef.current?.focus();
            }}
          />
        </Popup>
      )}
    </div>
  );
}
