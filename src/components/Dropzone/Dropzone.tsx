import { useMemo, useRef, useState, type DragEvent, type HTMLAttributes } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Dropzone.css';

export type DropzoneState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'error' | 'success' | 'skeleton';
export type DropzoneAlign = 'left' | 'center';
export type DropzoneValidationReason = 'format' | 'quantity' | 'file-size' | 'total-size';

export interface DropzoneValidationIssue {
  reason: DropzoneValidationReason;
  fileName?: string;
  limit?: number | string;
}

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  state?: DropzoneState;
  align?: DropzoneAlign;
  accept?: string;
  multiple?: boolean;
  formats?: string;
  maxQuantity?: number;
  maxFileSize?: string;
  maxTotalSize?: string;
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

const DEFAULT_FORMATS = '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png';
const DEFAULT_MAX_FILE_SIZE = '15 МБ';
const DEFAULT_MAX_TOTAL_SIZE = '50 МБ';

function isFileDrag(event: DragEvent) {
  return Array.from(event.dataTransfer.types ?? []).includes('Files');
}

function normalizeFormatToken(token: string) {
  const trimmed = token.trim().toLowerCase();
  if (!trimmed) return '';
  if (trimmed.includes('/')) return trimmed;
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
}

function parseFormats(formats: string) {
  return formats
    .split(',')
    .flatMap(part => part.trim().split(/\s+/))
    .map(normalizeFormatToken)
    .filter(Boolean);
}

function fileMatchesFormats(file: File, formats: string[]) {
  if (!formats.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return formats.some(format => {
    if (format.includes('/')) {
      if (format.endsWith('/*')) return type.startsWith(format.slice(0, -1));
      return type === format;
    }
    return name.endsWith(format);
  });
}

function parseSizeToBytes(value: string) {
  const normalized = value
    .replace(/\u00a0/g, ' ')
    .replace(',', '.')
    .trim()
    .toLowerCase();
  const match = normalized.match(/([\d.]+)\s*(гб|gb|мб|mb|кб|kb|б|b)?/i);
  if (!match) return undefined;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return undefined;

  const unit = match[2]?.toLowerCase() ?? 'b';
  const multiplier = unit === 'гб' || unit === 'gb'
    ? 1024 ** 3
    : unit === 'мб' || unit === 'mb'
      ? 1024 ** 2
      : unit === 'кб' || unit === 'kb'
        ? 1024
        : 1;

  return amount * multiplier;
}

export function Dropzone({
  state = 'default',
  align = 'left',
  accept,
  multiple = true,
  formats = DEFAULT_FORMATS,
  maxQuantity = 10,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxTotalSize = DEFAULT_MAX_TOTAL_SIZE,
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
  const allowedFormats = useMemo(() => parseFormats(formats), [formats]);
  const maxFileSizeBytes = useMemo(() => parseSizeToBytes(maxFileSize), [maxFileSize]);
  const maxTotalSizeBytes = useMemo(() => parseSizeToBytes(maxTotalSize), [maxTotalSize]);
  const inputAccept = accept ?? allowedFormats.join(',');

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

  const validate = (files: File[]) => {
    const issues: DropzoneValidationIssue[] = [];
    const quantityLimit = multiple ? maxQuantity : Math.min(maxQuantity, 1);

    if (files.length > quantityLimit) {
      issues.push({ reason: 'quantity', limit: quantityLimit });
    }

    for (const file of files) {
      if (!fileMatchesFormats(file, allowedFormats)) {
        issues.push({ reason: 'format', fileName: file.name, limit: formats });
      }
      if (maxFileSizeBytes !== undefined && file.size > maxFileSizeBytes) {
        issues.push({ reason: 'file-size', fileName: file.name, limit: maxFileSize });
      }
    }

    if (maxTotalSizeBytes !== undefined && files.reduce((sum, file) => sum + file.size, 0) > maxTotalSizeBytes) {
      issues.push({ reason: 'total-size', limit: maxTotalSize });
    }

    return issues;
  };

  const emit = (list: FileList | null) => {
    if (disabled || !list) return;
    const files = Array.from(list);
    const issues = validate(files);
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
        accept={inputAccept || undefined}
        multiple={multiple}
        disabled={disabled}
        onChange={event => emit(event.target.files)}
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
                {...{
                  align,
                  formats,
                  maxQuantity,
                  maxFileSize,
                  maxTotalSize,
                  showFormats,
                  showMaxQuantity,
                  showMaxFileSize,
                  showMaxTotalSize,
                }}
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
                {...{
                  align,
                  formats: formats === DEFAULT_FORMATS ? '.docx, xlsx' : formats,
                  maxQuantity,
                  maxFileSize: maxFileSize === DEFAULT_MAX_FILE_SIZE ? '5 МБ' : maxFileSize,
                  maxTotalSize,
                  showFormats,
                  showMaxQuantity,
                  showMaxFileSize,
                  showMaxTotalSize,
                }}
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
