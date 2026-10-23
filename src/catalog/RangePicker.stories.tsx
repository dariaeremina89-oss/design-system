import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangePicker } from '../components/DatePicker/RangePicker';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';
import { controlsParameters, pickFieldControls } from '../docs/story-controls';

const controlOrder = [
  'label', 'required', 'value', 'defaultValue', 'placeholder', 'caption', 'error',
  'size', 'manualInput', 'calendarSelection', 'minRange', 'maxRange', 'disabled', 'skeleton', 'open', 'defaultOpen',
  'onValueChange', 'onOpenChange', 'onFocus', 'onBlur', 'onKeyDown',
] as const;

const meta = {
  title: 'Components/DateTime/RangePicker',
  component: RangePicker,
  tags: ['autodocs', 'ready'],
  decorators: [Story => <div style={{ width: '100%', maxWidth: 456 }}><Story /></div>],
  parameters: {
    layout: 'padded',
    controls: controlsParameters(controlOrder),
    docs: {
      description: {
        component: componentDocs('RangePicker') + qualityDocs('RangePicker'),
      },
    },
  },
  args: {
    label: 'Выберите период',
    caption: 'Укажите начало и окончание периода',
  },
  argTypes: {
    ...pickFieldControls(
      'label', 'required', 'placeholder', 'caption', 'error', 'size',
      'disabled', 'skeleton', 'onFocus', 'onBlur', 'onKeyDown',
    ),
    manualInput: { control: 'boolean', description: 'Разрешает ручной ввод периода.', table: { category: 'Behavior' } },
    calendarSelection: { control: 'boolean', description: 'Показывает Calendar icon и разрешает выбор через RangeCalendar.', table: { category: 'Behavior' } },
    minRange: { control: { type: 'number', min: 1 }, description: 'Минимальная продолжительность периода в календарных днях.', table: { category: 'Behavior' } },
    maxRange: { control: { type: 'number', min: 1 }, description: 'Максимальная продолжительность периода в календарных днях.', table: { category: 'Behavior' } },
    value: { control: false },
    defaultValue: { control: false },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onValueChange: { action: 'value-change' },
    onOpenChange: { action: 'open-change' },
  },
} satisfies Meta<typeof RangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultValue: {
      start: new Date(2026, 9, 10),
      end: new Date(2026, 9, 20),
    },
  },
};

export const Open: Story = {
  args: {
    defaultOpen: true,
    defaultValue: {
      start: new Date(2026, 9, 10),
      end: new Date(2026, 9, 20),
    },
  },
};

export const Error: Story = {
  args: { error: 'Проверьте период', caption: undefined },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: {
      start: new Date(2026, 9, 10),
      end: new Date(2026, 9, 20),
    },
  },
};

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const ManualInputOnly: Story = {
  args: { calendarSelection: false },
};

export const CalendarOnly: Story = {
  args: { manualInput: false },
};
