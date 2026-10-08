import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MultipleFileInput } from './MultipleFileInput';

const files = [
  { id: 'first', fileName: 'Первый.pdf', weight: '2,7 МБ' },
  { id: 'second', fileName: 'Второй.docx', additionalContent: 'Шаблон' },
];

describe('MultipleFileInput', () => {
  it('renders the Figma collapse summary and file rows', () => {
    render(<MultipleFileInput files={files} />);
    expect(screen.getByText('2 файлов')).toBeInTheDocument();
    expect(screen.getByText('Первый.pdf')).toBeInTheDocument();
    expect(screen.getByText('Второй.docx')).toBeInTheDocument();
    expect(screen.getByText('Шаблон')).toBeInTheDocument();
  });

  it('renders file error count under the file count link', () => {
    render(<MultipleFileInput files={files} errorCount={1} />);
    expect(screen.getByText('Ошибки в файлах (1)')).toBeInTheDocument();
  });

  it('renders per-file Message independently from Group FileRow error', () => {
    render(
      <MultipleFileInput
        files={[{ ...files[0], message: { type: 'warning', text: 'Проверьте файл' } }, files[1]]}
        groupErrorText="Превышен максимальный общий размер файлов"
        totalSize="8,1 МБ"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Проверьте файл');
    expect(screen.getByTestId('multiple-file-input-group-error')).toHaveTextContent('Превышен максимальный общий размер файлов');
    expect(screen.getByText('Общий объем: 8,1 МБ')).toBeInTheDocument();
  });

  it('shows all Dropzone constraints in the MultipleFileInput Dropzone variant', () => {
    const { container } = render(<MultipleFileInput files={files} showDropzone />);
    const requirements = container.querySelector('.fdoc-dropzone__requirements');

    expect(requirements).toHaveTextContent('Максимальное количество файлов — 10');
    expect(requirements).toHaveTextContent('Максимальный общий размер файлов — 50 МБ');
  });

  it('opens the internal picker from the standard button and keeps onChooseFiles as notification only', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
    const onChooseFiles = vi.fn();
    render(<MultipleFileInput files={files} showButtons onChooseFiles={onChooseFiles} />);

    fireEvent.click(screen.getByRole('button', { name: 'Выбрать файл' }));

    expect(onChooseFiles).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });

  it('uses the updated Figma action buttons', () => {
    render(<MultipleFileInput files={files} showButtons />);
    const choose = screen.getByRole('button', { name: 'Выбрать файл' });
    const remove = screen
      .getAllByRole('button', { name: 'Удалить все' })
      .find(button => button.querySelector('[data-icon="trash-can"]'));

    expect(choose.querySelector('[data-icon="arrow-upload"]')).toBeInTheDocument();
    expect(remove).toBeDefined();
    expect(remove!).toHaveClass('fdoc-button--secondary');
  });

  it('adds valid files selected from the button', () => {
    const onAddFiles = vi.fn();
    const { container } = render(
      <MultipleFileInput
        files={[]}
        showButtons
        validation={{ formats: '.pdf', maxFileSize: '10 Б' }}
        onAddFiles={onAddFiles}
      />,
    );
    const picker = container.querySelector('input[type="file"]') as HTMLInputElement;
    const valid = new File(['x'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(picker, { target: { files: [valid] } });

    expect(onAddFiles).toHaveBeenCalledWith([valid]);
  });

  it('validates files selected from the button before onAddFiles', () => {
    const onAddFiles = vi.fn();
    const onValidationError = vi.fn();
    const dropzoneValidationError = vi.fn();
    const { container } = render(
      <MultipleFileInput
        files={[]}
        showButtons
        validation={{ formats: '.pdf', maxFileSize: '1 Б' }}
        dropzoneProps={{ onValidationError: dropzoneValidationError }}
        onAddFiles={onAddFiles}
        onValidationError={onValidationError}
      />,
    );
    const picker = container.querySelector('input[type="file"]') as HTMLInputElement;
    const invalid = new File(['xx'], 'document.txt', { type: 'text/plain' });

    fireEvent.change(picker, { target: { files: [invalid] } });

    expect(onAddFiles).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ reason: 'format', fileName: 'document.txt' }),
      expect.objectContaining({ reason: 'file-size', fileName: 'document.txt' }),
    ]));
    expect(dropzoneValidationError).not.toHaveBeenCalled();
  });

  it('uses the same validation rules for Dropzone and button flows', () => {
    const onAddFiles = vi.fn();
    const onValidationError = vi.fn();
    const dropzoneValidationError = vi.fn();
    const { container } = render(
      <MultipleFileInput
        files={[files[0]]}
        showButtons
        showDropzone
        totalSize="2 Б"
        validation={{ formats: '.pdf', maxQuantity: 1, maxFileSize: '10 Б', maxTotalSize: '2 Б' }}
        dropzoneProps={{ onValidationError: dropzoneValidationError }}
        onAddFiles={onAddFiles}
        onValidationError={onValidationError}
      />,
    );
    const pickers = container.querySelectorAll('input[type="file"]');
    const nextFile = new File(['x'], 'next.pdf', { type: 'application/pdf' });

    fireEvent.change(pickers[0], { target: { files: [nextFile] } });
    fireEvent.change(pickers[1], { target: { files: [nextFile] } });

    expect(onAddFiles).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledTimes(2);
    expect(dropzoneValidationError).toHaveBeenCalledTimes(1);
    expect(onValidationError).toHaveBeenNthCalledWith(1, expect.arrayContaining([
      expect.objectContaining({ reason: 'quantity', limit: 1 }),
      expect.objectContaining({ reason: 'total-size', limit: '2 Б' }),
    ]));
    expect(onValidationError).toHaveBeenNthCalledWith(2, expect.arrayContaining([
      expect.objectContaining({ reason: 'quantity', limit: 1 }),
      expect.objectContaining({ reason: 'total-size', limit: '2 Б' }),
    ]));
  });

  it('hides the file group when collapsed', () => {
    render(<MultipleFileInput files={files} collapsed />);
    expect(screen.queryByText('Первый.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('2 файлов')).toBeInTheDocument();
  });

  it('calls collapse and delete actions', () => {
    const onToggleCollapse = vi.fn();
    const onDeleteAll = vi.fn();
    render(<MultipleFileInput files={files} onToggleCollapse={onToggleCollapse} onDeleteAll={onDeleteAll} />);
    fireEvent.click(screen.getByText('2 файлов'));
    fireEvent.click(screen.getByText('Удалить все'));
    expect(onToggleCollapse).toHaveBeenCalledOnce();
    expect(onDeleteAll).toHaveBeenCalledOnce();
  });

  it('reorders only from the handle and shows the Figma insertion indicator', () => {
    const onReorder = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(
      <MultipleFileInput files={[{ ...files[0], onDelete }, files[1]]} reorderable onReorder={onReorder} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл Первый.pdf' }));
    expect(onDelete).toHaveBeenCalledOnce();

    const items = container.querySelectorAll('.fdoc-multiple-file-input__item');
    const firstHandle = screen.getByRole('button', { name: 'Изменить порядок файла Первый.pdf' });
    expect(items[0]).not.toHaveAttribute('draggable', 'true');
    expect(firstHandle).toHaveAttribute('draggable', 'true');

    fireEvent.dragStart(firstHandle, { dataTransfer: { effectAllowed: '', setData: vi.fn() } });
    fireEvent.dragOver(items[1], { clientY: 1, dataTransfer: { dropEffect: '' } });
    expect(screen.getByTestId('file-row-drop-indicator')).toBeInTheDocument();
    fireEvent.drop(items[1], { clientY: 1, dataTransfer: { dropEffect: '' } });
    expect(onReorder).toHaveBeenCalledWith(0, 1);
    expect(screen.queryByTestId('file-row-drop-indicator')).not.toBeInTheDocument();
  });

  it('supports keyboard reorder from the handle', () => {
    const onReorder = vi.fn();
    render(<MultipleFileInput files={files} reorderable onReorder={onReorder} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Изменить порядок файла Первый.pdf' }), { key: 'ArrowDown' });
    expect(onReorder).toHaveBeenCalledWith(0, 1);
  });

  it('can disable only the reorder handle while keeping the row active', () => {
    render(
      <MultipleFileInput
        files={[
          {
            id: 'template',
            fileName: 'Шаблон.docx',
            additionalContent: 'Шаблон',
            reorderable: true,
            reorderDisabled: true,
            reorderTooltip: 'Порядок можно изменить, когда шаблонов несколько',
          },
          { id: 'document', fileName: 'Документ.pdf', weight: '2,7 МБ' },
        ]}
      />,
    );

    const handle = screen.getByRole('button', { name: 'Изменить порядок файла Шаблон.docx' });
    expect(handle).toBeDisabled();
    expect(screen.getByText('Шаблон.docx').closest('[data-testid="file-row"]')).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps partial reorder inside the reorderable rows', () => {
    const onReorder = vi.fn();
    render(
      <MultipleFileInput
        files={[
          { id: 'template-a', fileName: 'Шаблон A.docx', additionalContent: 'Шаблон', reorderable: true, reorderTooltip: 'Изменить порядок шаблона' },
          { id: 'template-b', fileName: 'Шаблон B.docx', additionalContent: 'Шаблон', reorderable: true, reorderTooltip: 'Изменить порядок шаблона' },
          { id: 'document', fileName: 'Документ.pdf', weight: '2,7 МБ' },
        ]}
        onReorder={onReorder}
      />,
    );

    const handles = screen.getAllByTestId('file-row-reorder-handle');
    expect(handles).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Изменить порядок файла Документ.pdf' })).not.toBeInTheDocument();

    fireEvent.keyDown(handles[0], { key: 'ArrowDown' });
    expect(onReorder).toHaveBeenCalledWith(0, 1);

    onReorder.mockClear();
    fireEvent.keyDown(handles[1], { key: 'ArrowDown' });
    expect(onReorder).not.toHaveBeenCalled();
  });
});
