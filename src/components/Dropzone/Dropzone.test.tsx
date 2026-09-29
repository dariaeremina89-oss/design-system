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
