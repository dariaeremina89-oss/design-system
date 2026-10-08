import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  PRICE_INPUT_FORMAT_ERROR,
  PRICE_INPUT_RANGE_ERROR,
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
      description: 'Символ валюты справа от значения.',
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
  args: { defaultValue: '10000000', error: PRICE_INPUT_RANGE_ERROR },
};

export const ErrorFormat: Story = {
  args: { defaultValue: '12', error: PRICE_INPUT_FORMAT_ERROR },
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
