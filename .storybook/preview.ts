import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/storybook.css';
import { initializePrimaryTheme } from '../src/styles/primary-theme-store';
initializePrimaryTheme();

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: { order: ["General",["Overview","Variables",["Colors",["Background colors","Border colors","Color primitives","Icon colors","Text colors"],"Shadows","Sizes"],"Typography","Icons","Layers","Custom Branding","Changelog"],"Components",["Actions",["Button","ButtonFAB","ButtonIcon","ButtonLink","ButtonToggle","Link"],"Inputs",["CodeInput","Input","PhoneInput","PriceInput","Search","SingleFileInput","Textarea"],"Selection",["AsyncAutocomplete","Autocomplete","Checkbox","CheckboxGroup","Chips","ChipsGroup","Dropdown","ItemRow","Menu","Multiselect","Radio","RadioGroup","Select","Switch","SwitchGroup"],"Navigation",["Accordion","AccordionGroup","Breadcrumbs","Pagination","Tabs"],"DateTime",["Calendar","DatePicker","RangeCalendar"],"Overlays",["BottomSheet","Dialog","Tooltip"],"Indicators",["Badge","CircularProgress","LinearProgress"],"Elements",["Skeleton"]]], },
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
