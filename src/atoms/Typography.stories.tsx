import type { Meta, StoryObj } from '@storybook/react-vite';
import { typographyPrimitiveTokens, typographyTokens } from '../styles/token-catalog';
import { Page, TokenList } from './atoms-helpers';

const meta = {
  title: 'Atoms/Typography',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primitive: Story = {
  render: () => (
    <Page title="Typography primitives">
      <TokenList tokens={typographyPrimitiveTokens} />
    </Page>
  ),
};

export const Styles: Story = {
  render: () => (
    <Page title="Typography styles → primitives">
      <section className="fdoc-atoms__section">
        {typographyTokens.map((item) => (
          <div key={item.name} className="fdoc-atoms__type-row">
            <div
              className="fdoc-atoms__type-sample"
              style={{ fontFamily: item.family, fontSize: item.size, lineHeight: `${item.lineHeight}px`, fontWeight: item.weight }}
            >
              Aa — {item.name}
            </div>
            <div className="fdoc-atoms__type-meta">
              <span>{item.token}-*</span>
              <span>Desktop {item.size}/{item.lineHeight} · Mobile {item.mobileSize}/{item.mobileLineHeight}</span>
              <code>family → {item.references.family} · weight → {item.references.weight}</code>
              <code>size → {item.references.size} · line-height → {item.references.lineHeight}</code>
            </div>
          </div>
        ))}
      </section>
    </Page>
  ),
};
