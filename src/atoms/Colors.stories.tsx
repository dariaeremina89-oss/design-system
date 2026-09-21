import type { Meta, StoryObj } from '@storybook/react-vite';
import { primitiveColorTokens } from '../styles/token-catalog';
import { ColorGrid, Page, groupName } from './atoms-helpers';

const meta = {
  title: 'General/Variables/Colors/Color primitives',
  id: 'atoms-colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Цветовой foundation-слой плейбука. Primitive colors содержат исходные значения, а Semantic colors ссылаются на primitives и используются компонентами. Отдельного уровня component tokens здесь нет.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primitiveGroups = [...new Set(primitiveColorTokens.map((item) => groupName(item.token, 1)))] as string[];

export const Primitive: Story = {
  render: () => (
    <Page title="Primitive colors">
      {primitiveGroups.map((group) => (
        <section key={group} className="fdoc-atoms__subsection">
          <h2>{group}</h2>
          <ColorGrid tokens={primitiveColorTokens.filter((item) => groupName(item.token, 1) === group)} />
        </section>
      ))}
    </Page>
  ),
};
