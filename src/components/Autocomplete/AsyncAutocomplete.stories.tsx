import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AsyncAutocomplete } from './AsyncAutocomplete';
import type { AutocompleteItem } from './Autocomplete';

const allItems: AutocompleteItem[] = [
  { value: 'apple', label: 'Яблоки' },
  { value: 'banana', label: 'Бананы' },
  { value: 'broccoli', label: 'Брокколи' },
  { value: 'carrot', label: 'Морковь' },
  { value: 'chocolate', label: 'Шоколад' },
  { value: 'grape', label: 'Виноград' },
  { value: 'lemon', label: 'Лимон' },
];

const meta = {
  title: 'Components/Selection/AsyncAutocomplete',
  component: AsyncAutocomplete,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AsyncAutocomplete использует ту же визуальную и интерактивную модель, что Autocomplete, но варианты получает по запросу. Запрос запускается после minCharacters и debounce; состояния Loading и Load Error относятся к Menu и не заменяют validation error поля.',
      },
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
    size: { control: 'radio', options: ['small', 'medium'] },
    minCharacters: { control: { type: 'number', min: 0 } },
    debounce: { control: { type: 'number', min: 0 } },
    limit: { control: { type: 'number', min: 0 } },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    highlightMatches: { control: 'boolean' },
  },
} satisfies Meta<typeof AsyncAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

export const Loading: Story = {
  args: {
    data: [],
    defaultInputValue: 'Яб',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Нажмите на поле, чтобы показать Loading в Menu.',
      },
    },
  },
};

export const NoResults: Story = {
  args: {
    data: [],
    defaultInputValue: 'Киви',
  },
  parameters: {
    docs: {
      description: {
        story: 'Нажмите на поле, чтобы показать состояние без результатов.',
      },
    },
  },
};

export const LoadError: Story = {
  args: {
    data: [],
    defaultInputValue: 'Яб',
    loadError: (
      <>
        Не удалось получить список. Попробуйте вернуться позже. Если ошибка сохраняется, обратитесь в техподдержку{' '}
        <u>support@fdoc.ru</u>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Нажмите на поле, чтобы показать ошибку загрузки Menu.',
      },
    },
  },
};

export const FetchOnMount: Story = {
  args: {
    data: allItems,
    minCharacters: 0,
    debounce: 0,
  },
};
