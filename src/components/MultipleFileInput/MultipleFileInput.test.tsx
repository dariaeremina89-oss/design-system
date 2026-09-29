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
    render(<MultipleFileInput files={files} showDropzone />);
    expect(screen.getByText('Максимальное количество файлов — 10')).toBeInTheDocument();
    expect(screen.getByText('Максимальный общий размер файлов — 50 МБ')).toBeInTheDocument();
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
});
