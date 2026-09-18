import type { Meta, StoryObj } from '@storybook/react-vite';
import { borderTokens, depthTokens, elementTokens, radiusTokens, responsiveTokens, spacingTokens } from '../styles/token-catalog';
import { Page, TokenList } from './atoms-helpers';

const meta = {
  title: 'Atoms/Size',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Foundation-слой размеров и геометрии. Здесь собраны Space, Radius, Depth, Elements, Border и Responsive токены. Компоненты должны ссылаться на эти значения, а не дублировать пиксели в локальных стилях.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const listStory = (title: string, tokens: readonly { token: string; value: number }[]): Story => ({
  render: () => (
    <Page title={title}>
      <TokenList tokens={tokens} />
    </Page>
  ),
});

export const Space: Story = listStory('Space', spacingTokens);
export const Radius: Story = listStory('Radius', radiusTokens);
export const Depth: Story = listStory('Depth', depthTokens);
export const Elements: Story = listStory('Elements', elementTokens);
export const Border: Story = listStory('Border', borderTokens);
export const Responsive: Story = listStory('Responsive', responsiveTokens);
