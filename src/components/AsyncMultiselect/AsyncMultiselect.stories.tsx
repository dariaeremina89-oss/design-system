import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentDocs } from '../../docs/bulk-components';
import { qualityDocs } from '../../docs/quality';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';
import type { MultiselectOption } from '../Multiselect/Multiselect';
import { AsyncMultiselect } from './AsyncMultiselect';

const INVALID_QUERY_ERROR = 'Недопустимые символы. Используйте буквы, цифры, пробелы и дефис.';

function hasInvalidQuery(value: string) {
  return /[^\p{L}\p{N}\s-]/u.test(value);
}

const allOptions: MultiselectOption[] = [
  { value: 'design', label: 'Дизайн' },
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'backend', label: 'Бэкенд' },
  { value: 'qa', label: 'QA' },
  { value: 'analytics', label: 'Аналитика' },
  { value: 'support', label: 'Поддержка' },
  { value: 'archive', label: 'Архив', disabled: true },
];

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'selectedOptions',
  'inputValue', 'defaultInputValue', 'options', 'placeholder', 'caption', 'error', 'counter', 'size',
  'clearable', 'disabled', 'skeleton', 'loading',
  'minCharacters', 'debounce', 'limit', 'highlightMatches', 'selectionPosition',
  'placement', 'menuMaxHeight', 'noOptionsText', 'idleText', 'loadingText', 'loadError',
  'onFetch', 'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
] as const;

const meta = {
  title: 'Components/Selection/AsyncMultiselect',
  component: AsyncMultiselect,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: { component: componentDocs('AsyncMultiselect') + qualityDocs('AsyncMultiselect') },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  args: {
    options: allOptions,
    label: 'Команды',
    placeholder: 'Введите название',
    caption: 'Можно выбрать несколько вариантов',
    minCharacters: 1,
    debounce: 500,
    limit: 10,
    clearable: true,
    onFetch: async () => undefined,
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'inputValue', 'defaultInputValue', 'placeholder',
      'caption', 'error', 'counter', 'size', 'clearable', 'disabled', 'skeleton', 'loading',
      'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
    ),
    value: { control: 'object', description: 'Управляемый массив выбранных значений.', table: { category: 'Value' } },
    defaultValue: { control: 'object', description: 'Начальный массив выбранных значений.', table: { category: 'Value' } },
    selectedOptions: { control: 'object', description: 'Данные выбранных значений, которых может не быть в текущем ответе сервера.', table: { category: 'Value' } },
    options: { control: 'object', description: 'Результаты текущего серверного запроса.', table: { category: 'Content' } },
    minCharacters: { control: { type: 'number', min: 0 }, description: 'Минимум символов до запроса.', table: { category: 'Behavior' } },
    debounce: { control: { type: 'number', min: 0 }, description: 'Задержка перед onFetch, мс.', table: { category: 'Behavior' } },
    limit: { control: { type: 'number', min: 0 }, description: 'Максимум отображаемых результатов.', table: { category: 'Behavior' } },
    highlightMatches: { control: 'boolean', description: 'Подсвечивает совпадение запроса в label.', table: { category: 'Appearance' } },
    selectionPosition: { control: 'radio', options: ['left', 'right'], description: 'Позиция Checkbox в строках Menu.', table: { category: 'Appearance' } },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'], table: { category: 'Behavior' } },
    menuMaxHeight: { control: { type: 'number', min: 48 }, table: { category: 'Behavior' } },
    noOptionsText: { control: 'text', table: { category: 'Content' } },
    idleText: { control: 'text', table: { category: 'Content' } },
    loadingText: { control: 'text', table: { category: 'Content' } },
    loadError: { control: 'text', description: 'Ошибка загрузки результатов внутри Menu. Не равна validation error поля.', table: { category: 'State' } },
    onFetch: { action: 'fetch', table: { category: 'Events' } },
  },
} satisfies Meta<typeof AsyncMultiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

function SearchDemo({ required = false }: { required?: boolean }) {
  const [options, setOptions] = useState<MultiselectOption[]>([]);

  return (
    <AsyncMultiselect
      {...meta.args}
      required={required}
      options={options}
      debounce={0}
      onFetch={query => {
        const normalizedQuery = query.toLocaleLowerCase();
        setOptions(
          allOptions.filter(option =>
            option.label.toLocaleLowerCase().includes(normalizedQuery),
          ),
        );
      }}
    />
  );
}

export const Default: Story = {
  render: () => <SearchDemo />,
};

