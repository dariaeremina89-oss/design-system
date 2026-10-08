import { componentDoc } from './component-doc';

const autocomplete = componentDoc({
  purpose: `**Autocomplete** — поле выбора одного значения через текстовый поиск. Используйте, когда список достаточно большой и пользователю проще искать по названию, чем просматривать его целиком.`,
  anatomy: `Компонент объединяет Input, Menu и Select-модель: поле поиска, popup со списком ItemRow и опциональную очистку. Выбранным значением может стать только item из переданного списка.`,
  api: `- \`data\` — value/label + description/helper/leadingIcon/disabled;
- \`value / defaultValue\` — выбранный item.value;
- \`inputValue / defaultInputValue\` — отдельно управляемый текст поиска;
- \`mode\`: auto / input / select;
- \`minCharacters\`, \`highlightMatches\`, \`showSelectedIcon\`;
- \`loading / loadError / idleText / noOptionsText\` — состояния списка;
- \`open / defaultOpen / onOpenChange\`;
- \`placement / menuMaxHeight\`;
- Label/required/description/caption/error/counter/size/clearable/disabled/skeleton наследуются от Input.`,
  variants: `Mode Auto выбирает визуальную модель по наличию списка. Loading/Load Error относятся к popup и не заменяют validation Error самого поля. Disabled option не выбирается и пропускается клавиатурой.`,
  behavior: `Ввод меняет только поисковый текст. Выбор option синхронизирует value и видимый label. Clear сбрасывает и value, и inputValue. Popup открывается по пользовательскому действию и при нехватке места может сменить сторону.`,
  responsive: `Поле и popup остаются внутри viewport, типографика не уменьшается. Длинные label/description переносятся внутри Menu.`,
  accessibility: `Используется combobox с aria-expanded/aria-controls/aria-activedescendant и listbox/option. Arrow keys перемещают активный вариант, Enter выбирает, Escape закрывает popup.`,
  checklist: [
    'Controlled и uncontrolled value/inputValue работают независимо.',
    'Validation Error поля не смешивается с loading/loadError списка.',
    'Clear очищает и выбранное значение, и текст поиска.',
    'Disabled option пропускается клавиатурой.',
    'Popup не создает horizontal overflow.',
  ],
});

const asyncAutocomplete = componentDoc({
  purpose: `**AsyncAutocomplete** — Autocomplete для вариантов, которые загружаются по текущему запросу. Используйте для серверного поиска и списков, которые нельзя заранее загрузить целиком.`,
  anatomy: `Анатомия совпадает с Autocomplete: Input + Menu + ItemRow. Дополнительно компонент управляет жизненным циклом запроса.`,
  api: `- все публичные props Autocomplete, кроме локального \`filterData\`;
- \`onFetch(value)\` — запрос вариантов;
- \`minCharacters\` — порог запроса;
- \`debounce\` — задержка;
- \`limit\` — максимум отображаемых результатов;
- \`loading / loadError\` — состояние загрузки списка.`,
  variants: `Loading, Results, Empty и Load Error меняют только содержимое popup. Validation Error поля остается отдельным состоянием.`,
  behavior: `onFetch запускается после достижения minCharacters и окончания debounce. Локальная фильтрация выключена: источник истины — переданный data. Выбор, Clear, controlled/uncontrolled value и клавиатура совпадают с Autocomplete.`,
  responsive: `Popup сохраняет ширину при переходах Loading → Results → Empty/Error и остается внутри viewport.`,
  accessibility: `Combobox сохраняет роль во время загрузки; состояние загрузки доступно assistive technologies. Клавиатурная модель совпадает с Autocomplete.`,
  checklist: [
    'Debounce не вызывает запрос на каждый символ.',
    'Запрос не стартует раньше minCharacters.',
    'Новые данные не сбрасывают выбранное значение без причины.',
    'Loading/Error/Empty не меняют геометрию поля.',
    'Disabled блокирует новые запросы и взаимодействие.',
  ],
});

