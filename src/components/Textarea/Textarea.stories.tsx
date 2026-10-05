import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { controlsParameters, pickFieldControls } from '../../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'placeholder', 'caption', 'error',
  'counter', 'maxLength', 'size', 'resize', 'disabled', 'skeleton',
  'onChange', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: { description: { component: coreDocs('Textarea') + qualityDocs('Textarea') } },
  },
  decorators: [(Story, context) => <div style={{ width: context.name === 'States' ? 'min(960px, 100%)' : 'min(456px, 100%)' }}><Story /></div>],
  args: { label: 'Label text', placeholder: 'Placeholder', caption: 'Caption text' },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'value', 'defaultValue', 'placeholder', 'caption', 'error',
      'counter', 'maxLength', 'size', 'disabled', 'skeleton',
      'onChange', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    resize: { control: 'boolean', description: 'Разрешает ручное изменение высоты по вертикали.', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: 'small' } };
export const Filled: Story = { args: { defaultValue: 'Первая строка\nВторая строка\nТретья строка' } };
export const Focused: Story = { args: { autoFocus: true } };
export const Error: Story = { args: { error: 'Error text', counter: true, maxLength: 100 } };
export const FocusedError: Story = { args: { error: 'Error text', autoFocus: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Input text', counter: true } };
export const ErrorDisabled: Story = { args: { disabled: true, error: 'Error text', defaultValue: 'Input text', counter: true, maxLength: 100 } };
export const Required: Story = { args: { required: true } };
export const WithCounter: Story = { args: { counter: true, maxLength: 100 } };
export const Resize: Story = { args: { resize: true, defaultValue: 'Потяни за нижний угол поля, чтобы изменить высоту.' } };
export const Overflow: Story = { args: { defaultValue: Array.from({ length: 12 }, (_, i) => `Строка ${i + 1}`).join('\n') } };
export const LongText: Story = { args: { label: 'ДлинноеНазваниеБезПробелов'.repeat(8), caption: 'https://example.com/' + 'long'.repeat(60), defaultValue: 'ДлиннаяСтрокаБезПробелов'.repeat(50), counter: true } };
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Комментарий' } };
export const SkeletonEmpty: Story = { args: { skeleton: true, placeholder: 'Placeholder' } };
export const SkeletonFilled: Story = { args: { skeleton: true, defaultValue: 'Input text', counter: true, maxLength: 100 } };
export const Controlled: Story = {
  render: function ControlledExample(args) {
    const [value, setValue] = useState('Изменяемое значение');
    return <Textarea {...args} value={value} onChange={event => setValue(event.target.value)} counter maxLength={100} />;
  },
};
export const States: Story = {
  decorators: [Story => <div style={{ width: 'min(960px, 100%)' }}><Story /></div>],
  render: () => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
    {(['medium', 'small'] as const).flatMap(size => [
      <Textarea key={`${size}-default`} size={size} label={`${size} / Default`} placeholder="Placeholder" caption="Caption text" />,
      <Textarea key={`${size}-filled`} size={size} label={`${size} / Filled`} defaultValue="Input text" caption="Caption text" counter maxLength={100} />,
      <Textarea key={`${size}-error`} size={size} label={`${size} / Error`} error="Error text" defaultValue="Input text" counter maxLength={100} />,
      <Textarea key={`${size}-disabled`} size={size} label={`${size} / Error + Disabled`} error="Error text" disabled defaultValue="Input text" counter maxLength={100} />,
      <Textarea key={`${size}-skeleton`} size={size} label="Label text" skeleton caption="Caption text" />,
      <Textarea key={`${size}-skeleton-filled`} size={size} label="Label text" skeleton defaultValue="Input text" caption="Caption text" counter />,
    ])}
  </div>,
};
