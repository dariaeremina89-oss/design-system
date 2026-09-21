import type { Meta, StoryObj } from '@storybook/react-vite';
import { semanticColorTokens } from '../styles/token-catalog';
import { ColorGrid, Page } from './atoms-helpers';
const meta = { title: 'General/Variables/Colors/Border colors', parameters: { layout: 'padded' }, tags: ['autodocs'] } satisfies Meta;
export default meta;
export const Tokens: StoryObj<typeof meta> = {
  render: () => <Page title="Border colors"><ColorGrid tokens={semanticColorTokens.filter(({ token }) => token.startsWith('--border-') || token.startsWith('--transparent-border-'))} /></Page>,
};
