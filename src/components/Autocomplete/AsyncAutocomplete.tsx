import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Autocomplete,
  type AutocompleteInputChangeReason,
  type AutocompleteProps,
} from './Autocomplete';

export interface AsyncAutocompleteProps
  extends Omit<AutocompleteProps, 'filterData' | 'minCharacters' | 'onInputValueChange'> {
  /** Минимальное количество символов для запроса. Значение 0 запускает загрузку при монтировании. */
  minCharacters?: number;
  /** Задержка перед вызовом onFetch, мс. */
  debounce?: number;
  /** Максимальное количество отображаемых вариантов. */
  limit?: number;
  /** Запрос данных по текущему тексту. */
  onFetch: (value: string) => void | Promise<unknown>;
  /** Изменение текста и причина изменения. */
  onInputValueChange?: AutocompleteProps['onInputValueChange'];
  /** Ошибка загрузки списка. */
  loadError?: ReactNode;
}

export function AsyncAutocomplete({
  data,
  inputValue: controlledInputValue,
  defaultInputValue = '',
  onInputValueChange,
  onFetch,
  minCharacters = 1,
  debounce = 500,
  limit = 10,
  loadError,
  ...props
}: AsyncAutocompleteProps) {
  const [internalInputValue, setInternalInputValue] = useState(defaultInputValue);
  const effectiveInputValue = controlledInputValue ?? internalInputValue;
  const lastReason = useRef<AutocompleteInputChangeReason>('input');
  const mounted = useRef(false);

  useEffect(() => {
    const eligible = effectiveInputValue.length >= Math.max(0, minCharacters);
    const reason = lastReason.current;
    const shouldFetch = eligible && (!mounted.current || reason === 'input' || reason === 'clear');
    mounted.current = true;
    if (!shouldFetch) return;

    const timer = window.setTimeout(() => {
      Promise.resolve(onFetch(effectiveInputValue)).catch(() => undefined);
    }, Math.max(0, debounce));

    return () => window.clearTimeout(timer);
  }, [debounce, effectiveInputValue, minCharacters, onFetch]);

  function handleInputValueChange(value: string, reason: AutocompleteInputChangeReason) {
    lastReason.current = reason;
    if (controlledInputValue === undefined) setInternalInputValue(value);
    onInputValueChange?.(value, reason);
  }

  const visibleData = limit > 0 ? data.slice(0, limit) : data;

  return (
    <Autocomplete
      {...props}
      data={visibleData}
      inputValue={effectiveInputValue}
      onInputValueChange={handleInputValueChange}
      minCharacters={minCharacters}
      filterData={false}
      loadError={loadError}
    />
  );
}
