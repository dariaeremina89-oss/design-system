type TestingDocs = {
  unit: string;
  browser: string;
  gaps: string;
  selectors: Array<[string, string, string]>;
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
  ButtonIcon: {
    unit: 'Матрица размеров кнопки и иконки; независимый iconSize; нативная кнопка; disabled без клика; произвольная иконка; токены цветовых схем; Neutral hover/pressed; неинтерактивный Skeleton и его вариант для tertiary/neutral.',
    browser: 'Размеры и круглая форма; внешний размер при focus; disabled; общий Skeleton.',
    gaps: 'Нет отдельного axe-аудита, тестов клавиатурной активации и полной матрицы цвет × состояние × размер.',
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
};

export function testingDocs(name: keyof typeof docs): string {
  const item = docs[name];
  const base = 'https://github.com/dariaeremina89-oss/design-system/blob/main/';
  const visual = name === 'Icon' || name === 'Skeleton' ? 'atoms' : name === 'ProgressIndicator' ? 'progress-indicator' : name === 'ButtonIcon' ? 'button-icon' : name.toLowerCase();
  return `

## Автотесты

| Уровень | Что проверяется сейчас |
| --- | --- |
| Unit / DOM / CSS (Vitest) | ${item.unit} |
| Браузерные UI (Playwright) | ${item.browser} |
| Пока не покрыто | ${item.gaps} |

Это описание покрытия, не статус последнего запуска. CSS-проверки токенов не заменяют визуальную сверку с Figma; браузерные UI-тесты здесь проверяют DOM и вычисленные стили, а не скриншотные эталоны.

[Unit-тесты](${base}src/components/${name}/${name}.test.tsx) · [Браузерные тесты](${base}tests/visual/${visual}.visual.spec.ts) · [Результаты запусков](https://github.com/dariaeremina89-oss/design-system/actions)

## Селекторы для тестирования

Если имя начинается с data-, это атрибут; остальные имена в таблице — значения data-testid. Внутренние ID могут повторяться у нескольких экземпляров: сначала выбирайте корень нужного компонента, затем ищите внутри него. Переопределение корневого ID не меняет фиксированные ID вложенных слотов.

| Селектор | Элемент | Когда присутствует / значения / переопределение |
| --- | --- | --- |
${item.selectors.map(row => `| ${row.join(' | ')} |`).join('\n')}
`;
}
