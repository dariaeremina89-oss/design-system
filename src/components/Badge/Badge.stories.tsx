import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeColor, type BadgeSize, type BadgeState } from './Badge';

const meta = {
  title: 'Components/Indicators/Badge',
  id: 'components-badge',
  component: Badge,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: coreDocs('Badge') + qualityDocs('Badge'),
      },
    },
  },
  args: {
    size: 'medium',
    color: 'primary',
    state: 'default',
    text: '99+',
  },
  argTypes: {
    size: { control: 'select', options: ['smallest', 'small', 'medium', 'large', 'giant'] },
    color: { control: 'select', options: ['primary', 'secondary', 'inverse'] },
    state: { control: 'select', options: ['default', 'disabled', 'skeleton'] },
    text: { control: 'text' },
    children: { control: false },
    skeletonWidth: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['smallest', 'small', 'medium', 'large', 'giant'] as BadgeSize[]).map((size) => (
        <Badge {...args} key={size} size={size} text={size === 'smallest' ? undefined : '99+'} data-testid={`badge-${size}`} />
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['primary', 'secondary', 'inverse'] as BadgeColor[]).map((color) => (
        <Badge {...args} key={color} color={color} data-testid={`badge-${color}`} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['default', 'disabled', 'skeleton'] as BadgeState[]).map((state) => (
        <Badge {...args} key={state} state={state} data-testid={`badge-${state}`} />
      ))}
    </div>
  ),
};

export const Smallest: Story = {
  args: { size: 'smallest', text: undefined, 'aria-label': 'Есть новые уведомления' },
};

export const Skeleton: Story = {
  args: { state: 'skeleton' },
};

export const SkeletonAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['smallest', 'small', 'medium', 'large', 'giant'] as BadgeSize[]).map((size) => (
        <Badge key={size} size={size} state="skeleton" data-testid={`badge-skeleton-${size}`} />
      ))}
    </div>
  ),
};
