import { useRef, useState, type DragEvent, type HTMLAttributes } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Dropzone.css';

export type DropzoneState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'error' | 'success' | 'skeleton';
export type DropzoneAlign = 'left' | 'center';

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  state?: DropzoneState;
  align?: DropzoneAlign;
  accept?: string;
  multiple?: boolean;
  formats?: string;
  maxQuantity?: number;
  maxFileSize?: string;
  maxTotalSize?: string;
  showFormats?: boolean;
  showMaxQuantity?: boolean;
  showMaxFileSize?: boolean;
  showMaxTotalSize?: boolean;
  onFiles?: (files: File[]) => void;
}

const DEFAULT_FORMATS = '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png';
const DEFAULT_MAX_FILE_SIZE = '15 МБ';
const DEFAULT_MAX_TOTAL_SIZE = '50 МБ';

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
  className = '',
  ...props
}: DropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const disabled = state === 'disabled';
  const interactive = state === 'default';
  const activeState: DropzoneState | 'drag-over' = drag
    ? 'drag-over'
    : interactive && pressed
      ? 'pressed'
      : interactive && focused
        ? 'focused'
        : interactive && hovered
          ? 'hover'
          : state;

  const emit = (list: FileList | null) => {
    if (!disabled && list) onFiles?.(Array.from(list));
  };

  const drop = (event: DragEvent) => {
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
        event.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={drop}
      data-testid="dropzone"
      aria-disabled={disabled}
    >
      <input
        ref={input}
        className="fdoc-dropzone__input"
        type="file"
        accept={accept}
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