const asyncMultiselect = componentDoc({
  purpose: `**AsyncMultiselect** — выбор нескольких значений через серверный поиск. Используйте для больших или удаленных списков, которые нельзя заранее загрузить целиком.`,
  anatomy: `Поле поиска + выбранные Chips + Menu с ItemRow/Checkbox. Результаты текущего запроса приходят через options; выбранные значения живут независимо от следующего ответа сервера.`,
  api: `- все основные field props Multiselect: value/defaultValue, label, required, caption/error/counter, size, clearable, disabled/skeleton;
- \`options\` — результаты текущего серверного запроса;
- \`selectedOptions\` — данные выбранных значений, которых уже нет в текущем ответе;
- \`inputValue / defaultInputValue / onInputValueChange\` — поисковый запрос;
- \`onFetch(value)\`, \`minCharacters\`, \`debounce\`, \`limit\`;
- \`loading / loadError / idleText / noOptionsText\` — состояния списка;
- \`selectionPosition\`, \`open / defaultOpen / onOpenChange\`, \`placement / menuMaxHeight\`.`,
  variants: `Выбранные значения всегда показываются Chips, потому что поле одновременно должно сохранять выбор и принимать новый поисковый запрос. Loading, Load Error, Empty и Idle меняют только содержимое Menu.`,
  behavior: `Запрос запускается после minCharacters и debounce. options не фильтруются локально повторно. Выбор нового option добавляет Chip, очищает поисковый запрос и сохраняет фокус в поле для следующего поиска. Если очищенный запрос короче minCharacters, Menu скрывается. Новый серверный ответ не сбрасывает уже выбранные значения; для controlled preselected значений передавайте selectedOptions.`,
  responsive: `Chips переносятся и увеличивают высоту поля. Menu совпадает с шириной поля и остается внутри viewport; типографика не уменьшается.`,
  accessibility: `Поиск использует combobox + listbox/option и aria-activedescendant. Результаты имеют Checkbox-семантику выбора, Loading объявляется через aria-busy и live status. Arrow keys перемещают активный результат, Enter переключает его, Escape закрывает Menu.`,
  checklist: [
    'Запрос не стартует раньше minCharacters и соблюдает debounce.',
    'Серверные options не фильтруются повторно на клиенте.',
    'После выбора нового результата поисковый запрос очищается, выбранный Chip сохраняется.',
    'Новый ответ сервера не удаляет выбранные Chips.',
    'Loading/Error/Empty не смешиваются с validation Error поля.',
    'Disabled и Skeleton не запускают onFetch.',
  ],
});

const highlight = componentDoc({
  purpose: `**Highlight** — подсветка буквального совпадения внутри текста через нативный mark. Используйте для результатов поиска и фильтрации.`,
  anatomy: `Компонент не добавляет layout-контейнер: он заменяет совпавшие текстовые фрагменты на mark, сохраняя окружающую React-разметку.`,
  api: `- \`children\` — текст или разметка;
- \`highlight\` — буквальная подстрока;
- \`matchWholeWord\` — только полные слова;
- \`isCaseInsensitive\` — игнорировать регистр, по умолчанию true.`,
  behavior: `Пустой highlight возвращает исходный контент. Во вложенной разметке поиск идет внутри отдельных текстовых узлов; props и структура элементов сохраняются.`,
  responsive: `Highlight не задает собственную ширину и наследует правила переноса родителя.`,
  accessibility: `mark не получает фокус. Текст должен оставаться понятным без цветовой подсветки.`,
  checklist: [
    'Кириллица и латиница ищутся корректно.',
    'Пустой highlight не меняет DOM-смысл.',
    'matchWholeWord не подсвечивает часть более длинного слова.',
    'Вложенные элементы сохраняют props и структуру.',
  ],
});

const icon = componentDoc({
  purpose: `**Icon** — единая SVG-библиотека F.Doc. Используйте только имена из IconName, чтобы продуктовые компоненты не зависели от случайных внешних SVG.`,
  anatomy: `Одна SVG-иконка в квадратном контейнере. Монохромные ресурсы наследуют currentColor; многослойные ресурсы сохраняют собственные цвета.`,
  api: `- \`name\` — имя из библиотеки;
- \`size\` — квадратный размер;
- \`color\` — явный цвет для монохромной иконки;
- \`title\` — доступное имя самостоятельной смысловой иконки.`,
  geometry: `Размер задается явно через size и не должен самопроизвольно сжиматься внутри Button/ButtonIcon и других controls.`,
  responsive: `Размер иконки не уменьшается на мобильных без явного решения родительского компонента.`,
  accessibility: `Декоративная Icon скрывается от screen reader. Если иконка несет смысл без текста, задайте title или доступное имя родительскому интерактивному элементу.`,
  checklist: [
    'Имя существует в экспортированной библиотеке.',
    'Размер соответствует контейнеру.',
    'Монохромная иконка берет цвет через currentColor.',
    'Icon внутри Button/ButtonIcon не дублирует доступное имя действия.',
  ],
});

