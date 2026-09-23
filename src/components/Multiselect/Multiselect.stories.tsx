import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Multiselect, type MultiselectOption } from './Multiselect';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const options: MultiselectOption[] = [
  { value: 'design', label: 'Дизайн' },
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'backend', label: 'Бэкенд' },
  { value: 'qa', label: 'Тестирование' },
  { value: 'analytics', label: 'Аналитика' },
  { value: 'archive', label: 'Архив', disabled: true },
];

const controlOrder = [
  'label', 'placeholder', 'value', 'defaultValue', 'options', 'caption', 'error', 'counter',
  'required', 'size', 'clearable', 'disabled', 'skeleton', 'placement', 'menuMaxHeight', 'emptyText',
  'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/Selection/Multiselect',
  component: Multiselect,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: {
        component: `
**Multiselect** выбирает несколько значений из заранее заданного списка.

### Анатомия

Переиспользует общую геометрию полей, Chips, ButtonIcon, Menu и Popup. Выбранные значения отображаются внутри поля как Chips. Каждый Chips можно удалить отдельно, Clear очищает выбор целиком, chevron открывает и закрывает Menu.

Размеры поля совпадают с Input и Select: Medium — 56 px, Small — 48 px. Chips внутри поля — 32 px. Menu использует строки с Checkbox и остается открытым после выбора, чтобы пользователь мог отметить несколько значений подряд.

### Поведение

- value/defaultValue содержат массив option.value;
- onValueChange возвращает полный новый массив выбранных значений;
- повторный выбор пункта снимает его выбор;
- Disabled option нельзя выбрать и удалить через клавиатуру;
- Escape закрывает Menu, Tab закрывает Menu и продолжает обычную навигацию;
- ArrowDown/ArrowUp, Home/End перемещают активный пункт, Enter/Space переключают его;
- Backspace при закрытом Menu удаляет последнее выбранное значение;
- required показывает маркер у Label и передает aria-required combobox;
- validation error поля не закрывает и не заменяет Menu;
- открытое Menu не задается через Controls: его состояние проверяется интерактивно кликом или клавиатурой.

Это компонент тестовой дизайн-системы и личного плейбука, а не официальный production-пакет F.Doc.
        `,
      },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  args: {
    options,
    label: 'Команды',
    placeholder: 'Выберите команды',
    caption: 'Можно выбрать несколько вариантов',
    clearable: true,
  },
  argTypes: {
    ...pickFieldControls('label', 'placeholder', 'caption', 'error', 'required', 'size', 'clearable', 'disabled', 'skeleton', 'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown'),
    value: { control: 'object', description: 'Управляемый массив выбранных option.value.', table: { category: 'Value' } },
    defaultValue: { control: 'object', description: 'Начальный массив выбранных option.value.', table: { category: 'Value' } },
    options: { control: 'object', description: 'Доступные варианты выбора.', table: { category: 'Content' } },
    counter: { control: 'boolean', description: 'Показывает количество выбранных значений.', table: { category: 'Content' } },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'], table: { category: 'Behavior' } },
    menuMaxHeight: { control: { type: 'number', min: 48 }, table: { category: 'Behavior' } },
    emptyText: { control: 'text', table: { category: 'Content' } },
  },
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Filled: Story = { args: { defaultValue: ['design', 'frontend'] } };
export const Counter: Story = { args: { defaultValue: ['design', 'frontend', 'qa'], counter: true } };

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Multiselect {...args} size="medium" defaultValue={['design']} />
      <Multiselect {...args} size="small" defaultValue={['design']} />
    </div>
  ),
};

export const States: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Multiselect {...args} label="Empty" />
      <Multiselect {...args} label="Filled" defaultValue={['design', 'frontend']} />
      <Multiselect {...args} label="Validation Error" error="Выберите хотя бы одну команду" required />
      <Multiselect {...args} label="Disabled" disabled defaultValue={['design']} />
      <Multiselect {...args} label="Skeleton" skeleton />
    </div>
  ),
};

export const ManyValues: Story = {
  args: {
    defaultValue: ['design', 'frontend', 'backend', 'qa', 'analytics'],
    label: 'Много выбранных значений',
  },
};

export const LongValues: Story = {
  args: {
    options: [
      { value: 'one', label: 'Очень длинное название выбранного значения, которое не должно ломать ширину поля' },
      { value: 'two', label: 'Еще один длинный вариант для проверки переполнения' },
    ],
    defaultValue: ['one', 'two'],
  },
};

export const EmptyOptions: Story = { args: { options: [], emptyText: 'Нет доступных вариантов' } };

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState<string[]>(['design']);
    return <Multiselect {...args} value={value} onValueChange={setValue} />;
  },
};

export const AtEdge: Story = {
  decorators: [Story => <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%' }}><Story /></div></div>],
};
