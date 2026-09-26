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

export function Dropzone({
  state = 'default',
  align = 'left',
  accept,
  multiple = true,
  formats = '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png',
  maxQuantity = 10,
  maxFileSize = '15 МБ',
  maxTotalSize = '50 МБ',
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
  const activeState: DropzoneState | 'drag-over' = drag ? 'drag-over' : interactive && pressed ? 'pressed' : interactive && focused ? 'focused' : interactive && hovered ? 'hover' : state;
  const emit = (list: FileList | null) => { if (!disabled && list) onFiles?.(Array.from(list)); };
  const drop = (e: DragEvent) => { e.preventDefault(); setDrag(false); emit(e.dataTransfer.files); };

  if (state === 'skeleton') {
    return <Skeleton className={className} width="100%" height={align === 'center' ? 152 : 148} shape="rounded" data-testid="dropzone-skeleton" />;
  }

  const isError = activeState === 'error';
  const title = isError ? 'Вы загружаете недопустимые файлы' : disabled ? 'Загрузка файлов недоступна' : align === 'center' ? 'Или перетащите ваш файл сюда' : 'Перетащите файлы сюда, чтобы начать загрузку';

  return (
    <div
      {...props}
      className={`fdoc-dropzone fdoc-dropzone--${align} fdoc-dropzone--${activeState} ${className}`}
      tabIndex={disabled ? undefined : 0}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => !disabled && setFocused(true)}
      onBlur={() => { setFocused(false); setPressed(false); }}
      onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setPressed(true); } }}
      onKeyUp={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setPressed(false); input.current?.click(); } }}
      onClick={() => !disabled && input.current?.click()}
      onDragOver={e => { e.preventDefault(); if (!disabled) setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={drop}
      data-testid="dropzone"
      aria-disabled={disabled}
    >
      <input ref={input} className="fdoc-dropzone__input" type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={e => emit(e.target.files)} />
      {align === 'left' ? (
        <>
          <span className="fdoc-dropzone__icon"><Icon name={isError ? 'filled/exclamation_circle_filled' : 'doc-paper'} size={24} /></span>
          <div className="fdoc-dropzone__content">
            <strong>{title}</strong>
            {!disabled && <Requirements {...{ align, formats, maxQuantity, maxFileSize, maxTotalSize, showFormats, showMaxQuantity, showMaxFileSize, showMaxTotalSize }} />}
          </div>
        </>
      ) : (
        <div className="fdoc-dropzone__center">
          <Button size="medium" color="primary" iconLeft="plus" disabled={disabled} tabIndex={-1}>Выбрать файл</Button>
          <div className="fdoc-dropzone__center-content">
            <strong>{title}</strong>
            {!disabled && <Requirements {...{ align, formats: formats === '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png' ? '.docx, xlsx' : formats, maxQuantity, maxFileSize: maxFileSize === '15 МБ' ? '5 МБ' : maxFileSize, maxTotalSize, showFormats, showMaxQuantity, showMaxFileSize, showMaxTotalSize }} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Requirements(p: { align: DropzoneAlign; formats: string; maxQuantity: number; maxFileSize: string; maxTotalSize: string; showFormats: boolean; showMaxQuantity: boolean; showMaxFileSize: boolean; showMaxTotalSize: boolean }) {
  return <div className="fdoc-dropzone__requirements">
    {p.showFormats && <span>{p.align === 'left' ? <>Допустимые форматы:<br />{p.formats}</> : <>Допустимые форматы: {p.formats}</>}</span>}
    {p.showMaxQuantity && <span>Максимальное количество файлов — {p.maxQuantity}</span>}
    {p.showMaxFileSize && <span>{p.align === 'left' ? 'Максимальный размер файла' : 'Максимальный размер'} — {p.maxFileSize}</span>}
    {p.showMaxTotalSize && <span>Максимальный общий размер файлов — {p.maxTotalSize}</span>}
  </div>;
}
