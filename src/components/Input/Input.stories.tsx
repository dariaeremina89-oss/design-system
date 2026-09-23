import { testingDocs } from '../../docs/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames } from '../Icon/Icon';
import { Input } from './Input';

const meta = {
  title: 'Components/Inputs/Input',
  component: Input,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Input** — нативное текстовое поле F.Doc с опциональными Label, Description, Helper, Caption/Error, Counter и слотами иконок.

### API и анатомия

- Размеры: \`medium\` (56 px) и \`small\` (48 px).
- \`leadingIcon\`, \`trailingIcon\`, \`sumIcon\` и \`clearIcon\` выбираются из библиотеки \`Icon\`.
- \`clearable\` использует \`ButtonIcon\` размера 24, цвета \`Neutral\`, с иконкой \`filled/cross_circle_filled\` по умолчанию.
- \`counter={true}\` показывает длину значения и учитывает \`maxLength\`.
- \`error\` заменяет \`caption\`, но не меняет цвет Value, Placeholder, Description, Counter и иконок.

Caret не является пропсом: текстовый курсор остается нативным поведением HTML input и не добавляется как отдельная иконка.

### Состояния и доступность

Поддерживаются Default, Hover, Focused, Disabled, Error и Skeleton. Focus не меняет внешний размер поля. Компонент использует нативный \`input\`, связывает Label через \`htmlFor\`, а Description, Error и Counter через \`aria-describedby\`; для ошибки устанавливает \`aria-invalid\`.

Это компонент тестовой дизайн-системы и личного плейбука, а не официальный production-пакет F.Doc.
        ` + testingDocs('Input'),
      },
    },
  },
  args: {
    label: 'Label text',
    placeholder: 'Placeholder',
    caption: 'Caption text',
    wrapperClassName: 'story-input-width',
  },
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    size: { control: 'radio', options: ['medium', 'small'], description: 'Medium 56 или Small 48 в Figma' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    caption: { control: 'text' },
    counter: { control: 'boolean' },
    required: { control: 'boolean' },
    leadingIcon: { control: 'select', options: iconNames },
    trailingIcon: { control: 'select', options: iconNames },
    sum: { control: 'text' },
    sumIcon: { control: 'select', options: iconNames },
    clearIcon: { control: 'select', options: iconNames },
    onChange: { action: 'change' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    onKeyDown: { action: 'keydown' },
    onClear: { action: 'clear' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'Input text' } };
export const Error: Story = { args: { error: 'Error text', caption: undefined } };
export const FocusedError: Story = { args: { autoFocus: true, error: 'Error text', caption: undefined } };
export const Required: Story = { args: { required: true } };
export const WithDescriptionAndCounter: Story = {
  args: { defaultValue: 'Input text', description: 'Description text', caption: 'Caption text', maxLength: 100, counter: true },
};
export const WithSlots: Story = {
  args: {
    defaultValue: 'Input text',
    leadingIcon: 'magnifying-glass',
    trailingIcon: 'eye',
    sum: '00,00',
    sumIcon: 'currency/ruble-sign_regular',
  },
};
export const Clearable: Story = { args: { defaultValue: 'Input text', clearable: true } };
export const Disabled: Story = { args: { defaultValue: 'Input text', disabled: true, leadingIcon: 'magnifying-glass' } };
export const Skeleton: Story = { args: { skeleton: true } };
export const SkeletonWithAllContent: Story = {
  args: {
    skeleton: true,
    label: 'Название поля',
    required: true,
    description: 'Описание внутри поля',
    error: 'Текст ошибки',
    counter: true,
    maxLength: 100,
    leadingIcon: 'magnifying-glass',
    trailingIcon: 'eye',
    sum: '100',
    sumIcon: 'currency/ruble-sign_regular',
    clearable: true,
    defaultValue: 'Значение',
  },
};
export const Small: Story = { args: { size: 'small' } };
export const Focused: Story = { args: { autoFocus: true } };
export const LongText: Story = {
  args: {
    label: 'Очень длинный label, который должен переноситься внутри доступной ширины',
    placeholder: 'Очень длинный placeholder без выхода за границы компонента',
    caption: 'Очень длинный текст подсказки тоже должен переноситься внутри доступной ширины',
  },
};
export const LongUnbrokenText: Story = {
  args: {
    label: 'https://example.com/very-long-unbroken-label-value-that-must-not-break-the-layout',
    caption: 'https://example.com/very-long-unbroken-caption-value-that-must-not-break-the-layout',
    maxLength: 100,
    counter: true,
  },
};

export const LongRequiredLabel: Story = {
  args: {
    label: 'Очень длинный label без пробелов, который должен переноситься вместе с required marker',
    required: true,
  },
};