const infoBlock = componentDoc({
  purpose: `**InfoBlock** — встроенное контекстное сообщение внутри страницы, формы или сценария. Используйте для пояснения, предупреждения, ошибки или статуса, который должен оставаться рядом с контентом. Для краткого временного уведомления используйте Snackbar.`,
  anatomy: `Leading Icon → Title/Text → один или два Action → Close. Title и Text независимы. Leading и Close опциональны. Actions передаются готовыми child components.`,
  api: `- \`color\`: neutral / base / success / accent / warning / error / inverse;
- \`title / text\` — текстовые зоны;
- \`leftIcon / leftIconView / showLeftIcon\` — Leading;
- \`actions\` — до двух действий;
- \`closable / onClose\` — закрытие;
- стандартные HTML/ARIA attributes передаются корню.`,
  variants: `Цвет задает семантические background/icon/text tokens. В Inverse состав Actions повторяет Figma: Secondary + Inverse; Base использует Secondary + Tertiary; остальные стандартные варианты — Base + Tertiary.`,
  geometry: `Корень всегда использует padding 4 / 4 / 4 / 16. Leading имеет слот 24 × 32 с 8 px сверху; текстовая колонка — padding 10 px сверху/снизу. Border рисуется внутри и не увеличивает layout-размер.

Horizontal: Actions справа, контейнер 40 px, кнопки 32 px по центру, без дополнительного bottom padding. Vertical: Actions под текстом, gap 8 px и bottom padding 8 px; при Leading начинаются на 32 px правее его левого края.`,
  behavior: `Actions остаются справа, пока хватает реальной доступной ширины для текста и фактической ширины кнопок; затем переключаются в Vertical. Перестроение не двигает первую строку текста. Child actions сохраняют собственные состояния и доступность.`,
  responsive: `Переключение зависит от доступной ширины компонента, а не фиксированного breakpoint экрана. Длинные слова и URL используют безопасный перенос и не создают horizontal overflow.`,
  accessibility: `Семантика сообщения задается допустимыми HTML/ARIA attributes. Close имеет доступное имя. Error/Warning не должны различаться только цветом, если смысл требует явного текста.`,
  checklist: [
    'Без Title или Text не остается пустого слота.',
    'Horizontal и Vertical совпадают с Figma по отступам.',
    'Один/два Action переключаются по фактической ширине.',
    'Long text не создает overflow.',
    'Close не запускает Action и наоборот.',
  ],
});

const multiselect = componentDoc({
  purpose: `**Multiselect** — выбор нескольких независимых значений из списка. Для одного значения используйте Select.`,
  anatomy: `Поле выбора + Menu с ItemRow/Checkbox + отображение выбранных значений в одном из display-режимов. Chips-режим использует готовый Chips.`,
  api: `- \`options\` — value/label + description/helper/leadingIcon/disabled;
- \`value / defaultValue\` — массив выбранных value;
- \`onValueChange\` — новый полный массив;
- \`display\`: comma / count / firstAndCount / chips;
- \`creatable\` — создание собственного значения;
- \`selectAll / selectAllLabel\` — массовый выбор доступных options;
- \`selectionPosition\`: left / right;
- \`open / defaultOpen / onOpenChange / placement / menuMaxHeight\`;
- \`emptyText\` — пустой список.`,
  variants: `Creatable всегда отображает выбранные значения через Chips. Display меняет только представление, не данные. Disabled option не входит в select-all.`,
  behavior: `Option переключается независимо. Удаление Chips обновляет тот же массив value; Clear вызывает onValueChange([]) и onClear. Созданное значение не добавляется в исходный options автоматически.`,
  responsive: `В comma/firstAndCount длинный текст не раздувает поле; Chips переносятся по правилам компонента. Menu и поле остаются внутри viewport, типографика не уменьшается.`,
  accessibility: `Используется combobox/listbox модель; выбранность options программно доступна. Клавиатура открывает popup, перемещает активный пункт, переключает выбор и закрывает список.`,
  checklist: [
    'Controlled/uncontrolled массивы не расходятся.',
    'Select-all игнорирует Disabled.',
    'Удаление Chips и Clear возвращают корректный полный массив.',
    'Все display-режимы показывают одно и то же выбранное множество.',
    'Длинные значения не создают overflow.',
  ],
});

