import { componentDoc } from './component-doc';

const badge = componentDoc({
  purpose: `**Badge** — небольшой неинтерактивный индикатор для количества, короткой метки или точки активности. Не используйте Badge как самостоятельное действие.`,
  anatomy: `Содержит только короткое текстовое значение или точку. Иконки и вложенные интерактивные элементы не поддерживаются.`,
  api: `- \`size\`: smallest / small / medium / large / giant;
- \`color\`: primary / secondary / inverse;
- \`state\`: default / disabled / skeleton;
- \`text\` или \`children\` — короткое значение без переноса;
- \`skeletonWidth\` — ширина Skeleton для конкретного контента.`,
  variants: `Default показывает обычное значение, Disabled использует disabled-токены, Skeleton заменяет содержимое общей skeleton-анимацией.`,
  geometry: `Smallest имеет внешний размер 16 px и внутреннюю точку 8 px. Остальные размеры имеют фиксированную высоту 16 / 20 / 24 / 28 px, а ширина зависит от контента и горизонтальных padding. Skeleton использует \`--radius-small\`.`,
  responsive: `Размер, типографика и высота Badge не уменьшаются на мобильных. При нехватке места ограничение ширины задает родительский компонент.`,
  accessibility: `Badge не получает фокус. Для декоративного значения можно передать \`aria-hidden\`, для самостоятельного текстового значения — доступное имя.`,
  checklist: [
    'Все размеры сохраняют заданную высоту и не растягиваются по вертикали.',
    'Disabled и Skeleton не становятся интерактивными.',
    'Короткий текст не переносится на вторую строку.',
  ],
});

const button = componentDoc({
  purpose: `**Button** — базовый компонент для запуска действия с текстом, опциональными иконками и Badge-слотами. Для действия без текста используйте ButtonIcon.`,
  anatomy: `Состав: контейнер Button, опциональные Leading Icon / Badge, текст, Trailing Badge / Icon. Loading заменяет левую иконку на Circular Progress Indicator.`,
  api: `- \`size\`: small / medium / large / giant;
- \`color\`: primary / base / secondary / tertiary / inverse / inverse-primary;
- \`state\`: default / hover / pressed / focused / disabled / skeleton;
- \`iconLeft / iconRight\` и \`iconLeftView / iconRightView\` — иконки и произвольные слоты;
- \`badgeLeft / badgeRight\` — готовые Badge;
- \`isLoading\` — Loading и блокировка повторного действия;
- \`fullWidth\` — ширина родителя;
- \`skeletonWidth\` — фиксированная ширина Skeleton.`,
  variants: `Hover и Pressed меняют фон. Focused добавляет внешнюю рамку. Disabled использует disabled-токены и нативный disabled. Skeleton заменяет кнопку неинтерактивной формой. Badge внутри Button синхронизирует цвет и disabled-состояние с кнопкой.`,
  geometry: `| Size | Высота | Padding Y / X | Gap | Icon / Badge |
| --- | ---: | ---: | ---: | ---: |
| small | 32 | 8 / 12 | 2 | 16 |
| medium | 40 | 8 / 16 | 2 | 20 |
| large | 48 | 8 / 16 | 4 | 24 |
| giant | 56 | 12 / 20 | 4 | 28 |

Радиус — \`--radius-middle\`. Small использует Caption Strong 12/16, Medium — Body Strong 14/20, Large/Giant — Subtitle Strong 16/24. Focus-рамка \`--border-large\` не меняет layout-размер.`,
  behavior: `Текст однострочный и сокращается многоточием. Loading блокирует повторное действие. Для основного действия используется нативный button; дополнительные продуктовые ограничения остаются на уровне сценария.`,
  responsive: `Размер кнопки и типографика не уменьшаются на мобильных. \`fullWidth\` растягивает кнопку только по горизонтали.`,
  accessibility: `Нативный button поддерживает Tab, Enter и Space. Для варианта только с иконкой обязательно доступное имя.`,
  checklist: [
    'Все размеры, цвета и состояния соответствуют токенам.',
    'Focus не меняет внешнюю геометрию.',
    'Loading и Disabled не запускают действие.',
    'Длинный текст не ломает ширину родителя.',
  ],
});

