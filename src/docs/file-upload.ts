import { componentDoc } from './component-doc';
import { qualityDocs } from './quality';

export const dropzoneDocs = componentDoc({
  purpose: `**Dropzone** — область выбора файлов через системный picker или drag&drop. Компонент принимает новую пачку файлов, валидирует ее по переданным ограничениям и сообщает результат наружу; список уже добавленных файлов хранит родитель.`,
  anatomy: `Состав: Leading/Icon, основное действие выбора файла, поясняющий текст и опциональные строки ограничений. В Center-композиции ограничения могут быть скрыты визуально, но продолжать участвовать в валидации.`,
  api: `- \`align\`: left / center;
- \`formats / maxQuantity / maxFileSize / maxTotalSize\` — ограничения валидации;
- \`currentQuantity / currentTotalSize\` — уже добавленные файлы;
- \`showFormats / showMaxQuantity / showMaxFileSize / showMaxTotalSize\` — только видимость требований;
- \`accept\` — явный accept; иначе строится из formats;
- \`multiple\` — множественный выбор;
- \`onFiles\` — прошедшие валидацию файлы;
- \`onValidationError\` — причины отклонения;
- \`state\`: default / hover / focused / pressed / disabled / error / success / skeleton.`,
  variants: `Left и Center меняют композицию, но не правила выбора и валидации. Default реагирует на реальные hover/focus/press; Error/Success задают семантическое состояние, Disabled блокирует picker/drop, Skeleton заменяет интерактивное содержимое.`,
  behavior: `Клик, Enter и Space открывают системный picker. После выбора value скрытого input очищается, поэтому тот же файл можно выбрать повторно. Drag&drop реагирует только на payload типа Files: внутренний reorder FileRow не считается добавлением нового файла. Видимость строк требований не отключает соответствующую валидацию.`,
  responsive: `Компонент занимает ширину родителя, не уменьшает типографику и controls на мобильных и не создает horizontal overflow. Left/Center сохраняют свои правила композиции на доступной ширине.`,
  accessibility: `Область выбора доступна с клавиатуры; Disabled исключает взаимодействие. Ошибка валидации должна быть доступна не только цветом и связываться со сценарием через доступный текст.`,
  checklist: [
    'Picker, drag&drop и повторный выбор того же файла работают одинаково.',
    'Скрытые строки ограничений не отключают formats/quantity/size validation.',
    'Disabled блокирует picker и drop.',
    'Drag FileRow внутри группы не запускает добавление файла.',
    'Длинный текст и список ограничений остаются внутри контейнера.',
  ],
}) + qualityDocs('Dropzone');

export const singleFileInputDocs = componentDoc({
  purpose: `**SingleFileInput** — выбор и отображение одного файла. Заполненное состояние повторяет визуальную анатомию FileRow через общий внутренний layout, но компонент остается SingleFileInput и не получает reorder/menu-логику группы.`,
  anatomy: `Пустое состояние содержит текст/кнопку выбора. Заполненное: Leading → File name → Additional content → Trailing/Delete; ниже может появляться Message. На фронте это внутренняя анатомия SingleFileInput, а не публичный FileRow.`,
  api: `- \`type\`: default / disabled / skeleton;
- \`size\`: desktop / mobile;
- \`accept\` — системный picker;
- \`file\` — controlled File; без него файл хранится внутри;
- \`onFileChange\` — File или null при удалении;
- \`validationMessage\` — текст ошибки, который включает error-оформление;
- \`fileProps\` — имя, Additional content/weight, Leading/preview, Message, Delete и Loading заполненного состояния.`,
  variants: `Desktop использует текстовую кнопку при достаточной ширине и автоматически переходит на ButtonIcon при нехватке места. Mobile можно задать принудительно. Disabled блокирует выбор/удаление; Skeleton повторяет геометрию состояния.`,
  behavior: `Кнопка вызывает hidden input напрямую. После выбора пустое состояние переходит в заполненное без подмены публичного компонента. Длинное имя отдает ширину первым и сокращается многоточием; Additional/Trailing сохраняют размеры. Error добавляет Message и увеличивает высоту контентной колонки.`,
  responsive: `Desktop-композиция сама выбирает текстовую или icon-only кнопку по доступной ширине. Типографика, Leading и действия не уменьшаются на мобильных.`,
  accessibility: `Выбор файла доступен с клавиатуры. Удаление — отдельное действие с доступным именем. Ошибка передается текстом, а не только цветом.`,
  checklist: [
    'Пустое и заполненное состояния остаются одним SingleFileInput.',
    'Desktop автоматически заменяет текстовую кнопку на ButtonIcon при нехватке ширины.',
    'Длинное имя сокращается раньше Additional content и действий.',
    'Delete очищает файл и возвращает пустое состояние.',
    'Error/Disabled/Loading не ломают выравнивание Leading и actions.',
  ],
}) + qualityDocs('SingleFileInput');

export const multipleFileInputDocs = componentDoc({
  purpose: `**MultipleFileInput** — управляемая группа добавленных файлов с выбором новых файлов, Dropzone, сворачиванием, общей ошибкой, суммарным размером и опциональным reorder.`,
  anatomy: `Состав: область кнопок выбора, опциональный Dropzone, список FileRow, Group Error/Summary и управление сворачиванием. DropIndicator появляется между строками только во время reorder.`,
  api: `- \`files\` — массив props для FileRow;
- \`showButtons / showDropzone / showCollapse\` — области интерфейса;
- \`collapsed / onToggleCollapse\` — сворачивание;
- \`validation\` — formats / maxQuantity / maxFileSize / maxTotalSize;
- \`onAddFiles / onValidationError\` — результат добавления;
- \`onDeleteAll\` и callbacks строк — изменение списка;
- \`reorderable / onReorder(from, to)\` — изменение порядка;
- \`groupErrorText / errorCount\` — ошибки уровня группы;
- \`totalSize\` — отображение и входные данные для следующей валидации.`,
  variants: `Группа может состоять только из списка, списка с кнопками, Dropzone или всех областей вместе. Reorder включается отдельно и не меняет contract FileRow.`,
  behavior: `Кнопка выбора и Dropzone используют один validation contract. \`onChooseFiles\` сообщает о клике, но не обходит picker/валидацию. При reorder drag начинается за handle FileRow, DropIndicator показывает позицию, а родитель переставляет целый объект файла. ArrowUp/ArrowDown на handle вызывает тот же reorder callback.`,
  responsive: `Список и Dropzone занимают ширину родителя. FileRow сохраняют размеры controls, а имя файла отдает ширину первым. Группа не создает horizontal overflow на мобильных.`,
  accessibility: `Добавление и удаление файлов доступны с клавиатуры. Reorder имеет клавиатурную альтернативу через handle; Disabled FileRow не меняют порядок.`,
  checklist: [
    'Кнопка и Dropzone применяют одинаковые ограничения.',
    'Group Error не подменяет Message конкретного FileRow.',
    'Delete одной строки и Delete All обновляют управляемый список через callbacks.',
    'Drag переносит весь объект файла вместе с Message/Additional content.',
    'Клавиатурный reorder дает тот же результат, что drag&drop.',
  ],
}) + qualityDocs('MultipleFileInput');
