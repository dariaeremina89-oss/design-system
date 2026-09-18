import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/storybook.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: [
          ['Atoms', ['Docs', '*']],
          ['Components', '*'],
        ],
      },
    },
    controls: {
      expanded: true,
    },
    docs: {
      description: {
        component:
          'Это моя тестовая дизайн-система и личный плейбук для проверки токенов и компонентов. Это не официальная библиотека F.Doc и не production-пакет.',
      },
    },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
