export const fileRowDocs = `
**FileRow** — строка уже добавленного файла или документа. Компонент не выбирает и не загружает новый файл: он показывает состояние конкретного файла и действия над ним. В группах порядок, удаление из массива и повторная валидация остаются ответственностью родителя.

### Анатомия

Порядок слотов: **Reorder handle → Leading → File name → Additional content → Trailing action**. Под основной строкой может появляться **Message**.

- Reorder handle — только при \`reorderable\`.
- Leading — обычная иконка, preview, произвольный child или Circular Progress в Loading; \`leading={false}\` полностью убирает слот.
- File name занимает остаток ширины и сокращается многоточием. Полное имя доступно через Tooltip при реальном обрезании.
- Additional content — произвольный child справа от имени: текст/вес, Link, Button, ButtonIcon, Badge, Chips и другие подходящие компоненты.
- Trailing action — произвольное конечное действие. По умолчанию может быть Delete или Menu, но слот ими не ограничен.
- Message — \`error\` или \`warning\`; текст переносится, в том числе для сверхдлинных последовательностей.

### API

| Prop | Назначение |
| --- | --- |
| \`state\` | \`default / loading / disabled / skeleton\`. Для сочетаний Loading + Disabled используйте отдельный \`disabled\`. |
| \`disabled\` | Блокирует действия, reorder и передается render-slot детям через \`{ disabled }\`. |
| \`fileName\` | Имя файла. |
| \`weight\` | Shortcut для текстового Additional content. Игнорируется, если передан \`additionalContent\`. |
| \`additionalContent\` | ReactNode или render-slot \`({ disabled }) => ReactNode\`. |
| \`trailingAction\` | ReactNode или render-slot для конечного действия. |
| \`message\` | \`{ type: 'error' | 'warning', text }\`. |
| \`leading / leadingIcon / preview\` | Настройка Leading. Loading и preview сохраняют приоритет над семантической иконкой Message. |
| \`deletable / onDelete\` | Стандартное удаление через ButtonIcon. |
| \`menuItems / onMenuAction\` | Стандартное меню действий. |
| \`reorderable\` | Показывает drag handle; drag начинается только с него. |
| \`onReorderDragStart / onReorderDragEnd / onReorderKey\` | События для родителя, который меняет порядок массива. |

### Additional content и Trailing action

FileRow не переопределяет типографику, цвет или state вложенного компонента. Только обычный текст и \`weight\` получают Body Base / text-base-secondary. Для интерактивных children используйте render-slot и передавайте \`disabled\` их собственному API.

Для компактной строки рекомендуются Badge до 24 px по высоте и Chips Small 24 px. Более высокий child допустим, но увеличивает высоту строки — FileRow не должен искусственно уменьшать вложенный компонент.

### Reorder

Перетаскивание начинается только за ButtonIcon с \`drag-dot\`, но drag preview показывает **всю строку**. Исходная строка остается на своем месте приглушенной до завершения drag. Родитель показывает DropIndicator в целевой позиции и после drop переставляет соответствующий объект целиком вместе с Message и остальными данными.

Клавиатура: фокус на handle, \`ArrowUp / ArrowDown\` вызывают \`onReorderKey\`. Disabled отключает drag и клавиатурное изменение порядка.

### Геометрия и адаптив

Базовая высота — 48 px, padding Y 12 / X 8, gap между основными слотами 8, между именем и правой группой 16. Border рисуется внутри и не увеличивает размер. Компонент занимает ширину родителя, не меняет размер шрифта на мобильном; фиксированные controls сохраняют размер, имя файла отдает ширину первым.

### Автотесты

Unit-тесты проверяют Loading/Disabled, Message, preview, универсальные slots, disabled для вложенных действий, delete/menu, reorder с клавиатуры и drag contract, Skeleton. Browser UI проверяет имя + вес на узкой ширине, Chips без overflow, drag feedback/DropIndicator и геометрию Skeleton.

### Селекторы для тестирования

| Селектор | Элемент |
| --- | --- |
| \`data-testid="file-row"\` | Корень обычной строки. |
| \`data-testid="file-row-skeleton"\` | Skeleton вместо строки. |
| \`data-testid="file-row-reorder-handle"\` | Reorder handle. |
| \`data-file-row-dragging="true"\` | Исходная строка во время drag. |
| \`.fdoc-file-item__name\` | Имя файла; для продуктовых тестов предпочтительнее доступное имя строки. |
| \`.fdoc-file-row-drop-indicator\` | Линия целевой позиции reorder. |
| \`role="alert" / role="status"\` | Error / Warning Message. |
| \`role="progressbar"\` | Circular Progress в Loading. |
`;
