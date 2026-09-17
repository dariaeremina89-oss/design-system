import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames, type IconName } from '../components/Icon/Icon';
import { Skeleton as SkeletonBlock } from '../components/Skeleton/Skeleton';
import './atoms.css';

const meta = {
  title: 'Atoms',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const colorTokens = [
  '--background-base-default',
  '--background-base-secondary',
  '--background-base-tertiary',
  '--background-base-skeleton',
  '--background-primary-default',
  '--background-accent-default',
  '--background-success-default',
  '--background-warning-default',
  '--background-error-default',
  '--border-base-secondary',
  '--border-primary-default',
  '--border-error-default',
  '--text-base-default',
  '--text-base-secondary',
  '--text-primary-default',
  '--text-error-secondary',
  '--icon-base-default',
  '--icon-accent-default',
] as const;

const spacingTokens = ['--space-0', '--space-4', '--space-8', '--space-12', '--space-16'] as const;
const sizeTokens = [
  '--elements-16',
  '--elements-24',
  '--elements-32',
  '--size-input-small',
  '--size-input-medium',
  '--radius-small',
  '--radius-middle',
  '--radius-large',
  '--radius-full',
] as const;
const iconSamples: IconName[] = [
  'magnifying-glass',
  'cross',
  'caret',
  'eye',
  'eye-closed',
  'info_circle',
  'check',
  'currency/ruble-sign_regular',
  'multicolor/visa',
];

export const Colors: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Colors</h1>
      <div className="fdoc-atoms__swatches">
        {colorTokens.map((token) => (
          <div key={token} className="fdoc-atoms__swatch" style={{ background: `var(${token})` }}>
            <span>{token}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Typography</h1>
      <section className="fdoc-atoms__section">
        <div style={{ fontFamily: 'var(--font-family-base)', fontSize: 'var(--subtitle-size)', lineHeight: 'var(--subtitle-line-height)' }}>
          Subtitle · 16/24
          <span className="fdoc-atoms__label">--subtitle-size · --subtitle-line-height</span>
        </div>
        <div style={{ fontFamily: 'var(--font-family-base)', fontSize: 'var(--body-size)', lineHeight: 'var(--body-line-height)' }}>
          Body · 15/22
          <span className="fdoc-atoms__label">--body-size · --body-line-height</span>
        </div>
        <div style={{ fontFamily: 'var(--font-family-base)', fontSize: 'var(--caption-size)', lineHeight: 'var(--caption-line-height)' }}>
          Caption · 12/16
          <span className="fdoc-atoms__label">--caption-size · --caption-line-height</span>
        </div>
      </section>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Spacing</h1>
      <div className="fdoc-atoms__tokens">
        {spacingTokens.map((token) => (
          <div key={token} className="fdoc-atoms__token">
            <div style={{ width: `var(${token})`, height: 24, background: 'var(--background-primary-default)' }} />
            <span className="fdoc-atoms__label">{token}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SizesAndRadii: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Sizes and radii</h1>
      <div className="fdoc-atoms__tokens">
        {sizeTokens.map((token) => (
          <div key={token} className="fdoc-atoms__token">
            <div style={{ width: `min(var(${token}), 160px)`, height: `min(var(${token}), 64px)`, background: 'var(--background-accent-default)', borderRadius: `var(${token})` }} />
            <span className="fdoc-atoms__label">{token}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Shadows</h1>
      <div className="fdoc-atoms__tokens">
        <div className="fdoc-atoms__token" style={{ boxShadow: 'var(--shadow-s)' }}>
          <span>--shadow-s</span>
        </div>
      </div>
    </div>
  ),
};

export const Icons: Story = {
  args: { name: 'magnifying-glass' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'number', min: 12, max: 64, step: 1 } },
    color: { control: 'color' },
    title: { control: 'text' },
  },
  render: (args) => (
    <div className="fdoc-atoms">
      <h1>Icons</h1>
      <div className="fdoc-atoms__icons">
        {iconSamples.map((name) => (
          <div key={name} className="fdoc-atoms__icon">
            <Icon name={name} />
            <span className="fdoc-atoms__label">{name}</span>
          </div>
        ))}
      </div>
      <div className="fdoc-atoms__icon">
        <Icon {...args} />
        <span className="fdoc-atoms__label">Selected from library</span>
      </div>
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Skeleton</h1>
      <div className="fdoc-atoms__section">
        <SkeletonBlock width="280px" height="16px" shape="text" />
        <SkeletonBlock width="100%" height="56px" />
        <SkeletonBlock width="48px" height="48px" shape="circle" />
      </div>
    </div>
  ),
};