export const Required: Story = {
  render: () => <SearchDemo required />,
};

export const InteractiveRequest: Story = {
  render: args => {
    const [options, setOptions] = useState<MultiselectOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string>();

    return (
      <AsyncMultiselect
        {...args}
        options={options}
        loading={loading}
        loadError={loadError}
        onFetch={async query => {
          setLoading(true);
          setLoadError(undefined);
          await new Promise(resolve => window.setTimeout(resolve, 500));
          if (query.toLocaleLowerCase() === 'ошибка') {
            setOptions([]);
            setLoadError('Не удалось получить список. Попробуйте вернуться позже.');
          } else {
            setOptions(allOptions.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
          }
          setLoading(false);
        }}
      />
    );
  },
};

export const SelectedAcrossRequests: Story = {
  render: args => {
    const [options, setOptions] = useState<MultiselectOption[]>(allOptions.slice(0, 2));
    const [value, setValue] = useState<string[]>(['design']);

    return (
      <AsyncMultiselect
        {...args}
        options={options}
        value={value}
        selectedOptions={allOptions.filter(option => value.includes(option.value))}
        onValueChange={setValue}
        debounce={0}
        onFetch={query => {
          setOptions(allOptions.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
        }}
      />
    );
  },
};

export const SelectedAsChipsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Выбранные значения исключаются из результатов следующих запросов и остаются только как Chips внутри поля.',
      },
    },
  },
  render: args => {
    const [options, setOptions] = useState<MultiselectOption[]>([]);
    const [value, setValue] = useState<string[]>([]);

    return (
      <AsyncMultiselect
        {...args}
        options={options}
        value={value}
        selectedOptions={allOptions.filter(option => value.includes(option.value))}
        onValueChange={setValue}
        debounce={0}
        onFetch={query => {
          const normalizedQuery = query.toLocaleLowerCase();
          setOptions(
            allOptions.filter(option =>
              !value.includes(option.value)
              && option.label.toLocaleLowerCase().includes(normalizedQuery),
            ),
          );
        }}
      />
    );
  },
};

export const InvalidCharacters: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Недопустимый поисковый запрос показывает validation error под полем. Выбранные Chips сохраняются, Menu закрывается, запрос данных не запускается до исправления значения.',
      },
    },
  },
  render: args => {
    const [options, setOptions] = useState<MultiselectOption[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState<string[]>(['design']);
    const invalid = hasInvalidQuery(inputValue);
    const threshold = Math.max(0, args.minCharacters ?? 1);
    const showResults = !invalid && inputValue.length >= threshold;

    return (
      <AsyncMultiselect
        {...args}
        options={invalid ? [] : options}
        value={value}
        selectedOptions={allOptions.filter(option => value.includes(option.value))}
        inputValue={inputValue}
        error={invalid ? INVALID_QUERY_ERROR : undefined}
        open={showResults}
        debounce={0}
        onValueChange={setValue}
        onInputValueChange={(next, reason) => {
          setInputValue(next);
          if (hasInvalidQuery(next)) setOptions([]);
          args.onInputValueChange?.(next, reason);
        }}
        onFetch={query => {
          if (hasInvalidQuery(query)) return;
          const normalizedQuery = query.toLocaleLowerCase();
          setOptions(
            allOptions.filter(option =>
              !value.includes(option.value)
              && option.label.toLocaleLowerCase().includes(normalizedQuery),
            ),
          );
        }}
      />
    );
  },
};

export const Loading: Story = {
  args: { options: [], defaultInputValue: 'Ди', loading: true },
  parameters: { docs: { description: { story: 'Menu показывает Skeleton результатов, выбранные Chips остаются в поле.' } } },
};

export const NoResults: Story = {
  args: { options: [], defaultInputValue: 'Неизвестная команда' },
};

export const LoadError: Story = {
  args: {
    options: [],
    defaultInputValue: 'Ком',
    loadError: 'Не удалось получить список. Попробуйте вернуться позже.',
  },
};

export const FetchOnMount: Story = {
  args: { options: allOptions, minCharacters: 0, debounce: 0 },
};

export const WithLeadingIcons: Story = {
  args: {
    selectionPosition: 'right',
    options: [
      { value: 'docs', label: 'Документы', leadingIcon: 'doc-list' },
      { value: 'archive', label: 'Архив', leadingIcon: 'archive' },
      { value: 'settings', label: 'Настройки', leadingIcon: 'gear' },
    ],
    defaultInputValue: 'д',
  },
};
