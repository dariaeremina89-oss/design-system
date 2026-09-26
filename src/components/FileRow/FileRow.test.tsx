import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileRow } from './FileRow';

describe('FileRow', () => {
  it('keeps delete available while loading', () => {
    const onDelete = vi.fn();
    render(<FileRow type="loading" onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл' }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('renders drag control and disabled delete in Disabled', () => {
    render(<FileRow type="disabled" draggable />);
    expect(document.querySelector('[data-icon="drag-dot"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл' })).toBeDisabled();
  });

  it('renders template metadata and edit action', () => {
    const onTemplateEdit = vi.fn();
    const { rerender } = render(<FileRow type="template" fileName="Шаблон договора" />);
    expect(screen.getByText('Шаблон')).toBeInTheDocument();

    rerender(<FileRow type="template-edit" fileName="Шаблон договора" onTemplateEdit={onTemplateEdit} />);
    fireEvent.click(screen.getByText('Заполнить'));
    expect(onTemplateEdit).toHaveBeenCalledOnce();
  });

  it('keeps preview instead of replacing it with an error icon', () => {
    render(<FileRow type="uploaded-preview" error preview={<span data-testid="preview">preview</span>} />);
    expect(screen.getByTestId('preview')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).not.toBeInTheDocument();
  });

  it('renders Skeleton without row content', () => {
    render(<FileRow type="skeleton" />);
    expect(screen.getByTestId('file-row-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('File name.png')).not.toBeInTheDocument();
  });
});
