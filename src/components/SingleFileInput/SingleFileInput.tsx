import { useRef, useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  FileItemLayout,
  type FileItemMessage,
  type FileItemSlot,
} from '../FileItemLayout/FileItemLayout';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import { Tooltip } from '../Tooltip/Tooltip';
import './SingleFileInput.css';

export type SingleFileInputType = 'default' | 'disabled' | 'skeleton';
export type SingleFileInputSize = 'desktop' | 'mobile';
export type SingleFileInputFileState = 'default' | 'loading';

export interface SingleFileInputFileProps {
  state?: SingleFileInputFileState;
  disabled?: boolean;
  fileName?: string;
  weight?: string;
  additionalContent?: FileItemSlot;
  trailingAction?: FileItemSlot;
  message?: FileItemMessage;
  leading?: ReactNode | false;
  leadingIcon?: IconName;
  preview?: ReactNode;
  deletable?: boolean;
  onDelete?: () => void;
}

export interface SingleFileInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Desktop is desktop-first and automatically switches to the mobile action below 456px container width. */
  size?: SingleFileInputSize;
  type?: SingleFileInputType;
  /** Ошибка валидации. Наличие сообщения включает Error-оформление. */
  validationMessage?: ReactNode;
  accept?: string;
  buttonText?: string;
  placeholder?: string;
  /** Контролируемый выбранный файл. Без prop компонент хранит выбранный File сам. */
  file?: File | null;
  /** Настройка загруженного состояния SingleFileInput. */
  fileProps?: SingleFileInputFileProps;
  onFileChange?: (file: File | null) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} МБ`;
}

export function SingleFileInput({
  type = 'default',
  size = 'desktop',
  validationMessage,
  accept,
  buttonText = 'Загрузить',
  placeholder = 'Выберите файл',
  file,
  fileProps,
  onFileChange,
  className = '',
  ...props
}: SingleFileInputProps) {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controlled = file !== undefined;
  const selectedFile = controlled ? file : internalFile;

  if (type === 'skeleton') {
    return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="single-file-input-skeleton" />;
  }

  const disabled = type === 'disabled';
  const invalid = validationMessage !== undefined && validationMessage !== null && validationMessage !== false && validationMessage !== '';
  const hasFilledState = selectedFile !== null || !!fileProps?.fileName;

  if (hasFilledState) {
    const fileName = fileProps?.fileName ?? selectedFile?.name ?? 'File name.png';
    const weight = fileProps?.weight ?? (selectedFile ? formatFileSize(selectedFile.size) : undefined);
    const fileDisabled = disabled || !!fileProps?.disabled;
    const loading = fileProps?.state === 'loading';
    const message = fileProps?.message ?? (invalid ? { type: 'error' as const, text: validationMessage } : undefined);
    const deletable = fileProps?.deletable ?? true;

    const removeFile = () => {
      fileProps?.onDelete?.();
      if (!controlled) setInternalFile(null);
      onFileChange?.(null);
    };

    const trailingAction = fileProps?.trailingAction !== undefined
      ? fileProps.trailingAction
      : deletable
        ? (
          <Tooltip content="Удалить" placement="bottom" disabled={fileDisabled}>
            <ButtonIcon
              aria-label={`Удалить файл ${fileName}`}
              icon="filled/cross_circle_filled"
              size="xsmall"
              iconSize={24}
              color="neutral"
              disabled={fileDisabled}
              className="fdoc-single-file-input__delete"
              onClick={removeFile}
            />
          </Tooltip>
        )
        : undefined;

    return (
      <FileItemLayout
        {...props}
        fileName={fileName}
        weight={weight}
        additionalContent={fileProps?.additionalContent}
        trailingAction={trailingAction}
        message={message}
        leading={fileProps?.leading}
        leadingIcon={fileProps?.leadingIcon ?? 'doc-paper'}
        preview={fileProps?.preview}
        loading={loading}
        disabled={fileDisabled}
        className={`fdoc-single-file-input fdoc-single-file-input--filled fdoc-single-file-input--${size} ${className}`}
        data-testid="single-file-input"
        aria-invalid={invalid || undefined}
      />
    );
  }

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    if (!controlled) setInternalFile(nextFile);
    onFileChange?.(nextFile);
    event.currentTarget.value = '';
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      {...props}
      className={`fdoc-single-file-input fdoc-single-file-input--empty fdoc-single-file-input--${size} ${invalid ? 'fdoc-single-file-input--validation-error' : ''} ${disabled ? 'fdoc-single-file-input--disabled' : ''} ${className}`}
      data-testid="single-file-input"
      aria-invalid={invalid || undefined}
    >
      <input
        ref={inputRef}
        className="fdoc-single-file-input__input"
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={change}
      />

      <span className="fdoc-single-file-input__icon">
        <Icon name={invalid ? 'filled/exclamation_circle_filled' : 'doc-paper'} size={24} />
      </span>
      <span className="fdoc-single-file-input__content">
        <span className="fdoc-single-file-input__label">{disabled ? 'Загрузка файлов недоступна' : placeholder}</span>
        {invalid && <span className="fdoc-single-file-input__validation-message">{validationMessage}</span>}
      </span>
      {!disabled && (
        <span className="fdoc-single-file-input__pick">
          <span className="fdoc-single-file-input__pick-desktop">
            <Button size="small" color="primary" onClick={openPicker}>{buttonText}</Button>
          </span>
          <span className="fdoc-single-file-input__pick-mobile">
            <ButtonIcon aria-label={buttonText} icon="plus" size="small" color="primary" onClick={openPicker} />
          </span>
        </span>
      )}
    </div>
  );
}
