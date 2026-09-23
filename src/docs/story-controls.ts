type ControlCategory = 'Content' | 'Value' | 'State' | 'Appearance' | 'Behavior' | 'Events';

type SharedControl = {
  control?: 'text' | 'boolean' | 'radio' | 'select' | { type: 'number'; min?: number; max?: number; step?: number };
  options?: readonly string[];
  description?: string;
  action?: string;
  table?: { category: ControlCategory };
};

const control = (
  category: ControlCategory,
  config: Omit<SharedControl, 'table'>,
): SharedControl => ({ ...config, table: { category } });

/**
 * Единые Controls для form-компонентов. Если prop совпадает по смыслу,
 * он должен иметь одинаковый control, описание и категорию во всех stories.
 */
export const sharedFieldControls = {
  label: control('Content', { control: 'text', description: 'Подпись поля.' }),
  required: control('State', { control: 'boolean', description: 'Показывает обязательность поля и передает required-семантику.' }),
  value: control('Value', { control: 'text', description: 'Управляемое значение.' }),
  defaultValue: control('Value', { control: 'text', description: 'Начальное значение в uncontrolled-режиме.' }),
  inputValue: control('Value', { control: 'text', description: 'Управляемый текст поискового запроса.' }),
  defaultInputValue: control('Value', { control: 'text', description: 'Начальный текст поискового запроса.' }),
  placeholder: control('Content', { control: 'text', description: 'Текст пустого поля.' }),
  description: control('Content', { control: 'text', description: 'Дополнительное описание внутри поля.' }),
  caption: control('Content', { control: 'text', description: 'Подсказка под полем.' }),
  error: control('State', { control: 'text', description: 'Текст validation error. Имеет приоритет над Caption.' }),
  counter: control('Content', { control: 'boolean', description: 'Показывает счетчик символов, если компонент его поддерживает.' }),
  maxLength: control('Behavior', { control: { type: 'number', min: 0 }, description: 'Максимальная длина значения.' }),
  size: control('Appearance', { control: 'radio', options: ['small', 'medium'], description: 'Размер компонента.' }),
  clearable: control('Behavior', { control: 'boolean', description: 'Разрешает очистку непустого значения.' }),
  disabled: control('State', { control: 'boolean', description: 'Отключает взаимодействие с компонентом.' }),
  skeleton: control('State', { control: 'boolean', description: 'Показывает загрузочное состояние вместо интерактивного поля.' }),
  loading: control('State', { control: 'boolean', description: 'Показывает состояние загрузки данных.' }),
  onChange: control('Events', { action: 'change', description: 'Изменение нативного значения поля.' }),
  onValueChange: control('Events', { action: 'value-change', description: 'Изменение выбранного значения.' }),
  onInputValueChange: control('Events', { action: 'input-value-change', description: 'Изменение текста поискового запроса.' }),
  onFocus: control('Events', { action: 'focus', description: 'Получение фокуса.' }),
  onBlur: control('Events', { action: 'blur', description: 'Потеря фокуса.' }),
  onKeyDown: control('Events', { action: 'keydown', description: 'Нажатие клавиши внутри поля.' }),
  onClear: control('Events', { action: 'clear', description: 'Очистка значения.' }),
  onOpenChange: control('Events', { action: 'open-change', description: 'Изменение состояния раскрытого Menu.' }),
} as const;

export type SharedFieldControlKey = keyof typeof sharedFieldControls;

export function pickFieldControls(...keys: SharedFieldControlKey[]) {
  return Object.fromEntries(keys.map(key => [key, sharedFieldControls[key]]));
}

/** Оставляет в Controls только продуктовые параметры и сохраняет заданный порядок. */
export function controlsParameters(include: readonly string[]) {
  return {
    sort: 'none' as const,
    include: [...include],
  };
}
