type TestingDocs = {
  unit: string;
  browser: string;
  gaps: string;
  selectors: Array<[string, string, string]>;
  unitFile?: string;
  browserFile?: string;
};

const docs: Record<string, TestingDocs> = {
  Button: {
    unit: 'Размеры и типографика; порядок icon → badge → text → badge → icon; скрытие четырех слотов; обновление текста; disabled и блокировка клика; loading вместо левой иконки; цвет и disabled-состояние вложенного Badge; цветовые токены; Skeleton; обрезка текста. CSS-проверки: типографические токены, внешняя рамка focus и отступы слотов.',
    browser: 'Четыре высоты; обе иконки и размеры Badge во всех размерах; размер шрифта; focus без изменения габаритов; радиус и однострочный текст; disabled; loading; фон и радиус Skeleton.',
    gaps: 'Нет полной матрицы всех цветов × состояний × размеров, проверки всех комбинаций переключателей, клавиатурной активации Enter/Space и отдельного axe-аудита Button.',
    selectors: [
      ['button / button-skeleton', 'Корень кнопки / Skeleton', 'По состоянию; заменяются пропсом data-testid.'],
      ['button-text', 'Текстовый слот', 'При наличии children или text; фиксированный ID.'],
      ['button-icon-left / button-icon-right', 'Слоты иконок', 'По контенту и showIconLeft/showIconRight; слева отсутствует при loading.'],
      ['button-badge-left / button-badge-right', 'Обертки Badge', 'По badgeLeft/badgeRight и showBadgeLeft/showBadgeRight; фиксированные ID.'],
      ['button-loading', 'Левый слот загрузки', 'При isLoading; внутри role=progressbar.'],
      ['data-button-state', 'Значение пропса state', 'default, hover, focused, pressed, disabled, skeleton. Не отражает автоматически наведение, disabled-пропс или loading.'],
      ['data-button-size', 'Высота в px', '32, 40, 48, 56; также в Skeleton.'],
      ['data-button-loading', 'Загрузка', 'true / false; отсутствует у Skeleton.'],
    ],
  },
  ButtonFAB: {
    unit: 'Нативная кнопка и доступное имя; одна декоративная иконка; ref; блокировка клика в Disabled; защита от случайного submit; portal и его удаление; Inline; неинтерактивный Skeleton; axe.',
    browser: 'Матрица четырех цветов и пяти состояний; размеры 64/40, padding, радиус и тень; внешний focus; Enter/Space; disabled вне Tab-порядка; Floating при прокрутке и на 375 px; Skeleton.',
    gaps: 'Нет проверки Safari/Firefox, экранного диктора и физических устройств с safe area; нет пиксельных эталонов.',
    selectors: [
      ['button-fab / button-fab-skeleton', 'Корень кнопки / Skeleton', 'Заменяются data-testid.'],
      ['data-button-fab-state', 'Принудительное состояние', 'default, hover, focused, pressed, disabled, skeleton.'],
      ['data-button-fab-position', 'Режим размещения', 'floating / inline.'],
      ['data-icon', 'Библиотечная иконка', 'Значение icon; отсутствует в Skeleton.'],
    ],
  },
  ButtonIcon: {
    unit: 'Матрица размеров кнопки и иконки; независимый iconSize; нативная кнопка; disabled без клика; произвольная иконка; токены цветовых схем; Neutral hover/pressed; неинтерактивный Skeleton и его вариант для tertiary/neutral.',
    browser: 'Все восемь цветов × пять состояний; реальные Hover/Pressed, сочетание с клавиатурным фокусом; внешняя рамка 4 px и стабильные размеры для всех шести размеров; принудительные состояния; disabled вне Tab-порядка; Enter/Space; все варианты Skeleton.',
    gaps: 'Нет отдельного axe-аудита, Safari/Firefox и пиксельных эталонов; цветовая матрица проверяется на размере Medium, геометрия фокуса — на всех размерах.',
    selectors: [
      ['button-icon / button-icon-skeleton', 'Корень кнопки / Skeleton', 'Заменяются пропсом data-testid.'],
      ['button-icon-skeleton-icon', 'Вложенный Skeleton иконки', 'Skeleton в tertiary/neutral; при custom data-testid: `<custom>-icon`.'],
      ['data-button-icon-state', 'Принудительное состояние', 'Значение state; не отслеживает фактическое наведение или отдельный disabled.'],
      ['data-button-icon-size', 'Размер кнопки в px', 'На обычной кнопке; отсутствует в Skeleton.'],
      ['data-icon', 'Вложенная библиотечная иконка', 'Значение icon; у произвольного iconView может отсутствовать.'],
    ],
  },
  Badge: {
    unit: 'Пять размеров; smallest без текста, точка 8 px в обертке 16 px; доступное имя и декоративный режим; отсутствие интерактивной роли; обновление текста; disabled-токены; общий Skeleton. CSS-проверки размеров, типографики, радиусов и токенов.',
    browser: 'Высоты по размерам; анатомия smallest; фон и радиус Skeleton.',
    gaps: 'Нет полной браузерной матрицы цветов/состояний, тестов переполнения длинного текста и отдельного axe-аудита.',
    selectors: [
      ['badge / badge-skeleton', 'Корень Badge / Skeleton', 'Заменяются пропсом data-testid.'],
      ['badge-skeleton-dot', 'Точка Skeleton', 'Только smallest + skeleton; при custom data-testid: `<custom>-dot`.'],
      ['data-badge-size', 'Размер', 'smallest, small, medium, large, giant.'],
      ['data-badge-color', 'Цветовая схема', 'primary, secondary, inverse. В Button может быть переопределена родителем.'],
      ['data-badge-state', 'Состояние', 'default, disabled, skeleton. В Button disabled синхронизируется с кнопкой.'],
    ],
  },
  ProgressIndicator: {
    unit: 'Determinate и ARIA-диапазон; ограничения value; custom max; indeterminate без aria-valuenow; variant и совместимый color; Secondary-токены; Linear всегда primary; отсутствие tabIndex; size, strokeWidth, duration, animation; style overrides. CSS-проверки токенов и наличия reduced-motion.',
    browser: 'Linear: высота, радиус, ARIA value. Circular: дефолт 24 px, толщина линии, одна дуга по длине штриха, неподвижный track и анимация indicator; реальные RGB для Secondary и Tertiary.',
    gaps: 'Нет пиксельного сравнения кадров анимации, полной матрицы произвольных размеров/толщин, браузерной проверки reduced-motion и всех easing-функций.',
    selectors: [
      ['data-testid (без дефолта)', 'Корень', 'Можно передать свой ID; встроенного значения нет. Основной селектор: role=progressbar.'],
      ['data-progress-type', 'Тип', 'linear / circular.'],
      ['data-progress-mode', 'Режим', 'determinate / indeterminate.'],
      ['data-progress-variant / data-progress-color', 'Фактическая цветовая схема', 'primary / secondary / tertiary; для Linear всегда primary.'],
    ],
  },
  Input: {
    unit: 'Анатомия и test IDs; связь label/input; error и required ARIA; описание и живой счетчик; отсутствие пустого description; очистка uncontrolled value; скрытие очистки в disabled; библиотечная иконка; анатомия Skeleton; axe для default. CSS-проверки токенов, Small, Focused и Error.',
    browser: 'Геометрия default; error-текст и рамка; focus-рамка; длинный контент; вложенные элементы Skeleton.',
    gaps: 'Нет полной проверки controlled-очистки, всех сочетаний error/disabled/required, разных типов input и полного a11y-аудита всех состояний.',
    selectors: [
      ['input', 'Корневая обертка', 'При data-testid="custom" становится custom-root.'],
      ['input-control', 'Нативное поле', 'Заменяется пропсом data-testid.'],
      ['input-field / input-content', 'Обертка поля / контента', 'Всегда вне Skeleton; фиксированные ID.'],
      ['input-label', 'Подпись', 'При непустом label.'],
      ['input-leading-icon / input-trailing-icon', 'Слоты иконок', 'Если соответствующий prop не undefined.'],
      ['input-description', 'Описание внутри поля', 'При непустом description.'],
      ['input-sum / input-sum-icon', 'Сумма / ее иконка', 'sum не undefined; иконка дополнительно требует sumIcon.'],
      ['input-clear', 'Кнопка очистки', 'clearable + непустое значение + не disabled.'],
      ['input-helper', 'Нижняя строка', 'При caption, error или counter.'],
      ['input-error / input-caption', 'Ошибка / подпись снизу', 'Ошибка имеет приоритет над caption.'],
      ['input-counter', 'Счетчик', 'counter не undefined/null/false/пустая строка.'],
      ['input-skeleton', 'Корень Skeleton', 'skeleton=true; заменяется data-testid без суффикса -root.'],
      ['input-skeleton-field / input-skeleton-content / input-skeleton-text', 'Поле / контент / полоска текста', 'Всегда в Skeleton.'],
      ['input-skeleton-label / input-skeleton-label-text', 'Обертка подписи / полоска', 'Skeleton + непустой label.'],
      ['input-skeleton-required', 'Маркер обязательности', 'Skeleton + label + required.'],
      ['input-skeleton-leading-icon / input-skeleton-leading-icon-shape', 'Левая иконка / форма', 'Skeleton + leadingIcon.'],
      ['input-skeleton-trailing-icon / input-skeleton-trailing-icon-shape', 'Правая иконка / форма', 'Skeleton + trailingIcon.'],
      ['input-skeleton-description', 'Полоска описания', 'Skeleton + непустой description.'],
      ['input-skeleton-sum / input-skeleton-sum-text', 'Сумма / полоска', 'Skeleton + непустой sum.'],
      ['input-skeleton-sum-icon / input-skeleton-sum-icon-shape', 'Иконка суммы / форма', 'Skeleton + непустой sum + sumIcon.'],
      ['input-skeleton-clear / input-skeleton-clear-icon', 'Очистка / вложенная форма ButtonIcon', 'Skeleton + clearable + непустое value/defaultValue.'],
      ['input-skeleton-helper', 'Нижняя строка', 'Skeleton + error/caption/counter.'],
      ['input-skeleton-helper-text / input-skeleton-helper-shape', 'Текст нижней строки / полоска', 'Skeleton + error или caption.'],
      ['input-skeleton-counter / input-skeleton-counter-shape', 'Счетчик / полоска', 'Skeleton + counter.'],
    ],
  },
  Textarea: {
    unit: 'Связь Label и поля; приоритет Error; внешние ARIA-описания; controlled/uncontrolled; переносы и вставка; счетчик и maxLength; required, disabled, readOnly; ref; Skeleton; axe для обычного поля и ошибки.',
    browser: 'Габариты Medium/Small; hover/focus/error/disabled и цвета; стабильность текста при focus; переносы на 320 px; вертикальная прокрутка; ручной resize и запрет в disabled; Tab; Skeleton и Docs.',
    gaps: 'Нет проверки Safari/Firefox, экранного диктора и пиксельных эталонов. Нативный маркер resize зависит от браузера.',
    selectors: [
      ['textarea / textarea-control', 'Корень / нативное поле', 'data-testid="custom" задает custom-root и custom.'],
      ['textarea-label / textarea-helper', 'Подпись / нижняя строка', 'По наличию содержимого.'],
      ['textarea-caption / textarea-error / textarea-counter', 'Подсказка / ошибка / счетчик', 'Ошибка заменяет caption.'],
      ['textarea-skeleton', 'Корень Skeleton', 'Заменяется data-testid.'],
      ['textarea-skeleton-field / textarea-skeleton-text', 'Область / полоска значения', 'Полоска только при непустом value/defaultValue.'],
      ['textarea-skeleton-label / textarea-skeleton-label-text', 'Подпись Skeleton', 'При непустом label.'],
      ['textarea-skeleton-helper / textarea-skeleton-helper-text / textarea-skeleton-helper-shape', 'Подсказка Skeleton', 'По наличию caption/error.'],
      ['textarea-skeleton-counter / textarea-skeleton-counter-shape', 'Счетчик Skeleton', 'При counter.'],
    ],
  },
  Skeleton: {
    unit: 'Дефолтный data-testid и переопределение; текстовый вариант с textSize; иконочная форма и размеры.',
    browser: 'Наличие caption, subtitle и icon в истории States. Проверка не сравнивает пиксели и не измеряет все типографические варианты.',
    gaps: 'Нет проверки всех форм/размеров, кадров shimmer и поведения reduced-motion в браузере.',
    selectors: [
      ['skeleton', 'Корень', 'Всегда; заменяется data-testid.'],
      ['data-text-size', 'Типографический размер', 'Только при textSize: h0-heading, h1-heading, h2-heading, h3-heading, subtitle, body, caption, overline.'],
    ],
  },
  Icon: {
    unit: 'Многослойный cursor рендерится как img, а не одноцветная маска.',
    browser: 'В истории Cursors есть img[data-icon="cursors/cursor"] с классом цветного ресурса.',
    gaps: 'Нет полного прогона всей библиотеки, сравнения SVG с Figma, матрицы размеров/цветов и тестов доступного имени для всех вариантов.',
    selectors: [
      ['data-icon', 'Корень иконки (span или img)', 'Всегда; значение равно name.'],
      ['data-testid (без дефолта)', 'Корень', 'Можно передать свой ID.'],
    ],
  },

  Accordion: {
    unit: 'Раскрытие/закрытие с клавиатуры, aria-expanded/aria-controls, скрытие содержимого из Tab-порядка, disabled, single/multiple поведение группы и axe.',
    browser: 'Геометрия и адаптивные отступы, single-open поведение AccordionGroup; общий viewport-audit на 320 px.',
    gaps: 'Нет скриншотных эталонов и полного прогона всех сочетаний size × state.',
    selectors: [
      ['role=button', 'Заголовок Accordion', 'aria-expanded и aria-controls отражают состояние.'],
      ['role=region', 'Раскрытая панель', 'Связана с trigger через aria-controls.'],
      ['.fdoc-accordion', 'Корень', 'CSS-класс для визуальных browser-тестов.'],
    ],
    unitFile: 'src/components/Accordion/Accordion.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  AccordionGroup: {
    unit: 'Single и multiple раскрытие, сохранение состояния элементов и доступная семантика через Accordion.',
    browser: 'Проверка единственного раскрытого элемента в default-группе и адаптив Accordion внутри группы.',
    gaps: 'Нет отдельного скриншотного эталона группы.',
    selectors: [
      ['role=button', 'Triggers элементов группы', 'Ищите по доступному имени title.'],
      ['role=region', 'Раскрытые панели', 'Присутствуют только у открытых элементов.'],
    ],
    unitFile: 'src/components/Accordion/Accordion.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  Autocomplete: {
    unit: 'Combobox, фильтрация, выбор option, clear, controlled/uncontrolled input, клавиатура и состояние списка.',
    browser: 'Геометрия popup, клавиатурная навигация, адаптив и переполнение длинных значений.',
    gaps: 'Нет проверки экранными дикторами и скриншотных эталонов.',
    selectors: [
      ['role=combobox', 'Поле ввода', 'Основной интерактивный селектор.'],
      ['role=listbox', 'Popup вариантов', 'Только когда список открыт.'],
      ['role=option', 'Вариант', 'selected/focused состояние через ARIA/data-state.'],
    ],
    unitFile: 'src/components/Autocomplete/Autocomplete.test.tsx',
    browserFile: 'tests/visual/autocomplete.visual.spec.ts',
  },
  AsyncAutocomplete: {
    unit: 'Асинхронная загрузка, debounce/обновление результатов, loading, выбор и клавиатурное управление.',
    browser: 'Использует те же browser-контракты popup/адаптива, что Autocomplete, плюс общий viewport-audit.',
    gaps: 'Нет сетевых e2e-сценариев с реальным backend и race-condition матрицы.',
    selectors: [
      ['role=combobox', 'Поле ввода', 'Основной интерактивный селектор.'],
      ['role=listbox / role=option', 'Список и варианты', 'Появляются после загрузки результатов.'],
      ['role=progressbar', 'Индикатор загрузки', 'При loading.'],
    ],
    unitFile: 'src/components/Autocomplete/AsyncAutocomplete.test.tsx',
    browserFile: 'tests/visual/autocomplete.visual.spec.ts',
  },
  Breadcrumbs: {
    unit: 'Ссылки, current item, compact/collapse логика и реакция на ResizeObserver.',
    browser: 'Схлопывание по ширине контейнера и viewport, длинный current item без горизонтального overflow.',
    gaps: 'Нет скриншотных эталонов и тестов очень больших уровней вложенности.',
    selectors: [
      ['role=navigation', 'Корень Breadcrumbs', 'Доступное имя: Навигационная цепочка.'],
      ['role=link', 'Переходы', 'Скрытые уровни удаляются из DOM в compact.'],
      ['[aria-current=page]', 'Текущий уровень', 'Последний элемент.'],
      ['data-compact', 'Режим адаптива', 'true в компактном режиме.'],
    ],
    unitFile: 'src/components/Breadcrumbs/Breadcrumbs.test.tsx',
    browserFile: 'tests/visual/adaptive-stress.visual.spec.ts',
  },
  ButtonToggle: {
    unit: 'Выбор значения, controlled/uncontrolled, клавиатурные стрелки и responsive fallback в Select.',
    browser: 'Длинные значения и узкий контейнер переключаются в Select; геометрия и выбор сохраняются.',
    gaps: 'Нет скриншотных эталонов для всех значений.',
    selectors: [
      ['role=radiogroup / role=radio', 'Desktop ButtonToggle', 'Используется когда сегменты помещаются.'],
      ['role=combobox', 'Responsive fallback Select', 'Появляется когда сегменты не помещаются.'],
      ['.fdoc-button-toggle-host', 'Адаптивный контейнер', 'Используется для browser-проверки overflow.'],
    ],
    unitFile: 'src/components/ButtonToggle/ButtonToggle.test.tsx',
    browserFile: 'tests/visual/adaptive-stress.visual.spec.ts',
  },
  Chips: {
    unit: 'Информационный и интерактивный режим, selection, remove, disabled, Skeleton, aria-pressed и события.',
    browser: 'Размеры/состояния/цвета и адаптивные кейсы; общий viewport-audit.',
    gaps: 'Нет полной матрицы всех цветов × состояний × иконок.',
    selectors: [
      ['chips', 'Корень Chips', 'Заменяется data-testid.'],
      ['role=button', 'Основное действие', 'Только interactive/selectable Chips.'],
      ['data-color / data-state / data-interactive', 'Фактическое отображение', 'Стабильные data-атрибуты корня.'],
    ],
    unitFile: 'src/components/Chips/Chips.test.tsx',
    browserFile: 'tests/visual/chips.visual.spec.ts',
  },
  ChipsGroup: {
    unit: 'Single/multiple selection, controlled/uncontrolled, roving focus, disabled, loading и axe.',
    browser: 'Группа проверяется вместе с Chips и общим 320 px viewport-audit.',
    gaps: 'Нет отдельного скриншотного эталона длинных наборов.',
    selectors: [
      ['chips-group', 'Корень группы', 'Стабильный data-testid.'],
      ['role=button', 'Chips внутри', 'Ищите по тексту Chips.'],
      ['data-selection-mode / data-size / data-shape / data-loading', 'Контракт группы', 'Стабильные data-атрибуты.'],
    ],
    unitFile: 'src/components/Chips/ChipsGroup.test.tsx',
    browserFile: 'tests/visual/chips.visual.spec.ts',
  },
  Divider: {
    unit: 'Ориентация, размер/длина и стабильные test IDs.',
    browser: 'Геометрия horizontal/vertical и токены.',
    gaps: 'Нет скриншотных эталонов.',
    selectors: [
      ['divider', 'Корень Divider', 'Дефолтный test ID.'],
      ['section-divider', 'Пример Divider в секции', 'Используется в unit/story кейсах.'],
    ],
    unitFile: 'src/components/Divider/Divider.test.tsx',
    browserFile: 'tests/visual/divider.visual.spec.ts',
  },
  Dropzone: {
    unit: 'Picker, keyboard, drag/drop только Files, повторный выбор, валидация форматов/количества/размеров, disabled и Skeleton.',
    browser: 'Адаптив/overflow всех stories и file-upload visual contract.',
    gaps: 'Нет e2e-проверки системного файлового диалога и реальных больших файлов.',
    selectors: [
      ['dropzone / dropzone-skeleton', 'Корень / Skeleton', 'Стабильные test IDs.'],
      ['role=button', 'Интерактивная зона', 'В активном состоянии.'],
      ['data-state', 'Визуальное состояние', 'Если задано компонентом.'],
    ],
    unitFile: 'src/components/Dropzone/Dropzone.test.tsx',
    browserFile: 'tests/visual/responsive-overflow.visual.spec.ts',
  },
  FileRow: {
    unit: 'Loading, Disabled, Error/Warning, preview, Additional/Trailing slots, Badge/Chips, delete/menu, drag handle, drag preview всей строки, keyboard reorder и Skeleton.',
    browser: 'Геометрия строки/Skeleton, длинное имя, Additional content и reorder feedback.',
    gaps: 'Нет pointer-based drag e2e на touch-устройствах и скриншотного diff drag-preview.',
    selectors: [
      ['file-row / file-row-skeleton', 'Корень строки / Skeleton', 'Стабильные test IDs.'],
      ['file-row-reorder-handle', 'Drag handle', 'Только reorderable.'],
      ['file-row-drop-indicator', 'Индикатор места вставки', 'Во время reorder в группе.'],
      ['data-file-row-dragging', 'Текущая перетаскиваемая строка', 'true только во время drag.'],
      ['role=alert / role=status', 'Error / Warning message', 'По типу message.'],
    ],
    unitFile: 'src/components/FileRow/FileRow.test.tsx',
    browserFile: 'tests/visual/file-row.visual.spec.ts',
  },
  Highlight: {
    unit: 'Контент, close action, disabled/interaction и базовая семантика.',
    browser: 'Геометрия, состояния и адаптив.',
    gaps: 'Нет полной матрицы длинного контента и screen-reader сценариев.',
    selectors: [
      ['.fdoc-highlight', 'Корень', 'CSS-класс для browser-тестов.'],
      ['role=button', 'Закрытие/действие', 'Если действие отображается.'],
    ],
    unitFile: 'src/components/Highlight/Highlight.test.tsx',
    browserFile: 'tests/visual/highlight.visual.spec.ts',
  },
  InfoBlock: {
    unit: 'Иконка, title/text, actions, close, длинный текст и семантика.',
    browser: 'Геометрия, кнопки, адаптив и состояния.',
    gaps: 'Нет полной матрицы всех типов контента и скриншотных эталонов.',
    selectors: [
      ['info-block', 'Корень', 'Стабильный test ID.'],
      ['info-block-icon', 'Leading icon', 'Когда иконка отображается.'],
      ['info-block-close', 'Кнопка закрытия', 'Когда передан close action.'],
    ],
    unitFile: 'src/components/InfoBlock/InfoBlock.test.tsx',
    browserFile: 'tests/visual/infoblock.visual.spec.ts',
  },
  ItemRow: {
    unit: 'Title/description/helper, slots, selection, divider, disabled, focus и Skeleton.',
    browser: 'Состояния, типографика, selection marks, checkbox и Skeleton.',
    gaps: 'Нет полной матрицы всех комбинаций slot/content.',
    selectors: [
      ['item-row', 'Корень', 'Стабильный test ID.'],
      ['item-row-title / item-row-description / item-row-helper', 'Текстовые зоны', 'По наличию контента.'],
      ['item-row-left-slot / item-row-right-slot', 'Слоты', 'По наличию slot.'],
      ['item-row-selection / item-row-divider', 'Selection / divider', 'По включенным опциям.'],
    ],
    unitFile: 'src/components/ItemRow/ItemRow.test.tsx',
    browserFile: 'tests/visual/selection-menus.visual.spec.ts',
  },
  Link: {
    unit: 'Href, disabled, размеры/цвета, иконки и семантика ссылки.',
    browser: 'Матрица состояний, focus outline и underline только текста.',
    gaps: 'Нет отдельного screen-reader прогона внешних ссылок.',
    selectors: [
      ['role=link', 'Корень Link', 'Ищите по доступному имени.'],
      ['data-color / data-state', 'Цвет и принудительное состояние', 'Стабильные data-атрибуты, если заданы компонентом.'],
      ['.fdoc-link__text', 'Текст', 'Используется для проверки decoration.'],
    ],
    unitFile: 'src/components/Link/Link.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  ButtonLink: {
    unit: 'Проверяется вместе с Link: нативная button-семантика, состояния, иконки и disabled.',
    browser: 'Общий contract Link/ButtonLink и viewport-audit.',
    gaps: 'Нет отдельного browser-файла только для ButtonLink.',
    selectors: [
      ['role=button', 'Корень ButtonLink', 'Ищите по доступному имени.'],
      ['.fdoc-link__text', 'Текст', 'Общий layout с Link.'],
    ],
    unitFile: 'src/components/Link/Link.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  Menu: {
    unit: 'menu/menuitem, checkbox items, disabled, search, keyboard navigation и action callbacks.',
    browser: 'Scroll, фиксированные Search/Footer, размеры строк, pointer/keyboard focus.',
    gaps: 'Нет screen-reader прогона больших меню и виртуализации.',
    selectors: [
      ['role=menu', 'Список', 'Основной контейнер.'],
      ['role=menuitem / role=menuitemcheckbox', 'Строки', 'По типу item.'],
      ['role=searchbox', 'Поиск', 'Когда включен search.'],
      ['.fdoc-menu__footer', 'Footer', 'Когда передан footer.'],
    ],
    unitFile: 'src/components/Menu/Menu.test.tsx',
    browserFile: 'tests/visual/selection-menus.visual.spec.ts',
  },
  Dropdown: {
    unit: 'Открытие/закрытие, trigger, action, keyboard и возврат фокуса.',
    browser: 'Hover/tap режимы, pointer opening, Escape/Tab и focus management.',
    gaps: 'Нет touch-device e2e на реальном устройстве.',
    selectors: [
      ['trigger role (обычно button)', 'Триггер Dropdown', 'Селектор зависит от переданного child.'],
      ['role=menu / role=menuitem', 'Popup и строки', 'Присутствуют только когда открыт.'],
    ],
    unitFile: 'src/components/Menu/Dropdown.test.tsx',
    browserFile: 'tests/visual/dropdown-hover.visual.spec.ts',
  },
  MultipleFileInput: {
    unit: 'Общая валидация для кнопки/Dropzone, add/delete, collapse, group error, total size и reorder.',
    browser: 'Адаптив/overflow, FileRow/reorder contract и file-upload visual contract.',
    gaps: 'Нет e2e системного picker и больших реальных файлов.',
    selectors: [
      ['multiple-file-input', 'Корень', 'Стабильный test ID.'],
      ['multiple-file-input-group-error', 'Ошибка группы', 'При groupErrorText.'],
      ['file-row-drop-indicator', 'Место вставки', 'Во время reorder.'],
      ['file-row', 'Строки файлов', 'По одному на файл.'],
    ],
    unitFile: 'src/components/MultipleFileInput/MultipleFileInput.test.tsx',
    browserFile: 'tests/visual/responsive-overflow.visual.spec.ts',
  },
  Multiselect: {
    unit: 'Выбор нескольких options, clear, chips/display, клавиатура, controlled/uncontrolled и popup.',
    browser: 'Геометрия поля/popup, selection, адаптив и длинные значения.',
    gaps: 'Нет performance-тестов больших списков.',
    selectors: [
      ['multiselect-field', 'Поле/корень интерактивной части', 'Стабильный test ID.'],
      ['role=combobox', 'Поле', 'Основной интерактивный селектор.'],
      ['role=listbox / role=option', 'Popup и варианты', 'При открытом списке.'],
    ],
    unitFile: 'src/components/Multiselect/Multiselect.test.tsx',
    browserFile: 'tests/visual/multiselect.visual.spec.ts',
  },
  Pagination: {
    unit: 'Страницы, prev/next, счетчик и responsive количество элементов.',
    browser: 'Счетчик, длинные числа и отсутствие overflow.',
    gaps: 'Нет скриншотных эталонов для всех диапазонов.',
    selectors: [
      ['.fdoc-pagination', 'Корень', 'CSS-класс для browser-тестов.'],
      ['Страница N / Следующая страница / Предыдущая страница', 'Доступные имена кнопок', 'Используйте role=button + name.'],
      ['.fdoc-pagination__counter', 'Счетчик диапазона', 'Когда отображается.'],
    ],
    unitFile: 'src/components/Pagination/Pagination.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  PhoneInput: {
    unit: 'Форматирование, country selector, required/format validation, clear, paste и Skeleton.',
    browser: 'Геометрия, popup стран, адаптив и состояния.',
    gaps: 'Нет e2e с реальной телефонной маской браузера/IME.',
    selectors: [
      ['input-control', 'Нативное поле', 'Наследует селекторы Input.'],
      ['role=listbox / role=option', 'Список стран', 'Когда открыт selector.'],
      ['input-field / input-skeleton-field', 'Поле / Skeleton поля', 'Стабильные test IDs общей Field-базы.'],
    ],
    unitFile: 'src/components/PhoneInput/PhoneInput.test.tsx',
    browserFile: 'tests/visual/phone-input.visual.spec.ts',
  },
  Search: {
    unit: 'Нативный search input, submit, clear и callbacks.',
    browser: 'Submit/clear, сохранение размера и фокуса на 320 px.',
    gaps: 'Нет отдельных тестов всех inherited Input props.',
    selectors: [
      ['role=searchbox', 'Поле поиска', 'Основной селектор.'],
      ['role=button name=Очистить поле', 'Clear', 'При непустом значении.'],
      ['input-field', 'Обертка поля', 'Наследует Input layout.'],
    ],
    unitFile: 'src/components/Search/Search.test.tsx',
    browserFile: 'tests/visual/selection-menus.visual.spec.ts',
  },
  Select: {
    unit: 'Combobox, open/close, option selection, clear, disabled, creatable и keyboard.',
    browser: 'Геометрия popup, flip у края, focus, clear/selected icons и адаптив.',
    gaps: 'Нет performance-тестов больших списков и screen-reader matrix.',
    selectors: [
      ['role=combobox', 'Поле', 'Основной интерактивный селектор.'],
      ['role=listbox / role=option', 'Popup и варианты', 'При открытом списке.'],
      ['role=button name=Очистить выбор', 'Clear', 'Когда значение можно очистить.'],
    ],
    unitFile: 'src/components/Select/Select.test.tsx',
    browserFile: 'tests/visual/selection-menus.visual.spec.ts',
  },
  SelectionControl: {
    unit: 'Checkbox/Radio/Switch: native form, keyboard, indeterminate, disabled/Skeleton, error description и axe.',
    browser: 'Матрица состояний/токенов, размеры, длинные labels и native keyboard.',
    gaps: 'Нет Safari/Firefox и screen-reader прогона.',
    selectors: [
      ['role=checkbox / role=radio / role=switch', 'Нативный control', 'Основной селектор по типу.'],
      ['.fdoc-control', 'Корень визуального control', 'Для геометрии/токенов.'],
      ['.fdoc-control__label', 'Label', 'Если передан label.'],
    ],
    unitFile: 'src/components/SelectionControl/SelectionControl.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  SelectionGroup: {
    unit: 'RadioGroup single selection; CheckboxGroup/SwitchGroup независимые значения; controlled mode и доступная group-семантика.',
    browser: 'Native keyboard RadioGroup и общий viewport-audit.',
    gaps: 'Нет отдельной browser-матрицы всех group props.',
    selectors: [
      ['role=group / fieldset semantics', 'Корень группы', 'Ищите по label/legend.'],
      ['role=checkbox / role=radio / role=switch', 'Опции', 'Ищите по доступному имени option.'],
    ],
    unitFile: 'src/components/SelectionControl/SelectionControl.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  SingleFileInput: {
    unit: 'Picker desktop/mobile, выбор/удаление файла, Loading/Disabled, validation message, FileItem layout и Skeleton.',
    browser: 'Desktop/mobile адаптив по контейнеру/viewport, длинное имя+вес, Skeleton и отсутствие overflow.',
    gaps: 'Нет e2e системного picker на реальном устройстве.',
    selectors: [
      ['single-file-input / single-file-input-skeleton', 'Корень / Skeleton', 'Стабильные test IDs.'],
      ['role=button name=Загрузить', 'Открытие picker', 'Desktop и mobile action.'],
      ['role=progressbar', 'Loading файла', 'В заполненном loading-state.'],
      ['role=alert', 'Ошибка валидации файла', 'Когда передан validationMessage.'],
    ],
    unitFile: 'src/components/SingleFileInput/SingleFileInput.test.tsx',
    browserFile: 'tests/visual/single-file-input.visual.spec.ts',
  },
  Tabs: {
    unit: 'ARIA tab/tabpanel и выбор активного таба.',
    browser: 'Manual activation, overflow scrolling, keyboard Home/End/Space и адаптив.',
    gaps: 'Нет vertical orientation и screen-reader matrix.',
    selectors: [
      ['role=tablist', 'Список вкладок', 'Корень управления вкладками.'],
      ['role=tab', 'Вкладка', 'aria-selected отражает выбор.'],
      ['role=tabpanel', 'Активная панель', 'Связана с выбранным tab.'],
    ],
    unitFile: 'src/components/Tabs/Tabs.test.tsx',
    browserFile: 'tests/visual/tabs.visual.spec.ts',
  },
  Tooltip: {
    unit: 'Показ/скрытие и aria-describedby.',
    browser: 'Flip у края viewport, геометрия и удержание внутри экрана.',
    gaps: 'Нет touch/long-press сценариев и screen-reader matrix.',
    selectors: [
      ['role=tooltip', 'Popup', 'Когда Tooltip открыт.'],
      ['aria-describedby', 'Связь trigger → tooltip', 'На child trigger.'],
      ['.fdoc-tooltip-anchor', 'Обертка trigger', 'Для layout-проверок.'],
    ],
    unitFile: 'src/components/Tooltip/Tooltip.test.tsx',
    browserFile: 'tests/visual/bulk-components.visual.spec.ts',
  },
  Typography: {
    unit: 'Variant/tag mapping, children, className и базовые attributes.',
    browser: 'Контекстные размеры и отсутствие мобильного уменьшения шрифтов.',
    gaps: 'Нет скриншотного эталона всех вариантов.',
    selectors: [
      ['typography', 'Корень', 'Дефолтный test ID.'],
      ['data-typography-variant', 'Вариант', 'Если компонент выставляет data-атрибут.'],
      ['role=heading', 'Heading variants', 'При соответствующем semantic tag.'],
    ],
    unitFile: 'src/components/Typography/Typography.test.tsx',
    browserFile: 'tests/visual/typography-context.visual.spec.ts',
  },
};