const buttonFAB = componentDoc({
  purpose: `**ButtonFAB** — кнопка одного приоритетного действия экрана, доступного независимо от прокрутки. Используйте один FAB на экране для частого основного действия, а не вместо обычных кнопок форм и списков.`,
  anatomy: `Круглая кнопка 64 × 64 px с одной библиотечной иконкой 40 × 40 px. Текста и меню действий внутри FAB нет.`,
  api: `- \`icon\` и \`aria-label\` обязательны;
- \`color\`: primary / secondary / base / inverse;
- \`state\`: default / hover / focused / pressed / disabled / skeleton;
- \`position\`: floating / inline;
- стандартные button props, \`className\` и \`style\` передаются корню.`,
  variants: `Hover и Pressed меняют фон, Focused использует фон Default и внешнюю рамку. Disabled блокирует действие. Skeleton — неинтерактивный круг без иконки.`,
  geometry: `Кнопка — \`--elements-64\`, иконка — \`--elements-40\`, padding — \`--space-12\`, радиус — \`--radius-full\`, тень — \`--shadow-s\`. Focus использует \`--border-large\` снаружи и не меняет размер.`,
  behavior: `Floating рендерится через portal в body и остается поверх прокручиваемого контента. Inline участвует в обычном layout и используется в сравнительных stories.`,
  responsive: `Floating располагается справа внизу с \`--space-24\` плюс safe area. Токены темы должны быть доступны на корне документа. Отступ можно переопределить через style/className.`,
  accessibility: `Используется нативный button. Tab переводит фокус, Enter и Space запускают действие. Disabled исключает кнопку из Tab-порядка, иконка декоративна для screen reader.`,
  checklist: [
    'На экране используется не более одного FAB.',
    'Floating не смещается при прокрутке родителя.',
    'Focused сохраняет размер 64 × 64.',
    'aria-label описывает действие, а не внешний вид иконки.',
  ],
});

const buttonIcon = componentDoc({
  purpose: `**ButtonIcon** — компактная кнопка одного действия без текста. Используйте ее, когда смысл действия понятен по иконке или дополнительно раскрывается через Tooltip.`,
  anatomy: `Содержит одну иконку. Текст и дополнительные слоты не поддерживаются. Tooltip не заменяет обязательное доступное имя.`,
  api: `- \`size\`: xxsmall / xsmall / small / medium / large / giant;
- \`color\`: primary / secondary / tertiary / neutral / base / inverse / inverse-primary / inverse-light;
- \`state\`: default / hover / focused / pressed / disabled / skeleton;
- \`icon\` или \`iconView\` задает содержимое;
- \`iconSize\` позволяет переопределить размер иконки отдельно от кнопки.`,
  variants: `Tertiary и Neutral прозрачны в Default, Focused и Disabled; фон появляется в Hover/Pressed. Skeleton для прозрачных схем показывает skeleton-icon, остальные используют заполненный skeleton-круг.`,
  geometry: `| Size | Кнопка | Иконка | Padding |
| --- | ---: | ---: | ---: |
| xxsmall | 16 | 16 | 0 |
| xsmall | 24 | 16 | 4 |
| small | 32 | 16 | 8 |
| medium | 40 | 24 | 8 |
| large | 48 | 32 | 8 |
| giant | 56 | 40 | 8 |

Радиус — \`--radius-full\`. Focus-рамка \`--border-large\` рисуется снаружи и не меняет размер layout-бокса.`,
  responsive: `Размер кнопки и иконки не уменьшается на мобильных.`,
  accessibility: `Используется нативный button. \`aria-label\` обязателен; Tab, Enter и Space работают нативно. Disabled исключается из Tab-порядка.`,
  checklist: [
    'Размер иконки соответствует размеру ButtonIcon или явному iconSize.',
    'Focus не меняет размер кнопки.',
    'Tooltip не является единственным доступным именем.',
    'Skeleton не интерактивен.',
  ],
});

