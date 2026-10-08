import { componentDocs } from '../../docs/bulk-components';
import { qualityDocs } from '../../docs/quality';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AsyncAutocomplete } from './AsyncAutocomplete';
import type { AutocompleteItem } from './Autocomplete';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const INVALID_QUERY_ERROR = 'Недопустимые символы. Используйте буквы, цифры, пробелы и дефис.';

function hasInvalidQuery(value: string) {
  return /[^\p{L}\p{N}\s-]/u.test(value);
}

const allItems: AutocompleteItem[] = [
  { value: 'apple', label: 'Яблоки' },
  { value: 'banana', label: 'Бананы' },
  { value: 'broccoli', label: 'Брокколи' },
  { value: 'carrot', label: 'Морковь' },
  { value: 'chocolate', label: 'Шоколад' },
  { value: 'grape', label: 'Виноград' },
  { value: 'lemon', label: 'Лимон' },
];

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'inputValue', 'defaultInputValue',
  'placeholder', 'description', 'caption', 'error', 'counter', 'size',
  'clearable', 'disabled', 'skeleton', 'loading',
  'minCharacters', 'debounce', 'limit', 'highlightMatches', 'showSelectedIcon', 'placement', 'menuMaxHeight',
  'noOptionsText', 'idleText', 'loadingText', 'loadError',
  'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
] as const;

const meta = {
  title: 'Components/Selection/AsyncAutocomplete',
  component: AsyncAutocomplete,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: { component: componentDocs('AsyncAutocomplete') + qualityDocs('AsyncAutocomplete') },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  args: {
    data: allItems,
    label: 'Продукты',
    placeholder: 'Введите текст',
    minCharacters: 1,
    debounce: 500,
    limit: 10,
    clearable: true,
    onFetch: async () => undefined,
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'inputValue', 'defaultInputValue',
      'placeholder', 'description', 'caption', 'error', 'counter', 'size',
      'clearable', 'disabled', 'skeleton', 'loading',
      'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
    ),
    minCharacters: { control: { type: 'number', min: 0 }, description: 'Минимум символов до запроса и показа результатов.', table: { category: 'Behavior' } },
    debounce: { control: { type: 'number', min: 0 }, description: 'Задержка перед onFetch, мс.', table: { category: 'Behavior' } },
    limit: { control: { type: 'number', min: 0 }, description: 'Максимум отображаемых результатов.', table: { category: 'Behavior' } },
    highlightMatches: { control: 'boolean', description: 'Подсвечивает совпадение запроса в вариантах.', table: { category: 'Behavior' } },
    showSelectedIcon: { control: 'boolean', description: 'Показывает отметку выбранного элемента в Menu.', table: { category: 'Appearance' } },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'], description: 'Позиция Menu относительно поля.', table: { category: 'Appearance' } },
    menuMaxHeight: { control: { type: 'number', min: 48 }, description: 'Максимальная высота Menu, px.', table: { category: 'Appearance' } },
    noOptionsText: { control: 'text', description: 'Сообщение, когда результатов нет.', table: { category: 'Content' } },
    idleText: { control: 'text', description: 'Сообщение до достижения minCharacters.', table: { category: 'Content' } },
    loadingText: { control: 'text', description: 'Доступное текстовое описание Loading.', table: { category: 'Content' } },
    loadError: { control: 'text', description: 'Ошибка загрузки результатов внутри Menu. Не равна validation error поля.', table: { category: 'State' } },
  },
} satisfies Meta<typeof AsyncAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };

export const InteractiveRequest: Story = {
  render: args => {
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string>();

    return (
      <AsyncAutocomplete
        {...args}
        data={data}
        loading={loading}
        loadError={loadError}
        onFetch={async query => {
          setLoading(true);
          setLoadError(undefined);
          await new Promise(resolve => window.setTimeout(resolve, 500));
          if (query.toLocaleLowerCase() === 'ошибка') {
            setData([]);
            setLoadError('Не удалось получить список. Попробуйте вернуться позже.');
          } else {
            setData(allItems.filter(item => item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
          }
          setLoading(false);
        }}
      />
    );
  },
};

export const InvalidCharacters: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Недопустимый поисковый запрос показывает validation error под полем. Menu закрывается, запрос данных не запускается до исправления значения.',
      },
    },
  },
  render: args => {
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const invalid = hasInvalidQuery(inputValue);

    return (
      <AsyncAutocomplete
        {...args}
        data={invalid ? [] : data}
        inputValue={inputValue}
        error={invalid ? INVALID_QUERY_ERROR : undefined}
        open={invalid ? false : open}
        minCharacters={invalid ? Number.MAX_SAFE_INTEGER : args.minCharacters}
        debounce={0}
        onOpenChange={next => setOpen(invalid ? false : next)}
        onInputValueChange={(next, reason) => {
          setInputValue(next);
          if (hasInvalidQuery(next)) {
            setData([]);
            setOpen(false);
          }
          args.onInputValueChange?.(next, reason);
        }}
        onFetch={query => {
          if (hasInvalidQuery(query)) return;
          const normalizedQuery = query.toLocaleLowerCase();
          setData(allItems.filter(item => item.label.toLocaleLowerCase().includes(normalizedQuery)));
        }}
      />
    );
  },
};

export const Loading: Story = {
  args: { data: [], defaultInputValue: 'Яб', loading: true },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать Loading в Menu.' } } },
};

export const NoResults: Story = {
  args: { data: [], defaultInputValue: 'Киви' },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать состояние без результатов.' } } },
};

export const LoadError: Story = {
  args: {
    data: [],
    defaultInputValue: 'Яб',
    loadError: <>
      Не удалось получить список. Попробуйте вернуться позже. Если ошибка сохраняется, обратитесь в техподдержку{' '}
      <u>support@fdoc.ru</u>
    </>,
  },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать ошибку загрузки Menu.' } } },
};

export const FetchOnMount: Story = {
  args: { data: allItems, minCharacters: 0, debounce: 0 },
};
