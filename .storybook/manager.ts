import { createElement } from 'react';
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import { MODE_STORAGE_KEY, readColorMode } from '../src/styles/theme-preference';

function syncTheme() {
  const mode=readColorMode();
  document.documentElement.dataset.colorMode=mode;
  addons.setConfig({theme:mode==='dark'?themes.dark:themes.light});
}
syncTheme();
window.addEventListener('storage',event=>{if(event.key===MODE_STORAGE_KEY||event.key===null)syncTheme();});

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
