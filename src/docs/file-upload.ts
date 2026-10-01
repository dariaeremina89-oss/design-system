import { qualityDocs } from './quality';

export const dropzoneDocs = `
**Dropzone** — область выбора файлов через системный picker или drag&drop. Компонент принимает файлы, валидирует их по переданным ограничениям и сообщает результат наружу; он не хранит список уже добавленных файлов.

### API и валидация

- \`align\`: left / center — визуальная композиция, логика выбора одинакова;
- \`formats / maxQuantity / maxFileSize / maxTotalSize\` — реальные ограничения валидации;
- \`currentQuantity / currentTotalSize\` учитывают уже добавленные файлы при проверке новой пачки;
- \`showFormats / showMaxQuantity / showMaxFileSize / showMaxTotalSize\` управляют **только видимостью** строк требований и не отключают соответствующую валидацию;
- \`accept\` можно передать явно; иначе он строится из formats;
- \`multiple\` управляет множественным выбором;
- \`onFiles\` получает только прошедшие валидацию файлы; \`onValidationError\` получает список причин;
- \`state\`: default / hover / focused / pressed / disabled / error / success / skeleton. Реальные hover/focus/press в default вычисляются самим компонентом.

### Поведение

Клик, Enter и Space открывают системный picker. После выбора value скрытого input очищается, поэтому тот же файл можно выбрать повторно. Drag&drop реагирует только на payload с типом Files: внутренний reorder FileRow не должен восприниматься как добавление нового файла. Disabled блокирует picker и drop.

Требования к форматам и размерам на фронте остаются данными и влияют на валидацию независимо от того, показаны ли соответствующие строки в макете.
` + qualityDocs('Dropzone');

export const singleFileInputDocs = `
**SingleFileInput** — выбор и отображение одного файла. Компонент всегда остается SingleFileInput: заполненное состояние использует общий внутренний FileItemLayout с FileRow, но не подменяется публичным FileRow и не получает его reorder/menu-логику.

### API

- \`type\`: default / disabled / skeleton;
- \`size\`: desktop / mobile. Desktop автоматически переключает текстовую кнопку на ButtonIcon при нехватке ширины; mobile можно задать принудительно;
- \`accept\` ограничивает системный picker;
- \`file\` — controlled File; без него выбранный файл хранится внутри;
- \`onFileChange\` получает File или null при удалении;
- \`validationMessage\` — текст ошибки валидации. Наличие сообщения включает error-оформление, отдельного boolean error нет;
- \`fileProps\` настраивает заполненное состояние: имя, вес/Additional content, Leading/preview, Message, delete и Loading.

### Поведение

Кнопка вызывает hidden input напрямую, поэтому выбор файла не зависит от label-обертки. После выбора пустое состояние переходит в заполненную анатомию того же SingleFileInput. Длинное имя отдает ширину первым и сокращается многоточием, вес/действия сохраняются. Ошибка добавляет Message и увеличивает высоту контентной колонки, не сдвигая кнопку и Leading по вертикали.
` + qualityDocs('SingleFileInput');

export const multipleFileInputDocs = `
**MultipleFileInput** — управляемая группа добавленных файлов с опциональными кнопками выбора, Dropzone, сворачиванием, общей ошибкой, суммарным размером и reorder.

### API

- \`files\` — массив FileRow props; компонент не владеет продуктовым списком и сообщает изменения через callbacks;
- \`showButtons / showDropzone / showCollapse\` включают соответствующие области;
- \`collapsed / onToggleCollapse\` управляют сворачиванием;
- \`validation\` задает общие formats / maxQuantity / maxFileSize / maxTotalSize для добавления;
- \`onAddFiles\` получает только файлы, прошедшие валидацию; \`onValidationError\` получает причины;
- \`onDeleteAll\` и delete callbacks строк позволяют родителю обновить files;
- \`reorderable / onReorder(from, to)\` включают изменение порядка;
- \`groupErrorText / errorCount\` показывают ошибки уровня группы/сводки;
- \`totalSize\` одновременно отображается как общий размер и участвует в проверке следующей пачки.

### Единая валидация

Стандартная кнопка и Dropzone всегда проходят через один \`validation\` contract. \`onChooseFiles\` сообщает о клике на кнопку, но не заменяет внутренний picker и не обходит валидацию. Если ограничения также переданы в dropzoneProps, явный validation имеет приоритет.

### Reorder

Drag начинается за handle FileRow, DropIndicator показывает позицию вставки, а после drop вызывается \`onReorder\`. Родитель переставляет целый объект файла — Message, Additional content и остальные данные остаются с той же строкой. Клавиатурный ArrowUp/ArrowDown использует тот же callback.
` + qualityDocs('MultipleFileInput');
