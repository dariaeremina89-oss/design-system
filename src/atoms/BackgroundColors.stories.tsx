import type { Meta, StoryObj } from '@storybook/react-vite';
import { semanticColorTokens } from '../styles/token-catalog';
import { ColorGrid, Page } from './atoms-helpers';
const meta = { title: 'General/Variables/Colors/Background colors', parameters: { layout: 'padded' }, tags: ['autodocs', 'ready'] } satisfies Meta;
export default meta;
export const Tokens: StoryObj<typeof meta> = {
  render: () => <Page title="Background colors"><ColorGrid tokens={semanticColorTokens.filter(({ token }) => token.startsWith('--background-') || token.startsWith('--transparent-background-'))} /></Page>,
};
