import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from '../components/Icon/Icon';
import { Skeleton as SkeletonBlock } from '../components/Skeleton/Skeleton';
import {
  borderTokens,
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

const TokenList = ({ tokens }: { tokens: readonly { token: string; value: string | number; reference?: string }[] }) => (
  <div className="fdoc-atoms__tokens">
    {tokens.map((item) => (
      <div key={item.token} className="fdoc-atoms__token">
        <span className="fdoc-atoms__label">{item.token}</span>
        <code>{item.reference ? `→ ${item.reference}` : String(item.value)}</code>
      </div>
    ))}
  </div>
);

const ColorGrid = ({ tokens }: { tokens: readonly { token: string; value: string; reference?: string }[] }) => (
  <div className="fdoc-atoms__swatches">
    {tokens.map((item) => (
      <div
        key={item.token}
        className={`fdoc-atoms__swatch${item.token.startsWith('--transparent-') ? ' fdoc-atoms__swatch--transparent' : ''}`}
        style={{ backgroundColor: cssVar(item.token) }}
      >
        <span>{item.token}</span>
        {item.reference ? <code>→ {item.reference}</code> : <code>{item.value}</code>}
      </div>
    ))}
  </div>
);

export const Colors: Story = {
  render: () => (
    <div className="fdoc-atoms">
      <h1>Colors</h1>
      <section className="fdoc-atoms__section">
        <h2>Primitive colors</h2>
        <ColorGrid tokens={primitiveColorTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Semantic colors → primitives</h2>
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
        <h2>Typography styles</h2>
        {typographyTokens.map((item) => (
          <div key={item.name} className="fdoc-atoms__type-row">
            <div
              className="fdoc-atoms__type-sample"
              style={{ fontFamily: item.family, fontSize: item.size, lineHeight: `${item.lineHeight}px`, fontWeight: item.weight }}
            >
              Aa — {item.name}
            </div>
            <div className="fdoc-atoms__type-meta">
              <span>{item.token}</span>
              <span>Desktop {item.size}/{item.lineHeight} · Mobile {item.mobileSize}/{item.mobileLineHeight}</span>
              <code>family → {item.references.family} · size → {item.references.size} · line-height → {item.references.lineHeight}</code>
            </div>
          </div>
        ))}
      </section>
      <section className="fdoc-atoms__section">
        <h2>Typography primitives</h2>
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
      <h1>Sizes and radii</h1>
      <section className="fdoc-atoms__section">
        <h2>Space</h2>
        <TokenList tokens={spacingTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Radius</h2>
        <TokenList tokens={radiusTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Depth</h2>
        <TokenList tokens={depthTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Elements</h2>
        <TokenList tokens={elementTokens} />
      </section>
      <section className="fdoc-atoms__section">
        <h2>Border</h2>
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
      <h1>Effects</h1>
      <p className="fdoc-atoms__note">Effect styles are kept separately from Variables and mapped to frontend shadow tokens.</p>
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
