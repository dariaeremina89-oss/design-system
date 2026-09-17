import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/storybook.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
    },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
