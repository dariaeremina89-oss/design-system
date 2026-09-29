import { useRef, useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { FileRow, type FileRowProps } from '../FileRow/FileRow';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './SingleFileInput.css';

export type SingleFileInputType = 'default' | 'disabled' | 'skeleton';
export type SingleFileInputSize = 'desktop' | 'mobile';
export type SingleFileInputFileRowProps = Omit<
  FileRowProps,
  'reorderable' | 'onReorderDragStart' | 'onReorderDragEnd' | 'onReorderKey'
>;

export interface SingleFileInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type?: SingleFileInputType;
  size?: SingleFileInputSize;
  /** Ошибка валидации. Наличие сообщения включает Error-оформление. */
  validationMessage?: ReactNode;
  accept?: string;
  buttonText?: string;
  placeholder?: string;
  /** Контролируемый выбранный файл. Без prop компонент хранит выбранный File сам. */
  file?: File | null;
  /** Настройка заполненного состояния. Внутри используется FileRow без reorder. */
  fileRowProps?: SingleFileInputFileRowProps;
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
  fileRowProps,
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
  const hasFilledState = selectedFile !== null || !!fileRowProps?.fileName;

  if (hasFilledState) {
    const {
      fileName: fileRowFileName,
      weight: fileRowWeight,
      message: fileRowMessage,
      state: fileRowState = 'default',
      disabled: fileRowDisabled = false,
      deletable: fileRowDeletable = true,
      onDelete: fileRowOnDelete,
      className: fileRowClassName = '',
      ...restFileRowProps
    } = fileRowProps ?? {};

    const fileName = fileRowFileName ?? selectedFile?.name ?? 'File name.png';
    const weight = fileRowWeight ?? (selectedFile ? formatFileSize(selectedFile.size) : undefined);
    const message = fileRowMessage ?? (invalid ? { type: 'error' as const, text: validationMessage } : undefined);

    const removeFile = () => {
      fileRowOnDelete?.();
      if (!controlled) setInternalFile(null);
      onFileChange?.(null);
    };

    return (
      <FileRow
        {...props}
        {...restFileRowProps}
        state={fileRowState}
        disabled={disabled || fileRowDisabled}
        fileName={fileName}
        weight={weight}
        message={message}
        reorderable={false}
        deletable={fileRowDeletable}
        onDelete={removeFile}
        className={`${fileRowClassName} ${className}`.trim()}
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
      className={`fdoc-single-file-input fdoc-single-file-input--${size} ${invalid ? 'fdoc-single-file-input--validation-error' : ''} ${disabled ? 'fdoc-single-file-input--disabled' : ''} ${className}`}
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
          {size === 'mobile' ? (
            <ButtonIcon aria-label={buttonText} icon="plus" size="small" color="primary" onClick={openPicker} />
          ) : (
            <Button size="small" color="primary" onClick={openPicker}>{buttonText}</Button>
          )}
        </span>
      )}
    </div>
  );
}
