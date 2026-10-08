import { useRef, useState, type DragEvent, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  FileItemLayout,
  resolveFileItemSlot,
  type FileItemMessage,
  type FileItemMessageType,
  type FileItemSlot,
  type FileItemSlotContext,
} from '../FileItemLayout/FileItemLayout';
import { type IconName } from '../Icon/Icon';
import { type MenuItem } from '../Menu/Menu';
import { Dropdown } from '../Menu/Dropdown';
import { Skeleton } from '../Skeleton/Skeleton';
import { Tooltip } from '../Tooltip/Tooltip';
import './FileRow.css';

/** `disabled` в state оставлен как совместимый алиас; для сочетаний используйте отдельный prop disabled. */
export type FileRowState = 'default' | 'loading' | 'disabled' | 'skeleton';
export type FileRowMessageType = FileItemMessageType;
export type FileRowReorderDirection = 'up' | 'down';
export type FileRowMessage = FileItemMessage;
export type FileRowSlotContext = FileItemSlotContext;
export type FileRowSlot = FileItemSlot;

export interface FileRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'draggable' | 'onDragStart' | 'onDragEnd'> {
  /** Состояние содержимого строки. `disabled` лучше передавать отдельным prop. */
  state?: FileRowState;
  /** Отключает действия и применяет Disabled-оформление независимо от Loading/Message/preview. */
  disabled?: boolean;
  fileName?: string;
  /** Удобный shortcut для размера файла. Не отображается, если передан additionalContent. */
  weight?: string;
  /** Произвольный Additional content справа от имени файла. */
  additionalContent?: FileRowSlot;
  /** Произвольное действие в конце строки. */
  trailingAction?: FileRowSlot;
  /** Сообщение конкретного файла. */
  message?: FileRowMessage;
  /** Произвольный Leading. false полностью скрывает Leading без сохранения места. */
  leading?: ReactNode | false;
  /** Иконка обычного Leading. При Message заменяется семантической иконкой. */
  leadingIcon?: IconName;
  /** Preview внутри области Leading. */
  preview?: ReactNode;
  reorderable?: boolean;
  /** Отключает только reorder handle, не всю строку. */
  reorderDisabled?: boolean;
  /** Опциональный Tooltip для reorder handle. */
  reorderTooltip?: ReactNode;
  deletable?: boolean;
  onDelete?: () => void;
  menuItems?: MenuItem[];
  menuAriaLabel?: string;
  onMenuAction?: (item: MenuItem) => void;
  /** Desktop drag начинается только с Reorder handle. */
  onReorderDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  onReorderDragEnd?: (event: DragEvent<HTMLButtonElement>) => void;
  /** Touch/pen reorder через Pointer Events. */
  onReorderPointerStart?: (event: PointerEvent<HTMLButtonElement>) => void;
  onReorderPointerMove?: (event: PointerEvent<HTMLButtonElement>) => void;
  onReorderPointerEnd?: (event: PointerEvent<HTMLButtonElement>) => void;
  /** Клавиатурное изменение порядка. */
  onReorderKey?: (direction: FileRowReorderDirection) => void;
}

function createRowDragPreview(event: DragEvent<HTMLButtonElement>, fileName: string) {
  const row = event.currentTarget.closest('.fdoc-file-row') as HTMLElement | null;
  if (!row) return;

  const rect = row.getBoundingClientRect();
  const preview = row.cloneNode(true) as HTMLElement;
  preview.classList.add('fdoc-file-row__drag-preview');
  preview.style.width = `${rect.width}px`;
  preview.setAttribute('aria-hidden', 'true');
  preview.removeAttribute('data-testid');
  preview.removeAttribute('data-file-row-dragging');
  preview.querySelectorAll('[data-testid]').forEach(node => node.removeAttribute('data-testid'));
  preview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  document.body.appendChild(preview);

  const offsetX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const offsetY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  if (typeof event.dataTransfer.setDragImage === 'function') {
    event.dataTransfer.setDragImage(preview, offsetX, offsetY);
  }
  if (typeof event.dataTransfer.setData === 'function') {
    event.dataTransfer.setData('text/plain', fileName);
  }
  event.dataTransfer.effectAllowed = 'move';

  requestAnimationFrame(() => preview.remove());
}