const codeInput = componentDoc({
  purpose: `**CodeInput** — ввод короткого цифрового кода подтверждения в отдельных ячейках. Используйте для OTP и одноразовых кодов из сообщения, а не для обычных числовых значений.`,
  anatomy: `Label → ряд из 4–6 ячеек → Caption или Error. Каждая ячейка содержит один символ; итоговое значение компонента остается одной строкой.`,
  api: `- \`value / defaultValue\` — полный код строкой;
- \`onValueChange(value)\` — изменение полного нормализованного кода;
- \`length\`: 4 / 5 / 6;
- \`size\`: medium / small;
- Label / required / caption / error / disabled / skeleton;
- \`name\` передает итоговое значение через hidden input формы.`,
  variants: `Medium: ячейка 48 × 56, radius-large, H3 20/28. Small: 32 × 48, radius-middle, Subtitle Strong 16/24. Error применяется ко всем ячейкам; Focus выделяет активную ячейку. Skeleton сохраняет количество и геометрию ячеек.`,
  geometry: `Между ячейками gap space-8. Medium из шести ячеек занимает 328 px, Small — 232 px. Label и Helper используют общую геометрию form fields.`,
  behavior: `После ввода цифры фокус переходит в следующую ячейку. Backspace удаляет текущий символ или предыдущий, если текущая ячейка пуста. Arrow Left / Right, Home и End перемещают фокус. Вставка распределяет цифры по ячейкам и игнорирует разделители и другие нецифровые символы.`,
  responsive: `Размер ячеек не уменьшается автоматически: для узких контейнеров используйте Small. Типографика каждого size остается постоянной на мобильных.`,
  accessibility: `Ячейки объединены в group с доступным названием. Каждая ячейка имеет позиционное имя, Error / Caption связаны через aria-describedby, required и invalid доступны программно. Первая ячейка поддерживает one-time-code autocomplete.`,
  checklist: [
    'Поддерживаются 4, 5 и 6 ячеек.',
    'Ввод принимает только цифры и корректно распределяет Paste.',
    'После ввода фокус переходит вперед, Backspace возвращает назад.',
    'Controlled и uncontrolled value работают одинаково.',
    'Error / Disabled / Skeleton сохраняют геометрию Figma.',
    'Medium и Small не меняют типографику на мобильных.',
  ],
});

const phoneInput = componentDoc({
  purpose: `**PhoneInput** — специализированное поле одного телефонного номера на общей основе Input. Поддерживает российский и международный режимы.`,
  anatomy: `Input с переключателем типа номера, mask/placeholder и общей системой Label/Description/Helper. Leading/Trailing управляются самим компонентом и не переопределяются как у обычного Input.`,
  api: `- \`phoneType\`: russian / international;
- \`value / defaultValue\` — нормализованное значение: + и цифры;
- \`onValueChange\` — нормализованное значение;
- \`onPhoneTypeChange\` — смена режима;
- \`open / defaultOpen / onOpenChange\` — Menu типа;
- \`placement / menuMaxHeight\` — popup;
- Required/Error/Disabled/Skeleton наследуют общую модель Input.`,
  variants: `Russian по умолчанию показывает постоянный +7 и российскую mask. International принимает + и международный набор цифр без российской mask.`,
  behavior: `Ввод, paste и Clear нормализуют значение одинаково. Переключение режима не оставляет несовместимую mask. Ошибка обязательности и ошибка формата должны быть различимы по причине.`,
  responsive: `Поле сохраняет типографику Input, занимает ширину родителя и не выходит за контейнер. Skeleton повторяет геометрию заполненного поля.`,
  accessibility: `Menu выбора типа доступно с клавиатуры. Required и validation Error связаны с полем через общую ARIA-модель Input.`,
  checklist: [
    'Во внешнем value нет пробелов, скобок и дефисов.',
    'Российский номер форматируется после paste.',
    'International не получает российскую mask.',
    'Clear возвращает пустое нормализованное значение.',
    'Menu остается внутри viewport.',
  ],
});

const selectionGeometry = `| Элемент | Размеры |
| --- | --- |
| Checkbox / Radio | 24 px, внутренняя фигура 20 px |
| State layer | 32 px, radius-full |
| Checkbox | radius-small, border-small, icon 20 px |
| Radio | radius-full, внутренний круг 12 px |
| Switch | Track 36 × 20; Handle 12 / 16 |
| Control → Text | space-16 |
| Label | Subtitle 16/24 |
| Description | Caption 12/16, gap 4 px |`;

