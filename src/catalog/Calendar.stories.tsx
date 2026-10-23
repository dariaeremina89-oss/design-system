import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '../components/Calendar/Calendar';
import { componentDocs } from '../docs/bulk-components';
import { qualityDocs } from '../docs/quality';

const OCTOBER_2026 = new Date(2026, 9, 15);

const meta = {
  title: 'Components/DateTime/Calendar',
  component: Calendar,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs('Calendar') + qualityDocs('Calendar'),
      },
    },
  },
  args: {
    defaultValue: OCTOBER_2026,
    defaultVisibleMonth: OCTOBER_2026,
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    visibleMonth: { control: false },
    defaultVisibleMonth: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    isDateDisabled: { control: false },
    view: { control: 'radio', options: ['date', 'month', 'year'] },
    defaultView: { control: 'radio', options: ['date', 'month', 'year'] },
    showActions: { control: 'boolean' },
    applyText: { control: 'text' },
    cancelText: { control: 'text' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Month: Story = {
  args: { defaultView: 'month' },
};

export const Year: Story = {
  args: { defaultView: 'year' },
};

export const WithoutActions: Story = {
  args: { showActions: false },
};

export const WithLimits: Story = {
  args: {
    minDate: new Date(2026, 9, 5),
    maxDate: new Date(2026, 9, 25),
  },
};

export const DisabledWeekends: Story = {
  args: {
    isDateDisabled: date => date.getDay() === 0 || date.getDay() === 6,
  },
};
