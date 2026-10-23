import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '../components/DatePicker/DatePicker';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';
import { controlsParameters, pickFieldControls } from '../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'placeholder', 'caption', 'error',
  'size', 'manualInput', 'calendarSelection', 'disabled', 'skeleton', 'open', 'defaultOpen',
  'onValueChange', 'onOpenChange', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/DateTime/DatePicker',
  component: DatePicker,
  tags: ['autodocs', 'ready'],
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: {
        component: componentDocs('DatePicker') + qualityDocs('DatePicker'),
      },
    },
  },
  args: {
    label: 'Выберите дату',
    caption: 'Дата в формате ДД.ММ.ГГГГ',
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'placeholder', 'caption', 'error', 'size',
      'disabled', 'skeleton', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    manualInput: { control: 'boolean', description: 'Разрешает ручной ввод даты.', table: { category: 'Behavior' } },
    calendarSelection: { control: 'boolean', description: 'Показывает Calendar icon и разрешает выбор через Calendar.', table: { category: 'Behavior' } },
    value: { control: false },
    defaultValue: { control: false },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onValueChange: { action: 'value-change' },
    onOpenChange: { action: 'open-change' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: new Date(2026, 9, 23) },
};

export const Open: Story = {
  args: { defaultValue: new Date(2026, 9, 23), defaultOpen: true },
};

export const OpenWithButtons: Story = {
  args: {
    defaultValue: new Date(2026, 9, 23),
    defaultOpen: true,
    calendarProps: { showActions: true },
  },
};

export const ManualInputOnly: Story = {
  args: { calendarSelection: false },
};

export const CalendarOnly: Story = {
  args: { manualInput: false, defaultValue: new Date(2026, 9, 23) },
};

export const Error: Story = {
  args: { error: 'Проверьте дату', caption: undefined },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const Disabled: Story = {
  args: { defaultValue: new Date(2026, 9, 23), disabled: true },
};

export const Skeleton: Story = {
  args: { skeleton: true },
};