const dialog = componentDoc({
  purpose: `**Dialog** — модальное окно для отдельной задачи или решения, которое требует внимания пользователя. Не используйте его для информации, которую можно оставить в основном потоке страницы.`,
  anatomy: `Header, прокручиваемый Content и необязательный Footer. Basic содержит текст, Module — произвольный контент, Scroll — ограниченную область, Image — изображение и заголовок внутри Content. Действия передаются готовыми Button.`,
  api: `- \`open\` управляется родителем;
- \`onClose\` сообщает запрос закрытия и его причину;
- \`title\` задает заголовок и доступное имя;
- \`children\` — Content, \`footer\` — действия;
- \`size\` и \`variant\` соответствуют вариантам;
- \`footerAlign\`: left / center / edges;
- \`closeOnEscape / closeOnBackdrop\` управляют способами закрытия;
- \`initialFocusRef\` задает начальный фокус.`,
  variants: `Размеры Desktop: Small 480, Medium 640, Large 1024 px. На Device доступны 320 / 480 / 640 px с ограничением по viewport.`,
  geometry: `Content использует padding 24 px на Desktop и 16 px на Device. Кнопки и типографика сохраняют собственные размеры. Длинный контент прокручивается между Header и Footer.`,
  behavior: `Modal блокирует фон и прокрутку страницы. Не закрывайте окно до успешного сохранения; при несохраненных данных onClose может запускать подтверждение. Escape сначала закрывает вложенное меню, затем Dialog.`,
  responsive: `Dialog ограничивается доступной шириной экрана; внутренние компоненты не уменьшают типографику. Select, Dropdown и Tooltip остаются в модальном слое.`,
  accessibility: `Фокус удерживается внутри Dialog и возвращается на trigger после закрытия. Заголовок задает доступное имя. \`aria-describedby\` используйте только для краткого описания, а не всей сложной формы.`,
  checklist: [
    'Фон недоступен для взаимодействия, пока Dialog открыт.',
    'Фокус не уходит за пределы Dialog.',
    'Длинный Content прокручивается без движения Header/Footer.',
    'Закрытие возвращает фокус на trigger.',
  ],
});

const input = componentDoc({
  purpose: `**Input** — нативное однострочное текстовое поле F.Doc. Используйте для свободного ввода; для выбора из списка используйте Select/Autocomplete, для многострочного текста — Textarea.`,
  anatomy: `Label → поле ввода с опциональными Leading/Trailing → Description → Helper (Caption или Error + Counter). Clear — отдельный ButtonIcon внутри поля.`,
  api: `- \`size\`: medium / small;
- \`leadingIcon / trailingIcon / sumIcon / clearIcon\` — библиотечные иконки;
- \`clearable\` включает ButtonIcon очистки;
- \`counter\` показывает длину значения и учитывает maxLength;
- \`error\` заменяет caption;
- \`label / description / caption / required / disabled / skeleton\` управляют соответствующими зонами;
- value/defaultValue и стандартные input props сохраняют нативное поведение.`,
  variants: `Поддерживаются Default, Hover, Focused, Disabled, Error и Skeleton. Error меняет validation-оформление, но не перекрашивает Value, Placeholder, Description, Counter и обычные иконки.`,
  geometry: `Medium — 56 px, Small — 48 px. Focus-обводка входит в геометрию и не меняет внешний размер. Clear использует ButtonIcon 24 px, Neutral, с иконкой \`filled/cross_circle_filled\` по умолчанию.`,
  behavior: `Caret остается нативным курсором HTML input и не моделируется отдельной иконкой. Очистка возвращает пустое значение через тот же contract изменения значения.`,
  responsive: `Типографика и размеры внутренних элементов не уменьшаются на мобильных. Поле занимает доступную ширину родителя и не создает горизонтальный overflow.`,
  accessibility: `Нативный input связан с Label через htmlFor. Description, Error и Counter подключаются через aria-describedby; Error устанавливает aria-invalid.`,
  checklist: [
    'Label, Description, Caption/Error и Counter появляются без лишних пустых зон.',
    'Focus не меняет размер поля.',
    'Clear доступен с клавиатуры и очищает значение один раз.',
    'Skeleton не содержит интерактивного input.',
  ],
});

