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
  'min', 'max', 'caption', 'error', 'counter', 'maxLength', 'size',
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
    caption: 'Укажите сумму',
    currency: 'RUB',
    min: 1,
    max: 9_999_999.99,
    counter: true,
    maxLength: 9,
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
      description: 'ISO-код валюты или готовый символ/текст. ISO-код автоматически преобразуется в отображаемый символ.',
      table: { category: 'Content' },
    },
    min: {
      control: 'number',
      description: 'Минимально допустимая сумма. Не передавайте, если нижней границы нет.',
      table: { category: 'Validation' },
    },
    max: {
      control: 'number',
      description: 'Максимально допустимая сумма. Не передавайте, если верхней границы нет.',
      table: { category: 'Validation' },
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

export const CurrencyCode: Story = {
  args: {
    currency: 'USD',
    defaultValue: '1234,56',
    caption: 'ISO-код USD отображается как символ валюты',
  },
  parameters: {
    docs: {
      description: {
        story: 'Currency принимает ISO-код или готовый символ. Например, USD отображается как $, RUB как ₽, EUR как €. Кастомный текст также остается доступен.',
      },
    },
  },
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

export const LengthLimitOnly: Story = {
  args: {
    min: undefined,
    max: undefined,
    maxLength: 6,
    defaultValue: '1234',
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример без числового диапазона: maxLength ограничивает только количество цифр, а автоматический Counter показывает введенное количество относительно этого лимита.',
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

export const SkeletonSmall: Story = {
  args: { skeleton: true, size: 'small' },
};

