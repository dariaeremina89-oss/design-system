import { createElement } from 'react';
import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: {
    renderLabel: (item) => {
      if (item.type !== 'component' || !item.tags.includes('ready')) return item.name;

      return createElement('span', {
        style: { display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 },
      },
      createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, item.name),
      createElement('span', {
        role: 'img',
        'aria-label': 'Готов',
        title: 'Готов',
        'data-component-ready': item.id,
        style: { flexShrink: 0, fontSize: 14, fontWeight: 700, lineHeight: 1 },
      }, '✓'));
    },
  },
});
