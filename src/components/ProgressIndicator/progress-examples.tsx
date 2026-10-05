import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ProgressIndicator,
  type ProgressIndicatorAnimation,
  type ProgressIndicatorColor,
  type ProgressIndicatorMode,
  type ProgressIndicatorType,
} from './ProgressIndicator';

const meta = {
  title: 'Components/Progress Indicators/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: coreDocs('ProgressIndicator') + qualityDocs('ProgressIndicator'),
      },
    },
  },
  args: {
    type: 'linear',
    mode: 'determinate',
    value: 60,
    max: 100,
    size: 24,
    strokeWidth: 2,
    variant: 'primary',
    duration: 1500,
    animation: 'linear',
  },
  argTypes: {
    type: { control: 'radio', options: ['linear', 'circular'] },
    mode: { control: 'radio', options: ['determinate', 'indeterminate'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, step: 1 } },
    size: { control: { type: 'number', min: 1, step: 1 } },
    strokeWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 } },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    color: { control: false, description: 'Deprecated alias for variant.' },
    duration: { control: { type: 'range', min: 500, max: 4000, step: 100 } },
    animation: {
      control: 'select',
      options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'] satisfies ProgressIndicatorAnimation[],
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <ProgressIndicator {...args} />
    </div>
  ),
};

export const CircularProps: Story = {
  args: {
    type: 'circular',
    mode: 'indeterminate',
    size: 24,
    strokeWidth: 2,
    variant: 'primary',
    duration: 1400,
    animation: 'linear',
  },
  render: (args) => <ProgressIndicator {...args} />,
};

export const LinearProps: Story = {
  args: {
    type: 'linear',
    mode: 'indeterminate',
    value: 0,
    max: 100,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressIndicator {...args} />
    </div>
  ),
};

export const LinearModes: Story = {
  render: () => (
    <div style={{ display: 'grid', width: 320, gap: 24 }}>
      <ProgressIndicator type="linear" mode="determinate" value={60} />
      <ProgressIndicator type="linear" mode="indeterminate" />
    </div>
  ),
};

export const CircularModes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <ProgressIndicator type="circular" mode="determinate" value={60} />
      <ProgressIndicator type="circular" mode="indeterminate" />
    </div>
  ),
};

export const CircularColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 16, background: 'var(--neutral-900)' }}>
      {(['primary', 'secondary', 'tertiary'] as ProgressIndicatorColor[]).map((variant) => (
        <ProgressIndicator
          key={variant}
          type="circular"
          mode="indeterminate"
          variant={variant}
          aria-label={`${variant} loading`}
        />
      ))}
    </div>
  ),
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 320 }}>
      {(['linear', 'circular'] as ProgressIndicatorType[]).map((type) =>
        (['determinate', 'indeterminate'] as ProgressIndicatorMode[]).map((mode) => (
          <div key={`${type}-${mode}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 120 }}>{type} / {mode}</span>
            {type === 'linear' ? (
              <div style={{ flex: 1 }}><ProgressIndicator type={type} mode={mode} value={60} max={100} /></div>
            ) : (
              <ProgressIndicator type={type} mode={mode} value={60} />
            )}
          </div>
        )),
      )}
    </div>
  ),
};

