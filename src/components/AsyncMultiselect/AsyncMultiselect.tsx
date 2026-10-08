import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Chips } from '../Chips/Chips';
import { Highlight } from '../Highlight/Highlight';
import { Input } from '../Input/Input';
import { Menu, menuOptionId, type MenuItem } from '../Menu/Menu';
import { Popup } from '../Menu/Popup';
import {
  FieldClearButton,
  FieldHelper,
  FieldIcon,
  FieldLabel,
  hasRenderableContent,
  joinClassNames,
} from '../TextField/TextField';
import type { MultiselectOption, MultiselectProps } from '../Multiselect/Multiselect';
import { resolveAsyncIdleText, type AsyncIdleText } from '../Autocomplete/asyncSearch';
import './AsyncMultiselect.css';

export type AsyncMultiselectInputChangeReason = 'input' | 'clear';

export interface AsyncMultiselectProps
  extends Omit<
    MultiselectProps,
    | 'options'
    | 'display'
    | 'creatable'
    | 'selectAll'
    | 'selectAllLabel'
    | 'emptyText'
  > {
  /** Результаты текущего серверного запроса. Локально повторно не фильтруются. */
  options: MultiselectOption[];
  /** Данные уже выбранных значений, если их нет среди результатов текущего запроса. */
  selectedOptions?: MultiselectOption[];
  /** Управляемый поисковый запрос. */
  inputValue?: string;
  /** Начальный поисковый запрос. */
  defaultInputValue?: string;
  /** Изменение поискового запроса. */
  onInputValueChange?: (value: string, reason: AsyncMultiselectInputChangeReason) => void;
  /** Минимальное количество символов для запроса. 0 запускает загрузку при монтировании. */
  minCharacters?: number;
  /** Задержка перед onFetch, мс. */
  debounce?: number;
  /** Максимальное количество отображаемых результатов. */
  limit?: number;
  /** Запрос данных по текущему тексту. */
  onFetch: (value: string) => void | Promise<unknown>;
  /** Загрузка результатов в Menu. */
  loading?: boolean;
  /** Доступное описание загрузки. */
  loadingText?: string;
  /** Ошибка загрузки списка. Не равна validation error поля. */
  loadError?: ReactNode;
  /** Внешнее сообщение о текущем поисковом запросе внутри Menu. Компонент не валидирует запрос сам. */
  menuMessage?: ReactNode;
  /** Сообщение при пустом результате. */
  noOptionsText?: ReactNode;
  /** Сообщение до начала поиска: готовый текст или функция от remaining/minCharacters. Без значения используется динамическая подсказка. */
  idleText?: AsyncIdleText;
  /** Подсвечивать совпадение запроса в label результата. */
  highlightMatches?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function AsyncMultiselect({
  options,
  selectedOptions: selectedOptionsProp = [],
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  onClear,
  inputValue: controlledInputValue,
  defaultInputValue = '',
  onInputValueChange,
  minCharacters = 1,
  debounce = 500,
  limit = 10,
  onFetch,
  loading = false,
  loadingText = 'Загрузка вариантов',
  loadError,
  menuMessage,
  noOptionsText = 'Результаты не найдены',
  idleText,
  highlightMatches = true,
  selectionPosition = 'left',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'auto',
  menuMaxHeight = 304,
  size = 'medium',
  label,
  placeholder = 'Введите текст',
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
}: AsyncMultiselectProps) {
  const uid = useId();
  const id = providedId ?? uid;
  const menuId = `${id}-menu`;
  const errorId = hasRenderableContent(error) ? `${id}-error` : undefined;
  const captionId = !errorId && hasRenderableContent(caption) ? `${id}-caption` : undefined;
  const hasCounter = counter !== undefined && counter !== null && counter !== false && counter !== '';
  const counterId = hasCounter ? `${id}-counter` : undefined;
  const helperId = [inputProps['aria-describedby'], errorId, captionId, counterId].filter(Boolean).join(' ') || undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalInputValue, setInternalInputValue] = useState(defaultInputValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeValue, setActiveValue] = useState<string>();
  const suppressOpenOnFocusRef = useRef(false);
  const optionCache = useRef(new Map<string, MultiselectOption>());
  const onFetchRef = useRef(onFetch);
  onFetchRef.current = onFetch;

  for (const option of [...selectedOptionsProp, ...options]) optionCache.current.set(option.value, option);

  const rawValues = controlledValue ?? internalValue;
  const values = [...new Set(rawValues)];
  const query = controlledInputValue ?? internalInputValue;
  const threshold = Math.max(0, minCharacters);
  const eligible = query.length >= threshold;
  const resolvedIdleText = resolveAsyncIdleText(idleText, query.length, threshold);
  const visibleOptions = eligible ? (limit > 0 ? options.slice(0, limit) : options) : [];
  const enabledOptions = visibleOptions.filter(option => !option.disabled);
  const enabledIds = enabledOptions.map(option => option.value);
  const activeId = enabledIds.includes(activeValue ?? '') ? activeValue : undefined;
  const open = !disabled && !skeleton && (controlledOpen ?? internalOpen);
  const resolvedSelectedOptions = values.map(
    value => optionCache.current.get(value) ?? ({ value, label: value } as MultiselectOption),
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, [skeleton]);

  useEffect(() => {
    if (disabled || skeleton || !eligible) return;

    const timer = window.setTimeout(() => {
      Promise.resolve(onFetchRef.current(query)).catch(() => undefined);
    }, Math.max(0, debounce));

    return () => window.clearTimeout(timer);
  }, [debounce, disabled, eligible, query, skeleton]);

  function setInputValue(next: string, reason: AsyncMultiselectInputChangeReason) {
    if (controlledInputValue === undefined) setInternalInputValue(next);
    onInputValueChange?.(next, reason);
  }

  function changeOpen(next: boolean) {
    if (disabled || skeleton) next = false;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setActiveValue(undefined);
  }

  function canShowMenu(nextQuery = query) {
    return nextQuery.length >= threshold
      || resolveAsyncIdleText(idleText, nextQuery.length, threshold) !== undefined
      || loading
      || loadError !== undefined
      || menuMessage !== undefined;
  }

  function showMenu(keyboard = false, fromEnd = false) {
    if (disabled || skeleton || !canShowMenu()) return;
    if (keyboard && enabledOptions.length > 0) {
      setActiveValue(fromEnd ? enabledOptions.at(-1)?.value : enabledOptions[0]?.value);
    }
    changeOpen(true);
  }

  function commit(next: string[]) {
    const unique = [...new Set(next)];
    if (controlledValue === undefined) setInternalValue(unique);
    onValueChange?.(unique);
  }

  function toggle(option: MultiselectOption) {
    if (option.disabled || disabled) return;
    optionCache.current.set(option.value, option);
    const selected = values.includes(option.value);
    commit(
      selected
        ? values.filter(value => value !== option.value)
        : [...values, option.value],
    );
    if (!selected) {
      setInputValue('', 'clear');
      setActiveValue(undefined);
      changeOpen(false);
      suppressOpenOnFocusRef.current = true;
      inputRef.current?.focus();
    }
  }

  function clear() {
    commit([]);
    setInputValue('', 'clear');
    onClear?.();
    changeOpen(false);
    suppressOpenOnFocusRef.current = true;
    inputRef.current?.focus();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setInputValue(next, 'input');
    setActiveValue(undefined);
    if (canShowMenu(next)) changeOpen(true);
    else changeOpen(false);
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
        showMenu(true, event.key === 'ArrowUp');
        return;
      }
      if (!enabledIds.length) return;
      const index = enabledIds.findIndex(value => value === activeId);
      const nextIndex = event.key === 'ArrowDown'
        ? (index + 1) % enabledIds.length
        : index <= 0
          ? enabledIds.length - 1
          : index - 1;
      setActiveValue(enabledIds[nextIndex]);
      return;
    }
    if (open && (event.key === 'Home' || event.key === 'End') && enabledIds.length) {
      event.preventDefault();
      setActiveValue(event.key === 'Home' ? enabledIds[0] : enabledIds.at(-1));
      return;
    }
    if (open && event.key === 'Enter' && activeId !== undefined) {
      event.preventDefault();
      const option = visibleOptions.find(candidate => candidate.value === activeId);
      if (option) {
        toggle(option);
        setActiveValue(undefined);
      }
      return;
    }
    if (event.key === 'Backspace' && query === '' && values.length > 0) {
      event.preventDefault();
      commit(values.slice(0, -1));
    }
  }

  const menuItems: MenuItem[] = [];
  if (menuMessage !== undefined) {
    menuItems.push({
      id: '__menu-message',
      variant: 'header',
      className: 'fdoc-async-multiselect__message',
      title: menuMessage,
    });
  } else if (loading) {
    for (let index = 0; index < 5; index += 1) {
      menuItems.push({ id: `__loading-${index}`, state: 'skeleton', title: '' });
    }
  } else if (loadError !== undefined) {
    menuItems.push({
      id: '__load-error',
      variant: 'header',
      className: 'fdoc-async-multiselect__message fdoc-async-multiselect__message--error',
      title: loadError,
    });
  } else if (!eligible) {
    if (resolvedIdleText !== undefined) {
      menuItems.push({
        id: '__idle',
        variant: 'header',
        className: 'fdoc-async-multiselect__message',
        title: resolvedIdleText,
      });
    }
  } else if (!visibleOptions.length) {
    menuItems.push({
      id: '__empty',
      variant: 'header',
      className: 'fdoc-async-multiselect__message',
      title: noOptionsText,
    });
  } else {
    menuItems.push(
      ...visibleOptions.map(option => ({
        id: option.value,
        title: highlightMatches && query
          ? <Highlight highlight={query}>{option.label}</Highlight>
          : option.label,
        textValue: option.label,
        description: option.description,
        helper: option.helper,
        leadingIcon: selectionPosition === 'right' ? option.leadingIcon : undefined,
        disabled: option.disabled,
        selection: 'checkbox' as const,
        selectionPosition,
        selected: values.includes(option.value),
      })),
    );
  }

  const showPopup = open && menuItems.length > 0;
  const isError = hasRenderableContent(error);
  const resolvedCounter = counter === true ? String(values.length) : counter;
  const accessibleStatus = menuMessage !== undefined
    ? typeof menuMessage === 'string'
      ? menuMessage
      : 'Сообщение поиска'
    : !eligible && resolvedIdleText !== undefined
      ? typeof resolvedIdleText === 'string'
        ? resolvedIdleText
        : 'Введите еще символы, чтобы начать поиск'
      : loading
        ? loadingText
      : loadError !== undefined
      ? typeof loadError === 'string'
        ? loadError
        : 'Не удалось получить список'
      : eligible && !visibleOptions.length
        ? typeof noOptionsText === 'string'
          ? noOptionsText
          : 'Результаты не найдены'
        : '';

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
        wrapperClassName={`fdoc-async-multiselect ${wrapperClassName}`}
        data-testid="async-multiselect"
      />
    );
  }

  return (
    <div
      className={joinClassNames('fdoc-multiselect fdoc-async-multiselect fdoc-field', wrapperClassName)}
      data-open={showPopup || undefined}
      data-testid="async-multiselect"
    >
      <FieldLabel
        prefix="input"
        label={label}
        inputId={id}
        required={required}
        disabled={disabled}
        isError={isError}
      />

      <div
        ref={anchorRef}
        className={joinClassNames(
          'fdoc-multiselect__field fdoc-multiselect__field--chips fdoc-field__field',
          `fdoc-multiselect__field--${size}`,
          leadingIcon !== undefined && 'fdoc-multiselect__field--has-leading',
          isError && 'fdoc-field__field--error',
          disabled && 'fdoc-field__field--disabled',
        )}
        data-testid="async-multiselect-field"
        onClick={event => {
          if (disabled || (event.target as HTMLElement).closest('button')) return;
          inputRef.current?.focus();
          if ((event.target as HTMLElement).closest('.fdoc-multiselect__chevron')) {
            if (open) changeOpen(false);
            else showMenu();
          } else if (!open) showMenu();
        }}
      >
        {leadingIcon !== undefined && (
          <FieldIcon className="fdoc-multiselect__leading" icon={leadingIcon} />
        )}

        <div className="fdoc-multiselect__content" data-display="chips">
          <div
            className="fdoc-multiselect__chips"
            role={resolvedSelectedOptions.length ? 'group' : undefined}
            aria-label={resolvedSelectedOptions.length ? 'Выбранные значения' : undefined}
          >
            {resolvedSelectedOptions.map(option => (
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
                'fdoc-multiselect__control fdoc-async-multiselect__control fdoc-field__control',
                className,
              )}
              value={query}
              disabled={disabled}
              role="combobox"
              autoComplete="off"
              placeholder={resolvedSelectedOptions.length === 0 ? placeholder : undefined}
              aria-required={required || undefined}
              aria-invalid={isError || undefined}
              aria-describedby={helperId}
              aria-haspopup="listbox"
              aria-expanded={showPopup}
              aria-controls={showPopup ? menuId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={showPopup && activeId ? menuOptionId(menuId, activeId) : undefined}
              aria-busy={loading || undefined}
              onChange={handleInputChange}
              onFocus={(event: FocusEvent<HTMLInputElement>) => {
                onFocus?.(event);
                if (suppressOpenOnFocusRef.current) {
                  suppressOpenOnFocusRef.current = false;
                  return;
                }
                if (!open) showMenu();
              }}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {clearable && (values.length > 0 || query.length > 0) && !disabled && (
          <FieldClearButton
            className="fdoc-multiselect__clear"
            aria-label="Очистить выбор и поиск"
            onMouseDown={event => event.preventDefault()}
            onClick={clear}
          />
        )}
        <FieldIcon
          className="fdoc-multiselect__chevron"
          icon={showPopup ? 'arrow-drop-up' : 'arrow-drop-down'}
        />
      </div>

      {name && values.map(value => (
        <input key={value} type="hidden" name={name} value={value} disabled={disabled} />
      ))}

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

      <span className="fdoc-async-multiselect__status" role="status" aria-live="polite">
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
            aria-label={typeof label === 'string' ? label : inputProps['aria-label'] ?? 'Варианты выбора'}
            activeId={activeId}
            onActiveChange={setActiveValue}
            focusItems={false}
            maxHeight={menuMaxHeight}
            onAction={item => {
              const option = visibleOptions.find(candidate => candidate.value === item.id);
              if (option) toggle(option);
              setActiveValue(undefined);
              inputRef.current?.focus();
            }}
          />
        </Popup>
      )}
    </div>
  );
}
