import type { Meta, StoryObj } from '@storybook/react-vite';
import { typographyPrimitiveTokens, typographyTokens } from '../styles/token-catalog';
import { Page, TokenList } from './atoms-helpers';

const meta = {
  title: 'General/Typography',
  id: 'atoms-typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Типографический foundation-слой с двумя уровнями: primitive values для семейств, начертаний, размеров и line-height; page styles как именованные semantic-сборки, которые применяются к тексту. На мобильных основной интерфейсный текст не уменьшается ниже системного минимума.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const pageStyleReferences: Record<string, {
  family: string;
  weight: string;
  size: string;
  lineHeight: string;
}> = {
  '--h0-heading': {
    family: 'var(--page-h0-heading-family)',
    weight: 'var(--page-h0-heading-weight)',
    size: 'var(--page-h0-heading-size)',
    lineHeight: 'var(--page-h0-heading-line-height)',
  },
  '--h1-heading': {
    family: 'var(--page-h1-heading-family)',
    weight: 'var(--page-h1-heading-weight)',
    size: 'var(--page-h1-heading-size)',
    lineHeight: 'var(--page-h1-heading-line-height)',
  },
  '--h2-heading': {
    family: 'var(--page-h2-heading-family)',
    weight: 'var(--page-h2-heading-weight)',
    size: 'var(--page-h2-heading-size)',
    lineHeight: 'var(--page-h2-heading-line-height)',
  },
  '--h3-heading': {
    family: 'var(--page-h3-heading-family)',
    weight: 'var(--page-h3-heading-weight)',
    size: 'var(--page-h3-heading-size)',
    lineHeight: 'var(--page-h3-heading-line-height)',
  },
  '--subtitle': {
    family: 'var(--page-subtitle-family)',
    weight: 'var(--page-subtitle-weight-base)',
    size: 'var(--page-subtitle-size)',
    lineHeight: 'var(--page-subtitle-line-height)',
  },
  '--body': {
    family: 'var(--page-body-family)',
    weight: 'var(--page-body-weight-base)',
    size: 'var(--page-body-size)',
    lineHeight: 'var(--page-body-line-height)',
  },
  '--caption': {
    family: 'var(--page-caption-family)',
    weight: 'var(--page-caption-weight-base)',
    size: 'var(--page-caption-size)',
    lineHeight: 'var(--page-caption-line-height)',
  },
  '--overline': {
    family: 'var(--page-overline-family)',
    weight: 'var(--page-overline-weight-base)',
    size: 'var(--page-overline-size)',
    lineHeight: 'var(--page-overline-line-height)',
  },
  '--code': {
    family: 'var(--page-code-family)',
    weight: 'var(--page-code-weight-base)',
    size: 'var(--page-code-size)',
    lineHeight: 'var(--page-code-line-height)',
  },
};

export const Primitive: Story = {
  render: () => (
    <Page title="Typography primitives">
      <TokenList tokens={typographyPrimitiveTokens} />
    </Page>
  ),
};

export const Styles: Story = {
  render: () => (
    <Page title="Page typography styles → primitives">
      <section className="fdoc-atoms__section">
        {typographyTokens.map((item) => {
          const style = pageStyleReferences[item.token];

          return (
            <div key={item.name} className="fdoc-atoms__type-row">
              <div
                className="fdoc-atoms__type-sample"
                style={{
                  fontFamily: style.family,
                  fontSize: style.size,
                  lineHeight: style.lineHeight,
                  fontWeight: style.weight,
                  ...(item.references.style ? { fontStyle: item.references.style } : {}),
                }}
              >
                Aa — {item.name}
              </div>
              <div className="fdoc-atoms__type-meta">
                <span>{item.token}-*</span>
                <span>Desktop {item.size}/{item.lineHeight} · Mobile {item.mobileSize}/{item.mobileLineHeight}</span>
                <code>page style → {style.family} · weight → {style.weight}</code>
                <code>size → {style.size} · line-height → {style.lineHeight}</code>
              </div>
            </div>
          );
        })}
      </section>
    </Page>
  ),
};
