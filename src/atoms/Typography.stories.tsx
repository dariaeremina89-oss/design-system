import type { Meta, StoryObj } from '@storybook/react-vite';
import { typographyPrimitiveTokens, typographyTokens } from '../styles/token-catalog';
import { Typography, type TypographyVariant } from '../components/Typography/Typography';
import { Skeleton } from '../components/Skeleton/Skeleton';
import { Button } from '../components/Button/Button';
import { Link } from '../components/Link/Link';
import { Page, TokenList } from './atoms-helpers';

const meta = {
  title: 'General/Typography',
  id: 'atoms-typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Типографический foundation-слой с двумя уровнями: primitive values для семейств, начертаний, размеров и line-height; page styles как именованные semantic-сборки для текста страницы. Только текст страницы использует мобильные размеры. В компонентах используются те же именованные стили с постоянными размерами. Typography с responsive включает существующий Mobile-вариант только для текста страницы.',
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
    <Page title="Typography styles">
      <div className="fdoc-atoms__type-scroll" role="region" aria-label="Сравнение типографики Desktop и Mobile" tabIndex={0}>
        <table className="fdoc-atoms__type-table" aria-label="Стили типографики">
          <thead>
            <tr>
              <th scope="col">Стиль</th>
              <th scope="col">Desktop</th>
              <th scope="col">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {typographyTokens.map((item) => (
              <tr key={item.token}>
                <th scope="row">
                  <span>{item.name}</span>
                  <code className="fdoc-atoms__label">{item.token}-*</code>
                </th>
                {(['desktop', 'mobile'] as const).map((platform) => {
                  const base = pageStyleReferences[item.token];
                  const mobile = platform === 'mobile';
                  // Keep each column tied to its platform at every viewport width.
                  const style = mobile ? {
                    family: base.family.replace(')', '-mobile)'),
                    weight: base.weight.replace(')', '-mobile)'),
                    size: base.size.replace(')', '-mobile)'),
                    lineHeight: base.lineHeight.replace(')', '-mobile)'),
                  } : { ...base, size: item.references.size, lineHeight: item.references.lineHeight };

                  return (
                    <td key={platform} data-platform={platform}>
                      <div className="fdoc-atoms__type-cell">
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
                          Aa — Аа
                        </div>
                        <div className="fdoc-atoms__type-meta">
                          <span>{mobile ? item.mobileSize : item.size}/{mobile ? item.mobileLineHeight : item.lineHeight} px</span>
                          <details>
                            <summary>Токены</summary>
                            <code>family → {style.family}</code>
                            <code>weight → {style.weight}</code>
                            <code>size → {style.size}</code>
                            <code>line-height → {style.lineHeight}</code>
                          </details>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  ),
};

export const Application: Story = {
  render: () => <Page title="Применение типографики">
    <p>Именованные стили едины. Только текст страницы с responsive переключается на Mobile. Размер текста в компонентах постоянный; ссылка с typography="inherit" следует за абзацем.</p>
    {typographyTokens.map(item => <section key={item.token}>
      <h2>{item.name}</h2>
      <Typography variant={item.token.slice(2) as TypographyVariant} data-testid={`fixed-${item.token.slice(2)}`}>
        Постоянный стиль — текст компонента
      </Typography>
      <Typography variant={item.token.slice(2) as TypographyVariant} responsive data-testid={`responsive-${item.token.slice(2)}`}>
        Текст страницы и <Link href="#details" typography="inherit">ссылка внутри абзаца</Link>{' '}<Skeleton shape="text" textSize="inherit" width="3em"/>
      </Typography>
    </section>)}
    <Typography as="div" variant="subtitle" responsive data-testid="responsive-container">
      <p>Адаптивный текст вокруг компонентов</p>
      <Button size="large">Действие</Button>{' '}
      <Link href="#details" size="large">Самостоятельная ссылка</Link>
    </Typography>
  </Page>,
};