export function FileRow({
  state = 'default',
  disabled: disabledProp = false,
  fileName = 'File name.png',
  weight,
  additionalContent,
  trailingAction,
  message,
  leading,
  leadingIcon = 'doc-paper',
  preview,
  reorderable = false,
  reorderDisabled = false,
  reorderTooltip,
  deletable = false,
  onDelete,
  menuItems,
  menuAriaLabel,
  onMenuAction,
  onReorderDragStart,
  onReorderDragEnd,
  onReorderPointerStart,
  onReorderPointerMove,
  onReorderPointerEnd,
  onReorderKey,
  className = '',
  ...props
}: FileRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pointerPreviewRef = useRef<HTMLElement | null>(null);
  const pointerOffsetRef = useRef({ x: 0, y: 0 });

  if (state === 'skeleton') {
    return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="file-row-skeleton" />;
  }

  const disabled = disabledProp || state === 'disabled';
  const loading = state === 'loading';
  const hasMenu = !!menuItems?.length;

  let resolvedTrailing = resolveFileItemSlot(trailingAction, disabled);
  if (trailingAction === undefined) {
    if (hasMenu) {
      resolvedTrailing = disabled ? (
        <ButtonIcon
          aria-label={menuAriaLabel ?? `Действия с файлом ${fileName}`}
          icon="more-vertical"
          size="xsmall"
          iconSize={24}
          color="neutral"
          disabled
          className="fdoc-file-row__button-icon"
        />
      ) : (
        <Dropdown
          items={menuItems!}
          trigger="hover"
          placement="bottom"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onAction={item => onMenuAction?.(item)}
        >
          <ButtonIcon
            aria-label={menuAriaLabel ?? `Действия с файлом ${fileName}`}
            icon="more-vertical"
            size="xsmall"
            iconSize={24}
            color="neutral"
            state={menuOpen ? 'hover' : 'default'}
            className="fdoc-file-row__button-icon"
          />
        </Dropdown>
      );
    } else if (deletable || onDelete) {
      resolvedTrailing = (
        <Tooltip content="Удалить" placement="bottom" disabled={disabled}>
          <ButtonIcon
            aria-label={`Удалить файл ${fileName}`}
            icon="filled/cross_circle_filled"
            size="xsmall"
            iconSize={24}
            color="neutral"
            disabled={disabled}
            className="fdoc-file-row__button-icon"
            onClick={onDelete}
          />
        </Tooltip>
      );
    }
  }

  const reorderButton = reorderable ? (
    <ButtonIcon
      aria-label={`Изменить порядок файла ${fileName}`}
      aria-keyshortcuts="ArrowUp ArrowDown"
      icon="drag-dot"
      size="xsmall"
      iconSize={24}
      color="neutral"
      disabled={disabled || reorderDisabled}
      draggable={!disabled && !reorderDisabled}
      data-testid="file-row-reorder-handle"
      className="fdoc-file-row__drag fdoc-file-row__button-icon"
      onDragStart={event => {
        if (disabled || reorderDisabled) return;
        setDragging(true);
        createRowDragPreview(event, fileName);
        onReorderDragStart?.(event);
      }}
      onDragEnd={event => {
        setDragging(false);
        onReorderDragEnd?.(event);
      }}
      onPointerDown={event => {
        if (event.pointerType === 'mouse' || disabled || reorderDisabled) return;

        const row = event.currentTarget.closest('.fdoc-file-row') as HTMLElement | null;
        if (!row) return;

        event.preventDefault();
        const rect = row.getBoundingClientRect();
        const pointerPreview = row.cloneNode(true) as HTMLElement;
        pointerPreview.classList.add('fdoc-file-row__pointer-preview');
        pointerPreview.style.width = `${rect.width}px`;
        pointerPreview.style.left = `${rect.left}px`;
        pointerPreview.style.top = `${rect.top}px`;
        pointerPreview.setAttribute('aria-hidden', 'true');
        pointerPreview.removeAttribute('data-testid');
        pointerPreview.removeAttribute('data-file-row-dragging');
        pointerPreview.querySelectorAll('[data-testid]').forEach(node => node.removeAttribute('data-testid'));
        pointerPreview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        document.body.appendChild(pointerPreview);

        pointerPreviewRef.current?.remove();
        pointerPreviewRef.current = pointerPreview;
        pointerOffsetRef.current = {
          x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
          y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
        };

        try {
          event.currentTarget.setPointerCapture?.(event.pointerId);
        } catch {
          // Synthetic pointer events used by tests may not have an active pointer capture.
        }

        setDragging(true);
        onReorderPointerStart?.(event);
      }}
      onPointerMove={event => {
        if (event.pointerType === 'mouse' || !pointerPreviewRef.current) return;
        event.preventDefault();

        pointerPreviewRef.current.style.left = `${event.clientX - pointerOffsetRef.current.x}px`;
        pointerPreviewRef.current.style.top = `${event.clientY - pointerOffsetRef.current.y}px`;
        onReorderPointerMove?.(event);
      }}
      onPointerUp={event => {
        if (event.pointerType === 'mouse' || !pointerPreviewRef.current) return;
        event.preventDefault();

        pointerPreviewRef.current.remove();
        pointerPreviewRef.current = null;
        setDragging(false);
        onReorderPointerEnd?.(event);
      }}
      onPointerCancel={event => {
        if (event.pointerType === 'mouse' || !pointerPreviewRef.current) return;

        pointerPreviewRef.current.remove();
        pointerPreviewRef.current = null;
        setDragging(false);
        onReorderPointerEnd?.(event);
      }}
      onKeyDown={event => {
        if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !reorderDisabled) {
          event.preventDefault();
          onReorderKey?.(event.key === 'ArrowUp' ? 'up' : 'down');
        }
      }}
    />
  ) : undefined;

  const reorderHandle = reorderButton && reorderTooltip ? (
    <Tooltip content={reorderTooltip} placement="bottom" disabled={disabled}>
      {reorderButton}
    </Tooltip>
  ) : reorderButton;

  return (
    <FileItemLayout
      {...props}
      fileName={fileName}
      weight={weight}
      additionalContent={additionalContent}
      trailingAction={resolvedTrailing}
      message={message}
      leading={leading}
      leadingIcon={leadingIcon}
      preview={preview}
      loading={loading}
      disabled={disabled}
      beforeLeading={reorderHandle}
      className={`fdoc-file-row ${reorderable ? 'fdoc-file-row--reorderable' : ''} ${dragging ? 'fdoc-file-row--dragging' : ''} ${className}`}
      data-file-row-dragging={dragging || undefined}
      data-testid="file-row"
    />
  );
}
