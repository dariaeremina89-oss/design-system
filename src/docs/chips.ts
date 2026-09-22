export const chipsDocs = `
**Chips** — единый компактный компонент для выбора, фильтрации, тегов и статусов. Статусные цвета входят в этот же компонент.

### Применение

Используйте для коротких значений, фильтров, категорий и статусов. Для основного действия используйте Button, для большого списка вариантов — Select. Значение должно быть понятно по тексту, а не только по цвету.

### Состав и API

- Обязательный однострочный \`text\`, опциональные \`iconLeft\` и \`iconRight\` из набора Icon.
- \`color\`: secondary, base, primary, success, accent, warning, error, inverse.
- \`size\`: small / medium; \`shape\`: round / square.
- \`state\`: default, hover, pressed, focused, disabled, skeleton. \`disabled\` блокирует все действия.
- \`selected\` или \`defaultSelected\` включает режим выбора; \`onSelectedChange\` возвращает новое значение. Выбранный Chips всегда Primary; невыбранный — Base или Secondary, заданный через color. Остальные цвета предназначены для меток и действий без выбора.
- \`interactive\` или \`onClick\` включает действие без выбора. Без выбора и действия Chips — информационная метка вне порядка табуляции.
- \`onRemove\` добавляет отдельный ButtonIcon 16 без padding. Правая иконка становится действием удаления; по умолчанию cross_circle. \`removeLabel\` задает его доступное имя.
- \`skeletonWidth\` задает ширину скелетона; по умолчанию 57 для Small и 65 для Medium.

### Размеры

| Параметр | Small | Medium |
| --- | --- | --- |
| Высота | --elements-24 | --elements-32 |
| Padding контейнера Y / X | --space-4 / --space-8 | --space-6 / --space-8 |
| Padding текста Y / X | --space-0 / --space-4 | --space-2 / --space-8 |
| Иконки | --elements-16 | --elements-16 |
| Типографика | Caption Base, 12/16 | Caption Base, 12/16 |

Round — --radius-full; Square — --radius-small. Отдельного gap между слотами нет: расстояние до иконок задает padding текста. Текст занимает одну строку и обрезается многоточием при ограниченной ширине. Иконки не сжимаются. Размеры и типографика не меняются на мобильном.

### Цвета и состояния

| Color | Background | Text | Icon | Focus |
| --- | --- | --- | --- | --- |
| Secondary | --background-base-secondary | --text-base-default | --icon-base-default | --border-base-default-focused |
| Base | --background-base-default | --text-base-default | --icon-base-default | --border-base-default-focused |
| Primary | --background-primary-default | --text-primary-default | --icon-primary-default | --border-primary-focused |
| Success | --background-success-secondary | --text-success-default-light | --icon-success-secondary | --border-success-focused |
| Accent | --background-accent-secondary | --text-accent-default-light | --icon-accent-secondary | --border-accent-focused |
| Warning | --background-warning-secondary | --text-warning-default-light | --icon-warning-secondary | --border-warning-focused |
| Error | --background-error-secondary | --text-error-default-light | --icon-error-secondary | --border-error-focused |
| Inverse | --background-base-inverse | --text-base-inverse | --icon-base-inverse | --border-base-inverse-focused |

Hover и Pressed используют соответствующие суффиксы фона -hover и -pressed; текст и иконки сохраняют цвет. Исключение актуального макета: Inverse / Pressed сохраняет --background-base-inverse. Disabled использует суффикс -disabled для фона, текста и иконок. Focused добавляет внешнюю обводку --border-large без изменения размера. Информационные метки не реагируют на наведение.

На фоне Default используйте Secondary для невыбранных чипсов; на фоне Secondary — Base. Цвет задается явно, компонент не определяет фон родителя автоматически.

### Поведение и доступность

Интерактивная часть — нативный button: Tab переводит фокус, Enter / Space активируют. Выбор озвучивается через aria-pressed. Disabled исключен из табуляции. Действие удаления — отдельная соседняя кнопка, не вложенная в основную, и не переключает выбор. Декоративные иконки скрыты от скринридера.

Skeleton заменяет весь Chips одним блоком с его высотой и формой, использует общий Skeleton и не содержит интерактивных элементов.

### Чеклист

- Все восемь цветов во всех состояниях, включая обе формы и размера.
- Выбор включает Primary; снятие выбора возвращает Base или Secondary.
- Текст, левая и правая иконки, обе иконки; длинный текст с пробелами и без.
- Caption Base и иконки 16 сохраняются на мобильном; focus не меняет геометрию.
- Удаление доступно с клавиатуры, имеет доступное имя и не переключает выбор.
- Disabled блокирует основное действие и удаление; Skeleton не получает фокус.
`;

export const chipsGroupDocs = `
**ChipsGroup** объединяет единые Chips для выбора одного или нескольких значений.

\`options\` содержит value, text и опциональные iconLeft, iconRight, disabled. \`selectionMode\`: single / multiple (по умолчанию multiple). \`value\` / \`defaultValue\` — массив значений; \`onValueChange\` возвращает новый массив. В режиме single выбирается максимум одно значение; повторная активация снимает выбор.

Выбранные элементы Primary. \`color\` задает Base или Secondary для невыбранных. Размер и форма передаются каждому Chips; \`disabled\` блокирует всю группу, \`isLoading\` показывает скелетоны.

Группа горизонтальная, с переносом и gap --space-8. Размер чипсов и шрифт при переносе не меняются. Задавайте доступное название через aria-label или aria-labelledby.

Tab входит на последний сфокусированный доступный Chips, при первом входе — на выбранный или первый доступный. Arrow Left / Right, Home / End перемещают фокус, пропуская Disabled. Enter / Space переключают выбор. Все недоступные элементы и скелетоны исключены из табуляции.

### Чеклист

- Одиночный и множественный выбор; контролируемое и внутреннее значение.
- Primary выбранного и Base / Secondary невыбранных на соответствующем фоне.
- Перенос при ограничении ширины с gap --space-8.
- Клавиатура пропускает Disabled; изменение фокуса не переключает выбор.
- Disabled и Skeleton всей группы.
`;
