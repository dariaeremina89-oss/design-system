import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete, type AutocompleteItem } from './Autocomplete';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const items: AutocompleteItem[] = [
  { value: 'apple', label: 'Яблоки' },
  { value: 'banana', label: 'Бананы' },
  { value: 'broccoli', label: 'Брокколи' },
  { value: 'carrot', label: 'Морковь' },
  { value: 'chocolate', label: 'Шоколад' },
  { value: 'grape', label: 'Виноград' },
  { value: 'lemon', label: 'Лимон' },
  { value: 'lettuce', label: 'Листовой салат' },
];

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'inputValue', 'defaultInputValue',
  'placeholder', 'description', 'caption', 'error', 'counter', 'size',
  'clearable', 'disabled', 'skeleton', 'mode', 'minCharacters', 'highlightMatches',
  'showSelectedIcon', 'loading', 'placement', 'menuMaxHeight', 'noOptionsText', 'idleText', 'loadingText',
  'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
] as const;

const meta = {
  title: 'Components/Selection/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: {
        component:
          'Autocomplete выбирает одно значение из списка через поиск. Визуально наследует Input, Select и Menu: без полученного списка работает как Input, при наличии вариантов — как Select. Произвольное значение сохранить нельзя. required показывает обязательность через Label и передает aria-required полю.',
      },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  args: {
    data: items,
    label: 'Продукты',
    placeholder: 'Введите текст',
    clearable: true,
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'inputValue', 'defaultInputValue',
      'placeholder', 'description', 'caption', 'error', 'counter', 'size',
      'clearable', 'disabled', 'skeleton', 'loading',
      'onValueChange', 'onInputValueChange', 'onClear', 'onOpenChange',
    ),
    mode: { control: 'radio', options: ['auto', 'input', 'select'], description: 'Визуальная логика Input/Select. Auto зависит от наличия списка.', table: { category: 'Behavior' } },
    minCharacters: { control: { type: 'number', min: 0 }, description: 'Минимум символов до показа результатов.', table: { category: 'Behavior' } },
    highlightMatches: { control: 'boolean', description: 'Подсвечивает совпадение запроса в вариантах.', table: { category: 'Behavior' } },
    showSelectedIcon: { control: 'boolean', description: 'Показывает отметку выбранного элемента в Menu.', table: { category: 'Appearance' } },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'], description: 'Позиция Menu относительно поля.', table: { category: 'Appearance' } },
    menuMaxHeight: { control: { type: 'number', min: 48 }, description: 'Максимальная высота Menu, px.', table: { category: 'Appearance' } },
    noOptionsText: { control: 'text', description: 'Сообщение, когда результатов нет.', table: { category: 'Content' } },
    idleText: { control: 'text', description: 'Сообщение до достижения minCharacters.', table: { category: 'Content' } },
    loadingText: { control: 'text', description: 'Доступное текстовое описание Loading.', table: { category: 'Content' } },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Autocomplete {...args} size="medium" />
      <Autocomplete {...args} size="small" />
    </div>
  ),
};

export const States: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Autocomplete {...args} data={[]} mode="input" label="Empty / Input" />
      <Autocomplete {...args} defaultValue="banana" label="Filled" showSelectedIcon />
      <Autocomplete {...args} error="Выберите значение" required label="Validation Error" />
      <Autocomplete {...args} disabled defaultValue="apple" label="Disabled" />
      <Autocomplete {...args} skeleton label="Skeleton" />
    </div>
  ),
};

export const Open: Story = {
  args: { mode: 'select', label: 'Focused & Open / Select' },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы открыть Menu.' } } },
};

export const Typing: Story = {
  args: { defaultInputValue: 'Шок', label: 'Typing' },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать отфильтрованный список.' } } },
};

export const NoResults: Story = {
  args: { defaultInputValue: 'Киви', label: 'No Results' },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать состояние без результатов.' } } },
};

export const Loading: Story = {
  args: { defaultInputValue: 'Яб', loading: true },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать Loading в Menu.' } } },
};

export const LoadError: Story = {
  args: {
    defaultInputValue: 'Яб',
    loadError: <>
      Не удалось получить список. Попробуйте вернуться позже. Если ошибка сохраняется, обратитесь в техподдержку{' '}
      <u>support@fdoc.ru</u>
    </>,
  },
  parameters: { docs: { description: { story: 'Нажмите на поле, чтобы показать ошибку загрузки Menu.' } } },
};

export const InputMode: Story = {
  args: { data: [], mode: 'input', minCharacters: 2, idleText: 'Введите минимум 2 символа' },
};

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    return (
      <Autocomplete
        {...args}
        value={value}
        inputValue={inputValue}
        onValueChange={setValue}
        onInputValueChange={setInputValue}
      />
    );
  },
};

export const LongListAtEdge: Story = {
  args: {
    data: Array.from({ length: 100 }, (_, index) => ({ value: String(index + 1), label: `Организация ${index + 1}` })),
  },
  decorators: [Story => <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%' }}><Story /></div></div>],
};
