import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import { Tooltip } from '../Tooltip/Tooltip';
import './FileItemLayout.css';

export type FileItemMessageType = 'error' | 'warning';

export interface FileItemMessage {
  type: FileItemMessageType;
  text: ReactNode;
}

export interface FileItemSlotContext {
  disabled: boolean;
}

export type FileItemSlot = ReactNode | ((context: FileItemSlotContext) => ReactNode);

export interface FileItemLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  fileName: string;
  weight?: string;
  additionalContent?: FileItemSlot;
  trailingAction?: FileItemSlot;
  message?: FileItemMessage;
  leading?: ReactNode | false;
  leadingIcon?: IconName;
  preview?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  beforeLeading?: ReactNode;
}

export function resolveFileItemSlot(slot: FileItemSlot | undefined, disabled: boolean) {
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
    <span className="fdoc-file-item__name-slot" data-file-item-slot="name">
      <Tooltip content={fileName} placement="bottom" disabled={!truncated}>
        <span ref={ref} className="fdoc-file-item__name">{fileName}</span>
      </Tooltip>
    </span>
  );
}

export function FileItemLayout({
  fileName,
  weight,
  additionalContent,
  trailingAction,
  message,
  leading,
  leadingIcon = 'doc-paper',
  preview,
  loading = false,
  disabled = false,
  beforeLeading,
  className = '',
  ...props
}: FileItemLayoutProps) {
  const messageId = useId();
  const semanticIcon: IconName | undefined = message?.type === 'error'
    ? 'filled/exclamation_circle_filled'
    : message?.type === 'warning'
      ? 'exclamation_triangle'
      : undefined;

  let leadingContent: ReactNode = null;
  let leadingClassName = 'fdoc-file-item__leading';

  if (leading !== false) {
    if (loading) {
      leadingContent = <ProgressIndicator type="circular" mode="indeterminate" size={20} variant="primary" />;
    } else if (preview !== undefined) {
      leadingContent = (
        <span className="fdoc-file-item__preview">
          {preview ?? <span className="fdoc-file-item__preview-placeholder" />}
        </span>
      );
    } else if (leading !== undefined) {
      leadingContent = leading;
    } else {
      leadingContent = <Icon name={semanticIcon ?? leadingIcon} size={24} />;
      if (semanticIcon) leadingClassName += ' fdoc-file-item__leading--semantic';
    }
  }

  const resolvedAdditional = additionalContent !== undefined
    ? resolveFileItemSlot(additionalContent, disabled)
    : weight;
  const resolvedTrailing = resolveFileItemSlot(trailingAction, disabled);

  const hasAdditional = resolvedAdditional !== null && resolvedAdditional !== undefined && resolvedAdditional !== false;
  const hasTrailing = resolvedTrailing !== null && resolvedTrailing !== undefined && resolvedTrailing !== false;
  const additionalIsText = typeof resolvedAdditional === 'string' || typeof resolvedAdditional === 'number';
  const additionalIsComponent = hasAdditional && !additionalIsText;
  const describedBy = [props['aria-describedby'], message ? messageId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div
      {...props}
      role={props.role ?? 'group'}
      aria-label={props['aria-label'] ?? fileName}
      aria-describedby={describedBy}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      className={`fdoc-file-item ${loading ? 'fdoc-file-item--loading' : ''} ${disabled ? 'fdoc-file-item--disabled' : ''} ${message ? `fdoc-file-item--message-${message.type}` : ''} ${className}`}
    >
      {beforeLeading}

      {leading !== false && leadingContent !== null && (
        <span className={leadingClassName} data-file-item-slot="leading">{leadingContent}</span>
      )}

      <div className="fdoc-file-item__content">
        <div className="fdoc-file-item__line">
          <FileName fileName={fileName} />
          {(hasAdditional || hasTrailing) && (
            <span className={`fdoc-file-item__right ${additionalIsText ? 'fdoc-file-item__right--text' : ''} ${additionalIsComponent ? 'fdoc-file-item__right--component' : ''}`}>
              {hasAdditional && (
                <span className={`fdoc-file-item__additional ${additionalIsText ? 'fdoc-file-item__additional--text' : 'fdoc-file-item__additional--component'}`} data-file-item-slot="additional">
                  {additionalIsText
                    ? <span className="fdoc-file-item__additional-text">{resolvedAdditional}</span>
                    : resolvedAdditional}
                </span>
              )}
              {hasTrailing && <span className="fdoc-file-item__trailing" data-file-item-slot="trailing">{resolvedTrailing}</span>}
            </span>
          )}
        </div>

        {message && (
          <span
            id={messageId}
            className={`fdoc-file-item__message fdoc-file-item__message--${message.type}`}
            data-file-item-slot="message"
            role={message.type === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
