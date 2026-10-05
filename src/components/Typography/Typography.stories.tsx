import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, type TypographyVariant } from './Typography';

const variants: TypographyVariant[] = [
  'h0-heading', 'h1-heading', 'h2-heading', 'h3-heading',
  'subtitle', 'body', 'caption', 'overline', 'code',
];


const meta = {
  title: 'Components/Elements/Typography',
  component: Typography,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: coreDocs('Typography') + qualityDocs('Typography') } },
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
