import { useState, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
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
  deletable?: boolean;
  onDelete?: () => void;
  menuItems?: MenuItem[];
  menuAriaLabel?: string;
  onMenuAction?: (item: MenuItem) => void;
  /** Drag начинается только с Reorder handle. */
  onReorderDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  onReorderDragEnd?: (event: DragEvent<HTMLButtonElement>) => void;
  /** Клавиатурное изменение порядка. */
  onReorderKey?: (direction: FileRowReorderDirection) => void;
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
  deletable = false,
  onDelete,
  menuItems,
  menuAriaLabel,
  onMenuAction,
  onReorderDragStart,
  onReorderDragEnd,
  onReorderKey,
  className = '',
  ...props
}: FileRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          placement="bottom-end"
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

  const reorderHandle = reorderable ? (
    <ButtonIcon
      aria-label={`Изменить порядок файла ${fileName}`}
      aria-keyshortcuts="ArrowUp ArrowDown"
      icon="drag-dot"
      size="xsmall"
      iconSize={24}
      color="neutral"
      disabled={disabled}
      draggable={!disabled}
      className="fdoc-file-row__drag fdoc-file-row__button-icon"
      onDragStart={onReorderDragStart}
      onDragEnd={onReorderDragEnd}
      onKeyDown={event => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          onReorderKey?.(event.key === 'ArrowUp' ? 'up' : 'down');
        }
      }}
    />
  ) : undefined;

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
      className={`fdoc-file-row ${reorderable ? 'fdoc-file-row--reorderable' : ''} ${className}`}
      data-testid="file-row"
    />
  );
}
