import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeCalendar } from '../components/Calendar/RangeCalendar';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';

const OCTOBER_2026 = new Date(2026, 9, 1);

const meta = {
  title: 'Components/DateTime/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs('RangeCalendar') + qualityDocs('RangeCalendar'),
      },
    },
  },
  args: {
    defaultVisibleMonth: OCTOBER_2026,
    defaultValue: {
      start: new Date(2026, 9, 10),
      end: new Date(2026, 9, 20),
    },
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    visibleMonth: { control: false },
    defaultVisibleMonth: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    isDateDisabled: { control: false },
    minRange: { control: { type: 'number', min: 1 } },
    maxRange: { control: { type: 'number', min: 1 } },
    months: { control: 'radio', options: ['responsive', 1, 2] },
    showActions: { control: 'boolean' },
    applyText: { control: 'text' },
    cancelText: { control: 'text' },
  },
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { defaultValue: { start: null, end: null } },
};

export const SingleMonth: Story = {
  args: { months: 1 },
};

export const WithoutActions: Story = {
  args: { showActions: false },
};

export const WithLimits: Story = {
  args: {
    minDate: new Date(2026, 9, 5),
    maxDate: new Date(2026, 10, 20),
  },
};

export const MinRange: Story = {
  args: {
    defaultValue: { start: null, end: null },
    minRange: 3,
  },
};
