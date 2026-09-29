import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import { type MenuItem } from '../Menu/Menu';
import { Dropdown } from '../Menu/Dropdown';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import { Skeleton } from '../Skeleton/Skeleton';
import { Tooltip } from '../Tooltip/Tooltip';
import './FileRow.css';

export type FileRowState = 'default' | 'loading' | 'disabled' | 'skeleton';
export type FileRowMessageType = 'error' | 'warning';
export type FileRowReorderDirection = 'up' | 'down';

export interface FileRowMessage {
  type: FileRowMessageType;
  text: ReactNode;
}

export interface FileRowSlotContext {
  disabled: boolean;
}

export type FileRowSlot = ReactNode | ((context: FileRowSlotContext) => ReactNode);

export interface FileRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'draggable' | 'onDragStart' | 'onDragEnd'> {
  /** Состояние строки. Содержимое Leading и Additional content на состояние не завязано. */
  state?: FileRowState;
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

function resolveSlot(slot: FileRowSlot | undefined, disabled: boolean) {
  return typeof slot === 'function' ? slot({ disabled }) : slot;
}

function FileName({ fileName }: { fileName: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => setTruncated(node.scrollWidth > node.clientWidth);
    update();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [fileName]);

  return (
    <Tooltip content={fileName} placement="bottom" disabled={!truncated}>
      <span ref={ref} className="fdoc-file-row__name">{fileName}</span>
    </Tooltip>
  );
}

export function FileRow({
  state = 'default',
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
  const messageId = useId();

  if (state === 'skeleton') {
    return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="file-row-skeleton" />;
  }

  const disabled = state === 'disabled';
  const loading = state === 'loading';
  const hasMenu = !!menuItems?.length;
  const semanticIcon: IconName | undefined = message?.type === 'error'
    ? 'filled/exclamation_circle_filled'
    : message?.type === 'warning'
      ? 'exclamation_triangle'
      : undefined;

  let leadingContent: ReactNode = null;
  let leadingClassName = 'fdoc-file-row__leading';
  if (leading !== false) {
    if (loading) {
      leadingContent = <ProgressIndicator type="circular" mode="indeterminate" size={20} variant="primary" duration={2000} />;
    } else if (preview !== undefined) {
      leadingContent = (
        <span className="fdoc-file-row__preview">
          {preview ?? <span className="fdoc-file-row__preview-placeholder" />}
        </span>
      );
    } else if (leading !== undefined) {
      leadingContent = leading;
    } else {
      leadingContent = <Icon name={semanticIcon ?? leadingIcon} size={24} />;
      if (semanticIcon) leadingClassName += ' fdoc-file-row__leading--semantic';
    }
  }

  const resolvedAdditional = additionalContent !== undefined
    ? resolveSlot(additionalContent, disabled)
    : weight
      ? <span>{weight}</span>
      : null;
  const hasAdditional = resolvedAdditional !== null && resolvedAdditional !== undefined && resolvedAdditional !== false;

  let resolvedTrailing = resolveSlot(trailingAction, disabled);
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
  const hasTrailing = resolvedTrailing !== null && resolvedTrailing !== undefined && resolvedTrailing !== false;

  const describedBy = [props['aria-describedby'], message ? messageId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div
      {...props}
      role={props.role ?? 'group'}
      aria-label={props['aria-label'] ?? fileName}
      aria-describedby={describedBy}
      aria-busy={loading || undefined}
      className={`fdoc-file-row fdoc-file-row--${state} ${message ? `fdoc-file-row--message-${message.type}` : ''} ${reorderable ? 'fdoc-file-row--reorderable' : ''} ${className}`}
      data-testid="file-row"
    >
      {reorderable && (
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
      )}

      {leading !== false && leadingContent !== null && (
        <span className={leadingClassName}>{leadingContent}</span>
      )}

      <div className="fdoc-file-row__content">
        <div className="fdoc-file-row__line">
          <FileName fileName={fileName} />
          {(hasAdditional || hasTrailing) && (
            <span className="fdoc-file-row__right">
              {hasAdditional && <span className="fdoc-file-row__additional">{resolvedAdditional}</span>}
              {hasTrailing && <span className="fdoc-file-row__trailing">{resolvedTrailing}</span>}
            </span>
          )}
        </div>

        {message && (
          <span
            id={messageId}
            className={`fdoc-file-row__message fdoc-file-row__message--${message.type}`}
            role={message.type === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