const checkbox = componentDoc({
  purpose: `**Checkbox** — независимый выбор boolean-значения. Поддерживает Indeterminate для частично выбранного набора.`,
  anatomy: `Control может использоваться без текста или с Label/Description через тот же API. Error заменяет Description.`,
  api: `Checkbox — основной публичный компонент. CheckboxControl и CheckboxOption — совместимые алиасы того же SelectionControlProps без отдельной реализации.`,
  variants: `Default/Hover/Focused/Pressed/Disabled, Selected/Unselected, Indeterminate и Error используют семантические state-layer/background/border tokens. Disabled использует -disabled значения.`,
  geometry: selectionGeometry,
  behavior: `Клик по всей строке с Label переключает значение. Tab фокусирует Checkbox, Space переключает; Enter не переключает.`,
  responsive: `Label/Description переносятся, Control сохраняет размер. Label 16/24 не уменьшается на мобильных.`,
  accessibility: `Нативный checkbox. Control без Label требует aria-label. Description/Error связываются через aria-describedby; Indeterminate объявляется как mixed.`,
  checklist: ['Control/Option используют одинаковые состояния.','Disabled блокирует всю строку.','Длинный Label не сжимает Control.','Error и Description не показываются одновременно.','Space переключает, Enter — нет.'],
});

const radio = componentDoc({
  purpose: `**Radio** — выбор одного значения внутри общей RadioGroup.`,
  anatomy: `Control может использоваться без текста или с Label/Description через тот же API. Error заменяет Description.`,
  api: `Radio — основной публичный компонент. RadioControl и RadioOption — совместимые алиасы того же SelectionControlProps.`,
  variants: `Default/Hover/Focused/Pressed/Disabled, Selected/Unselected и Error используют семантические state-layer/background/border tokens.`,
  geometry: selectionGeometry,
  behavior: `Tab входит в radio-набор, Arrow keys перемещают выбор, Space выбирает активный вариант.`,
  responsive: `Label/Description переносятся, Control сохраняет размер. Label 16/24 не уменьшается на мобильных.`,
  accessibility: `Нативный radio; связанные варианты объединяются общим name. Control без Label требует aria-label; Description/Error — aria-describedby.`,
  checklist: ['Control/Option используют одинаковые состояния.','В группе выбран максимум один вариант.','Disabled пропускается клавиатурой.','Длинный Label не сжимает Control.','Arrow keys работают внутри группы.'],
});

const switchControl = componentDoc({
  purpose: `**Switch** — немедленное включение или выключение boolean-настройки.`,
  anatomy: `В SwitchOption Label расположен слева, Switch справа. Description/Error относятся к текстовой части; Error заменяет Description.`,
  api: `Switch — основной публичный компонент. SwitchControl и SwitchOption — совместимые алиасы того же SelectionControlProps.`,
  variants: `Off/On + Default/Hover/Focused/Pressed/Disabled/Error используют семантические tokens. Track Off — base-tertiary, On — primary-default; Handle использует base-default и disabled-варианты.`,
  geometry: selectionGeometry,
  behavior: `Клик по строке переключает значение. Tab фокусирует Switch, Space и Enter переключают.`,
  responsive: `Label/Description переносятся, Switch сохраняет размер и остается справа. Label 16/24 не уменьшается на мобильных.`,
  accessibility: `Используется role=switch с программно доступным checked-state. Control без Label требует aria-label; Description/Error связываются через aria-describedby.`,
  checklist: ['Off/On используют правильные tokens.','Disabled блокирует строку.','Label переносится без сжатия Switch.','Space и Enter переключают.','Error остается доступным текстом.'],
});

function selectionGroup(kind: string, single: boolean) {
  return componentDoc({
    purpose: `**${kind}Group** объединяет связанные ${kind}Option и управляет групповым Label/Description/Error и layout.`,
    anatomy: `Group Label/Description → список options → Group Error. Индивидуальный Error option остается внутри строки и не подменяет Group Error.`,
    api: `Группа поддерживает controlled/uncontrolled value, disabled, direction и Position Up/Left. Дочерние options сохраняют собственные props.`,
    variants: `Row/Column меняют layout. Disabled группы блокирует дочерние controls. Group Error и option Error независимы.`,
    geometry: `Gap от заголовка до options, между строками и до Group Error — space-16. В Row между options — space-24. Position Left: Label 116 px, gap space-20.`,
    behavior: single ? 'Выбран максимум один Radio; клавиатурная модель следует нативной radio-группе.' : 'Options меняются независимо и группа сообщает актуальное значение родителю.',
    responsive: `Row перестраивается в Column на мобильной ширине без сброса выбора. Position Left переходит в заголовок сверху.`,
    accessibility: `Группа имеет доступное имя и связывает Group Error с набором controls. Дочерние элементы сохраняют нативную семантику ${kind}.`,
    checklist: ['Group Error не заменяет option Error.','Responsive не сбрасывает выбор.','Disabled группы блокирует options.','Label группы остается доступным именем.'],
  });
}

