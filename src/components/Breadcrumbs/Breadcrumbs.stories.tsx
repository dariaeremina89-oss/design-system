import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { componentDocs } from '../../docs/bulk-components';
import { qualityDocs } from '../../docs/quality';

const deepItems = [
  { label: 'Главная', href: '#home' },
  { label: 'Компания', href: '#company' },
  { label: 'Документы', href: '#documents' },
  { label: 'Договоры на оказание услуг', href: '#contracts' },
  { label: 'Договор с длинным названием без ручного сокращения' },
];

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs', 'ready'],
  parameters: { layout: 'padded', docs: { description: { component: componentDocs('Breadcrumbs') + qualityDocs('Breadcrumbs') } } },
  args: {
    items: [
      { label: 'Документы', href: '#documents' },
      { label: 'Шаблоны', href: '#templates' },
      { label: 'Создание шаблона' },
    ],
  },
  argTypes: {
    items: { control: 'object' },
    isLoading: { control: 'boolean' },
    'aria-label': { control: 'text', description: 'Доступное название навигационной цепочки.' },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Deep: Story = { args: { items: deepItems } };
export const NarrowContainer: Story = {
  args: { items: deepItems },
  render: args => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <Breadcrumbs {...args} />
    </div>
  ),
};
export const Skeleton: Story = { args: { isLoading: true } };
