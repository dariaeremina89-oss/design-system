import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  PRICE_INPUT_REQUIRED_ERROR,
  PriceInput,
} from '../components/PriceInput/PriceInput';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';
import { controlsParameters, pickFieldControls } from '../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'currency',
  'caption', 'error', 'counter', 'maxLength', 'size',
  'clearable', 'disabled', 'skeleton',
  'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/Inputs/PriceInput',
  component: PriceInput,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: { component: componentDocs('PriceInput') + qualityDocs('PriceInput') },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 440 }}><Story /></div>],
  args: {
    label: 'Сумма',
    caption: 'Укажите сумму в рублях',
    currency: '₽',
    counter: true,
    maxLength: 100,
    clearable: true,
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'caption', 'error',
      'counter', 'maxLength', 'size', 'clearable', 'disabled', 'skeleton',
      'onValueChange', 'onClear', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    currency: {
      control: 'text',
      description: 'Символ валюты сразу после введенного значения.',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof PriceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Typing: Story = {
  args: { defaultValue: '1234' },
};

export const Filled: Story = {
  args: { defaultValue: '123456,78' },
};

export const ErrorRequired: Story = {
  args: { required: true, error: PRICE_INPUT_REQUIRED_ERROR },
};

export const ErrorLimit: Story = {
  args: { defaultValue: '10000000' },
  parameters: {
    docs: {
      description: {
        story: 'Диапазон проверяется самим PriceInput: значения меньше 1 ₽ и больше 9 999 999,99 ₽ показывают ошибку. При возврате в допустимый диапазон ошибка снимается.',
      },
    },
  },
};

export const ErrorFormat: Story = {
  args: { defaultValue: '12' },
  render: args => {
    const [value, setValue] = useState(args.defaultValue ?? '');
    return <PriceInput {...args} value={value} onValueChange={setValue} autoFocus />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Введите букву, пробел или другой недопустимый символ: значение не изменится, а поле покажет ошибку формата. Точка преобразуется в запятую для клавиатур с другим десятичным разделителем.',
      },
    },
  },
};

export const Small: Story = {
  args: { size: 'small', defaultValue: '1234,56' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '123456,78' },
};

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const Interactive: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <PriceInput {...args} value={value} onValueChange={setValue} />;
  },
};
