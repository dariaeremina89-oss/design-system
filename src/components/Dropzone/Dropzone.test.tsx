import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dropzone } from './Dropzone';

describe('Dropzone', () => {
  it('passes selected files to onFiles', () => {
    const onFiles = vi.fn();
    const { container } = render(<Dropzone onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('validates configured requirements even when their text rows are hidden', () => {
    const onFiles = vi.fn();
    const onValidationError = vi.fn();
    const { container } = render(
      <Dropzone
        formats=".pdf"
        maxFileSize="1 Б"
        showFormats={false}
        showMaxFileSize={false}
        onFiles={onFiles}
        onValidationError={onValidationError}
      />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['xx'], 'document.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFiles).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ reason: 'format', fileName: 'document.txt' }),
      expect.objectContaining({ reason: 'file-size', fileName: 'document.txt' }),
    ]));
    expect(screen.getByTestId('dropzone')).toHaveClass('fdoc-dropzone--error');
    expect(screen.getByTestId('dropzone')).toHaveAttribute('aria-invalid', 'true');
  });

  it('includes already added files in quantity and total-size validation', () => {
    const onFiles = vi.fn();
    const onValidationError = vi.fn();
    const { container } = render(
      <Dropzone
        formats=".pdf"
        maxQuantity={2}
        maxFileSize="10 Б"
        maxTotalSize="3 Б"
        currentQuantity={1}
        currentTotalSize="2 Б"
        onFiles={onFiles}
        onValidationError={onValidationError}
      />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const first = new File(['x'], 'one.pdf', { type: 'application/pdf' });
    const second = new File(['x'], 'two.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [first, second] } });

    expect(onFiles).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ reason: 'quantity', limit: 2 }),
      expect.objectContaining({ reason: 'total-size', limit: '3 Б' }),
    ]));
  });

  it('uses Center defaults for both visible requirements and validation', () => {
    const onFiles = vi.fn();
    const onValidationError = vi.fn();
    const { container } = render(<Dropzone align="center" onFiles={onFiles} onValidationError={onValidationError} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const invalid = new File(['x'], 'document.pdf', { type: 'application/pdf' });

    expect(screen.getByText('Допустимые форматы: .docx, xlsx')).toBeInTheDocument();
    expect(screen.getByText('Максимальный размер — 5 МБ')).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [invalid] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ reason: 'format', fileName: 'document.pdf', limit: '.docx, xlsx' }),
    ]));
  });

  it('uses drag-over visual state only for actual file drags', () => {
    render(<Dropzone />);
    const root = screen.getByTestId('dropzone');

    fireEvent.dragOver(root, { dataTransfer: { types: [], files: [] } });
    expect(root).toHaveClass('fdoc-dropzone--default');

    fireEvent.dragOver(root, { dataTransfer: { types: ['Files'], files: [] } });
    expect(root).toHaveClass('fdoc-dropzone--drag-over');
    fireEvent.dragLeave(root);
    expect(root).toHaveClass('fdoc-dropzone--default');
  });

  it('ignores internal reorder drops instead of treating them as file adding', () => {
    const onFiles = vi.fn();
    render(<Dropzone onFiles={onFiles} />);
    const root = screen.getByTestId('dropzone');

    fireEvent.drop(root, { dataTransfer: { types: ['text/plain'], files: [] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(root).toHaveClass('fdoc-dropzone--default');
  });

  it('disables file selection and hides requirements in Disabled', () => {
    const { container } = render(<Dropzone state="disabled" />);
    expect((container.querySelector('input[type="file"]') as HTMLInputElement)).toBeDisabled();
    expect(screen.getByText('Загрузка файлов недоступна')).toBeInTheDocument();
    expect(screen.queryByText(/Допустимые форматы/)).not.toBeInTheDocument();
  });

  it('supports Focused and Error states from Figma', () => {
    const { rerender } = render(<Dropzone state="focused" />);
    expect(screen.getByTestId('dropzone')).toHaveClass('fdoc-dropzone--focused');

    rerender(<Dropzone state="error" />);
    expect(screen.getByText('Вы загружаете недопустимые файлы')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
  });

  it('renders Skeleton for both alignments', () => {
    const { rerender } = render(<Dropzone state="skeleton" />);
    expect(screen.getByTestId('dropzone-skeleton')).toBeInTheDocument();
    rerender(<Dropzone state="skeleton" align="center" />);
    expect(screen.getByTestId('dropzone-skeleton')).toBeInTheDocument();
  });
});
