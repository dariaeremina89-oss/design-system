import { componentDocs } from '../../docs/bulk-components';
import { qualityDocs } from '../../docs/quality';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../Link/Link';
import { AsyncAutocomplete } from './AsyncAutocomplete';
import type { AutocompleteItem } from './Autocomplete';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const SEARCH_IDLE_TEXT = 'Начните вводить ФИО, номер телефона или почту, чтобы найти сотрудника. Допустимы кириллица или латиница, цифры, пробел, символы + - @ .';
const SEARCH_VALIDATION_TEXT = 'Вы ввели недопустимые символы. Допустимы кириллица или латиница, цифры, пробел, символы + - @ .';

function hasExternalValidationError(value: string) {
  return /[^\p{L}\p{N}\s+@.\-]/u.test(value);
}

const employeeItems: AutocompleteItem[] = [
  { value: 'ivanov', label: 'Иванов Иван Иванович', description: '+7 (913) 000-00-00, pthomsen@icloud.com' },
  { value: 'sidorov', label: 'Сидоров Иван Иванович', description: '+7 (425) 850-90-97, world@outlook.com' },
  { value: 'petrov', label: 'Петров Иван Иванович', description: '+7 (838) 969-27-67, mkearl@aol.com' },
];

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
  'noOptionsText', 'idleText', 'loadingText', 'loadError', 'menuMessage',
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
    idleText: { control: 'text', description: 'Текст или функция для состояния до начала поиска. По умолчанию показывает, сколько символов осталось ввести.', table: { category: 'Content' } },
    loadingText: { control: 'text', description: 'Доступное текстовое описание Loading.', table: { category: 'Content' } },
    loadError: { control: 'text', description: 'Ошибка загрузки результатов внутри Menu. Не равна validation error поля.', table: { category: 'State' } },
    menuMessage: { control: 'text', description: 'Внешнее сообщение о поисковом запросе внутри Menu. Компонент сам запрос не валидирует.', table: { category: 'State' } },
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

export const ExternalValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Пример внешней продуктовой валидации поискового запроса. AsyncAutocomplete не проверяет строку сам: consumer передает menuMessage и решает, запускать ли onFetch.',
      },
    },
  },
  render: args => {
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const invalid = hasExternalValidationError(inputValue);

    return (
      <AsyncAutocomplete
        {...args}
        label="Сотрудники"
        placeholder="Введите ФИО, номер телефона или почту"
        data={invalid ? [] : data}
        inputValue={inputValue}
        minCharacters={1}
        debounce={0}
        idleText={SEARCH_IDLE_TEXT}
        menuMessage={invalid ? SEARCH_VALIDATION_TEXT : undefined}
        noOptionsText="Сотрудники не найдены. Проверьте введенные данные"
        onInputValueChange={(next, reason) => {
          setInputValue(next);
          if (hasExternalValidationError(next)) setData([]);
          args.onInputValueChange?.(next, reason);
        }}
        onFetch={query => {
          if (hasExternalValidationError(query)) return;
          const normalizedQuery = query.toLocaleLowerCase();
          setData(
            employeeItems.filter(item =>
              `${item.label} ${String(item.description ?? '')}`
                .toLocaleLowerCase()
                .includes(normalizedQuery),
            ),
          );
        }}
      />
    );
  },
};

export const MinimumCharacters: Story = {
  args: {
    data: [],
    minCharacters: 3,
    debounce: 0,
    placeholder: 'Начните ввод',
  },
  parameters: {
    docs: {
      description: {
        story: 'До достижения minCharacters Menu показывает динамический счетчик оставшихся символов: 3 → 2 → 1. После порога начинается обычный async-поиск.',
      },
    },
  },
};

export const Loading: Story = {
  args: { data: [], defaultInputValue: 'Яб', loading: true },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать Loading в Menu.' } } },
};

export const NoResults: Story = {
  args: { data: [], defaultInputValue: 'Киви', noOptionsText: 'Результаты не найдены. Проверьте введенные данные' },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать состояние без результатов.' } } },
};

export const LoadError: Story = {
  args: {
    data: [],
    defaultInputValue: 'Яб',
    loadError: <>
      Не удалось получить список. Попробуйте вернуться позже. Если ошибка сохраняется, обратитесь в техподдержку{' '}
      <Link href="mailto:support@fdoc.ru" typography="inherit">support@fdoc.ru</Link>
    </>,
  },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать ошибку загрузки Menu.' } } },
};

export const FetchOnMount: Story = {
  args: { data: allItems, minCharacters: 0, debounce: 0 },
};
