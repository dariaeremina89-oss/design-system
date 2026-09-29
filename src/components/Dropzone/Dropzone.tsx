import { useRef, useState, type DragEvent, type HTMLAttributes } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import {
  FILE_UPLOAD_DEFAULTS,
  formatsToAccept,
  validateFileSelection,
  type FileUploadValidationIssue,
  type FileUploadValidationReason,
} from '../fileUploadValidation';
import './Dropzone.css';

export type DropzoneState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'error' | 'success' | 'skeleton';
export type DropzoneAlign = 'left' | 'center';
export type DropzoneValidationReason = FileUploadValidationReason;
export type DropzoneValidationIssue = FileUploadValidationIssue;

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  state?: DropzoneState;
  align?: DropzoneAlign;
  accept?: string;
  multiple?: boolean;
  formats?: string;
  maxQuantity?: number;
  maxFileSize?: string;
  maxTotalSize?: string;
  /** Уже добавленные файлы. Учитываются при проверке общего количества. */
  currentQuantity?: number;
  /** Уже добавленный общий размер. Учитывается при проверке общего размера. */
  currentTotalSize?: string;
  /** Только видимость строки требования. На саму валидацию не влияет. */
  showFormats?: boolean;
  /** Только видимость строки требования. На саму валидацию не влияет. */
  showMaxQuantity?: boolean;
  /** Только видимость строки требования. На саму валидацию не влияет. */
  showMaxFileSize?: boolean;
  /** Только видимость строки требования. На саму валидацию не влияет. */
  showMaxTotalSize?: boolean;
  onFiles?: (files: File[]) => void;
  onValidationError?: (issues: DropzoneValidationIssue[]) => void;
}

function isFileDrag(event: DragEvent) {
  return Array.from(event.dataTransfer.types ?? []).includes('Files');
}

export function Dropzone({
  state = 'default',
  align = 'left',
  accept,
  multiple = true,
  formats,
  maxQuantity,
  maxFileSize,
  maxTotalSize,
  currentQuantity = 0,
  currentTotalSize,
  showFormats = true,
  showMaxQuantity = false,
  showMaxFileSize = true,
  showMaxTotalSize = false,
  onFiles,
  onValidationError,
  className = '',
  ...props
}: DropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const disabled = state === 'disabled';
  const interactive = state === 'default';
  const defaults = FILE_UPLOAD_DEFAULTS[align];
  const effectiveFormats = formats ?? defaults.formats;
  const effectiveMaxQuantity = maxQuantity ?? defaults.maxQuantity;
  const effectiveMaxFileSize = maxFileSize ?? defaults.maxFileSize;
  const effectiveMaxTotalSize = maxTotalSize ?? defaults.maxTotalSize;
  const inputAccept = accept ?? formatsToAccept(effectiveFormats);

  const activeState: DropzoneState | 'drag-over' = interactive && validationError
    ? 'error'
    : drag
      ? 'drag-over'
      : interactive && pressed
        ? 'pressed'
        : interactive && focused
          ? 'focused'
          : interactive && hovered
            ? 'hover'
            : state;

  const emit = (list: FileList | null) => {
    if (disabled || !list) return;
    const files = Array.from(list);
    const issues = validateFileSelection(files, {
      formats: effectiveFormats,
      maxQuantity: effectiveMaxQuantity,
      maxFileSize: effectiveMaxFileSize,
      maxTotalSize: effectiveMaxTotalSize,
      currentQuantity,
      currentTotalSize,
      multiple,
    });

    if (issues.length) {
      setValidationError(true);
      onValidationError?.(issues);
      return;
    }

    setValidationError(false);
    onFiles?.(files);
  };

  const drop = (event: DragEvent) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    setDrag(false);
    emit(event.dataTransfer.files);
  };

  if (state === 'skeleton') {
    return (
      <div className={`fdoc-dropzone-skeleton fdoc-dropzone-skeleton--${align} ${className}`} data-testid="dropzone-skeleton">
        <Skeleton width="100%" height="100%" shape="rounded" />
      </div>
    );
  }

  const isError = activeState === 'error';
  const title = isError
    ? 'Вы загружаете недопустимые файлы'
    : disabled
      ? 'Загрузка файлов недоступна'
      : align === 'center'
        ? 'Или перетащите ваш файл сюда'
        : 'Перетащите файлы сюда, чтобы начать загрузку';

  return (
    <div
      {...props}
      className={`fdoc-dropzone fdoc-dropzone--${align} fdoc-dropzone--${activeState} ${className}`}
      tabIndex={disabled ? undefined : 0}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => !disabled && setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setPressed(false);
      }}
      onKeyDown={event => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setPressed(true);
        }
      }}
      onKeyUp={event => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setPressed(false);
          input.current?.click();
        }
      }}
      onClick={() => !disabled && input.current?.click()}
      onDragOver={event => {
        if (!isFileDrag(event)) return;
        event.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={drop}
      data-testid="dropzone"
      aria-disabled={disabled}
      aria-invalid={isError || undefined}
    >
      <input
        ref={input}
        className="fdoc-dropzone__input"
        type="file"
        accept={inputAccept}
        multiple={multiple}
        disabled={disabled}
        onChange={event => {
          emit(event.target.files);
          event.currentTarget.value = '';
        }}
      />

      {align === 'left' ? (
        <>
          <span className="fdoc-dropzone__icon">
            <Icon name={isError ? 'filled/exclamation_circle_filled' : 'doc-paper'} size={24} />
          </span>
          <div className="fdoc-dropzone__content">
            <strong>{title}</strong>
            {!disabled && (
              <Requirements
                align={align}
                formats={effectiveFormats}
                maxQuantity={effectiveMaxQuantity}
                maxFileSize={effectiveMaxFileSize}
                maxTotalSize={effectiveMaxTotalSize}
                showFormats={showFormats}
                showMaxQuantity={showMaxQuantity}
                showMaxFileSize={showMaxFileSize}
                showMaxTotalSize={showMaxTotalSize}
              />
            )}
          </div>
        </>
      ) : (
        <div className="fdoc-dropzone__center">
          <Button size="medium" color="primary" iconLeft="arrow-upload" disabled={disabled} tabIndex={-1}>
            Выбрать файл
          </Button>
          <div className="fdoc-dropzone__center-content">
            <strong>{title}</strong>
            {!disabled && (
              <Requirements
                align={align}
                formats={effectiveFormats}
                maxQuantity={effectiveMaxQuantity}
                maxFileSize={effectiveMaxFileSize}
                maxTotalSize={effectiveMaxTotalSize}
                showFormats={showFormats}
                showMaxQuantity={showMaxQuantity}
                showMaxFileSize={showMaxFileSize}
                showMaxTotalSize={showMaxTotalSize}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Requirements(props: {
  align: DropzoneAlign;
  formats: string;
  maxQuantity: number;
  maxFileSize: string;
  maxTotalSize: string;
  showFormats: boolean;
  showMaxQuantity: boolean;
  showMaxFileSize: boolean;
  showMaxTotalSize: boolean;
}) {
  return (
    <div className="fdoc-dropzone__requirements">
      {props.showFormats && <span>Допустимые форматы: {props.formats}</span>}
      {props.showMaxQuantity && <span>Максимальное количество файлов — {props.maxQuantity}</span>}
      {props.showMaxFileSize && (
        <span>{props.align === 'left' ? 'Максимальный размер файла' : 'Максимальный размер'} — {props.maxFileSize}</span>
      )}
      {props.showMaxTotalSize && <span>Максимальный общий размер файлов — {props.maxTotalSize}</span>}
    </div>
  );
}
