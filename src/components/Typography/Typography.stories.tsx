import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, type TypographyVariant } from './Typography';

const variants: TypographyVariant[] = [
  'h0-heading', 'h1-heading', 'h2-heading', 'h3-heading',
  'subtitle', 'body', 'caption', 'overline', 'code',
];

const description = `
**Typography** применяет именованный типографический стиль дизайн-системы к выбранному семантическому HTML-элементу. Foundation со всеми токенами остается в General / Typography; эта страница описывает React API компонента.

### API

- \`as\` задает HTML-тег независимо от визуального стиля: p / span / div / h1–h6;
- \`variant\` выбирает h0-heading / h1-heading / h2-heading / h3-heading / subtitle / body / caption / overline / code;
- \`strong\` включает Strong weight для не-heading вариантов;
- \`responsive\` разрешает существующий Mobile-размер того же page style. Внутри остальных компонентов responsive обычно не используется: их типографика фиксирована;
- обычные HTML attributes, className и style передаются корню.

### Поведение

Семантика и визуальный стиль не связаны жестко: например, \`as="h2" variant="h1-heading"\` остается heading второго уровня, но выглядит как H1 style. Компонент не добавляет интерактивность и не должен использоваться вместо Link/Button.

### Автотесты

Unit-тесты проверяют дефолты, независимость semantic tag от variant, Strong, responsive token references и переопределение test id. Все stories дополнительно участвуют в общем браузерном responsive-audit на 320 px.

### Селекторы для тестирования

| Селектор | Назначение |
| --- | --- |
| \`data-testid="typography"\` | Корень; можно переопределить. |
| \`data-typography\` | Фактический variant. |
| \`data-responsive\` | true / false. |
| \`data-strong\` | true / false. |
`;

const meta = {
  title: 'Components/Elements/Typography',
  component: Typography,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: description } },
  },
  args: {
    children: 'Пример текста',
    as: 'p',
    variant: 'body',
    strong: false,
    responsive: false,
  },
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    variant: { control: 'select', options: variants },
    strong: { control: 'boolean' },
    responsive: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 16 }}>
      {variants.map(variant => (
        <div key={variant} style={{ display: 'grid', gap: 4 }}>
          <code>{variant}</code>
          <Typography {...args} variant={variant}>{variant}</Typography>
        </div>
      ))}
    </div>
  ),
};

export const Strong: Story = {
  args: { variant: 'subtitle', strong: true },
};

export const SemanticTag: Story = {
  args: { as: 'h2', variant: 'h1-heading', children: 'H2 с визуальным стилем H1' },
};

export const ResponsivePageText: Story = {
  args: { variant: 'h1-heading', responsive: true, children: 'Responsive page heading' },
};
