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
  'label', 'placeholder', 'value', 'defaultValue', 'options', 'display', 'caption', 'error', 'counter',
  'required', 'size', 'creatable', 'selectAll', 'selectionPosition', 'clearable', 'disabled', 'skeleton',
  'placement', 'menuMaxHeight', 'emptyText', 'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown',
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
**Multiselect** выбирает несколько значений из списка и поддерживает разные способы показа выбранного.

### Display

- **comma** — значения через запятую в одну строку; при нехватке ширины текст обрезается через ellipsis;
- **count** — текст «Выбрано N»;
- **firstAndCount** — первое значение и количество остальных, например «Дизайн +3»;
- **chips** — отдельные Chips с удалением каждого значения; Chips переносятся на новые строки, поэтому поле растет по высоте.

### Creatable

При **creatable=true** компонент всегда использует display=chips. После выбранных Chips находится поле ввода. Enter превращает введенный текст в новый Chips. Пользовательское значение хранится в value, но не добавляется в Menu.

### Menu

Menu использует ItemRow с Checkbox и остается открытым после выбора. Checkbox по умолчанию расположен слева. selectionPosition="right" освобождает левый слот строки под leadingIcon. selectAll добавляет первой строкой «Выбрать все»; при частичном выборе Checkbox этой строки становится indeterminate.

### Общее поведение

- value/defaultValue содержат массив значений;
- onValueChange возвращает полный новый массив;
- Clear использует общий FieldClearButton и очищает весь выбор;
- повторный выбор пункта снимает его выбор;
- после выбора мышкой строка не сохраняет focused-состояние;
- Disabled option нельзя выбрать;
- Escape закрывает Menu, Tab закрывает Menu и продолжает обычную навигацию;
- ArrowDown/ArrowUp перемещают активный пункт, Enter переключает его;
- Backspace удаляет последнее выбранное значение, когда это не мешает вводу creatable;
- required использует общий FieldLabel и aria-required.

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
    display: 'comma',
    selectionPosition: 'left',
    clearable: true,
  },
  argTypes: {
    ...pickFieldControls('label', 'placeholder', 'caption', 'error', 'required', 'size', 'clearable', 'disabled', 'skeleton', 'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown'),
    value: { control: 'object', description: 'Управляемый массив выбранных значений.', table: { category: 'Value' } },
    defaultValue: { control: 'object', description: 'Начальный массив выбранных значений.', table: { category: 'Value' } },
    options: { control: 'object', description: 'Доступные варианты выбора.', table: { category: 'Content' } },
    display: {
      control: 'radio',
      options: ['comma', 'count', 'firstAndCount', 'chips'],
      description: 'Способ отображения выбранных значений. Creatable всегда использует chips.',
      table: { category: 'Appearance' },
    },
    counter: { control: 'boolean', description: 'Показывает количество выбранных значений в Helper.', table: { category: 'Content' } },
    creatable: { control: 'boolean', description: 'Разрешает создавать свое значение через ввод + Enter.', table: { category: 'Behavior' } },
    selectAll: { control: 'boolean', description: 'Добавляет строку «Выбрать все» в Menu.', table: { category: 'Behavior' } },
    selectionPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Позиция Checkbox в строках Menu. Справа освобождает левый слот под leadingIcon.',
      table: { category: 'Appearance' },
    },
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

export const DisplayModes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Multiselect {...args} label="Comma" display="comma" defaultValue={['design', 'frontend', 'backend', 'qa']} />
      <Multiselect {...args} label="Count" display="count" defaultValue={['design', 'frontend', 'backend', 'qa']} />
      <Multiselect {...args} label="First + count" display="firstAndCount" defaultValue={['design', 'frontend', 'backend', 'qa']} />
      <Multiselect {...args} label="Chips" display="chips" defaultValue={['design', 'frontend', 'backend', 'qa']} />
    </div>
  ),
};

export const ChipsWrap: Story = {
  args: {
    display: 'chips',
    defaultValue: ['design', 'frontend', 'backend', 'qa', 'analytics'],
    label: 'Много выбранных значений',
  },
};

export const Creatable: Story = {
  args: {
    creatable: true,
    defaultValue: ['design', 'frontend'],
    label: 'Команды и свое значение',
    caption: 'Введите свое значение и нажмите Enter',
  },
};

export const SelectAll: Story = {
  args: {
    selectAll: true,
    defaultValue: ['design', 'frontend'],
    label: 'Команды',
  },
};

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

export const WithLeadingIcons: Story = {
  args: {
    label: 'Разделы',
    selectionPosition: 'right',
    options: [
      { value: 'docs', label: 'Документы', leadingIcon: 'doc-list' },
      { value: 'archive', label: 'Архив', leadingIcon: 'archive' },
      { value: 'settings', label: 'Настройки', leadingIcon: 'gear' },
    ],
  },
};

export const LongValues: Story = {
  args: {
    display: 'comma',
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
