import type { Meta, StoryObj } from '@storybook/react-vite';
import { semanticColorTokens } from '../styles/token-catalog';
import { ColorGrid, Page } from './atoms-helpers';
const meta = { title: 'General/Variables/Colors/Icon colors', parameters: { layout: 'padded' }, tags: ['autodocs'] } satisfies Meta;
export default meta;
export const Tokens: StoryObj<typeof meta> = {
  render: () => <Page title="Icon colors"><ColorGrid tokens={semanticColorTokens.filter(({ token }) => token.startsWith('--icon-') || token.startsWith('--transparent-icon-'))} /></Page>,
};
