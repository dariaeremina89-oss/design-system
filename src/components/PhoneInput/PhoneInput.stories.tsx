import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneInput, PHONE_INPUT_FORMAT_ERROR, PHONE_INPUT_REQUIRED_ERROR, type PhoneInputType } from './PhoneInput';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'phoneType', 'defaultPhoneType',
  'caption', 'error', 'size', 'disabled', 'skeleton', 'placement', 'menuMaxHeight',
  'onValueChange', 'onPhoneTypeChange', 'onOpenChange', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/Inputs/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: {
        component: `
**PhoneInput** — специализированное поле для одного телефонного номера. Компонент собирается из Input и Menu и поддерживает российский и иностранный формат.

**Russian** используется по умолчанию. В пустом поле отображаются постоянный префикс \`+7\` и маска \`(000) 000-00-00\`. Значение форматируется как \`+7 (999) 999-99-99\`. Номера из 10 цифр, начинающиеся с 9, а также 11 цифр с \`79\` или \`89\`, распознаются как российские; \`8\` преобразуется в \`7\`.

**International** отображает постоянный \`+\` без маски и дополнительного форматирования.

Type selector — отдельный фокусируемый элемент в Leading-зоне. Он открывает Menu из двух вариантов: «Россия +7» и «Иностранный номер». Актуальные состояния selector берутся из \`flag_chevron\` в Figma.

При вставке удаляются символы форматирования, определяется тип номера и применяется нужное отображение. Ввод букв и других недопустимых символов не сохраняется.

Внешнее \`value\` нормализовано до \`+\` и цифр. Валидационные тексты по спецификации: «${PHONE_INPUT_REQUIRED_ERROR}» и «${PHONE_INPUT_FORMAT_ERROR}». Само отображение ошибки управляется prop \`error\`, как у базового Input.
        `.trim(),
      },
    },
  },
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  args: {
    label: 'Номер телефона',
    defaultPhoneType: 'russian',
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'caption', 'error', 'size',
      'disabled', 'skeleton', 'onValueChange', 'onOpenChange', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    phoneType: {
      control: 'radio',
      options: ['russian', 'international'],
      description: 'Управляемый тип номера.',
      table: { category: 'Value' },
    },
    defaultPhoneType: {
      control: 'radio',
      options: ['russian', 'international'],
      description: 'Начальный тип номера в uncontrolled-режиме.',
      table: { category: 'Value' },
    },
    placement: {
      control: 'select',
      options: ['auto', 'top', 'bottom'],
      description: 'Позиция Menu относительно поля.',
      table: { category: 'Appearance' },
    },
    menuMaxHeight: {
      control: { type: 'number', min: 96 },
      description: 'Максимальная высота Menu, px.',
      table: { category: 'Appearance' },
    },
    onPhoneTypeChange: {
      action: 'phone-type-change',
      description: 'Изменение типа номера.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RussianFilled: Story = {
  args: { defaultValue: '+79081822772' },
};

export const International: Story = {
  args: { defaultPhoneType: 'international', defaultValue: '+4747603236' },
};

export const Required: Story = {
  args: { required: true },
};

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <PhoneInput {...args} size="medium" />
      <PhoneInput {...args} size="small" />
    </div>
  ),
};

export const Validation: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <PhoneInput {...args} required error={PHONE_INPUT_REQUIRED_ERROR} />
      <PhoneInput {...args} defaultValue="+7908182277" error={PHONE_INPUT_FORMAT_ERROR} />
    </div>
  ),
};

export const Disabled: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24 }}>
      <PhoneInput {...args} disabled />
      <PhoneInput {...args} disabled defaultValue="+79081822772" />
      <PhoneInput {...args} disabled defaultPhoneType="international" defaultValue="+4747603236" />
    </div>
  ),
};

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const CountryMenu: Story = {
  parameters: {
    docs: { description: { story: 'Нажмите на selector слева, чтобы открыть Menu выбора типа номера.' } },
  },
};

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState('+79081822772');
    const [phoneType, setPhoneType] = useState<PhoneInputType>('russian');
    return (
      <PhoneInput
        {...args}
        value={value}
        phoneType={phoneType}
        onValueChange={setValue}
        onPhoneTypeChange={setPhoneType}
      />
    );
  },
};
