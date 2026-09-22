const states = `### Состояния и проверка

В Controls можно зафиксировать Default, Hover, Focused, Pressed, Disabled и Skeleton. Default реагирует на мышь и клавиатуру; фиксированные образцы сохраняют выбранное состояние.

- Проверьте размеры, отступы и цвета в примере «Все состояния» или «Цвета и состояния».
- Сравните реальное наведение, нажатие и клавиатурный фокус с образцами.
- Disabled не выполняет действие и не входит в Tab-порядок.
- Skeleton не содержит интерактивных элементов.
`;
const selection = `### Структура и применение

Control — элемент без текста. Option — тот же контрол с label и необязательным description. Group — заголовок, описание, список опций и отдельная ошибка группы. Для Control без текста задайте aria-label; Option получает имя из label. Ошибка опции заменяет ее description, ошибка группы отображается под списком.

| Элемент | Токены и размеры |
| --- | --- |
| Checkbox / Radio | --elements-24, внутренняя фигура --elements-20 |
| State layer | --elements-32, радиус --radius-full |
| Checkbox | --radius-small, --border-small; иконка 20 × 20 |
| Radio | --radius-full; внутренний круг --elements-12 |
| Switch | Track 36 × 20; Handle Off 12, On 16; radius-full |
| Контрол → текст | --space-16 |
| Подпись | Subtitle: --page-subtitle-size / --page-subtitle-line-height, базовый вес |
| Описание | Caption Base; отступ --space-4 |
| Заголовок группы | Subtitle Strong |
| Заголовок → опции, между строками, до ошибки | --space-16 |
| Между опциями в строке | --space-24; на мобильном column |

В SwitchOption подпись расположена слева, переключатель справа, с отступом сверху space-2. Длинные слова переносятся через overflow-wrap:anywhere; обычные слова остаются целыми. Высота строки определяется содержимым.

### Токены состояния

| Вариант | Фигура | Индикатор / border | State layer |
| --- | --- | --- | --- |
| Не выбран | прозрачный; Checkbox Disabled — background-base-secondary-disabled | border-base-default / border-base-default-disabled | transparent-background-base-* |
| Выбран | background-primary-default / background-primary-default-disabled | Checkbox: icon-primary-default / icon-primary-default-disabled; Radio: background-primary-default / disabled | transparent-background-primary-* |
| Ошибка | background-error-default / background-error-default-disabled | icon-error-inverse / icon-error-inverse-disabled; border-error-default / border-error-disabled | transparent-background-error-* |
| Switch Off | background-base-tertiary / background-base-tertiary-disabled | Handle: background-base-default / background-base-default-disabled | transparent-background-base-* |
| Switch On | background-primary-default / background-primary-default-disabled | Handle: background-base-default / background-base-default-disabled | transparent-background-primary-* |

Звездочка обозначает hover, focused или pressed. State layer — круг вокруг Checkbox/Radio и вокруг Handle у Switch. Checkbox Unselected Error в Default имеет background-error-secondary; при взаимодействии фон прозрачный, в Disabled — background-error-secondary-disabled.

Подпись: text-base-default, disabled — text-base-default-disabled. Описание: text-base-secondary. Ошибка: text-error-secondary. Disabled использует соответствующий токен с суффиксом -disabled.

### Клавиатура и ошибки

Checkbox: Tab и Space; Enter не переключает. Radio: Tab входит в группу, стрелки переключают выбор, Space выбирает. Switch: Tab, Space и Enter. Для форм используются нативные input; Radio объединяется общим name. Ошибка и описание программно связаны с контролом или группой. Indeterminate выставляется через prop и объявляется как mixed.

### Чеклист

- Подпись и описание переносятся, контрол сохраняет размеры.
- Клик по всей строке меняет значение; Disabled блокирует всю строку.
- Checkbox поддерживает независимый выбор и Indeterminate; Radio — только один выбор; Switch — boolean.
- Групповые и индивидуальные ошибки не подменяют друг друга.
- Position Up / Left управляет положением заголовка группы. Left: ширина подписи 116 px, gap space-20; на мобильном заголовок сверху. Row перестраивается на мобильном, выбранные значения сохраняются.
- Control без подписи имеет aria-label; ошибку можно найти через aria-describedby.

### Уточнения по актуальному макету

Подпись опции — Subtitle 16/24 на всех ширинах экрана, без верхнего отступа; иконка Checkbox — 20 × 20. Эти параметры заменяют Body 14, отступ 2 и иконку 24 из текстовой спецификации.
`;
const links = `Текстовая ссылка для перехода на страницу или якорь; ButtonLink — локальное действие: раскрытие деталей, фильтров, дополнительной информации. Для основного действия используйте Button.

| Размер | Текст | Иконка |
| --- | --- | --- |
| Small | Caption Base | 16 |
| Medium | Body Base | 20 |
| Large | Subtitle Base | 24 |
| Giant | Subtitle Strong | 28 |

Typography: fixed (по умолчанию) сохраняет размер из size на всех ширинах. Для ссылки внутри текста задайте typography="inherit": шрифт, начертание, размер и межстрочный интервал наследуются от абзаца, включая его мобильные стили; size при этом не задает размер текста. Link переносится вместе с абзацем. ButtonLink остается нативной кнопкой со внутренним переносом текста. Иконки слева и справа масштабируются до 1em вместе с текстом. Skeleton наследует тот же текстовый стиль и размер иконок, сохраняя межстрочный интервал абзаца. Режим доступен у Link и ButtonLink.

Gap — space-8. Иконки слева и справа необязательны. Decoration: solid, dashed, dotted или null. Подчеркивание применяется только к тексту через text-decoration, толщина border-small, отступ space-2; цвет совпадает с текстом.

| Color | Текст | Иконка | Focus |
| --- | --- | --- | --- |
| Base | text-base-default | icon-base-secondary | border-base-default-focused |
| Primary | text-base-default | icon-primary-secondary | border-primary-focused |
| Accent | text-accent-secondary | icon-accent-secondary | border-accent-focused |
| Neutral | text-base-secondary | icon-base-secondary | border-base-default-focused |
| Inverse | text-base-inverse | icon-base-inverse-secondary | border-white-focused |

Hover / Pressed / Disabled используют соответствующие токены с суффиксами -hover / -pressed / -disabled. Focused сохраняет базовые цвета; внешняя рамка border-large не меняет геометрию.

Link использует a и активируется Enter; ButtonLink использует button, поддерживает Enter и Space, по умолчанию type=button. Disabled Link лишается href, получает aria-disabled и исключается из Tab-порядка; Disabled ButtonLink использует нативный disabled.

### Чеклист

- Все четыре размера и пять цветов соответствуют таблице.
- Underline не затрагивает иконки; null скрывает линию.
- Focused не меняет цвет текста и не сдвигает соседей.
- Link выполняет навигацию; ButtonLink вызывает локальное действие без изменения URL.
- Disabled не активируется ни мышью, ни клавиатурой.
`;
const docs:Record<string,string>={
 Checkbox:selection, Radio:selection, Switch:selection, CheckboxGroup:selection, RadioGroup:selection, SwitchGroup:selection,
 Link:links,ButtonLink:links,
 ButtonToggle:`Сегментированный переключатель одного обязательного значения. Используйте для двух или трех равнозначных вариантов; для разделов страницы используйте Tabs, для большего числа вариантов — Select или Chips.

Состав: общий Container, сегменты Button и разделитель между двумя неактивными сегментами. Один сегмент выбран всегда; повторная активация не снимает выбор. Размеры Small 32 и Medium 40 наследуются от Button. Рамка border-small снаружи, radius-middle; компонент остается в одной строке.

| Color | Активный Button | Неактивный Button | Рамка | Разделитель |
| --- | --- | --- | --- | --- |
| Primary | Primary | Secondary | border-primary-default | background-base-default |
| Base | Secondary | Base | border-white-full | background-base-secondary |
| Inverse | Inverse | Secondary | border-base-inverse | background-base-default |

Container: role=radiogroup с доступным названием. Сегменты: role=radio и aria-checked. Tab входит на выбранный сегмент; стрелки и Home/End переключают доступные варианты. Disabled пропускается. Для отправки значения формой задайте name.

### Чеклист

- Передайте ровно 2–3 уникальных value; выбран всегда один сегмент.
- Проверьте оба размера и все цвета.
- Разделитель виден только между неактивными соседями.
- Стрелки меняют выбор и фокус, повторный клик сохраняет выбор.
- При нехватке места выберите другой компонент в макете.
`,
 Divider:`Линия для визуального разделения блоков, строк и групп элементов. Компонент декоративный, скрыт от экранного диктора.

| Property | Значения |
| --- | --- |
| orientation | horizontal / vertical |
| inset | Любое неотрицательное число в px; по умолчанию 0 |
| Толщина | border-small — 1 px |
| Цвет | border-base-tertiary |

По умолчанию линия выравнивается по границам контента родителя: Horizontal заполняет его доступную ширину, Vertical — доступную высоту flex-контейнера. Padding родителя уже учитывается версткой и не дублируется внутри Divider. При изменении отступов родителя, в том числе в адаптиве, линия следует за ними.

Inset добавляет отступ с обоих концов относительно границ контента родителя: слева и справа у Horizontal, сверху и снизу у Vertical. Например, при padding родителя 24 и inset=12 линия начинается в 36 px от его внешней границы. Значения 16 и 24 в макете — быстрые варианты для работы в Figma, а не ограничения API. Можно задать 8, 32, 37.5 или другое число.

### Чеклист

- Линия толщиной 1 px, цвет токена border-base-tertiary.
- При inset=0 линия совпадает с границами контента родителя, без двойного отступа.
- Числовой inset добавляет заданный отступ; значения не ограничены 16 и 24.
- При изменении padding родителя линия перестраивается автоматически.
- Horizontal и Vertical не получают фокус и не объявляются действием.
`,
 Tooltip:`Краткое пояснение к иконке, статусу, сокращению или обрезанному тексту. Не используйте для ошибок, важной информации или интерактивного содержимого. Можно передать короткий форматированный текст.

Фон background-base-inverse; текст text-base-inverse, Caption Base; padding space-8, radius-small, shadow-m. String подстраивается под текст, Area — 216 px, Area max — 288 px с ограничением по ширине viewport. Длинные слова переносятся внутри.

placement задает желаемую сторону и выравнивание. При нехватке места сторона меняется, положение сдвигается внутрь viewport; при прокрутке обновляется. Подсказка рендерится поверх контента через portal.

trigger: hover, focus или hover+focus (по умолчанию). delayShow=200 ms, delayHide=120 ms. Уход указателя/фокуса скрывает подсказку; при наведении на саму подсказку она остается видна. Escape не закрывает ее — согласно спецификации. Arrow по умолчанию отсутствует. Элемент должен поддерживать aria-describedby; Tooltip не перехватывает фокус.

### Чеклист

- Сравните три ширины и перенос длинных слов.
- Hover и клавиатурный фокус показывают подсказку с задержкой.
- Подсказка связана с триггером через aria-describedby.
- У края окна подсказка остается внутри viewport.
- Disabled блокирует показ; размонтирование удаляет portal и таймеры.
`,
 Accordion:`Показывает и скрывает раздел внутри страницы. Header — единая кнопка с Title, необязательным Description и декоративной частью ButtonIcon справа. Content может содержать текст, формы и другие компоненты. Интерактивные элементы размещаются в Content.

| Параметр | Medium | Large |
| --- | --- | --- |
| Title | Subtitle Strong | H3 Heading |
| Description | Body Base | Body Base |
| Header padding Y / left / right | 16 / 16 / 8 | 24 / 32 / 24 |
| Gap до ButtonIcon | 16 | 24 |
| Gap Title → Description | 4 | 8 |
| ButtonIcon / иконка | 40 / 24 | 40 / 24 |

На мобильном у Large уменьшаются отступы до Medium; заголовок сохраняет H3 20/28. Размер шрифта и межстрочный интервал внутри компонентов не зависят от ширины экрана. Высота растет по контенту; слова переносятся через overflow-wrap:anywhere. Компонент заполняет ширину и не задает внешнюю рамку или тень. Content Divider использует Divider Full, border-small и border-base-tertiary и показывается только внутри открытой панели.

Header: Default прозрачный; Hover background-base-default-hover; Focused transparent-background-base-focused; Pressed background-base-default-pressed; Disabled background-base-default-disabled. Title text-base-default, Description text-base-secondary; Disabled использует соответствующие -disabled. Chevron icon-base-secondary, Disabled icon-base-default-disabled по актуальному макету.

Клик по Header, Enter и Space переключают раскрытие. aria-expanded сообщает состояние, aria-controls связывает Header и Content. Свернутая область hidden и недоступна по Tab. Для уровня заголовка используется headingLevel. Можно управлять expanded извне или задать defaultExpanded.

### Чеклист

- Заголовок переносится, Chevron остается 40 × 40 справа.
- Все пять состояний, Medium/Large и мобильный переход.
- Клик по любой части Header выполняет одно переключение.
- Content Divider скрыт вместе с Content.
- Скрытый Content не оставляет доступных ссылок и полей.
- Disabled сохраняет текущее раскрытие и блокирует переключение.
`,
 AccordionGroup:`Группа связанных Accordion. Использует готовые Accordion и Divider.

multiple=false оставляет открытым максимум один раздел; multiple=true позволяет раскрывать независимо. Повторный клик закрывает раздел в обоих режимах, допускается полностью закрытая группа. value / defaultValue — массив идентификаторов.

gap задается произвольным неотрицательным числом в пикселях; по умолчанию 0. В Controls доступен числовой ввод. Group Divider показывается между соседними Accordion при нулевом gap независимо от раскрытия; при положительном gap разделители отсутствуют.

### Чеклист

- Single закрывает предыдущую панель; Multiple сохраняет остальные.
- Закрытие последней панели оставляет пустой выбор.
- Group Divider и Content Divider работают независимо.
- Disabled-элементы не меняют состояние.
`,
 Breadcrumbs:`Навигационная цепочка отражает иерархию, а не историю переходов. Показывается начиная с двух уровней. Предыдущие уровни — Link Neutral Small без подчеркивания; текущий уровень — обычный текст с aria-current=page.

Типографика Caption Base. Gap space-4; разделитель arrow-chevron-right 16 × 16, icon-base-secondary. Текущий текст text-base-default, Ellipsis text-base-secondary. Nav имеет доступное название; список ul/li. Разделители декоративны, Ellipsis не интерактивен.

Цепочка остается в одну строку. Текст сокращается CSS ellipsis, полное название хранится в DOM и title. На мобильном до трех уровней отображаются все; больше трех — Ellipsis, предыдущий и текущий. Previous занимает максимум 30%, Current — 40% доступной ширины. Скрытые ссылки исключаются из DOM и Tab-порядка.

### Чеклист

- Один уровень скрывает компонент; последний не является ссылкой.
- Tab / Enter работают только на Previous.
- Длинный текст не выходит за контейнер, title содержит полное название.
- На мобильном глубокая цепочка сокращается, Ellipsis ничего не раскрывает.
`,
 Tabs:`Переключение связанных разделов внутри страницы. В один момент выбран один Tab. Варианты: текст, иконка, текст+иконка; Badge необязателен. Основа использует Icon, Badge и Skeleton.

Высота 48, padding Y=12; текстовый Tab X=16, icon-only X=12. Иконка 24; обертка с текстом добавляет справа 4, icon-only — по 4 с каждой стороны. Текст Body Strong с горизонтальным padding 8. Badge добавляет слева 4. Gap=0. Нижняя линия border-middle; обычная border-base-secondary, выбранная border-primary-default. Disabled — соответствующий -disabled.

Текст text-base-default, иконка icon-base-default; Disabled использует -disabled. Выбор не меняет текст и Badge. State layer: transparent-background-base-hover/focused/pressed; у выбранного — transparent-background-primary-*. Анимаций нет.

Контейнер role=tablist; Tab role=tab, aria-selected, aria-controls. Стрелки и Home/End перемещают фокус; Enter/Space активируют. Фокус сам по себе не переключает контент. При входе фокус на выбранной вкладке. При переполнении появляются стрелки 32 × 48, доступна прокрутка и свайп. Выбранный Tab прокручивается в видимую область; недоступные направления блокируются.

### Чеклист

- Вкладки связаны со своими tabpanel, скрытые панели исключены из навигации.
- Стрелки меняют фокус, Enter/Space меняют выбор.
- Повторная активация выбранной вкладки не вызывает изменение.
- Badge меняется только в Disabled, текст остается Body Strong.
- Overflow показывает стрелки и позволяет добраться до каждой вкладки.
`,
 Pagination:`Навигация по страницам с необязательным Counter. Структура: ButtonPagination, Previous/Next, неинтерактивные Ellipsis, Counter. ButtonPagination наследует Button; Skeleton заменяет только отображаемые части.

Props: totalElements, size (элементов на странице), page (с 1), onChangePage, direction, color, showCounter=true, isLoading. Число страниц ceil(totalElements/size). При нуле элементов компонент скрыт. Одна страница показывает только Counter; showCounter=false скрывает весь компонент. 2–4 страницы отображаются без стрелок. От 5 — Previous и Next, недоступные направления Disabled.

Кнопки: height/min-width elements-32, padding Y space-8 / X space-4, radius-middle. Текст Caption Strong; ширина увеличивается по числу. Выбранная кнопка Primary, остальные Base или Inverse. Состояния наследуют токены Button. Counter Body Base, text-base-secondary; Inverse text-base-inverse. Gap между кнопками space-4; между Counter и навигацией space-24.

Counter: «from—to из totalElements», последнее значение не превышает totalElements. Например: 91—95 из 95. Ellipsis обозначает пропущенные страницы и не получает фокус.

Horizontal: максимум 6 номеров, первая/последняя/текущая сохраняются. Vertical и узкий контейнер: максимум 4, Counter сверху. При длинных номерах соседей становится меньше с учетом фактической ширины текста. Начало: 1 2 3 4 5 … 40; середина: 1 … 24 25 26 … 40; конец: 1 … 36 37 38 39 40.

Nav имеет имя, текущая кнопка aria-current=page. Tab перемещает фокус; Enter/Space активируют. Disabled и Loading не вызывают onChangePage.

### Чеклист

- Ноль, одна, 2–4 и много страниц; границы диапазона Counter.
- Первые/средние/последние страницы, отсутствие дублирующих Ellipsis.
- Previous/Next блокируются на краях.
- Long Numbers остаются внутри контейнера.
- showCounter и isLoading работают независимо.
- Фокус внешний, кнопки не меняют размер от состояния.
`,
};
export function componentDocs(name:string){return docs[name] + (['Link','ButtonLink','Checkbox','Radio','Switch'].includes(name)?'\n'+states:'') + '\n### Проверки реализации\n\nПоведение проверяется модульными тестами с нативными событиями и axe. Браузерные проверки покрывают клавиатуру, геометрию и основные сценарии адаптива. Полный ручной чеклист приведен выше; отметки исходной спецификации не считаются результатами проверки этой реализации.\n';}
