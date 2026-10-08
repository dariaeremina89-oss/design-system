import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/storybook.css';
import { initializePrimaryTheme } from '../src/styles/primary-theme-store';
import { ThemeDocsContainer } from './ThemeDocsContainer';
import { resolveStoryCheckDescription } from '../src/docs/story-check';
initializePrimaryTheme();

const preview: Preview = {
  decorators: [
    (Story, context) => {
      if (context.viewMode !== 'story' || context.parameters.storyCheck === false) return Story();

      const description = resolveStoryCheckDescription(
        context.name,
        context.parameters.storyCheck,
        context.parameters.docs?.description?.story,
      );

      return createElement(
        'div',
        { className: 'fdoc-story-stage' },
        createElement(
          'div',
          { className: 'fdoc-story-check', 'data-testid': 'story-check' },
          createElement('div', { className: 'fdoc-story-check__label' }, 'Что проверяем'),
          createElement('div', { className: 'fdoc-story-check__text' }, description),
        ),
        createElement('div', { className: 'fdoc-story-stage__content' }, Story()),
      );
    },
  ],
  parameters: {
    layout: 'centered',
    options: {
      storySort: { order: ["General",["Overview","Variables",["Colors",["Background colors","Border colors","Color primitives","Icon colors","Text colors"],"Shadows","Sizes"],"Typography","Icons","Layers","Custom Branding","Custom Branding Brand-safe","Changelog"],"Components",["Actions",["Button","ButtonFAB","ButtonIcon","ButtonLink","ButtonToggle","Link"],"Inputs",["CodeInput","Input","MultipleFileInput","PhoneInput","PriceInput","Search","SingleFileInput","Textarea"],"Selection",["AsyncAutocomplete","AsyncMultiselect","Autocomplete","Checkbox","CheckboxGroup","Chips","ChipsGroup","Dropdown","ItemRow","Menu","Multiselect","Radio","RadioGroup","Select","Switch","SwitchGroup"],"Navigation",["Accordion","AccordionGroup","Breadcrumbs","Carousel","Pagination","Tabs"],"DateTime",["Calendar","DatePicker","RangeCalendar"],"Overlays",["BottomSheet","Dialog","Tooltip"],"Indicators",["Badge","CircularProgress","LinearProgress"],"Elements",["Divider","FileRow",["Docs","Default","Leading Content","Additional Content","Trailing Actions","States","Messages","Additional Content Disabled","Skeleton","Menu","Reorderable","Long File Name With Chips"],"Highlight","Icon","InfoBlock","Skeleton","Snackbar"]]], },
    },
    controls: {
      expanded: true,
    },
    docs: {
      container: ThemeDocsContainer,
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
