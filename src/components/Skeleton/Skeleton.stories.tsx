import type { Meta, StoryObj } from '@storybook/react-vite';
import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import { Skeleton, type SkeletonShape, type SkeletonTextSize } from './Skeleton';

const textSizes: Exclude<SkeletonTextSize, 'inherit'>[] = [
  'h0-heading',
  'h1-heading',
  'h2-heading',
  'h3-heading',
  'subtitle',
  'body',
  'caption',
  'overline',
  'code',
];

const meta = {
  title: 'Components/Elements/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: coreDocs('Skeleton') + qualityDocs('Skeleton'),
      },
    },
  },
  args: {
    shape: 'rounded',
    width: 120,
    height: 32,
  },
  argTypes: {
    shape: { control: 'select', options: ['text', 'rounded', 'circle', 'icon'] satisfies SkeletonShape[] },
    width: { control: 'text', description: 'Ширина Skeleton: фиксированная или fluid.' },
    height: { control: 'text', description: 'Высота Skeleton: фиксированная или fluid.' },
    textSize: { control: 'select', options: [...textSizes, 'inherit'] },
    'data-testid': { control: 'text', description: 'Стабильный selector для автотестов.' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <Skeleton shape="rounded" width={120} height={32} data-testid="skeleton-rounded" />
      <Skeleton shape="circle" width={32} height={32} data-testid="skeleton-circle" />
      <Skeleton shape="icon" width={24} height={24} data-testid="skeleton-icon" />
      <Skeleton shape="text" width={120} textSize="body" data-testid="skeleton-text" />
    </div>
  ),
};

export const TextStyles: Story = {
  render: () => (
    <div style={{ display: 'grid', width: 'min(360px, 100%)', gap: 12 }}>
      {textSizes.map(size => (
        <div key={size} style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', alignItems: 'center', gap: 12 }}>
          <span>{size}</span>
          <Skeleton shape="text" width="100%" textSize={size} data-testid={`skeleton-${size}`} />
        </div>
      ))}
    </div>
  ),
};

export const FixedAndFluid: Story = {
  render: () => (
    <div style={{ display: 'grid', width: 'min(456px, 100%)', gap: 16 }}>
      <div>
        <div>Fixed 160 × 32</div>
        <Skeleton width={160} height={32} />
      </div>
      <div>
        <div>Fluid 100% × 48</div>
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  ),
};
