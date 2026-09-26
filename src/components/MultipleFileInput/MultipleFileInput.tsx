import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Dropzone, type DropzoneProps } from '../Dropzone/Dropzone';
import { FileRow, type FileRowProps } from '../FileRow/FileRow';
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
  const reorder = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    onReorder?.(dragIndex, toIndex);
    setDragIndex(null);
  };

  return (
    <div className={`fdoc-multiple-file-input ${className}`} data-testid="multiple-file-input">\n      <input ref={fileInputRef} hidden type="file" multiple onChange={e => { const selected = Array.from(e.target.files ?? []); if (selected.length) onAddFiles?.(selected); e.currentTarget.value = ''; }} />
      {(showButtons || showDropzone || showCollapse) && (
        <div className="fdoc-multiple-file-input__control">
          {showButtons && (actions ?? (
            <div className="fdoc-multiple-file-input__buttons">
              <Button size="large" iconLeft="plus" onClick={() => onChooseFiles ? onChooseFiles() : fileInputRef.current?.click()}>Выбрать файл</Button>
              <Button size="large" color="base" onClick={onDeleteAll}>Удалить все</Button>
            </div>
          ))}
          {showDropzone && <Dropzone {...dropzoneProps} onFiles={onAddFiles} />}
          {showCollapse && (
            <div className="fdoc-multiple-file-input__summary">
              <div className="fdoc-multiple-file-input__summary-main">
                <ButtonLink color="accent" size="medium" decoration="dashed" onClick={onToggleCollapse}>{count} файлов</ButtonLink>
                {errorCount > 0 && <span className="fdoc-multiple-file-input__error">Ошибки в файлах ({errorCount})</span>}
              </div>
              {count > 0 && <ButtonLink color="accent" size="medium" decoration="dashed" onClick={onDeleteAll}>Удалить все</ButtonLink>}
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
          <div className="fdoc-multiple-file-input__list">
            {files.map((file, index) => (
              <div
                key={`${file.fileName ?? 'file'}-${index}`}
                className="fdoc-multiple-file-input__item"
                draggable={reorderable}
                onDragStart={(e: DragEvent<HTMLDivElement>) => { if (reorderable) { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; } }}
                onDragOver={(e: DragEvent<HTMLDivElement>) => { if (reorderable) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } }}
                onDrop={(e: DragEvent<HTMLDivElement>) => { if (reorderable) { e.preventDefault(); reorder(index); } }}
                onDragEnd={() => setDragIndex(null)}
              >
                <FileRow {...file} draggable={reorderable || file.draggable} />
              </div>
            ))}
          </div>
          {totalSize && <div className="fdoc-multiple-file-input__total">Общий объем: {totalSize}</div>}
        </div>
      )}
    </div>
  );
}
