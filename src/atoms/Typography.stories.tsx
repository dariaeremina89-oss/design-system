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
  tags: ['autodocs', 'ready'],
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
      {['font-family', 'font-weight', 'font-style', 'font-size', 'line-height', 'text-decoration'].map((group) => (
        <section key={group} className="fdoc-atoms__subsection" aria-labelledby={`typography-${group}`}>
          <h2 id={`typography-${group}`}>{group}</h2>
          <TokenList tokens={typographyPrimitiveTokens.filter(({ token }) => token.startsWith(`--${group}-`))} />
        </section>
      ))}
    </Page>
  ),
};

export const Styles: Story = {
  render: () => (
    <Page title="Page typography styles → primitives">
      {(['desktop', 'mobile'] as const).map((platform) => (
      <section key={platform} className="fdoc-atoms__subsection" aria-labelledby={`typography-${platform}`}>
        <h2 id={`typography-${platform}`}>{platform === 'desktop' ? 'Desktop' : 'Mobile'}</h2>
        {typographyTokens.map((item) => {
          const base = pageStyleReferences[item.token];
          const mobile = platform === 'mobile';
          // Pin both previews to their platform so resizing the viewport does not change Desktop into Mobile.
          const style = mobile ? {
            family: base.family.replace(')', '-mobile)'),
            weight: base.weight.replace(')', '-mobile)'),
            size: base.size.replace(')', '-mobile)'),
            lineHeight: base.lineHeight.replace(')', '-mobile)'),
          } : { ...base, size: item.references.size, lineHeight: item.references.lineHeight };

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
                <span>{mobile ? item.mobileSize : item.size}/{mobile ? item.mobileLineHeight : item.lineHeight} px</span>
                <code>page style → {style.family} · weight → {style.weight}</code>
                <code>size → {style.size} · line-height → {style.lineHeight}</code>
              </div>
            </div>
          );
        })}
      </section>
      ))}
    </Page>
  ),
};