const skeleton = componentDoc({
  purpose: `**Skeleton** — базовый плейсхолдер загрузки. Используйте его при первичной отрисовке, когда геометрия будущего контента уже известна; не используйте как постоянный индикатор фоновой операции.`,
  anatomy: `Одна неинтерактивная форма без вложенных controls. В составных компонентах Skeleton повторяет геометрию конкретного загружаемого элемента.`,
  api: `- \`shape\`: text / rounded / circle / icon;
- \`width / height\` задают геометрию;
- \`textSize\` синхронизирует высоту с типографическим стилем;
- \`data-testid\` по умолчанию равен skeleton и может быть переопределен.`,
  variants: `Text, Rounded, Circle и Icon отличаются формой и радиусом; все используют общую wave-анимацию.`,
  geometry: `Фиксированные width/height защищены от случайного flex-shrink. Fluid-значения вроде 100%, calc() и clamp() сохраняют адаптивность. Размер внутри составного компонента должен совпадать с будущим контентом.`,
  behavior: `Skeleton не хранит состояние загрузки и не управляет данными: родитель решает, когда заменить его реальным содержимым.`,
  responsive: `Fluid-размеры следуют контейнеру; типографический Skeleton сохраняет выбранный textSize.`,
  accessibility: `Skeleton скрыт от accessibility tree через aria-hidden и не содержит фокусируемых элементов.`,
  checklist: [
    'Используется только для первичной загрузки или известной геометрии.',
    'Не появляется интерактивный control внутри Skeleton.',
    'Фиксированный размер не сжимается во flex-контейнере.',
    'Fluid-размер не создает horizontal overflow.',
  ],
});

const textarea = componentDoc({
  purpose: `**Textarea** — нативное многострочное поле F.Doc. Используйте для текста, которому нужен перенос строк; для одной строки используйте Input.`,
  anatomy: `Label → область ввода → Helper (Caption или Error + Counter). Label, Helper, приоритет Error, Counter и связи доступности используют общую основу с Input.`,
  api: `- \`size\`: medium / small;
- \`label / placeholder / caption / error / counter / required / disabled / skeleton\` работают как у Input;
- \`counter=true\` показывает длину, с maxLength — формат N / N;
- value/onChange — controlled, defaultValue — uncontrolled;
- \`resize\` разрешает ручное изменение высоты по вертикали;
- ref указывает на нативный textarea; поддерживаются name, readOnly, autoFocus и стандартные события.`,
  variants: `Default, Hover, Focused, Disabled, Error и Skeleton используют общую семантику Input. Error + Disabled применяет disabled-токены ошибки, а значение/placeholder/counter сохраняют свои disabled-цвета.`,
  geometry: `Medium: область ввода 112 px, padding 16 px. Small: 48 px, padding Y 8 px / X 16 px. Текст — 16/24, Label и Helper — 12/16. Border входит в габариты. При однострочных Label/Helper общая высота составляет 152 / 88 px.`,
  behavior: `Enter добавляет строку, paste сохраняет переносы, Tab переводит фокус дальше. \`resize=false\` по умолчанию сохраняет высоту; \`resize=true\` разрешает только вертикальный resize. При переполнении появляется вертикальная прокрутка. Автоматическое увеличение высоты не включено.

**Приоритет макета:** Medium 112 px при padding 16 px и line-height 24 px не вмещает четыре полные строки; реализация сохраняет размеры Figma, остальной текст доступен прокруткой.`,
  responsive: `Типографика не уменьшается на мобильных. Длинные последовательности переносятся внутри поля и не создают горизонтальный overflow.`,
  accessibility: `Label связан через htmlFor/id; Error, Caption, Counter и внешний aria-describedby объединяются. Error задает aria-invalid, required — нативную обязательность и aria-required. Без Label передайте aria-label или aria-labelledby. Skeleton скрыт от accessibility tree.`,
  checklist: [
    'Error заменяет Caption, но не удаляет Counter.',
    'Focus не меняет размеры поля.',
    'maxLength ограничивает пользовательский ввод и вставку.',
    'Disabled блокирует ввод и ручной resize.',
  ],
});

