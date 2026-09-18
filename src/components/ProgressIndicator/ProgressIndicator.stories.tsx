import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ProgressIndicator,
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
        component: `
**Progress Indicator** — неинтерактивный индикатор процесса для Linear и Circular вариантов.

Это тестовая дизайн-система и личный плейбук, а не официальная production-библиотека F.Doc. Визуальная истина для Linear — Figma node 4566:862, для Circular — 6646:2412.

### API

- type: linear / circular;
- mode: determinate / indeterminate;
- value: число от 0 до 100 только для determinate;
- color: primary / secondary / tertiary для Circular. Linear использует Primary-схему Figma.

Размеры задаются внешним контейнером: Linear занимает доступную ширину и имеет высоту 4 px, Circular занимает ширину и высоту внешнего контейнера. Внутренняя логика анимации общая и отключается при prefers-reduced-motion.

Компонент не кликабелен и не получает фокус. Determinate публикует aria-valuemin, aria-valuemax и aria-valuenow, Indeterminate — только роль и доступную подпись.
        `,
      },
    },
  },
  args: {
    type: 'linear',
    mode: 'determinate',
    value: 60,
    color: 'primary',
  },
  argTypes: {
    type: { control: 'radio', options: ['linear', 'circular'] },
    mode: { control: 'radio', options: ['determinate', 'indeterminate'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
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
      <div style={{ width: 24, height: 24 }}><ProgressIndicator type="circular" mode="determinate" value={60} /></div>
      <div style={{ width: 24, height: 24 }}><ProgressIndicator type="circular" mode="indeterminate" /></div>
    </div>
  ),
};

export const CircularColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 16, background: 'var(--neutral-900)' }}>
      {(['primary', 'secondary', 'tertiary'] as ProgressIndicatorColor[]).map((color) => (
        <div key={color} style={{ width: 24, height: 24 }}>
          <ProgressIndicator type="circular" mode="indeterminate" color={color} aria-label={`${color} loading`} />
        </div>
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
              <div style={{ flex: 1 }}><ProgressIndicator type={type} mode={mode} value={60} /></div>
            ) : (
              <div style={{ width: 24, height: 24 }}><ProgressIndicator type={type} mode={mode} value={60} /></div>
            )}
          </div>
        )),
      )}
    </div>
  ),
};