function linkDoc(button: boolean) {
  return componentDoc({
    purpose: button
      ? '**ButtonLink** — текстовое локальное действие. Для перехода используйте Link, для основного действия — Button.'
      : '**Link** — текстовая ссылка для перехода на страницу, документ или якорь. Для локального действия используйте ButtonLink.',
    anatomy: `Text + опциональные Leading/Trailing Icon. Decoration применяется только к тексту.`,
    api: `- \`size\`: small / medium / large / giant;
- \`color\`: base / primary / accent / neutral / inverse;
- \`decoration\`: solid / dashed / dotted / null;
- \`typography\`: fixed / inherit;
- Leading/Trailing Icon, Disabled и Skeleton.`,
    variants: `Hover/Pressed/Disabled используют соответствующие semantic tokens; Focused сохраняет базовые цвета и добавляет внешнюю border-large.`,
    geometry: `| Size | Text | Icon |
| --- | --- | --- |
| Small | Caption Base | 16 |
| Medium | Body Base | 20 |
| Large | Subtitle Base | 24 |
| Giant | Subtitle Strong | 28 |

Gap — space-8. Decoration: border-small с offset space-2. Focus не меняет layout-размер.`,
    behavior: button
      ? 'ButtonLink рендерится нативным button, поддерживает Enter/Space и по умолчанию type=button.'
      : 'Link рендерится нативной ссылкой. Disabled убирает href, ставит aria-disabled и исключает ссылку из Tab.',
    responsive: `fixed сохраняет size. \`typography="inherit"\` наследует font/size/line-height окружающего текста, включая mobile-стили; Icons масштабируются до 1em.`,
    accessibility: button
      ? 'ButtonLink сохраняет button-семантику; Disabled использует нативный disabled.'
      : 'Link активируется Enter и должен иметь понятное название перехода.',
    checklist: ['Размеры/цвета используют правильные tokens.','Decoration не затрагивает Icon.','Focus не сдвигает layout.','typography=inherit совпадает с абзацем.','Disabled не активируется.'],
  });
}

const buttonToggle = componentDoc({
  purpose: `**ButtonToggle** — сегментированный переключатель одного обязательного значения. Используйте для двух-трех равнозначных вариантов.`,
  anatomy: `Container + 2–3 сегмента Button + Divider только между двумя неактивными соседями.`,
  api: `Уникальные items value/label, controlled/uncontrolled value, color primary/base/inverse, size small/medium, disabled сегментов и name формы.`,
  variants: `Один сегмент выбран всегда. Primary: active Primary / inactive Secondary. Base: active Secondary / inactive Base. Inverse: active Inverse / inactive Secondary.`,
  geometry: `Small 32 px, Medium 40 px наследуют Button. Внешняя border-small, radius-middle.`,
  behavior: `Arrow keys и Home/End переключают доступные сегменты, Disabled пропускаются. Повторная активация выбранного сегмента не снимает выбор.`,
  responsive: `Компонент остается в одну строку. Если варианты не помещаются, используйте другой control вместо уменьшения текста.`,
  accessibility: `Container role=radiogroup, segments role=radio + aria-checked. Tab входит на выбранный сегмент.`,
  checklist: ['Передано 2–3 уникальных value.','Выбран один доступный сегмент.','Divider только между неактивными соседями.','Arrow/Home/End меняют выбор и фокус.'],
});

const divider = componentDoc({
  purpose: `**Divider** — декоративная линия для визуального разделения блоков, строк и групп.`,
  anatomy: `Одна horizontal или vertical линия без интерактивных частей.`,
  api: `- \`orientation\`: horizontal / vertical;
- \`inset\`: любое неотрицательное число px, по умолчанию 0.`,
  geometry: `Толщина — border-small (1 px), цвет — border-base-tertiary. inset добавляется к границам контента родителя и не дублирует его padding.`,
  responsive: `Divider следует доступной ширине/высоте родителя и автоматически учитывает изменение его padding.`,
  accessibility: `Декоративный компонент скрыт от screen reader и не получает фокус.`,
  checklist: ['inset=0 совпадает с границами контента.','Inset не ограничен Figma-пресетами.','Толщина остается 1 px.','Обе orientation не интерактивны.'],
});

