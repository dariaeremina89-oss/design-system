import { componentDoc } from './component-doc';

export const fileRowDocs = componentDoc({
  purpose: `**FileRow** — строка уже добавленного файла или документа. Компонент не выбирает новый файл: он показывает состояние одного файла и действия над ним. Порядок массива, удаление из группы и повторная валидация остаются ответственностью родителя.`,
  anatomy: `Порядок слотов: **Reorder handle → Leading → File name → Additional content → Trailing action**. Под основной строкой может появляться **Message**.

- Reorder handle — только при \`reorderable\`;
- Leading — иконка, preview, произвольный child или Circular Progress в Loading; \`leading={false}\` убирает слот;
- File name занимает остаток ширины и получает Tooltip при реальном обрезании;
- Additional content — текст/weight или готовый Link, Button, ButtonIcon, Badge, Chips и другие child components;
- Trailing action — произвольное конечное действие; стандартно Delete или Menu;
- Message — error или warning с переносом длинного текста.`,
  api: `| Prop | Назначение |
| --- | --- |
| \`state\` | default / loading / disabled / skeleton |
| \`disabled\` | блокирует действия и reorder; передается render-slot детям |
| \`fileName\` | имя файла |
| \`weight\` | shortcut для текстового Additional content |
| \`additionalContent\` | ReactNode или render-slot \`({ disabled })\` |
| \`trailingAction\` | ReactNode или render-slot |
| \`message\` | \`{ type: 'error' | 'warning', text }\` |
| \`leading / leadingIcon / preview\` | Leading |
| \`deletable / onDelete\` | стандартное удаление |
| \`menuItems / onMenuAction\` | стандартное меню |
| \`reorderable\` | drag handle |
| \`onReorderDragStart / onReorderDragEnd / onReorderKey\` | события reorder |`,
  variants: `Loading меняет Leading на Progress Indicator, Disabled блокирует интерактивные слоты, Skeleton заменяет строку загрузочной геометрией. Message может быть Error или Warning и не меняет смысл остальных слотов.`,
  geometry: `Базовая высота — 48 px, padding Y — \`--space-12\`, X — \`--space-8\`. Gap основных слотов — \`--space-8\`, между именем и правой группой — \`--space-16\`. Border рисуется внутри и не увеличивает размер. Иконка стандартного Menu внутри ButtonIcon — 24 px.`,
  behavior: `FileRow не переопределяет типографику, цвет или state вложенного компонента. Только обычный текст и \`weight\` получают Body Base / text-base-secondary. Drag начинается только за handle, preview показывает всю строку, исходная строка остается приглушенной. ArrowUp/ArrowDown на handle вызывает клавиатурный reorder.`,
  responsive: `Компонент занимает ширину родителя; controls не сжимаются, имя файла отдает ширину первым. Размер шрифта на мобильных не уменьшается. Pointer reorder работает одинаково на desktop и touch-устройствах. Длинный Message переносится через безопасный перенос.`,
  accessibility: `Tooltip полного имени появляется только при фактическом обрезании. Интерактивные child components сохраняют собственную семантику. Для reorder всегда есть клавиатурная альтернатива.`,
  checklist: [
    'Все слоты появляются и исчезают без пустых промежутков.',
    'Loading/Disabled/Skeleton не ломают высоту и порядок слотов.',
    'Длинное имя сокращается, а полный текст остается доступен.',
    'Additional/Trailing child получает disabled через render-slot, если это требуется.',
    'Pointer reorder мышью, touch/pen и ArrowUp/ArrowDown переставляют один и тот же объект файла.',
    'reorderDisabled блокирует только handle, не всю FileRow.',
    'reorderTooltip опционален; его текст задается снаружи.',
  ],
});
