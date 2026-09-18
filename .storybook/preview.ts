import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/storybook.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: (a, b) => {
        const sidebarOrder = [
          'Atoms/Docs',
          'Atoms/Colors',
          'Atoms/Typography',
          'Atoms/Effects',
          'Atoms/Size',
          'Atoms/Icons',
          'Atoms/Skeleton',
          'Components/Buttons',
          'Components/Inputs',
          'Components/Badge',
          'Components/Progress Indicators',
        ];
        const rank = (title) => {
          const index = sidebarOrder.findIndex(
            (item) => title === item || title.startsWith(`${item}/`),
          );
          return index === -1 ? sidebarOrder.length : index;
        };

        const rankDifference = rank(a.title) - rank(b.title);
        return rankDifference || a.title.localeCompare(b.title);
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