const tooltip = componentDoc({
  purpose: `**Tooltip** — краткое пояснение к Icon, статусу, сокращению или обрезанному тексту. Не используйте для Error, важной информации или интерактивного содержимого.`,
  anatomy: `Portal-поверхность с коротким текстом; Arrow по умолчанию отсутствует.`,
  api: `placement, trigger hover/focus/hover+focus, delayShow 200 ms, delayHide 120 ms и варианты ширины String / Area / Area max.`,
  variants: `String подстраивается под текст, Area — 216 px, Area max — 288 px с ограничением viewport.`,
  geometry: `background-base-inverse, text-base-inverse, Caption Base, padding space-8, radius-small, shadow-m.`,
  behavior: `Hover/focus показывают Tooltip с задержкой. Hover по самому Tooltip сохраняет его. Placement пересчитывается у края viewport и при scroll.`,
  responsive: `Ширина ограничивается viewport; длинные слова переносятся внутри.`,
  accessibility: `Trigger связывается через aria-describedby. Tooltip не перехватывает фокус; Disabled trigger не показывает подсказку.`,
  checklist: ['Все ширины помещаются во viewport.','Hover и keyboard focus показывают Tooltip.','aria-describedby связывает trigger.','Размонтирование удаляет portal/timers.'],
});

const accordion = componentDoc({
  purpose: `**Accordion** показывает и скрывает раздел внутри страницы.`,
  anatomy: `Header — одна кнопка с Title, опциональным Description и Chevron справа. Content содержит произвольные компоненты; Content Divider показывается только внутри открытой панели.`,
  api: `controlled expanded или defaultExpanded, callbacks, size medium/large, Title/Description/children, headingLevel, disabled/state.`,
  variants: `Header: Default transparent, Hover/Pressed background, Focused state layer, Disabled disabled colors. Medium/Large различаются типографикой и spacing.`,
  geometry: `| Параметр | Medium | Large |
| --- | --- | --- |
| Title | Subtitle Strong | H3 Heading |
| Description | Body Base | Body Base |
| Header padding Y / L / R | 16 / 16 / 8 | 24 / 32 / 24 |
| Gap до Chevron | 16 | 24 |
| Gap Title → Description | 4 | 8 |
| ButtonIcon / Icon | 40 / 24 | 40 / 24 |`,
  behavior: `Click по Header, Enter и Space переключают раскрытие. Disabled сохраняет текущее состояние и блокирует переключение.`,
  responsive: `Large на мобильных использует spacing Medium, но H3 сохраняет 20/28. Длинные слова используют overflow-wrap:anywhere.`,
  accessibility: `Header сообщает aria-expanded/aria-controls, hidden Content исключается из Tab. headingLevel выбирается по структуре страницы.`,
  checklist: ['Title переносится, Chevron сохраняет 40 × 40.','Все состояния работают в обоих размерах.','Content Divider скрыт с Content.','Hidden Content не содержит Tab-controls.'],
});

const accordionGroup = componentDoc({
  purpose: `**AccordionGroup** объединяет связанные Accordion и управляет количеством одновременно открытых панелей.`,
  anatomy: `Список Accordion. Group Divider между соседями принадлежит группе; Content Divider — отдельному Accordion.`,
  api: `- \`multiple\`: false / true;
- \`value / defaultValue\` — массив id;
- callbacks изменения;
- \`gap\` — любое неотрицательное число px.`,
  variants: `multiple=false — максимум один открытый раздел; multiple=true — несколько. Полностью закрытая группа допустима в обоих режимах.`,
  geometry: `gap=0 показывает Group Divider, gap>0 скрывает его и задает расстояние между Accordion.`,
  behavior: `В single открытие новой панели закрывает предыдущую; повторная активация открытой панели закрывает ее.`,
  responsive: `Группа наследует адаптив Accordion; gap не меняет размеры Header.`,
  accessibility: `Каждый Accordion сохраняет собственные aria-expanded/aria-controls; группа не добавляет лишнюю интерактивную роль.`,
  checklist: ['Single закрывает предыдущую панель.','Multiple сохраняет остальные.','Group/Content Divider независимы.','Disabled Accordion не меняет состояние.'],
});

const breadcrumbs = componentDoc({
  purpose: `**Breadcrumbs** отражает иерархию текущей страницы, а не историю переходов. Показывается начиная с двух уровней.`,
  anatomy: `Nav → список уровней. Previous — Link Neutral Small, Current — текст с aria-current=page, separators — декоративные Chevron; на глубокой mobile-цепочке появляется Ellipsis.`,
  api: `Breadcrumbs — основной компонент. Breadcrumb — совместимый алиас без отдельной логики. API: items / aria-label / isLoading / className.`,
  geometry: `Caption Base, gap space-4, Chevron 16 px, icon-base-secondary. Current text-base-default, Ellipsis text-base-secondary.`,
  behavior: `Последний уровень не ссылка. Цепочка в одну строку; длинный текст сокращается ellipsis, полное название остается в DOM/title.`,
  responsive: `До трех уровней на мобильном показываются все; глубже — Ellipsis + Previous + Current. Previous max 30%, Current max 40% доступной ширины.`,
  accessibility: `Nav имеет доступное имя, Current — aria-current=page. Hidden mobile-уровни исключаются из DOM и Tab.`,
  checklist: ['Один уровень скрывает компонент.','Current не ссылка.','Длинный текст не создает overflow.','Mobile-сокращение не оставляет скрытые Tab-links.'],
});