export function testingDocs(name: keyof typeof docs): string {
  const item = docs[name];
  const base = 'https://github.com/dariaeremina89-oss/design-system/blob/main/';
  const unitFile = item.unitFile ?? `src/components/${name}/${name}.test.tsx`;
  const defaultVisual = name === 'Icon' || name === 'Skeleton' ? 'atoms' : name === 'ProgressIndicator' ? 'progress-indicator' : name === 'ButtonFAB' ? 'button-fab' : name === 'ButtonIcon' ? 'button-icon' : name.toLowerCase();
  const browserFile = item.browserFile ?? `tests/visual/${defaultVisual}.visual.spec.ts`;
  return `

## Автотесты

| Уровень | Что проверяется сейчас |
| --- | --- |
| Unit / DOM / CSS (Vitest) | ${item.unit} |
| Браузерные UI (Playwright) | ${item.browser} |
| Пока не покрыто | ${item.gaps} |

Это описание покрытия, не статус последнего запуска. CSS-проверки токенов не заменяют визуальную сверку с Figma; браузерные UI-тесты здесь проверяют DOM и вычисленные стили, а не скриншотные эталоны.

[Unit-тесты](${base}${unitFile}) · [Браузерные тесты](${base}${browserFile}) · [Результаты запусков](https://github.com/dariaeremina89-oss/design-system/actions)

## Селекторы для тестирования

Если имя начинается с data-, это атрибут; остальные имена в таблице — значения data-testid. Внутренние ID могут повторяться у нескольких экземпляров: сначала выбирайте корень нужного компонента, затем ищите внутри него. Переопределение корневого ID не меняет фиксированные ID вложенных слотов.

| Селектор | Элемент | Когда присутствует / значения / переопределение |
| --- | --- | --- |
${item.selectors.map(row => `| ${row.join(' | ')} |`).join('\n')}
`;
}
