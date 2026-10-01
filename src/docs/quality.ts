type QualityInfo = {
  unit: string;
  browser?: string;
  selectors: Array<[string, string]>;
};

const sharedResponsive = 'tests/visual/responsive-overflow.visual.spec.ts';

export const componentQuality = {
  Icon: { unit: 'src/components/Icon/Icon.test.tsx', browser: 'tests/visual/atoms.visual.spec.ts', selectors: [['data-icon', 'Имя библиотечной иконки'], ['data-testid', 'Опциональный пользовательский ID']] },
  Skeleton: { unit: 'src/components/Skeleton/Skeleton.test.tsx', browser: 'tests/visual/text-skeleton.visual.spec.ts', selectors: [['data-testid="skeleton"', 'Корень Skeleton'], ['data-text-size', 'Типографический размер текстового Skeleton']] },
  Badge: { unit: 'src/components/Badge/Badge.test.tsx', browser: 'tests/visual/badge.visual.spec.ts', selectors: [['data-testid="badge"', 'Корень Badge'], ['data-badge-size / color / state', 'Размер, цвет и состояние']] },
  ProgressIndicator: { unit: 'src/components/ProgressIndicator/ProgressIndicator.test.tsx', browser: 'tests/visual/progress-indicator.visual.spec.ts', selectors: [['role="progressbar"', 'Корень индикатора'], ['data-progress-type / mode / variant', 'Тип, режим и цветовая схема']] },
  Input: { unit: 'src/components/Input/Input.test.tsx', browser: 'tests/visual/input.visual.spec.ts', selectors: [['data-testid="input"', 'Корневая обертка'], ['data-testid="input-control"', 'Нативный input']] },
  PhoneInput: { unit: 'src/components/PhoneInput/PhoneInput.test.tsx', browser: 'tests/visual/phone-input.visual.spec.ts', selectors: [['role="textbox"', 'Нативное поле телефона'], ['data-testid', 'Наследуется от Input при передаче']] },
  ButtonIcon: { unit: 'src/components/ButtonIcon/ButtonIcon.test.tsx', browser: 'tests/visual/button-icon.visual.spec.ts', selectors: [['data-testid="button-icon"', 'Корень'], ['data-button-icon-state / size', 'Состояние и размер']] },
  Button: { unit: 'src/components/Button/Button.test.tsx', browser: 'tests/visual/button.visual.spec.ts', selectors: [['data-testid="button"', 'Корень'], ['data-button-state / size / loading', 'Состояние, размер и Loading']] },
  Textarea: { unit: 'src/components/Textarea/Textarea.test.tsx', browser: 'tests/visual/textarea.visual.spec.ts', selectors: [['data-testid="textarea"', 'Корень'], ['data-testid="textarea-control"', 'Нативный textarea']] },
  ButtonFAB: { unit: 'src/components/ButtonFAB/ButtonFAB.test.tsx', browser: 'tests/visual/button-fab.visual.spec.ts', selectors: [['data-testid="button-fab"', 'Корень'], ['data-button-fab-state / position', 'Состояние и режим размещения']] },
  Link: { unit: 'src/components/Link/Link.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="link"', 'Link'], ['aria-disabled', 'Disabled-состояние']] },
  ButtonLink: { unit: 'src/components/Link/Link.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="button"', 'ButtonLink'], ['disabled', 'Disabled-состояние']] },
  ButtonToggle: { unit: 'src/components/ButtonToggle/ButtonToggle.test.tsx', browser: 'tests/visual/adaptive-stress.visual.spec.ts', selectors: [['role="radiogroup"', 'Корень переключателя'], ['role="radio"', 'Сегменты'], ['role="combobox"', 'Responsive Select fallback']] },
  Divider: { unit: 'src/components/Divider/Divider.test.tsx', browser: 'tests/visual/divider.visual.spec.ts', selectors: [['data-testid="divider"', 'Корень'], ['data-divider-orientation / inset', 'Ориентация и inset']] },
  Checkbox: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="checkbox"', 'Нативный control'], ['aria-invalid / aria-describedby', 'Ошибка и описание']] },
  Radio: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="radio"', 'Нативный control'], ['aria-invalid / aria-describedby', 'Ошибка и описание']] },
  Switch: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="switch"', 'Нативный control'], ['aria-invalid / aria-describedby', 'Ошибка и описание']] },
  CheckboxGroup: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['fieldset', 'Корень группы'], ['role="checkbox"', 'Опции']] },
  RadioGroup: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="radiogroup"', 'Корень группы'], ['role="radio"', 'Опции']] },
  SwitchGroup: { unit: 'src/components/SelectionControl/SelectionControl.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['fieldset', 'Корень группы'], ['role="switch"', 'Опции']] },
  Tooltip: { unit: 'src/components/Tooltip/Tooltip.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['role="tooltip"', 'Portal подсказки'], ['aria-describedby', 'Связь с trigger']] },
  Accordion: { unit: 'src/components/Accordion/Accordion.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['button[aria-expanded]', 'Header'], ['role="region"', 'Раскрытый Content']] },
  Breadcrumbs: { unit: 'src/components/Breadcrumbs/Breadcrumbs.test.tsx', browser: 'tests/visual/adaptive-stress.visual.spec.ts', selectors: [['nav', 'Корень навигации'], ['aria-current="page"', 'Текущий уровень']] },
  Tabs: { unit: 'src/components/Tabs/Tabs.test.tsx', browser: 'tests/visual/tabs.visual.spec.ts', selectors: [['role="tablist"', 'Корень'], ['role="tab"', 'Вкладки'], ['role="tabpanel"', 'Активная панель']] },
  Pagination: { unit: 'src/components/Pagination/Pagination.test.tsx', browser: 'tests/visual/bulk-components.visual.spec.ts', selectors: [['nav', 'Корень навигации'], ['aria-current="page"', 'Текущая страница']] },
  Typography: { unit: 'src/components/Typography/Typography.test.tsx', browser: 'tests/visual/typography-context.visual.spec.ts', selectors: [['data-testid="typography"', 'Корень'], ['data-typography / responsive / strong', 'Стиль и модификаторы']] },
  Search: { unit: 'src/components/Search/Search.test.tsx', browser: 'tests/visual/selection-menus.visual.spec.ts', selectors: [['role="textbox"', 'Поле запроса'], ['role="button"', 'Кнопка поиска']] },
  ItemRow: { unit: 'src/components/ItemRow/ItemRow.test.tsx', browser: 'tests/visual/selection-menus.visual.spec.ts', selectors: [['data-testid="item-row"', 'Корень'], ['data-variant / data-state', 'Вариант и состояние']] },
  Menu: { unit: 'src/components/Menu/Menu.test.tsx', browser: 'tests/visual/selection-menus.visual.spec.ts', selectors: [['role="menu" / role="listbox"', 'Корень'], ['role="menuitem" / role="option"', 'Интерактивные строки']] },
  Dropdown: { unit: 'src/components/Menu/Dropdown.test.tsx', browser: 'tests/visual/dropdown-hover.visual.spec.ts', selectors: [['aria-haspopup', 'Trigger'], ['aria-expanded', 'Состояние раскрытия'], ['role="menu"', 'Popup']] },
  Select: { unit: 'src/components/Select/Select.test.tsx', browser: 'tests/visual/selection-menus.visual.spec.ts', selectors: [['role="combobox"', 'Поле выбора'], ['role="listbox"', 'Menu'], ['role="option"', 'Опции']] },
  Multiselect: { unit: 'src/components/Multiselect/Multiselect.test.tsx', browser: 'tests/visual/multiselect.visual.spec.ts', selectors: [['role="combobox"', 'Поле выбора'], ['role="listbox"', 'Menu'], ['role="option"', 'Опции']] },
  Autocomplete: { unit: 'src/components/Autocomplete/Autocomplete.test.tsx', browser: 'tests/visual/autocomplete.visual.spec.ts', selectors: [['role="combobox"', 'Поле'], ['aria-activedescendant', 'Активная опция'], ['role="option"', 'Результаты']] },
  AsyncAutocomplete: { unit: 'src/components/Autocomplete/AsyncAutocomplete.test.tsx', browser: 'tests/visual/autocomplete.visual.spec.ts', selectors: [['role="combobox"', 'Поле'], ['aria-busy', 'Асинхронная загрузка'], ['role="option"', 'Результаты']] },
  Chips: { unit: 'src/components/Chips/Chips.test.tsx', browser: 'tests/visual/chips.visual.spec.ts', selectors: [['data-testid="chips"', 'Корень'], ['data-color / data-state / data-interactive', 'Семантика и состояние']] },
  ChipsGroup: { unit: 'src/components/Chips/ChipsGroup.test.tsx', browser: 'tests/visual/chips.visual.spec.ts', selectors: [['data-testid="chips-group"', 'Корень'], ['data-selection-mode / size / shape / loading', 'Конфигурация группы']] },
  Highlight: { unit: 'src/components/Highlight/Highlight.test.tsx', browser: 'tests/visual/highlight.visual.spec.ts', selectors: [['mark', 'Подсвеченный фрагмент'], ['data-testid', 'Опциональный пользовательский ID']] },
  InfoBlock: { unit: 'src/components/InfoBlock/InfoBlock.test.tsx', browser: 'tests/visual/infoblock.visual.spec.ts', selectors: [['data-testid="info-block"', 'Корень'], ['role="status" / role="alert"', 'Семантическое сообщение, если задано']] },
  SingleFileInput: { unit: 'src/components/SingleFileInput/SingleFileInput.test.tsx', browser: 'tests/visual/single-file-input.visual.spec.ts', selectors: [['data-testid="single-file-input"', 'Пустое состояние'], ['role="button"', 'Выбор файла'], ['data-testid="single-file-input-skeleton"', 'Skeleton']] },
  FileRow: { unit: 'src/components/FileRow/FileRow.test.tsx', browser: 'tests/visual/file-row.visual.spec.ts', selectors: [['data-testid="file-row"', 'Корень'], ['data-testid="file-row-reorder-handle"', 'Reorder handle'], ['data-file-row-dragging', 'Drag source']] },
  Dropzone: { unit: 'src/components/Dropzone/Dropzone.test.tsx', browser: 'tests/visual/responsive-overflow.visual.spec.ts', selectors: [['data-testid="dropzone"', 'Корень'], ['data-testid="dropzone-skeleton"', 'Skeleton'], ['aria-invalid / aria-disabled', 'Валидация и Disabled']] },
  MultipleFileInput: { unit: 'src/components/MultipleFileInput/MultipleFileInput.test.tsx', browser: 'tests/visual/responsive-overflow.visual.spec.ts', selectors: [['data-testid="multiple-file-input"', 'Корень'], ['data-testid="multiple-file-input-group-error"', 'Ошибка группы'], ['data-testid="file-row-drop-indicator"', 'Reorder target']] },
} satisfies Record<string, QualityInfo>;

export type QualityComponentName = keyof typeof componentQuality;
export const qualityComponentNames = Object.keys(componentQuality) as QualityComponentName[];

export function qualityDocs(name: QualityComponentName): string {
  const item = componentQuality[name];
  const base = 'https://github.com/dariaeremina89-oss/design-system/blob/main/';
  const browser = item.browser ?? sharedResponsive;
  return `

## Автотесты

- Unit / DOM / CSS: [${item.unit}](${base}${item.unit}).
- Browser UI: [${browser}](${base}${browser}).
- Все Storybook stories дополнительно проходят общий [responsive/overflow audit](${base}${sharedResponsive}) на узкой ширине.

Это описание покрытия, а не статус последнего запуска. Актуальный результат смотрите в GitHub Actions.

## Селекторы для тестирования

Предпочитайте доступные роли и data-атрибуты из таблицы. CSS-классы используйте только для visual-contract тестов внутри дизайн-системы.

| Селектор | Назначение |
| --- | --- |
${item.selectors.map(([selector, purpose]) => `| \`${selector}\` | ${purpose} |`).join('\n')}
`;
}