const tabs = componentDoc({
  purpose: `**Tabs** переключает связанные разделы внутри одной страницы. В каждый момент выбран один Tab.`,
  anatomy: `Tablist + Tabs с Text/Icon/Badge + связанный tabpanel. При overflow появляются navigation arrows.`,
  api: `Tabs управляет items/value/callbacks/keyboard/overflow/tabpanel. Tab — низкоуровневый публичный control с selected/icon/badge/state.`,
  variants: `Text / Icon / Text+Icon; Selected меняет нижнюю линию на Primary. Disabled использует disabled tokens; Hover/Focused/Pressed — state-layer.`,
  geometry: `Высота 48 px, padding Y 12. Text X 16, icon-only X 12. Icon 24 px, Text Body Strong с X padding 8, Badge left 4. Bottom border-middle.`,
  behavior: `Arrow/Home/End перемещают фокус, Enter/Space активируют. Focus не меняет selection. Overflow поддерживает arrows/scroll/swipe и прокручивает selected Tab в видимую область.`,
  responsive: `Высота/типографика сохраняются; при нехватке ширины используется horizontal overflow, а не уменьшение текста.`,
  accessibility: `role=tablist/tab/tabpanel, aria-selected/aria-controls. При входе фокус попадает на selected Tab.`,
  checklist: ['Tabs связаны с tabpanel.','Arrow/Home/End меняют только фокус.','Enter/Space меняют выбор.','Overflow позволяет добраться до каждого Tab.','Disabled пропускается.'],
});

const pagination = componentDoc({
  purpose: `**Pagination** — навигация по страницам с опциональным Counter. ButtonPagination — низкоуровневая специализация Button Small.`,
  anatomy: `Counter + nav с Previous/Next, ButtonPagination и Ellipsis. Skeleton заменяет только отображаемые части.`,
  api: `totalElements, size элементов на странице, page с 1, onChangePage, direction, color, showCounter=true, isLoading. ButtonPagination наследует Button props с фиксированным small size.`,
  variants: `0 элементов скрывает компонент. 1 страница показывает только Counter. 2–4 страницы без arrows, от 5 — Previous/Next. Selected — Primary, остальные Base/Inverse.`,
  geometry: `Button: height/min-width 32, padding Y 8 / X 4, radius-middle, Caption Strong. Counter Body Base. Gap кнопок 4 px, Counter → nav 24 px.`,
  behavior: `Counter from–to из totalElements. Horizontal до 6 номеров, Vertical/узкий контейнер до 4. Первая/последняя/текущая сохраняются, Ellipsis не фокусируется. Previous/Next Disabled на краях.`,
  responsive: `Количество соседних страниц зависит от доступной ширины и фактической ширины чисел; узкий layout ставит Counter сверху без уменьшения шрифта.`,
  accessibility: `Nav имеет имя, текущая кнопка aria-current=page. Tab/Enter/Space нативны. Disabled/Loading не вызывают onChangePage.`,
  checklist: ['Проверены 0, 1, 2–4 и много страниц.','Counter корректен на последней странице.','Нет дублирующих Ellipsis.','Arrows блокируются на краях.','Long Numbers не создают overflow.'],
});

const docs: Record<string, string> = {
  Autocomplete: autocomplete,
  AsyncAutocomplete: asyncAutocomplete,
  AsyncMultiselect: asyncMultiselect,
  Highlight: highlight,
  Icon: icon,
  InfoBlock: infoBlock,
  Multiselect: multiselect,
  CodeInput: codeInput,
  PhoneInput: phoneInput,
  Checkbox: checkbox,
  Radio: radio,
  Switch: switchControl,
  CheckboxGroup: selectionGroup('Checkbox', false),
  RadioGroup: selectionGroup('Radio', true),
  SwitchGroup: selectionGroup('Switch', false),
  Link: linkDoc(false),
  ButtonLink: linkDoc(true),
  ButtonToggle: buttonToggle,
  Divider: divider,
  Tooltip: tooltip,
  Accordion: accordion,
  AccordionGroup: accordionGroup,
  Breadcrumbs: breadcrumbs,
  Tabs: tabs,
  Pagination: pagination,
};

export function componentDocs(name: string) {
  return docs[name];
}
