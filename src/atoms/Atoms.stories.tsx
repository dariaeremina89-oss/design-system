import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from '../components/Icon/Icon';
import { Skeleton as SkeletonBlock } from '../components/Skeleton/Skeleton';
import {
  borderTokens,
  colorTokens,
  depthTokens,
  effectTokens,
  elementTokens,
  primitiveColorTokens,
  radiusTokens,
  responsiveTokens,
  semanticColorTokens,
  spacingTokens,
  typographyPrimitiveTokens,
  typographyTokens,
} from '../styles/token-catalog';
import './atoms.css';

const meta = {
  title: 'Atoms',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const cssVar = (token: string) => `var(${token})`;

const TokenList = ({ tokens }: { tokens: readonly { token: string; value: string | number }[] }) => (
  <div className="fdoc-atoms__tokens">
    {tokens.map((item) => (
      <div key={item.token} className="fdoc-atoms__token">
        <span className="fdoc-atoms__label">{item.token}</span>
        <code>{String(item.value)}</code>
      </div>
    ))}
  </div>
);

const ColorGrid = ({ tokens }: { tokens: readonly { token: string; value: string }[] }) => (
  <div className="fdoc-atoms__swatches">
    {tokens.map((item) => (
      <div
        key={item.token}
        className={`fdoc-atoms__swatch${item.token.startsWith('--transparent-') ? ' fdoc-atoms__swatch--transparent' : ''}`}
        style={{ backgroundColor: cssVar(item.token) }}
      >
        <span>{item.token}</span>
        <code>{item.value}</code>
      </div>
    ))}
  </div>
);

export const Colors: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Colors</h1>
      <section className="fdoc-atoms__section">
        <h2>Primitive</h2>
        <ColorGrid tokens={primitiveColorTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Semantic</h2>
        <ColorGrid tokens={semanticColorTokens} />
      </section>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Typography</h1>
      <section className="fdoc-atoms__section">
        {typographyTokens.map((item) => (
          <div key={item.name} className="fdoc-atoms__type-row">
            <div
              className="fdoc-atoms__type-sample"
              style={{
                fontFamily: item.family,
                fontSize: item.size,
                lineHeight: `${item.lineHeight}px`,
                fontWeight: item.weight,
              }}
            >
              Aa — {item.name}
            </div>
            <div className="fdoc-atoms__type-meta">
              <span>{item.token}</span>
              <span>Desktop {item.size}/{item.lineHeight} · Mobile {item.mobileSize}/{item.mobileLineHeight}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="fdoc-atoms__section">
        <h2>Primitive type tokens</h2>
        <TokenList tokens={typographyPrimitiveTokens} />
      </section>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Spacing</h1>
      <TokenList tokens={spacingTokens} />
    </div>
  ),
};

export const SizesAndRadii: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Sizes, radii, depth and borders</h1>
      <section className="fdoc-atoms__section">
        <h2>Element sizes</h2>
        <TokenList tokens={elementTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Radii</h2>
        <TokenList tokens={radiusTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Depth</h2>
        <TokenList tokens={depthTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Borders</h2>
        <TokenList tokens={borderTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Responsive</h2>
        <TokenList tokens={responsiveTokens} />
      </section>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Shadows</h1>
      <div className="fdoc-atoms__shadow-grid">
        {effectTokens.map((item) => (
          <div key={item.token} className="fdoc-atoms__shadow-card" style={{ boxShadow: cssVar(item.token) }}>
            <span>{item.token}</span>
            <code>{item.value}</code>
          </div>
        ))}
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
        {iconNames.slice(0, 24).map((name) => (
          <div key={name} className="fdoc-atoms__icon">
            <Icon name={name} />
            <span className="fdoc-atoms__label">{name}</span>
          </div>
        ))}
      </div>
      <div className="fdoc-atoms__icon">
        <Icon {...args} />
        <span className="fdoc-atoms__label">Selected from icon library ({iconNames.length} icons)</span>
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
