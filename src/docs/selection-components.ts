import { componentDoc } from './component-doc';

const fixedTypography = 'Типографика и размеры внутри компонента постоянны на десктопе и мобильных. Компонент занимает доступную ширину родителя.';

const docs: Record<string, string> = {
  Search: componentDoc({
    purpose: `**Search** вводит запрос и запускает поиск по кнопке «Найти» или Enter. Подходит для документов, организаций, сотрудников и поиска внутри Menu. Для выбора с поиском используйте Autocomplete, для обычного ввода — Input.`,
    anatomy: `Input Small + Button Small. Опциональны Label, Required, Leading Icon, Description, Clear и Helper (Caption/Error/Counter).`,
    api: `- \`value / defaultValue / onChange\` — запрос;
- \`onSearch\` — явный запуск поиска;
- \`buttonText\` — подпись обязательной кнопки;
- \`clearable / onClear\` — очистка без автоматического запуска поиска;
- \`disabled\` блокирует поле, кнопку и Clear;
- \`skeleton\` заменяет элементы загрузочной геометрией.`,
    variants: `Error имеет приоритет над Caption. Disabled блокирует все дочерние действия. Skeleton не создает фокусируемых элементов.`,
    geometry: `Поле — 48 px, Button — 32 px. Основной текст — Subtitle 16/24, подписи — Caption 12/16, Button — Caption Strong 12/16. Радиус — \`--radius-middle\`, зазоры до подписей — 4 px.`,
    behavior: `Enter и кнопка запускают поиск один раз. IME-ввод не отправляет промежуточное значение. Clear очищает запрос и возвращает фокус в поле, но не запускает поиск автоматически.`,
    responsive: fixedTypography,
    accessibility: `Ошибка связана через aria-describedby/aria-invalid. Кнопка и Clear имеют собственную семантику и доступны с клавиатуры.`,
    checklist: [
      'Enter и кнопка дают один вызов onSearch.',
      'Clear не запускает поиск и возвращает фокус.',
      'Disabled блокирует Input, Button и Clear.',
      'Skeleton не оставляет интерактивных элементов.',
    ],
  }),

  ItemRow: componentDoc({
    purpose: `**ItemRow** — единая строка для списков выбора, действий, заголовков, ссылок и поиска. Используется внутри Menu/Select и подходит для панелей выбора и Bottom Sheet.`,
    anatomy: `Слева — опциональная Icon, Checkbox, selection mark или Logo. В центре — Title + Description. Справа — Helper и опциональная Icon/selection indicator. Divider включается независимо и остается внутри строки.`,
    api: `- \`variant\`: item / header / link / search;
- \`title / description / helper\`;
- \`leadingIcon / trailingIcon / logo\`;
- \`selection\`: check / checkbox, \`selectionPosition\`: left / right, \`selected\`;
- \`divider\` — готовый Divider;
- \`state\`: default / hover / pressed / focused / disabled / skeleton;
- для Search используется \`searchProps\`, для Link — href.`,
    variants: `Item, Header, Link и Search отличаются типографикой и геометрией. Hover/Pressed меняют фон. Focused использует \`--border-large\` без изменения размеров. Disabled блокирует действие и фокус.`,
    geometry: `| Variant | Основной текст | Геометрия |
| --- | --- | --- |
| item | Body 14/20 | min 48 px, padding 12 px |
| header | Subtitle Strong 16/24 | min 56 px, padding-top 20 px |
| link | Link Medium, Body 14/20 | min 44 px |
| search | Search, Subtitle 16/24 | padding Y 8 / X 12 |

Description — Caption 12/16, Helper — Body 14/20. Icon/Checkbox — 24 px, Logo — 32 px. Gap слева 12 px, справа 16 px, между текстами 4 px.`,
    behavior: `Длинные Title/Description переносятся и увеличивают высоту. В прокручиваемом Menu focus-обводка размещается так, чтобы оставаться видимой у края.`,
    responsive: fixedTypography,
    accessibility: `Интерактивная строка получает соответствующую роль и активируется Enter/Space. Header не становится кнопкой. Checkbox внутри строки — визуальный индикатор одного доступного элемента выбора.`,
    checklist: [
      'Все variants используют правильную семантику.',
      'Длинный текст переносится, fixed controls сохраняют размеры.',
      'Focused не меняет габариты строки.',
      'Skeleton повторяет текстовые зоны соответствующих стилей.',
      'Divider остается декоративным.',
    ],
  }),

  Menu: componentDoc({
    purpose: `**Menu** — контейнер строк выбора, действий и служебного содержимого. ItemRow задает анатомию строк; Menu отвечает за порядок, поиск, прокрутку и нижнюю область действий.`,
    anatomy: `Search может быть закреплен сверху, далее идет прокручиваемый список ItemRow, затем опциональный Footer с Button. Разделители добавляются только там, где нужны по смыслу.`,
    api: `- \`items\`: id, title, description, helper, icons, selected/disabled, selection, variant, href, onAction;
- \`role\`: menu / listbox;
- \`selectedId\` — выбранный пункт;
- \`searchable\` и \`textValue\` — поиск по списку;
- \`footer\` — готовые Button;
- \`activeId / onActiveChange\` — управление активной строкой;
- \`maxHeight\` — ограничение списка;
- \`skeleton\` — неинтерактивное состояние.`,
    variants: `Menu может работать как список действий (menu) или выбора (listbox), с Search/Footer или без них. Header и Disabled не участвуют в интерактивной навигации.`,
    geometry: `Фон \`--background-base-default\`, радиус \`--radius-middle\`, тень \`--shadow-m\`. Padding Y 8 px, X 0. Минимальная ширина 112 px, базовый max-height 304 px; внутренние отступы строк принадлежат ItemRow.`,
    behavior: `Список прокручивается, а Search/Footer остаются на месте. ArrowUp/Down перемещают активный пункт, Home/End — к краям, Enter/Space активируют. Typeahead переводит фокус к подходящему пункту; из Search стрелки переходят к результатам.`,
    responsive: `Menu ограничивается viewport и не должен создавать horizontal overflow. Типографика ItemRow не уменьшается на мобильных.`,
    accessibility: `Используются role=menu/menuitem или listbox/option в зависимости от сценария. Disabled/Header пропускаются клавиатурной навигацией, выбранность доступна программно.`,
    checklist: [
      'Search и Footer не прокручиваются вместе со списком.',
      'Disabled/Header пропускаются Arrow/Home/End.',
      'Selected state доступен через семантику роли.',
      'Длинный список не перекрывает текст scrollbar-ом.',
      'Skeleton отключает интерактивность.',
    ],
  }),

  Dropdown: componentDoc({
    purpose: `**Dropdown** раскрывает Menu от Button/ButtonIcon для дополнительных действий и навигации. Для выбора значения формы используйте Select.`,
    anatomy: `Trigger + portal Menu. В hover-сценарии основное действие может оставаться на trigger, а дополнительные действия — в Menu.`,
    api: `- \`children\` — trigger;
- \`items\` и props Menu — содержимое;
- \`open / defaultOpen / onOpenChange\` — раскрытие;
- \`placement\`: auto / bottom / top;
- \`matchWidth\` — привязка ширины к trigger;
- \`closeOnSelect\` — закрытие после выбора;
- \`disabled\` — блокировка;
- \`trigger\`: click / hover;
- \`primaryAction\` — основное действие для hover/mobile сценария.`,
    variants: `Click — обычный dropdown. Hover — дополнительное меню у кнопки с основным действием: на desktop hover только открывает Menu, а click/Enter/Space выполняют primaryAction; на touch первый tap открывает Menu, где primaryAction добавляется первым пунктом.`,
    geometry: `Menu находится в portal и располагается поверх контента. Gap до trigger — 4 px. При нехватке места сторона меняется, ширина/высота ограничиваются viewport.`,
    behavior: `В hover-режиме переход курсора между trigger и Menu сохраняет раскрытие; уход из обеих областей закрывает с задержкой 180 мс. ArrowDown/ArrowUp открывают Menu с первым/последним доступным пунктом. Escape, outside click и выбор закрывают Menu; после Escape/выбора фокус возвращается на trigger.`,
    responsive: `На ширине до 767 px, устройстве без hover или при фактическом touch первый tap только раскрывает Menu. primaryAction доступен первым пунктом и не дублируется при совпадающем id.`,
    accessibility: `Trigger использует aria-haspopup/aria-expanded/aria-controls. Клавиатурный сценарий сохраняется независимо от hover. Disabled блокирует hover, click и touch.`,
    checklist: [
      'Click-mode открывается мышью и клавиатурой.',
      'Hover не выполняет primaryAction и не забирает фокус.',
      'Touch открывает Menu первым tap и оставляет primaryAction доступным.',
      'ArrowDown/ArrowUp выбирают правильную стартовую строку.',
      'Escape и выбор возвращают фокус на trigger.',
    ],
  }),

  Select: componentDoc({
    purpose: `**Select** выбирает одно значение из заранее заданного списка. Для нескольких значений используйте Multiselect, для команд — Dropdown, для свободного текста — Input, для поиска по списку — Autocomplete.`,
    anatomy: `Переиспользует Input, Menu и ItemRow. Поддерживает Label, Required, Leading Icon, Description, Clear, Chevron и Helper (Caption/Error/Counter).`,
    api: `| Prop | Назначение |
| --- | --- |
| \`options\` | value, label, description, helper, leadingIcon, disabled |
| \`value / defaultValue\` | выбранное значение |
| \`onValueChange\` | выбор/создание/очистка |
| \`creatable\` | создание собственного значения по Enter |
| \`clearable\` | очистка |
| \`open / defaultOpen / onOpenChange\` | раскрытие |
| \`placement / menuMaxHeight\` | popup |
| \`name\` | значение формы |`,
    variants: `Default/Hover/Focused/Disabled/Error наследуют правила Input. Creatable превращает поле в редактируемое для создания значения, но не фильтрует options. Skeleton повторяет состав поля.`,
    geometry: `Small — 48 px, Medium — 56 px без Description. Основной текст — Subtitle 16/24, подписи — Caption 12/16, радиус \`--radius-middle\`. Chevron — 24 px; Clear — ButtonIcon Neutral 24 px с иконкой 24 px и padding 0.`,
    behavior: `Фокус сам по себе не открывает список. Click, Enter/Space и ArrowDown раскрывают Menu. При открытии мышью первая строка не получает focus-обводку до клавиатурной навигации. Creatable выбирает существующий value при совпадении label; новое значение не добавляется в options. Escape отменяет неподтвержденный ввод и сохраняет прежний выбор.`,
    responsive: `${fixedTypography} Menu совпадает с шириной поля, не создает horizontal overflow и при нехватке места может раскрыться вверх.`,
    accessibility: `Label связан с combobox; Description/Error/Caption через aria-describedby. aria-required, aria-invalid, aria-expanded и aria-controls отражают состояние. Arrow/Home/End и Enter управляют активным option; Disabled пропускаются.`,
    checklist: [
      'Обычный Select не редактируется как text input.',
      'Creatable создает значение без фильтрации списка.',
      'Clear возвращает пустое значение и фокус.',
      'Mouse-open не подсвечивает первую строку как keyboard focus.',
      'Popup помещается во viewport и сохраняет ширину поля.',
    ],
  }),
};

export const selectionDocs = (name: string) => docs[name];
