import type { ReactNode } from 'react';
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
  className = '',
}: MultipleFileInputProps) {
  const count = files.length;

  return (
    <div className={`fdoc-multiple-file-input ${className}`} data-testid="multiple-file-input">
      {(showButtons || showDropzone || showCollapse) && (
        <div className="fdoc-multiple-file-input__control">
          {showButtons && (actions ?? (
            <div className="fdoc-multiple-file-input__buttons">
              <Button size="large" iconLeft="plus" onClick={onChooseFiles}>Выбрать файл</Button>
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
            {files.map((file, index) => <FileRow key={`${file.fileName ?? 'file'}-${index}`} {...file} draggable={reorderable || file.draggable} />)}
          </div>
          {totalSize && <div className="fdoc-multiple-file-input__total">Общий объем: {totalSize}</div>}
        </div>
      )}
    </div>
  );
}
