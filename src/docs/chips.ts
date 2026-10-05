import { componentDoc } from './component-doc';

export const chipsDocs = componentDoc({
  purpose: `**Chips** — единый компактный компонент для выбора, фильтрации, тегов и статусов. Используйте для коротких значений; для основного действия используйте Button, для большого списка вариантов — Select.`,
  anatomy: `Обязательный однострочный Text, опциональные Leading/Trailing Icon и отдельный ButtonIcon удаления. Удаление — соседнее действие, а не вложенная кнопка внутри основной интерактивной области.`,
  api: `- \`text\` — обязательное короткое значение;
- \`iconLeft / iconRight\` — библиотечные иконки;
- \`color\`: secondary / base / primary / success / accent / warning / error / inverse;
- \`size\`: small / medium; \`shape\`: round / square;
- \`state\`: default / hover / pressed / focused / disabled / skeleton;
- \`selected / defaultSelected / onSelectedChange\` — режим выбора;
- \`interactive / onClick\` — действие без выбора;
- \`onRemove / removeLabel\` — отдельное удаление;
- \`skeletonWidth\` — ширина Skeleton.`,
  variants: `Выбранный Chips всегда Primary. Невыбранный — Base или Secondary. Success/Accent/Warning/Error/Inverse используются для меток и действий без selection. Hover/Pressed меняют фон; Focused добавляет внешнюю обводку; Disabled использует disabled-токены. Информационный Chips без selection/action не реагирует на hover.`,
  geometry: `| Параметр | Small | Medium |
| --- | --- | --- |
| Высота | --elements-24 | --elements-32 |
| Padding контейнера Y / X | --space-4 / --space-8 | --space-6 / --space-8 |
| Padding текста Y / X | --space-0 / --space-4 | --space-2 / --space-8 |
| Иконки | --elements-16 | --elements-16 |
| Типографика | Caption Base 12/16 | Caption Base 12/16 |

Round — \`--radius-full\`, Square — \`--radius-small\`. Focus \`--border-large\` не меняет размер. Текст однострочный и сокращается многоточием; иконки не сжимаются.`,
  behavior: `Selection озвучивается через aria-pressed. Remove не переключает выбранность. Skeleton заменяет весь Chips одной формой и не содержит интерактивных элементов. Цвет не определяется автоматически по фону родителя: на Default обычно Secondary, на Secondary — Base.`,
  responsive: `Размеры, Caption 12/16 и иконки 16 px не уменьшаются на мобильных. При ограниченной ширине текст отдает место и сокращается.`,
  accessibility: `Интерактивная область — нативный button с Tab/Enter/Space. Disabled исключается из tab-навигации. Remove — отдельная кнопка с доступным именем. Значение статуса должно быть понятно не только по цвету.`,
  checklist: [
    'Все восемь цветов проверены в доступных состояниях.',
    'Selected включает Primary, снятие выбора возвращает Base/Secondary.',
    'Длинный текст не сжимает иконки.',
    'Remove не переключает selection и имеет доступное имя.',
    'Disabled блокирует основное действие и Remove; Skeleton не получает фокус.',
  ],
});

export const chipsGroupDocs = componentDoc({
  purpose: `**ChipsGroup** объединяет Chips для выбора одного или нескольких коротких значений.`,
  anatomy: `Горизонтальная группа Chips с переносом строк. Каждый элемент остается полноценным Chips со своим текстом, иконками и Disabled.`,
  api: `- \`options\`: value, text, iconLeft, iconRight, disabled;
- \`selectionMode\`: single / multiple;
- \`value / defaultValue\` — массив выбранных value;
- \`onValueChange\` — новый массив;
- \`color\` — Base или Secondary для невыбранных;
- размер и shape передаются каждому Chips;
- \`disabled\` блокирует группу;
- \`isLoading\` показывает Skeleton вместо Chips.`,
  variants: `В single выбирается максимум одно значение; повторная активация может снять выбор. В multiple элементы независимы. Выбранные Chips — Primary, невыбранные — Base/Secondary.`,
  geometry: `Группа использует горизонтальный flow с переносом и gap \`--space-8\`. Размер и типографика дочерних Chips при переносе не меняются.`,
  behavior: `Tab входит на последний сфокусированный доступный Chips, при первом входе — на выбранный или первый доступный. Arrow Left/Right и Home/End перемещают фокус без изменения выбора; Enter/Space переключают текущий Chips.`,
  responsive: `При нехватке ширины Chips переносятся на следующую строку, сохраняя gap и собственные размеры.`,
  accessibility: `Группе задается доступное имя через aria-label или aria-labelledby. Disabled и Skeleton исключены из tab-навигации.`,
  checklist: [
    'Single и Multiple работают в controlled/uncontrolled режимах.',
    'Фокус стрелками не меняет выбранность.',
    'Перенос сохраняет gap --space-8 и размеры Chips.',
    'Клавиатурная навигация пропускает Disabled.',
    'Disabled и Loading всей группы не оставляют активных controls.',
  ],
});
