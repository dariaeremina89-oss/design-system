import { Fragment, useRef, useState, type DragEvent, type PointerEvent, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Dropzone, type DropzoneProps } from '../Dropzone/Dropzone';
import { FileRow, type FileRowProps, type FileRowReorderDirection } from '../FileRow/FileRow';
import { Icon } from '../Icon/Icon';
import { ButtonLink } from '../Link/Link';
import {
  FILE_UPLOAD_DEFAULTS,
  formatsToAccept,
  validateFileSelection,
  type FileUploadValidationConfig,
  type FileUploadValidationIssue,
} from '../fileUploadValidation';
import './MultipleFileInput.css';

export type MultipleFileInputValidation = Pick<
  FileUploadValidationConfig,
  'formats' | 'maxQuantity' | 'maxFileSize' | 'maxTotalSize'
>;

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
  /** Единые правила добавления файлов для Dropzone и кнопки выбора. */
  validation?: MultipleFileInputValidation;
  onAddFiles?: (files: File[]) => void;
  /** Получает ошибки добавления независимо от источника: кнопка или Dropzone. */
  onValidationError?: (issues: FileUploadValidationIssue[]) => void;
  onDeleteAll?: () => void;
  onToggleCollapse?: () => void;
  /** Вызывается при клике на стандартную кнопку перед открытием системного picker. */
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
  validation,
  onAddFiles,
  onValidationError,
  onDeleteAll,
  onToggleCollapse,
  onChooseFiles,
  onReorder,
  className = '',
}: MultipleFileInputProps) {
  const count = files.length;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const dropSlotRef = useRef<number | null>(null);

  const updateDropSlot = (slot: number | null) => {
    dropSlotRef.current = slot;
    setDropSlot(slot);
  };

  const clearReorderState = () => {
    setDragIndex(null);
    updateDropSlot(null);
  };

  const defaultValidation = showDropzone ? FILE_UPLOAD_DEFAULTS.left : undefined;
  const effectiveValidation: MultipleFileInputValidation = {
    formats: validation?.formats ?? dropzoneProps?.formats ?? defaultValidation?.formats,
    maxQuantity: validation?.maxQuantity ?? dropzoneProps?.maxQuantity ?? defaultValidation?.maxQuantity,
    maxFileSize: validation?.maxFileSize ?? dropzoneProps?.maxFileSize ?? defaultValidation?.maxFileSize,
    maxTotalSize: validation?.maxTotalSize ?? dropzoneProps?.maxTotalSize ?? defaultValidation?.maxTotalSize,
  };

  const reportValidationError = (issues: FileUploadValidationIssue[]) => {
    onValidationError?.(issues);
  };

  const reportDropzoneValidationError = (issues: FileUploadValidationIssue[]) => {
    dropzoneProps?.onValidationError?.(issues);
    onValidationError?.(issues);
  };

  const addFiles = (selected: File[]) => {
    if (!selected.length) return;
    const issues = validateFileSelection(selected, {
      ...effectiveValidation,
      currentQuantity: count,
      currentTotalSize: totalSize,
      multiple: true,
    });

    if (issues.length) {
      reportValidationError(issues);
      return;
    }

    onAddFiles?.(selected);
  };

  const chooseFiles = () => {
    onChooseFiles?.();
    fileInputRef.current?.click();
  };

  const isRowReorderable = (index: number) =>
    index >= 0 && index < files.length && (reorderable || files[index]?.reorderable === true);

  const reorderFrom = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      toIndex < 0 ||
      toIndex >= files.length ||
      !isRowReorderable(fromIndex) ||
      !isRowReorderable(toIndex)
    ) return;
    onReorder?.(fromIndex, toIndex);
  };

  const reorderDragged = (slot: number | null = dropSlotRef.current) => {
    if (dragIndex === null || slot === null) {
      clearReorderState();
      return;
    }

    const toIndex = dragIndex < slot ? slot - 1 : slot;
    reorderFrom(dragIndex, toIndex);
    clearReorderState();
  };

  const getDropSlot = (event: DragEvent<HTMLDivElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? index : index + 1;
  };

  const getPointerDropSlot = (clientY: number) => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('.fdoc-multiple-file-input__item');
    if (!items) return null;

    const reorderableIndexes = files
      .map((_, index) => index)
      .filter(index => isRowReorderable(index));

    if (!reorderableIndexes.length) return null;

    for (const index of reorderableIndexes) {
      const item = items[index];
      if (!item) continue;
      const rect = item.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return index;
    }

    return reorderableIndexes[reorderableIndexes.length - 1] + 1;
  };

  const finishPointerReorder = (fromIndex: number, event: PointerEvent<HTMLButtonElement>) => {
    const slot = event.type === 'pointercancel' ? null : dropSlotRef.current;

    if (slot !== null) {
      const toIndex = fromIndex < slot ? slot - 1 : slot;
      reorderFrom(fromIndex, toIndex);
    }

    clearReorderState();
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
        accept={formatsToAccept(effectiveValidation.formats)}
        onChange={event => {
          addFiles(Array.from(event.target.files ?? []));
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
                onClick={chooseFiles}
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
              {...dropzoneProps}
              formats={effectiveValidation.formats}
              maxQuantity={effectiveValidation.maxQuantity}
              maxFileSize={effectiveValidation.maxFileSize}
              maxTotalSize={effectiveValidation.maxTotalSize}
              currentQuantity={count}
              currentTotalSize={totalSize}
              onFiles={addFiles}
              onValidationError={reportDropzoneValidationError}
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
            <div ref={listRef} className="fdoc-multiple-file-input__list">
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
                          updateDropSlot(getDropSlot(event, index));
                        }
                      }}
                      onDrop={(event: DragEvent<HTMLDivElement>) => {
                        if (rowReorderable && dragIndex !== null) {
                          event.preventDefault();
                          reorderDragged(dropSlotRef.current ?? getDropSlot(event, index));
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
                          updateDropSlot(null);
                          event.dataTransfer.effectAllowed = 'move';
                        }}
                        onReorderDragEnd={event => {
                          file.onReorderDragEnd?.(event);
                          setDragIndex(null);
                          updateDropSlot(null);
                        }}
                        onReorderPointerStart={event => {
                          file.onReorderPointerStart?.(event);
                          if (!rowReorderable || file.reorderDisabled) return;
                          setDragIndex(index);
                          updateDropSlot(null);
                        }}
                        onReorderPointerMove={event => {
                          file.onReorderPointerMove?.(event);
                          if (!rowReorderable || file.reorderDisabled) return;
                          updateDropSlot(getPointerDropSlot(event.clientY));
                        }}
                        onReorderPointerEnd={event => {
                          file.onReorderPointerEnd?.(event);
                          if (!rowReorderable || file.reorderDisabled) {
                            setDragIndex(null);
                            updateDropSlot(null);
                            return;
                          }
                          finishPointerReorder(index, event);
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
