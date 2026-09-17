import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
    size: {
      control: 'radio',
      options: ['medium', 'small'],
      description: 'Medium 56 или Small 48 в Figma',
    },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    caption: { control: 'text' },
    counter: { control: 'text' },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
    sum: { control: 'text' },
    onClear: { action: 'clear' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultValue: 'Input text',
  },
};

export const Error: Story = {
  args: {
    error: 'Error text',
    caption: undefined,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithDescriptionAndCounter: Story = {
  args: {
    defaultValue: 'Input text',
    description: 'Description text',
    caption: 'Caption text',
    counter: '100 / 100',
  },
};

export const WithSlots: Story = {
  args: {
    defaultValue: 'Input text',
    leadingIcon: <span aria-hidden="true">◉</span>,
    trailingIcon: <span aria-hidden="true">◌</span>,
    sum: '00,00',
    sumIcon: <span aria-hidden="true">⌁</span>,
    caret: true,
  },
};

export const Clearable: Story = {
  args: {
    defaultValue: 'Input text',
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Input text',
    disabled: true,
  },
};

export const Skeleton: Story = {
  args: {
    skeleton: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Focused: Story = {
  args: {
    autoFocus: true,
  },
};

export const LongText: Story = {
  args: {
    label: 'Очень длинный label, который должен переноситься внутри доступной ширины',
    placeholder: 'Очень длинный placeholder без выхода за границы компонента',
    caption: 'Очень длинный текст подсказки тоже должен переноситься внутри доступной ширины',
  },
};
