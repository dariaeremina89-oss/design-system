import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeInput } from '../components/CodeInput/CodeInput';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';
import { controlsParameters, pickFieldControls } from '../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'type', 'length',
  'phoneGroups', 'phonePrefix', 'phoneSuffix', 'size',
  'mask', 'maskDelay', 'caption', 'error', 'disabled', 'skeleton', 'autoFocus',
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
      <div style={{ width: '100%', maxWidth: 456 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Код подтверждения',
    caption: 'Введите код из сообщения',
    type: 'code',
    length: 6,
    size: 'medium',
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'caption', 'error',
      'size', 'disabled', 'skeleton', 'onValueChange', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    type: {
      control: 'radio',
      options: ['code', 'phone'],
      description: 'Тип ввода: код подтверждения или часть номера телефона.',
      table: { category: 'Value' },
    },
    length: {
      control: 'radio',
      options: [4, 5, 6],
      description: 'Количество ячеек только для Type=code.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['medium', 'small'],
      description: 'Размер Type=code. Для Type=phone всегда используется Small 48, как в Figma.',
      table: { category: 'Appearance' },
    },
    phoneGroups: {
      control: 'object',
      description: 'Размеры групп вводимых цифр для Type=phone. Сумма значений определяет количество ячеек.',
      table: { category: 'Appearance' },
    },
    phonePrefix: {
      control: 'text',
      description: 'Неизменяемая часть номера перед ячейками.',
      table: { category: 'Content' },
    },
    phoneSuffix: {
      control: 'text',
      description: 'Неизменяемая часть номера после ячеек.',
      table: { category: 'Content' },
    },
    mask: {
      control: 'boolean',
      description: 'Маскирует введенные цифры звездочкой. Используется только для Type=code.',
      table: { category: 'Behavior' },
    },
    maskDelay: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Задержка перед маскированием введенной цифры, мс. По умолчанию 800.',
      table: { category: 'Behavior' },
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

export const SkeletonFilled: Story = {
  args: { skeleton: true, defaultValue: '420615' },
};

export const SkeletonSmallFilled: Story = {
  args: { skeleton: true, defaultValue: '420615', size: 'small' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const FourDigits: Story = {
  args: { length: 4 },
};

export const PinMasking: Story = {
  args: {
    label: 'PIN-код',
    caption: 'Введенная цифра скрывается через 800 мс',
    length: 4,
    mask: true,
    maskDelay: 800,
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Сценарий маскирования из Figma: введенная цифра сначала отображается открыто, затем через maskDelay заменяется на *. Значение onValueChange и hidden input остается исходным цифровым кодом.',
      },
    },
  },
};

export const PinMaskedFilled: Story = {
  args: {
    label: 'PIN-код',
    caption: undefined,
    length: 4,
    mask: true,
    maskDelay: 800,
    defaultValue: '4206',
  },
};

export const PhoneFigmaExample: Story = {
  args: {
    type: 'phone',
    size: 'small',
    length: undefined,
    label: 'Введите пропущенные цифры',
    caption: undefined,
    phonePrefix: '+7 9',
    phoneGroups: [2, 3, 2],
    phoneSuffix: '88',
  },
  parameters: {
    docs: {
      description: {
        story: 'Структура Type=Phone из Figma: статичная часть номера + группы вводимых цифр 2 / 3 / 2 + статичная часть справа. Между ячейками внутри группы space-4, между группами space-12.',
      },
    },
  },
};

export const PhoneFigmaFilled: Story = {
  args: {
    type: 'phone',
    size: 'small',
    length: undefined,
    label: 'Введите пропущенные цифры',
    caption: undefined,
    phonePrefix: '+7 9',
    phoneGroups: [2, 3, 2],
    phoneSuffix: '88',
    defaultValue: '1234567',
  },
};

export const PhoneFigmaError: Story = {
  args: {
    type: 'phone',
    size: 'small',
    length: undefined,
    label: 'Введите пропущенные цифры',
    caption: undefined,
    phonePrefix: '+7 9',
    phoneGroups: [2, 3, 2],
    phoneSuffix: '88',
    defaultValue: '1234567',
    error: 'Проверьте введенные цифры',
  },
};

export const PhoneCustomGrouping: Story = {
  args: {
    type: 'phone',
    size: 'small',
    length: undefined,
    label: 'Номер телефона',
    caption: 'Группировка и количество цифр задаются сценарием',
    phonePrefix: '+44',
    phoneGroups: [4, 3, 3],
    phoneSuffix: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone не привязан к российской маске: количество цифр задается суммой phoneGroups, их визуальное расположение — размерами групп, prefix и suffix настраиваются отдельно.',
      },
    },
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