const typography = componentDoc({
  purpose: `**Typography** применяет именованный типографический стиль дизайн-системы к выбранному семантическому HTML-элементу. Foundation со всеми токенами остается в General / Typography; компонент отвечает только за применение этих стилей в React.`,
  anatomy: `Компонент не добавляет внутренних слотов: он рендерит выбранный HTML-элемент с типографическим классом и содержимым children.`,
  api: `- \`as\` задает HTML-тег независимо от визуального стиля;
- \`variant\`: h0-heading / h1-heading / h2-heading / h3-heading / subtitle / body / caption / overline / code;
- \`strong\` включает Strong weight для не-heading вариантов;
- \`responsive\` разрешает существующий Mobile-размер того же page style;
- стандартные HTML attributes, className и style передаются корню.`,
  variants: `Variant определяет визуальный стиль, strong — вес. Семантический тег не обязан совпадать с визуальным уровнем heading.`,
  geometry: `Размер, line-height, weight и family берутся из типографических токенов соответствующего variant. Компонент не добавляет padding, border или собственную ширину.`,
  behavior: `Например, \`as="h2" variant="h1-heading"\` остается heading второго уровня, но визуально использует H1 style. Typography не добавляет интерактивность и не заменяет Link/Button.`,
  responsive: `При \`responsive=true\` применяется Mobile-размер page style. Внутри остальных компонентов responsive обычно выключен: их типографика фиксирована.`,
  accessibility: `Семантика определяется значением \`as\`. Выбирайте heading-уровень по структуре документа, а не по желаемому размеру текста.`,
  checklist: [
    'Semantic tag и visual variant управляются независимо.',
    'Strong не меняет variant.',
    'Responsive меняет только предусмотренные mobile-токены.',
    'Typography не добавляет интерактивную семантику.',
  ],
});

const progressIndicator = componentDoc({
  purpose: `**ProgressIndicator** — неинтерактивный индикатор процесса для Linear и Circular вариантов. Determinate используйте при известном прогрессе, Indeterminate — когда длительность неизвестна.`,
  anatomy: `Linear — горизонтальный track и progress. Circular — SVG-кольцо/дуга. Компонент не содержит текста действия и не получает фокус.`,
  api: `- \`type\`: linear / circular;
- \`mode\`: determinate / indeterminate;
- Linear: \`value / max\`;
- Circular: \`size / strokeWidth / variant / duration / animation\`;
- \`color\` остается совместимым алиасом variant.`,
  variants: `Circular поддерживает primary / secondary / tertiary. Linear использует Primary-схему. В Indeterminate Circular дуга вращается и меняет длину; Determinate отображает долю value/max.`,
  geometry: `Linear занимает доступную ширину и имеет высоту 4 px. Circular по умолчанию 24 px со strokeWidth 2. Длительность стандартной indeterminate-анимации — 1.4 c.`,
  behavior: `Determinate нормализует значение относительно max. Indeterminate не публикует числовое значение. Анимация отключается при prefers-reduced-motion.`,
  responsive: `Linear следует ширине контейнера. Circular сохраняет явно заданный размер и не уменьшается автоматически.`,
  accessibility: `Корень имеет role=progressbar. Determinate публикует aria-valuemin, aria-valuemax и aria-valuenow; Indeterminate — роль и доступную подпись без aria-valuenow.`,
  checklist: [
    'Determinate корректно отражает 0, промежуточное и максимальное значение.',
    'Indeterminate не публикует фиктивный процент.',
    'Circular сохраняет размер и strokeWidth.',
    'prefers-reduced-motion отключает анимацию.',
  ],
});

export const coreComponentDocs = {
  Badge: badge,
  Button: button,
  ButtonFAB: buttonFAB,
  ButtonIcon: buttonIcon,
  Dialog: dialog,
  Input: input,
  Skeleton: skeleton,
  Textarea: textarea,
  Typography: typography,
  ProgressIndicator: progressIndicator,
} as const;

export type CoreComponentDocName = keyof typeof coreComponentDocs;
export function coreDocs(name: CoreComponentDocName) {
  return coreComponentDocs[name];
}
