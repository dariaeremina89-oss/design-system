import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeInput } from '../components/CodeInput/CodeInput';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';
import { controlsParameters, pickFieldControls } from '../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'length', 'size',
  'caption', 'error', 'disabled', 'skeleton', 'autoFocus',
  'onValueChange', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/Inputs/CodeInput',
  component: CodeInput,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: { component: componentDocs('CodeInput') + qualityDocs('CodeInput') },
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '100%', maxWidth: 456, overflowX: 'auto', paddingBottom: 2 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Код подтверждения',
    caption: 'Введите код из сообщения',
    length: 6,
    size: 'medium',
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'caption', 'error',
      'size', 'disabled', 'skeleton', 'onValueChange', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    length: {
      control: 'radio',
      options: [4, 5, 6],
      description: 'Количество ячеек кода.',
      table: { category: 'Appearance' },
    },
    autoFocus: {
      control: 'boolean',
      description: 'Автоматически ставит фокус в первую ячейку.',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: '420615' },
};

export const Error: Story = {
  args: { defaultValue: '420615', error: 'Неверный код. Попробуйте еще раз' },
};

export const Disabled: Story = {
  args: { defaultValue: '420615', disabled: true },
};

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const FourDigits: Story = {
  args: { length: 4 },
};

export const Interactive: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <CodeInput {...args} value={value} onValueChange={setValue} />;
  },
};

export const States: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <CodeInput {...args} label="Default" caption={undefined} />
      <CodeInput {...args} label="Filled" defaultValue="420615" caption={undefined} />
      <CodeInput {...args} label="Error" defaultValue="420615" error="Неверный код" caption={undefined} />
      <CodeInput {...args} label="Disabled" defaultValue="420615" disabled caption={undefined} />
      <CodeInput {...args} label="Skeleton" skeleton caption={undefined} />
    </div>
  ),
};
