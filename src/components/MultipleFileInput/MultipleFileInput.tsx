import { Fragment, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Dropzone, type DropzoneProps } from '../Dropzone/Dropzone';
import { FileRow, type FileRowProps, type FileRowReorderDirection } from '../FileRow/FileRow';
import { Icon } from '../Icon/Icon';
import { ButtonLink } from '../Link/Link';
import './MultipleFileInput.css';

export interface MultipleFileInputProps {
  files?: FileRowProps[];
  showButtons?: boolean;
  showDropzone?: boolean;
  showCollapse?: boolean;
  collapsed?: boolean;
  errorCount?: number;
  groupErrorText?: ReactNode;
  totalSize?: string;
  reorderable?: boolean;
  actions?: ReactNode;
  dropzoneProps?: DropzoneProps;
  onAddFiles?: (files: File[]) => void;
  onDeleteAll?: () => void;
  onToggleCollapse?: () => void;
  onChooseFiles?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

export function MultipleFileInput({
  files = [],
  showButtons = false,
  showDropzone = false,
  showCollapse = true,
  collapsed = false,
  errorCount = 0,
  groupErrorText,
  totalSize,
  reorderable = false,
  actions,
  dropzoneProps,
  onAddFiles,
  onDeleteAll,
  onToggleCollapse,
  onChooseFiles,
  onReorder,
  className = '',
}: MultipleFileInputProps) {
  const count = files.length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);

  const reorderFrom = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= files.length) return;
    onReorder?.(fromIndex, toIndex);
  };

  const reorderDragged = (slot: number) => {
    if (dragIndex === null) return;
    const toIndex = dragIndex < slot ? slot - 1 : slot;
    reorderFrom(dragIndex, toIndex);
    setDragIndex(null);
    setDropSlot(null);
  };

  const getDropSlot = (event: DragEvent<HTMLDivElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? index : index + 1;
  };

  const keyboardTarget = (index: number, direction: FileRowReorderDirection) =>
    direction === 'up' ? index - 1 : index + 1;

  const dropIndicator = (slot: number) =>
    dragIndex !== null && dropSlot === slot ? (
      <div
        className="fdoc-file-row-drop-indicator"
        data-testid="file-row-drop-indicator"
        aria-hidden="true"
      />
    ) : null;

  return (
    <div className={`fdoc-multiple-file-input ${className}`} data-testid="multiple-file-input">
      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple
        onChange={event => {
          const selected = Array.from(event.target.files ?? []);
          if (selected.length) onAddFiles?.(selected);
          event.currentTarget.value = '';
        }}
      />

      {(showButtons || showDropzone || showCollapse) && (
        <div className="fdoc-multiple-file-input__control">
          {showButtons && (actions ?? (
            <div className="fdoc-multiple-file-input__buttons">
              <Button
                size="large"
                color="primary"
                iconLeft="arrow-upload"
                onClick={() => onChooseFiles ? onChooseFiles() : fileInputRef.current?.click()}
              >
                Выбрать файл
              </Button>
              <Button size="large" color="secondary" iconLeft="trash-can" onClick={onDeleteAll}>
                Удалить все
              </Button>
            </div>
          ))}

          {showDropzone && (
            <Dropzone
              showFormats
              showMaxQuantity
              showMaxFileSize
              showMaxTotalSize
              currentQuantity={count}
              currentTotalSize={totalSize}
              {...dropzoneProps}
              onFiles={onAddFiles}
            />
          )}

          {showCollapse && (
            <div className="fdoc-multiple-file-input__summary">
              <div className="fdoc-multiple-file-input__summary-main">
                <ButtonLink color="accent" size="medium" decoration="dashed" onClick={onToggleCollapse}>
                  {count} файлов
                </ButtonLink>
                {errorCount > 0 && <span className="fdoc-multiple-file-input__error">Ошибки в файлах ({errorCount})</span>}
              </div>
              {count > 0 && (
                <ButtonLink color="accent" size="medium" decoration="dashed" onClick={onDeleteAll}>
                  Удалить все
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="fdoc-multiple-file-input__group">
          {groupErrorText && (
            <div className="fdoc-multiple-file-input__group-error" data-testid="multiple-file-input-group-error">
              <Icon name="filled/exclamation_circle_filled" size={24} />
              <span>{groupErrorText}</span>
            </div>
          )}

          <div className="fdoc-multiple-file-input__files">
            <div className="fdoc-multiple-file-input__list">
              {dropIndicator(0)}
              {files.map((file, index) => {
                const rowReorderable = reorderable || file.reorderable;
                return (
                  <Fragment key={file.id ?? `${file.fileName ?? 'file'}-${index}`}>
                    <div
                      className="fdoc-multiple-file-input__item"
                      onDragOver={(event: DragEvent<HTMLDivElement>) => {
                        if (rowReorderable && dragIndex !== null) {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = 'move';
                          setDropSlot(getDropSlot(event, index));
                        }
                      }}
                      onDrop={(event: DragEvent<HTMLDivElement>) => {
                        if (rowReorderable && dragIndex !== null) {
                          event.preventDefault();
                          reorderDragged(getDropSlot(event, index));
                        }
                      }}
                    >
                      <FileRow
                        {...file}
                        reorderable={rowReorderable}
                        onReorderDragStart={event => {
                          file.onReorderDragStart?.(event);
                          if (!rowReorderable) return;
                          setDragIndex(index);
                          setDropSlot(null);
                          event.dataTransfer.effectAllowed = 'move';
                        }}
                        onReorderDragEnd={event => {
                          file.onReorderDragEnd?.(event);
                          setDragIndex(null);
                          setDropSlot(null);
                        }}
                        onReorderKey={direction => {
                          file.onReorderKey?.(direction);
                          if (rowReorderable) reorderFrom(index, keyboardTarget(index, direction));
                        }}
                      />
                    </div>
                    {dropIndicator(index + 1)}
                  </Fragment>
                );
              })}
            </div>
            {totalSize && <div className="fdoc-multiple-file-input__total">Общий объем: {totalSize}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
